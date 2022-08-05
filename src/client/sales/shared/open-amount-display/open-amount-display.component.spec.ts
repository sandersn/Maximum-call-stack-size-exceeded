import { OpenAmountDisplayComponent } from './open-amount-display.component';
import { TestingUtils } from '../../../../shared/testing/testing-utils';
import { SalesSharedModule } from '../sales-shared.module';

describe('OpenAmountDisplayComponent', () => {
	let component : OpenAmountDisplayComponent;

	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [SalesSharedModule] });

	beforeAll(done => {
		component = testingUtils.createComponent(OpenAmountDisplayComponent);
		done();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
