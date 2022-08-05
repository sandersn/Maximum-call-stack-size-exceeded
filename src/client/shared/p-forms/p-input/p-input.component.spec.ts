import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PInputComponent } from './p-input.component';
import { PFormsModule } from '../p-forms.module';

describe('#PFormsModule#PInputComponent', () => {
	let component : PInputComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [PFormsModule] });

	beforeAll(() => {
		component = testingUtils.createComponent(PInputComponent);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	describe('type currency', () => {
		beforeAll(() => {
			component.type = PApiPrimitiveTypes.Currency;
		});

		it('should handle null', () => {
			expect(() => {
				component.writeValue(null);
			}).not.toThrow();
		});

		// describe('with PFormControl', () => {
		// 	let control : PFormControl;
		// 	beforeAll(() => {
		// 		control = new PFormControl({
		// 			value: 12.5,
		// 			disabled: false,
		// 		});
		// 		component.formControl = control;
		// 	});
		// 	describe('input »4,5«', () => {
		// 		beforeAll(() => {
		// 			component.value = '4,5';
		// 		});
		// 		it('should be valid in germany', () => {
		// 			expect(component.value).toBe('4,5');
		// 			expect(component.formControl.valid).toBe(true);
		// 		});
		// 	});
		// 	describe('input »4,5«', () => {
		// 		beforeAll(() => {
		// 			component.value = '4.5';
		// 		});
		// 		it('should not be valid in germany', () => {
		// 			expect(component.value).toBe('4.5');
		// 			expect(component.formControl.valid).toBe(false);
		// 		});
		// 	});
		// });

	});
});
