import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PFormControl } from '../p-form-control';
import { PFormsModule } from '../p-forms.module';

const myStory = storiesOf('Client/PForms/checkbox', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PFormsModule,
			],
			providers: [
			],
		}),
	)
	.add('default', () => ({
		template: `
		<div class="d-flex justify-content-center">
			<checkbox
				class="m-3"
				[formControl]="formControl"
				[card]="card"
				[btn]="btn"
			>{{text}} Foo</checkbox>
			<br>
			<checkbox
				class="m-3"
				[formControl]="ormControl"
				[card]="card"
				[btn]="btn"
			>{{text}} Bar</checkbox>
		</div>
		`,
		props: {
			formControl: new PFormControl({
				formState: {
					value: '',
					disabled: false,
				},
			}),
			checked: true,
			btn: true,
			card: false,
		},
	}));
