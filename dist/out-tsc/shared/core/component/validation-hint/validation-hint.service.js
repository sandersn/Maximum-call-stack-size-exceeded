var _a;
import { __decorate, __metadata } from "tslib";
/* eslint complexity: ["error", 50]  */
import { DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '../../config';
import { LogService } from '../../log.service';
import { LocalizePipe } from '../../pipe/localize.pipe';
import { PCurrencyPipe } from '../../pipe/p-currency.pipe';
import { AngularDatePipeFormat, PDateFormat, PDatePipe } from '../../pipe/p-date.pipe';
import { PSupportedTimeZoneOffset } from '../../time-zones.enums';
import { PPossibleErrorNames } from '../../validators.types';
let ValidationHintService = class ValidationHintService {
    constructor(localize, decimalPipe, console, datePipe, currencyPipe) {
        this.localize = localize;
        this.decimalPipe = decimalPipe;
        this.console = console;
        this.datePipe = datePipe;
        this.currencyPipe = currencyPipe;
    }
    // error : ValidatorsServiceReturnType<'min'>
    // TODO: min() now returns PValidatorObject. So ValidatorsServiceReturnType only works for PValidatorFn.
    getMinText(error, labelOfComparedControl) {
        if (!!labelOfComparedControl)
            return this.localize.transform('Diese Eingabe darf nicht kleiner sein als »${labelOfComparedControl}«.', {
                labelOfComparedControl: labelOfComparedControl,
            });
        if (error.min === 0)
            return this.localize.transform('Bitte keine negativen Zahlen.');
        let errorText = undefined;
        if (!!error.errorText)
            errorText = typeof error.errorText === 'string' ? error.errorText : error.errorText();
        switch (error.primitiveType) {
            case PApiPrimitiveTypes.LocalTime:
                errorText = errorText !== null && errorText !== void 0 ? errorText : 'Bitte mindestens die Zeit »${min}« eingeben.';
                return this.localize.transform(errorText, {
                    min: this.datePipe.transform(error.min, PDateFormat.VERY_SHORT_TIME, PSupportedTimeZoneOffset.NO_ZONE),
                });
            case PApiPrimitiveTypes.DateTime:
                errorText = errorText !== null && errorText !== void 0 ? errorText : 'Bitte mindestens die Zeit »${min}« eingeben.';
                return this.localize.transform(errorText, {
                    min: this.datePipe.transform(error.min, AngularDatePipeFormat.SHORT),
                });
            case PApiPrimitiveTypes.Date:
            case PApiPrimitiveTypes.DateExclusiveEnd:
                errorText = errorText !== null && errorText !== void 0 ? errorText : 'Bitte mindestens das Datum »${min}« eingeben.';
                return this.localize.transform(errorText, {
                    min: this.datePipe.transform(error.min),
                });
            case PApiPrimitiveTypes.Percent:
                errorText = errorText !== null && errorText !== void 0 ? errorText : 'Bitte mindestens »${min}« eingeben.';
                return this.localize.transform(errorText, {
                    min: this.datePipe.transform(error.min * 100),
                });
            default:
                errorText = errorText !== null && errorText !== void 0 ? errorText : 'Bitte mindestens »${min}« eingeben.';
                return this.localize.transform(errorText, error, false);
        }
    }
    // error : ValidatorsServiceReturnType<'min'>
    getMaxText(error, labelOfComparedControl) {
        if (!!labelOfComparedControl)
            return this.localize.transform('Diese Eingabe darf nicht größer sein als »${labelOfComparedControl}«.', {
                labelOfComparedControl: labelOfComparedControl,
            });
        let errorText = undefined;
        if (!!error.errorText)
            errorText = typeof error.errorText === 'string' ? error.errorText : error.errorText();
        let errorObj = error['max'];
        switch (error.primitiveType) {
            case PApiPrimitiveTypes.LocalTime:
                errorText = errorText !== null && errorText !== void 0 ? errorText : 'Bitte höchstens die Zeit »${max}« eingeben.';
                errorObj = { ...error, max: this.datePipe.transform(error['max'], PDateFormat.VERY_SHORT_TIME, PSupportedTimeZoneOffset.NO_ZONE),
                };
                break;
            case PApiPrimitiveTypes.DateTime:
                errorText = errorText !== null && errorText !== void 0 ? errorText : 'Bitte höchstens die Zeit »${max}« eingeben.';
                errorObj = { ...error, max: this.datePipe.transform(error['max'], AngularDatePipeFormat.SHORT) };
                break;
            case PApiPrimitiveTypes.Date:
            case PApiPrimitiveTypes.DateExclusiveEnd:
                errorText = errorText !== null && errorText !== void 0 ? errorText : 'Bitte höchstens das Datum »${max}« eingeben.';
                errorObj = { ...error, max: this.datePipe.transform(error['max']) };
                break;
            case PApiPrimitiveTypes.Currency:
                errorText = errorText !== null && errorText !== void 0 ? errorText : 'Bitte höchstens »${max}« eingeben.';
                errorObj = { ...error, max: this.currencyPipe.transform(error['max']) };
                break;
            case PApiPrimitiveTypes.Percent:
                errorText = errorText !== null && errorText !== void 0 ? errorText : 'Bitte höchstens »${max}« eingeben.';
                errorObj = { ...error, max: this.currencyPipe.transform(error['max'] * 100) };
                break;
            default:
                errorText = errorText !== null && errorText !== void 0 ? errorText : 'Bitte höchstens »${max}« eingeben.';
                errorObj = error;
        }
        return this.localize.transform(errorText, errorObj, false);
    }
    getGreaterThanText(error, labelOfComparedControl) {
        if (!!labelOfComparedControl)
            return this.localize.transform('Eingabe muss größer sein als »${labelOfComparedControl}«.', {
                labelOfComparedControl: labelOfComparedControl,
            });
        let errorText = undefined;
        if (!!error.errorText)
            errorText = typeof error.errorText === 'string' ? error.errorText : error.errorText();
        switch (error.primitiveType) {
            case PApiPrimitiveTypes.LocalTime:
                errorText = errorText !== null && errorText !== void 0 ? errorText : 'Bitte eine Zeit später als »${greaterThan}« eingeben.';
                return this.localize.transform(errorText, {
                    greaterThan: this.datePipe.transform(error.greaterThan, PDateFormat.VERY_SHORT_TIME, PSupportedTimeZoneOffset.NO_ZONE),
                });
            case PApiPrimitiveTypes.DateTime:
                errorText = errorText !== null && errorText !== void 0 ? errorText : 'Bitte eine Zeit später als »${greaterThan}« eingeben.';
                return this.localize.transform(errorText, {
                    greaterThan: this.datePipe.transform(error.greaterThan, AngularDatePipeFormat.SHORT),
                });
            case PApiPrimitiveTypes.Date:
            case PApiPrimitiveTypes.DateExclusiveEnd:
                errorText = errorText !== null && errorText !== void 0 ? errorText : 'Bitte ein Datum später als »${greaterThan}« eingeben.';
                return this.localize.transform(errorText, {
                    greaterThan: this.datePipe.transform(error.greaterThan),
                });
            case PApiPrimitiveTypes.Percent:
                errorText = errorText !== null && errorText !== void 0 ? errorText : 'Bitte eine Zahl größer als »${greaterThan}« eingeben.';
                return this.localize.transform(errorText, {
                    greaterThan: this.datePipe.transform(error.greaterThan * 100),
                });
            default:
                errorText = errorText !== null && errorText !== void 0 ? errorText : 'Bitte eine Zahl größer als »${greaterThan}« eingeben.';
                return this.localize.transform(errorText, error, false);
        }
    }
    getLessThanText(error, labelOfComparedControl) {
        if (!!labelOfComparedControl)
            return this.localize.transform('Eingabe muss kleiner sein als »${labelOfComparedControl}«.', {
                labelOfComparedControl: labelOfComparedControl,
            });
        let errorText = undefined;
        if (!!error.errorText)
            errorText = typeof error.errorText === 'string' ? error.errorText : error.errorText();
        switch (error.primitiveType) {
            case PApiPrimitiveTypes.LocalTime:
                errorText = errorText !== null && errorText !== void 0 ? errorText : 'Bitte eine Zeit früher als »${lessThan}« eingeben.';
                return this.localize.transform(errorText, {
                    lessThan: this.datePipe.transform(error['lessThan'], PDateFormat.VERY_SHORT_TIME, PSupportedTimeZoneOffset.NO_ZONE),
                });
            case PApiPrimitiveTypes.DateTime:
                errorText = errorText !== null && errorText !== void 0 ? errorText : 'Bitte eine Zeit früher als »${lessThan}« eingeben.';
                return this.localize.transform(errorText, {
                    lessThan: this.datePipe.transform(error['lessThan'], AngularDatePipeFormat.SHORT),
                });
            case PApiPrimitiveTypes.Date:
            case PApiPrimitiveTypes.DateExclusiveEnd:
                errorText = errorText !== null && errorText !== void 0 ? errorText : 'Bitte ein Datum früher als »${lessThan}« eingeben.';
                return this.localize.transform(errorText, {
                    lessThan: this.datePipe.transform(error['lessThan']),
                });
            case PApiPrimitiveTypes.Percent:
                errorText = errorText !== null && errorText !== void 0 ? errorText : 'Bitte eine Zahl kleiner als »${lessThan}« eingeben.';
                return this.localize.transform(errorText, {
                    lessThan: this.datePipe.transform(error['lessThan'] * 100),
                });
            default:
                errorText = errorText !== null && errorText !== void 0 ? errorText : 'Bitte eine Zahl kleiner als »${lessThan}« eingeben.';
                return this.localize.transform(errorText, error, false);
        }
    }
    /* eslint complexity: ["error", 150] sonarjs/cognitive-complexity: ["error", 180] */
    /**
     * Get an error value object, and generate a human readable error message text from it.
     */
    getErrorText(error, labelOfComparedControl) {
        var _a;
        const name = error.name;
        if (error.errorText)
            return this.localize.transform(typeof error.errorText === 'string' ? error.errorText : error.errorText(), error, false);
        switch (name) {
            case PPossibleErrorNames.MIN_LENGTH:
                return this.localize.transform('Bitte mindestens ${requiredLength} Zeichen eingeben. ${actualLength} ist zu wenig.', error, false);
            case PPossibleErrorNames.MAX:
                return this.getMaxText(error, labelOfComparedControl);
            case PPossibleErrorNames.MIN:
                return this.getMinText(error, labelOfComparedControl);
            case PPossibleErrorNames.REQUIRED:
            case PPossibleErrorNames.ID_DEFINED:
            case PPossibleErrorNames.NOT_UNDEFINED:
                return this.localize.transform('Diese Eingabe ist Pflicht.');
            case PPossibleErrorNames.PLZ:
                return this.localize.transform('Das ist keine gültige Postleitzahl.');
            case PPossibleErrorNames.UPPERCASE:
                return this.localize.transform('Nur Großbuchstaben erlaubt.');
            case PPossibleErrorNames.GREATER_THAN:
                return this.getGreaterThanText(error, labelOfComparedControl);
            case PPossibleErrorNames.LESS_THAN:
                return this.getLessThanText(error, labelOfComparedControl);
            case PPossibleErrorNames.FLOAT:
                return this.localize.transform('Bitte nur Zahlen eingeben, z.B. »${example1}« oder »${example2}«.', {
                    example1: this.decimalPipe.transform(10),
                    example2: this.decimalPipe.transform(3.5),
                });
            case PPossibleErrorNames.INTEGER:
                return this.localize.transform('Bitte nur ganze Zahlen eingeben, z.B. »${example}«.', { example: this.decimalPipe.transform(10) });
            case PPossibleErrorNames.MAX_DECIMAL_PLACES_COUNT:
                if (error['maxDigitsLength'] === 0) {
                    return this.localize.transform('Bitte nur ganze Zahlen eingeben, z.B. »${example}«.', { example: this.decimalPipe.transform(10) });
                }
                return this.localize.transform('Bitte höchstens ${maxDigitsLength} Nachkommastellen eintragen.', error, false);
            case PPossibleErrorNames.CURRENCY:
                const example1 = this.decimalPipe.transform(10);
                let example2 = this.currencyPipe.transform(12.5, ((_a = error['currencyCode']) !== null && _a !== void 0 ? _a : Config.CURRENCY_CODE), '');
                if (example2)
                    example2 = example2.trim();
                return this.localize.transform('Falsches Format eingegeben. Richtig wären z.B. »${example1}« oder »${example2}«.', {
                    example1: example1,
                    example2: example2,
                });
            case PPossibleErrorNames.TIME:
                return this.localize.transform('Bitte Zeit eingeben, z.B. »${example1}« oder »${example2}«.', {
                    example1: this.datePipe.transform(34200000, 'veryShortTime'),
                    example2: this.datePipe.transform(86340000, 'veryShortTime'), // ➡ 23:59
                });
            case PPossibleErrorNames.EMAIL_WITHOUT_AT:
                return this.localize.transform('Es fehlt das »@« Zeichen.');
            case PPossibleErrorNames.URL_PROTOCOL_MISSING:
                return this.localize.transform('Bitte mit »http://« oder »https://« beginnen.');
            case PPossibleErrorNames.DOMAIN:
                return this.localize.transform('Das Format der eingegebenen Domain ist fehlerhaft.');
            case PPossibleErrorNames.URL:
            case PPossibleErrorNames.EMAIL:
            case PPossibleErrorNames.IBAN:
            case PPossibleErrorNames.BIC:
                return this.localize.transform('Falsches Format eingegeben.');
            case PPossibleErrorNames.PHONE:
                return this.localize.transform('Unzulässiges Zeichen eingegeben. Richtiges Beispiel: »+49 123 0000000«.');
            case PPossibleErrorNames.MAX_LENGTH:
                return this.localize.transform('Bitte maximal ${requiredLength} Zeichen eingeben. ${actualLength} ist zu viel.', error, false);
            case PPossibleErrorNames.WHITESPACE:
                return this.localize.transform('Bitte keine Leerzeichen eingeben.', error, false);
            case PPossibleErrorNames.NUMBERS_REQUIRED:
                return this.localize.transform('Das Passwort muss Zahlen enthalten.', error, false);
            case PPossibleErrorNames.LETTERS_REQUIRED:
                return this.localize.transform('Das Passwort muss Buchstaben enthalten.', error, false);
            case PPossibleErrorNames.UPPERCASE_REQUIRED:
                return this.localize.transform('Das Passwort muss Großbuchstaben enthalten.');
            case PPossibleErrorNames.EMAIL_INVALID:
                return this.localize.transform('Diese Email-Adresse scheint nicht zu existieren.', error, false);
            case PPossibleErrorNames.EMAIL_USED:
                return this.localize.transform('Diese Email Adresse ist bereits benutzt.', error, false);
            case PPossibleErrorNames.NUMBER_NAN:
                return this.localize.transform('»${actual}« ist keine Zahl.', error, false);
            case PPossibleErrorNames.PASSWORD_UNCONFIRMED:
                return this.localize.transform('Die Passwort-Wiederholung stimmt nicht.', error, false);
            case PPossibleErrorNames.IMAGE_MIN_HEIGHT:
                return this.localize.transform('Das Bild ist nicht hoch genug.', error, false);
            case PPossibleErrorNames.IMAGE_MIN_WIDTH:
                return this.localize.transform('Das Bild ist nicht breit genug.', error, false);
            case PPossibleErrorNames.IMAGE_MAX_FILE_SIZE:
                return PPossibleErrorNames.IMAGE_MAX_FILE_SIZE;
            case PPossibleErrorNames.IMAGE_RATIO:
                return PPossibleErrorNames.IMAGE_RATIO;
            case PPossibleErrorNames.URL_INCOMPLETE:
                return this.localize.transform('URL unvollständig', error, false);
            case undefined:
                this.console.error('error.name should never be undefined');
                return 'undefined';
            case PPossibleErrorNames.PATTERN:
            case PPossibleErrorNames.PASSWORD:
            case PPossibleErrorNames.IMAGE_MAX_HEIGHT:
            case PPossibleErrorNames.IMAGE_MAX_WIDTH:
                return this.localize.transform('Überprüfe bitte deine Eingabe.');
            case PPossibleErrorNames.FIRST_FEE_PERIOD_START_IS_NULL:
                return this.localize.transform('Der Start deiner letzten Zeitspanne sollte »UNBEGRENZT« sein.');
            case PPossibleErrorNames.OCCUPIED:
                return this.localize.transform('Ist bereits vergeben.');
            case PPossibleErrorNames.ENSURE_NULL:
                this.console.warn('ENSURE_NULL should never touch the UI');
                return this.localize.transform('Überprüfe bitte deine Eingabe.');
        }
    }
};
ValidationHintService = __decorate([
    Injectable({ providedIn: 'root' }),
    __metadata("design:paramtypes", [LocalizePipe, typeof (_a = typeof DecimalPipe !== "undefined" && DecimalPipe) === "function" ? _a : Object, LogService,
        PDatePipe,
        PCurrencyPipe])
], ValidationHintService);
export { ValidationHintService };
//# sourceMappingURL=validation-hint.service.js.map