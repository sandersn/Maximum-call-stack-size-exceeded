import { HttpParams } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiShiftModels } from '@plano/shared/api';
import { SchedulingApiShift } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { ROUTES } from '../client-routing.module';
import { FilterService } from '../shared/filter.service';

describe('FilterService #needsapi', () => {
	let api : SchedulingApiService;
	let service : FilterService;
	let me : MeService;
	const testingUtils = new TestingUtils();
	const pMoment = new PMomentService(PSupportedLocaleIds.de_DE);

	testingUtils.init({
		imports: [
			SchedulingModule,
			RouterTestingModule.withRoutes(ROUTES),
		],
	});

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

	beforeAll(async () => {
		me = await testingUtils.login();
		api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, getApiQueryParams('calendar'));
		service = testingUtils.getService(FilterService);
		service.initValues();
	});

	beforeEach((done) => {
		service.unload();
		service.initValues();
		done();
	});

	it('should have a defined component', () => {
		expect(service).toBeDefined();
	});

	describe('.schedulingFilterService', () => {
		testingUtils.init(
			{
				imports: [],
				providers: [SchedulingApiService],
			},
		);

		beforeAll(async () => {
			me = await testingUtils.login();
			api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, getApiQueryParams('calendar'));
		});


		describe('.showItemsWithEmptyMemberSlot', () => {
			it('should be false', () => {
				expect(service.schedulingFilterService.showItemsWithEmptyMemberSlot).toBeDefined();
			});
		});
	});

	it('toggleItem()', () => {
		const member = api.data.members.get(0)!;
		const serviceContainsMemberBefore : boolean = service.isVisible(member);
		service.toggleItem(member);
		let serviceContainsMemberAfter : boolean = service.isVisible(member);
		expect(serviceContainsMemberBefore).toBe(!serviceContainsMemberAfter);
		service.toggleItem(member);
		serviceContainsMemberAfter = service.isVisible(member);
		expect(serviceContainsMemberBefore).toBe(serviceContainsMemberAfter);
	});

	describe('isSetToShowAll', () => {
		beforeEach(() => {
			service.unload();
			service.initValues();
		});
		it('should be true per default', () => {
			expect(service.isSetToShowAll).toBe(true);
		});
		it('should be false if isOnlyEarlyBirdAssignmentProcesses is true', () => {
			service.isOnlyEarlyBirdAssignmentProcesses = true;
			expect(service.isSetToShowAll).toBe(false);
		});
		it('should be false if isOnlyWishPickerAssignmentProcesses is true', () => {
			service.isOnlyWishPickerAssignmentProcesses = true;
			expect(service.isSetToShowAll).toBe(false);
		});
	});

	it('toggleMembers(members)', () => {
		const members = api.data.members;
		expect(service.isVisible(members)).toBeTruthy();
		service.toggleMembers(members);
		expect(service.isVisible(members)).toBeFalsy();
		service.toggleMembers(members);
		expect(service.isVisible(members)).toBeTruthy();
	});

	it('someMembersAreVisible(members)', () => {
		const members = api.data.members;
		expect(members.length).toBeGreaterThanOrEqual(3);

		// Make sure this works even if trashed members are inside.
		const atLeast2TrashedMembersAreInside = () : boolean => members.filterBy(item => item.trashed).length >= 2;
		if (!atLeast2TrashedMembersAreInside()) {
			members.get(0)!.trashed = true;
			members.get(1)!.trashed = true;
		}
		expect(atLeast2TrashedMembersAreInside()).toBeTrue();

		const isVisible = service.isVisible(members);
		if (!isVisible) service.toggleMembers(members);
		expect(service.isVisible(members)).toBeTruthy();
		// Toggle only one of the trashed members
		service.toggleItem(members.filterBy(item => item.trashed).get(0)!);
		expect(service.isVisible(members)).toBeFalse();
		expect(service.someMembersAreVisible(members)).toBeTruthy();
	});

	describe('isVisible(api.data.shiftModels)', () => {
		it('should be true after showAll()', () => {
			expect(service.isVisible(api.data.shiftModels)).toBeTruthy();
		});

		it('should be false after showAll() + toggleShiftModels(api.data.shiftModels)', () => {
			service.toggleShiftModels(api.data.shiftModels);
			expect(api.data.shiftModels.filterBy(item => !item.trashed).length).toBeGreaterThan(0);
			expect(service.isVisible(api.data.shiftModels)).toBe(false);

		});

		it('should accept SchedulingApiShiftModels', () => {
			expect(api.data.shiftModels.length).toBeGreaterThan(3);
			service.toggleMembers(api.data.members);
			service.toggleShiftModels(api.data.shiftModels);
			service.schedulingFilterService.showItemsWithEmptyMemberSlot = false;
			const someShiftModels = new SchedulingApiShiftModels(api, false);
			someShiftModels.push(api.data.shiftModels.get(0)!);
			someShiftModels.push(api.data.shiftModels.get(1)!);
			someShiftModels.push(api.data.shiftModels.get(2)!);
			service.toggleShiftModels(someShiftModels);
			expect(service.isVisible(api.data.shiftModels)).toBeFalsy();
			expect(service.isVisible(someShiftModels)).toBeTruthy();
		});

	});

	describe('toggleShiftModels(api.data.shiftModels)', () => {

		it('should toggle all shiftmodels', () => {
			expect(service.isVisible(api.data.shiftModels)).toBeTruthy();
			service.toggleShiftModels(api.data.shiftModels);
			expect(service.isVisible(api.data.shiftModels)).toBeFalsy();
		});

		it('should toggle some shiftmodels if param is set', () => {
			// Make sure there are enough shiftmodels for this test
			expect(api.data.shiftModels.filterBy(item => !item.trashed).length).toBeGreaterThan(3);
			service.toggleShiftModels(api.data.shiftModels);
			expect(service.isVisible(api.data.shiftModels)).toBeFalsy();
			const someShiftModels = new SchedulingApiShiftModels(api, false);
			someShiftModels.push(api.data.shiftModels.get(0)!);
			someShiftModels.push(api.data.shiftModels.get(1)!);
			service.toggleShiftModels(someShiftModels);
			expect(service.isVisible(api.data.shiftModels)).toBeFalsy();
			expect(service.isVisible(someShiftModels)).toBeTruthy();
			expect(service.someShiftModelsAreVisible).toBeTruthy();
			service.toggleShiftModels(someShiftModels);
			expect(service.isVisible(api.data.shiftModels)).toBeFalsy();
			expect(service.isVisible(someShiftModels)).toBeFalsy();

		});
	});

	describe('show() + isVisible()', () => {
		it('should accept member', () => {
			service.toggleMembers(api.data.members);
			const member = api.data.members.get(0)!;
			expect(service.isVisible(member)).toBe(false);
			service.toggleItem(member);
			expect(service.isVisible(member)).toBe(true);
		});
		it('should accept shiftModel', () => {
			service.toggleShiftModels(api.data.shiftModels);
			const shiftModel = api.data.shiftModels.get(0)!;
			expect(service.isVisible(shiftModel)).toBe(false);
			service.toggleItem(shiftModel);
			expect(service.isVisible(shiftModel)).toBe(true);
		});
	});

	describe('hide() + isVisible()', () => {
		it('should accept member', () => {
			const member = api.data.members.get(0)!;
			expect(service.isVisible(member)).toBe(true);
			service.hide(member);
			expect(service.isVisible(member)).toBe(false);
		});
		it('should accept shiftModel', () => {
			const shiftModel = api.data.shiftModels.get(0)!;
			expect(service.isVisible(shiftModel)).toBe(true);
			service.hide(shiftModel);
			expect(service.isVisible(shiftModel)).toBe(false);
		});
		it('should accept multiple shiftModel', () => {
			let tempLength = 0;
			for (const shiftModel of api.data.shiftModels.iterable()) {
				service.hide(shiftModel);
				expect(service.hiddenItems['shiftModels'].length).toBe(tempLength + 1);
				tempLength++;
			}
		});
	});

	it('isHideAll(api.data.members, api.data.shiftModels)', () => {
		service.toggleMembers(api.data.members);
		service.toggleShiftModels(api.data.shiftModels);
		expect(service.isHideAll(api.data.members, api.data.shiftModels)).toBe(true);
	});

	it('isVisible(api.data.members)', () => {
		expect(service.isVisible(api.data.members)).toBe(true);
		service.toggleMembers(api.data.members);
		expect(service.isVisible(api.data.members)).toBe(false);
	});

	it('isHideAllMembers(api.data.members)', () => {
		expect(service.isHideAllMembers(api.data.members)).toBe(false);
		service.toggleMembers(api.data.members);
		expect(service.isHideAllMembers(api.data.members)).toBe(true);
	});

	describe('isVisible()', () => {
		let shift : SchedulingApiShift;
		beforeAll(() => {
			shift = api.data.shifts.get(0)!;
			if (!shift.assignedMemberIds.contains(api.data.members.get(0)!.id)) {
				shift.assignedMemberIds.push(api.data.members.get(0)!.id);
			}
			if (!shift.assignedMemberIds.contains(api.data.members.get(1)!.id)) {
				shift.assignedMemberIds.push(api.data.members.get(1)!.id);
			}

			if (!service.isVisible(shift.model)) service.toggleItem(shift.model);

			for (const assignedMember of shift.assignedMembers.iterable()) {
				if (!service.isVisible(assignedMember)) service.toggleItem(assignedMember);
			}
		});

		it('should be true if everything is ok', () => {
			expect(service.isVisible(shift)).toBe(true);
		});

		it('should be false if model is hidden', () => {
			service.hide(shift.model);
			expect(service.isVisible(shift)).toBe(false);
			service.toggleItem(shift.model);
		});

		it('should be true if only one assignedMember is hidden', () => {
			service.hide(shift.assignedMembers.get(0)!);
			expect(service.isVisible(shift)).toBe(shift.assignedMembers.length > 1);
		});

		describe('all assignedMembers are hidden', () => {
			beforeEach(() => {
				for (const assignedMember of shift.assignedMembers.iterable()) {
					service.hide(assignedMember);
				}
			});

			it('should be false', () => {
				shift.neededMembersCount = shift.assignedMembers.length;
				expect(shift.emptyMemberSlots).toBe(0);
				expect(service.isVisible(shift)).toBe(false);
			});

			it('should be true if there are free slots', () => {
				shift.neededMembersCount = shift.assignedMembers.length + 1;
				expect(shift.emptyMemberSlots).toBe(1);
				expect(service.isVisible(shift)).toBe(true);
			});

		});
	});

	describe('isOnlyMember(me.data.id)', () => {
		beforeAll(() => {
			service.unload();
			service.initValues();
		});
		it('should be true after showOnlyMember(me.data.id)', () => {
			service.showOnlyMember(me.data.id, true);
			expect(service.isOnlyMember(me.data.id)).toBe(true);
		});
		it('should be true after other member gets trashed', () => {
			service.showOnlyMember(me.data.id, true);
			api.data.members.get(2)!.trashed = true;
			expect(service.isOnlyMember(me.data.id)).toBe(true);
		});
	});

	it('isHideShiftModels(api.data.shiftModels)', () => {
		expect(service.isHideShiftModels(api.data.shiftModels)).toBe(false);
		service.toggleShiftModels(api.data.shiftModels);
		expect(service.isHideShiftModels(api.data.shiftModels)).toBe(true);
	});

	it('someShiftModelsAreVisible()', () => {
		const someShiftModelsAreVisible = service.someShiftModelsAreVisible();
		expect(someShiftModelsAreVisible).toBe(true);
		const shiftModel = api.data.shiftModels.get(0);
		service.hide(shiftModel!);
		service.unload();
		service.initValues();
	});

	it('unload() should make everything visible', () => {
		service.toggleMembers(api.data.members);
		service.toggleShiftModels(api.data.shiftModels);
		service.schedulingFilterService.showItemsWithEmptyMemberSlot = false;
		expect(service.isSetToShowAll).toBe(false);
		service.unload();
		service.initValues();
		expect(service.isSetToShowAll).toBe(true);
	});

});
