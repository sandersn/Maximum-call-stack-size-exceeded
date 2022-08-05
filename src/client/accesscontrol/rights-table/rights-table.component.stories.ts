import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { AccesscontrolModule } from '../accesscontrol.module';

const myStory = storiesOf('Client/AccesscontrolModule/p-rights-table', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				AccesscontrolModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-rights-table></p-rights-table>
		`,
	}));
