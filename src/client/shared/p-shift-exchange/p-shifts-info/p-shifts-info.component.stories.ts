import { storiesOf, moduleMetadata } from '@storybook/angular';
import { FakeSchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service.mock';
import { StorybookModule } from '@plano/storybook/storybook.module';

const fakeApi = new FakeSchedulingApiService();

storiesOf('Client/PShiftExchange/p-shifts-info', module)
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
		<div class="d-flex justify-content-center position-relative card m-3">
			<p-shifts-info
				class="p-3"
			></p-shifts-info>
		</div>
		<div class="d-flex justify-content-center position-relative card m-3">
      <p-shifts-info
				class="p-3"
				[shiftId]="shiftId"
			></p-shifts-info>
		</div>
		<div class="d-flex justify-content-center position-relative card m-3">
      <p-shifts-info
				class="p-3"
				[shiftId]="shiftId"
				[oneLine]="false"
			></p-shifts-info>
		</div>
		<div class="d-flex justify-content-center position-relative card m-3">
			<p-shifts-info
				class="p-3"
        [shiftId]="shiftId"
      >
				<p-shift-info-content-left>
					left content
				</p-shift-info-content-left>
			</p-shifts-info>
		</div>
    `,
		props: {
			shiftId: fakeApi.data.shifts.get(0)!.id,
		},
	}))
;
