var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Injectable, NgZone } from '@angular/core';
import { MeService } from '@plano/shared/api';
import { DataInput } from '@plano/shared/core/data/data-input';
import { PCookieService } from '@plano/shared/core/p-cookie.service';
import { SchedulingApiBirthday } from './shared/api/scheduling-api-birthday.service';
import { SchedulingApiAbsence, SchedulingApiHoliday, SchedulingApiShift, SchedulingApiMember } from './shared/api/scheduling-api.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../shared/core/null-type-utils';
let SchedulingFilterService = class SchedulingFilterService extends DataInput {
    constructor(meService, pCookieService, zone) {
        super(zone);
        this.meService = meService;
        this.pCookieService = pCookieService;
        this.zone = zone;
        /**
         * Should shifts with unassigned slots be visible or not?
         */
        this.showItemsWithEmptyMemberSlot = null;
        this._hideAllAbsences = false;
        this._hideAllHolidays = false;
        this._hideAllBirthdays = false;
        this._hideAllShifts = false;
        this._hideAllShiftsFromOthers = false;
        this._hideAllShiftsFromMe = false;
    }
    /**
     * Should all Absences be hidden?
     */
    get hideAllAbsences() { return this._hideAllAbsences; }
    set hideAllAbsences(value) {
        this.pCookieService.put({ name: 'hideAllAbsences', prefix: null }, value);
        this._hideAllAbsences = value;
        this.changed('hideAllAbsences');
    }
    /**
     * Should all Holidays be hidden?
     */
    get hideAllHolidays() { return this._hideAllHolidays; }
    set hideAllHolidays(value) {
        this.pCookieService.put({ name: 'hideAllHolidays', prefix: null }, value);
        this._hideAllHolidays = value;
        this.changed('hideAllHolidays');
    }
    /**
     * Should all Holidays be hidden?
     */
    get hideAllBirthdays() { return this._hideAllBirthdays; }
    set hideAllBirthdays(value) {
        this.pCookieService.put({ name: 'hideAllBirthdays', prefix: null }, value);
        this._hideAllBirthdays = value;
        this.changed('hideAllBirthdays');
    }
    /**
     * Should all Shifts be hidden?
     */
    get hideAllShifts() { return this._hideAllShifts; }
    set hideAllShifts(value) {
        this.pCookieService.put({ name: 'hideAllShifts', prefix: null }, value);
        this._hideAllShifts = value;
        if (this.hideAllShiftsFromOthers !== value && (value || this.hideAllShiftsFromMe !== value) ||
            this.hideAllShiftsFromMe !== value && (value || this.hideAllShiftsFromOthers !== value)) {
            this.hideAllShiftsFromOthers = value;
            this.hideAllShiftsFromMe = value;
        }
        this.changed('hideAllShifts');
    }
    /**
     * Should all Shifts from others be hidden?
     */
    get hideAllShiftsFromOthers() { return this._hideAllShiftsFromOthers; }
    set hideAllShiftsFromOthers(value) {
        this.pCookieService.put({ name: 'hideAllShiftsFromOthers', prefix: null }, value);
        this._hideAllShiftsFromOthers = value;
        if (this.hideAllShifts !== value && (!value || this.hideAllShiftsFromMe === value))
            this.hideAllShifts = value;
        this.changed('hideAllShiftsFromOthers');
    }
    /**
     * Should all Shifts from me be hidden?
     */
    get hideAllShiftsFromMe() { return this._hideAllShiftsFromMe; }
    set hideAllShiftsFromMe(value) {
        this.pCookieService.put({ name: 'hideAllShiftsFromMe', prefix: null }, value);
        this._hideAllShiftsFromMe = value;
        if (this.hideAllShifts !== value && (!value || this.hideAllShiftsFromOthers === value))
            this.hideAllShifts = value;
        this.changed('hideAllShiftsFromMe');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isSetToShowAll() {
        if (!this.showItemsWithEmptyMemberSlot)
            return false;
        if (this.hideAllAbsences)
            return false;
        if (this.hideAllHolidays)
            return false;
        if (this.hideAllBirthdays)
            return false;
        if (this.hideAllShifts)
            return false;
        if (this.hideAllShiftsFromOthers)
            return false;
        if (this.hideAllShiftsFromMe)
            return false;
        return true;
    }
    /**
     * Checks if given shiftModel, member, option, members or shiftModels is visible.
     */
    isVisible(input) {
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
            return this.isVisibleBirthday( /* input*/);
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
            return this.isVisibleHoliday( /* input*/);
        }
        if (input instanceof SchedulingApiBirthday) {
            return this.isVisibleBirthday( /* input*/);
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
    isVisibleShift(shift) {
        // don’t show this shift if all shifts should be hidden
        if (this.hideAllShifts)
            return false;
        // don’t show this shift if me is not assigned but user has set "hideAllShiftsFromOthers"
        if (this.hideAllShiftsFromOthers && !shift.emptyMemberSlots) {
            if (!this.meService.isLoaded())
                throw new Error('me must be loaded if hideAllShiftsFromOthers mode is enabled');
            const relatesToMe = shift.assignedMemberIds.contains(this.meService.data.id);
            if (!relatesToMe)
                return false;
        }
        // don’t show this shift if its assigned to me and no other person
        if (this.hideAllShiftsFromMe) {
            const ids = shift.assignedMemberIds;
            if (ids.length === 1 && ids.contains(this.meService.data.id) && !shift.emptyMemberSlots)
                return false;
        }
        // If shifts with empty slots should be hidden AND shift has empty slots -> hide
        if (!this.showItemsWithEmptyMemberSlot && shift.emptyMemberSlots)
            return false;
        return true;
    }
    /**
     * Check if this absence is visible
     */
    isVisibleAbsence() {
        return !this.hideAllAbsences;
    }
    /**
     * Check if this holiday is visible
     */
    isVisibleHoliday() {
        return !this.hideAllHolidays;
    }
    /**
     * Check if this birthday is visible
     */
    isVisibleBirthday() {
        return !this.hideAllBirthdays;
    }
    /**
     * Init all necessary values for this class
     */
    initValues() {
        if (this._hideAllAbsences === null)
            this.hideAllAbsences = false;
        if (this._hideAllHolidays === null)
            this.hideAllHolidays = false;
        if (this._hideAllBirthdays === null)
            this.hideAllBirthdays = false;
        if (this._hideAllShifts === null)
            this.hideAllShifts = false;
        if (this._hideAllShiftsFromOthers === null)
            this.hideAllShiftsFromOthers = false;
        if (this._hideAllShiftsFromMe === null)
            this.hideAllShiftsFromMe = false;
        if (this.showItemsWithEmptyMemberSlot === null)
            this.showItemsWithEmptyMemberSlot = true;
        this.changed(null);
    }
    /** @see PServiceInterface['unload'] */
    unload() {
        this.unloadFilters();
    }
    /**
     * Reset all filters to default
     */
    unloadFilters() {
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
    readCookies() {
        const hideAllAbsencesCookie = this.pCookieService.get({ name: 'hideAllAbsences', prefix: null });
        if (hideAllAbsencesCookie !== undefined) {
            this.hideAllAbsences = hideAllAbsencesCookie === 'true';
        }
        const hideAllHolidaysCookie = this.pCookieService.get({ name: 'hideAllHolidays', prefix: null });
        if (hideAllHolidaysCookie !== undefined) {
            this.hideAllHolidays = hideAllHolidaysCookie === 'true';
        }
        const hideAllBirthdaysCookie = this.pCookieService.get({ name: 'hideAllBirthdays', prefix: null });
        if (hideAllBirthdaysCookie !== undefined) {
            this.hideAllBirthdays = hideAllBirthdaysCookie === 'true';
        }
        const hideAllShiftsCookie = this.pCookieService.get({ name: 'hideAllShifts', prefix: null });
        if (hideAllShiftsCookie !== undefined) {
            this.hideAllShifts = hideAllShiftsCookie === 'true';
        }
        const hideAllShiftsFromOthersCookie = this.pCookieService.get({ name: 'hideAllShiftsFromOthers', prefix: null });
        if (hideAllShiftsFromOthersCookie !== undefined) {
            this.hideAllShiftsFromOthers = hideAllShiftsFromOthersCookie === 'true';
        }
        const hideAllShiftsFromMeCookie = this.pCookieService.get({ name: 'hideAllShiftsFromMe', prefix: null });
        if (hideAllShiftsFromMeCookie !== undefined) {
            this.hideAllShiftsFromMe = hideAllShiftsFromMeCookie === 'true';
        }
    }
};
SchedulingFilterService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof MeService !== "undefined" && MeService) === "function" ? _a : Object, typeof (_b = typeof PCookieService !== "undefined" && PCookieService) === "function" ? _b : Object, typeof (_c = typeof NgZone !== "undefined" && NgZone) === "function" ? _c : Object])
], SchedulingFilterService);
export { SchedulingFilterService };
//# sourceMappingURL=scheduling-filter.service.js.map