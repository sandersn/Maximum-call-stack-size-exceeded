import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { AccountComponent } from './account.component';

describe('#AccountComponent', () => {
	let component : AccountComponent;
	const testingUtils = new TestingUtils();

	beforeEach(() => {
		component = testingUtils.createComponent(AccountComponent);
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
