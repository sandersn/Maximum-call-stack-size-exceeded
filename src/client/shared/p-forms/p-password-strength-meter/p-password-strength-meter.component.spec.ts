import { MainModule } from '@plano/public/main/main.module';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PasswordStrengthEnum, PPasswordStrengthMeterComponent } from './p-password-strength-meter.component';

describe('PPasswordStrengthMeterComponent', () => {
	let component : PPasswordStrengthMeterComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [MainModule] });


	beforeAll(() => {
		component = testingUtils.createComponent(PPasswordStrengthMeterComponent);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should be strong when password is qaQA12!@', () => {
		component.passwordToCheck = 'qaQA12!@';
		expect(component.passwordStrength).toBe(PasswordStrengthEnum.STRONG);
	});

	it('should be weak when password is 12345678', () => {
		component.passwordToCheck = '12345678';
		expect(component.passwordStrength).toBe(PasswordStrengthEnum.WEAK);
	});

	it('should display hasNumber when password is qaQA12!@', () => {
		component.passwordToCheck = 'qaQA12!@';
		expect(component.variations.digits).toBe(true);
	});
});
