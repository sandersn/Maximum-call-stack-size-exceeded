import { storiesOf, moduleMetadata } from '@storybook/angular';
import { ToastsService } from '@plano/client/service/toasts.service';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PFormsModule } from '../p-forms.module';

const myStory = storiesOf('Client/PForms/p-input-copy-string', module);
myStory

	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PFormsModule,
			],
			providers: [
				ToastsService,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-input-copy-string
				valueToCopy="FooBar"
			></p-input-copy-string>
		`,
		props: {
			title: '',
			isLoading: false,
		},
	}));
