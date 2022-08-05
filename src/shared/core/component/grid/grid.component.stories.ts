import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';

const myStory = storiesOf('Core/fa-icon', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-grid>
				Hello
			</p-grid>
		`,
	}));
