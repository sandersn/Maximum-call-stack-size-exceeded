import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { CalendarAbsencesWeekBarComponent } from './calendar-absences-week-bar.component';
import { PSchedulingCalendarModule } from '../p-calendar.module';

describe('CalendarAbsencesWeekBarComponent', () => {
	let component : CalendarAbsencesWeekBarComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [PSchedulingCalendarModule] });

	beforeAll(() => {
		component = testingUtils.createComponent(CalendarAbsencesWeekBarComponent);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
