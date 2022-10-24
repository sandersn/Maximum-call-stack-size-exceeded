var PSchedulingCalendarComponent_1;
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
import { __decorate, __metadata } from "tslib";
import { DAYS_OF_WEEK } from 'calendar-utils';
import { getWeekOfMonth } from 'date-fns';
import * as moment from 'moment-timezone';
import { Subject } from 'rxjs';
import { Component, Input, HostListener, ChangeDetectionStrategy, Output, EventEmitter, ViewEncapsulation, ChangeDetectorRef, forwardRef, NgZone, ViewChild, ElementRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiService, SchedulingApiHolidays, SchedulingApiShifts, SchedulingApiAbsences } from '@plano/shared/api';
import { Assertions } from '@plano/shared/core/assertions';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../shared/core/null-type-utils';
import { SchedulingApiBirthdays } from '../../api/scheduling-api-birthday.service';
import { PCalendarShiftStyle, ShiftItemViewStyles } from '../p-shift-item-module/shift-item/shift-item-styles';
let PSchedulingCalendarComponent = PSchedulingCalendarComponent_1 = class PSchedulingCalendarComponent {
    constructor(api, highlightService, console, changeDetectorRef, pMoment, zone) {
        this.api = api;
        this.highlightService = highlightService;
        this.console = console;
        this.changeDetectorRef = changeDetectorRef;
        this.pMoment = pMoment;
        this.zone = zone;
        this.isLoading = false;
        this.calendarMode = CalendarModes.MONTH;
        this.showAsList = false;
        this._neverShowDayTools = false;
        this.shiftStyle = PCalendarShiftStyle.FULL;
        this.multiSelect = false;
        this.absences = new SchedulingApiAbsences(null, false);
        this.holidays = new SchedulingApiHolidays(null, false);
        this.birthdays = new SchedulingApiBirthdays(null, null, false);
        this.ShiftItemViewStyles = ShiftItemViewStyles;
        this.dayClick = new EventEmitter();
        this.onShiftClick = new EventEmitter();
        /**
         * With this boolean the multi-select checkboxes can be turned off for all shifts
         */
        this.shiftIsSelectable = false;
        this.CONFIG = Config;
        this.shiftTemplate = null;
        this.startOfMonth = null;
        this.endOfMonth = null;
        this.apiLoadSubscription = null;
        this.BootstrapSize = BootstrapSize;
        this.CalendarModes = CalendarModes;
        this.delayIsActiveStore = {};
        this.ngUnsubscribe = new Subject();
        /**
         * The following code is for the case that this is a shiftPicker
         */
        /**
         * This is the minimum code that is required for a custom control in Angular.
         * Its necessary to make [(ngModel)] and [formControl] work.
         */
        this.disabled = false;
        this.formControl = null;
        this._value = null;
        this.onChange = () => { };
        /** onTouched */
        this.onTouched = () => { };
        if (!this.selectedStartOfDay)
            this.selectedStartOfDay = +this.pMoment.m().startOf('day');
        moment.updateLocale(Config.getLanguageCode(Config.LOCALE_ID), {
            week: {
                dow: DAYS_OF_WEEK.MONDAY,
                doy: 0,
            },
        });
        this.today = +this.pMoment.m().startOf('day');
        this.apiLoadSubscription = this.api.onDataLoaded.subscribe(() => {
            this.startOfMonth = +this.pMoment.m(this.selectedStartOfDay).startOf(this.calendarMode);
            this.endOfMonth = +this.pMoment.m(this.selectedStartOfDay).endOf(this.calendarMode);
        });
    }
    /**
     * CalendarMonthViewComponent needs in in date format
     */
    get selectedStartOfDayAsDate() {
        return new Date(this.selectedStartOfDay);
    }
    set _selectedStartOfDay(input) {
        Assertions.ensureIsDayStart(input);
        this.selectedStartOfDay = input;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    neverShowDayTools(day) {
        if (this._neverShowDayTools === true)
            return true;
        if (this.isOutsideCurrentMonth(+day.date))
            return true;
        return false;
    }
    onClick() {
        this.highlightService.setHighlighted(null);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    resetDelayIsActiveStore() {
        this.delayIsActiveStore = {};
        this.changeDetectorRef.markForCheck();
    }
    /**
     * It was so slow to render the month view if there are a lot of shifts, that we invented this hack…
     * After data is loaded we immediately show the content for the first week, but…
     * most likely the other weeks are not visible yet. They are outside the scroll-area. So we fill these areas with
     * skeletons, and fill these skeletons with content week by week.
     */
    delayIsActive(day) {
        const date = typeof day === 'number' ? new Date(day) : day.date;
        const weekInMonth = getWeekOfMonth(date, { weekStartsOn: 1 });
        if (weekInMonth === 1)
            return false;
        if (this.delayIsActiveStore[weekInMonth] === undefined) {
            this.delayIsActiveStore[weekInMonth] = true;
            this.changeDetectorRef.markForCheck();
            window.setTimeout(() => {
                this.delayIsActiveStore[weekInMonth] = false;
                this.changeDetectorRef.markForCheck();
            }, 0);
            return true;
        }
        else {
            const result = this.delayIsActiveStore[weekInMonth];
            assumeDefinedToGetStrictNullChecksRunning(result, 'result');
            return result;
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    scrollToTop() {
        this.zone.runOutsideAngular(() => {
            requestAnimationFrame(() => {
                if (!this.topAnchor)
                    return;
                // In case of showAsList, other components will handle the scroll
                if (!this.showAsList)
                    return;
                const el = this.topAnchor.nativeElement;
                el.scrollIntoView();
            });
        });
    }
    ngOnInit() {
        this.initNeverShowDayTools();
    }
    initNeverShowDayTools() {
        switch (this.shiftStyle) {
            case PCalendarShiftStyle.OVERVIEW:
            case PCalendarShiftStyle.SHIFT_PICKER:
                this._neverShowDayTools = true;
                break;
            case PCalendarShiftStyle.FULL:
                this._neverShowDayTools = false;
                break;
            default:
                const RESULT = this.shiftStyle;
                throw new Error(RESULT);
        }
    }
    /**
     * If this calendar is in month mode - in wich mode should the shifts be viewed?
     */
    get monthShiftStyle() {
        switch (this.shiftStyle) {
            case PCalendarShiftStyle.SHIFT_PICKER:
                if (this.multiSelect)
                    return ShiftItemViewStyles.MULTI_SELECT;
                return ShiftItemViewStyles.SMALL;
            case PCalendarShiftStyle.OVERVIEW:
            case PCalendarShiftStyle.FULL:
                return ShiftItemViewStyles.SMALL;
        }
    }
    /**
     * If this calendar is in week mode - in wich mode should the shifts be viewed?
     */
    get weekShiftStyle() {
        switch (this.shiftStyle) {
            case PCalendarShiftStyle.SHIFT_PICKER:
                if (this.multiSelect)
                    return ShiftItemViewStyles.MULTI_SELECT;
                return this.ShiftItemViewStyles.SMALL;
            case PCalendarShiftStyle.OVERVIEW:
            case PCalendarShiftStyle.FULL:
                return ShiftItemViewStyles.SMALL;
        }
    }
    /**
     * If this calendar is in day mode - in wich mode should the shifts be viewed?
     */
    get dayShiftStyle() {
        switch (this.shiftStyle) {
            case PCalendarShiftStyle.SHIFT_PICKER:
                if (this.multiSelect)
                    return ShiftItemViewStyles.MEDIUM_MULTI_SELECT;
                return ShiftItemViewStyles.MEDIUM;
            case PCalendarShiftStyle.OVERVIEW:
            case PCalendarShiftStyle.FULL:
                return ShiftItemViewStyles.DETAILED;
        }
    }
    /**
     * Smartphone users get a simpler list-mode then desktop users.
     * E.g.
     * Smartphone week: All days in on column
     * Desktop week: All days in a row
     */
    get simpleListMode() {
        if (Config.IS_MOBILE)
            return true;
        if (this.calendarMode === CalendarModes.DAY && this.dayShiftStyle === ShiftItemViewStyles.MEDIUM)
            return true;
        // if (this.showAsList) {
        // 	if (this.calendarMode !== CalendarModes.WEEK && this.calendarMode !== CalendarModes.MONTH) return true;
        // }
        return false;
    }
    /**
     * Destroy
     */
    ngOnDestroy() {
        var _a;
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        (_a = this.apiLoadSubscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        // window.clearInterval(this.interval ?? undefined);
        if (this.api.isLoaded()) {
            this.api.data.shifts.setSelected(false);
        }
    }
    /**
     * Highlight selected Day
     */
    beforeMonthViewRender({ body }) {
        for (const day of body) {
            if (this.pMoment.m(day.date).format('DD.MM.YYYY') === this.pMoment.m(this.selectedStartOfDay).format('DD.MM.YYYY')) {
                day.cssClass = 'cal-day-selected';
            }
            else {
                day.cssClass = '';
            }
        }
    }
    /**
     * on day click emit event if there is a (dayClick)="…" binding
     * else just refresh the internal selectedStartOfDay
     */
    onDayClick(timestamp) {
        if (this.dayClick.observers.length) {
            this.dayClick.emit(timestamp);
        }
        else {
            this.selectedStartOfDay = timestamp;
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onSelectedChange(shift) {
        if (this.shiftStyle !== PCalendarShiftStyle.SHIFT_PICKER)
            return;
        if (shift.selected) {
            this.api.deselectAllSelections();
            shift.selected = true;
            this.value = shift.id;
            return;
        }
        this.api.deselectAllSelections();
        this.value = null;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    markShiftItemAsSelected(shift) {
        if (this.shiftStyle !== PCalendarShiftStyle.SHIFT_PICKER)
            return false;
        if (!this.value)
            return false;
        return shift.selected;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get readMode() {
        return this.shiftStyle === PCalendarShiftStyle.SHIFT_PICKER;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    isBeforeToday(startOfDay) {
        return this.pMoment.m(startOfDay).isBefore(this.today);
    }
    isOutsideCurrentMonth(start) {
        const end = start + 1;
        if (this.startOfMonth !== null && this.startOfMonth >= end)
            return true;
        if (this.endOfMonth === null || this.endOfMonth < start) {
            // HACK: endOfMonth should never be less then selectedStartOfDay
            if (this.endOfMonth === null || this.endOfMonth < this.selectedStartOfDay) {
                this.console.warn('endOfMonth should never be less then selectedStartOfDay');
                this.startOfMonth = +this.pMoment.m(this.selectedStartOfDay).startOf(this.calendarMode);
                this.endOfMonth = +this.pMoment.m(this.selectedStartOfDay).endOf(this.calendarMode);
            }
            return true;
        }
        return false;
    }
    /** the value of this control */
    get value() { return this._value; }
    set value(value) {
        if (value === this._value)
            return;
        this._value = value;
        this.onChange(value);
    }
    /** Write a new value to the element. */
    writeValue(value) {
        if (this._value === value)
            return;
        this._value = value;
        this.changeDetectorRef.detectChanges();
    }
    /**
     * @see ControlValueAccessor['registerOnChange']
     *
     * Note that registerOnChange() only gets called if a formControl is bound.
     * @param fn Accepts a callback function which you can call when changes happen so that you can notify the outside world that
     * the data model has changed.
     * Note that you call it with the changed data model value.
     */
    registerOnChange(fn) { this.onChange = fn; }
    /** Set the function to be called when the control receives a touch event. */
    registerOnTouched(fn) { this.onTouched = fn; }
    /** setDisabledState */
    setDisabledState(isDisabled) {
        if (this.disabled === isDisabled)
            return;
        // Set internal attribute which gets used in the template.
        this.disabled = isDisabled;
        // Refresh the formControl. #two-way-binding
        if (this.formControl && this.formControl.disabled !== this.disabled) {
            this.disabled ? this.formControl.disable() : this.formControl.enable();
        }
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PSchedulingCalendarComponent.prototype, "isLoading", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_g = typeof SchedulingApiShifts !== "undefined" && SchedulingApiShifts) === "function" ? _g : Object)
], PSchedulingCalendarComponent.prototype, "shifts", void 0);
__decorate([
    Input('selectedStartOfDay'),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [Number])
], PSchedulingCalendarComponent.prototype, "_selectedStartOfDay", null);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PSchedulingCalendarComponent.prototype, "calendarMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PSchedulingCalendarComponent.prototype, "showAsList", void 0);
__decorate([
    Input('neverShowDayTools'),
    __metadata("design:type", Boolean)
], PSchedulingCalendarComponent.prototype, "_neverShowDayTools", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], PSchedulingCalendarComponent.prototype, "shiftStyle", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PSchedulingCalendarComponent.prototype, "multiSelect", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PSchedulingCalendarComponent.prototype, "absences", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PSchedulingCalendarComponent.prototype, "holidays", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PSchedulingCalendarComponent.prototype, "birthdays", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_h = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _h : Object)
], PSchedulingCalendarComponent.prototype, "dayClick", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_j = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _j : Object)
], PSchedulingCalendarComponent.prototype, "onShiftClick", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PSchedulingCalendarComponent.prototype, "shiftIsSelectable", void 0);
__decorate([
    HostListener('click'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PSchedulingCalendarComponent.prototype, "onClick", null);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PSchedulingCalendarComponent.prototype, "shiftTemplate", void 0);
__decorate([
    ViewChild('topAnchor', { static: false }),
    __metadata("design:type", typeof (_l = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _l : Object)
], PSchedulingCalendarComponent.prototype, "topAnchor", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PSchedulingCalendarComponent.prototype, "disabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PSchedulingCalendarComponent.prototype, "formControl", void 0);
PSchedulingCalendarComponent = PSchedulingCalendarComponent_1 = __decorate([
    Component({
        selector: 'p-calendar[shifts]',
        templateUrl: './p-calendar.component.html',
        styleUrls: ['./p-calendar.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        encapsulation: ViewEncapsulation.None,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PSchedulingCalendarComponent_1),
                multi: true,
            },
        ],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, typeof (_b = typeof HighlightService !== "undefined" && HighlightService) === "function" ? _b : Object, typeof (_c = typeof LogService !== "undefined" && LogService) === "function" ? _c : Object, typeof (_d = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _d : Object, typeof (_e = typeof PMomentService !== "undefined" && PMomentService) === "function" ? _e : Object, typeof (_f = typeof NgZone !== "undefined" && NgZone) === "function" ? _f : Object])
], PSchedulingCalendarComponent);
export { PSchedulingCalendarComponent };
//# sourceMappingURL=p-calendar.component.js.map