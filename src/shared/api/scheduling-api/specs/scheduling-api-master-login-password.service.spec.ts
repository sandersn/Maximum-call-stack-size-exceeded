import { HttpErrorResponse } from '@angular/common/http';
import { LoginRole, TestingUtils } from '@plano/shared/testing/testing-utils';
import { SchedulingApiService } from '../../../../client/scheduling/shared/api/scheduling-api.service';

describe('#SchedulingApiService #needsapi', () => {
	const testingUtils = new TestingUtils();

	describe('master-login-password', () => {
		const defaultTests = (desc : string, password : string) : void => {
			describe(desc, () => {
				it('can-read-member-user', async () => {
					await testingUtils.login({
						role: LoginRole.CLIENT_OWNER,
						password: password,
					});

					expect().nothing();
				});

				it('cannot-read-admin-user', async () => {
					await testingUtils.login({
						role: LoginRole.SUPER_ADMIN,
						password: password,
						success: () => {
							fail();
						},
						error: (response) => {
							expect(response instanceof HttpErrorResponse && response.status === 401).toBeTrue();
						},
					});
				});
			});
		};

		defaultTests('read-only', '1234567');
		defaultTests('with-write-access', '12345678');

		it('read-only throws-error-on-write-operation', async () => {
			await testingUtils.login({
				role: LoginRole.CLIENT_OWNER,
				password: '1234567',
			});

			// perform write should return 461 http code
			const api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, testingUtils.getApiQueryParams('bookingSystemSettings'));

			const prevListLength = api.data.reCaptchaWhiteListedHostNames.length;
			api.data.reCaptchaWhiteListedHostNames.push('asd');

			await api.save({
				success: () => fail(),
				error: (response) => {
					expect(response.status).toBe(461);
				},
			});

			// check that data have not changed
			await api.reload();
			expect(api.data.reCaptchaWhiteListedHostNames.length).toBe(prevListLength);
		});

	});
});
