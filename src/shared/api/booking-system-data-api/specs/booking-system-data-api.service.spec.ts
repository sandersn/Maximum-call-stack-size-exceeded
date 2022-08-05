import { ReCaptchaV3Service } from 'ng-recaptcha';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiService, BookingSystemDataApiService, ApiBase } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { assumeNonNull } from '../../../core/null-type-utils';
import { PSupportedLocaleIds } from '../../base/generated-types.ag';

describe('BookingSystemDataApiService #needsapi', () => {
	let schedulingApi : SchedulingApiService;
	const testingUtils = new TestingUtils();
	const pMoment = new PMomentService(PSupportedLocaleIds.de_DE);
	let recaptchaV3Service : ReCaptchaV3Service;

	beforeAll(async () => {
		await testingUtils.login();
		recaptchaV3Service = testingUtils.getService(ReCaptchaV3Service);

		// load scheduling-api
		const start = pMoment.m().subtract(1, 'week').startOf('day').valueOf().toString();
		const end = pMoment.m().add(1, 'week').startOf('day').valueOf().toString();

		const queryParams = new HttpParams()
			.set('data', 'bookings')
			.set('start', start)
			.set('end', end)
			.set('bookingsStart', start)
			.set('bookingsEnd', end)
			.set('bookingsByShiftTime', 'true');

		schedulingApi = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, queryParams);
	});

	describe('load', () => {
		it('by-kletterszeneId', async () => {
			const kletterszeneId = '123';

			schedulingApi.data.kletterszeneId = kletterszeneId;
			await schedulingApi.save();

			const api = await testingUtils.unloadAndLoadApi(BookingSystemDataApiService, null, new HttpParams().set('kletterszeneId', kletterszeneId));
			expect(api.data.locationName).toBeDefined();
		});

		it('by-tempBookableDataId', async () => {
			// create a new temp-bookable-data object
			const postData = {
				bookable: {
					clientId: schedulingApi.data.id.rawData,
					firstName: testingUtils.getRandomString(10),
					lastName: testingUtils.getRandomString(10),
					type: 'voucher',
					email: testingUtils.getRandomEmail(),
					value: 30,
				},
			};

			const httpClient = testingUtils.getService(HttpClient);
			const token = await recaptchaV3Service.execute('BOOKABLE').toPromise();
			const response = await httpClient.post<any>(
				`${Config.BACKEND_URL}/temp_bookable_data?token=${token}`,
				postData, ApiBase.getRequestOptions(null, null),
			).toPromise() ?? null;
			assumeNonNull(response);
			const tempBookableDataId = response.body.tempBookableDataId;

			// request booking-system-data for the temp-bookable-data
			const api = await testingUtils.unloadAndLoadApi(BookingSystemDataApiService, null, new HttpParams().set('tempBookableDataId', tempBookableDataId));
			expect(api.data.locationName).toBeDefined();
		});
	});

});
