import { SchedulingApiShiftModelCourseTariffs, SchedulingApiShiftModelCoursePaymentMethods } from '@plano/client/scheduling/shared/api/scheduling-api-shiftmodel-course.service';
import { Id } from '@plano/shared/api/base/id';
import { PShiftmodelTariffService } from './p-shiftmodel-tariff.service';

describe('PShiftmodelTariffService', () => {
	let service : PShiftmodelTariffService;

	beforeAll(() => {
		service = new PShiftmodelTariffService(undefined!, undefined!, undefined!);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('isFreeCourse()', () => {
		let paymentMethods : SchedulingApiShiftModelCoursePaymentMethods;
		beforeAll(() => {
			paymentMethods = new SchedulingApiShiftModelCoursePaymentMethods(null, false);
			const paymentMethod = paymentMethods.createNewItem(Id.create(121213));
			paymentMethod.isInternal = false;
		});

		it('true with no tariff', () => {
			const courseTariffs = new SchedulingApiShiftModelCourseTariffs(null, false);
			expect(service.isFreeCourse(courseTariffs, paymentMethods)).toBe(true);
		});

		it('true with trashed items', () => {
			const courseTariffs = new SchedulingApiShiftModelCourseTariffs(null, false);
			const tarif = courseTariffs.createNewItem(Id.create(124));
			tarif.trashed = true;
			expect(service.isFreeCourse(courseTariffs, paymentMethods)).toBe(true);
		});

		it('true with one tariff for 0€', () => {
			const courseTariffs = new SchedulingApiShiftModelCourseTariffs(null, false);
			const tarif = courseTariffs.createNewItem(Id.create(124));
			const fee = tarif.fees.createNewItem(Id.create(44543));
			fee.fee = 0;
			expect(service.isFreeCourse(courseTariffs, paymentMethods)).toBe(true);
		});

		it('true with one internal tariff for 0€', () => {
			const courseTariffs = new SchedulingApiShiftModelCourseTariffs(null, false);
			const tarif = courseTariffs.createNewItem(Id.create(124));
			tarif.isInternal = true;
			const fee = tarif.fees.createNewItem(Id.create(44543));
			fee.fee = 0;
			expect(service.isFreeCourse(courseTariffs, paymentMethods)).toBe(true);
		});

		it('false with one tariff for 12€', () => {
			const courseTariffs = new SchedulingApiShiftModelCourseTariffs(null, false);
			const tarif = courseTariffs.createNewItem(Id.create(124));
			const fee = tarif.fees.createNewItem(Id.create(44543));
			fee.fee = 12;
			expect(service.isFreeCourse(courseTariffs, paymentMethods)).toBe(false);
		});

		it('true with one internal tariff with 12€', () => {
			const courseTariffs = new SchedulingApiShiftModelCourseTariffs(null, false);
			const tarif = courseTariffs.createNewItem(Id.create(124));
			tarif.isInternal = true;
			const fee = tarif.fees.createNewItem(Id.create(44543));
			fee.fee = 12;
			expect(service.isFreeCourse(courseTariffs, paymentMethods)).toBe(true);
		});
	});
});
