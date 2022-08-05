import { SchedulingApiShifts } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PShiftPickerCalendarComponent } from './shift-picker-calendar.component';
import { PShiftPickerModule } from '../p-shift-picker.module';

describe('PShiftPickerCalendarComponent', () => {
	let component : PShiftPickerCalendarComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [PShiftPickerModule] });

	beforeAll(() => {
		component = testingUtils.createComponent(PShiftPickerCalendarComponent);
	});

	it('should create', () => {
		const shifts = new SchedulingApiShifts(null, false);
		component.availableShifts = shifts;
		expect(component).toBeTruthy();
	});
});
