import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { CancellationPolicyComponent } from './cancellation-policy.component';
import { ClientSharedComponentsModule } from '../../client-shared-components.module';

describe('CancellationPolicyComponent', () => {
	let component : CancellationPolicyComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports: [ClientSharedComponentsModule] });

	beforeEach((done) => {
		component = testingUtils.createComponent(CancellationPolicyComponent);
		done();
	});

	it('should have a defined component', () => {
		expect(component).toBeDefined();
	});
});
