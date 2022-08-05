import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiBooking } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { DetailFormComponent } from './detail-form.component';

describe('#Booking_DetailFormComponent #needsapi', () => {
	let component : DetailFormComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [SchedulingModule] });

	beforeAll((done) => {
		testingUtils.login(
			{
				success: () => {
					testingUtils.unloadAndLoadApi(SchedulingApiService, () => {
						component = testingUtils.createComponent(DetailFormComponent);
						done();
					}, testingUtils.getApiQueryParams('calendar'));
				},
			});
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

	describe('initComponent()', () => {
		beforeAll(() => {
			const booking = new SchedulingApiBooking(null);
			component.item = booking;
		});

		it('should have a defined component', () => {
			expect(component).toBeDefined();
		});

		it('should not throw', () => {
			expect(() => {
				component.initComponent();
			}).not.toThrow();
		});
	});

	describe('initValues()', () => {
		beforeAll(() => {
			component.item = null;
		});

		it('should have a defined component', () => {
			expect(component).toBeDefined();
		});

		it('should throw if booking is not defined', () => {
			expect(() => {
				component.initValues();
			}).toThrow();
		});
	});

	describe('get isLoaded', () => {
		beforeAll(() => {
			const booking = new SchedulingApiBooking(null);
			component.item = booking;
		});

		it('should have a defined component', () => {
			expect(component).toBeDefined();
		});

		it('should be false if booking is not defined', () => {
			expect(component.isLoaded).toBeFalsy();
		});
		it('should be false if booking has no shiftModelId', () => {
			component.item = new SchedulingApiBooking(null);
			expect(component.isLoaded).toBeFalsy();
		});
		it('should be false if formGroup has not been initialized yet', () => {
			component.item = new SchedulingApiBooking(null);
			component.item.shiftModelId = Id.create(123);
			expect(component.isLoaded).toBeFalsy();
		});
	});

});
