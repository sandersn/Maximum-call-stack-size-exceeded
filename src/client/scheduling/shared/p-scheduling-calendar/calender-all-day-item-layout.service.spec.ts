import { SchedulingApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { CalenderAllDayItemLayoutService } from './calender-all-day-item-layout.service';
import { PSchedulingCalendarModule } from './p-calendar.module';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';

describe('CalenderAllDayItemLayoutService #needsapi', () => {
	let api : SchedulingApiService;
	let service : CalenderAllDayItemLayoutService;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [PSchedulingCalendarModule] });

	beforeAll(async () => {
		await testingUtils.login();
		api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, testingUtils.getApiQueryParams('calendar'));
		service = testingUtils.getService(CalenderAllDayItemLayoutService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('getLayout()', () => {
		it('should return a valid object for any shift', () => {
			const firstAbsence = api.data.absences.get(0);
			assumeDefinedToGetStrictNullChecksRunning(firstAbsence, 'firstAbsence');
			const position = service.getLayout(Date.now(), firstAbsence);
			expect(position.posIndex).toBeDefined();
			expect(position.show).toBeDefined();
		});
	});

	describe('getMaxPosIndex()', () => {
		it('should return a valid object for any shift', () => {
			const maxPos = service.getMaxPosIndex(Date.now());
			expect(maxPos).toBeDefined();
		});
	});
});
