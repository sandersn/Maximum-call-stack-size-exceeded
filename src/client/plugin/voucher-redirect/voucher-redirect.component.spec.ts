import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { VoucherRedirectComponent } from './voucher-redirect.component';

describe('VoucherRedirectComponent #needsapi', () => {
	let component : VoucherRedirectComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [SchedulingModule] });

	beforeAll((done) => {
		component = testingUtils.createComponent(VoucherRedirectComponent);
		done();
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});

});
