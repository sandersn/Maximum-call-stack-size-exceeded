import { HttpParams } from '@angular/common/http';
import { SchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { AffectedShiftsApiService } from '@plano/shared/api';
import { TestingUtils, LoginRole } from '@plano/shared/testing/testing-utils';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../core/null-type-utils';
import { PSupportedLocaleIds } from '../base/generated-types.ag';

describe('AffectedShiftsApiService #needsapi', () => {
	const testingUtils = new TestingUtils();
	const pMoment = new PMomentService(PSupportedLocaleIds.de_DE);
	let api : AffectedShiftsApiService;
	let schedulingApi : SchedulingApiService;

	beforeAll(async () => {
		api = testingUtils.getService(AffectedShiftsApiService);

		await testingUtils.login();

		// Load scheduling-api
		const start = pMoment.m().subtract(1, 'week').startOf('day').valueOf().toString();
		const end = pMoment.m().add(1, 'week').startOf('day').valueOf().toString();

		const queryParams = new HttpParams()
			.set('data', 'calendar')
			.set('start', start)
			.set('end', end);

		schedulingApi = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, queryParams);
	});

	describe('load', () => {
		testingUtils.testForRoles([LoginRole.CLIENT_OWNER, LoginRole.CLIENT_DEFAULT_WITH_WRITE_PERMISSION], () => {
			it('returns-shifts', async () => {
				const shift = schedulingApi.data.shifts.get(0);

				assumeDefinedToGetStrictNullChecksRunning(shift, 'shift');

				// set shift-change-selector
				const shiftChangeSelector = schedulingApi.data.shiftChangeSelector;
				shiftChangeSelector.shiftsOfShiftModelId = shift.shiftModelId;
				shiftChangeSelector.shiftsOfShiftModelVersion = shift.id.shiftModelVersion;

				// load affected-shifts-api
				const start = pMoment.m().subtract(1, 'week').startOf('day').valueOf().toString();
				const end = pMoment.m().add(1, 'week').startOf('day').valueOf().toString();

				const queryParams = new HttpParams()
					.set('shiftChangeSelector', encodeURIComponent(JSON.stringify(shiftChangeSelector.rawData)))
					.set('currentShiftId', shift.id.toString())
					.set('start', start)
					.set('end', end)
					.set('action', 'remove');

				await api.load({ searchParams: queryParams });
				expect(api.data.shifts.length > 0).toBeTrue();
			});
		});
	});
});
