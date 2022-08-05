import { SchedulingApiService} from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';

describe('#SchedulingApiService #needsapi', () => {
	let api : SchedulingApiService;
	const testingUtils = new TestingUtils();


	beforeAll(async () => {
		await testingUtils.login();
		api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, testingUtils.getApiQueryParams('bookingSystemSettings'));
	});

	it('modify-reCaptchaWhiteListedHostNames', async () => {
		// clear list
		api.data.reCaptchaWhiteListedHostNames.clear();
		await api.save();

		expect(api.data.reCaptchaWhiteListedHostNames.length).toBe(0);

		// Add host-name with "https://www." and port. We expect backend to normalize it.
		api.data.reCaptchaWhiteListedHostNames.push('https://www.youtube.com:9000/');
		await api.save();

		expect(api.data.reCaptchaWhiteListedHostNames.length).toBe(1);
		expect(api.data.reCaptchaWhiteListedHostNames.last).toBe('youtube.com');

		// Add host-name with some other sub-domain
		api.data.reCaptchaWhiteListedHostNames.push('https://subdomain.youtube.com/');
		await api.save();

		expect(api.data.reCaptchaWhiteListedHostNames.length).toBe(2);
		expect(api.data.reCaptchaWhiteListedHostNames.last).toBe('subdomain.youtube.com');

		// duplicates should be removed
		api.data.reCaptchaWhiteListedHostNames.push('https://www.youtube.com/some-path');
		await api.save();

		expect(api.data.reCaptchaWhiteListedHostNames.length).toBe(2);

		// remove a host-name
		api.data.reCaptchaWhiteListedHostNames.removeItem('youtube.com');
		await api.save();

		expect(api.data.reCaptchaWhiteListedHostNames.length).toBe(1);
		expect(api.data.reCaptchaWhiteListedHostNames.contains('youtube.com')).toBeFalse();
	});
});
