import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { SchedulingApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { LoginRole } from '@plano/shared/testing/testing-utils';
import { TransactionComponent } from './transaction.component';

describe('TransactionComponent #needsapi', () => {
	let component : TransactionComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [SchedulingModule] });

	beforeAll((done) => {
		testingUtils.login({
			role: LoginRole.CLIENT_DEFAULT,
			success: () => {
				testingUtils.unloadAndLoadApi(SchedulingApiService, () => {
					component = testingUtils.createComponent(TransactionComponent);
					done();
				}, testingUtils.getApiQueryParams('vouchers'));
			},
		});
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
