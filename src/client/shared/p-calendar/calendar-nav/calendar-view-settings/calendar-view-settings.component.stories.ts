import { action } from '@storybook/addon-actions';
import { storiesOf, moduleMetadata } from '@storybook/angular';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { StorybookModule } from '@plano/storybook/storybook.module';
import { CalendarViewSettingsComponent } from './calendar-view-settings.component';
import { PCalendarModule } from '../../p-calendar.module';

const myStory = storiesOf('Client/PCalendar/calendar-view-settings', module);
myStory
	.addDecorator(
		moduleMetadata({
			imports: [
				StorybookModule,
				PCalendarModule,
			],
		}),
	);

let calendarMode : CalendarModes = CalendarModes.WEEK;
let showDayAsList : CalendarViewSettingsComponent['showDayAsList'] = true;
let showWeekAsList : CalendarViewSettingsComponent['showWeekAsList'] = true;

myStory
	.add('default', () => ({
		template: `
			<p-calendar-view-settings
				[calendarMode]="calendarMode"
				(calendarModeChange)="calendarModeChange($event)"
				[showDayAsList]="showDayAsList"
				(showDayAsListChange)="showDayAsListChange($event)"
				[showWeekAsList]="showWeekAsList"
				(showWeekAsListChange)="showWeekAsListChange($event)"
			></p-calendar-view-settings>
		`,
		props: {
			calendarMode: calendarMode,
			calendarModeChange: (value : CalendarModes) => {
				calendarMode = value;
				action('calendarModeChange')(value);
			},
			showAsDayList: showDayAsList,
			showDayAsListChange: (value : boolean) => {
				showDayAsList = value;
				action('showAsListChange')(value);
			},
			showWeekAsList: showWeekAsList,
			showWeekAsListChange: (value : boolean) => {
				showWeekAsList = value;
				action('showWeekAsListChange')(value);
			},
			isLoading: false,
		},
	}));
