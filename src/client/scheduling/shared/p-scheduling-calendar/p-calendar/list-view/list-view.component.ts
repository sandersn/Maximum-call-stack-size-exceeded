import { interval } from 'rxjs';
import { Subscription } from 'rxjs';
import { OnChanges, AfterViewInit, OnDestroy } from '@angular/core';
import { Component, TemplateRef, ChangeDetectionStrategy, Input } from '@angular/core';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { BootstrapSize, PAlertThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { FilterService } from '@plano/client/shared/filter.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiShift, SchedulingApiShifts} from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { Assertions } from '@plano/shared/core/assertions';
import { Data } from '@plano/shared/core/data/data';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../../shared/core/null-type-utils';
import { sortShiftsForListViewFns } from '../../../api/scheduling-api.utils';

class DayData {
	public labels : string[] = new Array<string>();
	public shifts : SchedulingApiShift[] = [];
	public trackByValue : number | null = null;
	public containsToday : boolean = false;
}

@Component({
	selector: 'p-list-view',
	templateUrl: './list-view.component.html',
	styleUrls: ['./list-view.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class ListViewComponent implements AfterViewInit, OnChanges, OnDestroy {
	private startOfDay : number | null = null;
	@Input('startOfDay') private set _startOfDay(input : number) {
		Assertions.ensureIsDayStart(input);
		this.startOfDay = input;
	}

	@Input() private calendarMode : CalendarModes | null = null;
	@Input() public shifts : SchedulingApiShifts | null = null;

	@Input() public shiftTemplate : TemplateRef<unknown> | null = null;

	/**
	 * If this is true, the shift-items in ui will be just skeletons/placeholders.
	 */
	@Input() public delayIsActive : boolean = false;

	constructor(
		public api : SchedulingApiService,
		private filterService : FilterService,
		private pMoment : PMomentService,
		private datePipe : PDatePipe,
	) {
	}

	public BootstrapSize = BootstrapSize;
	public PAlertThemeEnum = PAlertThemeEnum;

	public ngAfterViewInit() : void {
	}

	public ngOnChanges() : void {
	}

	/**
	 * Array of all timestamps of the days of this date-range based on calendarMode
	 */
	public get days() : number[] {
		if (!this.startOfDay) return [];
		let startOfMoment = this.pMoment.m(this.startOfDay).startOf(this.calendarMode);
		const result = [];
		assumeDefinedToGetStrictNullChecksRunning(this.calendarMode, 'this.calendarMode');
		const currentWeek : number = this.pMoment.m(this.startOfDay).get(this.calendarMode);
		while (startOfMoment.get(this.calendarMode) === currentWeek) {
			result.push(+startOfMoment.startOf('day'));
			startOfMoment = startOfMoment.add(1, 'day');
		}
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showDayHeader() : boolean {
		return this.calendarMode !== CalendarModes.DAY;
	}

	private formatDay(timestamp : number) : string {
		// get weekday without dot
		let result = this.pMoment.m(timestamp).format('ddd');
		result = result.substring(0, result.length - 1);

		// add date
		result += `, ${this.datePipe.transform(timestamp, 'veryShortDate')}`;


		return result;
	}

	private _daysData : Data<DayData[]> = new Data<DayData[]>(this.api, this.filterService);
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get daysData() : DayData[] {
		return this._daysData.get(() => {
			const days = this.days;
			const result = new Array<DayData>();

			// get shifts for each day
			const daysShifts = new Array<SchedulingApiShift[]>();

			for (const day of days) {
				daysShifts.push(this.shifts!.getByDay(day).sort(sortShiftsForListViewFns as (Parameters<Array<SchedulingApiShift>['sort']>[0])[], false).iterable());
			}

			// create days data array
			for (let dayIndex = 0; dayIndex < days.length; ++dayIndex) {
				const dayData = new DayData();
				result.push(dayData);

				dayData.trackByValue = days[dayIndex];
				dayData.shifts = daysShifts[dayIndex];

				const now = this.pMoment.m();

				// if day has no shifts then summarize with following days which also have no shifts
				if (daysShifts[dayIndex].length === 0) {
					const noShiftsFirstDayIndex = dayIndex;

					while (dayIndex < days.length - 1 && daysShifts[dayIndex + 1].length === 0) {
						++dayIndex;
					}

					const noShiftsLastDayIndex = dayIndex;

					// Range of only one day?
					if (noShiftsFirstDayIndex === noShiftsLastDayIndex) {
						dayData.labels.push(this.formatDay(days[noShiftsFirstDayIndex]));
					} else { // Otherwise range of several days
						dayData.labels.push(this.formatDay(days[noShiftsFirstDayIndex]), '-');
						dayData.labels.push(this.formatDay(days[noShiftsLastDayIndex]));
					}

					if (now.isSameOrAfter(days[noShiftsFirstDayIndex], 'day') && now.isSameOrBefore(days[noShiftsLastDayIndex], 'day')) {
						dayData.containsToday = true;
					}
				} else {
					dayData.labels.push(this.formatDay(days[dayIndex]));
					if (now.isSame(days[dayIndex], 'day')) {
						dayData.containsToday = true;
					}
				}
			}

			return result;
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public trackByDayData(_index : number, item : DayData) : number {
		return item.trackByValue!;
	}

	private firstShiftAfterNow : SchedulingApiShift | null = null;

	private updateFirstShiftAfterNow(shifts : SchedulingApiShift[]) : void {
		const now = Date.now();
		this.firstShiftAfterNow = shifts.sort((a, b) => {
			if (!a.rawData || !b.rawData) {
				this.clearNowLineUpdateIntervals();
				return 0;
			}
			return a.start - b.start;
		}).find((item) => {
			if (!item.rawData) return null;
			return item.start > now;
		}) ?? null;
	}

	private nowLineUpdateIntervals : {[key : string] : Subscription | undefined} = {};

	public ngOnDestroy() : void {
		this.clearNowLineUpdateIntervals();
	}

	private clearNowLineUpdateIntervals() : void {
		for (const key of Object.keys(this.nowLineUpdateIntervals)) {
			this.nowLineUpdateIntervals[key]?.unsubscribe();
			this.nowLineUpdateIntervals[key] = undefined;
		}
	}

	/** Should the now line be visible? */
	public showNowLine(dayData : DayData, shift : SchedulingApiShift) : boolean {
		if (this.api.isBackendOperationRunning) return false;
		if (!dayData.containsToday) return false;
		if (this.firstShiftAfterNow === null && !this.nowLineUpdateIntervals[`${dayData.trackByValue}${dayData.shifts.length}`]) {
			this.updateFirstShiftAfterNow(dayData.shifts);
			this.nowLineUpdateIntervals[`${dayData.trackByValue}${dayData.shifts.length}`] = interval(2000).pipe().subscribe(() => {
				this.updateFirstShiftAfterNow(dayData.shifts);
			});
			return false;
		}

		if (this.firstShiftAfterNow === null) return false;
		// eslint-disable-next-line sonarjs/prefer-immediate-return
		const isSameId = shift.id.equals(this.firstShiftAfterNow.id);
		return isSameId;
	}

	/** Should the now line be visible? */
	public showNowLineAtBottomOfDay(dayData : DayData) : boolean {
		if (this.api.isBackendOperationRunning) return false;
		if (!dayData.containsToday) return false;
		if (this.firstShiftAfterNow) return false;
		return true;
	}
}
