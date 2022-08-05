import { AfterViewInit} from '@angular/core';
import { Component, Input, Output, EventEmitter, NgZone, ElementRef, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { PFormControlComponentInterface } from '@plano/client/shared/p-forms/p-form-control.interface';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiAbsences, SchedulingApiHolidays, SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiShifts, SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiBirthdays } from '../../../api/scheduling-api-birthday.service';
import { PAllDayItemsListComponent } from '../p-all-day-items-list/p-all-day-items-list.component';

@Component({
	selector: 'p-week-view[absences][shifts]',
	templateUrl: './week-view.component.html',
	styleUrls: ['./week-view.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class WeekViewComponent implements AfterViewInit, PFormControlComponentInterface {
	@Input() private viewDate : number | null = null;

	@Input() public shifts ! : SchedulingApiShifts;
	@Input() public absences ! : PAllDayItemsListComponent['absences'];
	@Input() public holidays ! : PAllDayItemsListComponent['holidays'];
	@Input() public birthdays ! : PAllDayItemsListComponent['birthdays'];

	@Output() public onShiftClick : EventEmitter<{shift : SchedulingApiShift, event : MouseEvent}> = new EventEmitter();

	@ViewChild('startOfWorkday', { static: true }) public startOfWorkday ! : ElementRef<HTMLElement>;

	@Input() public shiftTemplate : TemplateRef<unknown> | null = null;

	@Input() public readMode : boolean = false;

	private today ! : number;

	@Input() public checkTouched : PFormControlComponentInterface['checkTouched'] = false;

	constructor(
		private zone : NgZone,
		private pMoment : PMomentService,
		public api : SchedulingApiService,
	) {
		this.today = +this.pMoment.m().startOf('day');
	}

	public ngAfterViewInit() : void {
		this.scrollToStartOfWorkday();
	}

	private scrollToStartOfWorkday() : void {
		this.zone.runOutsideAngular(() => {
			requestAnimationFrame(() => {
				const el = this.startOfWorkday.nativeElement;
				el.scrollIntoView();
			});
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get weekdays() : number[] {
		const result : number[] = [];
		for (let i = 0; i < 7; i++) {
			const dayTimestamp = this.pMoment.m(this.viewDate).startOf('isoWeek').add(i, 'day').valueOf();
			result.push(dayTimestamp);
		}
		return result;
	}

	/**
	 * Get all absences for the selected date
	 */
	public absencesOfDay(timestamp : number) : SchedulingApiAbsences {
		return this.absences.getByDay(timestamp);
	}

	/**
	 * Get all holidays for the selected date
	 */
	public holidaysOfDay(timestamp : number) : SchedulingApiHolidays {
		return this.holidays.getByDay(timestamp);
	}

	/**
	 * Get all birthdays for the selected date
	 */
	public birthdaysOfDay(timestamp : number) : SchedulingApiBirthdays {
		return this.birthdays.getByDay(timestamp);
	}


	// eslint-disable-next-line jsdoc/require-jsdoc
	public isBeforeToday(
		startOfDay : number,
	) : boolean {
		return this.pMoment.m(startOfDay).isBefore(this.today);
	}
}
