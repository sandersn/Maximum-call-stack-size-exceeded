import { storiesOf, moduleMetadata } from '@storybook/angular';
import { TextToHtmlService } from '@plano/client/scheduling/shared/text-to-html.service';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PFormControl } from '../p-form-control';
import { PFormsModule } from '../p-forms.module';

const myStory = storiesOf('Client/PForms/p-textarea', module);

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
			<p-textarea
				[formControl]="formControl"
				[placeholder]="placeholder"
				[disabled]="false"
			></p-textarea>
			<br>
			<p-textarea
				[ngModel]="formControl.value"
				[placeholder]="placeholder"
				[disabled]="true"
			></p-textarea>
		`,
		props: {
			formControl: new PFormControl({
				formState: {
					value: '',
					disabled: false,
				},
			}),
			placeholder: '',
		},
	}))
	.add('wysiwyg', () => ({
		template: `
			<p-textarea
				[formControl]="ormControl"
				[wysiwyg]="true"
				[placeholder]="placeholder"
				[disabled]="false"
			></p-textarea>
			<br>
			<p-textarea
				[ngModel]="formControl.value"
				[wysiwyg]="true"
				[placeholder]="placeholder"
				[disabled]="true"
			></p-textarea>
		`,
		props: {
			formControl: new PFormControl({
				formState: {
					value: '',
					disabled: false,
				},
			}),
			placeholder: '',
		},
	}));
