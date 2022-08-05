import { storiesOf, moduleMetadata } from '@storybook/angular';
import { CourseFilterService } from '@plano/client/scheduling/course-filter.service';
import { PWishesService } from '@plano/client/scheduling/wishes.service';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PSchedulingCalendarModule } from '../p-calendar.module';

const myStory = storiesOf('Client/PSchedulingCalendar/calendar-filter-settings', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PSchedulingCalendarModule,
			],
			providers: [
				CourseFilterService,
				PWishesService,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-calendar-filter-settings
			></p-calendar-filter-settings>
		`,
		props: {
			// title: '',
			// isLoading: false,
		},
	}));
