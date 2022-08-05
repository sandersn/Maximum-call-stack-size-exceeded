import { MonthViewDay } from 'calendar-utils';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { AfterContentChecked, OnDestroy, AfterContentInit } from '@angular/core';
import { Component, Input, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { RightsService } from '@plano/client/accesscontrol/rights.service';
import { FilterService } from '@plano/client/shared/filter.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiShifts } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { Data } from '@plano/shared/core/data/data';
import { PrimitiveDataInput } from '@plano/shared/core/data/primitive-data-input';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../../shared/core/null-type-utils';
import { PCalendarService } from '../../p-calendar.service';
import { PAllDayItemsListComponent } from '../p-all-day-items-list/p-all-day-items-list.component';

@Component({
	selector: 'p-month-cell[day][shifts][absences][holidays][birthdays]',
	templateUrl: './month-cell.component.html',
	styleUrls: ['./month-cell.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class MonthCellComponent implements AfterContentInit, AfterContentChecked, OnDestroy {

	@Input() private day ! : MonthViewDay;
	public dayAsTimestamp ! : number;
	@Input() private shifts ! : SchedulingApiShifts;
	@Input() public absences ! : PAllDayItemsListComponent['absences'];
	@Input() public holidays ! : PAllDayItemsListComponent['holidays'];
	@Input() public birthdays ! : PAllDayItemsListComponent['birthdays'];

	@Input() private selectedDate : number | null = null;
	@Input() public neverShowDayTools : boolean = true;

	@Output() public onDayClick : EventEmitter<number> = new EventEmitter<number>();

	@Input() public shiftTemplate : TemplateRef<unknown> | null = null;

	@Input() public readMode : boolean = false;

	constructor(
		public api : SchedulingApiService,
		private pCalendarService : PCalendarService,
		private filterService : FilterService,
		public rightsService : RightsService,
		private pMoment : PMomentService,
	) {
	}

	private _shiftsOfDay : Data<SchedulingApiShifts> =
		new Data<SchedulingApiShifts>(this.api, this.filterService, new PrimitiveDataInput<number>(() => {
			assumeDefinedToGetStrictNullChecksRunning(this.dayAsTimestamp, 'dayAsTimestamp');
			return this.dayAsTimestamp;
		}));

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftsOfDay() : SchedulingApiShifts {
		return this._shiftsOfDay.get(() => {
			assumeDefinedToGetStrictNullChecksRunning(this.dayAsTimestamp, 'dayAsTimestamp');
			return this.shifts.getByDay(this.dayAsTimestamp);
		});
	}

	public pinStickyNote : boolean = false;

	private subscription : ISubscription | null = null;

	/**
	 * If this is true, the shift-items in ui will be just skeletons/placeholders.
	 */
	@Input() public delayIsActive : boolean = false;

	public ngAfterContentChecked() : void {
		this.dayAsTimestamp = this.day.date.getTime();
	}

	public ngAfterContentInit() : void {
		this.dayAsTimestamp = this.day.date.getTime();
		this.refreshPinStickyNote();
		this.subscription = this.api.onChange.subscribe(() => {
			this.refreshPinStickyNote();
		});
	}

	private refreshPinStickyNote() : void {
		if (this.dayAsTimestamp === undefined!) return;
		this.pinStickyNote = !!this.pCalendarService.hasImportantNoteForDay(this.dayAsTimestamp, false);
	}

	public ngOnDestroy() : void {
		this.subscription?.unsubscribe();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftsOfDayHaveDescriptions() : boolean {
		const result = this.pCalendarService.shiftsOfDayHaveDescriptions(this.dayAsTimestamp, { onlyForUser : true });
		assumeDefinedToGetStrictNullChecksRunning(result, 'result');
		return result;
	}

	/**
	 * This changes the selected timestamp
	 * NOTE: Relict from old times
	 */
	public onCellTopClick() : void {
		if (!this.selectedDate) throw new Error('selectedDate is not defined');
		if (!this.pMoment.m(this.selectedDate).isSame(this.dayAsTimestamp, 'month')) return;
		this.onDayClick.emit(this.dayAsTimestamp);
	}
}
