import { __decorate, __metadata } from "tslib";
/* eslint-disable @angular-eslint/component-selector */
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PFormGroup } from '../../p-forms/p-form-control';
import { PShiftAndShiftmodelFormService } from '../p-shift-and-shiftmodel-form/p-shift-and-shiftmodel-form.service';
let WeekdaysComponent = class WeekdaysComponent {
    constructor(pShiftAndShiftmodelFormService, localize) {
        this.pShiftAndShiftmodelFormService = pShiftAndShiftmodelFormService;
        this.localize = localize;
        this.disabled = false;
        this.label = null;
        if (this.label === null)
            this.label = this.localize.transform('An jedem');
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], WeekdaysComponent.prototype, "disabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], WeekdaysComponent.prototype, "label", void 0);
__decorate([
    Input(),
    __metadata("design:type", PFormGroup)
], WeekdaysComponent.prototype, "weekdayFormGroup", void 0);
WeekdaysComponent = __decorate([
    Component({
        selector: 'weekdays[weekdayFormGroup]',
        templateUrl: './weekdays.component.html',
        styleUrls: ['./weekdays.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [PShiftAndShiftmodelFormService,
        LocalizePipe])
], WeekdaysComponent);
export { WeekdaysComponent };
//# sourceMappingURL=weekdays.component.js.map