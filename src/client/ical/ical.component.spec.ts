import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { IcalComponent } from './ical.component';
import { ClientModule } from '../client.module';
import { SchedulingApiService } from '../scheduling/shared/api/scheduling-api.service';

describe('#e2e#IcalComponent #needsapi', () => {
	let component : IcalComponent;

	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [ClientModule] });

	beforeAll(done => {
		testingUtils.login(
			{
				success: () => {
					testingUtils.unloadAndLoadApi(SchedulingApiService, () => {
						component = testingUtils.createComponent(IcalComponent);
						done();
					}, testingUtils.getApiQueryParams('calendar'));
				},
			},
		);
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
		expect(component.shiftModelsForList).toBeDefined();
	});

	describe('toggleAdditionalItems(shiftModels)', () => {

		it('should work for set of models', () => {
			const value = component.isAdditionalShiftModel(component.shiftModelsForList[0]);
			component.toggleAdditionalItems(component.shiftModelsForList[0]);
			expect(component.isAdditionalShiftModel(component.shiftModelsForList[0])).toBe(!value);
			component.toggleAdditionalItems(component.shiftModelsForList[0]);
			expect(component.isAdditionalShiftModel(component.shiftModelsForList[0])).toBe(value);
		});

		it('should work for single items', () => {
			expect(component.isAdditionalShiftModel(component.shiftModelsForList[0])).toBeFalsy();
			expect(component.isAdditionalShiftModel(component.shiftModelsForList[0].iterable()[0])).toBeFalsy();
			expect(component.isAdditionalShiftModel(component.shiftModelsForList[0].iterable()[1])).toBeFalsy();
			component.toggleAdditionalItems(component.shiftModelsForList[0].iterable()[0]);
			expect(component.isAdditionalShiftModel(component.shiftModelsForList[0].iterable()[0])).toBeTruthy();
		});

		// it('should still work for set of models', () => {
		// 	// TODO: This keeps failing. Consider removing »api« from the getter »shiftModelsForList« and provide a
		// 	// set of shifts as an @Input()
		// 	expect(component.isAdditionalShiftModel(component.shiftModelsForList[0])).toBeFalsy();
		// 	expect(component.isAdditionalShiftModel(component.shiftModelsForList[0].iterable()[0])).toBeTruthy();
		// 	expect(component.isAdditionalShiftModel(component.shiftModelsForList[0].iterable()[1])).toBeFalsy();
		// 	component.toggleAdditionalItems(component.shiftModelsForList[0]);
		// 	expect(component.isAdditionalShiftModel(component.shiftModelsForList[0].iterable()[0])).toBeTruthy();
		// 	expect(component.isAdditionalShiftModel(component.shiftModelsForList[0].iterable()[1])).toBeTruthy();
		// });

	});

});
