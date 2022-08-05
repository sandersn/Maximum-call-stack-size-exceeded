import { moduleMetadata, storiesOf } from '@storybook/angular';
import { FakeSchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service.mock';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PShiftModule } from '../p-shift.module';

const fakeApi = new FakeSchedulingApiService();
const shift = fakeApi.data.shifts.get(0)!;

const myStory = storiesOf('Client/PShift/shift-comment-meta', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PShiftModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<div class="card bg-white m-5 p-3">
				<p-shift-comment-meta></p-shift-comment-meta>
			</div>
			<div class="card bg-white m-5 p-3">
				<p-shift-comment-meta
					[name]="'Some Shift'"
					[start]="start"
					[end]="end"
					[assignedMembers]="assignedMembers"
				></p-shift-comment-meta>
			</div>
			<div class="card bg-white m-5 p-3">
				<p-shift-comment-meta [name]="'Some Shift'" [start]="start" [end]="end"></p-shift-comment-meta>
			</div>
			<div class="card bg-white m-5 p-3">
				<p-shift-comment-meta [start]="start"></p-shift-comment-meta>
			</div>
			<div class="card bg-white m-5 p-3">
				<p-shift-comment-meta [name]="'Some Shift'"></p-shift-comment-meta>
			</div>
		`,
		props: {
			start: shift.start,
			end: shift.end,
			assignedMembers: fakeApi.data.members.filterBy(item => item.lastName.includes('Sadinam') || item.firstName.includes('Nils')),
		},
	}));
