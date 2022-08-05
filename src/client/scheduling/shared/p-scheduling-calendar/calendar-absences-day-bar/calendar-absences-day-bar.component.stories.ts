import { storiesOf, moduleMetadata } from '@storybook/angular';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { PSchedulingCalendarModule } from '../p-calendar.module';

const myStory = storiesOf('Client/PSchedulingCalendar/calendar-absences-day-bar', module);
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
			<p-calendar-absences-day-bar
			></p-calendar-absences-day-bar>
		`,
		props: {
		},
	}));
