import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
let NgbFormatsService = class NgbFormatsService {
    constructor(pMoment, console) {
        this.pMoment = pMoment;
        this.console = console;
    }
    /**
     * Transform provided timestamp into a NgbDateStruct
     * Returns current date/time if no timestamp is provided
     */
    timestampToDateStruct(input, locale) {
        const now = +(new PMomentService(locale, this.console).m());
        // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
        const timestamp = input ? input : now;
        return {
            year: new PMomentService(locale, this.console).m(timestamp).year(),
            month: new PMomentService(locale, this.console).m(timestamp).month() + 1,
            day: new PMomentService(locale, this.console).m(timestamp).date(),
        };
    }
    /**
     * Transform provided timestamp into a NgbTimeStruct
     * Returns current date/time if no timestamp is provided
     */
    timestampToTimeStruct(input) {
        const now = +this.pMoment.m();
        // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
        const timestamp = input ? input : now;
        return {
            hour: this.pMoment.m(timestamp).hour(),
            minute: this.pMoment.m(timestamp).minute(),
            second: this.pMoment.m(timestamp).second(),
        };
    }
    /**
     * Takes a object with infos about date and/or time and generates Timestamp from it.
     * @param dateTimeObject: date/time object where .month starts at 1.
     */
    dateTimeObjectToTimestamp(dateTimeObject, locale) {
        // TODO: "!dateTimeObject" should be obsolete after turing on strictNullChecks
        if (dateTimeObject === null || dateTimeObject === '-') {
            if (Config.DEBUG && dateTimeObject === null) {
                throw new Error(`dateTimeObject === null is not supported!`);
            }
            return null;
        }
        const zeroIndexedMonth = {};
        if (dateTimeObject.year !== undefined &&
            dateTimeObject.month !== undefined &&
            dateTimeObject.day !== undefined) {
            zeroIndexedMonth.year = dateTimeObject.year;
            zeroIndexedMonth.month = dateTimeObject.month - 1;
            zeroIndexedMonth.day = dateTimeObject.day;
        }
        if (dateTimeObject.hour !== undefined &&
            dateTimeObject.minute !== undefined &&
            dateTimeObject.second !== undefined) {
            zeroIndexedMonth.hour = dateTimeObject.hour;
            zeroIndexedMonth.minute = dateTimeObject.minute;
            zeroIndexedMonth.second = dateTimeObject.second;
        }
        return +(new PMomentService(locale !== null && locale !== void 0 ? locale : Config.LOCALE_ID, this.console).m(zeroIndexedMonth));
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    isSameDate(dateTimeObject, timestamp) {
        if (dateTimeObject === '-')
            return null;
        if (dateTimeObject.year !== this.pMoment.m(timestamp).year())
            return false;
        if (dateTimeObject.month !== (this.pMoment.m(timestamp).month() + 1))
            return false;
        if (dateTimeObject.day !== this.pMoment.m(timestamp).date())
            return false;
        return true;
    }
};
NgbFormatsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PMomentService,
        LogService])
], NgbFormatsService);
export { NgbFormatsService };
//# sourceMappingURL=ngbformats.service.js.map