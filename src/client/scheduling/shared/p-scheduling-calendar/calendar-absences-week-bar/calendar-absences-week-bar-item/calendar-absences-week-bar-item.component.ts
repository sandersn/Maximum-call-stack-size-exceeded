import { NgxPopperjsPlacements } from 'ngx-popperjs';
import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { SchedulingApiAbsences, SchedulingApiHolidays } from '@plano/shared/api';
import { SchedulingApiBirthdays } from '../../../api/scheduling-api-birthday.service';
import { CalenderTimelineLayoutService } from '../../calender-timeline-layout.service';
import { PAllDayItemsListComponent } from '../../p-calendar/p-all-day-items-list/p-all-day-items-list.component';

@Component({
	selector: 'p-calendar-absences-week-bar-item[absences][holidays][birthdays][weekday]',
	templateUrl: './calendar-absences-week-bar-item.component.html',
	styleUrls: ['./calendar-absences-week-bar-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class CalendarAbsencesWeekBarItemComponent {
	@Input() public weekday ! : number;

	/**
	 * Height of one line
	 * @return height in px
	 */
	@Input() public heightOfLine : number = 24;

	@Input('absences') public _absences ! : PAllDayItemsListComponent['absences'];
	@Input('holidays') public _holidays ! : PAllDayItemsListComponent['holidays'];
	@Input('birthdays') public _birthdays ! : PAllDayItemsListComponent['birthdays'];

	@Input() public readMode : boolean = false;

	@HostBinding('class.position-absolute') protected _alwaysTrue = true;
	@HostBinding('style.bottom') protected _styleBottom : string = '0px';
	@HostBinding('style.height') protected _styleHeight : string = '2em';
	@HostBinding('style.left') private get _styleLeft() : string {
		return `${this.layout.getLayout(this.weekday).x}px`;
	}
	@HostBinding('style.top') private get _styleTop() : string {
		return `${this.layout.getLayout(this.weekday).y}px`;
	}

	/**
	 * Calculate the css z-index for this item
	 */
	@HostBinding('style.z-index') protected get _styleZIndex() : number {
		const highlightedAbsence = this.absencesOfDay(this.weekday).findBy(item => this.highlightService.isHighlighted(item, this.weekday));
		if (!!highlightedAbsence) return 1020;
		const highlightedHoliday = this.holidaysOfDay(this.weekday).findBy(item => this.highlightService.isHighlighted(item, this.weekday));
		if (!!highlightedHoliday) return 1020;
		const highlightedBirthday = this.birthdaysOfDay(this.weekday).findBy(item => this.highlightService.isHighlighted(item, this.weekday));
		if (!!highlightedBirthday) return 1020;
		return 0;
	}

	@HostBinding('style.width.px') private get _styleWidth() : number {
		return this.layout.getLayout(this.weekday).width;
	}

	constructor(
		private layout : CalenderTimelineLayoutService,
		private highlightService : HighlightService,
	) {
	}

	public NgxPopperjsPlacements = NgxPopperjsPlacements;

	/**
	 * Get all absences for the selected date
	 */
	public absencesOfDay(weekday : number) : SchedulingApiAbsences {
		const timestamp = weekday;
		return this._absences.getByDay(timestamp);
	}

	/**
	 * Get all holidays for the selected date
	 */
	public holidaysOfDay(weekday : number) : SchedulingApiHolidays {
		const timestamp = weekday;
		return this._holidays.getByDay(timestamp);
	}

	/**
	 * Get all birthdays for the selected date
	 */
	public birthdaysOfDay(weekday : number) : SchedulingApiBirthdays {
		const timestamp = weekday;
		return this._birthdays.getByDay(timestamp);
	}

}
