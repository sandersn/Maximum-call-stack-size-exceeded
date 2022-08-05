import { BirthdayService } from './birthday.service';
import { SchedulingApiMember, SchedulingApiService } from './scheduling-api.service';
import { ApiListWrapper } from '../../../../shared/api';
import { Id } from '../../../../shared/api/base/id';
import { Assertions } from '../../../../shared/core/assertions';
import { Config } from '../../../../shared/core/config';
import { PMomentService } from '../../../shared/p-moment.service';

export class SchedulingApiBirthday {
	public isHovered : boolean = false;

	constructor(
	) {
	}

	public day ! : 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31;

	public month ! : 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

	public firstName ! : SchedulingApiMember['firstName'];
	public lastName ! : SchedulingApiMember['lastName'];
	public memberId ! : SchedulingApiMember['id'];

	/**
	 * @see SchedulingApiMember['id']
	 */
	public get id() : Id | null {
		return this.memberId;
	}

	/**
	 * @see SchedulingApiHoliday['time']
	 */
	public get time() : { start : number, end : number } {
		const birthdayDay = this.day;
		const birthdayMonth = this.month;
		const birthday = new PMomentService(Config.LOCALE_ID).m().startOf('day').set('month', birthdayMonth).set('date', birthdayDay);
		const start = +birthday;
		const end = +birthday.add(1, 'day');
		return {
			start: start,
			end: end,
		};
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public startBasedOnCalendarRequest(calendarRequestStart : number, pMomentService : PMomentService) : number {
		const lastRequestedDate = calendarRequestStart;
		const lastRequestedMoment = pMomentService.m(lastRequestedDate);
		if (this.month < 7 && +lastRequestedMoment.get('month') >= 7) lastRequestedMoment.add(1, 'year').startOf('day');
		return +lastRequestedMoment.set('month', this.month).set('date', this.day);
	}

}

export class SchedulingApiBirthdays extends ApiListWrapper<SchedulingApiBirthday> {
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	protected containsPrimitives() : boolean {
		return false;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	protected createInstance(removeDestroyedItems : boolean) : ApiListWrapper<SchedulingApiBirthday> {
		return new SchedulingApiBirthdays(this.birthdayService, this.api, removeDestroyedItems);
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	protected containsIds() : boolean {
		return false;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	protected get dni() : string {
		throw new Error('Method not implemented.');
	}

	constructor(
		public birthdayService : BirthdayService | null,
		public override api : SchedulingApiService | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/** @see ApiListWrapper['push'] */
	public override push(birthday : SchedulingApiBirthday) : void {
		super.push(birthday);
		this.birthdayService?.changed(null);
	}

	/**
	 * get birthdays of day
	 * This includes all birthdays happen at the provided day.
	 * @param day - timestamp of the desired day
	 */
	public getByDay(dayStart : number) : SchedulingApiBirthdays {
		Assertions.ensureIsDayStart(dayStart);

		const moment = new PMomentService(Config.LOCALE_ID).m(dayStart);
		return this.filterBy(item => {
			const month = moment.get('month');
			const date = moment.get('date');
			if (item.month !== month) return false;
			if (item.day !== date) return false;
			return true;
		});
	}

	/**
	 * Filters a list of Shifts by a function that returns a boolean.
	 * Returns a new list of Shifts.
	 */
	public filterBy( fn : (item : SchedulingApiBirthday) => boolean ) : SchedulingApiBirthdays {
		const result = new SchedulingApiBirthdays(this.birthdayService, this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}

}
