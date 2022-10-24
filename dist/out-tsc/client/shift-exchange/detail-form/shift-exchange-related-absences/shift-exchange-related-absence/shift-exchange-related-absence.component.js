var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormattedDateTimePipe } from '@plano/client/shared/formatted-date-time.pipe';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiAbsence } from '@plano/shared/api';
let PShiftExchangeRelatedAbsenceComponent = class PShiftExchangeRelatedAbsenceComponent {
    constructor(rightsService, formattedDateTimePipe) {
        this.rightsService = rightsService;
        this.formattedDateTimePipe = formattedDateTimePipe;
        this.onClick = new EventEmitter();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get hideEditBtn() {
        return !this.rightsService.userCanWriteAbsences;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    getDateInfo(absence) {
        return this.formattedDateTimePipe.getFormattedDateInfo(absence.time.start, absence.time.end, true, absence.isFullDay);
    }
};
__decorate([
    Input(),
    __metadata("design:type", typeof (_b = typeof SchedulingApiAbsence !== "undefined" && SchedulingApiAbsence) === "function" ? _b : Object)
], PShiftExchangeRelatedAbsenceComponent.prototype, "absence", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], PShiftExchangeRelatedAbsenceComponent.prototype, "onClick", void 0);
PShiftExchangeRelatedAbsenceComponent = __decorate([
    Component({
        selector: 'p-shift-exchange-related-absence[absence]',
        templateUrl: './shift-exchange-related-absence.component.html',
        styleUrls: ['./shift-exchange-related-absence.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof RightsService !== "undefined" && RightsService) === "function" ? _a : Object, FormattedDateTimePipe])
], PShiftExchangeRelatedAbsenceComponent);
export { PShiftExchangeRelatedAbsenceComponent };
//# sourceMappingURL=shift-exchange-related-absence.component.js.map