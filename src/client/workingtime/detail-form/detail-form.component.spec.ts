import { SchedulingApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { DetailFormComponent } from './detail-form.component';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../shared/core/null-type-utils';

describe('Workingtime_DetailFormComponent #needsapi', () => {
	let api : SchedulingApiService;
	let component : DetailFormComponent;

	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [DetailFormComponent] });

	beforeAll(async () => {
		await testingUtils.login();
		api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, testingUtils.getApiQueryParams('reporting'));
		component = testingUtils.createComponent(DetailFormComponent);
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

	describe('existing item', () => {
		beforeAll(done => {
			const workingTime = api.data.workingTimes.get(0);
			assumeDefinedToGetStrictNullChecksRunning(workingTime, 'workingTime');
			component.item = workingTime;
			component.initComponent(() => { done(); });
		});

		describe('formGroup', () => {

			it('should be valid', () => {
				expect(component).toBeDefined('Component is undefined');
				assumeDefinedToGetStrictNullChecksRunning(component.formGroup, 'component.formGroup');
				expect(component.formGroup.valid).toBe(true);
			});

			// FIXME: PLANO-21408
			// describe('regularPauseDuration', () => {
			// 	it('regularPauseDuration should not throw if \'abc\' passed', () => {
			// 		expect(() => {
			// 			component.formGroup.get('regularPauseDuration').setValue('abc');
			// 		}).not.toThrow();
			// 	});
			// });

		});
	});

});
