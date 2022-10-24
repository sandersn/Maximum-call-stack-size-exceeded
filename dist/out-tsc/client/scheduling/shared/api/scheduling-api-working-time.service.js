import { PMomentService } from '@plano/client/shared/p-moment.service';
import { WarningsService } from '@plano/client/shared/warnings.service';
import { SchedulingApiWorkingTimeBase } from '@plano/shared/api';
import { SchedulingApiWorkingTimesBase } from '@plano/shared/api';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
export class SchedulingApiWorkingTime extends SchedulingApiWorkingTimeBase {
    constructor(api) {
        super(api);
        this.api = api;
        this.warnings = new WarningsService();
        // this.warnUnplannedWork
    }
    /**
     * does the item overlap with interval?
     */
    overlaps(min, max) {
        const intervalIsBefore = max <= this.time.start;
        const intervalIsAfter = min >= this.time.end;
        return !intervalIsBefore && !intervalIsAfter;
    }
    /**
     * Payroll duration
     */
    get duration() {
        this.assumeIsValidated();
        const totalDuration = this.time.end - this.time.start;
        let result;
        if (totalDuration > this.regularPauseDuration) {
            result = totalDuration - this.regularPauseDuration;
        }
        else {
            result = 0;
        }
        return result;
    }
    /**
     * Partial payroll duration for workingTime
     */
    durationBetween(min, max) {
        const START = (min && min > this.time.start) ? min : this.time.start;
        const END = (max && max < this.time.end) ? max : this.time.end;
        const duration = END - START;
        if (duration < 0)
            return 0;
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
    get totalDurationInHours() {
        const pMoment = new PMomentService(undefined);
        return pMoment.duration(this.duration).asHours();
    }
    /**
     * Get calculated total earnings of a workingTime entry
     */
    get totalEarnings() {
        return this.hourlyEarnings * this.totalDurationInHours;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isExpectedWorkingTime() {
        // For expected working-times the id is an array containing the shift-selector and the member-id.
        return Array.isArray(this.id.rawData);
    }
    /**
     * Get calculated total earnings of a workingTime entry between two timestamps
     */
    totalEarningsBetween(min, max) {
        const pMoment = new PMomentService(undefined);
        const partialDuration = this.durationBetween(min, max);
        return this.hourlyEarnings * pMoment.duration(partialDuration).asHours();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get member() {
        assumeDefinedToGetStrictNullChecksRunning(this.api, 'api');
        return this.api.data.members.get(this.memberId);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get warningAmount() {
        let result = 0;
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
    get warningMessages() {
        const result = this.warnings.getWarningMessages(this);
        if (result.length === 0)
            return null;
        return result;
    }
}
export class SchedulingApiWorkingTimes extends SchedulingApiWorkingTimesBase {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems);
    }
    /**
     * Filters a list of Shifts by a function that returns a boolean.
     * Returns a new list of Shifts.
     */
    filterBy(fn) {
        const result = new SchedulingApiWorkingTimes(this.api, false);
        for (const item of this.iterable()) {
            if (!fn(item))
                continue;
            result.push(item);
        }
        return result;
    }
    /**
     * get workingTimes between two timestamps
     * @param start - Start date in milliseconds
     * @param end - End date in milliseconds
     */
    between(min, max) {
        const result = new SchedulingApiWorkingTimes(this.api, false);
        for (const workingTime of this.iterable()) {
            const isInCurrentView = min <= workingTime.time.start && max > workingTime.time.start;
            if (isInCurrentView) {
                result.push(workingTime);
            }
        }
        return result;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get memberIds() {
        const result = [];
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
    getByMember(member) {
        return this.filterBy(item => {
            if (item.isNewItem())
                return false;
            if (!item.memberId.equals(member.id))
                return false;
            return true;
        });
    }
    /**
     * Sum of payroll durations
     */
    get duration() {
        let result = 0;
        for (const workingTime of this.iterable()) {
            result += workingTime.duration;
        }
        return result;
    }
    /**
     * Sum of partial payroll durations
     */
    durationBetween(min, max) {
        let result = 0;
        for (const workingTime of this.iterable()) {
            result += workingTime.durationBetween(min, max);
        }
        return result;
    }
    /**
     * Sum of regular pause durations
     */
    get regularPauseDuration() {
        let result = 0;
        for (const workingTime of this.iterable()) {
            result += workingTime.regularPauseDuration;
        }
        return result;
    }
    /**
     * Sum of automatic pause durations
     */
    get automaticPauseDuration() {
        let result = 0;
        for (const workingTime of this.iterable()) {
            result += workingTime.automaticPauseDuration;
        }
        return result;
    }
    /**
     * Get sum of total earnings of all contained workingTimes
     */
    get totalEarnings() {
        let result = 0;
        for (const workingTime of this.iterable()) {
            result += workingTime.totalEarnings;
        }
        return result;
    }
    /**
     * Get sum of partial earnings of all contained workingTimes
     */
    totalEarningsBetween(min, max) {
        let result = 0;
        for (const workingTime of this.iterable()) {
            result += workingTime.totalEarningsBetween(min, max);
        }
        return result;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get warningAmount() {
        let result = 0;
        for (const workingTime of this.iterable()) {
            result += workingTime.warningAmount;
        }
        return result;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get commentAmount() {
        return this.filterBy(item => !item.isNewItem() && !!item.comment && !!item.comment.length).length;
    }
}
//# sourceMappingURL=scheduling-api-working-time.service.js.map