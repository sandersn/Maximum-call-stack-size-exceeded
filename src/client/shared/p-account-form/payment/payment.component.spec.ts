import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PaymentComponent } from './payment.component';

describe('#PaymentComponent', () => {
	let component : PaymentComponent;
	const testingUtils = new TestingUtils();

	beforeEach(() => {
		component = testingUtils.createComponent(PaymentComponent);
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
