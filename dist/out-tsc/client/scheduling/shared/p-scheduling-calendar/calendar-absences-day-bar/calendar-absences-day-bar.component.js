import { __decorate, __metadata } from "tslib";
import { NgxPopperjsPlacements } from 'ngx-popperjs';
import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { CalenderAllDayItemLayoutService } from '@plano/client/scheduling/shared/p-scheduling-calendar/calender-all-day-item-layout.service';
import { SchedulingApiAbsences, SchedulingApiHolidays } from '@plano/shared/api';
import { SchedulingApiBirthdays } from '../../api/scheduling-api-birthday.service';
let CalendarAbsencesDayBarComponent = class CalendarAbsencesDayBarComponent {
    constructor(layoutService, schedulingService) {
        this.layoutService = layoutService;
        this.schedulingService = schedulingService;
        /**
         * Height of one line
         * @return height in px
         */
        this.heightOfLine = 24;
        this.readMode = false;
        this.absences = new SchedulingApiAbsences(null, false);
        this.holidays = new SchedulingApiHolidays(null, false);
        this.birthdays = new SchedulingApiBirthdays(null, null, false);
        this.NgxPopperjsPlacements = NgxPopperjsPlacements;
    }
    /**
     * Height of this list in px
     * @return height in px
     */
    get height() {
        const maxPosIndex = this.layoutService.getMaxPosIndex(this.startOfDay);
        return (maxPosIndex + 1) * this.heightOfLine;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarAbsencesDayBarComponent.prototype, "startOfDay", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarAbsencesDayBarComponent.prototype, "readMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarAbsencesDayBarComponent.prototype, "absences", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarAbsencesDayBarComponent.prototype, "holidays", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarAbsencesDayBarComponent.prototype, "birthdays", void 0);
__decorate([
    HostBinding('style.height.px'),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], CalendarAbsencesDayBarComponent.prototype, "height", null);
CalendarAbsencesDayBarComponent = __decorate([
    Component({
        selector: 'p-calendar-absences-day-bar[startOfDay]',
        templateUrl: './calendar-absences-day-bar.component.html',
        styleUrls: ['./calendar-absences-day-bar.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [CalenderAllDayItemLayoutService,
        SchedulingService])
], CalendarAbsencesDayBarComponent);
export { CalendarAbsencesDayBarComponent };
//# sourceMappingURL=calendar-absences-day-bar.component.js.map