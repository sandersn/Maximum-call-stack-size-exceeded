import { storiesOf, moduleMetadata } from '@storybook/angular';
import { EventTypesService } from '@plano/client/plugin/p-custom-course-emails/event-types.service';
import { ToastsService } from '@plano/client/service/toasts.service';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { EmailModule } from '../../email.module';

const myStory = storiesOf('Client/EmailModule/p-custom-course-email-placeholders', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				EmailModule,
			],
			providers: [
				EventTypesService,
				ToastsService,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-custom-course-email-placeholders></p-custom-course-email-placeholders>
		`,
		props: {
		},
	}));
