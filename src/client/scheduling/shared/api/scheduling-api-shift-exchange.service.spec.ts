import { GenerateShiftExchangesOptions } from './scheduling-api-shift-exchange.service';

// describe('SchedulingApiShiftExchange', () => {
// 	let item : SchedulingApiShiftExchange;
//
// 	beforeEach(() => {
// 		item = new SchedulingApiShiftExchange(null);
// 	});
//
// 	it('should create', () => {
// 	});
// });


describe('#GenerateShiftExchangesOptions', () => {
	let item : GenerateShiftExchangesOptions;

	beforeEach(() => {
		item = new GenerateShiftExchangesOptions();
	});

	it('class should be defined', () => {
		expect(item).toBeDefined();
	});
	it('class.mode should be undefined', () => {
		expect(item.mode).toBeNull();
		expect(item.daysBefore).toBeNull();
		expect(item.deadline).toBeNull();
	});
});
