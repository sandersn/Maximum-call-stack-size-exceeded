import { NgxPopperjsPlacements } from 'ngx-popperjs';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { FilterService } from '@plano/client/shared/filter.service';
import { SchedulingApiHolidays } from '@plano/shared/api';
import { SchedulingApiAbsences } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { SchedulingApiBirthdays } from '../../../api/scheduling-api-birthday.service';
import { CalenderAllDayItemLayoutService } from '../../calender-all-day-item-layout.service';
import { CalendarAllDayItemType} from '../../calender-all-day-item-layout.service';

@Component({
	selector: 'p-all-day-items-list[startOfDay]',
	templateUrl: './p-all-day-items-list.component.html',
	styleUrls: ['./p-all-day-items-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})

export class PAllDayItemsListComponent {
	public config : typeof Config = Config;

	@Input() public holidays : SchedulingApiHolidays = new SchedulingApiHolidays(null, false);
	@Input() public absences : SchedulingApiAbsences = new SchedulingApiAbsences(null, false);
	@Input() public birthdays : SchedulingApiBirthdays = new SchedulingApiBirthdays(null, null, false);

	@Input() public popperPlacement : NgxPopperjsPlacements = NgxPopperjsPlacements.BOTTOM;

	/**
	 * Height of one line
	 * @return height in px
	 */
	@Input() private heightOfLine : number = 24;

	/**
	 * Day as timestamp
	 */
	@Input() public startOfDay ! : number;

	@Input() public readMode : boolean = false;

	constructor(
		private layoutService : CalenderAllDayItemLayoutService,
		private filterService : FilterService,
	) {
	}

	/**
	 * Height of this list in px
	 * @return height in px
	 */
	public get height() : number {
		return (this.layoutService.getMaxPosIndex(this.startOfDay) + 1) * this.heightOfLine;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public distanceAboveItem(item : CalendarAllDayItemType) : number {
		return this.layoutService.getLayout(this.startOfDay, item).posIndex * this.heightOfLine;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public showItem(item : CalendarAllDayItemType) : boolean {
		return this.layoutService.getLayout(this.startOfDay, item).show;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showList() : boolean {
		if (
			this.filterService.schedulingFilterService.hideAllAbsences &&
			this.filterService.schedulingFilterService.hideAllHolidays &&
			this.filterService.schedulingFilterService.hideAllBirthdays
		) return false;
		if (!this.absences.length && !this.holidays.length && !this.birthdays.length) return false;

		return true;
	}
}
