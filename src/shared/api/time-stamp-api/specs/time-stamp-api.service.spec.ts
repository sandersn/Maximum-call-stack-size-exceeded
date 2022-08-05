import { TimeStampApiService } from '@plano/shared/api';
import { TimeStampApiAllowedTimeStampDeviceBase } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../core/null-type-utils';
import { ApiTestingUtils } from '../../base/api-testing-utils';

describe('#TimeStampApiServiceBase #needsapi', () => {
	let api : TimeStampApiService;
	const testingUtils = new TestingUtils();
	const apiTestingUtils = new ApiTestingUtils();

	testingUtils.init(
		{
			imports: [],
		});

	beforeAll((done : any) => {
		testingUtils.login(
			{
				success: () => done(),
			});
	});

	const doTests = (plannedWork : boolean) : void => {
		it('load-clean-api', async () => {
			api = await testingUtils.unloadAndLoadApi(TimeStampApiService);
			expect().nothing();
		});

		it('should start time-stamp', (done : any) => {
			// HACK: At some point all available shifts are stamped. So, we cannot do this test anymore.
			// For the moment, this test will be ignored then.
			if (plannedWork && api.data.shifts.length === 0) {
				api.console.warn('--------------- WARNING: No shifts available to stamp. Skipping test…');
				done();
				return;
			}

			//
			// Do test
			//

			// set selected shift/shift-model
			if (plannedWork) {
				api.data.selectedShiftId = api.data.shifts.get(0)!.id;
			} else {
				api.data.selectedShiftModelId = api.data.shiftModels.get(0)!.id;
			}

			// set start time
			// Backend cuts all seconds of minutes. So, to be able to test value equality we do the same here.
			let start = Date.now();
			const minuteMillis = 60 * 1000;
			start = start - (start % minuteMillis);

			api.data.start = start;

			// save
			api.save({ success: () => {
				expect(api.data.selectedItem).toBeDefined();
				expect(api.data.start).toBe(start);

				done();
			}});
		});

		it('should start pause', (done : any) => {
			// HACK: At some point all available shifts are stamped. So, we cannot do this test anymore.
			// For the moment, this test will be ignored then.
			if (plannedWork && api.data.shifts.length === 0) {
				api.console.warn('--------------- WARNING: No shifts available to stamp. Skipping test…');
				done();
				return;
			}

			//
			// Do test
			//
			const pauseStart = Date.now();
			api.data.uncompletedRegularPauseStart = pauseStart;

			// save
			api.save({ success : () => {
				expect(api.data.uncompletedRegularPauseStart).toBe(pauseStart);

				done();
			}});
		});

		it('should end pause', (done : any) => {
			// HACK: At some point all available shifts are stamped. So, we cannot do this test anymore.
			// For the moment, this test will be ignored then.
			if (plannedWork && api.data.shifts.length === 0) {
				api.console.warn('--------------- WARNING: No shifts available to stamp. Skipping test…');
				done();
				return;
			}

			//
			// Do test
			//

			// Note that backend removes seconds. So, we set whole minutes
			const regularPauseDuration = 2 * 60 * 1000;

			api.data.uncompletedRegularPauseStart = null;
			api.data.completedRegularPausesDuration = regularPauseDuration;

			// save
			api.save({ success : () => {
				expect(api.data.uncompletedRegularPauseStart).toBe(null);
				expect(api.data.completedRegularPausesDuration).toBe(regularPauseDuration);

				done();
			}});
		});

		it('should modify comment', (done : any) => {
			// HACK: At some point all available shifts are stamped. So, we cannot do this test anymore.
			// For the moment, this test will be ignored then.
			if (plannedWork && api.data.shifts.length === 0) {
				api.console.warn('--------------- WARNING: No shifts available to stamp. Skipping test…');
				done();
				return;
			}

			//
			// Do test
			//
			const newComment = testingUtils.getRandomString(20);
			api.data.comment = newComment;

			// save
			api.save({ success : () => {
				expect(api.data.comment).toBe(newComment);

				done();
			}});
		});

		it('should end time-stamp', (done : any) => {
			// HACK: At some point all available shifts are stamped. So, we cannot do this test anymore.
			// For the moment, this test will be ignored then.
			if (plannedWork && api.data.shifts.length === 0) {
				api.console.warn('--------------- WARNING: No shifts available to stamp. Skipping test…');
				done();
				return;
			}

			//
			// Do test
			//

			// end time-stamp 7 hours after start to test automatic pause value
			assumeDefinedToGetStrictNullChecksRunning(api.data.start, 'api.data.start');
			const end = api.data.start + (7 * 60 * 60 * 1000);
			api.data.end = end;

			// save
			api.save({ success : () => {
				expect(api.data.end).toBe(end);

				// sum of regular/automatic pause should be 30 minutes
				expect(api.data.completedRegularPausesDuration + api.data.automaticPauseDuration).toBe(30 * 60 * 1000);

				done();
			}});
		});
	};

	describe('planned work', () => {
		doTests(true);
	});

	describe('unplanned work', () => {
		doTests(false);
	});

	describe('allowed-time-stamp-devices', () => {
		apiTestingUtils.doDefaultListTests({
			searchParams: undefined!,
			getApi : () => api,
			getList : () => {
				return api.data.allowedTimeStampDevices;
			},
			changeItem : (allowedTimeStampDevice : TimeStampApiAllowedTimeStampDeviceBase) => {
				allowedTimeStampDevice.name = testingUtils.getRandomString(20);

				if (allowedTimeStampDevice.isNewItem()) {
					allowedTimeStampDevice.visitorId = testingUtils.getRandomString(20);
					allowedTimeStampDevice.browserName = testingUtils.getRandomString(20);
				}
			},
		});
	});
});
