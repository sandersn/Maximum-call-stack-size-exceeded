import * as $ from 'jquery';
import { HttpParams } from '@angular/common/http';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { MeService } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '@plano/shared/core/config';
import { TestingUtils } from '@plano/shared/testing/testing-utils';

describe('IcalApiService #needsapi', () => {
	const testingUtils = new TestingUtils();
	const pMoment = new PMomentService(PSupportedLocaleIds.de_DE);

	testingUtils.init(
		{
			imports: [],
		});

	describe('ical-api', () => {
		it('is-loaded-successfully', async () => {
			const me = testingUtils.getService(MeService);

			await testingUtils.login();

			const getApiQueryParams = (dataType : string) : HttpParams => {
				// start/end
				// Hack: data.shifts currently returns shifts of the whole day. workingTimes/absences not.
				// So, to be consistent, start/end should be start/end of day
				const start = pMoment.m().startOf('day').valueOf().toString();
				const end = pMoment.m().add(1, 'week').startOf('day').valueOf().toString();

				// eslint-disable-next-line sonarjs/prefer-immediate-return
				const queryParams = new HttpParams()
					.set('data', dataType)
					.set('start', start)
					.set('end', end)
					.set('bookingsStart', start)
					.set('bookingsEnd', end);

				return queryParams;
			};

			const schedulingApi = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, getApiQueryParams('calendar'));

			// create list of additional shift-models
			let additionalShiftModels = '';

			for (let i = 0; i < 3; ++i) {
				if (i !== 0)
					additionalShiftModels += ',';

				additionalShiftModels += schedulingApi.data.shiftModels.get(i)!.id.rawData;
			}

			// load ical api. We cannot use our own api class because
			// currently it assumed that returned content is json format.
			const url = `${Config.BACKEND_URL}` +
					`/ical?id=${me.data.id.rawData}` +
					`&s=${me.data.secureToken}`	+
					`&additionalShiftModels=${additionalShiftModels}`;

			expect().nothing();
			await $.ajax({
				url: url,
				method: 'GET',
			});
		});
	});
});
