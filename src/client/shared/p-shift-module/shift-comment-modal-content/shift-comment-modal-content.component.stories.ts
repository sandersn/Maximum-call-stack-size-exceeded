import { storiesOf, moduleMetadata } from '@storybook/angular';
import { FakeSchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service.mock';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PShiftModule } from '../p-shift.module';


const fakeApi = new FakeSchedulingApiService();
const shift = fakeApi.data.shifts.get(0)!;
const member = fakeApi.data.members.get(0)!;
shift.assignedMemberIds.push(member.id);

const myStory = storiesOf('Client/PShift/p-shift-comment-modal-content', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PShiftModule,
			],
			providers: [
			],
			declarations: [
			],
		}),
	);

myStory
	.add('default', () => ({
		template: `
		<p-shift-comment-modal-content
			class="bg-light"
			[shift]="shift"
		></p-shift-comment-modal-content>
		<p-shift-comment-modal-content
			class="bg-light"
			[shift]="shift"
			[userCanWrite]="true"
		></p-shift-comment-modal-content>
		`,
		props: {
			shift: shift,
		},
	}))
;
