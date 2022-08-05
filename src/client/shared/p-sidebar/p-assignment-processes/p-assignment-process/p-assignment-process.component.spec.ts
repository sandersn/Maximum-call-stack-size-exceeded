import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { SchedulingApiService, SchedulingApiAssignmentProcess } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PAssignmentProcessComponent } from './p-assignment-process.component';

describe('PAssignmentProcessComponent #needsapi', () => {
	let component : PAssignmentProcessComponent;
	let api : SchedulingApiService;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [SchedulingModule] });

	beforeAll(async () => {
		await testingUtils.login();
		api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, testingUtils.getApiQueryParams('calendar'));
		component = testingUtils.createComponent(PAssignmentProcessComponent);
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

	describe('someShiftsArePartOfAProcess(shifts)', () => {
		it('should be false with empty processes', () => {
			for (const assignmentProcess of api.data.assignmentProcesses.iterable()) {
				assignmentProcess.shiftRefs.clear();
			}
			component.process = new SchedulingApiAssignmentProcess(null);
			expect(component.someShiftsArePartOfAProcess(api.data.shifts.selectedItems)).toBe(false);
		});
		// it('should be false if another shift of the same packet is part of the process', () => {
		// 	const assignmentProcesses = new SchedulingApiAssignmentProcesses(null, false);
		// 	const shifts = new SchedulingApiShifts(null, false);
		//
		// 	shifts.createNewItem(3);
		//
		// 	for (let i = 0; i < 3; i++) {
		// 		const SHIFT = new SchedulingApiShift(null);
		// 		SHIFT.id = Id.create(4);
		// 		shifts.push(SHIFT);
		// 	}
		//
		// 	assignmentProcesses.containsAnyShift(shifts)
		// 	.findBy((item) => api.data.shifts.selectedItems.containsAny(item.shiftRefs));
		//
		// 	expect(component.someShiftsArePartOfAProcess(api.data.shifts.selectedItems)).toBe(false);
		// });
	});
});
