import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { moduleMetadata, storiesOf } from '@storybook/angular';
import { FakeSchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service.mock';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PShiftModule } from '../p-shift.module';

const fakeApi = new FakeSchedulingApiService();
const shift = fakeApi.data.shifts.get(0)!;
shift.assignedMemberIds.push(fakeApi.data.members.get(0)!.id);

const myStory = storiesOf('Client/PShift/pShiftCommentModal', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PShiftModule,
				NgbModalModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<div
				pShiftCommentModal
				[shift]="shift"
			>Click here</div>
		`,
		props: {
			shift: fakeApi.data.shifts.get(0),
		},
	}));
