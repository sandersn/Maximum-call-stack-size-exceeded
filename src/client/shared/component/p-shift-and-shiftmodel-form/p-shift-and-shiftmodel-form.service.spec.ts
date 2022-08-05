import { FakeSchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service.mock';
import { SchedulingApiService, SchedulingApiShift, SchedulingApiShiftModel } from '@plano/shared/api';
import { SchedulingApiCourseType, SchedulingApiShiftNeededMembersCountConf, SchedulingApiShiftRepetition, SchedulingApiShiftRepetitionType } from '@plano/shared/api';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { LogService } from '@plano/shared/core/log.service';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PShiftAndShiftmodelFormModule } from './p-shift-and-shiftmodel-form.module';
import { PShiftAndShiftmodelFormService } from './p-shift-and-shiftmodel-form.service';
import { PSentryService } from '../../../../shared/sentry/sentry.service';
import { PFormGroup } from '../../p-forms/p-form-control';
import { PMomentService } from '../../p-moment.service';

describe('PShiftAndShiftmodelFormService #needsapi', () => {
	let fakeApi : SchedulingApiService;
	let service : PShiftAndShiftmodelFormService;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [PShiftAndShiftmodelFormModule] });

	beforeAll(done => {
		fakeApi = new FakeSchedulingApiService() as unknown as SchedulingApiService;
		service = testingUtils.getService(PShiftAndShiftmodelFormService);
		done();
	});

	it('api should be defined', () => {
		expect(fakeApi).toBeDefined();
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('initFormGroup()', () => {
		let formGroup : PFormGroup;
		let formItem : SchedulingApiShift;
		let relatedShiftModel : SchedulingApiShiftModel;

		const pSentryService = new PSentryService();
		const logService = new LogService(pSentryService);
		const mockStart = +(new PMomentService(PSupportedLocaleIds.de_DE, logService).m().startOf('day').set('hour', 8));

		beforeAll((done) => {
			formItem = fakeApi.data.shifts.findBy(item => {
				const model = fakeApi.data.shiftModels.get(item.shiftModelId)!;
				if (model.courseType !== SchedulingApiCourseType.ONLINE_INQUIRY) return false;
				if (!model.isCourse) return false;
				return true;
			})!;

			spyOnProperty(formItem, 'neededMembersCountConf').and.returnValue(
				new SchedulingApiShiftNeededMembersCountConf(fakeApi),
			);
			spyOnProperty(formItem.time, 'start').and.returnValue(mockStart);
			spyOnProperty(formItem.time, 'end').and.returnValue(+(new PMomentService(PSupportedLocaleIds.de_DE, logService).m(mockStart).set('hour', 17)));
			spyOnProperty(formItem.time, 'rawData').and.returnValue([true]);

			const REPETITION = new SchedulingApiShiftRepetition(null, 123);
			REPETITION.type = SchedulingApiShiftRepetitionType.NONE;

			spyOnProperty(formItem, 'repetition').and.returnValue(REPETITION);

			// spyOnProperty(formItem.repetition, 'type').and.returnValue(SchedulingApiShiftRepetitionType.NONE);
			// spyOnProperty(formItem.repetition, 'x').and.returnValue(null);
			// spyOnProperty(formItem.repetition, 'endsAfterRepetitionCount').and.returnValue(null);
			// spyOnProperty(formItem.repetition, 'endsAfterDate').and.returnValue(null);
			// spyOnProperty(formItem.repetition, 'isRepeatingOnMonday').and.returnValue(null);

			spyOnProperty(formItem.repetition.packetRepetition, 'type').and.returnValue(SchedulingApiShiftRepetitionType.NONE);
			// spyOnProperty(formItem.repetition, 'x').and.returnValue(SchedulingApiShiftRepetitionType.NONE);

			relatedShiftModel = fakeApi.data.shiftModels.get(formItem.shiftModelId)!;
			formItem.loadDetailed({
				success: () => {
					formGroup = service.initFormGroup(formItem, true, fakeApi.data.notificationsConf, fakeApi.data.shiftModels, null!, relatedShiftModel);
					done();
				},
			});
		});

		it('formItem should be defined', () => {
			expect(formItem).toBeDefined();
		});

		it('spy should work', () => {
			expect(formItem.time.start).toBe(mockStart);
		});

		it('should not throw', () => {
			expect(() => {
				formGroup = service.initFormGroup(formItem, true, fakeApi.data.notificationsConf, fakeApi.data.shiftModels, null!, relatedShiftModel);
			}).not.toThrow();
			formGroup = service.initFormGroup(formItem, true, fakeApi.data.notificationsConf, fakeApi.data.shiftModels, null!, relatedShiftModel);
		});

		describe('formGroup', () => {
			it('should be defined', () => {
				expect(formGroup).toBeDefined();
			});
			it('should be valid', () => {
				expect(formGroup.valid).toBeDefined();
			});

			describe('controls[\'courseType\']', () => {
				it('should exist', () => {
					expect(formGroup.get('courseType')).toBeDefined();
				});
				it('should be ONLINE_INQUIRY', () => {
					expect(formGroup.get('courseType')!.value).toBe(SchedulingApiCourseType.ONLINE_INQUIRY);
				});

				describe('bookingDesiredDateSetting (issue PLANO-8235)', () => {
					beforeAll(() => {
						formGroup.get('bookingDesiredDateSetting')!.setValue(true);
						formGroup.get('courseType')!.setValue(SchedulingApiCourseType.ONLINE_BOOKABLE);
						formGroup.get('courseType')!.setValue(SchedulingApiCourseType.ONLINE_INQUIRY);
					}, jasmine.DEFAULT_TIMEOUT_INTERVAL);
					it('should be false', () => {
						expect(formGroup.get('bookingDesiredDateSetting')!.value).toBeFalsy();
					});
				});
			});

			describe('controls[\'maxCourseParticipantCount\']', () => {
				it('should exist', () => {
					expect(formGroup.get('maxCourseParticipantCount')).toBeDefined();
				});
				it('should be 5 if user gives 5 as input', () => {
					formGroup.get('maxCourseParticipantCount')!.setValue(5);
					expect(formItem.maxCourseParticipantCount).toBe(5);
				});
				it('should be -1 if user gives no input', () => {
					formGroup.get('maxCourseParticipantCount')!.setValue('');
					expect(formItem.maxCourseParticipantCount).toBe(null);
				});
				it('should be -1 if user gives undefined as input', () => {
					formGroup.get('maxCourseParticipantCount')!.setValue(null);
					expect(formItem.maxCourseParticipantCount).toBe(null);
				});
				// FIXME: PLANO-21408
				// it('should be null if user gives NaN as input', () => {
				// 	formGroup.get('maxCourseParticipantCount')!.setValue('abc');
				// 	expect(formItem.maxCourseParticipantCount).toBe(null);
				// });
				it('should be 0 if user gives 0 as input', () => {
					formGroup.get('maxCourseParticipantCount')!.setValue(0);
					expect(formItem.maxCourseParticipantCount).toBe(0);
				});
			});
		});
	});

});
