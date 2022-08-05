import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { SchedulingApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PShiftAndShiftmodelFormComponent } from './p-shift-and-shiftmodel-form.component';

describe('PShiftAndShiftmodelFormComponent #needsapi', () => {
	let api : SchedulingApiService;
	let component : PShiftAndShiftmodelFormComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [SchedulingModule] });

	beforeEach(async () => {
		await testingUtils.login();
		api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, testingUtils.getApiQueryParams('calendar'));
		component = testingUtils.createComponent(PShiftAndShiftmodelFormComponent);
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

	describe('for existing shiftModel', () => {
		beforeAll((done) => {
			component.shiftModel = api.data.shiftModels.get(0);
			spyOn(PShiftAndShiftmodelFormComponent.prototype, 'initValues').and.callThrough();
			component.initComponent(() => {
				done();
			});
		});
		it('initValues have been called', () => {
			expect(PShiftAndShiftmodelFormComponent.prototype.initValues).toHaveBeenCalled();
		});
	});

});
