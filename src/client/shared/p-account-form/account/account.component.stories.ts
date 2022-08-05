import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PFormGroup } from '../../p-forms/p-form-control';
import { PAccountFormModule } from '../p-account-form.module';

const myStory = storiesOf('Client/PAccountFormModule/account', module);
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
			<account
				[group]="formGroup"
				[turnIntoRealAccountForm]="true"
			></account>
		`,
		props: {
			formGroup: new PFormGroup({}),
		},
	}));
