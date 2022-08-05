import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { STORYBOOK_STRINGIFY_FN, STORYBOOK_OUTPUT_FN } from '@plano/storybook/storybook.utils';
import { BootstrapSize } from '../../bootstrap-styles.enum';
import { PCalendarModule } from '../p-calendar.module';

const myStory = storiesOf('Client/PCalendar/calendar-nav', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PCalendarModule,
			],
			providers: [
				// { provide: SchedulingApiService, useClass: SchedulingApiService },
			],
		}),
	);

/* eslint-disable-next-line prefer-const */
let calendarMode : CalendarModes = CalendarModes.WEEK;
let _selectedDate = +(new PMomentService(PSupportedLocaleIds.de_DE).m().set('seconds', 0).set('minutes', 0).set('hours', 0));

myStory
	.add('default', () => ({
		template: `
			<p-calendar-nav
				[size]="${BootstrapSize.LG}"
				[calendarMode]="calendarMode"
				[(selectedDate)]="selectedDate"
			></p-calendar-nav>
			<br>
			${STORYBOOK_OUTPUT_FN('selectedDate')}
		`,
		props: {
			selectedDate: _selectedDate,
			selectedDateChange: (value : number) => {
				_selectedDate = value;
				action('selectedDateChange')(value);
			},
			calendarMode: calendarMode,
			stringify: STORYBOOK_STRINGIFY_FN,
		},
	}));
