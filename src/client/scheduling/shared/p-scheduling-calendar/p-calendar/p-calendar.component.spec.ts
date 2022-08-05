import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { SchedulingApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PSchedulingCalendarComponent } from './p-calendar.component';

describe('PSchedulingCalendarComponent #needsapi', () => {
	let component : PSchedulingCalendarComponent;

	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [SchedulingModule] });

	beforeAll(done => {
		testingUtils.login({
			success: () => {
				testingUtils.unloadAndLoadApi(
					SchedulingApiService,
					() => {
						component = testingUtils.createComponent(PSchedulingCalendarComponent);
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

	// it('shiftsOfDay', () => {
	// 	expect(component.shiftsOfDay).toBeDefined();
	// });

	// it('hasSelectedItem', () => {
	// 	expect(component.hasSelectedItem).toBeFalsy();
	// });

	// TODO: Cannot read property 'data' of undefined
	// it('filteredShifts', () => {
	// 	expect(component.filteredShifts).toBeDefined();
	// 	expect(api.data.shifts.length).toBe(component.filteredShifts.length);
	// });

});
