import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { MeService } from '@plano/shared/api';
import { FakeMeService } from '@plano/shared/core/me/me.service.mock';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { MenuModule } from '../menu.module';

const myStory = storiesOf('Client/MenuModule/p-settings-menu-for-mobile', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				MenuModule,
			],
			providers: [
				{ provide: MeService, useClass: FakeMeService },
			],
		}),
	)
	.add('default', () => ({
		template: `
			<div style="max-width:380px;margin:0 auto;" class="rounded border shadow-lg">
				<p-settings-menu-for-mobile
					(clickedAnyButton)="clickedAnyButton()"
				></p-settings-menu-for-mobile>
			</div>
		`,
		props: {
			// title: '',
			// isLoading: false,
			clickedAnyButton: action('clickedAnyButton'),
		},
	}));
