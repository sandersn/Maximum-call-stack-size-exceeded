import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { SchedulingApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PAllDayItemsListComponent } from './p-all-day-items-list.component';

describe('PAllDayItemsListComponent #needsapi', () => {
	let component : PAllDayItemsListComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [SchedulingModule] });

	beforeAll((done) => {
		testingUtils.login({
			success : () => {
				testingUtils.unloadAndLoadApi(
					SchedulingApiService,
					() => {
						component = testingUtils.createComponent(PAllDayItemsListComponent);
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
