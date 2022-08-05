import { PFormControl } from '@plano/client/shared/p-forms/p-form-control';
import { PSupportedCurrencyCodes, PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { CoreModule } from '@plano/shared/core/core.module';
import { PPossibleErrorNames, PValidationErrors, PValidationErrorValue, PValidatorFn } from '@plano/shared/core/validators.types';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PInputService } from './p-input.service';
import { ApiListWrapper } from '../../../../shared/api';

describe('#PInputService', () => {
	let service : PInputService;
	let formControl : PFormControl | null = null;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [CoreModule] });

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const addIt = (
		fnName : keyof PInputService,
		locale : PSupportedLocaleIds,
		input : string | number | boolean | undefined | ApiListWrapper<unknown>,
		shouldBeValid : boolean,
	) : void => {
		it(`»${input}« should be ${shouldBeValid ? 'valid' : 'invalid'}`, () => {
			formControl!.setValue(input);
			/* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents */
			const fn : any | ((input : unknown) => PValidatorFn) = service[fnName];
			const ERROR = fn(formControl, locale);
			if (shouldBeValid) {
				expect(ERROR).toBeNull();
			} else {
				const ERROR2 = fn(formControl);
				expect(ERROR2).not.toBeNull();
			}
		});
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const addItWithParam = (
		fnName : keyof PInputService,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		param : any,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		input : string | number | undefined | any[] | ApiListWrapper<unknown>,
		shouldBeValid : boolean,
	) : void => {
		it(`»${input}« should be ${shouldBeValid ? 'valid' : 'invalid'}`, () => {
			formControl!.setValue(input);
			if (shouldBeValid) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				expect((service[fnName] as (input : any) => PValidatorFn)(param)(formControl!)).toBeNull();
			} else {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				expect((service[fnName] as (input : any) => PValidatorFn)(param)(formControl!)).not.toBeNull();
			}
		});
	};

	beforeEach(done => {
		service = testingUtils.getService(PInputService);
		formControl = new PFormControl({});
		done();
	});

	describe('PInputService', () => {
		it('should have a defined component', () => {
			expect(service).toBeDefined();
		});
	});

	describe('validateLocaleAwareCurrency()', () => {
		it(`should be valid`, () => {
			expect((service['validateLocaleAwareCurrency'] as (...input : unknown[]) => (PValidationErrors<PValidationErrorValue & { name : PPossibleErrorNames.CURRENCY }> | null))({value: '0'}, PSupportedLocaleIds.de_DE, PSupportedCurrencyCodes.EUR)).toBeNull();
			expect((service['validateLocaleAwareCurrency'] as (...input : unknown[]) => (PValidationErrors<PValidationErrorValue & { name : PPossibleErrorNames.CURRENCY }> | null))({value: '2'}, PSupportedLocaleIds.de_DE, PSupportedCurrencyCodes.EUR)).toBeNull();
			expect((service['validateLocaleAwareCurrency'] as (...input : unknown[]) => (PValidationErrors<PValidationErrorValue & { name : PPossibleErrorNames.CURRENCY }> | null))({value: '12'}, PSupportedLocaleIds.de_DE, PSupportedCurrencyCodes.EUR)).toBeNull();
			expect((service['validateLocaleAwareCurrency'] as (...input : unknown[]) => (PValidationErrors<PValidationErrorValue & { name : PPossibleErrorNames.CURRENCY }> | null))({value: '123'}, PSupportedLocaleIds.de_DE, PSupportedCurrencyCodes.EUR)).toBeNull();
			expect((service['validateLocaleAwareCurrency'] as (...input : unknown[]) => (PValidationErrors<PValidationErrorValue & { name : PPossibleErrorNames.CURRENCY }> | null))({value: '1234'}, PSupportedLocaleIds.de_DE, PSupportedCurrencyCodes.EUR)).toBeNull();
			// Will be handled as 1234.10 €
			expect((service['validateLocaleAwareCurrency'] as (...input : unknown[]) => (PValidationErrors<PValidationErrorValue & { name : PPossibleErrorNames.CURRENCY }> | null))({value: '1234,1'}, PSupportedLocaleIds.de_DE, PSupportedCurrencyCodes.EUR)).toBeNull();
			expect((service['validateLocaleAwareCurrency'] as (...input : unknown[]) => (PValidationErrors<PValidationErrorValue & { name : PPossibleErrorNames.CURRENCY }> | null))({value: '1234,12'}, PSupportedLocaleIds.de_DE, PSupportedCurrencyCodes.EUR)).toBeNull();
			expect((service['validateLocaleAwareCurrency'] as (...input : unknown[]) => (PValidationErrors<PValidationErrorValue & { name : PPossibleErrorNames.CURRENCY }> | null))({value: undefined}, PSupportedLocaleIds.de_DE, PSupportedCurrencyCodes.EUR)).toBeNull();
		});
		it(`should be invalid`, () => {
			// Too many digits
			expect((service['validateLocaleAwareCurrency'] as (...input : unknown[]) => (PValidationErrors<PValidationErrorValue & { name : PPossibleErrorNames.CURRENCY }> | null))({value: '12,2345'}, PSupportedLocaleIds.de_DE, PSupportedCurrencyCodes.EUR)).not.toBeNull();
			// Wrong decimal separator
			expect((service['validateLocaleAwareCurrency'] as (...input : unknown[]) => (PValidationErrors<PValidationErrorValue & { name : PPossibleErrorNames.CURRENCY }> | null))({value: '1234.12'}, PSupportedLocaleIds.de_DE, PSupportedCurrencyCodes.EUR)).not.toBeNull();
			// String is not a number
			expect((service['validateLocaleAwareCurrency'] as (...input : unknown[]) => (PValidationErrors<PValidationErrorValue & { name : PPossibleErrorNames.CURRENCY }> | null))({value: 'foo'}, PSupportedLocaleIds.de_DE, PSupportedCurrencyCodes.EUR)).not.toBeNull();
		});
		it(`0.555 should be invalid`, () => {
			// Too many digits
			expect((service['validateLocaleAwareCurrency'] as (...input : unknown[]) => (PValidationErrors<PValidationErrorValue & { name : PPossibleErrorNames.CURRENCY }> | null))({value: '0.555'}, PSupportedLocaleIds.de_DE, PSupportedCurrencyCodes.EUR)).not.toBeNull();
		});
	});

	// describe('maxDecimalPlacesCount()', () => {

	// 	describe('valid', () => {
	// 		it(`should be valid`, () => {
	// 			/* eslint-disable @typescript-eslint/no-explicit-any */
	// 			expect((service['maxDecimalPlacesCount'] as (...input : unknown[]) => PValidatorFn)(2, PApiPrimitiveTypes.number)({value: undefined})).toBeNull();
	// 			expect((service['maxDecimalPlacesCount'] as (...input : unknown[]) => PValidatorFn)(2, PApiPrimitiveTypes.number)({value: 3})).toBeNull();
	// 			expect((service['maxDecimalPlacesCount'] as (...input : unknown[]) => PValidatorFn)(2, PApiPrimitiveTypes.number)({value: ''})).toBeNull();
	// 			expect((service['maxDecimalPlacesCount'] as (...input : unknown[]) => PValidatorFn)(2, PApiPrimitiveTypes.number)({value: 0})).toBeNull();
	// 			expect((service['maxDecimalPlacesCount'] as (...input : unknown[]) => PValidatorFn)(2, PApiPrimitiveTypes.number)({value: 0.1})).toBeNull();
	// 			expect((service['maxDecimalPlacesCount'] as (...input : unknown[]) => PValidatorFn)(2, PApiPrimitiveTypes.number)({value: 0.12})).toBeNull();
	// 			expect((service['maxDecimalPlacesCount'] as (...input : unknown[]) => PValidatorFn)(2, PApiPrimitiveTypes.number)({value: 999999.12})).toBeNull();
	// 			// eslint-disable-next-line unicorn/no-zero-fractions
	// 			expect((service['maxDecimalPlacesCount'] as (...input : unknown[]) => PValidatorFn)(2, PApiPrimitiveTypes.number)({value: 9.110000})).toBeNull();
	// 			expect((service['maxDecimalPlacesCount'] as (...input : unknown[]) => PValidatorFn)(2, PApiPrimitiveTypes.number)({value: -12.12})).toBeNull();
	// 		});
	// 	});

	// 	describe('invalid', () => {
	// 		it(`should be valid`, () => {
	// 			expect((service['maxDecimalPlacesCount'] as (...input : unknown[]) => PValidatorFn)(2, PApiPrimitiveTypes.number)({value: 'foo'})).not.toBeNull();
	// 			expect((service['maxDecimalPlacesCount'] as (...input : unknown[]) => PValidatorFn)(2, PApiPrimitiveTypes.number)({value: 12.12345432})).not.toBeNull();
	// 			expect((service['maxDecimalPlacesCount'] as (...input : unknown[]) => PValidatorFn)(2, PApiPrimitiveTypes.number)({value: 10.123})).not.toBeNull();
	// 			expect((service['maxDecimalPlacesCount'] as (...input : unknown[]) => PValidatorFn)(2, PApiPrimitiveTypes.number)({value: -10.123})).not.toBeNull();
	// 		});
	// 	});
	// });

	// describe('maxLength()', () => {
	// 	describe('valid', () => {
	// 		addItWithParam('maxLength', 3, undefined, true);
	// 		addItWithParam('maxLength', 3, '', true);
	// 		addItWithParam('maxLength', 3, 0, true);
	// 		addItWithParam('maxLength', 3, 12, true);
	// 		addItWithParam('maxLength', 3, 123, true);
	// 		addItWithParam('maxLength', 3, '123', true);
	// 	});

	// 	describe('invalid', () => {
	// 		addItWithParam('maxLength', 3, 12345, false);
	// 		addItWithParam('maxLength', 3, '12345', false);
	// 	});
	// });
});
