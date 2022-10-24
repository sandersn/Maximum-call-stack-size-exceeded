var _a, _b, _c, _d, _e, _f, _g;
import { __decorate, __metadata, __param } from "tslib";
import { CalendarMonthViewComponent, CalendarUtils, DateAdapter } from 'angular-calendar';
import { SlicePipe } from '@angular/common';
import { Component, ChangeDetectorRef, LOCALE_ID, Inject, ChangeDetectionStrategy } from '@angular/core';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
let PCalendarMonthViewComponent = class PCalendarMonthViewComponent extends CalendarMonthViewComponent {
    constructor(
    // private api : SchedulingApiService,
    cdr, utils, locale, dateAdapter, highlightService, slicePipe, pMoment) {
        super(cdr, utils, locale, dateAdapter);
        this.cdr = cdr;
        this.utils = utils;
        this.locale = locale;
        this.dateAdapter = dateAdapter;
        this.highlightService = highlightService;
        this.slicePipe = slicePipe;
        this.pMoment = pMoment;
        // this.subscription = this.api.onDataLoaded.subscribe(() =>
        // {
        // 	// On every load the month-view should be load incrementally row by row.
        // 	// But as the data of the pFor is not changing when a load operation happens we have to force a rebuild of
        // 	// the pFor.
        // 	// this.monthViewRowsPFor.clearViews();
        // });
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    onClick() {
        // HACK: PLANO-16262 click on mwl-calendar-month-cell somehow prevents triggering the click listener on p-calendar
        this.highlightService.setHighlighted(null);
    }
    ngOnDestroy() {
        // this.subscription?.unsubscribe();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    slicedDays(rowIndex) {
        // Assertions.ensureIsDayStart(this.view.days[0].date.getTime());
        const lastDayInRowIndex = rowIndex + (this.view.totalDaysVisibleInWeek);
        const result = this.slicePipe.transform(this.view.days, rowIndex, lastDayInRowIndex);
        for (const day of result) {
            const dayStart = +this.pMoment.m(day.date.getTime()).startOf('day');
            day.date.setTime(dayStart);
        }
        return result;
    }
};
PCalendarMonthViewComponent = __decorate([
    Component({
        selector: 'p-calendar-month-view',
        templateUrl: './p-calendar-month-view.component.html',
        styleUrls: ['./p-calendar-month-view.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __param(2, Inject(LOCALE_ID)),
    __metadata("design:paramtypes", [typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object, typeof (_b = typeof CalendarUtils !== "undefined" && CalendarUtils) === "function" ? _b : Object, typeof (_c = typeof PSupportedLocaleIds !== "undefined" && PSupportedLocaleIds) === "function" ? _c : Object, typeof (_d = typeof DateAdapter !== "undefined" && DateAdapter) === "function" ? _d : Object, typeof (_e = typeof HighlightService !== "undefined" && HighlightService) === "function" ? _e : Object, typeof (_f = typeof SlicePipe !== "undefined" && SlicePipe) === "function" ? _f : Object, typeof (_g = typeof PMomentService !== "undefined" && PMomentService) === "function" ? _g : Object])
], PCalendarMonthViewComponent);
export { PCalendarMonthViewComponent };
//# sourceMappingURL=p-calendar-month-view.component.js.map