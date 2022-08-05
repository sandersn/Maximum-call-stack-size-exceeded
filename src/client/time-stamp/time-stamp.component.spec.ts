import { HttpParams } from '@angular/common/http';
import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { TimeStampModule } from '@plano/client/time-stamp/time-stamp.module';
import { SchedulingApiService } from '@plano/shared/api';
import { TimeStampApiService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { TimeStampComponent } from './time-stamp.component';

describe('TimeStampComponent #needsapi', () => {
	let component : TimeStampComponent;
	let api : TimeStampApiService;
	let schedulingApi : SchedulingApiService;
	const pMoment = new PMomentService(PSupportedLocaleIds.de_DE);

	const testingUtils = new TestingUtils();

	/**
	 * getApiQueryParams
	 */
	// eslint-disable-next-line func-style
	function getApiQueryParams() : HttpParams {
		const now = pMoment.m();

		return new HttpParams()
			.set('data', 'calendar')
			.set('start', now.clone().subtract(2, 'week').valueOf().toString())
			.set('end', now.clone().add(2, 'week').valueOf().toString());
	}

	testingUtils.init({ imports : [TimeStampModule, SchedulingModule] });

	beforeAll(async () => {
		await testingUtils.login();
		schedulingApi = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, getApiQueryParams());
		const me = testingUtils.getService(MeService);

		// Assign logged in user to a bunch of shifts in the past
		const thePast = +pMoment.m().subtract(6, 'days');
		const now = +pMoment.m();
		const shifts = schedulingApi.data.shifts.between(thePast, now);
		for (const item of shifts.iterable()) {
			item.assignedMemberIds.push(me.data.id);
			for (const assignmentProcess of schedulingApi.data.assignmentProcesses.iterable()) {
				assignmentProcess.shiftRefs.removeItem(item.id);
			}
		}
		await schedulingApi.save();
		api = await testingUtils.unloadAndLoadApi(TimeStampApiService);
		component = testingUtils.createComponent(TimeStampComponent);
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

	it('api should have at least one shift', () => {
		// This can be expected because one shift has been customized in beforeAll()
		expect(api.data.shifts.length).toBeGreaterThan(0);
	});

	describe('default value of', () => {
		it('isUnplanned should be false', () => {
			expect(component.isUnplanned).toBeFalsy();
		});
		it('disableShiftSelect should be false', () => {
			expect(component.disableShiftSelect).toBeFalsy();
		});
		it('api.data.selectedItem should be null', () => {
			expect(api.data.selectedItem).toBeNull();
		});
	});

	// BUG: No shifts available for this test

	// describe('select shift', () => {
	// 	beforeAll(() => {
	// 		component.resetTimeStamp();
	// 		component.onSelectShiftId(api.data.shifts.get(0).id);
	// 	}, jasmine.DEFAULT_TIMEOUT_INTERVAL);
	//
	// 	it('selectedItem should not be defined', () => {
	// 		expect(!api.data.selectedItem).toBeTruthy();
	// 	});
	// 	it('selectedItem should be defined', () => {
	// 		expect(!!component.tempSelectedItem).toBeTruthy();
	// 	});
	//
	// 	it('disableShiftSelect should be false', () => {
	// 		expect(component.disableShiftSelect).toBeFalsy();
	// 	});
	// 	it('disableShiftModelSelect should be false', () => {
	// 		expect(component.disableShiftModelSelect).toBeTruthy();
	// 	});
	// 	it('disableUnplannedShiftToggle should be false', () => {
	// 		expect(component.disableUnplannedShiftToggle).toBeFalsy();
	// 	});
	//
	// 	// it('startButtonDisabled should be false', () => {
	// 	// 	expect(component.startButtonDisabled).toBeFalsy();
	// 	// });
	// 	//
	// 	// describe('PLANO-6941', () => {
	// 	// 	beforeAll(() => {
	// 	// 		api.startTimeStampForSelectedItem(+pMoment.m());
	// 	// 		api.stopTimeStamp(+pMoment.m().add(2, 'hours'));
	// 	// 		component.resetTimeStamp();
	// 	// 	}, jasmine.DEFAULT_TIMEOUT_INTERVAL);
	// 	// 	it('startButtonDisabled should be true', () => {
	// 	// 		expect(component.startButtonDisabled).toBeTruthy();
	// 	// 	});
	// 	// });
	//
	// 	// describe('start shift', () => {
	// 	// 	beforeAll(() => {
	// 	// 		api.startTimeStampForSelectedItem(+pMoment.m());
	// 	// 	}, jasmine.DEFAULT_TIMEOUT_INTERVAL);
	// 	//
	// 	// 	it('selectedItem should be defined', () => {
	// 	// 		expect(api.data.selectedItem).toBeDefined();
	// 	// 	});
	// 	//
	// 	//
	// 	//
	// 	// });
	//
	// });

	afterAll(() => {
		component.resetTimeStamp();
	});

});
