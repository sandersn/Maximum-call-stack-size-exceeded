var _a, _b, _c, _d, _e, _f;
import { __decorate, __metadata } from "tslib";
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { PCalendarShiftStyle } from '@plano/client/scheduling/shared/p-scheduling-calendar/p-shift-item-module/shift-item/shift-item-styles';
import { SchedulingApiShifts, SchedulingApiService, SchedulingApiAbsences, SchedulingApiHolidays } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { BirthdayService } from '../../../scheduling/shared/api/birthday.service';
import { SchedulingApiBirthdays } from '../../../scheduling/shared/api/scheduling-api-birthday.service';
import { BootstrapSize } from '../../bootstrap-styles.enum';
import { HighlightService } from '../../highlight.service';
import { PShiftPickerService } from '../p-shift-picker.service';
let PShiftPickerCalendarComponent = class PShiftPickerCalendarComponent {
    constructor(pShiftPickerService, highlightService, api, birthdayService) {
        this.pShiftPickerService = pShiftPickerService;
        this.highlightService = highlightService;
        this.api = api;
        this.birthdayService = birthdayService;
        this.shiftTemplate = null;
        this.CONFIG = Config;
        this.BootstrapSize = BootstrapSize;
        this.PCalendarShiftStyle = PCalendarShiftStyle;
        this.CalendarModes = CalendarModes;
    }
    /**
     * Get the absences that should be available to the calendar component
     */
    get absences() {
        if (!this.api.isLoaded())
            return new SchedulingApiAbsences(null, false);
        return this.api.data.absences;
    }
    /**
     * Get the holidays that should be available to the calendar component
     */
    get holidays() {
        if (!this.api.isLoaded())
            return new SchedulingApiHolidays(null, false);
        return this.api.data.holidays;
    }
    /**
     * Get the birthdays that should be available to the calendar component
     */
    get birthdays() {
        if (!this.api.isLoaded())
            return new SchedulingApiBirthdays(null, null, false);
        return this.birthdayService.birthdays;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    setSelectedDateAndLoadData(value) {
        this.pShiftPickerService.date = value;
        this.loadNewData();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    setCalendarModeAndLoadData(value) {
        this.pShiftPickerService.mode = value;
        this.loadNewData();
    }
    /**
     * Load new Data
     */
    loadNewData(success) {
        this.highlightService.clear();
        this.pShiftPickerService.updateQueryParams();
        if (this.loadDetailedItem.isNewItem()) {
            this.api.load({
                searchParams: this.pShiftPickerService.queryParams,
                success: () => {
                    if (success)
                        success();
                },
            });
        }
        else {
            this.loadDetailedItem.loadDetailed({
                searchParams: this.pShiftPickerService.queryParams,
                success: () => {
                    if (success)
                        success();
                },
            });
        }
    }
};
__decorate([
    Input(),
    __metadata("design:type", typeof (_c = typeof SchedulingApiShifts !== "undefined" && SchedulingApiShifts) === "function" ? _c : Object)
], PShiftPickerCalendarComponent.prototype, "availableShifts", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftPickerCalendarComponent.prototype, "loadDetailedItem", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftPickerCalendarComponent.prototype, "shiftTemplate", void 0);
PShiftPickerCalendarComponent = __decorate([
    Component({
        selector: 'p-shift-picker-calendar[loadDetailedItem][availableShifts]',
        templateUrl: './shift-picker-calendar.component.html',
        styleUrls: ['./shift-picker-calendar.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [PShiftPickerService,
        HighlightService, typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, typeof (_b = typeof BirthdayService !== "undefined" && BirthdayService) === "function" ? _b : Object])
], PShiftPickerCalendarComponent);
export { PShiftPickerCalendarComponent };
//# sourceMappingURL=shift-picker-calendar.component.js.map