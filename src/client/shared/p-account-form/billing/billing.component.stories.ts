import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PFormGroup } from '../../p-forms/p-form-control';
import { PAccountFormModule } from '../p-account-form.module';

const myStory = storiesOf('Client/PAccountFormModule/billing', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PAccountFormModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-billing
				[group]="formGroup"
				[turnIntoRealAccountForm]="true"
			></p-billing>
		`,
		props: {
			formGroup: new PFormGroup({}),
		},
	}));
