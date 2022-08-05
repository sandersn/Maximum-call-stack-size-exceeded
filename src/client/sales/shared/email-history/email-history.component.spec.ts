import { EmailHistoryComponent } from './email-history.component';
import { TestingUtils } from '../../../../shared/testing/testing-utils';
import { SalesSharedModule } from '../sales-shared.module';

describe('CancellationAmountAlertComponent', () => {
	let component : EmailHistoryComponent;

	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [SalesSharedModule] });

	beforeAll(done => {
		component = testingUtils.createComponent(EmailHistoryComponent);
		done();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
