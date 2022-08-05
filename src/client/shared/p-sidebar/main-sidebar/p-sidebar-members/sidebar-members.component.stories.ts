import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { PPermissionService } from '@plano/client/accesscontrol/permission.service';
import { ReportFilterService } from '@plano/client/report/report-filter.service';
import { SchedulingFilterService } from '@plano/client/scheduling/scheduling-filter.service';
import { FakeSchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service.mock';
import { PWishesService } from '@plano/client/scheduling/wishes.service';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PSidebarModule } from '../../p-sidebar.module';
import { PSidebarService } from '../../p-sidebar.service';

const fakeApi = new FakeSchedulingApiService();

const myStory = storiesOf('Client/PSidebar/p-sidebar-members', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PSidebarModule,
			],
			providers: [
				PPermissionService,
				ReportFilterService,
				SchedulingFilterService,
				PSidebarService,
				PWishesService,
				HighlightService,
			],
			declarations: [
			],
		}),
	)
	.add('default', () => ({
		template: `
			<div class="bg-darker">
				<p-sidebar-members
					style="height:530px"
					[members]="members"
					[accountingPeriods]="accountingPeriods"
					[hideMultiSelectBtn]="false"
					(onSelectRelatedShifts)="onSelectRelatedShifts($event)"
				></p-sidebar-members>
			</div>
		`,
		props: {
			members: fakeApi.data.members,
			accountingPeriods: fakeApi.data.accountingPeriods,
			onSelectRelatedShifts: action('onSelectRelatedShifts'),
		},
	}));
