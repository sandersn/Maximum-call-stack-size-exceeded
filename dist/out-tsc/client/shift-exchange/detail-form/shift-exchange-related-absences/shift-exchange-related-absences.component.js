var _a, _b;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { SchedulingApiAbsences } from '@plano/shared/api';
let PShiftExchangeRelatedAbsencesComponent = class PShiftExchangeRelatedAbsencesComponent {
    constructor() {
        this.onClickAbsence = new EventEmitter();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get absencesForList() {
        return this.absences.sortedBy(item => item.time.start, false);
    }
};
__decorate([
    Input(),
    __metadata("design:type", typeof (_a = typeof SchedulingApiAbsences !== "undefined" && SchedulingApiAbsences) === "function" ? _a : Object)
], PShiftExchangeRelatedAbsencesComponent.prototype, "absences", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_b = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _b : Object)
], PShiftExchangeRelatedAbsencesComponent.prototype, "onClickAbsence", void 0);
PShiftExchangeRelatedAbsencesComponent = __decorate([
    Component({
        selector: 'p-shift-exchange-related-absences[absences]',
        templateUrl: './shift-exchange-related-absences.component.html',
        styleUrls: ['./shift-exchange-related-absences.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [])
], PShiftExchangeRelatedAbsencesComponent);
export { PShiftExchangeRelatedAbsencesComponent };
//# sourceMappingURL=shift-exchange-related-absences.component.js.map