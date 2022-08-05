import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PageModule } from '../page.module';

const myStory = storiesOf('Client/PForms/p-form-section', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PageModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-section label="Section one">
				<p-form-group label="First Name">
					<p-input [ngModel]="'Nils'"></p-input>
				</p-form-group>
				<p-form-group label="Last Name">
					<p-input [ngModel]="'Karlsson'"></p-input>
				</p-form-group>
			</p-section>
			<p-section
				label="Section two"
				description="Lorem Ipsum"
			>
				<p-form-group
					label="Company"
					[hasDanger]="hasDanger"
				>
					<p-input [ngModel]="'Plano AG'"></p-input>
				</p-form-group>
			</p-section>
		`,
		props: {
			// title: '',
			// isLoading: false,
		},
	}));
