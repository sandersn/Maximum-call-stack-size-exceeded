import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { SchedulingComponent } from './scheduling.component';
import { SchedulingApiService } from './shared/api/scheduling-api.service';

describe('SchedulingComponent #needsapi', () => {
	let component : SchedulingComponent;

	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [SchedulingModule] });

	beforeAll((done) => {
		testingUtils.login(
			{
				success: () => {
					testingUtils.unloadAndLoadApi(SchedulingApiService, () => {
						component = testingUtils.createComponent(SchedulingComponent);
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
