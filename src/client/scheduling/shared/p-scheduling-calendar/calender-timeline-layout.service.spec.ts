import { SchedulingApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { CalenderTimelineLayoutService } from './calender-timeline-layout.service';
import { PSchedulingCalendarModule } from './p-calendar.module';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';

describe('CalenderTimelineLayoutService #needsapi', () => {
	let api : SchedulingApiService;
	let service : CalenderTimelineLayoutService;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [PSchedulingCalendarModule] });

	beforeAll(async () => {
		await testingUtils.login();
		api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, testingUtils.getApiQueryParams('calendar'));
		service = testingUtils.getService(CalenderTimelineLayoutService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('getLayout()', () => {
		it('should return a valid object for any shift', () => {
			const firstShift = api.data.shifts.get(0);
			assumeDefinedToGetStrictNullChecksRunning(firstShift, 'firstShift');
			const position = service.getLayout(firstShift);
			expect(position.x).toBeDefined();
			expect(position.y).toBeDefined();
			expect(position.z).toBeDefined();
			expect(position.height).toBeDefined();
			expect(position.width).toBeDefined();
			expect(position.show).toBeDefined();
		});
	});
});
