import { DetailFormComponent } from './detail-form.component';
import { SchedulingApiService } from '../../../shared/api';
import { assumeNonNull } from '../../../shared/core/null-type-utils';
import { TestingUtils } from '../../../shared/testing/testing-utils';
import { SchedulingModule } from '../../scheduling/scheduling.module';
import { FakeSchedulingApiService } from '../../scheduling/shared/api/scheduling-api.service.mock';

describe('#Absence_DetailFormComponent', () => {
	let api : SchedulingApiService;
	let component : DetailFormComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [SchedulingModule] });

	beforeAll(() => {
		api = (new FakeSchedulingApiService()) as unknown as SchedulingApiService;
		component = testingUtils.createComponent(DetailFormComponent);
	});

	it('should have a defined component', () => {
		expect(component).not.toBeNull();
		expect(component).toBeDefined();
	});

	describe('existing item', () => {
		beforeAll(done => {
			const absence = api.data.absences.get(0);
			assumeNonNull(absence);
			absence.hourlyEarnings = 20;

			try {
				absence.loadDetailed({
					success: () => {
						component.item = absence;
						component.initComponent(() => {
							done();
						});
					},
				});
			} catch (catchError) {
				// eslint-disable-next-line no-console
				console.error(catchError);
			}

		});

		describe('formGroup', () => {
			it('should be defined', () => {
				expect(component.formGroup).not.toBeNull();
				expect(component.formGroup).toBeDefined();
			});

			describe('controls[\'hourlyEarnings\']', () => {
				it('should be defined', () => {
					assumeNonNull(component.formGroup);
					expect(component.formGroup.get('hourlyEarnings')!.valid).toBeDefined();
				});
				it('should be enabled', () => {
					assumeNonNull(component.formGroup);
					expect(component.formGroup.get('hourlyEarnings')!.enabled).toBe(true);
				});
				it('should be greater than 0', () => {
					assumeNonNull(component.formGroup);
					expect(component.formGroup.get('hourlyEarnings')!.value).toBeGreaterThan(0);
				});
				it('should be valid', () => {
					assumeNonNull(component.formGroup);
					expect(component.formGroup.get('hourlyEarnings')!.valid).toBe(true);
				});
			});

			describe('controls[\'start\']', () => {
				it('should be defined', () => {
					assumeNonNull(component.formGroup);
					expect(component.formGroup.get('start')!.valid).toBeDefined();
				});

				it('should be valid', () => {
					assumeNonNull(component.formGroup);
					expect(component.formGroup.get('start')!.valid).toBe(true);
				});

				it('should be able to take .setValue(undefined)', () => {
					expect(() => {
						assumeNonNull(component.formGroup);
						component.formGroup.get('start')!.setValue(undefined);
					}).not.toThrow();
				});
			});
			describe('controls[\'end\']', () => {
				it('should be able to take .setValue(undefined)', () => {
					expect(() => {
						assumeNonNull(component.formGroup);
						component.formGroup.get('end')!.setValue(undefined);
					}).not.toThrow();
				});
			});
		});
	});

});

// TODO: [PLANO-114054] Rewrite these tests. They broke at the end of the month.
