import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiAbsence } from '@plano/shared/api';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PAllDayItemComponent } from './p-all-day-item.component';

describe('PAllDayItemComponent #needsapi', () => {
	let component : PAllDayItemComponent;
	const testingUtils = new TestingUtils();
	const pMoment = new PMomentService(PSupportedLocaleIds.de_DE);

	testingUtils.init({ imports : [SchedulingModule] });

	beforeAll((done) => {
		testingUtils.login({
			success : () => {
				testingUtils.unloadAndLoadApi(
					SchedulingApiService,
					() => {
						component = testingUtils.createComponent(PAllDayItemComponent);
						done();
					},
					testingUtils.getApiQueryParams('calendar'),
				);
			},
		});
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

	describe('.absence', () => {
		it('should not be defined', () => {
			expect(component.item).not.toBeDefined();
		});
	});

	describe('with defined absence and day', () => {
		beforeAll(() => {
			const now = +pMoment.m();
			const item = new SchedulingApiAbsence(null);
			item.time.start = +pMoment.m(now);
			item.time.end = +pMoment.m(now).add(1, 'week');
			component.item = item;
			component.startOfDay = now;
		});

		describe('.isFirstItemOfAbsence', () => {
			it('should be defined', () => {
				expect(component.isFirstItemOfItem).toBeDefined();
			});

			it('should be false', () => {
				expect(component.isFirstItemOfItem).toBeTruthy();
			});
		});

		describe('.isLastItemOfAbsence', () => {
			it('should be defined', () => {
				expect(component.isLastItemOfItem).toBeDefined();
			});
			it('should be true', () => {
				expect(component.isLastItemOfItem).toBeFalsy();
			});
		});

	});


});
