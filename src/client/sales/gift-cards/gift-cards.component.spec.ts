import { SchedulingApiService } from '@plano/shared/api';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { LoginRole } from '@plano/shared/testing/testing-utils';
import { GiftCardsComponent } from './gift-cards.component';
import { SalesModule } from '../sales.module';

describe('GiftCardsComponent #needsapi', () => {
	let component : GiftCardsComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [SalesModule] });

	beforeAll((done) => {
		testingUtils.login({
			role: LoginRole.CLIENT_DEFAULT,
			success: () => {
				testingUtils.unloadAndLoadApi(SchedulingApiService, () => {
					component = testingUtils.createComponent(GiftCardsComponent);
					done();
				}, testingUtils.getApiQueryParams('vouchers'));
			},
		});
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
