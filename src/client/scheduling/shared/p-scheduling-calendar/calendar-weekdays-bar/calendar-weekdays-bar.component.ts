import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { RightsService } from '@plano/client/accesscontrol/rights.service';
import { CalenderTimelineLayoutService } from '@plano/client/scheduling/shared/p-scheduling-calendar/calender-timeline-layout.service';
import { PMoment } from '@plano/client/shared/p-moment.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../shared/core/null-type-utils';
import { SchedulingApiService, SchedulingApiShifts } from '../../api/scheduling-api.service';
import { PCalendarService } from '../p-calendar.service';

@Component({
	selector: 'p-calendar-weekdays-bar[timestamp]',
	templateUrl: './calendar-weekdays-bar.component.html',
	styleUrls: ['./calendar-weekdays-bar.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class CalendarWeekdaysBarComponent {
	@Input() private timestamp ! : number;
	@Input() public timelineMode : boolean = false;
	@Output() public dayClick : EventEmitter<number> = new EventEmitter<number>();
	@Input() public neverShowDayTools : boolean = true;
	@Input() public shifts : SchedulingApiShifts | null = null;

	constructor(
		public layout : CalenderTimelineLayoutService,
		public api : SchedulingApiService,
		private pCalendarService : PCalendarService,
		private pMoment : PMomentService,
		public rightsService : RightsService,
	) {
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public showTitleForWeekday(weekday : number) : boolean {
		if (!this.timelineMode) return true;
		if (this.layout.getLayout(weekday).show) return true;
		return false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get weekdays() : number[] {
		const result : number[] = [];
		for (let i = 0; i < 7; i++) {
			const dayTimestamp = this.weekStart.add(i, 'day').valueOf();
			result.push(dayTimestamp);
		}
		return result;
	}

	private get weekStart() : PMoment.Moment {
		return this.pMoment.m(this.timestamp).startOf('isoWeek');
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public shiftsOfDay(timestamp : number) : SchedulingApiShifts {
		assumeDefinedToGetStrictNullChecksRunning(this.shifts, 'this.shifts');
		return this.shifts.getByDay(timestamp);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public pinStickyNote(timestamp : number) : boolean {
		if (!this.pCalendarService.hasImportantNoteForDay(timestamp, false)) return false;
		return true;
	}
}
