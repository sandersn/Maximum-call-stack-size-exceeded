import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingApiService } from '@plano/shared/api';
import { CalenderTimelineLayoutService } from '../calender-timeline-layout.service';

@Component({
	selector: 'p-calendar-weekday-bar',
	templateUrl: './calendar-weekday-bar.component.html',
	styleUrls: ['./calendar-weekday-bar.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class CalendarWeekdayBarComponent {

	constructor(
		public layout : CalenderTimelineLayoutService,
		public api : SchedulingApiService,
	) {
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public showThisShiftModelParent(parentName : string) : boolean {
		return this.layout.getLayout(parentName).show;
	}

}
