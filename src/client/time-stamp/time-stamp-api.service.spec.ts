import { TimeStampModule } from '@plano/client/time-stamp/time-stamp.module';
import { TimeStampApiService } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { TestingUtils } from '@plano/shared/testing/testing-utils';


describe('TimeStampApiService #needsapi', () => {
	let api : TimeStampApiService;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [TimeStampModule] });

	beforeAll(async () => {
		await testingUtils.login();
		api = await testingUtils.unloadAndLoadApi(TimeStampApiService);
	});

	it('should have a defined component', () => {
		expect(api).toBeDefined();
	});

	it('api.data should be defined', () => {
		expect(api.data).toBeDefined();
	});

	// describe('api.data.selectedItem.name', () => {
	//
	// 	// it('shift should be null without api.save', () => {
	// 	// 	let item : TimeStampApiShift;
	// 	// 	item = api.data.shifts.get(0);
	// 	// 	expect(api.data.selectedItem).toBeNull();
	// 	// 	if (!item) {
	// 	// 		console.warn('--------------- WARNING: No shiftModelParent available. Skipping test…');
	// 	// 	} else {
	// 	// 		api.data.selectedItem = item;
	// 	// 		expect(api.data.selectedItem).toBeNull();
	// 	// 		api.data.selectedItem = undefined;
	// 	// 	}
	// 	// });
	// 	//
	// 	// it('shiftModel should be null without api.save', () => {
	// 	// 	let item : TimeStampApiShiftModel;
	// 	// 	item = api.data.shiftModelParents.get(0).shiftModels.get(0);
	// 	// 	expect(api.data.selectedItem).toBeNull();
	// 	// 	if (!item) {
	// 	// 		console.warn('--------------- WARNING: No shiftModelParent available. Skipping test…');
	// 	// 	} else {
	// 	// 		api.data.selectedItem = item;
	// 	// 		expect(api.data.selectedItem).toBeNull();
	// 	// 		api.data.selectedItem = undefined;
	// 	// 	}
	// 	// });
	//
	// 	// it('shift should be defined api.save()', (done : any) => {
	// 	// 	let item : TimeStampApiShift;
	// 	// 	item = api.data.shifts.get(0);
	// 	// 	if (!item) { done(); } else {
	// 	// 		api.data.selectedItem = item;
	// 	// 		api.save({
	// 	// 			success: () => {
	// 	// 				expect(api.data.selectedItem.name).toBeDefined();
	// 	// 				expect(api.data.selectedItem.name.length).toBeGreaterThan(0);
	// 	// 				done();
	// 	// 			},
	// 	// 			error: () => {
	// 	// 				expect(true).toBe(false);
	// 	// 				done();
	// 	// 			}
	// 	// 		});
	// 	// 	}
	// 	// });
	//
	// 	// it('shiftModel should be defined after api.save()', (done : any) => {
	// 	// 	let item : TimeStampApiShiftModel;
	// 	// 	item = api.data.shiftModelParents.get(0).shiftModels.get(0);
	// 	// 	if (!item) { done(); } else {
	// 	// 		api.data.selectedItem = item;
	// 	// 		api.save({
	// 	// 			success: () => {
	// 	// 				expect(api.data.selectedItem.name).toBeDefined();
	// 	// 				expect(api.data.selectedItem.name.length).toBeGreaterThan(0);
	// 	// 				done();
	// 	// 			},
	// 	// 			error: () => {
	// 	// 				expect(true).toBe(false);
	// 	// 				done();
	// 	// 			}
	// 	// 		});
	// 	// 	}
	// 	// });
	//
	// });


	describe('this.data.selectedShiftId', () => {

		it('should accept undefined', () => {
			api.data.selectedShiftId = undefined!;
			expect(!api.data.selectedItem).toBeTruthy();
		});

		it('should accept an instance of Id', () => {
			const shift = api.data.shifts.get(0);
			if (!shift) {
				expect().nothing();
				// eslint-disable-next-line no-console
				console.warn('--------------- WARNING: No shift available. Skipping test…');
			} else {
				api.data.selectedShiftId = shift.id;
				expect(api.data.selectedShiftId.rawData).toEqual(shift.id.rawData);
			}
		});

	});

	it('this.data.selectedShiftModelId = undefined', () => {
		api.data.selectedShiftModelId = undefined!;
		expect(api.data.selectedShiftModelId).toBeDefined();
		expect(api.data.selectedShiftModelId).toBeNull();
	});
	it('this.data.selectedShiftModelId = Id.create(42)', () => {
		api.data.selectedShiftModelId = Id.create(42);
		expect(api.data.selectedShiftModelId.rawData).toBe(42);
	});

	// describe('api.data.selectedShift', () => {
	// 	it('should accept shift', (done : any) => {
	// 		let item : TimeStampApiShift;
	// 		item = api.data.shifts.get(0);
	// 		if (!item) { done(); } else {
	// 			api.data.selectedItem = item;
	// 			expect(api.data.selectedShift).toBeDefined();
	// 			expect(api.data.selectedShift.id).toEqual(item.id);
	// 			expect(api.data.selectedShift.name).toEqual(item.name);
	// 			done();
	// 		}
	// 	});

	// 	BUG: test: api.data.selectedShift should accept shiftModel
	// 	it('should accept shiftModel', (done : any) => {
	// 		let item : TimeStampApiShiftModel;
	// 		item = api.data.shiftModels.get(0);
	// 		if (!item) { done(); } else {
	// 			api.data.selectedItem = item;
	// 			expect(api.data.selectedShift).toBeDefined();
	// 			expect(api.data.selectedShift.id).toEqual(item.id);
	// 			expect(api.data.selectedShift.name).toEqual(item.name);
	// 			api.data.selectedItem = undefined;
	// 			done();
	// 		}
	// 	});
	// });

	it('shiftModels', () => {
		expect(api.data.shiftModels).toBeDefined();
		expect(api.data.shiftModels.length).toBeGreaterThan(0);
		expect(api.data.shiftModels.get(0)).toBeDefined();
	});


});
