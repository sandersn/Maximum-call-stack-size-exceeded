import { AlertComponent } from '../../../../shared/core/component/alert/alert.component';
import { TestingUtils } from '../../../../shared/testing/testing-utils';
import { SchedulingModule } from '../../../scheduling/scheduling.module';

describe('#ColorMarkerComponent', () => {
	let component : AlertComponent;

	const testingUtils = new TestingUtils();

	beforeAll(() => {
		testingUtils.init({ imports : [SchedulingModule] });
		component = testingUtils.createComponent(AlertComponent);
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
