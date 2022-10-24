var _a;
import { __decorate, __metadata } from "tslib";
import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { CalenderAllDayItemLayoutService } from '../calender-all-day-item-layout.service';
import { CalenderTimelineLayoutService } from '../calender-timeline-layout.service';
let CalendarAbsencesWeekBarComponent = class CalendarAbsencesWeekBarComponent {
    constructor(layout, layoutService, pMoment) {
        this.layout = layout;
        this.layoutService = layoutService;
        this.pMoment = pMoment;
        /**
         * Height of one line
         * @return height in px
         */
        this.heightOfLine = 24;
        // @Input() public timelineMode : boolean = false;
        this.readMode = false;
    }
    /**
     * Height of this list in px
     * @return height in px
     */
    get height() {
        let maxHeightOfWeek = 0;
        for (const weekday of this.weekdays) {
            const heightOfDay = this.layoutService.getMaxPosIndex(weekday);
            if (heightOfDay > maxHeightOfWeek) {
                maxHeightOfWeek = heightOfDay;
            }
        }
        return (maxHeightOfWeek + 1) * this.heightOfLine;
    }
    get weekStart() {
        return this.pMoment.m(this.timestamp).startOf('isoWeek');
    }
    /** Weekdays as array of timestamps */
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
    __metadata("design:type", Object)
], CalendarAbsencesWeekBarComponent.prototype, "absences", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarAbsencesWeekBarComponent.prototype, "holidays", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarAbsencesWeekBarComponent.prototype, "birthdays", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarAbsencesWeekBarComponent.prototype, "timestamp", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarAbsencesWeekBarComponent.prototype, "readMode", void 0);
__decorate([
    HostBinding('style.height.px'),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], CalendarAbsencesWeekBarComponent.prototype, "height", null);
CalendarAbsencesWeekBarComponent = __decorate([
    Component({
        selector: 'p-calendar-absences-week-bar[absences][holidays][birthdays][timestamp]',
        templateUrl: './calendar-absences-week-bar.component.html',
        styleUrls: ['./calendar-absences-week-bar.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [CalenderTimelineLayoutService,
        CalenderAllDayItemLayoutService, typeof (_a = typeof PMomentService !== "undefined" && PMomentService) === "function" ? _a : Object])
], CalendarAbsencesWeekBarComponent);
export { CalendarAbsencesWeekBarComponent };
//# sourceMappingURL=calendar-absences-week-bar.component.js.map