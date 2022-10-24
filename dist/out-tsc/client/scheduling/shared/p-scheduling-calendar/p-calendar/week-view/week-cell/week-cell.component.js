var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { interval } from 'rxjs';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { SchedulingApiShifts } from '@plano/shared/api';
import { PMomentService } from '../../../../../../shared/p-moment.service';
let WeekCellComponent = class WeekCellComponent {
    constructor(pMomentService) {
        this.pMomentService = pMomentService;
        this.onShiftClick = new EventEmitter();
        this.shiftTemplate = null;
        this.readMode = false;
        this.isLoading = false;
        this.BootstrapSize = BootstrapSize;
        this.firstShiftAfterNow = null;
        this.nowLineUpdateIntervals = {};
        this.now = +this.pMomentService.m();
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
    /** Should the now line be visible? */
    showNowLine(shift) {
        if (!this.isToday(this.weekday))
            return false;
        if (this.firstShiftAfterNow === null && !this.nowLineUpdateIntervals[`${this.weekday}${this.shifts.length}`]) {
            this.updateFirstShiftAfterNow(this.shifts.iterable());
            this.nowLineUpdateIntervals[`${this.weekday}${this.shifts.length}`] = interval(5000).pipe(
            // take(4),
            ).subscribe(() => {
                this.updateFirstShiftAfterNow(this.shifts.iterable());
            });
            return false;
        }
        if (this.firstShiftAfterNow === null)
            return false;
        // eslint-disable-next-line sonarjs/prefer-immediate-return
        const isSameId = shift.id.equals(this.firstShiftAfterNow.id);
        return isSameId;
    }
    isToday(date) {
        return this.pMomentService.m(date).isSame(this.now, 'date');
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
};
__decorate([
    Input(),
    __metadata("design:type", Number)
], WeekCellComponent.prototype, "weekday", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_b = typeof SchedulingApiShifts !== "undefined" && SchedulingApiShifts) === "function" ? _b : Object)
], WeekCellComponent.prototype, "shifts", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], WeekCellComponent.prototype, "absences", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], WeekCellComponent.prototype, "holidays", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], WeekCellComponent.prototype, "birthdays", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], WeekCellComponent.prototype, "onShiftClick", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], WeekCellComponent.prototype, "shiftTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], WeekCellComponent.prototype, "readMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], WeekCellComponent.prototype, "isLoading", void 0);
WeekCellComponent = __decorate([
    Component({
        selector: 'p-week-cell[weekday][shifts][absences][holidays][birthdays]',
        templateUrl: './week-cell.component.html',
        styleUrls: ['./week-cell.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof PMomentService !== "undefined" && PMomentService) === "function" ? _a : Object])
], WeekCellComponent);
export { WeekCellComponent };
//# sourceMappingURL=week-cell.component.js.map