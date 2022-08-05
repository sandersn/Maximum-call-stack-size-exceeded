import { CancellationAmountAlertComponent } from './cancellation-amount-alert.component';
import { TestingUtils } from '../../../../shared/testing/testing-utils';
import { SalesSharedModule } from '../sales-shared.module';

describe('CancellationAmountAlertComponent', () => {
	let component : CancellationAmountAlertComponent;

	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [SalesSharedModule] });

	beforeAll(done => {
		component = testingUtils.createComponent(CancellationAmountAlertComponent);
		done();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
