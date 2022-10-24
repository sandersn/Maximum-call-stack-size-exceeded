var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { FilterService } from '@plano/client/shared/filter.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { RightsService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { ThreeParameterData } from '@plano/shared/core/data/three-parameter-data';
import { SchedulingService } from '../../scheduling.service';
import { SchedulingApiShifts, SchedulingApiService } from '../api/scheduling-api.service';
let PCalendarService = class PCalendarService {
    constructor(api, meService, schedulingService, filterService, rightsService, pMoment) {
        this.api = api;
        this.meService = meService;
        this.schedulingService = schedulingService;
        this.filterService = filterService;
        this.rightsService = rightsService;
        this.pMoment = pMoment;
        this._shiftsOfDayHaveDescriptions = new ThreeParameterData(this.api, this.filterService);
    }
    /**
     * Check if there is a memo for given day or a shift-description for the current user for the shifts of the given day.
     */
    hasImportantNoteForDay(startOfDay, onlyForUser = true) {
        // If no startOfDay is defined, today will be checked.
        if (!this.api.isLoaded())
            return undefined;
        // Has comment for the day?
        // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
        const memo = this.api.data.memos.getByDay(startOfDay ? startOfDay : +this.pMoment.m().startOf('day'));
        if (memo === null || memo === void 0 ? void 0 : memo.message)
            return true;
        const hasImportantShiftDescriptions = this.shiftsOfDayHaveDescriptions(startOfDay, {
            onlyForUser: onlyForUser,
            onlyIfNotInAProcess: !this.rightsService.userCanEditAssignmentProcesses,
        });
        if (hasImportantShiftDescriptions)
            return true;
        return false;
    }
    /**
     * Check if shiftsOfDay have any descriptions
     */
    shiftsOfDayHaveDescriptions(startOfDay, input = {}) {
        // If no startOfDay is defined, today will be checked.
        if (!this.meService.isLoaded())
            return null;
        if (startOfDay === undefined) {
            if (this.api.data.todaysShiftDescriptions.findBy((item) => {
                return !input.onlyForUser || item.isRequesterAssigned;
            }))
                return true;
            return false;
        }
        input.onlyForUser = input.onlyForUser !== undefined ? input.onlyForUser : false;
        input.onlyIfNotInAProcess = !!input.onlyIfNotInAProcess;
        return this._shiftsOfDayHaveDescriptions.get(startOfDay, input.onlyForUser, input.onlyIfNotInAProcess, () => {
            if (!startOfDay)
                return false;
            const shifts = this.shiftsOfDay(startOfDay);
            if (!shifts.length)
                return false;
            let shiftsToCheck;
            if (input.onlyForUser) {
                if (!this.meService.isLoaded())
                    return false;
                shiftsToCheck = shifts.filterBy((item) => item.assignedMemberIds.contains(this.meService.data.id));
            }
            else {
                shiftsToCheck = shifts;
            }
            const assignmentProcesses = this.api.data.assignmentProcesses;
            for (const shift of shiftsToCheck.filterBy((item) => !!item.description).iterable()) {
                if (!input.onlyIfNotInAProcess || !assignmentProcesses.getByShiftId(shift.id)) {
                    return true;
                }
            }
            return false;
        });
    }
    /**
     * Get all shifts if a day
     */
    shiftsOfDay(day) {
        const timestamp = day !== null && day !== void 0 ? day : this.schedulingService.urlParam.date;
        if (!this.api.isLoaded())
            return new SchedulingApiShifts(null, false);
        if (!this.schedulingService.urlParam.date)
            return new SchedulingApiShifts(null, false);
        // TODO: This should be replaced by ???
        const filteredShifts = this.api.data.shifts.filterByFilterService(this.filterService);
        return filteredShifts.getByDay(timestamp);
    }
};
PCalendarService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [SchedulingApiService, typeof (_a = typeof MeService !== "undefined" && MeService) === "function" ? _a : Object, SchedulingService, typeof (_b = typeof FilterService !== "undefined" && FilterService) === "function" ? _b : Object, typeof (_c = typeof RightsService !== "undefined" && RightsService) === "function" ? _c : Object, typeof (_d = typeof PMomentService !== "undefined" && PMomentService) === "function" ? _d : Object])
], PCalendarService);
export { PCalendarService };
//# sourceMappingURL=p-calendar.service.js.map