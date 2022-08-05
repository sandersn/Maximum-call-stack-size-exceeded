import { TimeStampModule } from '@plano/client/time-stamp/time-stamp.module';
import { TimeStampApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { ShiftSelectComponent } from './shift-select.component';


describe('ShiftSelectComponent #needsapi', () => {
	let component : ShiftSelectComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [TimeStampModule] });

	beforeEach((done) => {
		testingUtils.login({
			success: () => {
				testingUtils.unloadAndLoadApi(TimeStampApiService, () => {
					component = testingUtils.createComponent(ShiftSelectComponent);
					done();
				});
			},
		});
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});
	// it('api should be loaded', () => {
	// 	expect(component.api.isLoaded()).toBe(true);
	// });

	// it('shifts()', () => {
	// 	expect(component.shifts().length).toBeGreaterThan(0);
	// });

	// it('isValid()', () => {
	// 	expect(component.isValid).toBe(false);
	// 	let shift = new ShiftWrapper([]);
	// 	component.setSelectedItem(shift);
	// 	expect(component.isValid).toBe(true);
	// });

});
