var PInputService_1;
import { __decorate, __metadata } from "tslib";
import { getLocaleNumberSymbol, NumberSymbol } from '@angular/common';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { TIME_REGEXP, ValidatorsService } from '@plano/shared/core/validators.service';
import { PPossibleErrorNames } from '@plano/shared/core/validators.types';
import { PApiPrimitiveTypes } from '../../../../shared/api/base/generated-types.ag';
let PInputService = PInputService_1 = class PInputService {
    constructor() {
    }
    /**
     * Takes input like string '2.000'
     * and returns number 2000 if locale is Germany
     * or returns number 2 if locale is en
     */
    turnLocaleNumberIntoNumber(locale, input) {
        const separator = getLocaleNumberSymbol(locale, NumberSymbol.Decimal);
        const LOCALIZED_STRING = separator === '.' ? input : input.replace(separator, '.');
        return Number.isNaN(+LOCALIZED_STRING) ? LOCALIZED_STRING : +LOCALIZED_STRING;
    }
    /**
     * Takes input like number 2000.5
     * and returns locale number as string '2000,5' if locale is Germany
     * or returns '2000.5' if locale is en
     */
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    turnNumberIntoLocaleNumber(locale, input) {
        if (input === null || input === undefined)
            return '';
        const separator = getLocaleNumberSymbol(locale, NumberSymbol.Decimal);
        if (separator === '.')
            return input.toString();
        if (separator === ',')
            return input.toString().replace('.', separator);
        throw new Error('Unknown separator');
    }
    static validateLocaleAwareFloatTillSeparatorRegExString(locale) {
        const decimalSeparator = getLocaleNumberSymbol(locale, NumberSymbol.Decimal);
        const thousandsSeparator = decimalSeparator === ',' ? '.' : ',';
        return `^-?((0|([1-9]([0-9]{1,2})?([\\${thousandsSeparator}]?[0-9]{3})*))([\\${decimalSeparator}]`;
    }
    /**
     * locale get a regex for a float with two digits for provided locale
     */
    static localeAwareFloatWithTwoDigitsAfterSeparatorRegEx(locale) {
        const REGEX_FLOAT_TILL_SEPARATOR_STRING = PInputService_1.validateLocaleAwareFloatTillSeparatorRegExString(locale);
        const REGEX_STRING = `${REGEX_FLOAT_TILL_SEPARATOR_STRING}[0-9]{1,2})?)$`;
        return new RegExp(REGEX_STRING);
    }
    /**
     * Is this a valid currency amount?
     * OK: "12"
     * OK: "12,32"
     * OK: "12.32"
     * NOT OK: "12.1234"
     * NOT OK: "12 euro"
     */
    validateLocaleAwareCurrency(control, locale, currencyCode = null) {
        if (control.value === undefined)
            return null;
        if (control.value === '')
            return null;
        if (control.value === null)
            return null;
        const patternError = Validators.pattern(PInputService_1.localeAwareFloatWithTwoDigitsAfterSeparatorRegEx(locale))(control);
        if (!patternError)
            return null;
        return { [PPossibleErrorNames.CURRENCY]: {
                name: PPossibleErrorNames.CURRENCY,
                primitiveType: undefined,
                actual: control.value,
                currencyCode: currencyCode,
            } };
    }
    /**
     * locale get a regex for a float for provided locale
     */
    localeAwareFloatRegEx(locale) {
        const REGEX_FLOAT_TILL_SEPARATOR_STRING = PInputService_1.validateLocaleAwareFloatTillSeparatorRegExString(locale);
        const REGEX_STRING = `${REGEX_FLOAT_TILL_SEPARATOR_STRING}[0-9]+)?)$`;
        return new RegExp(REGEX_STRING);
    }
    get localeAwareTimeRegEx() {
        return new RegExp(TIME_REGEXP);
    }
    /**
     * Is this a valid time input? For germany:
     * OK: "9:30"
     * OK: "0:00"
     * OK: "23:59"
     * NOT OK: "4,5"
     * NOT OK: "99:99"
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validateLocaleAwareTime(control) {
        if (control.value === undefined)
            return null;
        if (control.value === '')
            return null;
        if (control.value === null)
            return null;
        const patternError = Validators.pattern(this.localeAwareTimeRegEx)(control);
        if (!patternError)
            return null;
        return { [PPossibleErrorNames.TIME]: { name: PPossibleErrorNames.TIME, primitiveType: undefined } };
    }
    /**
     * Is this a valid float?
     * OK: "12"
     * OK: "12,32"
     * OK: "12.32"
     * NOT OK: "12.1234"
     * NOT OK: "12 euro"
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validateLocaleAwareFloat(control, locale) {
        if (control.value === undefined)
            return null;
        if (control.value === '')
            return null;
        if (control.value === null)
            return null;
        const VALUE = this.turnLocaleNumberIntoNumber(locale, control.value);
        if (!!VALUE && Number.isNaN(+VALUE)) {
            // It is possible that the user is about to type 10,5 but only typed 10, yet. This gets handled here.
            if (control.value.match(/-?\d+[,.]$/))
                return {
                    [PPossibleErrorNames.NUMBER_NAN]: {
                        name: PPossibleErrorNames.NUMBER_NAN,
                        actual: control.value,
                    },
                };
            return { [PPossibleErrorNames.NUMBER_NAN]: {
                    name: PPossibleErrorNames.NUMBER_NAN,
                    actual: control.value,
                } };
        }
        const patternError = Validators.pattern(this.localeAwareFloatRegEx(locale))(control);
        if (!patternError)
            return null;
        return { float: { name: PPossibleErrorNames.FLOAT } };
    }
    /**
     * Turn into number, and then check how many digits are allowed.
     */
    maxDecimalPlacesCount(max, control, locale) {
        const NUMBER = this.turnLocaleNumberIntoNumber(locale, `${control.value}`);
        return new ValidatorsService().maxDecimalPlacesCount(max, PApiPrimitiveTypes.number).fn({ value: NUMBER });
    }
    /**
     * Turn into number, and then check min.
     */
    min(min, control, locale) {
        const NUMBER = this.turnLocaleNumberIntoNumber(locale, `${control.value}`);
        return new ValidatorsService().min(min, true, PApiPrimitiveTypes.number).fn({ value: NUMBER });
    }
    /**
     * Check if this is a whole number.
     * OK: "1", "12" or "123"
     * Not OK: "1,5", "1.5" or "foo"
     */
    integer(type, locale) {
        return (control) => {
            if (control.value === undefined)
                return null;
            if (control.value === '')
                return null;
            if (control.value === null)
                return null;
            const VALUE = this.turnLocaleNumberIntoNumber(locale, control.value);
            const TYPE = (typeof type === 'function') ? type() : (type !== null ? type : PApiPrimitiveTypes.Integer);
            if (!!VALUE && Number.isNaN(+VALUE)) {
                // It is possible that the user is about to type 10,5 but only typed 10, yet. This gets handled here.
                if (control.value.match(/-?\d+[,.]$/))
                    return {
                        [PPossibleErrorNames.NUMBER_NAN]: {
                            name: PPossibleErrorNames.NUMBER_NAN,
                            actual: control.value,
                            primitiveType: TYPE,
                        },
                    };
                return { [PPossibleErrorNames.NUMBER_NAN]: {
                        name: PPossibleErrorNames.NUMBER_NAN,
                        actual: control.value,
                        primitiveType: TYPE,
                    } };
            }
            // TODO: Remove the null check if possible. It was for backwards compatibility.
            // I replaced this.validators.integer with this.validators.integer(null) in our legacy code.
            if (control.value === null)
                return null;
            const NUMBER_ERRORS = new ValidatorsService().number(TYPE).fn({ value: VALUE });
            if (NUMBER_ERRORS)
                return NUMBER_ERRORS;
            if (Number.parseFloat(`${VALUE}`) === Number.parseInt(`${VALUE}`, 10))
                return null;
            return {
                [PPossibleErrorNames.MAX_DECIMAL_PLACES_COUNT]: {
                    name: PPossibleErrorNames.MAX_DECIMAL_PLACES_COUNT,
                    primitiveType: TYPE,
                    actual: control.value,
                    maxDigitsLength: 0,
                },
            };
        };
    }
};
PInputService = PInputService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], PInputService);
export { PInputService };
//# sourceMappingURL=p-input.service.js.map