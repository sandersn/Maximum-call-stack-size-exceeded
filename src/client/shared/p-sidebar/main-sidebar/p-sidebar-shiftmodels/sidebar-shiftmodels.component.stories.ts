import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { ReportFilterService } from '@plano/client/report/report-filter.service';
import { SchedulingFilterService } from '@plano/client/scheduling/scheduling-filter.service';
import { FakeSchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service.mock';
import { PWishesService } from '@plano/client/scheduling/wishes.service';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { MeService } from '@plano/shared/api';
import { FakeMeService } from '@plano/shared/core/me/me.service.mock';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PSidebarModule } from '../../p-sidebar.module';

const fakeApi = new FakeSchedulingApiService();

const myStory = storiesOf('Client/PSidebar/p-sidebar-shiftmodels', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PSidebarModule,
			],
			providers: [
				ReportFilterService,
				SchedulingFilterService,
				HighlightService,
				PWishesService,
				{
					provide: MeService,
					useClass: FakeMeService,
				},
			],
		}),
	)
	.add('default', () => ({
		template: `
			<div class="bg-darker">
				<p-sidebar-shiftmodels
					style="height:530px"
					[shiftModels]="shiftModels"
					[hideMultiSelectBtn]="false"
					(onSelectRelatedShifts)="onSelectRelatedShifts($event)"
				></p-sidebar-shiftmodels>
			</div>
		`,
		props: {
			shiftModels: fakeApi.data.shiftModels,
			onSelectRelatedShifts: action('onSelectRelatedShifts'),
		},
	}));
