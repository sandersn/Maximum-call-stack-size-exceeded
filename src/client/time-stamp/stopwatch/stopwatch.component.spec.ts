import { TimeStampModule } from '@plano/client/time-stamp/time-stamp.module';
import { TimeStampApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { StopwatchComponent } from './stopwatch.component';

describe('StopwatchComponent #needsapi', () => {
	let component : StopwatchComponent;

	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [TimeStampModule] });

	beforeAll((done) => {
		testingUtils.login({
			success: () => {
				testingUtils.unloadAndLoadApi(TimeStampApiService, () => {
					component = testingUtils.createComponent(StopwatchComponent);
					done();
				});
			},
		});
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

	// it('pauseButtonDisabled()', () => {
	// 	expect(component.startButtonDisabled()).toBe(true);
	// 	component.disabled = false;
	// 	expect(component.pauseButtonDisabled()).toBe(true);
	// 	component.shiftStarted = true;
	// 	component.shiftEnded = false;
	// 	expect(component.pauseButtonDisabled()).toBe(false);
	// 	component.shiftStarted = true;
	// 	component.shiftEnded = true;
	// 	expect(component.pauseButtonDisabled()).toBe(true);
	// });

	// it('stopButtonDisabled()', () => {
	// 	expect(component.startButtonDisabled()).toBe(true);
	// 	component.disabled = false;
	// 	expect(component.stopButtonDisabled()).toBe(true);
	// 	component.shiftStarted = true;
	// 	component.shiftEnded = false;
	// 	expect(component.stopButtonDisabled()).toBe(false);
	// 	component.shiftStarted = true;
	// 	component.shiftEnded = true;
	// 	expect(component.stopButtonDisabled()).toBe(true);
	// });

	// it('stopButtonDisabled()', () => {
	// 	expect(component.startButtonDisabled()).toBe(true);
	// 	component.disabled = false;
	// 	expect(component.stopButtonDisabled()).toBe(true);
	// 	component.shiftStarted = true;
	// 	component.shiftEnded = false;
	// 	expect(component.stopButtonDisabled()).toBe(false);
	// 	component.shiftStarted = true;
	// 	component.shiftEnded = true;
	// 	expect(component.stopButtonDisabled()).toBe(true);
	// });

	// it('timestampToTimeStruct()', () => {
	// 	let mockTimestamp : number;
	// 	mockTimestamp = 1487206800 * 1000; // Thu, 16 Feb 2017 02:00:00
	// 	expect(component.timestampToTimeStruct(mockTimestamp)).toEqual({
	// 		hour: 2,
	// 		minute: 0
	// 	});
	// 	mockTimestamp = 1487257040 * 1000; // Thu, 16 Feb 2017 15:57:20
	// 	expect(component.timestampToTimeStruct(mockTimestamp)).toEqual({
	// 		hour: 15,
	// 		minute: 57
	// 	});
	// });

	// it('getTimeForModal()', () => {
	// 	component.shiftItem = new ShiftWrapper([]);

	// 	// Thu, 16 Feb 2017 02:00:00
	// 	component.shiftItem.start = 1487206800 * 1000;
	// 	expect(component.getTimeForModal()).toEqual({
	// 		hour: 2,
	// 		minute: 0
	// 	});

	// 	// Thu, 16 Feb 2017 15:57:20
	// 	component.shiftItem.start = 1487257040 * 1000;
	// 	expect(component.getTimeForModal()).toEqual({
	// 		hour: 15,
	// 		minute: 57
	// 	});
	// });

	// MOCK DOES NOT WORK!
	// it('shiftSelectionIsValid', () => {
	// 	expect(component.shiftSelectionIsValid()).toBe(false);
	// 	let mockShift = new TimeStampApiShift([]);
	// 	component.onShiftSelect(mockShift);
	// 	expect(component.shiftSelectionIsValid()).toBe(true);
	// 	let mockShiftModel = new TimeStampApiShiftModel([]);
	// 	component.onShiftModelSelect(mockShiftModel);
	// 	expect(component.shiftSelectionIsValid()).toBe(true);
	// });


});
