import { storiesOf, moduleMetadata } from '@storybook/angular';
import { MeService } from '@plano/shared/api';
import { FakeMeService } from '@plano/shared/core/me/me.service.mock';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { ClientModule } from '../client.module';

const myStory = storiesOf('Client/p-header', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				ClientModule,
			],
			providers: [
				{
					provide: MeService,
					useClass: FakeMeService,
				},
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-header></p-header>
		`,
		props: {
		},
	}));
