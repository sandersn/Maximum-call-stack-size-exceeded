import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { PMoment } from '@plano/client/shared/p-moment.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { CalenderAllDayItemLayoutService } from '../calender-all-day-item-layout.service';
import { CalenderTimelineLayoutService } from '../calender-timeline-layout.service';
import { PAllDayItemsListComponent } from '../p-calendar/p-all-day-items-list/p-all-day-items-list.component';

@Component({
	selector: 'p-calendar-absences-week-bar[absences][holidays][birthdays][timestamp]',
	templateUrl: './calendar-absences-week-bar.component.html',
	styleUrls: ['./calendar-absences-week-bar.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class CalendarAbsencesWeekBarComponent {

	/**
	 * Height of one line
	 * @return height in px
	 */
	public heightOfLine : number = 24;

	@Input() public absences ! : PAllDayItemsListComponent['absences'];
	@Input() public holidays ! : PAllDayItemsListComponent['holidays'];
	@Input() public birthdays ! : PAllDayItemsListComponent['birthdays'];

	@Input() private timestamp ! : number;
	// @Input() public timelineMode : boolean = false;

	@Input() public readMode : boolean = false;

	constructor(
		public layout : CalenderTimelineLayoutService,
		private layoutService : CalenderAllDayItemLayoutService,
		private pMoment : PMomentService,
	) {
	}

	/**
	 * Height of this list in px
	 * @return height in px
	 */
	@HostBinding('style.height.px') public get height() : number {
		let maxHeightOfWeek : number = 0;
		for (const weekday of this.weekdays) {
			const heightOfDay = this.layoutService.getMaxPosIndex(weekday);
			if (heightOfDay > maxHeightOfWeek) {
				maxHeightOfWeek = heightOfDay;
			}
		}
		return (maxHeightOfWeek + 1) * this.heightOfLine;
	}

	private get weekStart() : PMoment.Moment {
		return this.pMoment.m(this.timestamp).startOf('isoWeek');
	}

	/** Weekdays as array of timestamps */
	public get weekdays() : number[] {
		const result : number[] = [];
		for (let i = 0; i < 7; i++) {
			const dayTimestamp = this.weekStart.add(i, 'day').valueOf();
			result.push(dayTimestamp);
		}
		return result;
	}
}
