import { SchedulingApiService, ClientsApiService, TestDataApiCountry, TestDataApiService } from '@plano/shared/api';
import { LoginRole, TestingUtils } from '@plano/shared/testing/testing-utils';
import { Config } from '../../../core/config';

describe('#SchedulingApiService #needsapi', () => {

	let api : SchedulingApiService;
	const testingUtils = new TestingUtils();

	describe('#image-upload', () => {
		let clientsApi : ClientsApiService;
		let testDataApi : TestDataApiService;
		let clientId : number;

		const base64DataPng = 'data:image/png;base64,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';
		const base64DataJpeg = 'data:image/jpeg;base64,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';

		beforeAll((done : any) => {
			testingUtils.login(
				{
					success: () => done(),
					role: LoginRole.ADMIN,
				});
		});

		/**
		 * We create extra client and delete it at the end to test image-upload to test the automatic image
		 * removal when entities get deleted.
		 */
		it('create-client', async () => {
			// generate test client
			expect().nothing();
			testDataApi = testingUtils.getService(TestDataApiService);

			testDataApi.setEmptyData();
			testDataApi.data.countries.push(TestDataApiCountry.GERMANY);

			await testDataApi.save();
			clientId = testDataApi.data.createdClientIds.get(0)!.rawData;

			await testingUtils.login({email : testDataApi.data.createdClientOwnerEmails.get(0)});
			api = await testingUtils.unloadAndLoadApi(SchedulingApiService);
		});

		it('add-image', (done : any) => {
			const newImageUrl = `${Config.API_IMAGE_BASE_URL  }company_logo.${clientId}.jpg`;
			api.data.companyLogo = base64DataJpeg;

			api.save({
				success: () => {
					expect(api.data.companyLogo).toBe(newImageUrl);

					// check file exists on S3
					testingUtils.checkFileExists(newImageUrl, (oldFileExists : boolean) => {
						expect(oldFileExists).toBeTrue();
						done();
					});
				},
			});
		});

		it('change-image', (done : any) => {
			const oldImageUrl = api.data.companyLogo;
			const newImageUrl = `${Config.API_IMAGE_BASE_URL  }company_logo.${clientId}.png`;
			api.data.companyLogo = base64DataPng;

			api.save({
				success: () => {
					expect(api.data.companyLogo).toBe(newImageUrl);

					// check new file exists on S3
					testingUtils.checkFileExists(newImageUrl, (newFileExists : boolean) => {
						expect(newFileExists).toBeTrue();

						// check old file does NOT exist on S3
						testingUtils.checkFileExists(oldImageUrl, (exists : boolean) => {
							expect(exists).toBeFalse();
							done();
						});
					});
				},
			});
		});

		it('remove-image', (done : any) => {
			const oldImageUrl = api.data.companyLogo;
			api.data.companyLogo = null;

			api.save({
				success: () => {
					expect(api.data.companyLogo).toBe(null);

					// check old file does NOT exist on S3
					testingUtils.checkFileExists(oldImageUrl, (exists : boolean) => {
						expect(exists).toBeFalse();
						done();
					});
				},
			});
		});

		it('test-automatic-removal-on-client-delete', (done : any) => {
			// add image again to test automatic removal
			api.data.companyLogo = base64DataJpeg;
			const newImageUrl = `${Config.API_IMAGE_BASE_URL  }company_logo.${clientId}.jpg`;

			api.save({
				success: () => {
					// remove client
					testingUtils.login(
						{
							role: LoginRole.ADMIN,
							success: () => {
								clientsApi = testingUtils.getService(ClientsApiService);
								clientsApi.load(
									{
										success: () => {
											// remove all created clients
											for (const createdClientId of testDataApi.data.createdClientIds.iterable()) {
												clientsApi.data.removeItem(createdClientId);
											}

											clientsApi.save({
												success: () => {
													// check added file does NOT exist on S3
													testingUtils.checkFileExists(newImageUrl, (exists : boolean) => {
														expect(exists).toBeFalse();
														done();
													});
												},
												error: fail });
										},
									});
							},
						});
				},
			});
		});
	});
});
