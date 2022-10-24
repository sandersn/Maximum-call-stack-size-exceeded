var _a;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingApiService } from '@plano/shared/api';
import { CalenderTimelineLayoutService } from '../calender-timeline-layout.service';
let CalendarWeekdayBarComponent = class CalendarWeekdayBarComponent {
    constructor(layout, api) {
        this.layout = layout;
        this.api = api;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    showThisShiftModelParent(parentName) {
        return this.layout.getLayout(parentName).show;
    }
};
CalendarWeekdayBarComponent = __decorate([
    Component({
        selector: 'p-calendar-weekday-bar',
        templateUrl: './calendar-weekday-bar.component.html',
        styleUrls: ['./calendar-weekday-bar.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [CalenderTimelineLayoutService, typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object])
], CalendarWeekdayBarComponent);
export { CalendarWeekdayBarComponent };
//# sourceMappingURL=calendar-weekday-bar.component.js.map