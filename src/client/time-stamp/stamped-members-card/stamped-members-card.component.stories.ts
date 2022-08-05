import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { TimeStampModule } from '../time-stamp.module';

const myStory = storiesOf('Client/TimeStamp/stamped-members-card', module);
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
			<p-stamped-members-card
			></p-stamped-members-card>
		`,
		props: {
			// title: '',
			// isLoading: false,
		},
	}));
