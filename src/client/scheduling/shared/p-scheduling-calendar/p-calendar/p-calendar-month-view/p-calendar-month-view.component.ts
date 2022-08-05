import { CalendarMonthViewComponent, CalendarUtils, DateAdapter } from 'angular-calendar';
import { MonthViewDay } from 'calendar-utils';
import { SlicePipe } from '@angular/common';
import { OnDestroy} from '@angular/core';
import { Component, ChangeDetectorRef, LOCALE_ID, Inject, ChangeDetectionStrategy } from '@angular/core';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';

@Component({
	selector: 'p-calendar-month-view',
	templateUrl: './p-calendar-month-view.component.html',
	styleUrls: ['./p-calendar-month-view.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PCalendarMonthViewComponent extends CalendarMonthViewComponent implements OnDestroy {
// eslint-disable-next-line jsdoc/require-jsdoc
	public onClick() : void {
		// HACK: PLANO-16262 click on mwl-calendar-month-cell somehow prevents triggering the click listener on p-calendar
		this.highlightService.setHighlighted(null);
	}

	constructor(
		// private api : SchedulingApiService,
		public override cdr : ChangeDetectorRef,
		public override utils : CalendarUtils,
		@Inject(LOCALE_ID) public override locale : PSupportedLocaleIds,
		public override dateAdapter : DateAdapter,
		private highlightService : HighlightService,
		private slicePipe : SlicePipe,
		private pMoment : PMomentService,
	) {
		super(cdr, utils, locale, dateAdapter);

		// this.subscription = this.api.onDataLoaded.subscribe(() =>
		// {
		// 	// On every load the month-view should be load incrementally row by row.
		// 	// But as the data of the pFor is not changing when a load operation happens we have to force a rebuild of
		// 	// the pFor.
		// 	// this.monthViewRowsPFor.clearViews();
		// });
	}

	public override ngOnDestroy() : void {
		// this.subscription?.unsubscribe();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public slicedDays(rowIndex : number) : MonthViewDay[] {
		// Assertions.ensureIsDayStart(this.view.days[0].date.getTime());
		const lastDayInRowIndex = rowIndex + (this.view.totalDaysVisibleInWeek);
		const result = this.slicePipe.transform(this.view.days, rowIndex, lastDayInRowIndex);
		for (const day of result) {
			const dayStart = +this.pMoment.m(day.date.getTime()).startOf('day');
			day.date.setTime(dayStart);
		}
		return result;
	}
}
