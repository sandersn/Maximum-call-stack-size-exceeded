var _a;
import { __decorate, __metadata } from "tslib";
import * as moment from 'moment-timezone';
import { DatePipe } from '@angular/common';
import { Pipe } from '@angular/core';
import { PSupportedLanguageCodes, PSupportedLocaleIds } from '../../api/base/generated-types.ag';
import { Config } from '../config';
export var AngularDatePipeFormat;
(function (AngularDatePipeFormat) {
    /**	E.g. `14.04.20, 19:52` */
    AngularDatePipeFormat["SHORT"] = "short";
    /**	E.g. `13.09.2021, 16:00:00` */
    AngularDatePipeFormat["MEDIUM"] = "medium";
    AngularDatePipeFormat["LONG"] = "long";
    AngularDatePipeFormat["FULL"] = "full";
    AngularDatePipeFormat["SHORT_DATE"] = "shortDate";
    /**	E.g. `13.09.2021` */
    AngularDatePipeFormat["MEDIUM_DATE"] = "mediumDate";
    AngularDatePipeFormat["LONG_DATE"] = "longDate";
    AngularDatePipeFormat["FULL_DATE"] = "fullDate";
    /**	E.g. `16:00 Uhr` */
    AngularDatePipeFormat["SHORT_TIME"] = "shortTime";
    AngularDatePipeFormat["MEDIUM_TIME"] = "mediumTime";
    AngularDatePipeFormat["LONG_TIME"] = "longTime";
    AngularDatePipeFormat["FULL_TIME"] = "fullTime";
})(AngularDatePipeFormat || (AngularDatePipeFormat = {}));
/** Custom dates for plano */
export var PDateFormat;
(function (PDateFormat) {
    /**	E.g. `13.9.` */
    PDateFormat["MINIMAL_DATE"] = "minimalDate";
    /**	E.g. `13.09.21` */
    PDateFormat["VERY_SHORT_DATE"] = "veryShortDate";
    /**	E.g. `16:00` */
    PDateFormat["VERY_SHORT_TIME"] = "veryShortTime";
})(PDateFormat || (PDateFormat = {}));
let PDatePipe = class PDatePipe {
    constructor(datePipe, console) {
        this.datePipe = datePipe;
        this.console = console;
    }
    getCustomAppend(locale, format) {
        const LANGUAGE = Config.getLanguageCode(locale);
        // eslint-disable-next-line sonarjs/no-small-switch
        switch (format) {
            case 'shortTime':
                if (LANGUAGE === PSupportedLanguageCodes.de)
                    return ' Uhr';
                return '';
            default:
                return '';
        }
    }
    getShortTimeFormat(format, locale) {
        if (locale === PSupportedLocaleIds.en_NL)
            return 'HH:mm';
        return format;
    }
    getVeryShortTimeFormat(_format, locale) {
        if (locale === PSupportedLocaleIds.en_NL)
            return 'HH:mm';
        return 'shortTime';
    }
    getMinimalDateFormat(format, locale) {
        switch (locale) {
            case PSupportedLocaleIds.de_AT:
            case PSupportedLocaleIds.de_CH:
            case PSupportedLocaleIds.de_DE:
            case PSupportedLocaleIds.de_LU:
                return 'd.M.';
            case PSupportedLocaleIds.en_NL:
            case PSupportedLocaleIds.en_BE:
            case PSupportedLocaleIds.en_GB:
            case PSupportedLocaleIds.en_CZ:
            case PSupportedLocaleIds.en_SE:
                return 'd/M';
            case PSupportedLocaleIds.en:
                return 'M/d';
            default:
                throw new Error(this.throwText(format, locale));
        }
    }
    getVeryShortDateFormat(format, locale) {
        const LANGUAGE = Config.getLanguageCode(locale);
        if (LANGUAGE === PSupportedLanguageCodes.de)
            return 'dd.MM.yy';
        switch (locale) {
            case PSupportedLocaleIds.de_AT:
            case PSupportedLocaleIds.de_CH:
            case PSupportedLocaleIds.de_DE:
            case PSupportedLocaleIds.de_LU:
                return 'dd.MM.yy';
            case PSupportedLocaleIds.en_NL:
            case PSupportedLocaleIds.en_BE:
            case PSupportedLocaleIds.en_GB:
            case PSupportedLocaleIds.en_CZ:
            case PSupportedLocaleIds.en_SE:
                return 'dd/MM/yy';
            case PSupportedLocaleIds.en:
                return 'MM/dd/yy';
            default:
                throw new Error(this.throwText(format, locale));
        }
    }
    getShortDateFormat(format, locale) {
        const LANGUAGE = Config.getLanguageCode(locale);
        if (LANGUAGE === PSupportedLanguageCodes.de)
            return 'dd.MM.yyyy';
        // eslint-disable-next-line sonarjs/no-small-switch
        switch (locale) {
            case PSupportedLocaleIds.en_NL:
                return 'dd/MM/yyyy';
            default:
                return format;
        }
    }
    turnIntoAngularFormat(locale, format) {
        switch (format) {
            case 'shortTime':
                return this.getShortTimeFormat(format, locale);
            case 'veryShortTime':
                return this.getVeryShortTimeFormat(format, locale);
            case 'minimalDate':
                return this.getMinimalDateFormat(format, locale);
            case 'veryShortDate':
                return this.getVeryShortDateFormat(format, locale);
            case 'shortDate':
                return this.getShortDateFormat(format, locale);
            default:
                return format;
        }
    }
    /**
     * Generate human readable date from given timestamp
     */
    transform(value, format, timezoneInput, locale) {
        // In your app it is not possible to set a date to timestamp 30.12.1969 23:59:59:999 aka timestamp -1
        if (value === null)
            return '-';
        const LOCALE = locale !== null && locale !== void 0 ? locale : Config.LOCALE_ID;
        const APPEND = this.getCustomAppend(LOCALE, format);
        if (format !== undefined) {
            // We support more formats than the angular date pipe (e.g. 'veryShortDate'). They will be processed here.
            format = this.turnIntoAngularFormat(LOCALE, format);
        }
        let timezoneOffset;
        if (timezoneInput) {
            timezoneOffset = timezoneInput;
        }
        else {
            const TIME_ZONE = Config.getTimeZone(LOCALE);
            if (!TIME_ZONE) {
                const errorMsg = 'PDatePipe: TIME_ZONE is not defined [PLANO-21080]';
                if (Config.DEBUG)
                    if (this.console) {
                        this.console.error(errorMsg);
                    }
                    else {
                        console.error(errorMsg);
                    } // eslint-disable-line no-console
            }
            const mom = TIME_ZONE ? moment(value).tz(TIME_ZONE) : moment(value);
            timezoneOffset = mom.format('ZZ');
        }
        const date = this.datePipe.transform(value, format, timezoneOffset, LOCALE);
        if (date === null)
            return null;
        return `${date}${APPEND}`;
    }
    throwText(format, locale) {
        throw new Error(`date format for »${format}« is not defined for »${locale !== null && locale !== void 0 ? locale : Config.LOCALE_ID}« yet`);
    }
};
PDatePipe = __decorate([
    Pipe({ name: 'date' }),
    __metadata("design:paramtypes", [typeof (_a = typeof DatePipe !== "undefined" && DatePipe) === "function" ? _a : Object, Object])
], PDatePipe);
export { PDatePipe };
//# sourceMappingURL=p-date.pipe.js.map