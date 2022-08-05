import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { BillingComponent } from './billing.component';

describe('#BillingComponent', () => {
	let component : BillingComponent;
	const testingUtils = new TestingUtils();

	beforeEach(() => {
		component = testingUtils.createComponent(BillingComponent);
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
