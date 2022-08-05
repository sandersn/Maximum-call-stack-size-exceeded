import { moduleMetadata, storiesOf } from '@storybook/angular';
import { PWishesService } from '@plano/client/scheduling/wishes.service';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PFormControl } from '../p-form-control';
import { PFormsModule } from '../p-forms.module';

const myStory = storiesOf('Client/PForms/input-member', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PFormsModule,
			],
			providers: [
				PWishesService,
			],
		}),
	)
	.add('default', () => ({
		template: `
		<div class="d-flex flex-column justify-content-center">
			<p-input-member
				[(control)]="formControl"
			></p-input-member>
			<br>
			<p-input-member
				[(control)]="formControl"
			></p-input-member>
		</div>
		`,
		props: {
			formControl: new PFormControl({
				formState: {
					value: '',
					disabled: false,
				},
			}),
			searchTerm: 'Nils',
		},
	}));
