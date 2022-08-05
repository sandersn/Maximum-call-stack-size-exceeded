import { SchedulingApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { ShiftComponent } from './shift.component';

describe('ShiftComponent #needsapi', () => {
	let component : ShiftComponent;

	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [ShiftComponent] });

	beforeAll((done) => {
		testingUtils.login({
			success: () => {
				testingUtils.unloadAndLoadApi(SchedulingApiService, () => {
					component = testingUtils.createComponent(ShiftComponent);
					done();
				}, testingUtils.getApiQueryParams('calendar'));
			},
		});
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
