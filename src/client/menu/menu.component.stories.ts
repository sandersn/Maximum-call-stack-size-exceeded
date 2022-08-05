import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { MenuModule } from './menu.module';
import { TimeStampApiService } from '../time-stamp/time-stamp-api.service';

const myStory = storiesOf('Client/MenuModule/p-menu', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				MenuModule,
			],
			providers: [
				TimeStampApiService,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-menu
				style="height:590px;max-width:380px;margin: 0 auto;"
			></p-menu>
		`,
		props: {
			// title: '',
			// isLoading: false,
		},
	}));
