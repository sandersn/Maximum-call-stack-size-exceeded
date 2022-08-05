import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { TextToHtmlService } from '@plano/client/scheduling/shared/text-to-html.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiMemo } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { MeService } from '@plano/shared/core/me/me.service';
import { FakeMeService } from '@plano/shared/core/me/me.service.mock';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { CommentComponent } from './comment.component';
import { PSidebarModule } from '../../p-sidebar.module';

const myStory = storiesOf('Client/ClientSharedComponents/p-sidebar/day-comment/comment', module);
myStory.addParameters({ component: CommentComponent });
myStory

	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PSidebarModule,
			],
			providers: [
				TextToHtmlService,
				{ provide: MeService, useClass: FakeMeService },
			],
			declarations: [
			],
		}),
	);

const MEMO = new SchedulingApiMemo(null, 123);
const START = +(new PMomentService(Config.LOCALE_ID)).m().startOf('day');
MEMO.start = +START;
MEMO.message = 'Hallo Welt';
myStory
	.add('default', () => ({
		template: `
			<p-comment class="mb-3" [userCanEditMemos]="false"></p-comment>
			<p-comment
				[memo]="memo"
				(onSave)="onSave()"
				(onOpenModal)="onOpenModal()"
				(onModalSuccess)="onModalSuccess()"
				(onModalDismiss)="onModalDismiss()"
				[userCanEditMemos]="true"
			></p-comment>
		`,
		props: {
			memo: MEMO,
			onSave: action('onSave'),
			onOpenModal: action('onOpenModal'),
			onModalSuccess: action('onModalSuccess'),
			onModalDismiss: action('onModalDismiss'),
		},
	}))
;
