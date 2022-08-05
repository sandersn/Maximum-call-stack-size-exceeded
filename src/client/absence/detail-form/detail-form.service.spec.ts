import { FormGroup } from '@angular/forms';
import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { SchedulingApiAbsence } from '@plano/shared/api';
import { SchedulingApiAbsenceType } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PAbsenceDetailFormService } from './detail-form.service';

describe('#PAbsenceDetailFormService', () => {
	let service : PAbsenceDetailFormService;
	const testingUtils = new TestingUtils();

	testingUtils.init({
		imports: [SchedulingModule],
	});

	beforeAll(done => {
		service = testingUtils.getService(PAbsenceDetailFormService);
		// service.initValues();
		done();
	});

	beforeEach(done => {
		// service.unload();
		// service.initValues();
		done();
	});

	it('should have a defined instance', () => {
		expect(service).toBeDefined();
	});

	describe('generateFormGroup()', () => {
		it('should be defined', () => {
			expect(service.generateFormGroup).toBeDefined();
		});
		it('should throw if absence is undefined', () => {
			expect(() => {
				const absence : SchedulingApiAbsence | null = null;
				service.generateFormGroup(absence as unknown as SchedulingApiAbsence);
			}).toThrow();
		});
		describe('returned FormGroup', () => {
			describe('for new absence', () => {
				let formGroup : FormGroup;
				beforeAll(() => {
					const absence : SchedulingApiAbsence = new SchedulingApiAbsence(null);
					absence.type = SchedulingApiAbsenceType.ILLNESS;
					formGroup = service.generateFormGroup(absence);
				});
				it('should return FormGroup', () => {
					expect(formGroup).toBeDefined();
					expect(formGroup instanceof FormGroup).toBeDefined();
				});
				it('should be invalid', () => {
					expect(formGroup.invalid).toBe(true);
				});
				describe('fill with necessary values', () => {
					beforeAll(() => {
						formGroup.get('memberId')!.setValue(Id.create(123123));
						formGroup.get('start')!.setValue(1585036800000);
						formGroup.get('end')!.setValue(1585063800000);
						formGroup.get('visibleToTeamMembers')!.setValue(true);
					});
					it('should be valid', () => {
						expect(formGroup.invalid).toBe(false);
						expect(formGroup.errors).toBe(null);
					});

					describe('set fullday to true', () => {
						beforeAll(() => {
							formGroup.get('fullday')!.setValue(true);
						});
						it('should be invalid after set to fullday', () => {
							expect(formGroup.invalid).toBe(true);
						});
						describe('set start, end and workingTimePerDay', () => {
							beforeAll(() => {
								formGroup.get('start')!.setValue(1585036800000);
								formGroup.get('end')!.setValue(1585063800000);
								formGroup.get('workingTimePerDay')!.setValue(1);
							});
							it('should be invalid after set start, end, to fullday', () => {
								expect(formGroup.invalid).toBe(false);
							});
							describe('set workingTimePerDay to 0', () => {
								beforeAll(() => {
									formGroup.get('workingTimePerDay')!.setValue(0);
								});
								it('should be invalid after set start, end, to fullday', () => {
									expect(formGroup.invalid).toBe(true);
								});
							});
						});

					});

				});

			});
		});
	});
});
