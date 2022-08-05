import { storiesOf, moduleMetadata } from '@storybook/angular';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { STORYBOOK_STRINGIFY_FN } from '@plano/storybook/storybook.utils';
import { PFormControl } from '../p-form-control';
import { PFormsModule } from '../p-forms.module';

const myStory = storiesOf('Client/PForms/p-password-strength-meter', module);
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
		<p-input
			type="Password"
			[formControl]="formControl"
			[disabled]="false"
			[placeholder]="placeholder"
			size="'lg'"
			[readMode]="false"
			[showPasswordMeter]="true"
		></p-input>
		<br>
		<code>{{ formControl.value }}</code>
		<hr>
		<br> PW: 1234
		<p-password-strength-meter
			[passwordToCheck]="'1234'"
		></p-password-strength-meter>
		<br> PW: 123QWERTY
		<p-password-strength-meter
			passwordToCheck="123QWERTY"
		></p-password-strength-meter>
		<br> PW: 12!@qwQW
		<p-password-strength-meter
			passwordToCheck="12!@qwQW"
		></p-password-strength-meter>
		<br> PW: 12!@q  wQW <-- Input validation failed
		<p-password-strength-meter
			passwordToCheck="12!@qwQW"
			[inputValidationFailed]="true"
		></p-password-strength-meter>
        `,
		props: {
			stringify: STORYBOOK_STRINGIFY_FN,
			formControl: new PFormControl({
				formState: {
					value: undefined,
					disabled: false,
				},
			}),
			inputValidationFailedMock: false,
			type: PApiPrimitiveTypes.string,
			placeholder: undefined as unknown as string,
		},
	}));



