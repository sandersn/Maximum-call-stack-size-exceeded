import { SchedulingApiShiftModelCourseTariffsBase, SchedulingApiShiftModelCourseTariffBase, SchedulingApiShiftModelCoursePaymentMethodsBase, SchedulingApiCustomBookableMailsBase } from '@plano/shared/api';
export class SchedulingApiCustomBookableMails extends SchedulingApiCustomBookableMailsBase {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems);
        this.api = api;
    }
    /**
     * get a list of
     */
    getByEventType(eventType) {
        const list = new SchedulingApiCustomBookableMails(this.api, false);
        for (const item of this.iterable()) {
            if (item.eventType === eventType) {
                list.push(item);
            }
        }
        return list;
    }
}
export class SchedulingApiShiftModelCoursePaymentMethods extends SchedulingApiShiftModelCoursePaymentMethodsBase {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems);
        this.api = api;
    }
    /**
     * Check if there is at least one untrashed item
     */
    get hasUntrashedItem() {
        return this.some(item => !item.trashed);
    }
    /**
     * Filters a list of Shifts by a function that returns a boolean.
     * Returns a new list of Shifts.
     */
    filterBy(fn) {
        const result = new SchedulingApiShiftModelCoursePaymentMethods(this.api, false);
        for (const item of this.iterable()) {
            if (!fn(item))
                continue;
            result.push(item);
        }
        return result;
    }
}
export class SchedulingApiShiftModelCourseTariff extends SchedulingApiShiftModelCourseTariffBase {
    constructor(api) {
        super(api);
        this.api = api;
    }
    /**
     * Get total fee for specific booking
     */
    getTotalFee(participantCount) {
        if (participantCount === 0)
            return 0;
        let result = 0;
        for (const fee of this.fees.iterable()) {
            const times = Math.ceil(participantCount / fee.perXParticipants);
            result += (fee.fee * times);
        }
        return result;
    }
}
export class SchedulingApiShiftModelCourseTariffs extends SchedulingApiShiftModelCourseTariffsBase {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems);
        this.api = api;
    }
    /**
     * Check if there is at least one untrashed item
     */
    get hasUntrashedItem() {
        return this.some(item => !item.trashed);
    }
    /**
     * Filters a list of Shifts by a function that returns a boolean.
     * Returns a new list of Shifts.
     */
    filterBy(fn) {
        const result = new SchedulingApiShiftModelCourseTariffs(this.api, false);
        for (const item of this.iterable()) {
            if (!fn(item))
                continue;
            result.push(item);
        }
        return result;
    }
}
//# sourceMappingURL=scheduling-api-shiftmodel-course.service.js.map