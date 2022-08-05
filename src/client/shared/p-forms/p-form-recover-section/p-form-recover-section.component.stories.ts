import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { PFormsModule } from '@plano/client/shared/p-forms/p-forms.module';
import { Config } from '@plano/shared/core/config';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { FakeConfig } from '../p-input-date/p-input-date.component.stories';

const myStory = storiesOf('Client/PForms/p-form-recover-section', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PFormsModule,
			],
			providers: [
				{ provide: Config, useClass: FakeConfig },
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-form-recover-section
				(onRecover)="onRecover($event)"
			>
			<p description>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
			<div modal-content>Some additional Modal Content</div>
			</p-form-recover-section>
		`,
		props: {
			onRecover : action('onRecover'),
		},
	}));
