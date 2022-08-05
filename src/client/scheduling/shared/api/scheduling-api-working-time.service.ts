import { PMomentService } from '@plano/client/shared/p-moment.service';
import { WarningsService } from '@plano/client/shared/warnings.service';
import { SchedulingApiServiceBase } from '@plano/shared/api';
import { SchedulingApiWorkingTimeBase } from '@plano/shared/api';
import { SchedulingApiWorkingTimesBase } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { SchedulingApiMember } from './scheduling-api.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';

export class SchedulingApiWorkingTime<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiWorkingTimeBase<ValidationMode> {
	private warnings : WarningsService = new WarningsService();

	constructor(
		public override api : SchedulingApiServiceBase<ValidationMode> | null,
	) {
		super(api);
		// this.warnUnplannedWork
	}

	/**
	 * does the item overlap with interval?
	 */
	public overlaps(min : number, max : number) : boolean {
		const intervalIsBefore = max <= this.time.start;
		const intervalIsAfter = min >= this.time.end;
		return !intervalIsBefore && !intervalIsAfter;
	}

	/**
	 * Payroll duration
	 */
	public get duration() : number {
		this.assumeIsValidated();

		const totalDuration = this.time.end - this.time.start;
		let result : number;
		if (totalDuration > this.regularPauseDuration) {
			result = totalDuration - this.regularPauseDuration;
		} else {
			result = 0;
		}
		return result;

	}

	/**
	 * Partial payroll duration for workingTime
	 */
	public durationBetween(min ?: number, max ?: number) : number {
		const START = (min && min > this.time.start) ? min : this.time.start;
		const END = (max && max < this.time.end) ? max : this.time.end;
		const duration = END - START;
		if (duration < 0) return 0;

		if (duration > this.regularPauseDuration) {
			if (min && min > this.time.start) {
				return duration;
			}
			return duration - this.regularPauseDuration;
		}
		return 0;
	}

	/**
	 * Get calculated total payroll duration in hours as float
	 */
	private get totalDurationInHours() : number {
		const pMoment = new PMomentService(undefined);
		return pMoment.duration(this.duration).asHours();
	}

	/**
	 * Get calculated total earnings of a workingTime entry
	 */
	public get totalEarnings() : number {
		return this.hourlyEarnings * this.totalDurationInHours;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isExpectedWorkingTime() : boolean {
		// For expected working-times the id is an array containing the shift-selector and the member-id.
		return Array.isArray(this.id.rawData);
	}

	/**
	 * Get calculated total earnings of a workingTime entry between two timestamps
	 */
	public totalEarningsBetween(min ?: number, max ?: number) : number {
		const pMoment = new PMomentService(undefined);
		const partialDuration = this.durationBetween(min, max);
		return this.hourlyEarnings * pMoment.duration(partialDuration).asHours();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get member() : SchedulingApiMember | null {
		assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
		return this.api.data.members.get(this.memberId);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get warningAmount() : number {
		let result : number = 0;
		if (this.warnUnplannedWork) {
			result += 1;
		}
		if (this.warnStampedNotShiftTime) {
			result += 1;
		}
		if (this.warnStampedNotCurrentTime) {
			result += 1;
		}
		return result;
	}

	/**
	 * @see WarningsService['getWarningMessages']
	 */
	public get warningMessages() : ReturnType<WarningsService['getWarningMessages']> | null {
		const result = this.warnings.getWarningMessages(this);
		if (result.length === 0) return null;
		return result;
	}
}

export class SchedulingApiWorkingTimes<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiWorkingTimesBase<ValidationMode> {
	constructor(
		api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/**
	 * Filters a list of Shifts by a function that returns a boolean.
	 * Returns a new list of Shifts.
	 */
	public filterBy( fn : (item : SchedulingApiWorkingTime) => boolean ) : SchedulingApiWorkingTimes {
		const result = new SchedulingApiWorkingTimes(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}

	/**
	 * get workingTimes between two timestamps
	 * @param start - Start date in milliseconds
	 * @param end - End date in milliseconds
	 */
	public between(min : number, max : number) : SchedulingApiWorkingTimes {
		const result : SchedulingApiWorkingTimes = new SchedulingApiWorkingTimes(this.api, false);
		for (const workingTime of this.iterable()) {
			const isInCurrentView = min <= workingTime.time.start && max > workingTime.time.start;
			if (isInCurrentView) {
				result.push(workingTime);
			}
		}
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get memberIds() : Id[] {
		const result : Id[] = [];
		for (const workingTime of this.iterable()) {
			const searchedItem = result.find(item => item.equals(workingTime.memberId));
			if (!searchedItem) {
				result.push(workingTime.memberId);
			}
		}
		return result;
	}

	/**
	 * Get item by Member in a new ListWrapper
	 */
	public getByMember( member : SchedulingApiMember ) : SchedulingApiWorkingTimes {
		return this.filterBy(item => {
			if (item.isNewItem()) return false;
			if (!item.memberId.equals(member.id)) return false;
			return true;
		});
	}

	/**
	 * Sum of payroll durations
	 */
	public get duration() : number {
		let result : number = 0;
		for (const workingTime of this.iterable()) {
			result += workingTime.duration;
		}
		return result;
	}

	/**
	 * Sum of partial payroll durations
	 */
	public durationBetween(min ?: number, max ?: number) : number {
		let result : number = 0;
		for (const workingTime of this.iterable()) {
			result += workingTime.durationBetween(min, max);
		}
		return result;
	}

	/**
	 * Sum of regular pause durations
	 */
	public get regularPauseDuration() : number {
		let result : number = 0;
		for (const workingTime of this.iterable()) {
			result += workingTime.regularPauseDuration;
		}
		return result;
	}

	/**
	 * Sum of automatic pause durations
	 */
	public get automaticPauseDuration() : number {
		let result : number = 0;
		for (const workingTime of this.iterable()) {
			result += workingTime.automaticPauseDuration;
		}
		return result;
	}

	/**
	 * Get sum of total earnings of all contained workingTimes
	 */
	public get totalEarnings() : number {
		let result : number = 0;
		for (const workingTime of this.iterable()) {
			result += workingTime.totalEarnings;
		}
		return result;
	}

	/**
	 * Get sum of partial earnings of all contained workingTimes
	 */
	public totalEarningsBetween(min ?: number, max ?: number) : number {
		let result : number = 0;
		for (const workingTime of this.iterable()) {
			result += workingTime.totalEarningsBetween(min, max);
		}
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get warningAmount() : number {
		let result : number = 0;
		for (const workingTime of this.iterable()) {
			result += workingTime.warningAmount;
		}
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get commentAmount() : number {
		return this.filterBy(item => !item.isNewItem() && !!item.comment && !!item.comment.length).length;
	}
}
