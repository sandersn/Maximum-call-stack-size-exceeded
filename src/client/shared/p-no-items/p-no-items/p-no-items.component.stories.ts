import { storiesOf, moduleMetadata } from '@storybook/angular';
import { ReportFilterService } from '@plano/client/report/report-filter.service';
import { SchedulingFilterService } from '@plano/client/scheduling/scheduling-filter.service';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { ClientSharedModule } from '../../client-shared.module';
import { FilterService } from '../../filter.service';

const myStory = storiesOf('Client/ClientSharedComponents/p-no-items', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				ClientSharedModule,
			],
			providers: [
				ReportFilterService,
				SchedulingFilterService,
				FilterService,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-no-items></p-no-items>
		`,
		props: {
		},
	}));
