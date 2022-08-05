import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PluginModule } from '../../plugin.module';

const myStory = storiesOf('Client/PluginModule/p-interface-card', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PluginModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
		<p-interface-card
			headline="Hallo Welt"
			subtitle="Hallo Universum"
			description="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
		></p-interface-card>
		`,
	}));
