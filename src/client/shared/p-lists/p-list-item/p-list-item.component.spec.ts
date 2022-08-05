import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { SchedulingApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PListItemComponent } from './p-list-item.component';

describe('PListItemComponent #needsapi', () => {
	let component : PListItemComponent;

	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [SchedulingModule] });

	beforeAll((done) => {
		testingUtils.login({
			success: () => {
				testingUtils.unloadAndLoadApi(SchedulingApiService, () => {
					component = testingUtils.createComponent(PListItemComponent);
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
