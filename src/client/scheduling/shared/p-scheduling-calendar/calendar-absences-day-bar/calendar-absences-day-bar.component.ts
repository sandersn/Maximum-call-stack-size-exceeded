import { NgxPopperjsPlacements } from 'ngx-popperjs';
import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { CalenderAllDayItemLayoutService } from '@plano/client/scheduling/shared/p-scheduling-calendar/calender-all-day-item-layout.service';
import { SchedulingApiAbsences, SchedulingApiHolidays } from '@plano/shared/api';
import { SchedulingApiBirthdays } from '../../api/scheduling-api-birthday.service';
import { PAllDayItemsListComponent } from '../p-calendar/p-all-day-items-list/p-all-day-items-list.component';

@Component({
	selector: 'p-calendar-absences-day-bar[startOfDay]',
	templateUrl: './calendar-absences-day-bar.component.html',
	styleUrls: ['./calendar-absences-day-bar.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class CalendarAbsencesDayBarComponent {

	/**
	 * Height of one line
	 * @return height in px
	 */
	public heightOfLine : number = 24;

	@Input() public startOfDay ! : number;
	@Input() public readMode : boolean = false;
	@Input() public absences : PAllDayItemsListComponent['absences'] = new SchedulingApiAbsences(null, false);
	@Input() public holidays : PAllDayItemsListComponent['holidays'] = new SchedulingApiHolidays(null, false);
	@Input() public birthdays : PAllDayItemsListComponent['birthdays'] = new SchedulingApiBirthdays(null, null, false);

	constructor(
		private layoutService : CalenderAllDayItemLayoutService,
		public schedulingService : SchedulingService,
	) {
	}

	public NgxPopperjsPlacements = NgxPopperjsPlacements;

	/**
	 * Height of this list in px
	 * @return height in px
	 */
	@HostBinding('style.height.px') public get height() : number {
		const maxPosIndex = this.layoutService.getMaxPosIndex(this.startOfDay);
		return (maxPosIndex + 1) * this.heightOfLine;
	}
}
