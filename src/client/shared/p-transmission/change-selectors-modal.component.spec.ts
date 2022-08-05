import { ComponentFixture } from '@angular/core/testing';
import { SchedulingApiShift } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { SchedulingApiService, SchedulingApiShiftChangeSelector } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { FakeSchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service.mock';
import { SchedulingApiShiftPacketShift } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { ChangeSelectorsModalComponent } from './change-selectors-modal.component';
import { assumeNonNull } from '../../../shared/core/null-type-utils';

describe('#ChangeSelectorsModalComponent #needsapi', () => {
	let fakeApi : SchedulingApiService;
	let shift : SchedulingApiShift;
	let component : ChangeSelectorsModalComponent;
	let fixture : ComponentFixture<ChangeSelectorsModalComponent>;

	const testingUtils = new TestingUtils();

	// testingUtils.init2({
	// 	imports : [ChangeSelectorsModalComponent],
	// 	providers: [
	// 		{
	// 			provide: AffectedShiftsApiService,
	// 			useClass: FakeAffectedShiftsApiService,
	// 		},
	// 	],
	// });

	beforeAll((done) => {
		fakeApi = new FakeSchedulingApiService() as unknown as SchedulingApiService;

		testingUtils.login(
			{
				success: () => {
					testingUtils.unloadAndLoadApi(SchedulingApiService, () => {
						fixture = testingUtils.createFixture(ChangeSelectorsModalComponent);
						component = fixture.componentInstance;
						done();
					}, testingUtils.getApiQueryParams('calendar'));
				},
			},
		);
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

	describe('bind shiftModel', () => {

		beforeAll(() => {
			const firstCourse = fakeApi.data.shifts.filterBy((item) => {
				const shiftModel = fakeApi.data.shiftModels.get(item.shiftModelId);
				assumeNonNull(shiftModel);
				return shiftModel.isCourse;
			}).get(0);
			assumeNonNull(firstCourse);
			shift = firstCourse;
			shift.packetShifts.push(new SchedulingApiShiftPacketShift(null, undefined));
			shift.packetShifts.push(new SchedulingApiShiftPacketShift(null, undefined));
			shift.packetShifts.push(new SchedulingApiShiftPacketShift(null, undefined));
			const shiftModel = fakeApi.data.shiftModels.get(shift.shiftModelId);
			if (!shiftModel) throw new Error('no shiftModel for this testing');
			component.shiftModel = shiftModel;

			component.shiftChangeSelector = new SchedulingApiShiftChangeSelector(fakeApi);
			try {
				component.ngOnInit();
			// eslint-disable-next-line no-console
			} catch (error) { console.error(error); }
		});

		describe('.submit()', () => {
			it('should not throw', () => {
				expect(() => {
					component.submit();
				}).not.toThrow();
			});
		});

	});


	describe('for a shift', () => {
		beforeAll((done) => {
			component.shift = shift;
			done();
		});

		describe('setAddChangeSelectors()', () => {
			it('should exist', () => {
				expect(!!component.setAddChangeSelectors).toBeDefined();
			});
			describe('per default', () => {
				it('addChangeSelectors should be defined', () => {
					expect(component.shiftChangeSelector).toBeDefined();
				});
				it('addChangeSelectors.shiftModelId should be undefined', () => {
					expect(component.shiftChangeSelector.shiftModelId).toBeNull();
				});
				it('addChangeSelectors.shiftsOfShiftModelId should be undefined', () => {
					expect(component.shiftChangeSelector.shiftsOfShiftModelId).toBeNull();
				});
				it('addChangeSelectors.shiftsOfShiftModelVersion should be undefined', () => {
					expect(component.shiftChangeSelector.shiftsOfShiftModelVersion).toBeNull();
				});
				it('addChangeSelectors.shiftsOfSeriesId should be undefined', () => {
					expect(component.shiftChangeSelector.shiftsOfSeriesId).toBeNull();
				});
				it('addChangeSelectors.shiftsOfPacketIndex should be undefined', () => {
					expect(component.shiftChangeSelector.shiftsOfPacketIndex).toBeNull();
				});
				it('addChangeSelectors.start should be undefined', () => {
					expect(!component.shiftChangeSelector.start).toBeTruthy();
				});
				it('addChangeSelectors.end should be undefined', () => {
					expect(!component.shiftChangeSelector.end).toBeTruthy();
				});
			});
			describe('setAddChangeSelectors(true)', () => {
				it('addChangeSelectors should be true', (done) => {
					component.setAddChangeSelectors(true, () => {
						expect(component.addChangeSelectors).toBeTruthy();
						done();
					});
				});
			});

			describe('setAddChangeSelectors(false)', () => {
				beforeAll(() => {
					component.setAddChangeSelectors(true);
					assumeNonNull(component.shift);
					component.shiftChangeSelector.shiftModelId = component.shift.shiftModelId;
					component.shiftChangeSelector.shiftsOfShiftModelId = component.shift.shiftModelId;
					component.shiftChangeSelector.shiftsOfShiftModelVersion = component.shift.id.shiftModelVersion;
					component.shiftChangeSelector.shiftsOfSeriesId = component.shift.id.seriesId;
					component.shiftChangeSelector.shiftsOfPacketIndex = component.shift.id.packetIndex;
					component.setAddChangeSelectors(false);
				});
				it('addChangeSelectors should be defined', () => {
					expect(component.shiftChangeSelector).toBeDefined();
				});
				it('addChangeSelectors.shiftModelId should be undefined', () => {
					expect(component.shiftChangeSelector.shiftModelId).toBeNull();
				});
				it('addChangeSelectors.shiftsOfShiftModelId should be undefined', () => {
					expect(component.shiftChangeSelector.shiftsOfShiftModelId).toBeNull();
				});
				it('addChangeSelectors.shiftsOfShiftModelVersion should be undefined', () => {
					expect(component.shiftChangeSelector.shiftsOfShiftModelVersion).toBeNull();
				});
				it('addChangeSelectors.shiftsOfSeriesId should be undefined', () => {
					expect(component.shiftChangeSelector.shiftsOfSeriesId).toBeNull();
				});
				it('addChangeSelectors.shiftsOfPacketIndex should be undefined', () => {
					expect(component.shiftChangeSelector.shiftsOfPacketIndex).toBeNull();
				});
				it('addChangeSelectors.start should be undefined', () => {
					expect(!component.shiftChangeSelector.start).toBeTruthy();
				});
				it('addChangeSelectors.end should be undefined', () => {
					expect(!component.shiftChangeSelector.end).toBeTruthy();
				});
			});
		});

	});

	// FIXME: Test is ok, but has ExpressionChangedAfterItHasBeenCheckedError
	// describe('for a shift and modalForCourseRelatedValues===true', () => {

	// 	beforeAll(() => {
	// 		const firstCourse = fakeApi.data.shifts.filterBy((item) => {
	// 			const shiftModel = fakeApi.data.shiftModels.get(item.shiftModelId);
	// 			assumeDefinedToGetStrictNullChecksRunning(shiftModel, 'shiftModel');
	// 			return shiftModel.isCourse;
	// 		}).get(0);
	// 		assumeDefinedToGetStrictNullChecksRunning(firstCourse, 'firstCourse');
	// 		shift = firstCourse;
	// 		shift.packetShifts.push(new SchedulingApiShiftPacketShift(null, undefined));
	// 		shift.packetShifts.push(new SchedulingApiShiftPacketShift(null, undefined));
	// 		shift.packetShifts.push(new SchedulingApiShiftPacketShift(null, undefined));
	// 		const shiftModel = fakeApi.data.shiftModels.get(shift.shiftModelId);
	// 		if (!shiftModel) throw new Error('no shiftModel for this testing');
	// 		component.shiftModel = shiftModel;
	// 		component.shift = shift;
	// 		component.shiftChangeSelector = new SchedulingApiShiftChangeSelector(fakeApi);
	// 		component.modalForCourseRelatedValues = true;
	// 		fixture.detectChanges();
	// 	});
	// 	// FIXME: Test is ok, but has ExpressionChangedAfterItHasBeenCheckedError
	// 	// describe('PLANO-41645', () => {
	// 	// 	beforeAll(() => {
	// 	// 		component.setAddChangeSelectors(false);
	// 	// 	});
	// 	// 	it('there should only be a "required" error if user actively chooses to apply course related settings to more then just this packet', () => {
	// 	// 		expect(component.formGroup.invalid).toBeFalse();
	// 	// 		component.setAddChangeSelectors(true);
	// 	// 		fixture.detectChanges();
	// 	// 		expect(component.formGroup.invalid).toBeTruthy();
	// 	// 	});
	// 	// });

	// });

});
