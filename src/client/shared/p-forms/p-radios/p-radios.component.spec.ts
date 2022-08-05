import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PRadiosComponent } from './p-radios.component';

describe('#PFormsModule#PRadiosComponent', () => {
	let component : PRadiosComponent;
	const testingUtils = new TestingUtils();

	beforeEach(() => {
		component = testingUtils.createComponent(PRadiosComponent);
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});
});
