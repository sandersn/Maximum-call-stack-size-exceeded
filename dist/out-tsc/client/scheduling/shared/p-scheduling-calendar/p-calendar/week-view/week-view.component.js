var _a, _b, _c, _d, _e, _f, _g;
import { __decorate, __metadata } from "tslib";
import { Component, Input, Output, EventEmitter, NgZone, ElementRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiShifts, SchedulingApiService } from '@plano/shared/api';
let WeekViewComponent = class WeekViewComponent {
    constructor(zone, pMoment, api) {
        this.zone = zone;
        this.pMoment = pMoment;
        this.api = api;
        this.viewDate = null;
        this.onShiftClick = new EventEmitter();
        this.shiftTemplate = null;
        this.readMode = false;
        this.checkTouched = false;
        this.today = +this.pMoment.m().startOf('day');
    }
    ngAfterViewInit() {
        this.scrollToStartOfWorkday();
    }
    scrollToStartOfWorkday() {
        this.zone.runOutsideAngular(() => {
            requestAnimationFrame(() => {
                const el = this.startOfWorkday.nativeElement;
                el.scrollIntoView();
            });
        });
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get weekdays() {
        const result = [];
        for (let i = 0; i < 7; i++) {
            const dayTimestamp = this.pMoment.m(this.viewDate).startOf('isoWeek').add(i, 'day').valueOf();
            result.push(dayTimestamp);
        }
        return result;
    }
    /**
     * Get all absences for the selected date
     */
    absencesOfDay(timestamp) {
        return this.absences.getByDay(timestamp);
    }
    /**
     * Get all holidays for the selected date
     */
    holidaysOfDay(timestamp) {
        return this.holidays.getByDay(timestamp);
    }
    /**
     * Get all birthdays for the selected date
     */
    birthdaysOfDay(timestamp) {
        return this.birthdays.getByDay(timestamp);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    isBeforeToday(startOfDay) {
        return this.pMoment.m(startOfDay).isBefore(this.today);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], WeekViewComponent.prototype, "viewDate", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_d = typeof SchedulingApiShifts !== "undefined" && SchedulingApiShifts) === "function" ? _d : Object)
], WeekViewComponent.prototype, "shifts", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], WeekViewComponent.prototype, "absences", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], WeekViewComponent.prototype, "holidays", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], WeekViewComponent.prototype, "birthdays", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_e = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _e : Object)
], WeekViewComponent.prototype, "onShiftClick", void 0);
__decorate([
    ViewChild('startOfWorkday', { static: true }),
    __metadata("design:type", typeof (_f = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _f : Object)
], WeekViewComponent.prototype, "startOfWorkday", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], WeekViewComponent.prototype, "shiftTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], WeekViewComponent.prototype, "readMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], WeekViewComponent.prototype, "checkTouched", void 0);
WeekViewComponent = __decorate([
    Component({
        selector: 'p-week-view[absences][shifts]',
        templateUrl: './week-view.component.html',
        styleUrls: ['./week-view.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof NgZone !== "undefined" && NgZone) === "function" ? _a : Object, typeof (_b = typeof PMomentService !== "undefined" && PMomentService) === "function" ? _b : Object, typeof (_c = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _c : Object])
], WeekViewComponent);
export { WeekViewComponent };
//# sourceMappingURL=week-view.component.js.map