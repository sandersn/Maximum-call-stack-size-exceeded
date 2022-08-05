import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PFormsModule } from '../p-forms.module';

const myStory = storiesOf('Client/PForms/p-recover-button', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PFormsModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-recover-button
				(onModalSuccess)="onModalSuccess($event)"
				(onModalDismiss)="onModalDismiss($event)"
			></p-recover-button>
		`,
		props: {
			onModalSuccess : action('onModalSuccess'),
			onModalDismiss : action('onModalDismiss'),
		},
	}));
