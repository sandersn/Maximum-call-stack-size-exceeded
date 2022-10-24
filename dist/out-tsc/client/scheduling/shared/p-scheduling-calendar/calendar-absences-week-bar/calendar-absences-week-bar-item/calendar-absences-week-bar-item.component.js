var _a;
import { __decorate, __metadata } from "tslib";
import { NgxPopperjsPlacements } from 'ngx-popperjs';
import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { CalenderTimelineLayoutService } from '../../calender-timeline-layout.service';
let CalendarAbsencesWeekBarItemComponent = class CalendarAbsencesWeekBarItemComponent {
    constructor(layout, highlightService) {
        this.layout = layout;
        this.highlightService = highlightService;
        /**
         * Height of one line
         * @return height in px
         */
        this.heightOfLine = 24;
        this.readMode = false;
        this._alwaysTrue = true;
        this._styleBottom = '0px';
        this._styleHeight = '2em';
        this.NgxPopperjsPlacements = NgxPopperjsPlacements;
    }
    get _styleLeft() {
        return `${this.layout.getLayout(this.weekday).x}px`;
    }
    get _styleTop() {
        return `${this.layout.getLayout(this.weekday).y}px`;
    }
    /**
     * Calculate the css z-index for this item
     */
    get _styleZIndex() {
        const highlightedAbsence = this.absencesOfDay(this.weekday).findBy(item => this.highlightService.isHighlighted(item, this.weekday));
        if (!!highlightedAbsence)
            return 1020;
        const highlightedHoliday = this.holidaysOfDay(this.weekday).findBy(item => this.highlightService.isHighlighted(item, this.weekday));
        if (!!highlightedHoliday)
            return 1020;
        const highlightedBirthday = this.birthdaysOfDay(this.weekday).findBy(item => this.highlightService.isHighlighted(item, this.weekday));
        if (!!highlightedBirthday)
            return 1020;
        return 0;
    }
    get _styleWidth() {
        return this.layout.getLayout(this.weekday).width;
    }
    /**
     * Get all absences for the selected date
     */
    absencesOfDay(weekday) {
        const timestamp = weekday;
        return this._absences.getByDay(timestamp);
    }
    /**
     * Get all holidays for the selected date
     */
    holidaysOfDay(weekday) {
        const timestamp = weekday;
        return this._holidays.getByDay(timestamp);
    }
    /**
     * Get all birthdays for the selected date
     */
    birthdaysOfDay(weekday) {
        const timestamp = weekday;
        return this._birthdays.getByDay(timestamp);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarAbsencesWeekBarItemComponent.prototype, "weekday", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarAbsencesWeekBarItemComponent.prototype, "heightOfLine", void 0);
__decorate([
    Input('absences'),
    __metadata("design:type", Object)
], CalendarAbsencesWeekBarItemComponent.prototype, "_absences", void 0);
__decorate([
    Input('holidays'),
    __metadata("design:type", Object)
], CalendarAbsencesWeekBarItemComponent.prototype, "_holidays", void 0);
__decorate([
    Input('birthdays'),
    __metadata("design:type", Object)
], CalendarAbsencesWeekBarItemComponent.prototype, "_birthdays", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarAbsencesWeekBarItemComponent.prototype, "readMode", void 0);
__decorate([
    HostBinding('class.position-absolute'),
    __metadata("design:type", Object)
], CalendarAbsencesWeekBarItemComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    HostBinding('style.bottom'),
    __metadata("design:type", String)
], CalendarAbsencesWeekBarItemComponent.prototype, "_styleBottom", void 0);
__decorate([
    HostBinding('style.height'),
    __metadata("design:type", String)
], CalendarAbsencesWeekBarItemComponent.prototype, "_styleHeight", void 0);
__decorate([
    HostBinding('style.left'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], CalendarAbsencesWeekBarItemComponent.prototype, "_styleLeft", null);
__decorate([
    HostBinding('style.top'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], CalendarAbsencesWeekBarItemComponent.prototype, "_styleTop", null);
__decorate([
    HostBinding('style.z-index'),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], CalendarAbsencesWeekBarItemComponent.prototype, "_styleZIndex", null);
__decorate([
    HostBinding('style.width.px'),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], CalendarAbsencesWeekBarItemComponent.prototype, "_styleWidth", null);
CalendarAbsencesWeekBarItemComponent = __decorate([
    Component({
        selector: 'p-calendar-absences-week-bar-item[absences][holidays][birthdays][weekday]',
        templateUrl: './calendar-absences-week-bar-item.component.html',
        styleUrls: ['./calendar-absences-week-bar-item.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [CalenderTimelineLayoutService, typeof (_a = typeof HighlightService !== "undefined" && HighlightService) === "function" ? _a : Object])
], CalendarAbsencesWeekBarItemComponent);
export { CalendarAbsencesWeekBarItemComponent };
//# sourceMappingURL=calendar-absences-week-bar-item.component.js.map