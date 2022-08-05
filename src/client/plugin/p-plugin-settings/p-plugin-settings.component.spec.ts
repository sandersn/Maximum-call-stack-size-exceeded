import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { PPluginSettingsComponent } from './p-plugin-settings.component';
import { PluginModule } from '../plugin.module';

describe('PPluginSettingsComponent', () => {
	let component : PPluginSettingsComponent;
	const testingUtils = new TestingUtils();

	testingUtils.init({ imports : [PluginModule] });

	beforeAll(() => {
		component = testingUtils.createComponent(PPluginSettingsComponent);
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
