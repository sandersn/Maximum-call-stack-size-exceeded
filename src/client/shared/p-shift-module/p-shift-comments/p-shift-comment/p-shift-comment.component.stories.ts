import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { FakeSchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service.mock';
import { TextToHtmlService } from '@plano/client/scheduling/shared/text-to-html.service';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PShiftCommentComponent } from './p-shift-comment.component';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../shared/core/null-type-utils';
import { PShiftModule } from '../../p-shift.module';

const myStory = storiesOf('Client/PShift/p-shift-comment', module);
myStory.addParameters({ component: PShiftCommentComponent });
myStory

	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PShiftModule,
				NgbModalModule,
			],
			providers: [
				TextToHtmlService,
			],
			declarations: [
			],
		}),
	);

const fakeApi = new FakeSchedulingApiService();
const SHIFT = fakeApi.data.shifts.get(0);
assumeDefinedToGetStrictNullChecksRunning(SHIFT, 'SHIFT');
if (!SHIFT.end) SHIFT.end = SHIFT.start + (1000 * 60 * 60 * 60 * 5);
myStory
	.add('default', () => ({
		template: `
			<div class="card o-hidden">
			<p-shift-comment
				class="bg-light"
				[shift]="shift"
				[userCanWrite]="true"
			></p-shift-comment>
			<p-shift-comment
				class="bg-light"
				[shift]="shift"
				[userCanWrite]="true"
			></p-shift-comment>
			</div>
			shift.id: {{shift === undefined ? 'undefined' : shift.id}}
		`,
		props: {
			shift: SHIFT,
		},
	}))
;
