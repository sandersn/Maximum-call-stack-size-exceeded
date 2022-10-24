var _a, _b, _c, _d, _e, _f;
import { __decorate, __metadata } from "tslib";
import { interval } from 'rxjs';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { BootstrapSize, PAlertThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { FilterService } from '@plano/client/shared/filter.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiService } from '@plano/shared/api';
import { Assertions } from '@plano/shared/core/assertions';
import { Data } from '@plano/shared/core/data/data';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../../shared/core/null-type-utils';
import { sortShiftsForListViewFns } from '../../../api/scheduling-api.utils';
class DayData {
    constructor() {
        this.labels = new Array();
        this.shifts = [];
        this.trackByValue = null;
        this.containsToday = false;
    }
}
let ListViewComponent = class ListViewComponent {
    constructor(api, filterService, pMoment, datePipe) {
        this.api = api;
        this.filterService = filterService;
        this.pMoment = pMoment;
        this.datePipe = datePipe;
        this.startOfDay = null;
        this.calendarMode = null;
        this.shifts = null;
        this.shiftTemplate = null;
        /**
         * If this is true, the shift-items in ui will be just skeletons/placeholders.
         */
        this.delayIsActive = false;
        this.BootstrapSize = BootstrapSize;
        this.PAlertThemeEnum = PAlertThemeEnum;
        this._daysData = new Data(this.api, this.filterService);
        this.firstShiftAfterNow = null;
        this.nowLineUpdateIntervals = {};
    }
    set _startOfDay(input) {
        Assertions.ensureIsDayStart(input);
        this.startOfDay = input;
    }
    ngAfterViewInit() {
    }
    ngOnChanges() {
    }
    /**
     * Array of all timestamps of the days of this date-range based on calendarMode
     */
    get days() {
        if (!this.startOfDay)
            return [];
        let startOfMoment = this.pMoment.m(this.startOfDay).startOf(this.calendarMode);
        const result = [];
        assumeDefinedToGetStrictNullChecksRunning(this.calendarMode, 'this.calendarMode');
        const currentWeek = this.pMoment.m(this.startOfDay).get(this.calendarMode);
        while (startOfMoment.get(this.calendarMode) === currentWeek) {
            result.push(+startOfMoment.startOf('day'));
            startOfMoment = startOfMoment.add(1, 'day');
        }
        return result;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showDayHeader() {
        return this.calendarMode !== CalendarModes.DAY;
    }
    formatDay(timestamp) {
        // get weekday without dot
        let result = this.pMoment.m(timestamp).format('ddd');
        result = result.substring(0, result.length - 1);
        // add date
        result += `, ${this.datePipe.transform(timestamp, 'veryShortDate')}`;
        return result;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get daysData() {
        return this._daysData.get(() => {
            const days = this.days;
            const result = new Array();
            // get shifts for each day
            const daysShifts = new Array();
            for (const day of days) {
                daysShifts.push(this.shifts.getByDay(day).sort(sortShiftsForListViewFns, false).iterable());
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
                    }
                    else { // Otherwise range of several days
                        dayData.labels.push(this.formatDay(days[noShiftsFirstDayIndex]), '-');
                        dayData.labels.push(this.formatDay(days[noShiftsLastDayIndex]));
                    }
                    if (now.isSameOrAfter(days[noShiftsFirstDayIndex], 'day') && now.isSameOrBefore(days[noShiftsLastDayIndex], 'day')) {
                        dayData.containsToday = true;
                    }
                }
                else {
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
    trackByDayData(_index, item) {
        return item.trackByValue;
    }
    updateFirstShiftAfterNow(shifts) {
        var _a;
        const now = Date.now();
        this.firstShiftAfterNow = (_a = shifts.sort((a, b) => {
            if (!a.rawData || !b.rawData) {
                this.clearNowLineUpdateIntervals();
                return 0;
            }
            return a.start - b.start;
        }).find((item) => {
            if (!item.rawData)
                return null;
            return item.start > now;
        })) !== null && _a !== void 0 ? _a : null;
    }
    ngOnDestroy() {
        this.clearNowLineUpdateIntervals();
    }
    clearNowLineUpdateIntervals() {
        var _a;
        for (const key of Object.keys(this.nowLineUpdateIntervals)) {
            (_a = this.nowLineUpdateIntervals[key]) === null || _a === void 0 ? void 0 : _a.unsubscribe();
            this.nowLineUpdateIntervals[key] = undefined;
        }
    }
    /** Should the now line be visible? */
    showNowLine(dayData, shift) {
        if (this.api.isBackendOperationRunning)
            return false;
        if (!dayData.containsToday)
            return false;
        if (this.firstShiftAfterNow === null && !this.nowLineUpdateIntervals[`${dayData.trackByValue}${dayData.shifts.length}`]) {
            this.updateFirstShiftAfterNow(dayData.shifts);
            this.nowLineUpdateIntervals[`${dayData.trackByValue}${dayData.shifts.length}`] = interval(2000).pipe().subscribe(() => {
                this.updateFirstShiftAfterNow(dayData.shifts);
            });
            return false;
        }
        if (this.firstShiftAfterNow === null)
            return false;
        // eslint-disable-next-line sonarjs/prefer-immediate-return
        const isSameId = shift.id.equals(this.firstShiftAfterNow.id);
        return isSameId;
    }
    /** Should the now line be visible? */
    showNowLineAtBottomOfDay(dayData) {
        if (this.api.isBackendOperationRunning)
            return false;
        if (!dayData.containsToday)
            return false;
        if (this.firstShiftAfterNow)
            return false;
        return true;
    }
};
__decorate([
    Input('startOfDay'),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [Number])
], ListViewComponent.prototype, "_startOfDay", null);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ListViewComponent.prototype, "calendarMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ListViewComponent.prototype, "shifts", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ListViewComponent.prototype, "shiftTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ListViewComponent.prototype, "delayIsActive", void 0);
ListViewComponent = __decorate([
    Component({
        selector: 'p-list-view',
        templateUrl: './list-view.component.html',
        styleUrls: ['./list-view.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, typeof (_b = typeof FilterService !== "undefined" && FilterService) === "function" ? _b : Object, typeof (_c = typeof PMomentService !== "undefined" && PMomentService) === "function" ? _c : Object, typeof (_d = typeof PDatePipe !== "undefined" && PDatePipe) === "function" ? _d : Object])
], ListViewComponent);
export { ListViewComponent };
//# sourceMappingURL=list-view.component.js.map