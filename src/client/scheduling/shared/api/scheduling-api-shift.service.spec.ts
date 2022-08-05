import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { SchedulingApiService } from './scheduling-api.service';

describe('Service: SchedulingApiShift #needsapi', () => {
	let api : SchedulingApiService;
	const testingUtils = new TestingUtils();

	testingUtils.init({
		providers: [SchedulingApiService],
	});

	beforeAll(async () => {
		await testingUtils.login();
		api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, testingUtils.getApiQueryParams('calendar'));
	});

	it('should have a defined api', () => {
		expect(api).toBeDefined();
	});

	it('api.data should be defined', () => {
		expect(api.data).toBeDefined();
	});

	it('shiftModels', () => {
		expect(api.data.shiftModels).toBeDefined();
		expect(api.data.shiftModels.length).toBeGreaterThan(0);
		expect(api.data.shiftModels.get(0)).toBeDefined();
	});

	it('shift.model', () => {
		const shift = api.data.shifts.get(0);
		if (!shift) {
			expect().nothing();
			// eslint-disable-next-line no-console
			console.warn('--------------- WARNING: No shift available. Skipping test…');
		} else {
			expect(shift.model).toBeDefined();
		}
	});
});
