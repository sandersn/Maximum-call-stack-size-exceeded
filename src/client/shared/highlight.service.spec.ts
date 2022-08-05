import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { HighlightService } from './highlight.service';
import { SchedulingApiService } from '../../shared/api';
import { assumeNonNull } from '../../shared/core/null-type-utils';
import { FakeSchedulingApiService } from '../scheduling/shared/api/scheduling-api.service.mock';


describe('#HighlightService', () => {
	let service : HighlightService;
	const testingUtils = new TestingUtils();
	let fakeApi : SchedulingApiService;

	testingUtils.init({
		imports: [SchedulingModule],
	});

	beforeAll(done => {
		fakeApi = new FakeSchedulingApiService() as unknown as SchedulingApiService;
		service = testingUtils.getService(HighlightService);
		done();
	});

	it('should have a defined instance', () => {
		expect(service).toBeDefined();
		expect(fakeApi.data.shiftModels.length).toBeGreaterThan(2);
		expect(fakeApi.data.shifts.length).toBeGreaterThan(2);
		const firstShiftModel = fakeApi.data.shiftModels.get(0);
		expect(firstShiftModel).toBeDefined();assumeNonNull(firstShiftModel);
		expect(fakeApi.data.shifts.filterBy(item => item.shiftModelId.equals(firstShiftModel.id)).length).toBeGreaterThan(2);
	});

	describe('isMuted()', () => {
		beforeAll(() => {
			const firstShift = fakeApi.data.shifts.get(0);
			service.setHighlighted(firstShift);
		});

		it('unrelated shiftModel should be muted, when shift is selected', () => {
			const secondShiftModel = fakeApi.data.shiftModels.get(1);
			expect(secondShiftModel).toBeDefined();assumeNonNull(secondShiftModel);
			expect(service.isMuted(secondShiftModel)).toBe(true);
		});
	});
});
