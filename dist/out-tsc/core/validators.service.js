/* NOTE: Dont make this file even bigger. Invest some time to cleanup/split into several files */
/* eslint max-lines: ["error", 1300] */
var ValidatorsService_1;
import { __decorate, __metadata } from "tslib";
/**	NOTE: Do not make this service more complex than it already is */
/* eslint complexity: ["error", 41]  */
import * as IBAN from 'iban';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { getBase64Dimensions, getPngFileSize } from './base64-utils';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNotUndefined } from './null-type-utils';
import { PPossibleErrorNames, PValidatorObject } from './validators.types';
import { IdBase } from '../api/base/id-base';
// NOTE: 	US Number : ^-?\d{1,3}(\.?\d{3})*(,\d+)?$
// 				German Number : ^-?\d{1,3}(,?\d{3})*(\.\d+)?$
// eslint-disable-next-line unicorn/no-unsafe-regex
const NUMBER_REGEXP = new RegExp(/^-?\d{1,3}(\.?\d{3})*(,\d+)?$|^-?\d{1,3}(,?\d{3})*(\.\d+)?$/);
// Example link: https://s3.eu-central-1.amazonaws.com/files.dr-plano.com/dev/https://s3.eu-central-1.amazonaws.com/files.dr-plano.com/dev/company_logo.3908.png
// eslint-disable-next-line unicorn/no-unsafe-regex, regexp/no-super-linear-backtracking, prefer-regex-literals
const IMAGE_LINK_REGEXP = new RegExp('^https?://(?:[a-z\\d\-]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:jpg|jpeg|png)$');
export const TIME_REGEXP = /^(\d|0\d|1\d|2[0-3]):[0-5]\d$/;
/**
 * Custom validations for our forms
 */
let ValidatorsService = ValidatorsService_1 = class ValidatorsService {
    constructor() { }
    /**
     * @description
     * Validator that performs no operation.
     *
     * @see `updateValueAndValidity()`
     *
     */
    nullValidator() {
        return new PValidatorObject({
            name: null,
            fn: (control) => Validators.nullValidator(control),
        });
    }
    /**
     * Validator that requires the control's value to be greater than or equal to the provided number.
     */
    min(min, equalIsAllowed, type, comparedAttributeName, errorText) {
        const fn = (control) => {
            var _a;
            const TYPE = (typeof type === 'function') ? type() : type;
            const MIN = (_a = ((typeof min === 'function') ? min() : min)) !== null && _a !== void 0 ? _a : null;
            // cancel validation if any of the two values is null
            if (control.value === null)
                return null;
            if (MIN === null)
                return null;
            // do validation
            if (!equalIsAllowed) {
                const ERRORS = new ValidatorsService_1().greaterThan(MIN, TYPE, errorText).fn(control);
                if (!ERRORS)
                    return null;
                return {
                    [PPossibleErrorNames.GREATER_THAN]: {
                        comparedAttributeName: comparedAttributeName,
                        min: MIN + 1,
                        errorText: errorText,
                        ...ERRORS[PPossibleErrorNames.GREATER_THAN],
                    },
                };
            }
            else {
                const ERRORS = Validators.min(MIN)(control);
                if (!ERRORS)
                    return null;
                return {
                    [PPossibleErrorNames.MIN]: {
                        name: PPossibleErrorNames.MIN,
                        primitiveType: TYPE,
                        comparedAttributeName: comparedAttributeName,
                        errorText: errorText,
                        ...ERRORS[PPossibleErrorNames.MIN],
                    },
                };
            }
        };
        return new PValidatorObject({
            fn: fn,
            name: PPossibleErrorNames.MIN,
            comparedAttributeName: comparedAttributeName,
            comparedConst: (typeof min === 'function') ? min() : min,
        });
    }
    /**
     * Validator that requires the control's value to be less than or equal to the provided number.
     */
    max(max, equalIsAllowed, type, comparedAttributeName, errorText) {
        const fn = (control) => {
            var _a;
            const TYPE = (typeof type === 'function') ? type() : type;
            const MAX = (_a = ((typeof max === 'function') ? max() : max)) !== null && _a !== void 0 ? _a : null;
            // cancel the validation if any of the two values is null
            if (control.value === null)
                return null;
            if (MAX === null)
                return null;
            // do validation
            if (!equalIsAllowed) {
                const ERRORS = new ValidatorsService_1().lessThan(MAX, TYPE, errorText).fn(control);
                if (!ERRORS)
                    return null;
                return {
                    [PPossibleErrorNames.LESS_THAN]: {
                        ...ERRORS[PPossibleErrorNames.LESS_THAN],
                        name: PPossibleErrorNames.LESS_THAN,
                        primitiveType: TYPE,
                        comparedAttributeName: comparedAttributeName,
                        errorText: errorText,
                    },
                };
            }
            else {
                const ERRORS = Validators.max(MAX)(control);
                if (!ERRORS)
                    return null;
                return {
                    [PPossibleErrorNames.MAX]: {
                        name: PPossibleErrorNames.MAX,
                        primitiveType: TYPE,
                        comparedAttributeName: comparedAttributeName,
                        errorText: errorText,
                        ...ERRORS.max,
                    },
                };
            }
        };
        return new PValidatorObject({
            fn: fn,
            name: PPossibleErrorNames.MAX,
            comparedAttributeName: comparedAttributeName,
            comparedConst: (() => {
                if (equalIsAllowed)
                    return typeof max === 'function' ? max() : max;
                if (typeof max === 'function')
                    return () => {
                        const maxValue = max();
                        return maxValue === null ? maxValue : maxValue - 1;
                    };
                return max === null ? max : max - 1;
            })(),
        });
    }
    /**
     * Validator that requires the control's value to have a maximum of provided decimal numbers.
     */
    maxDecimalPlacesCount(max, type, errorText) {
        return new PValidatorObject({ name: PPossibleErrorNames.MAX_DECIMAL_PLACES_COUNT, fn: (control) => {
                if (control.value === null)
                    return null;
                if (control.value === '')
                    return null;
                assumeDefinedToGetStrictNullChecksRunning(control.value);
                // TODO: item.attributeInfoFoo.primitiveType can be undefined. We had this a lot in out app before we turned on strictNullChecks
                const TYPE = (typeof type === 'function') ? type() : type;
                const MAX = (typeof max === 'function') ? max() : max;
                let tempControlToTest = { value: TYPE === PApiPrimitiveTypes.string ? +control.value : control.value };
                // cancel the validation if any of the two values is null
                if (tempControlToTest.value === null)
                    return null;
                if (MAX === null)
                    return null;
                // For a string a value like '123' would be fine. This Validator assumes to get a number to test.
                // So we need to transform '123' to a number first.
                if (TYPE === PApiPrimitiveTypes.string) {
                    tempControlToTest = { value: +tempControlToTest.value };
                }
                const NUMBER_ERRORS = new ValidatorsService_1().number(TYPE).fn(tempControlToTest);
                if (NUMBER_ERRORS)
                    return NUMBER_ERRORS;
                if (tempControlToTest.value === +((+tempControlToTest.value).toFixed(MAX)))
                    return null;
                return {
                    [PPossibleErrorNames.MAX_DECIMAL_PLACES_COUNT]: {
                        name: PPossibleErrorNames.MAX_DECIMAL_PLACES_COUNT,
                        primitiveType: TYPE,
                        actual: control.value,
                        maxDigitsLength: MAX,
                        errorText: errorText,
                    },
                };
            },
        });
    }
    /**
     * Ensure that the value is "null".
     * Beware: Some types have values like '-1' to represent "null". This is considered inside this validator.
     */
    ensureNull(type, errorText) {
        // TODO: The api generator generates this for the "ensureNullWhenConditionIsFalse" attribute.
        // Normally, it does not make sense in UI because when something should be "null" the input field
        // will just be hidden (in which case no validation checks are done anyway). But, to be complete and consistent
        // we still have this validator.
        return new PValidatorObject({ name: PPossibleErrorNames.ENSURE_NULL, fn: (control) => {
                const TYPE = (typeof type === 'function') ? type() : type;
                if (control.value === null)
                    return null;
                return {
                    [PPossibleErrorNames.ENSURE_NULL]: {
                        name: PPossibleErrorNames.ENSURE_NULL,
                        primitiveType: TYPE,
                        actual: control.value,
                        errorText: errorText,
                    },
                };
            } });
    }
    /**
     * Check if there is any value
     * Beware: Some types have values like '-1' to represent "not set". This is considered inside this validator.
     */
    required(type, errorText) {
        return new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => {
                // This happens if its a function returning a primitive
                const TYPE = (typeof type === 'function') ? type() : type;
                // eslint-disable-next-line sonarjs/no-small-switch
                switch (TYPE) {
                    case PApiPrimitiveTypes.ApiList:
                        if (control.value.length > 0)
                            return null;
                        break;
                    default:
                        if (control.value !== undefined &&
                            control.value !== null &&
                            control.value !== '')
                            return null;
                        break;
                }
                return { [PPossibleErrorNames.REQUIRED]: {
                        name: PPossibleErrorNames.REQUIRED,
                        primitiveType: TYPE,
                        actual: control.value,
                        errorText: errorText,
                    } };
            } });
    }
    /**
     * Checks that the value is not `undefined`.
     */
    notUndefined(type, errorText) {
        return new PValidatorObject({ name: PPossibleErrorNames.NOT_UNDEFINED, fn: (control) => {
                const TYPE = (typeof type === 'function') ? type() : type;
                if (control.value !== undefined)
                    return null;
                return { [PPossibleErrorNames.NOT_UNDEFINED]: {
                        name: PPossibleErrorNames.NOT_UNDEFINED,
                        primitiveType: TYPE,
                        actual: control.value,
                        errorText: errorText,
                    } };
            } });
    }
    /**
     * Check if value is long enough
     * @param minLength the required minimum length
     */
    minLength(minLength, errorText) {
        return new PValidatorObject({ name: PPossibleErrorNames.MIN_LENGTH, fn: (control) => {
                if (control.value === null)
                    return null;
                const LENGTH = (() => {
                    if (typeof control.value === 'string')
                        return control.value.trim().length;
                    if (typeof control.value === 'number')
                        return control.value.toString().length;
                    return control.value.length;
                })();
                if (LENGTH >= minLength)
                    return null;
                return {
                    [PPossibleErrorNames.MIN_LENGTH]: {
                        name: PPossibleErrorNames.MIN_LENGTH,
                        primitiveType: undefined,
                        requiredLength: minLength,
                        actualLength: LENGTH,
                        errorText: errorText,
                    },
                };
            } });
    }
    /**
     * Check if value is short enough
     * @param maxLength the required maximum length
     */
    maxLength(maxLength, type, errorText) {
        return new PValidatorObject({ name: PPossibleErrorNames.MAX_LENGTH, fn: (control) => {
                const TYPE = (typeof type === 'function') ? type() : type;
                const ERRORS = Validators.maxLength(maxLength)(
                // eslint-disable-next-line unicorn/prefer-number-properties
                { value: control.value !== null && !isNaN(control.value) ? control.value.toString() : control.value });
                if (ERRORS === null)
                    return null;
                return {
                    [PPossibleErrorNames.MAX_LENGTH]: {
                        ...ERRORS[PPossibleErrorNames.MAX_LENGTH],
                        name: PPossibleErrorNames.MAX_LENGTH,
                        primitiveType: TYPE,
                        errorText: errorText,
                    },
                };
            } });
    }
    /**
     * Check if matches regex
     * @param pattern The regex the control value should be checked against
     */
    pattern(pattern) {
        return new PValidatorObject({ name: PPossibleErrorNames.PATTERN, fn: (control) => Validators.pattern(pattern)(control) });
    }
    /**
     * NEVER USE THIS! Use max() instead
     */
    maxDate() { return new PValidatorObject({ name: PPossibleErrorNames.MAX, fn: () => null }); }
    /**
     * Is value less then given float
     * 0.5 fails with max(0) but not with greaterThan(0);
     */
    lessThan(input, type, errorText) {
        return new PValidatorObject({ name: PPossibleErrorNames.LESS_THAN, fn: (control) => {
                if (control.value === undefined)
                    return null;
                if (control.value === '')
                    return null;
                if (control.value === null)
                    return null;
                const TYPE = (typeof type === 'function') ? type() : type;
                if (Number.isNaN(+control.value))
                    return null;
                if (control.value < input)
                    return null;
                return { [PPossibleErrorNames.LESS_THAN]: {
                        name: PPossibleErrorNames.LESS_THAN,
                        primitiveType: TYPE,
                        actual: control.value,
                        lessThan: input,
                        errorText: errorText,
                    } };
            } });
    }
    /**
     * Is value grater then given float
     * 0.5 fails with min(1) but not with greaterThan(0);
     */
    greaterThan(input, type, errorText) {
        return new PValidatorObject({ name: PPossibleErrorNames.GREATER_THAN, fn: (control) => {
                if (control.value === undefined)
                    return null;
                if (control.value === '')
                    return null;
                if (control.value === null)
                    return null;
                if (Number.isNaN(+control.value))
                    return null;
                const TYPE = (typeof type === 'function') ? type() : type;
                if (control.value > input)
                    return null;
                return { [PPossibleErrorNames.GREATER_THAN]: {
                        name: PPossibleErrorNames.GREATER_THAN,
                        primitiveType: TYPE,
                        actual: control.value,
                        greaterThan: input,
                        errorText: errorText,
                    } };
            } });
    }
    /**
     * Is this a valid phone number?
     * OK: "12345 - 1234567"
     * NOT OK: "1212 / 1234lorem"
     */
    phone(errorText) {
        const fn = (control) => {
            var _a;
            if (control.value === undefined)
                return null;
            if (control.value === '')
                return null;
            if (control.value === null)
                return null;
            const PHONE_REGEXP = /^\+?[\d -]*$/;
            const PATTERN_ERROR = Validators.pattern(PHONE_REGEXP)(control);
            if (PATTERN_ERROR)
                return { [PPossibleErrorNames.PHONE]: {
                        name: PPossibleErrorNames.PHONE,
                        primitiveType: PApiPrimitiveTypes.string,
                        actual: control.value,
                        errorText: errorText,
                    } };
            const REQUIRED_LENGTH = 3;
            const MIN_LENGTH_ERROR = new ValidatorsService_1().minLength(REQUIRED_LENGTH).fn({
                // eslint-disable-next-line unicorn/prefer-number-properties
                value: control.value !== null && !isNaN(control.value) ? control.value.toString() : control.value,
            });
            if (MIN_LENGTH_ERROR)
                return { [PPossibleErrorNames.MIN_LENGTH]: {
                        name: PPossibleErrorNames.MIN_LENGTH,
                        primitiveType: PApiPrimitiveTypes.Tel,
                        actual: control.value,
                        requiredLength: REQUIRED_LENGTH,
                        actualLength: (_a = control.value) === null || _a === void 0 ? void 0 : _a.length,
                    } };
            return null;
        };
        return new PValidatorObject({ name: PPossibleErrorNames.PHONE, fn: fn });
    }
    /**
     * Is this a valid url?
     */
    url(errorText) {
        const fn = (control) => {
            if (control.value === undefined)
                return null;
            if (control.value === '')
                return null;
            if (control.value === null)
                return null;
            switch (control.value) {
                case 'h':
                case 'ht':
                case 'htt':
                case 'http':
                case 'http:':
                case 'http:/':
                case 'http://':
                case 'http://w':
                case 'http://ww':
                case 'http://www':
                case 'http://www.':
                case 'https':
                case 'https:':
                case 'https:/':
                case 'https://':
                case 'https://w':
                case 'https://ww':
                case 'https://www':
                case 'https://www.':
                    return { [PPossibleErrorNames.URL_INCOMPLETE]: {
                            name: PPossibleErrorNames.URL_INCOMPLETE,
                            primitiveType: PApiPrimitiveTypes.Url,
                            actual: control.value,
                        } };
                default:
                    if (control.value.length < 8) {
                        return { [PPossibleErrorNames.URL_PROTOCOL_MISSING]: {
                                name: PPossibleErrorNames.URL_PROTOCOL_MISSING,
                                primitiveType: PApiPrimitiveTypes.Url,
                                actual: control.value,
                            } };
                    }
            }
            // Check for invalid patterns before required
            const HAS_WHITESPACE = Validators.pattern(/^\S*$/)(control);
            if (HAS_WHITESPACE) {
                return { [PPossibleErrorNames.WHITESPACE]: {
                        name: PPossibleErrorNames.WHITESPACE,
                        primitiveType: PApiPrimitiveTypes.Url,
                        actual: control.value,
                    } };
            }
            // regex copied from https://stackoverflow.com/a/3809435
            const URL_REGEXP = /https?:\/\/[\w#%+.:=@~-]{1,256}\.[\d()a-z]{1,6}\b([\w#%&()+./:=?@~äöü-]*)/gi;
            const patternError = Validators.pattern(URL_REGEXP)(control);
            if (!patternError)
                return null;
            return { [PPossibleErrorNames.URL]: {
                    name: PPossibleErrorNames.URL,
                    primitiveType: PApiPrimitiveTypes.Url,
                    actual: control.value,
                    errorText: errorText,
                } };
        };
        return new PValidatorObject({ name: PPossibleErrorNames.URL, fn: fn });
    }
    /**
     * Is this a valid domain?
     */
    domain(errorText) {
        const fn = (control) => {
            if (control.value === undefined)
                return null;
            if (control.value === '')
                return null;
            if (control.value === null)
                return null;
            // Check for invalid patterns before required
            const HAS_WHITESPACE = Validators.pattern(/^\S*$/)(control);
            if (HAS_WHITESPACE) {
                return { [PPossibleErrorNames.WHITESPACE]: {
                        name: PPossibleErrorNames.WHITESPACE,
                        primitiveType: PApiPrimitiveTypes.Url,
                        actual: control.value,
                    } };
            }
            // regex copied from https://stackoverflow.com/a/3809435
            // eslint-disable-next-line unicorn/no-unsafe-regex
            const DOMAIN_REGEXP = /(?:[\da-z](?:[\da-z-]{0,61}[\da-z])?\.)+[\da-z][\da-z-]{0,61}[\da-z]/gi;
            const patternError = Validators.pattern(DOMAIN_REGEXP)(control);
            if (!patternError)
                return null;
            return { [PPossibleErrorNames.DOMAIN]: {
                    name: PPossibleErrorNames.DOMAIN,
                    primitiveType: undefined,
                    actual: control.value,
                    errorText: errorText,
                } };
        };
        return new PValidatorObject({ name: PPossibleErrorNames.URL, fn: fn });
    }
    /**
     * Is this a valid IBAN code?
     */
    iban(errorText) {
        return new PValidatorObject({ name: PPossibleErrorNames.IBAN, fn: (control) => {
                if (control.value === undefined)
                    return null;
                if (control.value === '')
                    return null;
                if (control.value === null)
                    return null;
                const isValid = IBAN.isValid(control.value);
                if (isValid)
                    return null;
                return { [PPossibleErrorNames.IBAN]: {
                        name: PPossibleErrorNames.IBAN,
                        primitiveType: undefined,
                        actual: control.value,
                        errorText: errorText,
                    } };
            } });
    }
    /**
     * Is this a valid BIC code?
     */
    bic(errorText) {
        return new PValidatorObject({ name: PPossibleErrorNames.BIC, fn: (control) => {
                if (control.value === undefined)
                    return null;
                if (control.value === '')
                    return null;
                if (control.value === null)
                    return null;
                // regex copied from https://stackoverflow.com/a/15920158
                // eslint-disable-next-line unicorn/no-unsafe-regex
                const BIC_REGEXP = /^\s*[a-z]{6}[\da-z]{2}([\da-z]{3})?\s*$/i;
                const patternError = Validators.pattern(BIC_REGEXP)(control);
                if (!patternError)
                    return null;
                return { [PPossibleErrorNames.BIC]: {
                        name: PPossibleErrorNames.BIC,
                        primitiveType: undefined,
                        actual: control.value,
                        errorText: errorText,
                    } };
            } });
    }
    /**
     * Is this a valid password?
     */
    password() {
        const fn = (control) => {
            if (control.value === undefined)
                return null;
            if (control.value === '')
                return null;
            if (control.value === null)
                return null;
            // Check for invalid patterns before required
            const HAS_WHITESPACE = Validators.pattern(/^\S*$/)(control);
            if (HAS_WHITESPACE) {
                return { [PPossibleErrorNames.WHITESPACE]: {
                        name: PPossibleErrorNames.WHITESPACE,
                        primitiveType: undefined,
                        actual: control.value,
                    } };
            }
            const MIN_LENGTH = new ValidatorsService_1().minLength(7).fn(control);
            if (MIN_LENGTH) {
                return { [PPossibleErrorNames.MIN_LENGTH]: {
                        ...MIN_LENGTH[PPossibleErrorNames.MIN_LENGTH],
                        name: PPossibleErrorNames.MIN_LENGTH,
                        actual: control.value,
                    } };
            }
            const HAS_NO_NUMBER = Validators.pattern(/\d/)(control);
            if (HAS_NO_NUMBER) {
                return { [PPossibleErrorNames.NUMBERS_REQUIRED]: {
                        name: PPossibleErrorNames.NUMBERS_REQUIRED,
                        primitiveType: undefined,
                        actual: control.value,
                    } };
            }
            const HAS_NO_CHAR = Validators.pattern(/[A-Za-zÄÖÜäöü]/)(control);
            if (HAS_NO_CHAR) {
                return { [PPossibleErrorNames.LETTERS_REQUIRED]: {
                        name: PPossibleErrorNames.LETTERS_REQUIRED,
                        primitiveType: undefined,
                        actual: control.value,
                    } };
            }
            const HAS_NO_UPPERCASE_CHAR = Validators.pattern(/[A-ZÄÖÜ]+/)(control);
            if (HAS_NO_UPPERCASE_CHAR) {
                return { [PPossibleErrorNames.UPPERCASE_REQUIRED]: {
                        name: PPossibleErrorNames.UPPERCASE_REQUIRED,
                        primitiveType: undefined,
                        actual: control.value,
                    } };
            }
            return null;
        };
        return new PValidatorObject({
            name: PPossibleErrorNames.PASSWORD,
            fn: fn,
        });
    }
    /**
     * Is value upper case?
     */
    uppercase(errorText) {
        return new PValidatorObject({ name: PPossibleErrorNames.UPPERCASE, fn: (control) => {
                if (control.value === undefined)
                    return null;
                if (control.value === '')
                    return null;
                if (control.value === null)
                    return null;
                if (control.value === control.value.toUpperCase())
                    return null;
                return { [PPossibleErrorNames.UPPERCASE]: {
                        name: PPossibleErrorNames.UPPERCASE,
                        primitiveType: undefined,
                        actual: control.value,
                        errorText: errorText,
                    } };
            } });
    }
    /**
     * the .integer validator does not work on inputs that calculate timestamps internally.
     */
    integerDaysDuration(errorText) {
        return new PValidatorObject({ name: PPossibleErrorNames.INTEGER, fn: (control) => {
                if (control.value === undefined)
                    return null;
                if (control.value === '')
                    return null;
                if (control.value === null)
                    return null;
                const oneDayAsTimestamp = (24 * 60 * 60 * 1000);
                const isFullDay = (control.value % oneDayAsTimestamp) === 0;
                if (isFullDay)
                    return null;
                return { [PPossibleErrorNames.INTEGER]: {
                        name: PPossibleErrorNames.INTEGER,
                        primitiveType: undefined,
                        actual: control.value,
                        errorText: errorText,
                    } };
            } });
    }
    /**
     * Check if this is a number in a locale-fitting format.
     */
    number(type, errorText) {
        const fn = (control) => {
            if (control.value === undefined)
                return null;
            if (control.value === '')
                return null;
            if (control.value === null)
                return null;
            const TYPE = (typeof type === 'function') ? type() : type;
            if (control.value === null)
                return null;
            // eslint-disable-next-line unicorn/prefer-number-properties
            if (!!control.value && isNaN(control.value) && typeof control.value !== 'number') {
                // It is possible that the user is about to type 10,5 but only typed 10, yet. This gets handled here.
                // TODO: 	This regex expects to handle a locale based separator '12,', but this validator should not be used for
                // 				locale based values.
                if (control.value.match(/-?\d+[,.]$/))
                    return {
                        [PPossibleErrorNames.NUMBER_NAN]: {
                            name: PPossibleErrorNames.NUMBER_NAN,
                            primitiveType: TYPE,
                            actual: control.value,
                            errorText: errorText,
                        },
                    };
                return { [PPossibleErrorNames.NUMBER_NAN]: {
                        name: PPossibleErrorNames.NUMBER_NAN,
                        primitiveType: TYPE,
                        actual: control.value,
                        errorText: errorText,
                    } };
            }
            const HAS_WHITESPACE = Validators.pattern(/^\S*$/)(control);
            if (HAS_WHITESPACE)
                return { [PPossibleErrorNames.WHITESPACE]: {
                        name: PPossibleErrorNames.WHITESPACE,
                        primitiveType: TYPE,
                        actual: control.value,
                    } };
            const patternError = Validators.pattern(NUMBER_REGEXP)(control);
            if (!patternError)
                return null;
            return { [PPossibleErrorNames.FLOAT]: {
                    name: PPossibleErrorNames.FLOAT,
                    primitiveType: TYPE,
                    actual: control.value,
                    errorText: errorText,
                } };
        };
        return new PValidatorObject({ name: PPossibleErrorNames.NUMBER_NAN, fn: fn });
    }
    /**
     * Is this a valid currency amount?
     * OK: "12"
     * OK: "12,32"
     * OK: "12.32"
     * NOT OK: "12.1234"
     * NOT OK: "12 euro"
     */
    currency(errorText) {
        return new PValidatorObject({ name: PPossibleErrorNames.ENSURE_NULL, fn: (control) => {
                if (control.value === undefined)
                    return null;
                if (control.value === '')
                    return null;
                if (control.value === null)
                    return null;
                const NUMBER_ERRORS = new ValidatorsService_1().number(PApiPrimitiveTypes.Currency).fn(control);
                if (NUMBER_ERRORS)
                    return NUMBER_ERRORS;
                const DECIMAL_ERRORS = new ValidatorsService_1().maxDecimalPlacesCount(2, PApiPrimitiveTypes.Currency).fn(control);
                if (DECIMAL_ERRORS)
                    return DECIMAL_ERRORS;
                const patternError = Validators.pattern(NUMBER_REGEXP)(control);
                if (!patternError)
                    return null;
                return { [PPossibleErrorNames.CURRENCY]: {
                        name: PPossibleErrorNames.CURRENCY,
                        primitiveType: PApiPrimitiveTypes.Currency,
                        actual: control.value,
                        currencyCode: undefined,
                        errorText: errorText,
                    } };
            } });
    }
    /**
     * Valid email format?
     */
    email(errorText) {
        const fn = (control) => {
            if (control.value === undefined)
                return null;
            if (control.value === '')
                return null;
            if (control.value === null)
                return null;
            if (!control.value.includes('@'))
                return { [PPossibleErrorNames.EMAIL_WITHOUT_AT]: {
                        name: PPossibleErrorNames.EMAIL_WITHOUT_AT,
                        primitiveType: undefined,
                        actual: control.value,
                    } };
            // eslint-disable-next-line literal-blacklist/literal-blacklist, unicorn/no-unsafe-regex
            const E_MAIL_REGEXP = /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\wäöü\-]+\.)+[A-Za-z]{2,}))$/;
            const patternError = Validators.pattern(E_MAIL_REGEXP)(control);
            if (!patternError)
                return null;
            return { [PPossibleErrorNames.EMAIL]: {
                    name: PPossibleErrorNames.EMAIL,
                    primitiveType: undefined,
                    actual: control.value,
                    errorText: errorText,
                } };
        };
        return new PValidatorObject({ name: PPossibleErrorNames.EMAIL, fn: fn });
    }
    /**
     * Is this id defined?
     */
    idDefined(errorText) {
        return new PValidatorObject({ name: PPossibleErrorNames.ID_DEFINED, fn: (control) => {
                if (control.value === null)
                    return null;
                assumeNotUndefined(control.value);
                if (control.value instanceof IdBase)
                    return null;
                return { [PPossibleErrorNames.ID_DEFINED]: {
                        name: PPossibleErrorNames.ID_DEFINED,
                        primitiveType: undefined,
                        actual: control.value,
                        errorText: errorText,
                    } };
            } });
    }
    /**
     * Is this a PLZ?
     * OK: 12345
     * OK: 1234 (Österreich)
     */
    plz(errorText) {
        const fn = (control) => {
            const TYPE = PApiPrimitiveTypes.PostalCode;
            if (control.value === undefined)
                return null;
            if (control.value === '')
                return null;
            if (control.value === null)
                return null;
            const MIN_LENGTH_ERRORS = new ValidatorsService_1().minLength(4).fn(control);
            if (MIN_LENGTH_ERRORS)
                return {
                    [PPossibleErrorNames.MIN_LENGTH]: {
                        ...MIN_LENGTH_ERRORS[PPossibleErrorNames.MIN_LENGTH],
                        name: PPossibleErrorNames.MIN_LENGTH,
                        actual: control.value,
                        errorText: errorText,
                    },
                };
            const ERRORS = new ValidatorsService_1().maxLength(8, TYPE).fn(control);
            if (ERRORS)
                return {
                    [PPossibleErrorNames.MAX_LENGTH]: {
                        ...ERRORS[PPossibleErrorNames.MAX_LENGTH],
                        primitiveType: undefined,
                        actual: control.value,
                        errorText: errorText,
                    },
                };
            return null;
            // NOTE: We had this more fine-tuned list of validations before we opened it up to the validation above
            // const checkPlzAgainstRegExp = (regex : RegExp) => (control.value).toString().match(new RegExp(regex));
            // if (checkPlzAgainstRegExp(/^.{4,8}$/)) return null;
            // const checkPlzAgainstRegExp = (regex : RegExp) => (control.value).toString().match(new RegExp(regex));
            //
            // // DE
            // if (checkPlzAgainstRegExp(/^\d{5}$/)) return null;
            // // AT & BE
            // if (checkPlzAgainstRegExp(/^\d{4,5}$/)) return null;
            // // NL
            // if (checkPlzAgainstRegExp(/^\d{4}\s?[A-Za-z]{2}$/)) return null;
            // // GB
            // const REGEX_GB = /^(([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9][A-Za-z]?))))\s?[0-9][A-Za-z]{2}))$/;
            // if (checkPlzAgainstRegExp(REGEX_GB)) {
            // 	return null;
            // }
        };
        return new PValidatorObject({ name: PPossibleErrorNames.PLZ, fn: fn });
    }
    /**
     * Check if value matches the definition of a freeclimber id.
     * Before we had this we had chars in the ID’s which freeclimber could not handle.
     */
    freeclimberArticleId(type) {
        const fn = (control) => {
            // TODO: item.attributeInfoFoo.primitiveType can be undefined. We had this a lot in out app before we turned on strictNullChecks
            const TYPE = (typeof type === 'function') ? type() : type;
            if (control.value === undefined || control.value === '')
                return null;
            assumeDefinedToGetStrictNullChecksRunning(control.value);
            const REQUIRED_ERROR = Validators.required(control);
            if (REQUIRED_ERROR)
                return {
                    [PPossibleErrorNames.REQUIRED]: {
                        name: PPossibleErrorNames.REQUIRED,
                        primitiveType: TYPE,
                        actual: control.value,
                    },
                };
            const INTEGER_ERROR = new ValidatorsService_1().maxDecimalPlacesCount(0, TYPE).fn(control);
            if (INTEGER_ERROR)
                return INTEGER_ERROR;
            const MIN_ERROR = new ValidatorsService_1().min(1, true, TYPE).fn(control);
            if (MIN_ERROR)
                return MIN_ERROR;
            return null;
        };
        return new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: fn });
    }
    /**
     * Check if value is the same as another value
     * @param otherPassword the password to be compared with value
     */
    confirmPassword(otherPassword) {
        const fn = (control) => {
            const OTHER_PASSWORD = otherPassword();
            if (!OTHER_PASSWORD)
                return null;
            if (!control.value && !OTHER_PASSWORD)
                return null;
            if (control.value === OTHER_PASSWORD)
                return null;
            return {
                [PPossibleErrorNames.PASSWORD_UNCONFIRMED]: {
                    name: PPossibleErrorNames.PASSWORD_UNCONFIRMED,
                    primitiveType: PApiPrimitiveTypes.string,
                },
            };
        };
        return new PValidatorObject({ name: PPossibleErrorNames.PASSWORD_UNCONFIRMED, fn: fn });
    }
    /**
     * @param ratio The expected image ratio (= width / height).
     */
    imageRatio(ratio) {
        return new PValidatorObject({
            name: PPossibleErrorNames.IMAGE_RATIO,
            fn: (control) => {
                if (control.value === undefined)
                    return null;
                if (control.value === '')
                    return null;
                if (control.value === null)
                    return null;
                if (control.value.match(IMAGE_LINK_REGEXP))
                    return null;
                const dimensions = getBase64Dimensions(control.value);
                const actualRatio = dimensions.width / dimensions.height;
                const actualRatioRounded = Math.round(actualRatio * 10) / 10;
                const ratioRounded = Math.round(ratio * 10) / 10;
                if (actualRatioRounded === ratioRounded)
                    return null;
                return {
                    [PPossibleErrorNames.IMAGE_RATIO]: {
                        name: PPossibleErrorNames.IMAGE_RATIO,
                        primitiveType: PApiPrimitiveTypes.Image,
                        actual: actualRatioRounded,
                        expected: ratioRounded,
                    },
                };
            },
            comparedConst: ratio,
        });
    }
    /**
     * @param maxFileSize Max file size in kilobytes.
     */
    imageMaxFileSize(maxFileSize) {
        return new PValidatorObject({
            name: PPossibleErrorNames.IMAGE_MAX_FILE_SIZE,
            fn: (control) => {
                if (control.value === undefined)
                    return null;
                if (control.value === '')
                    return null;
                if (control.value === null)
                    return null;
                // Is this a url of an image?
                if (control.value.match(IMAGE_LINK_REGEXP))
                    return null;
                const sizeInKb = getPngFileSize(control.value);
                if (sizeInKb <= maxFileSize)
                    return null;
                return {
                    [PPossibleErrorNames.IMAGE_MAX_FILE_SIZE]: {
                        name: PPossibleErrorNames.IMAGE_MAX_FILE_SIZE,
                        primitiveType: PApiPrimitiveTypes.Image,
                        actual: sizeInKb,
                        expected: maxFileSize,
                    },
                };
            },
            comparedConst: maxFileSize,
        });
    }
    /**
     * @param minWidth Min image width in pixels.
     */
    imageMinWidth(minWidth) {
        return new PValidatorObject({
            name: PPossibleErrorNames.IMAGE_MIN_WIDTH,
            fn: (control) => {
                if (control.value === undefined)
                    return null;
                if (control.value === '')
                    return null;
                if (control.value === null)
                    return null;
                // Is this a url of an image?
                if (control.value.match(IMAGE_LINK_REGEXP))
                    return null;
                const dimensions = getBase64Dimensions(control.value);
                if (dimensions.width >= minWidth)
                    return null;
                return {
                    [PPossibleErrorNames.IMAGE_MIN_WIDTH]: {
                        name: PPossibleErrorNames.IMAGE_MIN_WIDTH,
                        primitiveType: PApiPrimitiveTypes.Image,
                        actual: dimensions.width,
                        expected: minWidth,
                    },
                };
            },
            comparedConst: minWidth,
        });
    }
    /**
     * @param minHeight Min image height in pixels.
     */
    imageMinHeight(minHeight) {
        return new PValidatorObject({
            name: PPossibleErrorNames.IMAGE_MIN_HEIGHT,
            fn: (control) => {
                if (control.value === undefined)
                    return null;
                if (control.value === '')
                    return null;
                if (control.value === null)
                    return null;
                if (control.value.match(IMAGE_LINK_REGEXP))
                    return null;
                const dimensions = getBase64Dimensions(control.value);
                if (dimensions.height >= minHeight)
                    return null;
                return {
                    [PPossibleErrorNames.IMAGE_MIN_HEIGHT]: {
                        name: PPossibleErrorNames.IMAGE_MIN_HEIGHT,
                        primitiveType: PApiPrimitiveTypes.Image,
                        actual: dimensions.height,
                        expected: minHeight,
                    },
                };
            },
            comparedConst: minHeight,
        });
    }
    /**
     * @param maxHeight Max image height in pixels.
     */
    imageMaxHeight(maxHeight) {
        return new PValidatorObject({
            name: PPossibleErrorNames.IMAGE_MAX_HEIGHT,
            // We don’t validate max-width and max-height. Our image-cropper component crops it down to the max.
            fn: () => null,
            comparedConst: maxHeight,
        });
    }
    /**
     * @param maxWidth Max image width in pixels.
     */
    imageMaxWidth(maxWidth) {
        return new PValidatorObject({
            name: PPossibleErrorNames.IMAGE_MAX_WIDTH,
            // We don’t validate max-width and max-height. Our image-cropper component crops it down to the max.
            fn: () => null,
            comparedConst: maxWidth,
        });
    }
};
ValidatorsService = ValidatorsService_1 = __decorate([
    Injectable({
        providedIn: 'root',
    }),
    __metadata("design:paramtypes", [])
], ValidatorsService);
export { ValidatorsService };
//# sourceMappingURL=validators.service.js.map