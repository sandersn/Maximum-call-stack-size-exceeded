import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PageNotFoundModule } from './page-not-found.module';

const myStory = storiesOf('PageNotFoundModule/page-not-found', module);
myStory

	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PageNotFoundModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-page-not-found></p-page-not-found>
		`,
		props: {
		},
	}));
