var _a;
import { __decorate, __metadata } from "tslib";
import { Component, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { FormattedDateTimePipe } from '@plano/client/shared/formatted-date-time.pipe';
import { TimeStampApiService } from '@plano/shared/api';
let ShiftSelectComponent = class ShiftSelectComponent {
    constructor(api, formattedDateTimePipe) {
        this.api = api;
        this.formattedDateTimePipe = formattedDateTimePipe;
        this.disabled = null;
        this.selectedShiftId = null;
        this.selectedShiftIdChange = new EventEmitter();
        this._shifts = null;
        /**
         * Label for the trigger-button. Has a default like "Wähle deine Schicht" but can be overwritten here.
         */
        this.placeholder = null;
        this.isOpen = false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    onSelect(shift) {
        this.isOpen = false;
        this.selectedShiftIdChange.emit(shift.id);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get selectedShift() {
        if (this.selectedShiftId !== null) {
            return this._shifts.get(this.selectedShiftId);
        }
        return null;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get shifts() {
        return this._shifts.iterableSortedBy(item => item.start);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    getFormattedTimeInfo(start, end) {
        return this.formattedDateTimePipe.getFormattedTimeInfo(start, end).full;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftSelectComponent.prototype, "disabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftSelectComponent.prototype, "selectedShiftId", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_a = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _a : Object)
], ShiftSelectComponent.prototype, "selectedShiftIdChange", void 0);
__decorate([
    Input('shifts'),
    __metadata("design:type", Object)
], ShiftSelectComponent.prototype, "_shifts", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftSelectComponent.prototype, "placeholder", void 0);
ShiftSelectComponent = __decorate([
    Component({
        selector: 'p-shift-select',
        templateUrl: './shift-select.component.html',
        styleUrls: ['./shift-select.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [TimeStampApiService,
        FormattedDateTimePipe])
], ShiftSelectComponent);
export { ShiftSelectComponent };
//# sourceMappingURL=shift-select.component.js.map