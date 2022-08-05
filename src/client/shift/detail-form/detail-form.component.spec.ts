import { SchedulingApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { DetailFormComponent } from './detail-form.component';

describe('Shift_DetailFormComponent #needsapi', () => {
	let component : DetailFormComponent;

	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [DetailFormComponent] });

	beforeAll((done) => {
		testingUtils.login({
			success: () => {
				testingUtils.unloadAndLoadApi(SchedulingApiService, () => {
					component = testingUtils.createComponent(DetailFormComponent);
					done();
				}, testingUtils.getApiQueryParams('calendar'));
			},
		});
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
