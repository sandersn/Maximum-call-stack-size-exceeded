var _a;
import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { ShiftId } from '@plano/shared/api';
import { SchedulingApiAbsenceType, SchedulingApiShiftExchangeState } from '@plano/shared/api';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../shared/core/null-type-utils';
import { SchedulingApiService, SchedulingApiAbsences, SchedulingApiShift } from '../scheduling/shared/api/scheduling-api.service';
let AbsenceService = class AbsenceService {
    constructor(api) {
        this.api = api;
    }
    /**
     * Check if member has absences at that time.
     */
    absencesForMember(memberId, start, _end) {
        if (!start)
            return new SchedulingApiAbsences(null, false);
        const end = !!_end ? _end : start;
        return this.api.data.absences.filterBy((item) => {
            if (!item.memberId.equals(memberId))
                return false;
            if (item.time.start >= end)
                return false;
            if (item.time.end <= start)
                return false;
            return true;
        });
    }
    /**
     * Get absences in that time range
     */
    overlappingAbsences(memberId, inputElement) {
        const start = inputElement.start;
        const end = !!inputElement.end ? inputElement.end : start;
        return this.absencesForMember(memberId, start, end);
    }
    /**
     * Get absence icon for member and time range
     */
    absenceType(memberId, inputElement = null) {
        if (inputElement === null)
            return undefined;
        if (inputElement.id instanceof ShiftId && this.hasConfirmedIllnessShiftExchange(inputElement.id, memberId)) {
            return SchedulingApiAbsenceType.ILLNESS;
        }
        const absences = this.overlappingAbsences(memberId, inputElement);
        assumeDefinedToGetStrictNullChecksRunning(absences, 'absences', 'Could not find absences');
        if (absences.length === 0)
            return undefined;
        const firstItem = absences.get(0);
        if (!firstItem)
            throw new Error('Could not find firstItem');
        return firstItem.type;
    }
    /**
     * Get absence icon for member and time range
     */
    absenceTypeIconName(memberId, inputElement) {
        // eslint-disable-next-line sonarjs/no-small-switch
        switch (this.absenceType(memberId, inputElement)) {
            case SchedulingApiAbsenceType.ILLNESS:
                return 'briefcase-medical';
            default:
                const absences = this.overlappingAbsences(memberId, inputElement);
                assumeDefinedToGetStrictNullChecksRunning(absences, 'absences', 'Could not find absences');
                if (absences.length === 0)
                    return null;
                const firstItem = absences.get(0);
                if (!firstItem)
                    throw new Error('Could not find firstItem');
                return firstItem.typeIconName;
        }
    }
    /**
     * Has illness at that time range
     */
    hasOverlappingIllness(memberId, inputElement) {
        const absences = this.overlappingAbsences(memberId, inputElement);
        assumeDefinedToGetStrictNullChecksRunning(absences, 'absences', 'Could not find absences');
        for (const absence of absences.iterable()) {
            if (absence.type === SchedulingApiAbsenceType.ILLNESS)
                return true;
        }
        if (inputElement instanceof SchedulingApiShift && this.hasConfirmedIllnessShiftExchange(inputElement.id, memberId)) {
            return true;
        }
        return false;
    }
    hasConfirmedIllnessShiftExchange(shiftId, memberId) {
        // Is there a confirmed illness-shiftExchange for this shift?
        // NOTE: When user has a confirmed illness, then he is not assigned to the shift anymore.
        // NOTE: ...so this case only happens when the confirmed user gets assigned again.
        const shiftExchange = this.api.data.shiftExchanges.getByShiftAndMember(shiftId, memberId);
        if (!shiftExchange)
            return false;
        if (!shiftExchange.isIllness)
            return false;
        if (shiftExchange.state === SchedulingApiShiftExchangeState.ILLNESS_NEEDS_CONFIRMATION)
            return false;
        if (shiftExchange.state === SchedulingApiShiftExchangeState.ILLNESS_DECLINED)
            return false;
        if (shiftExchange.state === SchedulingApiShiftExchangeState.CLOSED_MANUALLY)
            return false;
        return true;
    }
};
AbsenceService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object])
], AbsenceService);
export { AbsenceService };
//# sourceMappingURL=absence.service.js.map