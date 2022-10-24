import { ApiListWrapper } from '../../../../shared/api';
import { Assertions } from '../../../../shared/core/assertions';
import { Config } from '../../../../shared/core/config';
import { PMomentService } from '../../../shared/p-moment.service';
export class SchedulingApiBirthday {
    constructor() {
        this.isHovered = false;
    }
    /**
     * @see SchedulingApiMember['id']
     */
    get id() {
        return this.memberId;
    }
    /**
     * @see SchedulingApiHoliday['time']
     */
    get time() {
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
    startBasedOnCalendarRequest(calendarRequestStart, pMomentService) {
        const lastRequestedDate = calendarRequestStart;
        const lastRequestedMoment = pMomentService.m(lastRequestedDate);
        if (this.month < 7 && +lastRequestedMoment.get('month') >= 7)
            lastRequestedMoment.add(1, 'year').startOf('day');
        return +lastRequestedMoment.set('month', this.month).set('date', this.day);
    }
}
export class SchedulingApiBirthdays extends ApiListWrapper {
    constructor(birthdayService, api, removeDestroyedItems) {
        super(api, removeDestroyedItems);
        this.birthdayService = birthdayService;
        this.api = api;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    containsPrimitives() {
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    createInstance(removeDestroyedItems) {
        return new SchedulingApiBirthdays(this.birthdayService, this.api, removeDestroyedItems);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    containsIds() {
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get dni() {
        throw new Error('Method not implemented.');
    }
    /** @see ApiListWrapper['push'] */
    push(birthday) {
        var _a;
        super.push(birthday);
        (_a = this.birthdayService) === null || _a === void 0 ? void 0 : _a.changed(null);
    }
    /**
     * get birthdays of day
     * This includes all birthdays happen at the provided day.
     * @param day - timestamp of the desired day
     */
    getByDay(dayStart) {
        Assertions.ensureIsDayStart(dayStart);
        const moment = new PMomentService(Config.LOCALE_ID).m(dayStart);
        return this.filterBy(item => {
            const month = moment.get('month');
            const date = moment.get('date');
            if (item.month !== month)
                return false;
            if (item.day !== date)
                return false;
            return true;
        });
    }
    /**
     * Filters a list of Shifts by a function that returns a boolean.
     * Returns a new list of Shifts.
     */
    filterBy(fn) {
        const result = new SchedulingApiBirthdays(this.birthdayService, this.api, false);
        for (const item of this.iterable()) {
            if (!fn(item))
                continue;
            result.push(item);
        }
        return result;
    }
}
//# sourceMappingURL=scheduling-api-birthday.service.js.map