var _a, _b;
import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { AbsenceService } from '@plano/client/shared/absence.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiService, SchedulingApiMember, SchedulingApiShift, SchedulingApiAccountingPeriods } from '@plano/shared/api';
import { SchedulingApiShiftExchangeCommunicationSwapOffers, SchedulingApiShiftExchangeShiftRefs } from '@plano/shared/api';
import { SchedulingApiShiftExchangeSwappedShiftRefs } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../shared/core/null-type-utils';
import { PThemeEnum } from '../bootstrap-styles.enum';
/**
 * All special options that can be set for the filter service
 */
let ShiftMemberExchangeService = class ShiftMemberExchangeService {
    constructor(api, absenceService, rightsService, console, pMoment, localize) {
        this.api = api;
        this.absenceService = absenceService;
        this.rightsService = rightsService;
        this.console = console;
        this.pMoment = pMoment;
        this.localize = localize;
    }
    postExpectedShiftEarningsForShift(member, shift) {
        const duration = shift.end - shift.start;
        const assignableMember = shift.assignableMembers.getByMember(member);
        assumeDefinedToGetStrictNullChecksRunning(assignableMember, 'assignableMember');
        return assignableMember.hourlyEarnings *
            this.pMoment.duration(duration).asHours();
    }
    postExpectedShiftEarningsForShiftRefs(member, shiftRefs, accountingPeriod) {
        let result = 0;
        for (const shiftRef of shiftRefs.iterable()) {
            const shift = this.api.data.shifts.get(shiftRef.id);
            assumeDefinedToGetStrictNullChecksRunning(shift, 'shift');
            if (accountingPeriod.start > shift.end)
                continue;
            if (accountingPeriod.end < shift.start)
                continue;
            result += this.postExpectedShiftEarningsForShift(member, shift);
        }
        return result;
    }
    postExpectedShiftEarningsForSwapOffers(member, offers, accountingPeriod) {
        let result = 0;
        for (const offer of offers.iterable()) {
            result += this.postExpectedShiftEarningsForShiftRefs(member, offer.shiftRefs, accountingPeriod);
        }
        return result;
    }
    postExpectedShiftEarnings(member, input, accountingPeriod) {
        if (input instanceof SchedulingApiShift) {
            if (accountingPeriod.start > input.end)
                return null;
            if (accountingPeriod.end < input.start)
                return null;
            return this.postExpectedShiftEarningsForShift(member, input);
        }
        else if (input instanceof SchedulingApiShiftExchangeCommunicationSwapOffers) {
            return this.postExpectedShiftEarningsForSwapOffers(member, input, accountingPeriod);
        }
        else if (input instanceof SchedulingApiShiftExchangeShiftRefs ||
            input instanceof SchedulingApiShiftExchangeSwappedShiftRefs) {
            return this.postExpectedShiftEarningsForShiftRefs(member, input, accountingPeriod);
        }
        if (Config.DEBUG)
            throw new Error('unknown type in postExpectedShiftEarnings');
        return null;
    }
    /**
     * Get the accountingPeriods which contains the shifts.
     */
    relatedAccountingPeriods(input) {
        if (!this.api.data.accountingPeriods.length)
            return new SchedulingApiAccountingPeriods(null, false);
        if (input instanceof SchedulingApiShift) {
            return this.api.data.accountingPeriods.filterBy(item => {
                if (item.start > input.end)
                    return false;
                if (item.end < input.start)
                    return false;
                return true;
            });
        }
        else if (input instanceof SchedulingApiShiftExchangeShiftRefs) {
            return this.api.data.accountingPeriods.filterBy(item => {
                for (const shiftRef of input.iterable()) {
                    if (item.start > shiftRef.id.end)
                        return false;
                    if (item.end < shiftRef.id.start)
                        return false;
                    return true;
                }
                return false;
            });
        }
        throw new Error('relatedAccountingPeriods: unsupported type');
    }
    /**
     * Amount of money the member earns if he/she gets the shift(s)
     */
    postExpectedMemberEarnings(member, input, accountingPeriod) {
        const period = accountingPeriod !== null && accountingPeriod !== void 0 ? accountingPeriod : this.relatedAccountingPeriods(input).get(0);
        if (!period)
            return null;
        const expectedMemberEarnings = this.expectedMemberEarnings(member, input, period);
        // eslint-disable-next-line unicorn/prefer-number-properties
        if (expectedMemberEarnings === null || isNaN(expectedMemberEarnings)) {
            if (Config.DEBUG)
                this.console.error('expectedMemberEarnings is NaN');
            return null;
        }
        const postExpectedShiftEarnings = this.postExpectedShiftEarnings(member, input, period);
        // eslint-disable-next-line unicorn/prefer-number-properties
        if (postExpectedShiftEarnings === null || isNaN(postExpectedShiftEarnings)) {
            if (Config.DEBUG)
                this.console.error('postExpectedShiftEarnings is NaN or null');
            return null;
        }
        return expectedMemberEarnings + postExpectedShiftEarnings;
    }
    /**
     * Get the expected earnings for this member at the time the shift happens.
     */
    expectedMemberEarningsAtTimeOfShift(member, shift) {
        var _a;
        const period = this.relatedAccountingPeriods(shift).get(0);
        assumeNonNull(period);
        const expectedMemberData = period.expectedMemberData.getByMember(member);
        return (_a = expectedMemberData === null || expectedMemberData === void 0 ? void 0 : expectedMemberData.earnings) !== null && _a !== void 0 ? _a : null;
    }
    expectedMemberEarningsForShiftRefs(member, shiftRefs, accountingPeriod) {
        let result = 0;
        for (const shiftRef of shiftRefs.iterable()) {
            const shift = this.api.data.shifts.get(shiftRef.id);
            assumeNonNull(shift);
            if (accountingPeriod.start > shift.end)
                continue;
            if (accountingPeriod.end < shift.start)
                continue;
            const expectedEarnings = this.expectedMemberEarningsAtTimeOfShift(member, shift);
            result += expectedEarnings !== null && expectedEarnings !== void 0 ? expectedEarnings : 0;
        }
        return result;
    }
    expectedMemberEarningsForSwapOffers(member, offers, accountingPeriod) {
        let result = 0;
        for (const offer of offers.iterable()) {
            result += this.expectedMemberEarningsForShiftRefs(member, offer.shiftRefs, accountingPeriod);
        }
        return result;
    }
    expectedMemberEarnings(member, input, accountingPeriod) {
        if (input instanceof SchedulingApiShift) {
            return this.expectedMemberEarningsAtTimeOfShift(member, input);
        }
        else if (input instanceof SchedulingApiShiftExchangeCommunicationSwapOffers) {
            return this.expectedMemberEarningsForSwapOffers(member, input, accountingPeriod);
        }
        else if (input instanceof SchedulingApiShiftExchangeShiftRefs ||
            input instanceof SchedulingApiShiftExchangeSwappedShiftRefs) {
            return this.expectedMemberEarningsForShiftRefs(member, input, accountingPeriod);
        }
        if (Config.DEBUG) {
            // This case was unhandled before we turned on strictNullChecks. It is a potential bug.
            // Not sure if it is possible and how it should be handled.
            throw new Error('Not implemented yet');
        }
        return null;
    }
    /**
     * Sky… eh… maxMonthlyEarnings is the limit
     */
    assignmentExceedsEarningLimit(member, input, accountingPeriod) {
        /* TODO: [PLANO-3464] */
        if (accountingPeriod) {
            const postExpectedMemberEarnings = this.postExpectedMemberEarnings(member, input, accountingPeriod);
            if (postExpectedMemberEarnings === null)
                return false;
            return postExpectedMemberEarnings > member.maxMonthlyEarnings;
        }
        else if (input instanceof SchedulingApiShift) {
            const period = this.relatedAccountingPeriods(input).get(0);
            const postExpectedMemberEarnings = this.postExpectedMemberEarnings(member, input, period);
            if (postExpectedMemberEarnings === null)
                return false;
            return postExpectedMemberEarnings > member.maxMonthlyEarnings;
        }
        for (const relatedAccountingPeriod of this.relatedAccountingPeriods(input).iterable()) {
            const postExpectedMemberEarnings = this.postExpectedMemberEarnings(member, input, relatedAccountingPeriod);
            if (postExpectedMemberEarnings === null)
                return false;
            return postExpectedMemberEarnings > member.maxMonthlyEarnings;
        }
        if (Config.DEBUG) {
            // This case was unhandled before we turned on strictNullChecks. It is a potential bug.
            // Not sure if it is possible and how it should be handled.
            throw new Error('Not implemented yet');
        }
        return null;
    }
    /**
     * Check if there is another assignment that conflicts whit this one
     */
    isAlreadyAssignedSomewhereElse(input, inputShift) {
        const memberId = input instanceof SchedulingApiMember ? input.id : input;
        if (!memberId)
            return null;
        const ITEMS = this.api.data.shifts.filterBy(item => {
            if (!item.overlaps(inputShift.start, inputShift.end))
                return false;
            if (!item.assignedMemberIds.contains(memberId))
                return false;
            return true;
        });
        return !!ITEMS.length;
    }
    /**
     * Get an array of errors
     */
    errors(input, shift) {
        const result = [];
        if (!input)
            return result;
        if (!this.api.isLoaded())
            return result;
        const member = input instanceof Id ? this.api.data.members.get(input) : input;
        if (!member)
            return result;
        const isAbsent = this.getIsAbsentWarning(member, shift);
        if (isAbsent)
            result.push(isAbsent);
        const assignedSomewhereElse = this.getIsAlreadyAssignedSomewhereElseWarning(member, shift);
        if (assignedSomewhereElse)
            result.push(assignedSomewhereElse);
        for (const relatedAccountingPeriod of this.relatedAccountingPeriods(shift).iterable()) {
            const exceedsEarningLimit = this.getExceedsEarningLimitWarning(member, shift, relatedAccountingPeriod);
            if (exceedsEarningLimit)
                result.push(exceedsEarningLimit);
        }
        return result;
    }
    getIsAlreadyAssignedSomewhereElseWarning(member, shift) {
        if (!this.isAlreadyAssignedSomewhereElse(member, shift))
            return null;
        let text;
        if (this.rightsService.isMe(member)) {
            text = this.localize.transform('Du arbeitest zu der Zeit schon in einer anderen Schicht.');
        }
        else {
            text = this.localize.transform('${firstName} arbeitet zu der Zeit schon in einer anderen Schicht.', { firstName: member.firstName });
        }
        return {
            type: PThemeEnum.WARNING,
            text: text,
        };
    }
    getExceedsEarningLimitWarning(member, shift, accountingPeriod) {
        if (!this.rightsService.userCanSeeEarningsForShiftModel(shift.shiftModelId, member))
            return null;
        if (!this.assignmentExceedsEarningLimit(member, shift))
            return null;
        const EXPECTED_EARNINGS = this.expectedMemberEarnings(member, shift, accountingPeriod);
        const TEXT = this.localize.transform('${MEMBER} ${WOULD} mit dieser Schicht den Maximallohn ${FURTHER} überschreiten.', {
            MEMBER: this.rightsService.isMe(member) ? this.localize.transform('Du') : member.firstName,
            WOULD: this.rightsService.isMe(member) ? this.localize.transform('würdest') : this.localize.transform('würde'),
            FURTHER: EXPECTED_EARNINGS !== null && EXPECTED_EARNINGS > member.maxMonthlyEarnings /* TODO: [PLANO-3464] */ ? `${this.localize.transform('weiter')} ` : '',
        });
        return {
            type: PThemeEnum.WARNING,
            text: TEXT,
        };
    }
    getIsAbsentWarning(member, shift) {
        const absenceIcon = this.absenceService.absenceTypeIconName(member.id, shift);
        if (!absenceIcon)
            return null;
        let text;
        if (this.rightsService.isMe(member)) {
            text = this.localize.transform('Du hast für die gewählte Zeit einen Abwesenheitseintrag.');
        }
        else {
            text = this.localize.transform('${firstName} hat für die gewählte Zeit einen Abwesenheitseintrag.', { firstName: member.firstName });
        }
        return {
            type: PThemeEnum.DANGER,
            icon: absenceIcon,
            text: text,
        };
    }
};
ShiftMemberExchangeService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, AbsenceService, typeof (_b = typeof RightsService !== "undefined" && RightsService) === "function" ? _b : Object, LogService,
        PMomentService,
        LocalizePipe])
], ShiftMemberExchangeService);
export { ShiftMemberExchangeService };
//# sourceMappingURL=shift-member-exchange.service.js.map