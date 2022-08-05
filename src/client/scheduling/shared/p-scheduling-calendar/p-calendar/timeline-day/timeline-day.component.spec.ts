import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { SchedulingApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PTimelineDayComponent } from './timeline-day.component';

describe('PTimelineDayComponent #needsapi', () => {
	let component : PTimelineDayComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [SchedulingModule] });

	beforeAll((done) => {
		testingUtils.login({
			success : () => {
				testingUtils.unloadAndLoadApi(
					SchedulingApiService,
					() => {
						component = testingUtils.createComponent(PTimelineDayComponent);
						done();
					},
					testingUtils.getApiQueryParams('calendar'),
				);
			},
		});
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
