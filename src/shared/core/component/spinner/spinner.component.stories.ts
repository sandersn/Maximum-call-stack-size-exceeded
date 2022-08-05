import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';

const myStory = storiesOf('Core/p-spinner', module);
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
			<p-spinner
				[size]="size"
			></p-spinner>
		`,
		props: {
			size: 'md',
		},
	}));
