import { SchedulingApiShiftExchange } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PShiftExchangeModule } from './p-shift-exchange.module';
import { PShiftExchangeService } from './shift-exchange.service';

describe('#PShiftExchangeService', () => {
	let service : PShiftExchangeService;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [PShiftExchangeModule] });

	beforeAll(() => {
		service = testingUtils.getService(PShiftExchangeService);
	});

	it('should have a defined component', () => {
		expect(service).toBeDefined();
	});

	describe('isAllowedToEditIsIllness()', () => {
		describe('on new item', () => {
			let shiftExchange : SchedulingApiShiftExchange;
			beforeAll(() => {
				shiftExchange = new SchedulingApiShiftExchange(null);
			});

			it('should be defined', () => {
				expect(service.isAllowedToEditIsIllness(shiftExchange)).toBeDefined();
			});
			it('should be true', () => {
				expect(service.isAllowedToEditIsIllness(shiftExchange)).toBe(true);
			});
		});

		it('should be false on existing illness report', () => {
			const shiftExchange = new SchedulingApiShiftExchange(null, 3);
			shiftExchange.isIllness = true;
			shiftExchange.indisposedMemberId = Id.create(1000);
			expect(service.isAllowedToEditIsIllness(shiftExchange)).toBe(false);
		});
	});

	describe('shiftRefsIsDisabled()', () => {
		describe('on new item', () => {
			it('should be false', () => {
				const shiftExchange = new SchedulingApiShiftExchange(null);
				shiftExchange.indisposedMemberId = Id.create(3);
				expect(service.shiftRefsIsDisabled(shiftExchange)).toBeFalsy();
			});
			it('should be true if no indisposed member is defined', () => {
				const shiftExchange = new SchedulingApiShiftExchange(null);
				expect(service.shiftRefsIsDisabled(shiftExchange)).toBeTruthy();
			});
		});
		// describe('on existing item', () => {
		// 	it('should be true if adam looks at hans’ non-illness', () => {
		// 		const shiftExchange = new SchedulingApiShiftExchange(null, 1);
		// 		shiftExchange.indisposedMemberId = Id.create(2);
		// 		expect(service.shiftRefsIsDisabled(shiftExchange)).toBe(false);
		// 	});
		// });
	});

});
