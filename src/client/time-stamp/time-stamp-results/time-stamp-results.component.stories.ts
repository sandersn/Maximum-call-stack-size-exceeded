import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { TimeStampModule } from '../time-stamp.module';

const myStory = storiesOf('Client/TimeStamp/p-time-stamp-results', module);
myStory

	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				TimeStampModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-time-stamp-results
			></p-time-stamp-results>
		`,
		props: {
			// title: '',
			// isLoading: false,
		},
	}));
