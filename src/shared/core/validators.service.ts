/* NOTE: Dont make this file even bigger. Invest some time to cleanup/split into several files */
/* eslint max-lines: ["error", 1300] */

/**	NOTE: Do not make this service more complex than it already is */
/* eslint complexity: ["error", 41]  */
import * as IBAN from 'iban';
import { Injectable } from '@angular/core';
import { AbstractControl} from '@angular/forms';
import { Validators } from '@angular/forms';
import { Integer } from '@plano/shared/api/base/generated-types.ag';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { getBase64Dimensions, getPngFileSize } from './base64-utils';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNotUndefined } from './null-type-utils';
import { PDictionarySourceString } from './pipe/localize.dictionary';
import { PPossibleErrorNames, PValidatorObject } from './validators.types';
import { PValidationErrors, PValidationErrorValue, PValidatorFn, ValidatorsServiceReturnType } from './validators.types';
import { IdBase } from '../api/base/id-base';

// NOTE: 	US Number : ^-?\d{1,3}(\.?\d{3})*(,\d+)?$
// 				German Number : ^-?\d{1,3}(,?\d{3})*(\.\d+)?$
// eslint-disable-next-line unicorn/no-unsafe-regex
const NUMBER_REGEXP : RegExp = new RegExp(/^-?\d{1,3}(\.?\d{3})*(,\d+)?$|^-?\d{1,3}(,?\d{3})*(\.\d+)?$/);

// Example link: https://s3.eu-central-1.amazonaws.com/files.dr-plano.com/dev/https://s3.eu-central-1.amazonaws.com/files.dr-plano.com/dev/company_logo.3908.png
// eslint-disable-next-line unicorn/no-unsafe-regex, regexp/no-super-linear-backtracking, prefer-regex-literals
const IMAGE_LINK_REGEXP : RegExp = new RegExp('^https?://(?:[a-z\\d\-]+\.)+[a-z]{2,6}(?:/[^/#?]+)+\.(?:jpg|jpeg|png)$');

export const TIME_REGEXP : RegExp = /^(\d|0\d|1\d|2[0-3]):[0-5]\d$/;

/**
 * Custom validations for our forms
 */

@Injectable({
	providedIn: 'root',
})
export class ValidatorsService {
	constructor() {}

	/**
	 * @description
	 * Validator that performs no operation.
	 *
	 * @see `updateValueAndValidity()`
	 *
	 */
	public nullValidator() : PValidatorObject {
		return new PValidatorObject({
			name: null,
			fn: (control) => Validators.nullValidator(control as AbstractControl),
		});
	}

	/**
	 * Validator that requires the control's value to be greater than or equal to the provided number.
	 */
	public min(
		min : number | null | (() => number | null),
		equalIsAllowed : boolean,
		type : PApiPrimitiveTypes | (() => PApiPrimitiveTypes),
		comparedAttributeName ?: string,
		errorText ?: PDictionarySourceString | (() => PDictionarySourceString),
	) : PValidatorObject<PValidatorFn<PValidationErrors<PValidationErrorValue & {min : number} | ValidatorsServiceReturnType<'greaterThan'>> | null>> {

		const fn = (control : Pick<AbstractControl, 'value'>) : ReturnType<ReturnType<ValidatorsService['min']>['fn']> => {
			const TYPE = (typeof type === 'function') ? type() : type;
			const MIN = ((typeof min === 'function') ? min() : min) ?? null;

			// cancel validation if any of the two values is null
			if (control.value === null) return null;
			if (MIN === null) return null;

			// do validation
			if (!equalIsAllowed) {
				const ERRORS = new ValidatorsService().greaterThan(MIN, TYPE, errorText).fn(control);
				if (!ERRORS) return null;
				return {
					[PPossibleErrorNames.GREATER_THAN]: {
						comparedAttributeName: comparedAttributeName,
						min: MIN + 1,
						errorText: errorText,
						...ERRORS[PPossibleErrorNames.GREATER_THAN],
					},
				};
			} else {
				const ERRORS = Validators.min(MIN)(control as AbstractControl) as {min : {min : number, actual : number}} | null;
				if (!ERRORS) return null;
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
	public max(
		max : number | null | (() => number | null),
		equalIsAllowed : boolean,
		type : PApiPrimitiveTypes | (() => PApiPrimitiveTypes),
		comparedAttributeName ?: string,
		errorText ?: PDictionarySourceString | (() => PDictionarySourceString),
	) : PValidatorObject<PValidatorFn<PValidationErrors<PValidationErrorValue & {
			name : PPossibleErrorNames.LESS_THAN,
		} | PValidationErrorValue & {
			name : PPossibleErrorNames.MAX,
		}>>> {
		const fn = (control : Pick<AbstractControl, 'value'>) : ReturnType<ReturnType<ValidatorsService['max']>['fn']> => {
			const TYPE : PApiPrimitiveTypes = (typeof type === 'function') ? type() : type;
			const MAX = ((typeof max === 'function') ? max() : max) ?? null;

			// cancel the validation if any of the two values is null
			if (control.value === null) return null;
			if (MAX === null) return null;

			// do validation
			if (!equalIsAllowed) {
				const ERRORS = new ValidatorsService().lessThan(MAX, TYPE, errorText).fn(control);
				if (!ERRORS) return null;
				return {
					[PPossibleErrorNames.LESS_THAN]: {
						...ERRORS[PPossibleErrorNames.LESS_THAN],
						name: PPossibleErrorNames.LESS_THAN,
						primitiveType: TYPE,
						comparedAttributeName: comparedAttributeName,
						errorText : errorText,
					},
				};
			} else {
				const ERRORS = Validators.max(MAX)(control as AbstractControl) as {max : {max : number, actual : number}} | null;
				if (!ERRORS) return null;
				return {
					[PPossibleErrorNames.MAX]: {
						name: PPossibleErrorNames.MAX,
						primitiveType: TYPE,
						comparedAttributeName: comparedAttributeName,
						errorText : errorText,
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
				if (equalIsAllowed) return typeof max === 'function' ? max() : max;
				if (typeof max === 'function') return () => {
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
	public maxDecimalPlacesCount(
		max : number | null | (() => number | null),
		type : PApiPrimitiveTypes | (() => PApiPrimitiveTypes) | undefined,
		errorText ?: PDictionarySourceString | (() => PDictionarySourceString),
	) : PValidatorObject<PValidatorFn<PValidationErrors<ValidatorsServiceReturnType<'number'> | {
			name : PPossibleErrorNames.MAX_DECIMAL_PLACES_COUNT,
			maxDigitsLength : number,
		} & PValidationErrorValue>>> {
		return new PValidatorObject({name: PPossibleErrorNames.MAX_DECIMAL_PLACES_COUNT, fn: (control) => {
			if (control.value === null) return null;
			if (control.value === '') return null;
			assumeDefinedToGetStrictNullChecksRunning(control.value);

			// TODO: item.attributeInfoFoo.primitiveType can be undefined. We had this a lot in out app before we turned on strictNullChecks
			const TYPE : PApiPrimitiveTypes | undefined = (typeof type === 'function') ? type() : type;

			const MAX = (typeof max === 'function') ? max() : max;
			let tempControlToTest = { value : TYPE === PApiPrimitiveTypes.string ? +control.value : control.value };

			// cancel the validation if any of the two values is null
			if (tempControlToTest.value === null) return null;
			if (MAX === null) return null;

			// For a string a value like '123' would be fine. This Validator assumes to get a number to test.
			// So we need to transform '123' to a number first.
			if (TYPE === PApiPrimitiveTypes.string) {
				tempControlToTest = { value: +tempControlToTest.value };
			}

			const NUMBER_ERRORS = new ValidatorsService().number(TYPE).fn(tempControlToTest);
			if (NUMBER_ERRORS) return NUMBER_ERRORS;

			if (tempControlToTest.value === +((+tempControlToTest.value).toFixed(MAX))) return null;

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
	public ensureNull(
		type : PApiPrimitiveTypes | (() => PApiPrimitiveTypes),
		errorText ?: PDictionarySourceString | (() => PDictionarySourceString),
	) : PValidatorObject<PValidatorFn<PValidationErrors<{
			name : PPossibleErrorNames.ENSURE_NULL,
			actual : number,
		} & PValidationErrorValue>>> {
		// TODO: The api generator generates this for the "ensureNullWhenConditionIsFalse" attribute.
		// Normally, it does not make sense in UI because when something should be "null" the input field
		// will just be hidden (in which case no validation checks are done anyway). But, to be complete and consistent
		// we still have this validator.
		return new PValidatorObject({name: PPossibleErrorNames.ENSURE_NULL, fn: (control) => {
			const TYPE : PApiPrimitiveTypes = (typeof type === 'function') ? type() : type;
			if (control.value === null) return null;
			return {
				[PPossibleErrorNames.ENSURE_NULL]: {
					name: PPossibleErrorNames.ENSURE_NULL,
					primitiveType: TYPE,
					actual: control.value,
					errorText: errorText,
				},
			};
		}});
	}

	/**
	 * Check if there is any value
	 * Beware: Some types have values like '-1' to represent "not set". This is considered inside this validator.
	 */
	public required(
		type : PApiPrimitiveTypes | (() => PApiPrimitiveTypes),
		errorText ?: PDictionarySourceString | (() => PDictionarySourceString),
	) : PValidatorObject {
		return new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
			// This happens if its a function returning a primitive
			const TYPE : PApiPrimitiveTypes = (typeof type === 'function') ? type() : type;

			// eslint-disable-next-line sonarjs/no-small-switch
			switch (TYPE) {
				case PApiPrimitiveTypes.ApiList:
					if (control.value.length > 0) return null;
					break;
				default:
					if (
						control.value !== undefined &&
						control.value !== null &&
						control.value !== ''
					) return null;
					break;
			}

			return { [PPossibleErrorNames.REQUIRED]: {
				name: PPossibleErrorNames.REQUIRED,
				primitiveType: TYPE,
				actual: control.value,
				errorText: errorText,
			} };
		}});
	}

	/**
	 * Checks that the value is not `undefined`.
	 */
	public notUndefined(
		type : PApiPrimitiveTypes | (() => PApiPrimitiveTypes),
		errorText ?: PDictionarySourceString | (() => PDictionarySourceString),
	) : PValidatorObject {
		return new PValidatorObject({name: PPossibleErrorNames.NOT_UNDEFINED, fn: (control) => {
			const TYPE : PApiPrimitiveTypes = (typeof type === 'function') ? type() : type;

			if (control.value !== undefined) return null;

			return { [PPossibleErrorNames.NOT_UNDEFINED]: {
				name: PPossibleErrorNames.NOT_UNDEFINED,
				primitiveType: TYPE,
				actual: control.value,
				errorText: errorText,
			} };
		}});
	}

	/**
	 * Check if value is long enough
	 * @param minLength the required minimum length
	 */
	public minLength(
		minLength : number,
		errorText ?: PDictionarySourceString | (() => PDictionarySourceString),
	) : PValidatorObject {
		return new PValidatorObject({name: PPossibleErrorNames.MIN_LENGTH, fn: (control) => {
			if (control.value === null) return null;

			const LENGTH = (() => {
				if (typeof control.value === 'string') return control.value.trim().length;
				if (typeof control.value === 'number') return control.value.toString().length;
				return control.value.length as number;
			})();
			if (LENGTH >= minLength) return null;

			return {
				[PPossibleErrorNames.MIN_LENGTH]: {
					name: PPossibleErrorNames.MIN_LENGTH,
					primitiveType: undefined,
					requiredLength: minLength,
					actualLength: LENGTH,
					errorText: errorText,
				},
			};
		}});
	}

	/**
	 * Check if value is short enough
	 * @param maxLength the required maximum length
	 */
	public maxLength(
		maxLength : number,
		type : PApiPrimitiveTypes | (() => PApiPrimitiveTypes),
		errorText ?: PDictionarySourceString | (() => PDictionarySourceString),
	) : PValidatorObject<PValidatorFn<PValidationErrors<{
			name : PPossibleErrorNames.MAX_LENGTH,
			requiredLength : number,
			actualLength : number,
		} & PValidationErrorValue>>> {
		return new PValidatorObject({name: PPossibleErrorNames.MAX_LENGTH, fn: (control) => {
			const TYPE = (typeof type === 'function') ? type() : type;
			const ERRORS = Validators.maxLength(maxLength)(
			// eslint-disable-next-line unicorn/prefer-number-properties
			{value: control.value !== null && !isNaN(control.value) ? control.value.toString() : control.value} as unknown as AbstractControl,
			) as { maxlength : { requiredLength : number, actualLength : number} } | null;
			if (ERRORS === null) return null;
			return {
				[PPossibleErrorNames.MAX_LENGTH]: {
					...ERRORS[PPossibleErrorNames.MAX_LENGTH],
					name: PPossibleErrorNames.MAX_LENGTH,
					primitiveType: TYPE,
					errorText: errorText,
				},
			};
		}});
	}

	/**
	 * Check if matches regex
	 * @param pattern The regex the control value should be checked against
	 */
	public pattern(pattern : string | RegExp) : PValidatorObject {
		return new PValidatorObject({name: PPossibleErrorNames.PATTERN, fn: (control) => Validators.pattern(pattern)(control as AbstractControl)});
	}

	/**
	 * NEVER USE THIS! Use max() instead
	 */
	public maxDate() : PValidatorObject { return new PValidatorObject({name: PPossibleErrorNames.MAX, fn: () => null}); }

	/**
	 * Is value less then given float
	 * 0.5 fails with max(0) but not with greaterThan(0);
	 */
	public lessThan(
		input : number,
		type : PApiPrimitiveTypes | (() => PApiPrimitiveTypes) | undefined,
		errorText ?: PDictionarySourceString | (() => PDictionarySourceString),
	) : PValidatorObject {
		return new PValidatorObject({name: PPossibleErrorNames.LESS_THAN, fn: (control) : PValidationErrors<{
			name : PPossibleErrorNames.LESS_THAN,
			actual : number,
			lessThan : number,
		} & PValidationErrorValue> | null => {
			if (control.value === undefined) return null;
			if (control.value === '') return null;
			if (control.value === null) return null;

			const TYPE = (typeof type === 'function') ? type() : type;

			if (Number.isNaN(+control.value)) return null;

			if (control.value < input) return null;
			return { [PPossibleErrorNames.LESS_THAN]: {
				name: PPossibleErrorNames.LESS_THAN,
				primitiveType: TYPE,
				actual: control.value,
				lessThan: input,
				errorText: errorText,
			} };
		}});
	}

	/**
	 * Is value grater then given float
	 * 0.5 fails with min(1) but not with greaterThan(0);
	 */
	public greaterThan(
		input : number,
		type : PApiPrimitiveTypes | (() => PApiPrimitiveTypes),
		errorText ?: PDictionarySourceString | (() => PDictionarySourceString),
	) : PValidatorObject<PValidatorFn<PValidationErrors<PValidationErrorValue & {
			name : PPossibleErrorNames.GREATER_THAN,
			actual : number,
			greaterThan : number,
		}> | null>> {
		return new PValidatorObject({name: PPossibleErrorNames.GREATER_THAN, fn: (control) => {
			if (control.value === undefined) return null;
			if (control.value === '') return null;
			if (control.value === null) return null;

			if (Number.isNaN(+control.value)) return null;

			const TYPE : PApiPrimitiveTypes = (typeof type === 'function') ? type() : type;

			if (control.value > input) return null;
			return { [PPossibleErrorNames.GREATER_THAN]: {
				name: PPossibleErrorNames.GREATER_THAN,
				primitiveType: TYPE,
				actual: control.value,
				greaterThan: input,
				errorText: errorText,
			} };
		}});
	}

	/**
	 * Is this a valid phone number?
	 * OK: "12345 - 1234567"
	 * NOT OK: "1212 / 1234lorem"
	 */
	public phone(
		errorText ?: PDictionarySourceString | (() => PDictionarySourceString),
	) : PValidatorObject<PValidatorFn<PValidationErrors<PValidationErrorValue & {
			name : PPossibleErrorNames.MIN_LENGTH | PPossibleErrorNames.PHONE,
			actual : string,
			requiredLength ?: number,
			actualLength ?: number,
		}> | null>> {
		const fn = (control : Pick<AbstractControl, 'value'>) : ReturnType<ReturnType<ValidatorsService['phone']>['fn']> => {
			if (control.value === undefined) return null;
			if (control.value === '') return null;
			if (control.value === null) return null;

			const PHONE_REGEXP = /^\+?[\d -]*$/;
			const PATTERN_ERROR : {
				pattern ?: {
					requiredPattern : string,
					actualValue : string
				}
			} | null = Validators.pattern(PHONE_REGEXP)(control as AbstractControl);
			if (PATTERN_ERROR) return { [PPossibleErrorNames.PHONE]: {
				name: PPossibleErrorNames.PHONE,
				primitiveType: PApiPrimitiveTypes.string,
				actual: control.value,
				errorText: errorText,
			} };

			const REQUIRED_LENGTH = 3;
			const MIN_LENGTH_ERROR = new ValidatorsService().minLength(REQUIRED_LENGTH).fn({
			// eslint-disable-next-line unicorn/prefer-number-properties
				value: control.value !== null && !isNaN(control.value) ? control.value.toString() : control.value,
			});
			if (MIN_LENGTH_ERROR) return { [PPossibleErrorNames.MIN_LENGTH]: {
				name: PPossibleErrorNames.MIN_LENGTH,
				primitiveType: PApiPrimitiveTypes.Tel,
				actual: control.value,
				requiredLength: REQUIRED_LENGTH,
				actualLength: control.value?.length,
			} };

			return null;
		};

		return new PValidatorObject({name: PPossibleErrorNames.PHONE, fn: fn});
	}

	/**
	 * Is this a valid url?
	 */
	public url(
		errorText ?: PDictionarySourceString | (() => PDictionarySourceString),
	) : PValidatorObject<PValidatorFn<PValidationErrors<{
			name : PPossibleErrorNames.URL | PPossibleErrorNames.URL_PROTOCOL_MISSING | PPossibleErrorNames.URL_INCOMPLETE | PPossibleErrorNames.WHITESPACE,
			primitiveType : PApiPrimitiveTypes.Url,
			actual : string,
		} & PValidationErrorValue> | null>> {
		const fn = (control : Pick<AbstractControl, 'value'>) : ReturnType<ReturnType<ValidatorsService['url']>['fn']> => {
			if (control.value === undefined) return null;
			if (control.value === '') return null;
			if (control.value === null) return null;

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
			const HAS_WHITESPACE = Validators.pattern(/^\S*$/)(control as AbstractControl);
			if (HAS_WHITESPACE) {
				return { [PPossibleErrorNames.WHITESPACE]: {
					name: PPossibleErrorNames.WHITESPACE,
					primitiveType: PApiPrimitiveTypes.Url,
					actual: control.value,
				} };
			}

			// regex copied from https://stackoverflow.com/a/3809435
			const URL_REGEXP = /https?:\/\/[\w#%+.:=@~-]{1,256}\.[\d()a-z]{1,6}\b([\w#%&()+./:=?@~äöü-]*)/gi;
			const patternError = Validators.pattern(URL_REGEXP)(control as AbstractControl);
			if (!patternError) return null;

			return { [PPossibleErrorNames.URL]: {
				name: PPossibleErrorNames.URL,
				primitiveType: PApiPrimitiveTypes.Url,
				actual: control.value,
				errorText: errorText,
			} };
		};


		return new PValidatorObject({name: PPossibleErrorNames.URL, fn: fn});
	}

	/**
	 * Is this a valid domain?
	 */
	public domain(
		errorText ?: PDictionarySourceString | (() => PDictionarySourceString),
	) : PValidatorObject<PValidatorFn<PValidationErrors<{
			name : PPossibleErrorNames.DOMAIN | PPossibleErrorNames.WHITESPACE | PPossibleErrorNames.URL,
			primitiveType : undefined | PApiPrimitiveTypes.Url,
			actual : string,
		} & PValidationErrorValue> | null>> {
		const fn = (control : Pick<AbstractControl, 'value'>) : ReturnType<ReturnType<ValidatorsService['domain']>['fn']> => {
			if (control.value === undefined) return null;
			if (control.value === '') return null;
			if (control.value === null) return null;

			// Check for invalid patterns before required
			const HAS_WHITESPACE = Validators.pattern(/^\S*$/)(control as AbstractControl);
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
			const patternError = Validators.pattern(DOMAIN_REGEXP)(control as AbstractControl);
			if (!patternError) return null;

			return { [PPossibleErrorNames.DOMAIN]: {
				name: PPossibleErrorNames.DOMAIN,
				primitiveType: undefined,
				actual: control.value,
				errorText: errorText,
			} };
		};

		return new PValidatorObject({name: PPossibleErrorNames.URL, fn: fn});
	}

	/**
	 * Is this a valid IBAN code?
	 */
	public iban(
		errorText ?: PDictionarySourceString | (() => PDictionarySourceString),
	) : PValidatorObject<PValidatorFn<PValidationErrors<PValidationErrorValue & {
			name : PPossibleErrorNames.IBAN,
			primitiveType : undefined,
			actual : string,
		}> | null>> {
		return new PValidatorObject({name: PPossibleErrorNames.IBAN, fn: (control) => {
			if (control.value === undefined) return null;
			if (control.value === '') return null;
			if (control.value === null) return null;

			const isValid = IBAN.isValid(control.value);
			if (isValid) return null;

			return { [PPossibleErrorNames.IBAN]: {
				name: PPossibleErrorNames.IBAN,
				primitiveType: undefined,
				actual: control.value,
				errorText: errorText,
			} };
		}});
	}

	/**
	 * Is this a valid BIC code?
	 */
	public bic(
		errorText ?: PDictionarySourceString | (() => PDictionarySourceString),
	) : PValidatorObject<PValidatorFn<PValidationErrors<PValidationErrorValue & {
			name : PPossibleErrorNames.BIC,
			primitiveType : undefined,
			actual : string,
		}> | null>> {
		return new PValidatorObject({name: PPossibleErrorNames.BIC, fn: (control) => {
			if (control.value === undefined) return null;
			if (control.value === '') return null;
			if (control.value === null) return null;

			// regex copied from https://stackoverflow.com/a/15920158
			// eslint-disable-next-line unicorn/no-unsafe-regex
			const BIC_REGEXP = /^\s*[a-z]{6}[\da-z]{2}([\da-z]{3})?\s*$/i;
			const patternError = Validators.pattern(BIC_REGEXP)(control as AbstractControl);
			if (!patternError) return null;

			return { [PPossibleErrorNames.BIC]: {
				name: PPossibleErrorNames.BIC,
				primitiveType: undefined,
				actual: control.value,
				errorText: errorText,
			} };
		}});
	}

	/**
	 * Is this a valid password?
	 */
	public password(
	) : PValidatorObject<PValidatorFn<PValidationErrors<PValidationErrorValue & {
		name : (
			PPossibleErrorNames.WHITESPACE |
			PPossibleErrorNames.MIN_LENGTH |
			PPossibleErrorNames.NUMBERS_REQUIRED |
			PPossibleErrorNames.LETTERS_REQUIRED |
			PPossibleErrorNames.UPPERCASE_REQUIRED
		),
	}> | null>> {
		const fn = (control : Pick<AbstractControl, 'value'>) : ReturnType<ReturnType<ValidatorsService['password']>['fn']> => {
			if (control.value === undefined) return null;
			if (control.value === '') return null;
			if (control.value === null) return null;

			// Check for invalid patterns before required
			const HAS_WHITESPACE = Validators.pattern(/^\S*$/)(control as AbstractControl);
			if (HAS_WHITESPACE) {
				return { [PPossibleErrorNames.WHITESPACE]: {
					name: PPossibleErrorNames.WHITESPACE,
					primitiveType: undefined,
					actual: control.value,
				} };
			}

			const MIN_LENGTH = new ValidatorsService().minLength(7).fn(control);
			if (MIN_LENGTH) {
				return { [PPossibleErrorNames.MIN_LENGTH]: {
					...MIN_LENGTH[PPossibleErrorNames.MIN_LENGTH],
					name: PPossibleErrorNames.MIN_LENGTH,
					actual: control.value,
				} };
			}

			const HAS_NO_NUMBER = Validators.pattern(/\d/)(control as AbstractControl);
			if (HAS_NO_NUMBER) {
				return { [PPossibleErrorNames.NUMBERS_REQUIRED]: {
					name: PPossibleErrorNames.NUMBERS_REQUIRED,
					primitiveType: undefined,
					actual: control.value,
				} };
			}

			const HAS_NO_CHAR = Validators.pattern(/[A-Za-zÄÖÜäöü]/)(control as AbstractControl);
			if (HAS_NO_CHAR) {
				return { [PPossibleErrorNames.LETTERS_REQUIRED]: {
					name: PPossibleErrorNames.LETTERS_REQUIRED,
					primitiveType: undefined,
					actual: control.value,
				} };
			}

			const HAS_NO_UPPERCASE_CHAR = Validators.pattern(/[A-ZÄÖÜ]+/)(control as AbstractControl);
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
	public uppercase(
		errorText ?: PDictionarySourceString | (() => PDictionarySourceString),
	) : PValidatorObject<PValidatorFn<PValidationErrors<PValidationErrorValue & {
			name : PPossibleErrorNames.UPPERCASE,
			primitiveType : undefined,
		}> | null>> {
		return new PValidatorObject({name: PPossibleErrorNames.UPPERCASE, fn: (control) => {
			if (control.value === undefined) return null;
			if (control.value === '') return null;
			if (control.value === null) return null;

			if (control.value === control.value.toUpperCase()) return null;
			return { [PPossibleErrorNames.UPPERCASE]: {
				name: PPossibleErrorNames.UPPERCASE,
				primitiveType: undefined,
				actual: control.value,
				errorText: errorText,
			} };
		}});
	}

	/**
	 * the .integer validator does not work on inputs that calculate timestamps internally.
	 */
	public integerDaysDuration(
		errorText ?: PDictionarySourceString | (() => PDictionarySourceString),
	) : PValidatorObject<PValidatorFn<PValidationErrors<PValidationErrorValue & {
			name : PPossibleErrorNames.INTEGER,
			primitiveType : undefined,
		}> | null>> {
		return new PValidatorObject({name: PPossibleErrorNames.INTEGER, fn: (control) => {
			if (control.value === undefined) return null;
			if (control.value === '') return null;
			if (control.value === null) return null;
			const oneDayAsTimestamp = (24 * 60 * 60 * 1000);
			const isFullDay : boolean = (control.value % oneDayAsTimestamp) === 0;
			if (isFullDay) return null;
			return { [PPossibleErrorNames.INTEGER]: {
				name: PPossibleErrorNames.INTEGER,
				primitiveType: undefined,
				actual: control.value,
				errorText: errorText,
			} };
		}});
	}

	/**
	 * Check if this is a number in a locale-fitting format.
	 */
	public number(
		type : PApiPrimitiveTypes | (() => PApiPrimitiveTypes) | undefined,
		errorText ?: PDictionarySourceString | (() => PDictionarySourceString),
	) : PValidatorObject<PValidatorFn<PValidationErrors<PValidationErrorValue & {
			name : PPossibleErrorNames.NUMBER_NAN | PPossibleErrorNames.WHITESPACE | PPossibleErrorNames.FLOAT,
		}>>> {
		const fn = (control : Pick<AbstractControl, 'value'>) : ReturnType<ReturnType<ValidatorsService['number']>['fn']> => {
			if (control.value === undefined) return null;
			if (control.value === '') return null;
			if (control.value === null) return null;

			const TYPE = (typeof type === 'function') ? type() : type;
			if (control.value === null) return null;

			// eslint-disable-next-line unicorn/prefer-number-properties
			if (!!control.value && isNaN(control.value) && typeof control.value !== 'number') {
				// It is possible that the user is about to type 10,5 but only typed 10, yet. This gets handled here.
				// TODO: 	This regex expects to handle a locale based separator '12,', but this validator should not be used for
				// 				locale based values.
				if (control.value.match(/-?\d+[,.]$/)) return {
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

			const HAS_WHITESPACE = Validators.pattern(/^\S*$/)(control as AbstractControl);
			if (HAS_WHITESPACE) return { [PPossibleErrorNames.WHITESPACE]: {
				name: PPossibleErrorNames.WHITESPACE,
				primitiveType: TYPE,
				actual: control.value,
			} };

			const patternError = Validators.pattern(NUMBER_REGEXP)(control as AbstractControl);
			if (!patternError) return null;

			return { [PPossibleErrorNames.FLOAT]: {
				name: PPossibleErrorNames.FLOAT,
				primitiveType: TYPE,
				actual: control.value,
				errorText: errorText,
			} };
		};

		return new PValidatorObject({name: PPossibleErrorNames.NUMBER_NAN, fn: fn});
	}

	/**
	 * Is this a valid currency amount?
	 * OK: "12"
	 * OK: "12,32"
	 * OK: "12.32"
	 * NOT OK: "12.1234"
	 * NOT OK: "12 euro"
	 */
	public currency(
		errorText ?: PDictionarySourceString | (() => PDictionarySourceString),
	) : PValidatorObject<PValidatorFn<PValidationErrors<ValidatorsServiceReturnType<'number'> | ValidatorsServiceReturnType<'maxDecimalPlacesCount'> | PValidationErrorValue & {
			name : PPossibleErrorNames.CURRENCY,
		}> | null>> {
		return new PValidatorObject({name: PPossibleErrorNames.ENSURE_NULL, fn: (control) => {
			if (control.value === undefined) return null;
			if (control.value === '') return null;
			if (control.value === null) return null;

			const NUMBER_ERRORS = new ValidatorsService().number(PApiPrimitiveTypes.Currency).fn(control);
			if (NUMBER_ERRORS) return NUMBER_ERRORS;

			const DECIMAL_ERRORS = new ValidatorsService().maxDecimalPlacesCount(2, PApiPrimitiveTypes.Currency).fn(control);
			if (DECIMAL_ERRORS) return DECIMAL_ERRORS;

			const patternError = Validators.pattern(NUMBER_REGEXP)(control as AbstractControl);
			if (!patternError) return null;

			return { [PPossibleErrorNames.CURRENCY]: {
				name: PPossibleErrorNames.CURRENCY,
				primitiveType: PApiPrimitiveTypes.Currency,
				actual: control.value,
				currencyCode: undefined,
				errorText: errorText,
			} };
		}});
	}

	/**
	 * Valid email format?
	 */
	public email(
		errorText ?: PDictionarySourceString | (() => PDictionarySourceString),
	) : PValidatorObject<PValidatorFn<PValidationErrors<PValidationErrorValue & {
			name : PPossibleErrorNames.EMAIL_WITHOUT_AT | PPossibleErrorNames.EMAIL,
		}> | null>> {
		const fn = (control : Pick<AbstractControl, 'value'>) : ReturnType<ReturnType<ValidatorsService['email']>['fn']> => {
			if (control.value === undefined) return null;
			if (control.value === '') return null;
			if (control.value === null) return null;
			if (!control.value.includes('@')) return { [PPossibleErrorNames.EMAIL_WITHOUT_AT]: {
				name: PPossibleErrorNames.EMAIL_WITHOUT_AT,
				primitiveType: undefined,
				actual: control.value,
			} };
			// eslint-disable-next-line literal-blacklist/literal-blacklist, unicorn/no-unsafe-regex
			const E_MAIL_REGEXP = /^(([^\s"(),.:;<>@[\\\]]+(\.[^\s"(),.:;<>@[\\\]]+)*))@((\[(?:\d{1,3}\.){3}\d{1,3}])|(([\wäöü\-]+\.)+[A-Za-z]{2,}))$/;
			const patternError = Validators.pattern(E_MAIL_REGEXP)(control as AbstractControl);
			if (!patternError) return null;
			return { [PPossibleErrorNames.EMAIL]: {
				name: PPossibleErrorNames.EMAIL,
				primitiveType: undefined,
				actual: control.value,
				errorText: errorText,
			} };
		};
		return new PValidatorObject({name: PPossibleErrorNames.EMAIL, fn: fn});
	}

	/**
	 * Is this id defined?
	 */
	public idDefined(
		errorText ?: PDictionarySourceString | (() => PDictionarySourceString),
	) : PValidatorObject<PValidatorFn<PValidationErrors<PValidationErrorValue & {
			name : PPossibleErrorNames.ID_DEFINED,
			primitiveType : undefined,
		}> | null>> {
		return new PValidatorObject({name: PPossibleErrorNames.ID_DEFINED, fn: (control) => {
			if (control.value === null) return null;
			assumeNotUndefined(control.value);
			if (control.value instanceof IdBase) return null;
			return { [PPossibleErrorNames.ID_DEFINED]: {
				name: PPossibleErrorNames.ID_DEFINED,
				primitiveType: undefined,
				actual: control.value,
				errorText: errorText,
			} };
		}});
	}

	/**
	 * Is this a PLZ?
	 * OK: 12345
	 * OK: 1234 (Österreich)
	 */
	public plz(
		errorText ?: PDictionarySourceString | (() => PDictionarySourceString),
	) : PValidatorObject<PValidatorFn<PValidationErrors<PValidationErrorValue & {
			name : PPossibleErrorNames.MIN_LENGTH | PPossibleErrorNames.MAX_LENGTH,
		}> | null>> {
		const fn = (control : Pick<AbstractControl, 'value'>) : ReturnType<ReturnType<ValidatorsService['plz']>['fn']> => {
			const TYPE = PApiPrimitiveTypes.PostalCode;

			if (control.value === undefined) return null;
			if (control.value === '') return null;
			if (control.value === null) return null;

			const MIN_LENGTH_ERRORS = new ValidatorsService().minLength(4).fn(control);
			if (MIN_LENGTH_ERRORS) return {
				[PPossibleErrorNames.MIN_LENGTH]: {
					...MIN_LENGTH_ERRORS[PPossibleErrorNames.MIN_LENGTH],
					name: PPossibleErrorNames.MIN_LENGTH,
					actual: control.value,
					errorText: errorText,
				},
			};
			const ERRORS = new ValidatorsService().maxLength(8, TYPE).fn(control);
			if (ERRORS) return {
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

		return new PValidatorObject({name: PPossibleErrorNames.PLZ, fn: fn});
	}

	/**
	 * Check if value matches the definition of a freeclimber id.
	 * Before we had this we had chars in the ID’s which freeclimber could not handle.
	 */
	public freeclimberArticleId(
		type : PApiPrimitiveTypes | (() => PApiPrimitiveTypes),
	) : PValidatorObject<PValidatorFn<PValidationErrors<ValidatorsServiceReturnType<'maxDecimalPlacesCount'> | ValidatorsServiceReturnType<'min'> | PValidationErrorValue & {
		name : PPossibleErrorNames.REQUIRED,
	}> | null>> {
		const fn = (control : Pick<AbstractControl, 'value'>) : ReturnType<ReturnType<ValidatorsService['freeclimberArticleId']>['fn']> => {
			// TODO: item.attributeInfoFoo.primitiveType can be undefined. We had this a lot in out app before we turned on strictNullChecks
			const TYPE : PApiPrimitiveTypes | undefined = (typeof type === 'function') ? type() : type;

			if (control.value === undefined || control.value === '') return null;
			assumeDefinedToGetStrictNullChecksRunning(control.value);

			const REQUIRED_ERROR : {required ?: true} | null = Validators.required(control as AbstractControl);
			if (REQUIRED_ERROR) return {
				[PPossibleErrorNames.REQUIRED]: {
					name: PPossibleErrorNames.REQUIRED,
					primitiveType: TYPE,
					actual: control.value,
				},
			};

			const INTEGER_ERROR = new ValidatorsService().maxDecimalPlacesCount(0, TYPE).fn(control);
			if (INTEGER_ERROR) return INTEGER_ERROR;

			const MIN_ERROR = new ValidatorsService().min(1, true, TYPE).fn(control);
			if (MIN_ERROR) return MIN_ERROR;

			return null;
		};

		return new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: fn});
	}

	/**
	 * Check if value is the same as another value
	 * @param otherPassword the password to be compared with value
	 */
	public confirmPassword(otherPassword : () => string | null) : PValidatorObject<PValidatorFn<PValidationErrors<PValidationErrorValue & {
		name : PPossibleErrorNames.PASSWORD_UNCONFIRMED,
		primitiveType : PApiPrimitiveTypes.string,
	}>>> {
		const fn = (control : Pick<AbstractControl, 'value'>) : ReturnType<ReturnType<ValidatorsService['confirmPassword']>['fn']> => {
			const OTHER_PASSWORD = otherPassword();
			if (!OTHER_PASSWORD) return null;
			if (!control.value && !OTHER_PASSWORD) return null;
			if (control.value === OTHER_PASSWORD) return null;
			return {
				[PPossibleErrorNames.PASSWORD_UNCONFIRMED]: {
					name: PPossibleErrorNames.PASSWORD_UNCONFIRMED,
					primitiveType: PApiPrimitiveTypes.string,
				},
			};
		};

		return new PValidatorObject({name: PPossibleErrorNames.PASSWORD_UNCONFIRMED, fn: fn});
	}

	/**
	 * @param ratio The expected image ratio (= width / height).
	 */
	public imageRatio(ratio : number) : PValidatorObject {
		return new PValidatorObject({
			name: PPossibleErrorNames.IMAGE_RATIO,
			fn: (control) => {
				if (control.value === undefined) return null;
				if (control.value === '') return null;
				if (control.value === null) return null;

				if (control.value.match(IMAGE_LINK_REGEXP)) return null;
				const dimensions = getBase64Dimensions(control.value);
				const actualRatio = dimensions.width / dimensions.height;
				const actualRatioRounded = Math.round(actualRatio * 10) / 10;
				const ratioRounded = Math.round(ratio * 10) / 10;

				if (actualRatioRounded === ratioRounded) return null;

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
	public imageMaxFileSize(maxFileSize : Integer) : PValidatorObject {
		return new PValidatorObject({
			name: PPossibleErrorNames.IMAGE_MAX_FILE_SIZE,
			fn: (control) => {
				if (control.value === undefined) return null;
				if (control.value === '') return null;
				if (control.value === null) return null;

				// Is this a url of an image?
				if (control.value.match(IMAGE_LINK_REGEXP)) return null;

				const sizeInKb = getPngFileSize(control.value);
				if (sizeInKb <= maxFileSize) return null;

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
	public imageMinWidth(minWidth : Integer) : PValidatorObject {
		return new PValidatorObject({
			name: PPossibleErrorNames.IMAGE_MIN_WIDTH,
			fn: (control) => {
				if (control.value === undefined) return null;
				if (control.value === '') return null;
				if (control.value === null) return null;

				// Is this a url of an image?
				if (control.value.match(IMAGE_LINK_REGEXP)) return null;

				const dimensions = getBase64Dimensions(control.value);
				if (dimensions.width >= minWidth) return null;

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
	public imageMinHeight(minHeight : Integer) : PValidatorObject {
		return new PValidatorObject({
			name: PPossibleErrorNames.IMAGE_MIN_HEIGHT,
			fn: (control) => {
				if (control.value === undefined) return null;
				if (control.value === '') return null;
				if (control.value === null) return null;

				if (control.value.match(IMAGE_LINK_REGEXP)) return null;
				const dimensions = getBase64Dimensions(control.value);
				if (dimensions.height >= minHeight) return null;

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
	public imageMaxHeight(maxHeight : Integer) : PValidatorObject {
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
	public imageMaxWidth(maxWidth : Integer) : PValidatorObject {
		return new PValidatorObject({
			name: PPossibleErrorNames.IMAGE_MAX_WIDTH,
			// We don’t validate max-width and max-height. Our image-cropper component crops it down to the max.
			fn: () => null,
			comparedConst: maxWidth,
		});
	}
}
