import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { CourseFilterService } from '../../../course-filter.service';
import { PWishesService } from '../../../wishes.service';
import { PSchedulingCalendarModule } from '../p-calendar.module';

const myStory = storiesOf('Client/PCalendar/calendar-weekday-bar', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PSchedulingCalendarModule,
			],
			providers: [
				PWishesService,
				CourseFilterService,
			],
		}),
	)
	.add('default', () => ({
		template: `
			<p-calendar-weekday-bar
			></p-calendar-weekday-bar>
		`,
		props: {
			// title: '',
			// isLoading: false,
		},
	}));
