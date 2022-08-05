/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { CalenderTimelineLayoutService } from '@plano/client/scheduling/shared/p-scheduling-calendar/calender-timeline-layout.service';
import { PMoment } from '@plano/client/shared/p-moment.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';

@Component({
	selector: 'p-calendar-month-weekdays-bar[timestamp]',
	templateUrl: './calendar-month-weekdays-bar.component.html',
	styleUrls: ['./calendar-month-weekdays-bar.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class CalendarMonthWeekdaysBarComponent {
	@Input() public timestamp ! : number;
	@Output() public onDayClick : EventEmitter<any> = new EventEmitter<any>();

	constructor(
		public layout : CalenderTimelineLayoutService,
		private pMoment : PMomentService,
	) {
	}

	private get weekStart() : PMoment.Moment {
		return this.pMoment.m(this.timestamp).startOf('isoWeek');
	}

	/**
	 * Weekdays as array of timestamps of the start of each day
	 */
	public get weekdays() : number[] {
		const result : number[] = [];
		for (let i = 0; i < 7; i++) {
			const dayTimestamp = this.weekStart.add(i, 'day').valueOf();
			result.push(dayTimestamp);
		}
		return result;
	}
}
