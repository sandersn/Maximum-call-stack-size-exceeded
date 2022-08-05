import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PFormControlSwitchComponent } from './p-form-control-switch.component';

describe('PFormControlSwitchComponent', () => {
	let component : PFormControlSwitchComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [] });

	beforeAll(done => {
		component = testingUtils.createComponent(PFormControlSwitchComponent);
		done();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
