var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { PThemeEnum, PBtnThemeEnum } from '../../bootstrap-styles.enum';
let CalendarNavComponent = class CalendarNavComponent {
    constructor(api, pMoment) {
        this.api = api;
        this.pMoment = pMoment;
        this._alwaysTrue = true;
        this.disabled = false;
        this.hideLabels = false;
        this.earlyBirdMode = false;
        this.wishPickerMode = false;
        this.selectedDateChange = new EventEmitter();
        this.onNavToToday = new EventEmitter();
        this.calendarMode = null;
        /**
         * Visual size of this component.
         * Can be useful if you have few space in a button-bar or want to have large buttons on mobile.
         */
        this.size = null;
        this.config = Config;
        this.PThemeEnum = PThemeEnum;
        this.PBtnThemeEnum = PBtnThemeEnum;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.isHighlightedFn = (input) => {
            return this.pMoment.m(input).isSame(this.selectedDate, this.calendarMode);
        };
        this.now = +this.pMoment.m();
    }
    cleanUpUrlTimestamp(input) {
        if (!input.isSame(this.now, this.calendarMode))
            return +input.startOf(this.calendarMode);
        return +this.pMoment.m(this.now).startOf('day');
    }
    /**
     * Navigate to previous day|week|month…
     */
    navPrev() {
        assumeDefinedToGetStrictNullChecksRunning(this.calendarMode, 'this.calendarMode');
        const goal = this.pMoment.m(this.selectedDate).subtract(1, this.calendarMode);
        this.selectedDateChange.emit(this.cleanUpUrlTimestamp(goal));
    }
    /**
     * Navigate to current day|week|month…
     */
    navToToday() {
        const day = this.pMoment.m();
        if (!this.pMoment.m(this.selectedDate).isSame(day, 'day')) {
            this.api.deselectAllSelections();
            this.selectedDateChange.emit(+day.startOf('day'));
        }
        this.onNavToToday.emit();
    }
    /**
     * Navigate to next day|week|month…
     */
    navNext() {
        assumeDefinedToGetStrictNullChecksRunning(this.calendarMode, 'this.calendarMode');
        const goal = this.pMoment.m(this.selectedDate).add(1, this.calendarMode);
        this.selectedDateChange.emit(this.cleanUpUrlTimestamp(goal));
    }
    /**
     * Navigate to next day|week|month…
     */
    navTo(input) {
        const goal = this.pMoment.m(input);
        this.selectedDateChange.emit(this.cleanUpUrlTimestamp(goal));
    }
    /**
     * Check if viewDate is today
     * Helpful for highlighting »today« buttons
     */
    get viewDateIsToday() {
        return this.pMoment.m(this.now).isSame(this.selectedDate, this.calendarMode);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get todoLeftView() {
        const assignmentProcesses = this.getRelevantTodoProcesses();
        if (!assignmentProcesses) {
            return null;
        }
        // return todo count
        let result = 0;
        for (const assignmentProcess of assignmentProcesses.iterable()) {
            result += assignmentProcess.todoShiftsCountLeftView;
        }
        return result;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get todoCurrentView() {
        const assignmentProcesses = this.getRelevantTodoProcesses();
        if (!assignmentProcesses) {
            return null;
        }
        // return todo count
        let result = 0;
        for (const assignmentProcess of assignmentProcesses.iterable()) {
            result += assignmentProcess.todoShiftsCountCurrentView;
        }
        return result;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get todoRightView() {
        const assignmentProcesses = this.getRelevantTodoProcesses();
        if (!assignmentProcesses) {
            return null;
        }
        // return todo count
        let result = 0;
        for (const assignmentProcess of assignmentProcesses.iterable()) {
            result += assignmentProcess.todoShiftsCountRightView;
        }
        return result;
    }
    getRelevantTodoProcesses() {
        // get relevant process state
        let relevantState = undefined;
        if (this.earlyBirdMode) {
            relevantState = SchedulingApiAssignmentProcessState.EARLY_BIRD_SCHEDULING;
        }
        if (this.wishPickerMode) {
            relevantState = SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES;
        }
        if (!relevantState)
            return undefined;
        // get relevant processes
        const assignmentProcesses = this.api.data.assignmentProcesses.filterBy((process) => {
            return process.state === relevantState;
        });
        if (!assignmentProcesses.length) {
            return undefined;
        }
        return assignmentProcesses;
    }
};
__decorate([
    HostBinding('class.d-flex'),
    HostBinding('class.justify-content-between'),
    __metadata("design:type", Object)
], CalendarNavComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarNavComponent.prototype, "disabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarNavComponent.prototype, "hideLabels", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarNavComponent.prototype, "earlyBirdMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarNavComponent.prototype, "wishPickerMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarNavComponent.prototype, "selectedDate", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_b = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _b : Object)
], CalendarNavComponent.prototype, "selectedDateChange", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], CalendarNavComponent.prototype, "onNavToToday", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarNavComponent.prototype, "calendarMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarNavComponent.prototype, "size", void 0);
CalendarNavComponent = __decorate([
    Component({
        selector: 'p-calendar-nav[calendarMode][selectedDate]',
        templateUrl: './calendar-nav.component.html',
        styleUrls: ['./calendar-nav.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, PMomentService])
], CalendarNavComponent);
export { CalendarNavComponent };
//# sourceMappingURL=calendar-nav.component.js.map