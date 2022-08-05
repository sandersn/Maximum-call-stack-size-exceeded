import { NgZone } from '@angular/core';
import { ReportFilterService } from '@plano/client/report/report-filter.service';
import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { FilterService } from '@plano/client/shared/filter.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { ClientRoutingService } from '@plano/client/shared/routing.service';
import { MeService} from '@plano/shared/api';
import { SchedulingApiShiftAssignedMemberIds } from '@plano/shared/api';
import { SchedulingApiAbsenceType, SchedulingApiMemo } from '@plano/shared/api';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { PCookieService } from '@plano/shared/core/p-cookie.service';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { SchedulingApiBooking, SchedulingApiBookings } from './scheduling-api-booking.service';
import { SchedulingApiWorkingTime } from './scheduling-api-working-time.service';
import { SchedulingApiService, SchedulingApiAbsences, SchedulingApiMembers } from './scheduling-api.service';
import { SchedulingApiAbsence } from './scheduling-api.service';
import { SchedulingApiMemos } from './scheduling-api.service';
import { FakeSchedulingApiService } from './scheduling-api.service.mock';
import { SchedulingFilterService } from '../../scheduling-filter.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createFitsSearchTest = (fn : (term : string) => unknown, term : string, result : any) : void => {
	it(`should return ${result.toString()} for »${term}«`, () => {
		expect(fn(term)).toBe(result);
	});
};

describe('SchedulingApiService Base #needsapi', () => {
	let api : SchedulingApiService;
	let pCookieService : PCookieService;
	let me : MeService;
	const testingUtils = new TestingUtils();
	const pMoment = new PMomentService(PSupportedLocaleIds.de_DE);
	let zone : NgZone;
	let logService : LogService;
	let clientRoutingService : ClientRoutingService;
	let reportFilterService : ReportFilterService;
	let schedulingFilterService : SchedulingFilterService;

	testingUtils.init({ imports: [SchedulingModule] });

	beforeAll(async () => {
		zone = testingUtils.getService(NgZone);
		logService = testingUtils.getService(LogService);
		me = await testingUtils.login();
		pCookieService = testingUtils.getService(PCookieService);
		clientRoutingService = testingUtils.getService(ClientRoutingService);
		schedulingFilterService = testingUtils.getService(SchedulingFilterService);
		reportFilterService = testingUtils.getService(ReportFilterService);
		api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, testingUtils.getApiQueryParams('calendar'));
	});

	it('should have a defined component', () => {
		expect(api).toBeDefined();
	});

	describe('api.data', () => {
		it('api.data should be defined', () => {
			expect(api.data).toBeDefined();
		});
	});

	describe('#SchedulingApiShiftModels', () => {

		it('api.data.shiftModels', () => {
			expect(api.data.shiftModels).toBeDefined();
			expect(api.data.shiftModels.length).toBeGreaterThan(0);
			expect(api.data.shiftModels.get(0)).toBeDefined();
		});

	});

	describe('#SchedulingApiAbsences', () => {
		let items : SchedulingApiAbsences;

		beforeAll(() => {
			Config.LOCALE_ID = PSupportedLocaleIds.en_GB;

			items = new SchedulingApiAbsences(null, false);

			const item = new SchedulingApiAbsence(null, 123);
			const DATE = (new PMomentService(PSupportedLocaleIds.en_GB)).m().startOf('day').add(1, 'day').subtract(1, 'hour');
			item.time.start = +DATE;
			item.time.end = +DATE.add(9, 'hours');

			items.push(item);

			const item2 = new SchedulingApiAbsence(null, 123);
			const DATE2 = (new PMomentService(PSupportedLocaleIds.en_GB)).m().startOf('day').add(9, 'hours');
			item2.time.start = +DATE2;
			item2.time.end = +DATE2.add(8, 'hours');

			items.push(item2);
		});

		afterAll(() => {
			Config.LOCALE_ID = PSupportedLocaleIds.de_DE;
		});

		it('should have absences', () => {
			expect(items).toBeDefined();
			expect(items.length).toBeGreaterThan(0);
		});

		it('should have two items today', () => {
			const startOfDay = +(new PMomentService(PSupportedLocaleIds.en_GB).m().startOf('day'));
			const itemsOfToday = items.getByDay(startOfDay);
			expect(itemsOfToday).toBeDefined();
			expect(itemsOfToday.length).toBe(2);
		});
	});

	describe('#SchedulingApiAbsence', () => {
		let item : SchedulingApiAbsence;

		beforeEach(() => {
			item = new SchedulingApiAbsence(api);
			const oneHour = 1000 * 60 * 60;
			item.time.start = Date.now() - (oneHour * 3);
			item.time.end = Date.now();
			item.type = SchedulingApiAbsenceType.ILLNESS;
		});

		it('absence', () => {
			expect(item).toBeDefined();
		});
		it('absence.title', () => {
			expect(typeof item.title).toBe('string');
		});
		it('absence.typeIconName', () => {
			expect(typeof item.typeIconName).toBe('string');
		});

		describe('absence.totalDaysBetween()', () => {
			describe('2017-10-26 is day of time-shift', () => {
				const daylightSavingTimeShift = (
					startDate : string,
					endDate : string,
					result : number,
					addHours : number = 0,
				) : void => {
					let title = `should return a round number between ${startDate} and ${endDate}`;
					if (addHours) title += ` plus ${addHours}`;
					it(title, () => {
						item.time.start = +(new PMomentService(PSupportedLocaleIds.de_DE).m(startDate).startOf('day').subtract(addHours, 'hours'));
						item.time.end = +(new PMomentService(PSupportedLocaleIds.de_DE).m(endDate).startOf('day'));
						const oneDay = 1000 * 60 * 60 * 24;
						const wayBefore = item.time.start - (oneDay * 10);
						const wayAfter = item.time.end + (oneDay * 10);
						expect(item.totalDaysBetween(wayBefore, wayAfter)).toBe(result);
					});
				};

				daylightSavingTimeShift('2017-10-1', '2017-10-3', 2);
				daylightSavingTimeShift('2017-10-29', '2017-10-31', 2.5, 12);
				daylightSavingTimeShift('2017-10-20', '2017-10-22', 2.5, 12);
				daylightSavingTimeShift('2017-10-24', '2017-10-26', 2, 0);
				daylightSavingTimeShift('2017-10-24', '2017-10-26', 2.5, 12);
				daylightSavingTimeShift('2017-10-29', '2017-11-1', 3.5, 12);
			});
		});


	});

	describe('#SchedulingApiWorkingTime', () => {

		describe('with more pause then work', () => {
			let item : SchedulingApiWorkingTime;

			beforeEach(() => {
				item = new SchedulingApiWorkingTime(api);
				item.time.start = Date.now() - (1000 * 60 * 60 * 3);
				item.time.end = Date.now();
				item.regularPauseDuration = (1000 * 60 * 60 * 4);
				item.hourlyEarnings = 4;
			});

			it('item is defined', () => {
				expect(item).toBeDefined();
			});
			it('item duration is 0', () => {
				expect(item.duration).toBe(0);
			});
			it('total earnings is 0', () => {
				expect(item.totalEarnings).toBe(0);
			});

		});
	});

	describe('#SchedulingApiShift', () => {
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

		it('shift.start', () => {
			const shift = api.data.shifts.get(0);
			if (!shift) {
				expect().nothing();
				// eslint-disable-next-line no-console
				console.warn('--------------- WARNING: No shift available. Skipping test…');
			} else {
				expect(shift.start).toBeDefined();
				expect(shift.start).toBeGreaterThan(0);
			}
		});
	});

	describe('#SchedulingApiShifts', () => {

		it(`withoutShiftModels( filterService.hiddenItems['shiftModels'] ) should not hide items`, () => {
			const filterService = new FilterService(
				api, pCookieService, zone, logService, clientRoutingService, reportFilterService, schedulingFilterService,
			);
			filterService.unload();
			filterService.initValues();
			const shifts = api.data.shifts;
			expect(filterService.hiddenItems['shiftModels'].length).toBe(0);
			expect(shifts.withoutShiftModels(filterService.hiddenItems['shiftModels']).length).toBe(shifts.length);
		});

		it(`withoutShiftModels( filterService.hiddenItems['shiftModels'] ) should hide items`, () => {
			const filterService = new FilterService(
				api, pCookieService, zone, logService, clientRoutingService, reportFilterService, schedulingFilterService,
			);
			filterService.unload();
			filterService.initValues();
			const shifts = api.data.shifts;
			expect(shifts.withoutShiftModels(filterService.hiddenItems['shiftModels']).length).toBe(shifts.length);
			const modelOfFirstShift = api.data.shiftModels.get(shifts.get(0)!.shiftModelId);
			filterService.hide(modelOfFirstShift!);
			expect(filterService.hiddenItems['shiftModels'].length).toBe(1);
			expect(shifts.withoutShiftModels(filterService.hiddenItems['shiftModels']).length).toBeLessThan(shifts.length);
		});

		it(`withoutAssignedMembers( filterService.hiddenItems['shiftModels'] ) should not hide items`, () => {
			const filterService = new FilterService(
				api, pCookieService, zone, logService, clientRoutingService, reportFilterService, schedulingFilterService,
			);
			filterService.unload();
			filterService.initValues();
			const shifts = api.data.shifts;
			const counter = shifts.withoutAssignedMembers(
				filterService.hiddenItems['members'],
				filterService.schedulingFilterService,
			).length;
			expect(counter).toBe(shifts.length);
		});

		describe(`withoutAssignedMembers( filterService.hiddenItems['shiftModels'] )`, () => {

			it('should hide items', () => {
				// Create clean instance of FilterService
				const filterService = new FilterService(
					api, pCookieService, zone, logService, clientRoutingService, reportFilterService, schedulingFilterService,
				);
				filterService.unload();
				filterService.initValues();

				const shifts = api.data.shifts;
				const options = new SchedulingFilterService(me, pCookieService, zone);

				// Set options to show as much as possible
				options.showItemsWithEmptyMemberSlot = true;

				// Check if none of the filtered members are assigned anywhere. Our further test code relies on it.
				expect(shifts.withoutAssignedMembers(
					filterService.hiddenItems['members'],
					options,
				).length).toBe(shifts.length);

				// Check if there is a specific amount of members. Our test code relies on it.
				expect(api.data.members.length).toBeGreaterThan(3);

				// Pack a set of members into a wrapper
				const someMembers = new SchedulingApiMembers(null, false);
				someMembers.push(api.data.members.get(0)!);
				someMembers.push(api.data.members.get(1)!);
				someMembers.push(api.data.members.get(2)!);

				// Make sure they are all visible
				if (!filterService.isVisible(someMembers)) filterService.toggleMembers(someMembers);

				// Toggle them in filter (means hide them, because above we checked that they are visible)
				filterService.toggleMembers(someMembers);

				const FILTERED_SHIFTS_AMOUNT = shifts.withoutAssignedMembers(
					filterService.hiddenItems['members'],
					filterService.schedulingFilterService,
				).length;
				expect(FILTERED_SHIFTS_AMOUNT).toBeLessThan(shifts.length);
			});

			it('should hide items with different showItemsWithEmptyMemberSlot states', (done) => {
				const fakeApi = new FakeSchedulingApiService();

				// Create clean instance of FilterService
				const filterService = new FilterService(
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					fakeApi as any as SchedulingApiService, pCookieService, zone, logService, clientRoutingService, reportFilterService,
					schedulingFilterService,
				);
				filterService.unload();
				filterService.initValues();

				const shifts = fakeApi.data.shifts;

				shifts.createNewShift(fakeApi.data.shiftModels.get(0)!, new PMomentService().m(), null, (someNewShift) => {
					someNewShift.neededMembersCount = 3;

					const shiftWithOnlyEmptySlots = shifts.findBy(item => item.assignedMemberIds.length === 0 && item.emptyMemberSlots > 0);

					// Check if there is at least one item with only empty slots. Our further test code relies on it.
					expect(!!shiftWithOnlyEmptySlots).toBeTrue();

					const options = new SchedulingFilterService(me, pCookieService, zone);

					// Set options to show as much as possible
					options.showItemsWithEmptyMemberSlot = true;

					// Check if none of the filtered members are assigned anywhere. Our further test code relies on it.
					expect(shifts.withoutAssignedMembers(
						filterService.hiddenItems['members'],
						options,
					).length).toBe(shifts.length);
					expect(fakeApi.data.members.length).toBeGreaterThan(3);

					// Pack a set of members into a wrapper
					const someMembers = new SchedulingApiMembers(null, false);
					someMembers.push(fakeApi.data.members.get(0)!);
					someMembers.push(fakeApi.data.members.get(1)!);
					someMembers.push(fakeApi.data.members.get(2)!);

					const shiftForFirstMember = shifts.get(0);
					shiftForFirstMember!.neededMembersCount = 1;
					shiftForFirstMember!.assignedMemberIdsTestSetter = new SchedulingApiShiftAssignedMemberIds(null, false);
					shiftForFirstMember!.assignedMemberIds.push(someMembers.get(0)!.id);

					// Are they all visible?
					expect(filterService.isVisible(someMembers)).toBe(true);

					// Toggle them in filter (means hide them, because above we checked that they are visible)
					filterService.toggleMembers(someMembers);

					const test1ShiftsLength1 = shifts.withoutAssignedMembers(
						filterService.hiddenItems['members'],
						options,
					).length;
					const test1ShiftsLength2 = shifts.length;
					expect(test1ShiftsLength1).toBeLessThan(test1ShiftsLength2);
					options.showItemsWithEmptyMemberSlot = false;
					const test2ShiftsLength1 = shifts.withoutAssignedMembers(
						filterService.hiddenItems['members'],
						options,
					).length;
					options.showItemsWithEmptyMemberSlot = true;
					const test2ShiftsLength2 = shifts.withoutAssignedMembers(
						filterService.hiddenItems['members'],
						options,
					).length;
					options.showItemsWithEmptyMemberSlot = true;

					expect(test2ShiftsLength1).toBeLessThan(test2ShiftsLength2);

					done();
				});
			});

		});

		it('filterBy( filterService : FilterService ) should not hide items', () => {
			const filterService = new FilterService(
				api, pCookieService, zone, logService, clientRoutingService, reportFilterService, schedulingFilterService,
			);
			filterService.unload();
			filterService.initValues();
			const shifts = api.data.shifts;
			expect(shifts.length).toBeGreaterThan(0);
			expect(shifts.filterByFilterService(filterService).length).toBe(shifts.length);
		});

		it('filterBy( filterService : FilterService ) should hide items', () => {
			const filterService = new FilterService(
				api, pCookieService, zone, logService, clientRoutingService, reportFilterService, schedulingFilterService,
			);
			filterService.unload();
			filterService.initValues();
			const shifts = api.data.shifts;
			expect(shifts.length).toBeGreaterThan(0);
			expect(shifts.filterByFilterService(filterService).length).toBeGreaterThan(0);
			expect(shifts.filterByFilterService(filterService).length).toBe(shifts.length);
			filterService.hide(api.data.shiftModels.get(0)!);
			let tempLength : number;
			for (const shiftModel of api.data.shiftModels.iterable()) {
				filterService.hide(shiftModel);
				tempLength = shifts.filterByFilterService(filterService).length;
				expect(tempLength).toBeLessThanOrEqual(shifts.length);
			}
		});

	});

	describe('#SchedulingApiMemos', () => {

		it('some memos should exists in order to make tests possible', () => {
			expect(api.data.memos.length).toBeGreaterThan(0);
		});

		it('getByDay(undefined) should throw error', () => {
			expect(() => {
				api.data.memos.getByDay(undefined!);
			}).toThrowError(Error);
		});

		it('getByDay(0) should throw', () => {
			expect(() => api.data.memos.getByDay(0)).toThrow();
		});

		it('getByDay(someTimestamp) should return a memo', () => {
			const start = api.data.memos.get(0)!.start;
			expect(!!api.data.memos.getByDay(+pMoment.m(start).startOf('day'))).toBe(true);
		});

		it('return of getByDay(someTimestamp) should have correct type', () => {
			const start = api.data.memos.get(0)!.start;
			expect(api.data.memos.getByDay(start) instanceof SchedulingApiMemo).toBe(true);
		});

		it('getByDay(someOtherTimestamp) should throw if timestamp is not the start of a day', () => {
			const start = api.data.memos.get(0)!.start;
			expect(() => api.data.memos.getByDay(start + 123)).toThrow();
		});

		it('getByDay(someOtherTimestamp) should return undefined', () => {
			const start = api.data.memos.get(0)!.start;
			expect(api.data.memos.getByDay(+pMoment.m(start).add(1, 'day').startOf('day'))).toBeNull();
		});

		it('getByDay(someOtherTimestamp) should return undefined', () => {
			const memos = new SchedulingApiMemos(null, false);
			expect(memos.length).toBe(0);
			const timestamp = +pMoment.m().subtract(10, 'years').startOf('day');
			expect(memos.getByDay(timestamp)).toBeNull();
		});

	});

	const getBooking = (
		firstName : string,
		lastName : string,
		email : string,
		bookingNumber : number,
		participantFirstName : string,
		participantLastName : string,
	) : SchedulingApiBooking => {
		const booking = new SchedulingApiBooking(null, +(`123${bookingNumber}`));
		booking.firstName = firstName;
		booking.lastName = lastName;
		booking.email = email;
		booking.bookingNumberTestSetter = bookingNumber;
		const PARTICIPANT = booking.participants.createNewItem();
		PARTICIPANT.firstName = participantFirstName;
		PARTICIPANT.lastName = participantLastName;
		return booking;
	};

	describe('#SchedulingApiBooking', () => {

		const FIRST_NAME = 'Hans';
		const LAST_NAME = 'Müller';

		describe(`booking by ${FIRST_NAME} ${LAST_NAME} with participant Max Mayer`, () => {
			const booking : SchedulingApiBooking = getBooking(
				FIRST_NAME,
				LAST_NAME,
				'hans@dr-plano.de',
				123456,
				'Max',
				'Mayer',
			);

			describe('fitsSearch()', () => {
				createFitsSearchTest(term => booking.fitsSearch(term), 'Hans', true);
				createFitsSearchTest(term => booking.fitsSearch(term), 'hans ', true);
				createFitsSearchTest(term => booking.fitsSearch(term), 'Müll', true);
				createFitsSearchTest(term => booking.fitsSearch(term), 'Müll ', true);
				createFitsSearchTest(term => booking.fitsSearch(term), 'Müller', true);
				createFitsSearchTest(term => booking.fitsSearch(term), 'müller', true);
				createFitsSearchTest(term => booking.fitsSearch(term), 'Mayer', true);
				createFitsSearchTest(term => booking.fitsSearch(term), 'Max Mayer', true);
				createFitsSearchTest(term => booking.fitsSearch(term), 'Hans Müller', true);
				createFitsSearchTest(term => booking.fitsSearch(term), 'Hans Müll', true);
				createFitsSearchTest(term => booking.fitsSearch(term), 'Hansi Müller', true);
				createFitsSearchTest(term => booking.fitsSearch(term), 'Stefan Müller', true);
				// cSpell:ignore Kowalsky
				createFitsSearchTest(term => booking.fitsSearch(term), 'Stefan Kowalsky', false);
				createFitsSearchTest(term => booking.fitsSearch(term), 'Stefan ', false);
				createFitsSearchTest(term => booking.fitsSearch(term), 'hans@dr-plano.de', true);
				createFitsSearchTest(term => booking.fitsSearch(term), 'hans@drplano.com', false);
			});
		});
	});

	describe('#SchedulingApiBookings', () => {
		let bookings : SchedulingApiBookings;

		const addBooking = (
			list : SchedulingApiBookings,
			firstName : string,
			lastName : string,
			email : string,
			bookingNumber : number,
		) : void => {
			list.push(getBooking(firstName, lastName, email, bookingNumber, firstName, lastName));
		};

		beforeAll(() => {
			bookings = new SchedulingApiBookings(null, false);
			addBooking(bookings, 'Hans', 'Müller', 'hans@dr-plano.de', 566);
			addBooking(bookings, 'John', 'Doe', 'john@dr-plano.com', 665);
		});

		describe('search() with 2 bookings for John Doe and Hans Müller', () => {
			createFitsSearchTest(term => bookings.search(term).length, 'hans', 1);
			createFitsSearchTest(term => bookings.search(term).length, 'Müller', 1);
			createFitsSearchTest(term => bookings.search(term).length, 'Hans Müller', 1);
			createFitsSearchTest(term => bookings.search(term).length, 'Hansi Müller', 1);
			createFitsSearchTest(term => bookings.search(term).length, 'Stefan Müller', 1);
			createFitsSearchTest(term => bookings.search(term).length, 'Stefan Kowalsky', 0);
			createFitsSearchTest(term => bookings.search(term).length, 'Stefan ', 0);
			createFitsSearchTest(term => bookings.search(term).length, 'John', 1);
			createFitsSearchTest(term => bookings.search(term).length, 'John Hans', 2);
			createFitsSearchTest(term => bookings.search(term).length, 'hans@dr-plano.de', 1);
		});
	});
});
