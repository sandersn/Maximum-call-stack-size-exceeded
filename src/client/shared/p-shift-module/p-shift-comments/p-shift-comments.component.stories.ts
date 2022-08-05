import { moduleMetadata, storiesOf } from '@storybook/angular';
import { PPermissionService } from '@plano/client/accesscontrol/permission.service';
import { ReportFilterService } from '@plano/client/report/report-filter.service';
import { SchedulingFilterService } from '@plano/client/scheduling/scheduling-filter.service';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PShiftModule } from '../p-shift.module';

const myStory = storiesOf('Client/PShift/p-shift-comments', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PShiftModule,
			],
			providers: [
				ReportFilterService,
				SchedulingFilterService,
				PPermissionService,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-shift-comments></p-shift-comments>
		`,
		props: {
		},
	}));
