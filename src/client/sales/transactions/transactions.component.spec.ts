import { SchedulingApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { LoginRole } from '@plano/shared/testing/testing-utils';
import { TransactionsComponent } from './transactions.component';
import { SalesModule } from '../sales.module';

describe('TransactionsComponent #needsapi', () => {
	let component : TransactionsComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [SalesModule] });

	beforeAll((done) => {
		testingUtils.login({
			role: LoginRole.CLIENT_DEFAULT,
			success: () => {
				testingUtils.unloadAndLoadApi(SchedulingApiService, () => {
					component = testingUtils.createComponent(TransactionsComponent);
					done();
				}, testingUtils.getApiQueryParams('transactions'));
			},
		});
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
