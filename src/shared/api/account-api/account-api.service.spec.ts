import { AccountApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';


describe('AccountApiService #needsapi', () => {
	let api : AccountApiService;
	const testingUtils = new TestingUtils();

	testingUtils.init({
		imports: [],
		providers: [AccountApiService],
	});

	beforeAll(async () => {
		await testingUtils.login();
		api = await testingUtils.unloadAndLoadApi(AccountApiService);
	});

	describe('.discountCode', () => {
		it('should be empty', () => {
			expect(!!api.data.discountCode).toBeFalsy();
		});

		it('should be filled', () => {
			api.data.discountCode = 'FOOBAR';
			expect(api.data.discountCode).toBe('FOOBAR');
		});

	});

});
