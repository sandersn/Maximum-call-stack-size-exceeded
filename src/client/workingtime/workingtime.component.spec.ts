import { SchedulingApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { WorkingtimeComponent } from './workingtime.component';

describe('WorkingtimeComponent #needsapi', () => {
	let component : WorkingtimeComponent;

	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [WorkingtimeComponent] });

	beforeAll((done) => {
		testingUtils.login({
			success: () => {
				testingUtils.unloadAndLoadApi(SchedulingApiService, () => {
					component = testingUtils.createComponent(WorkingtimeComponent);
					done();
				}, testingUtils.getApiQueryParams('calendar'));
			},
		});
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
