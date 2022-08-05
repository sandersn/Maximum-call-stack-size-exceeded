import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PShiftPickerPickedOffersComponent } from './shift-picker-picked-offers.component';
import { PShiftPickerModule } from '../p-shift-picker.module';

describe('PShiftPickerPickedOffersComponent', () => {
	let component : PShiftPickerPickedOffersComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [PShiftPickerModule] });

	beforeAll(() => {
		component = testingUtils.createComponent(PShiftPickerPickedOffersComponent);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
