var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { BootstrapRounded, BootstrapSize, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { Config } from '@plano/shared/core/config';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PButtonType } from '../../../p-forms/p-button/p-button.component';
let CalendarViewSettingsComponent = class CalendarViewSettingsComponent {
    constructor() {
        this.showListBtn = true;
        this.hideLabels = false;
        this.calendarMode = null;
        this.calendarModeChange = new EventEmitter();
        this.showDayAsList = false;
        this.showDayAsListChange = new EventEmitter();
        this.showWeekAsList = false;
        this.showWeekAsListChange = new EventEmitter();
        this.isLoading = false;
        this.BootstrapRounded = BootstrapRounded;
        this.PThemeEnum = PThemeEnum;
        this.BootstrapSize = BootstrapSize;
        this.CalendarModes = CalendarModes;
        this.PButtonType = PButtonType;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.config = Config;
    }
    /**
     * Navigate to 'month', 'week', 'day'…
     */
    switchCalendarMode(input) {
        this.calendarMode = input;
        this.calendarModeChange.emit(this.calendarMode);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarViewSettingsComponent.prototype, "showListBtn", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarViewSettingsComponent.prototype, "hideLabels", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarViewSettingsComponent.prototype, "calendarMode", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_b = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _b : Object)
], CalendarViewSettingsComponent.prototype, "calendarModeChange", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarViewSettingsComponent.prototype, "showDayAsList", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], CalendarViewSettingsComponent.prototype, "showDayAsListChange", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarViewSettingsComponent.prototype, "showWeekAsList", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_d = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _d : Object)
], CalendarViewSettingsComponent.prototype, "showWeekAsListChange", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarViewSettingsComponent.prototype, "isLoading", void 0);
CalendarViewSettingsComponent = __decorate([
    Component({
        selector: 'p-calendar-view-settings',
        templateUrl: './calendar-view-settings.component.html',
        styleUrls: ['./calendar-view-settings.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [])
], CalendarViewSettingsComponent);
export { CalendarViewSettingsComponent };
//# sourceMappingURL=calendar-view-settings.component.js.map