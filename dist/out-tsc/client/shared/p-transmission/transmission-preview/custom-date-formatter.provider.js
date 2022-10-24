var _a;
import { __decorate, __metadata } from "tslib";
import { CalendarDateFormatter, DateAdapter } from 'angular-calendar';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
let CustomDateFormatter = class CustomDateFormatter extends CalendarDateFormatter {
    constructor(dateAdapter) {
        super(dateAdapter);
        this.dateAdapter = dateAdapter;
    }
    // you can override any of the methods defined in the parent class
    monthViewColumnHeader({ date, locale }) {
        const result = new DatePipe(locale).transform(date, 'EEE', locale);
        assumeDefinedToGetStrictNullChecksRunning(result, 'result');
        return result;
    }
    monthViewTitle({ date, locale }) {
        const result = new DatePipe(locale).transform(date, 'MMM y', locale);
        assumeDefinedToGetStrictNullChecksRunning(result, 'result');
        return result;
    }
    weekViewColumnHeader({ date, locale }) {
        const result = new DatePipe(locale).transform(date, 'EEE', locale);
        assumeDefinedToGetStrictNullChecksRunning(result, 'result');
        return result;
    }
    dayViewHour({ date, locale }) {
        const result = new DatePipe(locale).transform(date, 'HH:mm', locale);
        assumeDefinedToGetStrictNullChecksRunning(result, 'result');
        return result;
    }
};
CustomDateFormatter = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof DateAdapter !== "undefined" && DateAdapter) === "function" ? _a : Object])
], CustomDateFormatter);
export { CustomDateFormatter };
//# sourceMappingURL=custom-date-formatter.provider.js.map