var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { RightsService } from '@plano/client/accesscontrol/rights.service';
import { CalenderTimelineLayoutService } from '@plano/client/scheduling/shared/p-scheduling-calendar/calender-timeline-layout.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../shared/core/null-type-utils';
import { SchedulingApiService } from '../../api/scheduling-api.service';
import { PCalendarService } from '../p-calendar.service';
let CalendarWeekdaysBarComponent = class CalendarWeekdaysBarComponent {
    constructor(layout, api, pCalendarService, pMoment, rightsService) {
        this.layout = layout;
        this.api = api;
        this.pCalendarService = pCalendarService;
        this.pMoment = pMoment;
        this.rightsService = rightsService;
        this.timelineMode = false;
        this.dayClick = new EventEmitter();
        this.neverShowDayTools = true;
        this.shifts = null;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    showTitleForWeekday(weekday) {
        if (!this.timelineMode)
            return true;
        if (this.layout.getLayout(weekday).show)
            return true;
        return false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get weekdays() {
        const result = [];
        for (let i = 0; i < 7; i++) {
            const dayTimestamp = this.weekStart.add(i, 'day').valueOf();
            result.push(dayTimestamp);
        }
        return result;
    }
    get weekStart() {
        return this.pMoment.m(this.timestamp).startOf('isoWeek');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    shiftsOfDay(timestamp) {
        assumeDefinedToGetStrictNullChecksRunning(this.shifts, 'this.shifts');
        return this.shifts.getByDay(timestamp);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    pinStickyNote(timestamp) {
        if (!this.pCalendarService.hasImportantNoteForDay(timestamp, false))
            return false;
        return true;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarWeekdaysBarComponent.prototype, "timestamp", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarWeekdaysBarComponent.prototype, "timelineMode", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], CalendarWeekdaysBarComponent.prototype, "dayClick", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarWeekdaysBarComponent.prototype, "neverShowDayTools", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarWeekdaysBarComponent.prototype, "shifts", void 0);
CalendarWeekdaysBarComponent = __decorate([
    Component({
        selector: 'p-calendar-weekdays-bar[timestamp]',
        templateUrl: './calendar-weekdays-bar.component.html',
        styleUrls: ['./calendar-weekdays-bar.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [CalenderTimelineLayoutService,
        SchedulingApiService,
        PCalendarService, typeof (_a = typeof PMomentService !== "undefined" && PMomentService) === "function" ? _a : Object, typeof (_b = typeof RightsService !== "undefined" && RightsService) === "function" ? _b : Object])
], CalendarWeekdaysBarComponent);
export { CalendarWeekdaysBarComponent };
//# sourceMappingURL=calendar-weekdays-bar.component.js.map