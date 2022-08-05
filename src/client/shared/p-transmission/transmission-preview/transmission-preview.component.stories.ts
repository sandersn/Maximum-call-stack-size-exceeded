import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { FakeAffectedShiftsApiService } from '@plano/client/scheduling/shared/api/affected-shifts-api.service.mock';
import { FakeSchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service.mock';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PTransmissionModule } from '../p-transmission.module';

const fakeSchedulingApi = new FakeSchedulingApiService();
const fakeApi = new FakeAffectedShiftsApiService();

for (const affectedShift of fakeApi.data.shifts.iterable()) {
	for (const member of fakeSchedulingApi.data.members.iterable()) {
		affectedShift.assignedMemberIds.push(member.id);
	}
}
const myStory = storiesOf('Client/PTransmission/p-transmission-preview', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PTransmissionModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-transmission-preview
				(timestampChanged)="transmissionPreviewDateChanged($event)"
				[affectedShifts]="affectedShifts"
				[shiftModel]="shiftModel"
				[members]="members"
				[myId]="myId"
			></p-transmission-preview>
		`,
		// [myId]="meService.isLoaded() ? meService.data.id : undefined"
		props: {
			members: fakeSchedulingApi.data.members,
			myId: fakeSchedulingApi.data.members.get(1)!.id,
			affectedShifts: fakeApi.data.shifts,
			shiftModel: fakeSchedulingApi.data.shiftModels.get(0),
			transmissionPreviewDateChanged: (input : number) => {
				action('dateChanged')(input);
			},
		},
	}));
