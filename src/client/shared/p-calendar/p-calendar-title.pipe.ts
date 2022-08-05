import { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';

@Pipe({ name: 'calendarTitle' })
export class PCalendarTitlePipe implements PipeTransform {
	constructor(
		private pDatePipe : PDatePipe,
		private localize : LocalizePipe,
	) {
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public transform(
		selectedDate : number,
		calendarMode : CalendarModes | null,

		/**
		 * Short text – usually used for mobile
		 */
		shortMode ?: boolean,
	) : string {
		if (!selectedDate || !calendarMode) return '█:█:██';
		switch (calendarMode) {
			case CalendarModes.DAY :
				if (shortMode) return `${this.pDatePipe.transform(selectedDate, 'veryShortDate')} · ${this.pDatePipe.transform(selectedDate, 'EEEE')!.slice(0, 2)}`;
				return `${this.pDatePipe.transform(selectedDate, 'longDate')} · ${this.pDatePipe.transform(selectedDate, 'EEEE')}`;
			case CalendarModes.WEEK :
				return `${this.localize.transform('KW')} ${this.pDatePipe.transform(selectedDate, 'ww')}`;
			case CalendarModes.MONTH :
				if (shortMode) return this.pDatePipe.transform(selectedDate, 'MMM yyyy')!;
				return this.pDatePipe.transform(selectedDate, 'MMMM yyyy')!;
			default :
				const RESULT : never = calendarMode;
				throw new Error(RESULT);
		}
	}
}
