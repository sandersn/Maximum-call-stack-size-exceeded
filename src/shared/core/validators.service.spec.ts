import { PFormControl, PFormGroup } from '@plano/client/shared/p-forms/p-form-control';
import { ApiAttributeInfo } from '@plano/shared/api/base/api-attribute-info';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { StoryBookApiService } from '@plano/shared/api/story-book-api/story-book-api.service.ag';
import { CoreModule } from '@plano/shared/core/core.module';
import { PValidatorFn} from '@plano/shared/core/validators.types';
import { PValidatorObject } from '@plano/shared/core/validators.types';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { ValidationHintService } from './component/validation-hint/validation-hint.service';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from './null-type-utils';
import { ValidatorsService } from './validators.service';
import { PValidationErrorValue } from './validators.types';
import { SchedulingApiMembers } from '../api';
import { ApiListWrapper} from '../api';
import { ApiDataWrapperBase } from '../api/base/api-data-wrapper-base';

describe('#ValidatorsService', () => {
	let service : ValidatorsService;
	let formControl : PFormControl;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [CoreModule] });

	const addIt = (
		fnName : keyof ValidatorsService,
		type : PApiPrimitiveTypes | undefined,
		input : string | number | boolean | undefined | ApiListWrapper<unknown>,
		shouldBeValid : boolean,
	) : void => {
		// eslint-disable-next-line sonarjs/no-nested-template-literals
		it(`${typeof input === 'string' ? `»${input}«` : input} should be ${shouldBeValid ? 'valid' : 'invalid'}`, () => {
			formControl!.setValue(input);
			/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
			const validatorMethod : ((input : any, ...otherInput : any[]) => PValidatorObject) = service[fnName];
			let fn : PValidatorFn;
			if (fnName === 'required' && type === undefined) throw new Error('type must be set when testing required validator');
			try {
				const validatorMethodResult = validatorMethod(type);
				fn = validatorMethodResult instanceof PValidatorObject ? validatorMethodResult.fn : validatorMethodResult;
			} catch (error) {
				if (type !== undefined) throw new Error(`Did you add a unnecessary type to addIt(…, type, …, …)? Error: ${error}`);
				throw new Error(`${error}`);
			}
			const ERRORS = fn(formControl!);
			if (shouldBeValid) {
				expect(ERRORS).toBeNull();
			} else {
				assumeNonNull(ERRORS);
				expect(ERRORS).not.toBeNull();
				const ERROR = ERRORS[Object.keys(ERRORS)[0]];
				expect(ERROR.name).not.toBeUndefined();
			}
		});
	};

	const addItWithParam = <FnName extends keyof ValidatorsService>(
		fnName : FnName,
		param : Parameters<ValidatorsService[FnName]>[number],
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		input : string | number | undefined | any[] | ApiListWrapper<unknown>,
		shouldBeValid : boolean,
	) : void => {
		it(`»${input}« should be ${shouldBeValid ? 'valid' : 'invalid'}`, () => {
			formControl.setValue(input);
			if (shouldBeValid) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				expect((service[fnName] as (input : any) => PValidatorObject)(param).fn(formControl)).toBeNull();
			} else {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				expect((service[fnName] as (input : any) => PValidatorObject)(param).fn(formControl)).not.toBeNull();
			}
		});
	};

	beforeEach(done => {
		service = testingUtils.getService(ValidatorsService);
		formControl = new PFormControl({});
		done();
	});

	describe('ValidatorsService', () => {
		it('should have a defined component', () => {
			expect(service).toBeDefined();
		});
	});

	describe('required()', () => {
		describe('should work with primitive types', () => {
			describe('string', () => {
				it("'Hallo'", () => {
					expect((service.required(PApiPrimitiveTypes.string)).fn({ value: 'Hallo' })).toBeNull();
				});
				it("''", () => {
					expect((service.required(PApiPrimitiveTypes.string)).fn({ value: '' })).not.toBeNull();
				});
				it('null', () => {
					expect((service.required(PApiPrimitiveTypes.string)).fn({ value: null })).not.toBeNull();
				});
				it('undefined', () => {
					expect((service.required(PApiPrimitiveTypes.string)).fn({ value: undefined })).not.toBeNull();
				});
			});
			it('Days', () => {
				expect((service.required(PApiPrimitiveTypes.Days)).fn({ value: null })).not.toBeNull();
				expect((service.required(PApiPrimitiveTypes.Days)).fn({ value: 0 })).toBeNull();
				expect((service.required(PApiPrimitiveTypes.Date)).fn({ value: 1 })).toBeNull();
			});
			it('DateTime', () => {
				expect((service.required(PApiPrimitiveTypes.DateTime)).fn({ value: undefined })).not.toBeNull();
			});
		});

		it('should work with empty members', () => {
			const emptyMembers = new SchedulingApiMembers(null, false);
			const result = service.required(PApiPrimitiveTypes.ApiList).fn({ value: emptyMembers });
			expect(result).not.toBeNull();
		});
		it('should work with members', () => {
			const members = new SchedulingApiMembers(null, false);
			members.createNewItem();
			expect((service.required(PApiPrimitiveTypes.ApiList)).fn({ value: members })).toBeNull();
		});
	});

	describe('email()', () => {
		addIt('email', undefined, 'foo@dr-plano.de', true);
		addIt('email', undefined, 'foo_bar@dr-plano.de', true);
		addIt('email', undefined, 'foo+bar@dr-plano.de', true);
		addIt('email', undefined, 'foo@posteo.de', true);
		addIt('email', undefined, 'foo@posteo.at', true);
		addIt('email', undefined, 'foo@drplano.de', true);
		addIt('email', undefined, 'foo@drPlano.de', true);
		addIt('email', undefined, 'FOO@DR-PLANO.DE', true);
		addIt('email', undefined, 'foo@dr_plano.de', true);
		addIt('email', undefined, 'foo-bar-foo-bar@dr-plano.de', true);
		addIt('email', undefined, 'äüö@dr-plano.de', true);
		addIt('email', undefined, 'foo@äüö.de', true);
		addIt('email', undefined, 'klz.dav.b_mattes+Beispiel@gmail.com', true);
	});

	describe('currency()', () => {
		describe('valid', () => {
			addIt('currency', undefined, 0, true);
			addIt('currency', undefined, 2, true);
			addIt('currency', undefined, 12, true);
			addIt('currency', undefined, 123, true);
			// Will be handled as 1234.10 €
			addIt('currency', undefined, 1234.1, true);
			addIt('currency', undefined, 1234.12, true);
			addIt('currency', undefined, null as unknown as undefined, true);
			addIt('currency', undefined, undefined, true);
		});
		describe('invalid', () => {
			// Too many digits
			addIt('currency', undefined, 12.2123, false);
			// String is not a number
			addIt('currency', undefined, 'foo', false);
		});
	});

	describe('number()', () => {
		describe('valid', () => {
			addIt('number', PApiPrimitiveTypes.number, 12, true);
			addIt('number', PApiPrimitiveTypes.number, 123, true);
			addIt('number', PApiPrimitiveTypes.Hours, 5.2, true);
			addIt('number', PApiPrimitiveTypes.number, 1234.1, true);
			addIt('number', PApiPrimitiveTypes.number, 1234.12, true);
			addIt('number', PApiPrimitiveTypes.number, null as unknown as undefined, true);
			addIt('number', PApiPrimitiveTypes.number, undefined, true);
		});
		describe('invalid', () => {
			addIt('number', PApiPrimitiveTypes.number, false, false); // Short
			addIt('number', PApiPrimitiveTypes.number, true, false); // No uppercase letters
			addIt('number', PApiPrimitiveTypes.string, 'foo', false); // No numbers
		});
	});

	describe('password()', () => {
		addIt('password', undefined, 'Ab12', false); // Short
		addIt('password', undefined, 'abc1234', false); // No uppercase letters
		addIt('password', undefined, 'abcAB#!', false); // No numbers
		addIt('password', undefined, '1234#!?', false); // No Letters

		addIt('password', undefined, 'Ää12345', true);
		addIt('password', undefined, 'Abc1234', true);
		addIt('password', undefined, 'Abß1234', true);
	});

	describe('freeclimberArticleId()', () => {
		addIt('freeclimberArticleId', undefined, undefined, true);
		addIt('freeclimberArticleId', undefined, '', true);
		addIt('freeclimberArticleId', undefined, 1, true);
		addIt('freeclimberArticleId', PApiPrimitiveTypes.string, '1', true);
		addIt('freeclimberArticleId', PApiPrimitiveTypes.Integer, '0123', false);

		addIt('freeclimberArticleId', undefined, 0, false); // Min is 1
		addIt('freeclimberArticleId', PApiPrimitiveTypes.string, '0', false); // Min is 1
		addIt('freeclimberArticleId', PApiPrimitiveTypes.Integer, '1', false);
		addIt('freeclimberArticleId', PApiPrimitiveTypes.Integer, '123.123', false);
		addIt('freeclimberArticleId', PApiPrimitiveTypes.string, '12,3', false);
		addIt('freeclimberArticleId', PApiPrimitiveTypes.string, '12,23', false);
		addIt('freeclimberArticleId', PApiPrimitiveTypes.string, '1,443', false);

		addIt('freeclimberArticleId', undefined, ' 10', false);
		addIt('freeclimberArticleId', undefined, '233.333', false); // PLANO-33104
	});

	describe('plz()', () => {

		describe('valid', () => {
			addIt('plz', undefined, undefined, true);
			addIt('plz', undefined, '', true);
			addIt('plz', undefined, 1234, true);
			addIt('plz', undefined, 12345, true);
			addIt('plz', undefined, '1234', true);
			addIt('plz', undefined, '12345', true);

			// NL
			addIt('plz', undefined, '1212 AB', true);
			addIt('plz', undefined, '1212 cd', true);
			addIt('plz', undefined, '1212 Ac', true);
			addIt('plz', undefined, '1212Ac', true);
		});

		describe('invalid', () => {
			addIt('plz', undefined, 0, false);
			addIt('plz', undefined, 10, false);
			addIt('plz', undefined, 'foo', false);
			addIt('plz', undefined, '10', false);

			// NL
			// addIt('plz', '1234 ABC', false);
			// addIt('plz', '12 12Ac', false);
			// addIt('plz', '12345 Ac', false);
			// addIt('plz', '12345 ABC', false);
			// addIt('plz', '12345f3e', false);
		});

	});

	describe('maxDecimalPlacesCount()', () => {

		describe('valid', () => {
			describe('should be valid', () => {
				it(`positiv numbers`, () => {
					expect((service['maxDecimalPlacesCount'])(2, PApiPrimitiveTypes.number).fn({value: 3})).toBeNull();
					expect((service['maxDecimalPlacesCount'])(2, PApiPrimitiveTypes.number).fn({value: 0.1})).toBeNull();
					expect((service['maxDecimalPlacesCount'])(2, PApiPrimitiveTypes.number).fn({value: 0.12})).toBeNull();
					expect((service['maxDecimalPlacesCount'])(2, PApiPrimitiveTypes.number).fn({value: 999999.12})).toBeNull();
					expect((service['maxDecimalPlacesCount'])(2, PApiPrimitiveTypes.number).fn({value: 9.110000})).toBeNull();
				});
				it(`null`, () => {
					expect((service['maxDecimalPlacesCount'])(2, PApiPrimitiveTypes.number).fn({value: null})).toBeNull();
				});
				it(`''`, () => {
					expect((service['maxDecimalPlacesCount'])(2, PApiPrimitiveTypes.number).fn({value: ''})).toBeNull();
				});
				it(`0`, () => {
					expect((service['maxDecimalPlacesCount'])(2, PApiPrimitiveTypes.number).fn({value: 0})).toBeNull();
				});
				it(`0`, () => {
					expect((service['maxDecimalPlacesCount'])(2, PApiPrimitiveTypes.number).fn({value: 0})).toBeNull();
				});
				it(`-12.12`, () => {
					expect((service['maxDecimalPlacesCount'])(2, PApiPrimitiveTypes.number).fn({value: -12.12})).toBeNull();
				});
			});
		});

		describe('invalid', () => {
			it(`should be valid`, () => {
				expect((service['maxDecimalPlacesCount'])(2, PApiPrimitiveTypes.number).fn({value: 'foo'})).not.toBeNull();
				expect((service['maxDecimalPlacesCount'])(2, PApiPrimitiveTypes.number).fn({value: 12.12345432})).not.toBeNull();
				expect((service['maxDecimalPlacesCount'])(2, PApiPrimitiveTypes.number).fn({value: 10.123})).not.toBeNull();
				expect((service['maxDecimalPlacesCount'])(2, PApiPrimitiveTypes.number).fn({value: -10.123})).not.toBeNull();
			});
		});

	});

	describe('phone()', () => {

		describe('valid', () => {
			addIt('phone', undefined, undefined, true);
			addIt('phone', undefined, '', true);
			addIt('phone', undefined, 1234, true);
			addIt('phone', undefined, 12345, true);
			addIt('phone', undefined, '1234', true);
			addIt('phone', undefined, '12345', true);
			addIt('phone', undefined, '017600000000', true);
			addIt('phone', undefined, '+4917600000000', true);
			addIt('phone', undefined, '+49 176 00000000', true);
			addIt('phone', undefined, '+49 176 00 000 000', true);
			addIt('phone', undefined, '+49 176 - 00 000 000', true);
		});

		describe('invalid', () => {
			addIt('phone', undefined, 0, false);
			addIt('phone', undefined, '0', false);
			addIt('phone', undefined, 10, false);
			addIt('phone', undefined, 'foo', false);
			addIt('phone', undefined, '10', false);
		});

	});

	describe('maxLength()', () => {
		describe('valid', () => {
			addItWithParam('maxLength', 3, undefined, true);
			addItWithParam('maxLength', 3, '', true);
			addItWithParam('maxLength', 3, 0, true);
			addItWithParam('maxLength', 3, 12, true);
			addItWithParam('maxLength', 3, 123, true);
			addItWithParam('maxLength', 3, '123', true);
		});

		describe('invalid', () => {
			addItWithParam('maxLength', 3, 12345, false);
			addItWithParam('maxLength', 3, '12345', false);
		});
	});

	describe('confirmPassword()', () => {
		describe('valid', () => {
			addItWithParam('confirmPassword', () => '', '', true);
			addItWithParam('confirmPassword', () => 'ABcd123!', 'ABcd123!', true);
		});

		describe('invalid', () => {
			addItWithParam('confirmPassword', () => 'Hallo', '', false);
			addItWithParam('confirmPassword', () => '!ABcd123!', '#ABcd123#', false);
			addItWithParam('confirmPassword', () => 'ABcd123!', 'abcd123!', false);
		});
	});

	describe('story-book-api', () => {
		let storyBookApi : StoryBookApiService;
		let validationHinService : ValidationHintService;

		beforeAll(done => {
			storyBookApi = testingUtils.getService(StoryBookApiService);
			storyBookApi.enableMockMode(true);

			validationHinService = testingUtils.getService(ValidationHintService);

			done();
		});

		// Note that the dynamically generated tests depend on storyBookApi and this is only available
		// after beforeAll(). So, we cannot the tests in the outer describe.
		// Instead we put all our tests in a single 'tests' it().
		it('tests', () => {

			/**
			 * @returns Returns the validation error text for "attributeInfo". If no validation error exists
			 * "null" is returned. This method expects that the attribute-info has maximum one validation error.
			 */
			const getValidationError = (
				formGroup : PFormGroup,
				attributeInfo : ApiAttributeInfo<ApiDataWrapperBase, unknown>,
			) : PValidationErrorValue | null => {
				let result : PValidationErrorValue | null = null;

				// get all validators
				assumeDefinedToGetStrictNullChecksRunning(attributeInfo.primitiveType, 'attributeInfo.primitiveType');
				const validatorFnsForPrimitiveType = new PFormControl({}).getValidatorsForPrimitiveType(attributeInfo.primitiveType).map(item => item.fn);
				const validatorsFromAI = attributeInfo.validations.map((item) => item()).
					filter((item) : item is PValidatorObject => item instanceof PValidatorObject).
					map(item => item.fn);
				const allValidators = validatorFnsForPrimitiveType.concat(validatorsFromAI);

				// get validation errors.
				// Note, that currently it is only supported that maximal one validation error is available.
				const newControl : PFormControl = new PFormControl({
					formState: {value: attributeInfo.value, disabled: false},
					labelText: attributeInfo.id.toUpperCase(),
				});
				formGroup.addControl(attributeInfo.id, newControl);
				const control = formGroup.get(attributeInfo.id);

				for (const validator of allValidators) {
					assumeDefinedToGetStrictNullChecksRunning(control, 'control');
					const errors = validator(control);

					if (!errors)
						continue;

					// errors is an object of keys each containing a PValidationErrorValue object
					const validationErrorValueCount = Object.keys(errors).length;

					if (validationErrorValueCount > 0) {
						if (validationErrorValueCount > 1)
							throw new Error(`${attributeInfo.id}: We expect an ValidationErrors object to have maximum of one PValidationErrorValue object. Errors: ${Object.keys(errors)}`);

						const errorValue = errors[Object.keys(errors)[0]];

						let label : string | null = null;
						if (errorValue.comparedAttributeName) {
							const PARENT = control.parent;
							// eslint-disable-next-line @typescript-eslint/no-explicit-any
							const COMPARED_CONTROL = (PARENT?.controls as any)[errorValue.comparedAttributeName];
							label = COMPARED_CONTROL?.labelText;
						}

						const errorText = validationHinService.getErrorText(errorValue, label);

						if (errorText) {
							if (result)
								// NOTE: 	A storybook api entry should always be set up in a way that only a single validator returns an
								// 				error. Else we would not know which error to compare against <expected-validation-error>
								throw new Error(`${attributeInfo.id}: We expect an attribute-info to have maximum of one validation error. If this is a new/edited attribute-info, you probably need to fix the xml entry for <validators>. If this is a existing entry, you probably need to fix a broken validator fn.`);

							result = {
								text: errorText,
								...errorValue,
							};
						}
					}
				}

				return result;
			};

			/**
			 * Test all primitive type attributes recursively.
			 */
			const testRecursively = (formGroup : PFormGroup, data : ApiDataWrapperBase) : void => {
				// do tests on all primitive attributes
				for (const primitiveAttributeName of data.getChildPrimitiveNames()) {
					const attributeInfo = data.getAttributeInfo(primitiveAttributeName);

					const validationError = getValidationError(formGroup, attributeInfo);
					const expectedValidationErrorText = attributeInfo.vars.expectedValidationError ?? null;

					expect(validationError ? 'has error' : 'has no error').toBe(expectedValidationErrorText ? 'has error' : 'has no error',
						`${attributeInfo.id} validation expected to ${expectedValidationErrorText ? 'produce validation error' : 'produce NO validation error'}. Error Name: ${validationError ? validationError.name : 'NO ERROR'}; Value: ${attributeInfo.value === null ? 'null' : (attributeInfo.value === undefined ? 'undefined' : attributeInfo.value)}`,
					);

					expect(validationError?.['text'] ?? null).toBe(expectedValidationErrorText,
						`${attributeInfo.id} has wrong validation text. Expected: ${expectedValidationErrorText}`,
					);
				}

				// continue recursively on all child wrappers
				for (const childWrapperName of data.getChildWrapperNames()) {
					testRecursively(formGroup, data[childWrapperName as keyof ApiDataWrapperBase]);
				}
			};

			const formGroup = new PFormGroup({});

			testRecursively(formGroup, storyBookApi.data.validations);
		});
	});
});
