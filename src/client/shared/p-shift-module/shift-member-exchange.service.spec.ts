import { HttpParams } from '@angular/common/http';
import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiService } from '@plano/shared/api';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { ShiftMemberExchangeService } from './shift-member-exchange.service';

describe('ShiftMemberExchangeService #needsapi', () => {
	let service : ShiftMemberExchangeService;
	const testingUtils = new TestingUtils();
	const pMoment = new PMomentService(PSupportedLocaleIds.de_DE);

	testingUtils.init({ imports: [SchedulingModule] });

	/**
	 * getApiQueryParams
	 */
	const getApiQueryParams = (dataType : string) : HttpParams => {
		// start/end
		// Hack: data.shifts currently returns shifts of the whole day. workingTimes/absences not. So, to be consistent,
		// start/end should be start/end of day
		const start = pMoment.m().startOf('day').valueOf().toString();
		const end = pMoment.m().add(1, 'week').startOf('day').valueOf().toString();

		return new HttpParams()
			.set('data', dataType)
			.set('start', start)
			.set('end', end)
			.set('bookingsStart', start)
			.set('bookingsEnd', end);
	};

	beforeAll((done) => {
		testingUtils.login({
			success: () => {

				testingUtils.unloadAndLoadApi(
					SchedulingApiService,
					() => {
						service = testingUtils.getService(ShiftMemberExchangeService);
						done();
					},
					getApiQueryParams('calendar'),
				);
			},
		});
	});

	beforeEach((done) => {
		done();
	});

	it('should have a defined component', () => {
		expect(service).toBeDefined();
	});

});
