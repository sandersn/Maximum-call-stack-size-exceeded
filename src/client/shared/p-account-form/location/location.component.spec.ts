import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { LocationComponent } from './location.component';

describe('#LocationComponent', () => {
	let component : LocationComponent;
	const testingUtils = new TestingUtils();

	beforeEach(() => {
		component = testingUtils.createComponent(LocationComponent);
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
