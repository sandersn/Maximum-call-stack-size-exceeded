import { storiesOf, moduleMetadata } from '@storybook/angular';
import { EmailModule } from '@plano/client/email/email.module';
import { ToastsService } from '@plano/client/service/toasts.service';
import { StorybookModule } from '@plano/storybook/storybook.module';

const myStory = storiesOf('Client/EmailModule/p-placeholder-input', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				EmailModule,
			],
			providers: [
				ToastsService,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-placeholder-input
				placeholder="#FOO_BAR#"
				description="Dickes <strong>Foo</strong>, dünnes bar."
			></p-placeholder-input>
		`,
		props: {
			title: '',
			isLoading: false,
		},
	}));
