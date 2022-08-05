import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { VoucherSettingsComponent } from './voucher-settings.component';
import { PluginModule } from '../plugin.module';

describe('VoucherSettingsComponent', () => {
	let component : VoucherSettingsComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [PluginModule] });

	beforeAll(() => {
		component = testingUtils.createComponent(VoucherSettingsComponent);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
