import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { TextToHtmlService } from '@plano/client/scheduling/shared/text-to-html.service';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { STORYBOOK_STRINGIFY_FN } from '@plano/storybook/storybook.utils';
import { PFormsModule } from '../../p-forms.module';

const myStory = storiesOf('Client/PForms/p-input-image-cropper', module);

myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PFormsModule,
			],
			providers: [
				TextToHtmlService,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-input-image-cropper
				(croppedImageChange)="croppedImageChange($event)"
			></p-input-image-cropper>
		`,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			croppedImageChange: action('croppedImageChange'),
		},
	}));
