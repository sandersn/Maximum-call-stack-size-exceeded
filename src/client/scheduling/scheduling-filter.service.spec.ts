import { HttpParams } from '@angular/common/http';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { MeService } from '@plano/shared/api';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { Id } from '@plano/shared/api/base/id';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PossibleApiLoadDataValues } from './scheduling-api-based-pages.service';
import { SchedulingFilterService } from './scheduling-filter.service';
import { SchedulingApiService, SchedulingApiShift } from './shared/api/scheduling-api.service';

describe('SchedulingFilterService #needsapi', () => {
	let api : SchedulingApiService;
	let service : SchedulingFilterService;
	let me : MeService;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [SchedulingFilterService] });

	const getApiQueryParams = (dataType : PossibleApiLoadDataValues) : HttpParams => {
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

	beforeAll(async () => {
		me = await testingUtils.login();
		api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, getApiQueryParams('calendar'));
		service = testingUtils.getService(SchedulingFilterService);
		service.initValues();
	});

	it('should create', () => {
		expect(service).toBeTruthy();
	});

	describe('.hideAllAbsences', () => {
		it('.hideAllAbsences should be false', () => {
			expect(service.hideAllAbsences).toBeDefined();
		});
		it('should hide absences', () => {
			service.hideAllAbsences = true;
			if (api.data.absences.length) {
				expect(service.isVisible(api.data.absences.get(0)!)).toBeFalsy();
			} else {
				expect(service.hideAllAbsences).toBe(true);
			}
		});
		it('should not hide absences', () => {
			service.hideAllAbsences = false;
			if (api.data.absences.length) {
				expect(service.isVisible(api.data.absences.get(0)!)).toBeTruthy();
			} else {
				expect(service.hideAllAbsences).toBe(false);
			}
		});
	});

	describe('.hideAllShiftsFromOthers', () => {
		it('should be false by default', () => {
			expect(service.hideAllShiftsFromOthers).toBeDefined();
			expect(service.hideAllShiftsFromOthers).toBeFalsy();
		});
		it('should hide other shifts', () => {
			expect(service.hideAllShiftsFromOthers).toBeDefined();
			const allFilteredShiftsLength = api.data.shifts.filterBy(shift => service.isVisible(shift)).length;
			service.hideAllShiftsFromOthers = true;
			const myFilteredShiftsLength = api.data.shifts.filterBy(shift => service.isVisible(shift)).length;
			expect(allFilteredShiftsLength).toBeGreaterThan(myFilteredShiftsLength);
			const shifts = api.data.shifts.filterBy(shift => service.isVisible(shift));
			for (const shift of shifts.iterable()) {
				expect(shift.assignedMemberIds.contains(me.data.id) || shift.emptyMemberSlots).toBeTruthy();
			}
		});

		it('should show shift with me assigned and one free slot', () => {
			// Create a shift with me assigned plus one free space.
			const newShift = new SchedulingApiShift(api);
			newShift.assignedMemberIds.push(me.data.id);
			newShift.neededMembersCount = 2;

			service.hideAllShiftsFromOthers = true;
			expect(service.isVisible(newShift)).toBeTruthy();
		});

		it('should show shift with other assigned and one free slot', () => {
			// Create a shift with me assigned plus one free space.
			const newShift = new SchedulingApiShift(null);
			newShift.assignedMemberIds.push(Id.create(123456711));
			newShift.neededMembersCount = 2;

			service.hideAllShiftsFromMe = false;
			service.hideAllShiftsFromOthers = true;
			expect(service.isVisible(newShift)).toBeTruthy();
		});

		it('should be reset', () => {
			service.unload();
			service.initValues();
			expect(service.hideAllShiftsFromOthers).toBeFalsy();
		});
		afterAll(() => {
			service.unload();
			service.initValues();
		});
	});

	describe('.hideAllShifts', () => {
		it('should be false', () => {
			expect(service.hideAllShifts).toBeDefined();
		});
		it('should hide shifts', () => {
			service.hideAllShifts = true;
			if (api.data.shifts.length) {
				expect(service.isVisible(api.data.shifts.get(0)!)).toBeFalsy();
			} else {
				expect(service.hideAllShifts).toBe(true);
			}
		});
		it('should show shifts', () => {
			service.hideAllShifts = false;
			if (api.data.shifts.length) {
				expect(service.isVisible(api.data.shifts.get(0)!)).toBeTruthy();
			} else {
				expect(service.hideAllShifts).toBe(false);
			}
		});
	});

	describe('.hideAllHolidays', () => {
		it('should be false', () => {
			expect(service.hideAllHolidays).toBeDefined();
		});
		it('should hide holidays', () => {
			service.hideAllHolidays = true;
			if (api.data.holidays.length) {
				expect(service.isVisible(api.data.holidays.get(0)!)).toBeFalsy();
			} else {
				expect(service.hideAllHolidays).toBe(true);
			}
		});
		it('should show holidays', () => {
			service.hideAllHolidays = false;
			if (api.data.holidays.length) {
				expect(service.isVisible(api.data.holidays.get(0)!)).toBeTruthy();
			} else {
				expect(service.hideAllHolidays).toBe(false);
			}
		});
	});

	describe('.hideAllAbsences && .hideAllShifts', () => {
		it('should show all shifts if both are false', () => {
			service.hideAllShifts = false;
			service.hideAllAbsences = false;
			const shiftsLength = api.data.shifts.length;
			const filteredShiftsLength = api.data.shifts.filterBy(item => service.isVisible(item)).length;
			expect(shiftsLength).toBe(filteredShiftsLength);
		});

		it('should hide all shifts if both are true', () => {
			service.hideAllShifts = true;
			service.hideAllAbsences = true;
			const filteredShiftsLength = api.data.shifts.filterBy(item => service.isVisible(item)).length;
			expect(filteredShiftsLength).toBe(0);
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
		it('should be false if hideAllAbsences is true', () => {
			service.hideAllAbsences = true;
			expect(service.isSetToShowAll).toBe(false);
		});
		it('should be false if hideAllShifts is true', () => {
			service.hideAllShifts = true;
			expect(service.isSetToShowAll).toBe(false);
		});
		it('should be false if hideAllShiftsFromOthers is true', () => {
			service.hideAllShiftsFromOthers = true;
			expect(service.isSetToShowAll).toBe(false);
		});
	});

	it('unload() should make everything visible', () => {
		service.hideAllAbsences = true;
		service.hideAllShifts = true;
		service.hideAllHolidays = true;
		expect(service.isSetToShowAll).toBe(false);
		service.unload();
		service.initValues();
		expect(service.isSetToShowAll).toBe(true);
	});
});
