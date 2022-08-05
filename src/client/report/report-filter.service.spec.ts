import { HttpParams } from '@angular/common/http';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { ReportFilterService } from './report-filter.service';
import { SchedulingApiService } from '../scheduling/shared/api/scheduling-api.service';

describe('ReportFilterService #needsapi', () => {
	let service : ReportFilterService;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [ReportFilterService] });

	const getApiQueryParams = (dataType : string) : HttpParams => {
		const now = new PMomentService(PSupportedLocaleIds.de_DE).m();
		// start/end
		// Hack: data.shifts currently returns shifts of the whole day. workingTimes/absences not. So, to be consistent,
		// start/end should be start/end of day
		const start = now.startOf('day').valueOf().toString();
		const end = now.add(1, 'week').startOf('day').valueOf().toString();

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
						service = testingUtils.getService(ReportFilterService);
						service.initValues();
						done();
					},
					getApiQueryParams('calendar'),
				);
			},
		});
	});

	it('should create', () => {
		expect(service).toBeTruthy();
	});

	describe('.showUnpaidAbsences', () => {
		it('should be defined', () => {
			expect(service.showUnpaidAbsences).toBeDefined();
		});
	});

	describe('isSetToShowAll', () => {
		beforeEach(() => {
			service.unload();
			service.initValues();
		});
		it('should be true per default', () => {
			expect(service.isSetToShowAll).toBe(true);
		});
		it('should be false if showUnpaidAbsences is false', () => {
			service.showUnpaidAbsences = false;
			expect(service.isSetToShowAll).toBe(false);
		});
	});

	it('unload() should make everything visible', () => {
		service.showUnpaidAbsences = false;
		expect(service.isSetToShowAll).toBe(false);
		service.unload();
		service.initValues();
		expect(service.isSetToShowAll).toBe(true);
	});
});
