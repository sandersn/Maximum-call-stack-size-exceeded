import { storiesOf, moduleMetadata } from '@storybook/angular';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PFormControl } from '../p-form-control';
import { PFormsModule } from '../p-forms.module';

// ...getArgsForPComponentInterface(new PButtonComponent(undefined)),

const myStory = storiesOf('Client/PForms/p-form-group', module);
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
			<p-form-group
				label="Label set in template"
				description="Some description here."
				[hasDanger]="true"
			>
				<p-input [formControl]="control"></p-input>
			</p-form-group>
			<p-form-group [control]="control1">
				<p-input [formControl]="control1"></p-input>
			</p-form-group>
			<p-form-group [control]="control2">
				<p-input [formControl]="control2"></p-input>
			</p-form-group>
			<p-form-group [control]="control3">
				<p-input [formControl]="control3"></p-input>
			</p-form-group>
		`,
		props: {
			control1: new PFormControl({
				labelText: 'Label set in PFormControl - always invalid',
				isReadMode: false,
				description: 'Description set in PFormControl',
				formState: {value: 'This should be disabled', disabled: true},
				validatorOrOpts: [ new ValidatorsService().required(PApiPrimitiveTypes.string) ],
			}),
			control2: new PFormControl({
				labelText: 'Label set in PFormControl',
				isReadMode: true,
				description: 'Description set in PFormControl',
				formState: {value: 'This should be readmode', disabled: true},
				validatorOrOpts: [ new ValidatorsService().required(PApiPrimitiveTypes.string) ],
			}),
			control3: new PFormControl({
				labelText: 'Label set in PFormControl',
				isReadMode: false,
				description: 'Description with <strong>some HTML</strong> and <a href=\'#\'>a link</a> set in PFormControl',
				formState: {value: undefined, disabled: false},
				validatorOrOpts: [ new ValidatorsService().required(PApiPrimitiveTypes.string) ],
			}),
		},
	}));
