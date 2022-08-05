import { Injectable, NgZone } from '@angular/core';
import { MeService } from '@plano/shared/api';
import { DataInput } from '@plano/shared/core/data/data-input';
import { PServiceWithCookiesInterface} from '@plano/shared/core/p-cookie.service';
import { PCookieService } from '@plano/shared/core/p-cookie.service';
import { SchedulingApiBirthday } from './shared/api/scheduling-api-birthday.service';
import { SchedulingApiAbsence, SchedulingApiHoliday, SchedulingApiShift, SchedulingApiMember } from './shared/api/scheduling-api.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../shared/core/null-type-utils';
import { FilterServiceInterface } from '../shared/filter.service';

@Injectable()
export class SchedulingFilterService extends DataInput
	implements PServiceWithCookiesInterface, FilterServiceInterface {

	/**
	 * Should all Absences be hidden?
	 */
	public get hideAllAbsences() : boolean { return this._hideAllAbsences!; }

	public set hideAllAbsences(value : boolean | null) {
		this.pCookieService.put({name: 'hideAllAbsences', prefix: null}, value);
		this._hideAllAbsences = value;
		this.changed('hideAllAbsences');
	}

	/**
	 * Should all Holidays be hidden?
	 */
	public get hideAllHolidays() : boolean { return this._hideAllHolidays!; }

	public set hideAllHolidays(value : boolean | null) {
		this.pCookieService.put({name: 'hideAllHolidays', prefix: null}, value);
		this._hideAllHolidays = value;
		this.changed('hideAllHolidays');
	}

	/**
	 * Should all Holidays be hidden?
	 */
	public get hideAllBirthdays() : boolean { return this._hideAllBirthdays!; }

	public set hideAllBirthdays(value : boolean | null) {
		this.pCookieService.put({name: 'hideAllBirthdays', prefix: null}, value);
		this._hideAllBirthdays = value;
		this.changed('hideAllBirthdays');
	}

	/**
	 * Should all Shifts be hidden?
	 */
	public get hideAllShifts() : boolean { return this._hideAllShifts!; }

	public set hideAllShifts(value : boolean | null) {
		this.pCookieService.put({name: 'hideAllShifts', prefix: null}, value);
		this._hideAllShifts = value;
		if (
			this.hideAllShiftsFromOthers !== value && (value || this.hideAllShiftsFromMe !== value) ||
			this.hideAllShiftsFromMe !== value && (value || this.hideAllShiftsFromOthers !== value)
		) {
			this.hideAllShiftsFromOthers = value;
			this.hideAllShiftsFromMe = value;
		}

		this.changed('hideAllShifts');
	}

	/**
	 * Should all Shifts from others be hidden?
	 */
	public get hideAllShiftsFromOthers() : boolean { return this._hideAllShiftsFromOthers!; }

	public set hideAllShiftsFromOthers(value : boolean | null) {
		this.pCookieService.put({name: 'hideAllShiftsFromOthers', prefix: null}, value);
		this._hideAllShiftsFromOthers = value;
		if (this.hideAllShifts !== value && (!value || this.hideAllShiftsFromMe === value)) this.hideAllShifts = value;
		this.changed('hideAllShiftsFromOthers');
	}

	/**
	 * Should all Shifts from me be hidden?
	 */
	public get hideAllShiftsFromMe() : boolean { return this._hideAllShiftsFromMe!; }

	public set hideAllShiftsFromMe(value : boolean | null) {
		this.pCookieService.put({name: 'hideAllShiftsFromMe', prefix: null}, value);
		this._hideAllShiftsFromMe = value;
		if (this.hideAllShifts !== value && (!value || this.hideAllShiftsFromOthers === value)) this.hideAllShifts = value;
		this.changed('hideAllShiftsFromMe');
	}

	/**
	 * Should shifts with unassigned slots be visible or not?
	 */
	public showItemsWithEmptyMemberSlot : boolean | null = null;

	private _hideAllAbsences : boolean | null = false;
	private _hideAllHolidays : boolean | null = false;
	private _hideAllBirthdays : boolean | null = false;
	private _hideAllShifts : boolean | null = false;
	private _hideAllShiftsFromOthers : boolean | null = false;
	private _hideAllShiftsFromMe : boolean | null = false;

	constructor(
		private meService : MeService,
		private pCookieService : PCookieService,
		protected override zone : NgZone,
	) {
		super(zone);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isSetToShowAll() : boolean {
		if (!this.showItemsWithEmptyMemberSlot) return false;
		if (this.hideAllAbsences) return false;
		if (this.hideAllHolidays) return false;
		if (this.hideAllBirthdays) return false;
		if (this.hideAllShifts) return false;
		if (this.hideAllShiftsFromOthers) return false;
		if (this.hideAllShiftsFromMe) return false;
		return true;
	}

	/**
	 * Checks if given shiftModel, member, option, members or shiftModels is visible.
	 */
	public isVisible(
		input :
		// SchedulingApiShiftModel |
		SchedulingApiMember |
		// SchedulingApiMembers |
		// SchedulingApiShiftModels |
		SchedulingApiShift |
		SchedulingApiAbsence |
		// SchedulingApiAbsences |
		SchedulingApiHoliday |
		SchedulingApiBirthday,
		// SchedulingApiBooking |
		// SchedulingApiWorkingTime |
		// SchedulingApiTodaysShiftDescription,
	) : boolean {
		assumeDefinedToGetStrictNullChecksRunning(input, 'input');
		if (input instanceof SchedulingApiShift) {
			return this.isVisibleShift(input);
		}
		// if (input instanceof SchedulingApiShiftModel) {
		// 	return this.isVisibleShiftModel(input);
		// }
		// if (input instanceof SchedulingApiShiftModels) {
		// 	return this.isVisibleShiftModels(input);
		// }
		if (input instanceof SchedulingApiMember) {
			return this.isVisibleBirthday(/* input*/);
		}
		// if (input instanceof SchedulingApiMembers) {
		// 	return this.isVisibleMembers(input);
		// }
		if (input instanceof SchedulingApiAbsence) {
			return this.isVisibleAbsence();
		}
		// if (input instanceof SchedulingApiAbsences) {
		// 	return this.isVisibleAbsences(input);
		// }
		if (input instanceof SchedulingApiHoliday) {
			return this.isVisibleHoliday(/* input*/);
		}
		if (input instanceof SchedulingApiBirthday) {
			return this.isVisibleBirthday(/* input*/);
		}
		// if (input instanceof SchedulingApiBooking) {
		// 	return this.isVisibleBooking(input);
		// }
		// if (input instanceof SchedulingApiWorkingTime) {
		// 	return this.isVisibleWorkingTime(input);
		// }
		// if (input instanceof SchedulingApiTodaysShiftDescription) {
		// 	return this.isVisibleTodaysShiftDescription(input);
		// }
		throw new Error('unexpected instance of input');
	}

	/**
	 * Check if this shift is visible
	 */
	private isVisibleShift(shift : SchedulingApiShift) : boolean {
		// don’t show this shift if all shifts should be hidden
		if (this.hideAllShifts) return false;

		// don’t show this shift if me is not assigned but user has set "hideAllShiftsFromOthers"
		if (this.hideAllShiftsFromOthers && !shift.emptyMemberSlots) {
			if (!this.meService.isLoaded()) throw new Error('me must be loaded if hideAllShiftsFromOthers mode is enabled');
			const relatesToMe = shift.assignedMemberIds.contains(this.meService.data.id);
			if (!relatesToMe) return false;
		}

		// don’t show this shift if its assigned to me and no other person
		if (this.hideAllShiftsFromMe) {
			const ids = shift.assignedMemberIds;
			if (ids.length === 1 && ids.contains(this.meService.data.id) && !shift.emptyMemberSlots) return false;
		}

		// If shifts with empty slots should be hidden AND shift has empty slots -> hide
		if (!this.showItemsWithEmptyMemberSlot && shift.emptyMemberSlots) return false;

		return true;
	}

	/**
	 * Check if this absence is visible
	 */
	private isVisibleAbsence() : boolean {
		return !this.hideAllAbsences;
	}

	/**
	 * Check if this holiday is visible
	 */
	private isVisibleHoliday() : boolean {
		return !this.hideAllHolidays;
	}

	/**
	 * Check if this birthday is visible
	 */
	private isVisibleBirthday() : boolean {
		return !this.hideAllBirthdays;
	}

	/**
	 * Init all necessary values for this class
	 */
	public initValues() : void {
		if (this._hideAllAbsences === null) this.hideAllAbsences = false;
		if (this._hideAllHolidays === null) this.hideAllHolidays = false;
		if (this._hideAllBirthdays === null) this.hideAllBirthdays = false;
		if (this._hideAllShifts === null) this.hideAllShifts = false;
		if (this._hideAllShiftsFromOthers === null) this.hideAllShiftsFromOthers = false;
		if (this._hideAllShiftsFromMe === null) this.hideAllShiftsFromMe = false;
		if (this.showItemsWithEmptyMemberSlot === null) this.showItemsWithEmptyMemberSlot = true;

		this.changed(null);
	}

	/** @see PServiceInterface['unload'] */
	public unload() : void {
		this.unloadFilters();
	}

	/**
	 * Reset all filters to default
	 */
	public unloadFilters() : void {
		this._hideAllAbsences = null;
		this._hideAllHolidays = null;
		this._hideAllBirthdays = null;
		this._hideAllShifts = null;
		this._hideAllShiftsFromOthers = null;
		this._hideAllShiftsFromMe = null;
		this.showItemsWithEmptyMemberSlot = null;
	}

	/**
	 * Read values from cookies if available
	 */
	public readCookies() : void {
		const hideAllAbsencesCookie = this.pCookieService.get({name: 'hideAllAbsences', prefix: null});
		if (hideAllAbsencesCookie !== undefined) {
			this.hideAllAbsences = hideAllAbsencesCookie === 'true';
		}
		const hideAllHolidaysCookie = this.pCookieService.get({name: 'hideAllHolidays', prefix: null});
		if (hideAllHolidaysCookie !== undefined) {
			this.hideAllHolidays = hideAllHolidaysCookie === 'true';
		}
		const hideAllBirthdaysCookie = this.pCookieService.get({name: 'hideAllBirthdays', prefix: null});
		if (hideAllBirthdaysCookie !== undefined) {
			this.hideAllBirthdays = hideAllBirthdaysCookie === 'true';
		}
		const hideAllShiftsCookie = this.pCookieService.get({name: 'hideAllShifts', prefix: null});
		if (hideAllShiftsCookie !== undefined) {
			this.hideAllShifts = hideAllShiftsCookie === 'true';
		}
		const hideAllShiftsFromOthersCookie = this.pCookieService.get({name: 'hideAllShiftsFromOthers', prefix: null});
		if (hideAllShiftsFromOthersCookie !== undefined) {
			this.hideAllShiftsFromOthers = hideAllShiftsFromOthersCookie === 'true';
		}
		const hideAllShiftsFromMeCookie = this.pCookieService.get({name: 'hideAllShiftsFromMe', prefix: null});
		if (hideAllShiftsFromMeCookie !== undefined) {
			this.hideAllShiftsFromMe = hideAllShiftsFromMeCookie === 'true';
		}
	}
}
