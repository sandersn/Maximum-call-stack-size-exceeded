var _a, _b;
import { __decorate, __metadata } from "tslib";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { CalenderTimelineLayoutService } from '@plano/client/scheduling/shared/p-scheduling-calendar/calender-timeline-layout.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
let CalendarMonthWeekdaysBarComponent = class CalendarMonthWeekdaysBarComponent {
    constructor(layout, pMoment) {
        this.layout = layout;
        this.pMoment = pMoment;
        this.onDayClick = new EventEmitter();
    }
    get weekStart() {
        return this.pMoment.m(this.timestamp).startOf('isoWeek');
    }
    /**
     * Weekdays as array of timestamps of the start of each day
     */
    get weekdays() {
        const result = [];
        for (let i = 0; i < 7; i++) {
            const dayTimestamp = this.weekStart.add(i, 'day').valueOf();
            result.push(dayTimestamp);
        }
        return result;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarMonthWeekdaysBarComponent.prototype, "timestamp", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_b = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _b : Object)
], CalendarMonthWeekdaysBarComponent.prototype, "onDayClick", void 0);
CalendarMonthWeekdaysBarComponent = __decorate([
    Component({
        selector: 'p-calendar-month-weekdays-bar[timestamp]',
        templateUrl: './calendar-month-weekdays-bar.component.html',
        styleUrls: ['./calendar-month-weekdays-bar.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [CalenderTimelineLayoutService, typeof (_a = typeof PMomentService !== "undefined" && PMomentService) === "function" ? _a : Object])
], CalendarMonthWeekdaysBarComponent);
export { CalendarMonthWeekdaysBarComponent };
//# sourceMappingURL=calendar-month-weekdays-bar.component.js.map