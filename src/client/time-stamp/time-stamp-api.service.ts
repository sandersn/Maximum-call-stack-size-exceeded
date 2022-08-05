import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { WarningsService } from '@plano/client/shared/warnings.service';
import { TimeStampApiShiftBase } from '@plano/shared/api';
import { TimeStampApiShiftsBase } from '@plano/shared/api';
import { TimeStampApiShiftModelBase } from '@plano/shared/api';
import { TimeStampApiShiftModelsBase } from '@plano/shared/api';
import { TimeStampApiStampedMemberBase } from '@plano/shared/api';
import { TimeStampApiRootBase } from '@plano/shared/api';
import { TimeStampApiServiceBase } from '@plano/shared/api';
import { TimeStampApiAllowedTimeStampDeviceBase } from '@plano/shared/api';
import { TimeStampApiAllowedTimeStampDevicesBase } from '@plano/shared/api';
import { FaIcon } from '@plano/shared/core/component/fa-icon/fa-icon-types';
import { Config } from '@plano/shared/core/config';
import { Data } from '@plano/shared/core/data/data';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '@plano/shared/core/null-type-utils';
import { PCookieService } from '@plano/shared/core/p-cookie.service';
import { ApiErrorService } from '../../shared/api/api-error.service';
import { PlanoFaIconPool } from '../../shared/core/plano-fa-icon-pool.enum';

@Injectable({
	providedIn: 'root',
})
export class TimeStampApiService<ValidationMode extends 'draft' | 'validated' = 'validated'> extends TimeStampApiServiceBase<ValidationMode> {
	constructor(
		public override http : HttpClient,
		public override router : Router,
		public override apiError : ApiErrorService,
		private warnings : WarningsService,
		private pCookieService : PCookieService,
		public override zone : NgZone,
		injector : Injector,
	) {
		super(http, router, apiError, zone, injector);
	}

	/**
	 * Returns true if member started shift, and is not pausing.
	 * if you just want to check if shift is started, use !!api.data.start
	 */
	public get isWorking() : boolean {
		return !this.isPausing &&
			!!this.data.start &&
			!this.isDone;
	}

	/**
	 * Returns true if member started a pause and has not finished it yet
	 */
	public get isPausing() : boolean {
		return !!this.data.uncompletedRegularPauseStart;
	}

	/**
	 * Shift has an end-time
	 */
	private get isDone() : boolean {
		return !!this.data.end;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public startPause() : void {
		const now = +(new PMomentService(Config.LOCALE_ID).m());

		this.data.uncompletedRegularPauseStart = now;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public completePause(duration ?: number) : void {
		const pauseDuration = duration !== undefined ? duration : this.data.regularPauseDuration;
		this.data.completedRegularPausesDuration = pauseDuration;
		this.data.uncompletedRegularPauseStart = null;
	}

	/**
	 * Is time-stamp for this member running?
	 */
	public timeStampIsRunning() : boolean {
		return !!this.data.start &&
			!this.isDone;
	}

	/**
	 * @see WarningsService['getWarningMessages']
	 */
	public get warningMessages() : ReturnType<WarningsService['getWarningMessages']> {
		return this.warnings.getWarningMessages(this.data);
	}

	/**
	 * Is there any warning message?
	 */
	public get hasWarningMessages() : boolean {
		return this.data.warnUnplannedWork ||
			this.data.warnStampedNotCurrentTime ||
			this.data.warnStampedNotShiftTime;
	}

	/**
	 * Start time-stamp for given shift or shiftmodel and set given timestamp as start.
	 */
	public startTimeStamp(
		timestamp : number,
		item : TimeStampApiShift | TimeStampApiShiftModel,
	) : void {
		if (item instanceof TimeStampApiShift) {
			this.data.selectedShiftId = item.id;
		} else {
			this.data.selectedShiftModelId = item.id;
		}
		// eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
		this.data.start = timestamp ? timestamp : 0;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public stopTimeStamp(timestamp : number) : void {
		// eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
		this.data.end = timestamp ? timestamp : 0;
	}

}

class SDuration {
	// Time in Milliseconds
	constructor(a : number, b : number = 0) {
		// a == startTime and b == endTime in milliseconds?
		let startTime = a;
		let endTime = b;

		if (endTime < startTime) {
			const temp = startTime;
			startTime = endTime;
			endTime = temp;
		}

		const END = +(new PMomentService(Config.LOCALE_ID).m(endTime));
		const START = +(new PMomentService(Config.LOCALE_ID).m(startTime));
		this.duration = END - START;
	}

	public duration : number;
}

export class TimeStampApiRoot<ValidationMode extends 'draft' | 'validated' = 'validated'> extends TimeStampApiRootBase<ValidationMode> {
	constructor( api : TimeStampApiServiceBase<ValidationMode> | null ) {
		super(api);
	}

	/**
	 * There is a problem with the binding to a textarea. This must be empty string or
	 * filled string but not Null.
	 */
	public override get comment() : string {
		const result = super.comment;
		// eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
		return result ? result : '';
	}

	public override set comment(newValue : string | null) {
		super.comment = newValue;
	}

	/**
	 * Get selected Item no matter if its shift or shiftmodel.
	 * This is a shortcut. The BaseApi only holds Id's of shift or shiftModel, and
	 * not the shift or shiftmodel itself.
	 */
	public get selectedItem() : TimeStampApiShift<ValidationMode> | TimeStampApiShiftModel<ValidationMode> | null {
		const shift = this.selectedShift;
		const shiftModel = this.selectedShiftModel;
		return shift ?? shiftModel;
	}

	private cutMillisecondsFromDuration(duration : number) : number {
		// TODO: [PLANO-111111] Duplicate
		const pMoment = new PMomentService(undefined);
		const momentDuration = pMoment.duration(duration);
		const milliseconds : number = momentDuration.milliseconds();
		return momentDuration.subtract(milliseconds).asMilliseconds();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get regularPauseDuration() : number {
		// return sum of completed pauses and running pause
		let uncompletedPauseDuration;

		if (this.uncompletedRegularPauseStart === null) {
			uncompletedPauseDuration = new SDuration(0).duration;
		} else {
			assumeDefinedToGetStrictNullChecksRunning(this.uncompletedRegularPauseStart, 'uncompletedRegularPauseStart');
			const start = this.cutMillisecondsFromDuration(this.uncompletedRegularPauseStart);
			const end = this.cutMillisecondsFromDuration(+(new PMomentService(Config.LOCALE_ID).m()));

			uncompletedPauseDuration = new SDuration(start, end).duration;
		}

		return this.completedRegularPausesDuration + uncompletedPauseDuration;
	}

	/**
	 * This represents the duration of the stamped time excluding pauses.
	 */
	public get workingTimeDuration() : number {
		// time stamp has not started yet?
		if (this.start === null)
			return new SDuration(0).duration;
		// working time is duration from time-stamp start to now minus pause duration

		// eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
		let currentWorkingTimeEnd = this.end ? this.end : (+(new PMomentService(Config.LOCALE_ID).m()));
		currentWorkingTimeEnd = this.cutMillisecondsFromDuration(currentWorkingTimeEnd);
		assumeDefinedToGetStrictNullChecksRunning(this.start, 'start');
		const start = this.cutMillisecondsFromDuration(this.start);

		const workingTimeDuration = new SDuration(start, currentWorkingTimeEnd).duration;
		return workingTimeDuration - this.regularPauseDuration;
	}

	/**
	 * Get selected shift.
	 * This is a shortcut. The BaseApi only holds Id the shift, and
	 * not the shift itself.
	 */
	private get selectedShift() : TimeStampApiShift<ValidationMode> | null {
		const id = this.selectedShiftId;
		if (id === null) return null;
		return this.shifts.get(id);
	}

	/**
	 * Get selected shiftModel.
	 * This is a shortcut. The BaseApi only holds Id the shiftModel, and
	 * not the shiftmodel itself.
	 */
	private get selectedShiftModel() : TimeStampApiShiftModel<ValidationMode> | null {

		if (this.selectedShiftModelId !== null) {
			if (!this.api) throw new Error('Api must be defined here');
			const shiftModel = this.api.data.shiftModels.get(this.selectedShiftModelId);
			if (shiftModel) {
				return shiftModel;
			}
		}
		return null;
	}
}

export class TimeStampApiStampedMember<ValidationMode extends 'draft' | 'validated' = 'validated'> extends TimeStampApiStampedMemberBase<ValidationMode> {
	constructor(
		api : TimeStampApiServiceBase<ValidationMode> | null,
	) {
		super(api);
	}

	private cutMillisecondsFromDuration(duration : number) : number {
		// TODO: [PLANO-111111] Duplicate
		const pMoment = new PMomentService(undefined);
		const momentDuration = pMoment.duration(duration);
		const milliseconds : number = momentDuration.milliseconds();
		return momentDuration.subtract(milliseconds).asMilliseconds();
	}

	/**
	 * Difference between now and start of stamped time.
	 * This represents the duration of the stamped time including pauses.
	 */
	public get activityDuration() : number {
		const start : number = this.cutMillisecondsFromDuration(this.activityStart);
		const now : number = this.cutMillisecondsFromDuration(+(new PMomentService(Config.LOCALE_ID).m()));
		return now - start;
	}


}

export class TimeStampApiShift<ValidationMode extends 'draft' | 'validated' = 'validated'> extends TimeStampApiShiftBase<ValidationMode> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor( api : TimeStampApiServiceBase<ValidationMode> | null, idRaw : any = 0 ) {
		super(api, idRaw);
	}

	public selected : boolean = false;

	/**
	 * shorthand that returns the related model
	 */
	public get model() : TimeStampApiShiftModel<ValidationMode> {
		// NOTE: This methods exists on multiple classes:
		// TimeStampApiShift
		// SchedulingApiShift
		// SchedulingApiBooking
		// SchedulingApiTodaysShiftDescription
		const SHIFT_MODEL = this.api!.data.shiftModels.get(this.modelId);
		assumeNonNull(SHIFT_MODEL, 'SHIFT_MODEL');

		return SHIFT_MODEL;
	}

	/**
	 * Get the name based on the linked shiftModel
	 */
	public get name() : TimeStampApiShiftModel['name'] {
		// NOTE: This methods exists on multiple classes:
		// SchedulingApiRoot
		// TimeStampApiRoot
		return this.model.name;
	}
}

export class TimeStampApiShifts<ValidationMode extends 'draft' | 'validated' = 'validated'> extends TimeStampApiShiftsBase<ValidationMode> {

	constructor(
		api : TimeStampApiServiceBase<ValidationMode> | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get selected() : TimeStampApiShifts<ValidationMode> {
		const result = new TimeStampApiShifts(this.api, false);
		for (const shift of this.iterable()) {
			if (shift.selected) {
				result.push(shift);
			}
		}
		return result;
	}

}

export class TimeStampApiShiftModel<ValidationMode extends 'draft' | 'validated' = 'validated'> extends TimeStampApiShiftModelBase<ValidationMode> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor( api : TimeStampApiServiceBase<ValidationMode> | null, idRaw : any = 0 ) {
		super(api, idRaw);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public fitsSearch(term : string | null) : boolean {
		if (term === null) return true;
		if (term === '') return true;
		for (const termItem of term.split(' ')) {
			const termLow = termItem.toLowerCase();
			const nameLow = this.name.toLowerCase();
			const parentNameLow = this.parentName.toLowerCase();
			if (nameLow.includes(termLow)) continue;
			if (parentNameLow.includes(termLow)) continue;
			return false;
		}
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public equals(shiftModel : TimeStampApiShiftModel) : boolean {
		// NOTE: duplicate! This methods exists on multiple classes:
		// SchedulingApiRoot
		// TimeStampApiRoot
		return this.id.equals(shiftModel.id);
	}

}


export class TimeStampApiShiftModels<ValidationMode extends 'draft' | 'validated' = 'validated'> extends TimeStampApiShiftModelsBase<ValidationMode> {
	constructor(
		api : TimeStampApiServiceBase<ValidationMode> | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public search(input : Parameters<TimeStampApiShiftModel['fitsSearch']>[0]) : TimeStampApiShiftModels<ValidationMode> {
		if (input === '') return this;
		return this.filterBy(item => item.fitsSearch(input));
	}

	private _groupByParentName = new Data<TimeStampApiShiftModels[]>(this.api);

	/**
	 * @returns Returns a list of lists where each inner list contains the shift-models with the same parent name.
	 * Note: Iterating maps in ng templates seems not be supported. So, instead this list of list structure was used.
	 */
	public get groupByParentName() : TimeStampApiShiftModels[] {

		/**
		 * NOTE: groupByParentName() exists two times!
		 * 1: in TimeStampApiShiftModels
		 * 1: in SchedulingApiShiftModels
		 */
		return this._groupByParentName.get(() => {
			// calculate value of groupedByParentName
			const groupedList : TimeStampApiShiftModels[] = [];
			const getListForParentName = (parentName : string) : TimeStampApiShiftModels => {
				let result : TimeStampApiShiftModels | undefined = undefined;
				for (const list of groupedList) {
					// Does a list already exist for this parent name?
					const firstItem = list.get(0);
					if (!firstItem) throw new Error('Could not get first item');
					if (parentName === firstItem.parentName) {
						result = list;
						break;
					}
				}
				// Create new list if not already exist for this parent name.
				if (!result) {
					result = new TimeStampApiShiftModels(this.api, false);
					groupedList.push(result);
				}
				return result;
			};

			for ( const shiftModel of this.iterable() ) {
				const parentName = shiftModel.parentName;

				// Does a list already exist for this parent name?
				const listForThisParentName = getListForParentName(parentName);

				// Add shift model to list
				listForThisParentName.push(shiftModel);
			}

			// sort outer list
			groupedList.sort((a : TimeStampApiShiftModels, b : TimeStampApiShiftModels) : number => {
				const firstItemA = a.get(0);
				if (firstItemA === null) throw new Error('Could not get first item of a');
				const firstItemB = b.get(0);
				if (firstItemB === null) throw new Error('Could not get first item of b');
				return firstItemA.parentName.localeCompare(firstItemB.parentName);
			});

			return groupedList;
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get trashedItemsAmount() : number {
		let result = 0;
		for (const shiftModel of this.iterable()) {
			if (shiftModel.trashed) {
				result += 1;
			}
		}
		return result;
	}

	/**
	 * Check if there is at least one untrashed item
	 */
	public get hasUntrashedItem() : boolean {
		return !!this.findBy(item => !item.trashed);
	}

	/**
	 * Filters a list of ShiftModels by a function that returns a boolean.
	 * Returns a new list of ShiftModels.
	 */
	public filterBy( fn : (item : TimeStampApiShiftModel<ValidationMode>) => boolean ) : TimeStampApiShiftModels<ValidationMode> {
		const result = new TimeStampApiShiftModels(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}
}

export class TimeStampApiAllowedTimeStampDevice<ValidationMode extends 'draft' | 'validated' = 'validated'> extends TimeStampApiAllowedTimeStampDeviceBase<ValidationMode> {
	constructor(
		api : TimeStampApiServiceBase<ValidationMode> | null,
	) {
		super(api);
	}

	/**
	 * Get an icon name for <fa-icon>
	 */
	public get iconName() : FaIcon {
		// Return browserName if the string equals a fontawesome icon name
		switch (this.browserName) {
			case 'ie':
				return PlanoFaIconPool.BRAND_INTERNET_EXPLORER;
			case 'chrome':
			case 'safari':
			case 'firefox':
			case 'opera':
			case 'internet-explorer':
			case 'edge':
				return ['fab', this.browserName];
			case 'appAndroid':
				return PlanoFaIconPool.BRAND_ANDROID;
			case 'appIOS':
				return PlanoFaIconPool.BRAND_APPLE;
			default:
				return PlanoFaIconPool.INTERNET;
		}
	}
}

export class TimeStampApiAllowedTimeStampDevices<ValidationMode extends 'draft' | 'validated' = 'validated'> extends TimeStampApiAllowedTimeStampDevicesBase<ValidationMode> {
	constructor(
		api : TimeStampApiServiceBase<ValidationMode> | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/**
	 * @returns Returns if this device matches the given api "allowedDevice". `undefined` is returned when
	 * visitor-id is not determined yet so this cannot be answered.
	 */
	public matchesDeviceItem(allowedDevice : TimeStampApiAllowedTimeStampDevice<ValidationMode>) : boolean | null {
		assumeNonNull(this.api);

		const visitorId = this.api.fingerprintService.visitorId;

		if (visitorId === undefined)
			return null;

		return visitorId === allowedDevice.visitorId;
	}

	/**
	 * @returns Returns the matching allowedTimeStampDevice item from the api list. If none exists `null` is returned.
	 * `undefined` is returned if visitor-id is not determined yet so this cannot be answered.
	 */
	private getMatchingDeviceItem() : TimeStampApiAllowedTimeStampDevice<ValidationMode> | null | undefined {
		assumeNonNull(this.api);

		if (this.api.fingerprintService.visitorId === undefined)
			return undefined;

		for (const allowedDevice of this.iterable()) {
			if (this.matchesDeviceItem(allowedDevice))
				return allowedDevice;
		}

		return null;
	}

	/**
	 * @returns Is this device allowed to time-stamp? `undefined` is returned if this cannot be determined yet.
	 */
	public isDeviceAllowedToTimeStamp() : boolean | undefined {
		// all devices allowed?
		if (this.length === 0)
			return true;

		// Otherwise check if this device matches any of the allowed devices.
		const matchingDeviceItem = this.getMatchingDeviceItem();

		if (matchingDeviceItem === undefined) return undefined;
		return !!matchingDeviceItem;
	}

	private get allowedDeviceBrowserName() : string | null {
		return Config.platform === 'browser' ? 	Config.browser.name	:
			Config.platform;
	}

	/**
	 * Allow this device to time-stamp. Note that this method itself calls `api.save()`.
	 */
	public allowDeviceToTimeStamp(name : string) : void {
		assumeNonNull(this.api);

		this.api.fingerprintService.getVisitorIdPromise().then(() => {
			assumeNonNull(this.api);

			// Remove old item if one exists
			const oldItem = this.getMatchingDeviceItem();

			if (oldItem)
				this.removeItem(oldItem);

			// create new item
			const newItem = this.createNewItem();
			newItem.name = name;
			newItem.visitorId = this.api.fingerprintService.visitorId!;
			newItem.browserName = this.allowedDeviceBrowserName ?? '-';

			this.api.save();
		});
	}
}
