var _a, _b, _c, _d, _e, _f, _g, _h;
import { __decorate, __metadata } from "tslib";
import { MonthViewDay } from 'calendar-utils';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { RightsService } from '@plano/client/accesscontrol/rights.service';
import { FilterService } from '@plano/client/shared/filter.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiShifts } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { Data } from '@plano/shared/core/data/data';
import { PrimitiveDataInput } from '@plano/shared/core/data/primitive-data-input';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../../shared/core/null-type-utils';
import { PCalendarService } from '../../p-calendar.service';
let MonthCellComponent = class MonthCellComponent {
    constructor(api, pCalendarService, filterService, rightsService, pMoment) {
        this.api = api;
        this.pCalendarService = pCalendarService;
        this.filterService = filterService;
        this.rightsService = rightsService;
        this.pMoment = pMoment;
        this.selectedDate = null;
        this.neverShowDayTools = true;
        this.onDayClick = new EventEmitter();
        this.shiftTemplate = null;
        this.readMode = false;
        this._shiftsOfDay = new Data(this.api, this.filterService, new PrimitiveDataInput(() => {
            assumeDefinedToGetStrictNullChecksRunning(this.dayAsTimestamp, 'dayAsTimestamp');
            return this.dayAsTimestamp;
        }));
        this.pinStickyNote = false;
        this.subscription = null;
        /**
         * If this is true, the shift-items in ui will be just skeletons/placeholders.
         */
        this.delayIsActive = false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftsOfDay() {
        return this._shiftsOfDay.get(() => {
            assumeDefinedToGetStrictNullChecksRunning(this.dayAsTimestamp, 'dayAsTimestamp');
            return this.shifts.getByDay(this.dayAsTimestamp);
        });
    }
    ngAfterContentChecked() {
        this.dayAsTimestamp = this.day.date.getTime();
    }
    ngAfterContentInit() {
        this.dayAsTimestamp = this.day.date.getTime();
        this.refreshPinStickyNote();
        this.subscription = this.api.onChange.subscribe(() => {
            this.refreshPinStickyNote();
        });
    }
    refreshPinStickyNote() {
        if (this.dayAsTimestamp === undefined)
            return;
        this.pinStickyNote = !!this.pCalendarService.hasImportantNoteForDay(this.dayAsTimestamp, false);
    }
    ngOnDestroy() {
        var _a;
        (_a = this.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftsOfDayHaveDescriptions() {
        const result = this.pCalendarService.shiftsOfDayHaveDescriptions(this.dayAsTimestamp, { onlyForUser: true });
        assumeDefinedToGetStrictNullChecksRunning(result, 'result');
        return result;
    }
    /**
     * This changes the selected timestamp
     * NOTE: Relict from old times
     */
    onCellTopClick() {
        if (!this.selectedDate)
            throw new Error('selectedDate is not defined');
        if (!this.pMoment.m(this.selectedDate).isSame(this.dayAsTimestamp, 'month'))
            return;
        this.onDayClick.emit(this.dayAsTimestamp);
    }
};
__decorate([
    Input(),
    __metadata("design:type", typeof (_e = typeof MonthViewDay !== "undefined" && MonthViewDay) === "function" ? _e : Object)
], MonthCellComponent.prototype, "day", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_f = typeof SchedulingApiShifts !== "undefined" && SchedulingApiShifts) === "function" ? _f : Object)
], MonthCellComponent.prototype, "shifts", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MonthCellComponent.prototype, "absences", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MonthCellComponent.prototype, "holidays", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MonthCellComponent.prototype, "birthdays", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MonthCellComponent.prototype, "selectedDate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], MonthCellComponent.prototype, "neverShowDayTools", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_g = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _g : Object)
], MonthCellComponent.prototype, "onDayClick", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MonthCellComponent.prototype, "shiftTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], MonthCellComponent.prototype, "readMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], MonthCellComponent.prototype, "delayIsActive", void 0);
MonthCellComponent = __decorate([
    Component({
        selector: 'p-month-cell[day][shifts][absences][holidays][birthdays]',
        templateUrl: './month-cell.component.html',
        styleUrls: ['./month-cell.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, PCalendarService, typeof (_b = typeof FilterService !== "undefined" && FilterService) === "function" ? _b : Object, typeof (_c = typeof RightsService !== "undefined" && RightsService) === "function" ? _c : Object, typeof (_d = typeof PMomentService !== "undefined" && PMomentService) === "function" ? _d : Object])
], MonthCellComponent);
export { MonthCellComponent };
//# sourceMappingURL=month-cell.component.js.map