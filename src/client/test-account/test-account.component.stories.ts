import { storiesOf, moduleMetadata } from '@storybook/angular';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { TestAccountModule } from './test-account.module';

const myStory = storiesOf('Client/PTestAccount/img', module);
myStory

	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				TestAccountModule,
			],
		}),
	);

myStory
	.add('to swallow', () => ({
		template: `
			<img alt="Party! Party!" i18n-alt width="100%" [src]="'images/party-party.png' | pLocalizeFile:'${PSupportedLocaleIds.en_GB}'">
			<div class="modal-footer">
				<button type="button" class="btn btn-primary btn-lg ml-auto" (click)="onYeah();c('Close click')" i18n>Yeah!</button>
			</div>
		`,
	}));

myStory
	.add('testaccount', () => ({
		template: `
			<p-todo>Story not implemented yet</p-todo>
			<p-testaccount>
			</p-testaccount>
		`,
	}));
