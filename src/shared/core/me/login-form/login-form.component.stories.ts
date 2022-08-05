import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';

const myStory = storiesOf('Core/login-form', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<div class="bg-dark p-3">
				<p-login-form [defaultPathAfterLogin]="/"></p-login-form>
			</div>
		`,
		props: {
		},
	}));
