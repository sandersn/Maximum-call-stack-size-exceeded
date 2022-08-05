import { moduleMetadata, storiesOf } from '@storybook/angular';
import { ToastsService } from '@plano/client/service/toasts.service';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { TimeStampModule } from '../time-stamp.module';

const myStory = storiesOf('Client/TimeStamp/stopwatch', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				TimeStampModule,
			],
			providers: [
				ToastsService,
				// AngularFireMessaging,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-stopwatch
			></p-stopwatch>
		`,
		props: {
			// title: '',
			// isLoading: false,
		},
	}));
