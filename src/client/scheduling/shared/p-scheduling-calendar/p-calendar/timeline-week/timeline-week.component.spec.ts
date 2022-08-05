import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { SchedulingApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PTimelineWeekComponent } from './timeline-week.component';

describe('PTimelineWeekComponent #needsapi', () => {
	let component : PTimelineWeekComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [SchedulingModule] });

	beforeAll((done) => {
		testingUtils.login({
			success: () => {
				testingUtils.unloadAndLoadApi(SchedulingApiService, () => {
					component = testingUtils.createComponent(PTimelineWeekComponent);
					done();
				},
				testingUtils.getApiQueryParams('calendar'));
			},
		});
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
