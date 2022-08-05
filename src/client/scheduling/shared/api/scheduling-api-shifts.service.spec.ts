import { assumeNonNull } from '@plano/shared/core/null-type-utils';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { SchedulingApiShifts, SchedulingApiService } from './scheduling-api.service';

describe('SchedulingApiShifts #needsapi', () => {
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

	it('.overlaps()', () => {
		const now = Date.now();
		const shifts = new SchedulingApiShifts(null, false);
		const shift = api.data.shifts.get(0);
		assumeNonNull(shift);
		shift.start = now;
		shift.end = now + 10;
		shifts.push(shift);
		expect(shifts.overlaps(now + 9, now + 20)).toBe(true);
		expect(shifts.overlaps(now + 10, now + 20)).toBe(false);
		expect(shifts.overlaps(now + 11, now + 20)).toBe(false);
	});

	it('.setSelected(boolean)', () => {
		const shifts = new SchedulingApiShifts(null, false);
		shifts.push(api.data.shifts.get(0)!);
		shifts.push(api.data.shifts.get(1)!);
		shifts.push(api.data.shifts.get(2)!);
		shifts.push(api.data.shifts.get(3)!);
		shifts.push(api.data.shifts.get(4)!);

		shifts.setSelected(true);
		for (const shift of shifts.iterable()) {
			expect(shift.selected).toBe(true);
		}

		shifts.setSelected(false);
		for (const shift of shifts.iterable()) {
			expect(shift.selected).toBe(false);
		}
	});
});
