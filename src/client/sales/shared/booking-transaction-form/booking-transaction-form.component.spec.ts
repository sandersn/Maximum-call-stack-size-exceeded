import { BookingTransactionFormComponent } from './booking-transaction-form.component';
import { TestingUtils } from '../../../../shared/testing/testing-utils';
import { SalesSharedModule } from '../sales-shared.module';

describe('BookingTransactionFormComponent', () => {
	let component : BookingTransactionFormComponent;

	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [SalesSharedModule] });

	beforeAll(done => {
		component = testingUtils.createComponent(BookingTransactionFormComponent);
		done();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
