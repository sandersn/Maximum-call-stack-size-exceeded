import { storiesOf, moduleMetadata } from '@storybook/angular';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { Config } from '@plano/shared/core/config';
import { PDateFormat } from '@plano/shared/core/pipe/p-date.pipe';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { FakeSchedulingApiService } from '../../../api/scheduling-api.service.mock';
import { PSchedulingCalendarModule } from '../../p-calendar.module';

const fakeApi = new FakeSchedulingApiService();

const myStory = storiesOf('Client/PSchedulingCalendar/p-cell-top', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PSchedulingCalendarModule,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-cell-top></p-cell-top>
			<hr>
			<p-cell-top
				[dayStart]="prevDay"
				[dateFormat]="dateFormat"
				[shiftsOfDay]="shiftsOfDay"
				[pinStickyNote]="pinStickyNote"
				[neverShowDayTools]="false"
				[canEditMemos]="true"
			></p-cell-top>
			<hr>
			<p-cell-top
				[dayStart]="prevDay"
				[dateFormat]="dateFormat"
				[shiftsOfDay]="shiftsOfDay"
				[pinStickyNote]="pinStickyNote"
				[neverShowDayTools]="false"
				[canEditMemos]="false"
			></p-cell-top>
			<hr>
			<p-cell-top
				[dayStart]="dayStart"
				[shiftsOfDay]="shiftsOfDay"
				[pinStickyNote]="pinStickyNote"
				[neverShowDayTools]="false"
				[canEditMemos]="true"
			></p-cell-top>
		`,
		props: {
			prevDay: +(new PMomentService(Config.LOCALE_ID).m().subtract(1, 'day').startOf('day')),
			dayStart: +(new PMomentService(Config.LOCALE_ID).m().startOf('day')),
			dateFormat: PDateFormat.VERY_SHORT_DATE,
			shiftsOfDay: fakeApi.data.shifts,
			pinStickyNote: true,
		},
	}));
