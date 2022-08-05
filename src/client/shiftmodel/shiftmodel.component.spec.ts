import { SchedulingApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { ShiftModelComponent } from './shiftmodel.component';

describe('ShiftModelComponent #needsapi', () => {
	let component : ShiftModelComponent;

	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [ShiftModelComponent] });

	beforeAll((done) => {
		testingUtils.login({
			success: () => {
				testingUtils.unloadAndLoadApi(SchedulingApiService, () => {
					component = testingUtils.createComponent(ShiftModelComponent);
					done();
				}, testingUtils.getApiQueryParams('calendar'));
			},
		});
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
