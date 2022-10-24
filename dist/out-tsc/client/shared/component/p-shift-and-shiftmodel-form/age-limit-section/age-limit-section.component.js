var _a, _b;
import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SchedulingApiService, SchedulingApiShiftModel } from '../../../../../shared/api';
import { PThemeEnum } from '../../../bootstrap-styles.enum';
import { PFormGroup } from '../../../p-forms/p-form-control';
import { SectionWhitespace } from '../../../page/section/section.component';
let AgeLimitSectionComponent = class AgeLimitSectionComponent {
    constructor() {
        this.userCanWrite = false;
        this.initFormGroup = new EventEmitter();
        this.SectionWhitespace = SectionWhitespace;
        this.PThemeEnum = PThemeEnum;
    }
    /** Which limits are there for the booking person? Improves readability of the template file. */
    get bookingPersonAgeLimits() {
        const hasMinLimit = (() => {
            return this.shiftModel.bookingPersonMinAge !== null;
        })();
        if (hasMinLimit)
            return 'minLimit';
        return null;
    }
    /** Which limits are there for the participants? Improves readability of the template file. */
    get participantAgeLimits() {
        const hasMinLimit = this.shiftModel.participantMinAge !== null;
        const hasMaxLimit = this.shiftModel.participantMaxAge !== null;
        if (hasMinLimit) {
            if (hasMaxLimit)
                return 'minAndMaxLimit';
            return 'minLimit';
        }
        if (hasMaxLimit)
            return 'maxLimit';
        return null;
    }
};
__decorate([
    Input(),
    __metadata("design:type", typeof (_a = typeof SchedulingApiShiftModel !== "undefined" && SchedulingApiShiftModel) === "function" ? _a : Object)
], AgeLimitSectionComponent.prototype, "shiftModel", void 0);
__decorate([
    Input(),
    __metadata("design:type", PFormGroup)
], AgeLimitSectionComponent.prototype, "formGroup", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_b = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _b : Object)
], AgeLimitSectionComponent.prototype, "api", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], AgeLimitSectionComponent.prototype, "userCanWrite", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], AgeLimitSectionComponent.prototype, "initFormGroup", void 0);
AgeLimitSectionComponent = __decorate([
    Component({
        selector: 'p-age-limit-section[shiftModel][formGroup][api]',
        templateUrl: './age-limit-section.component.html',
        styleUrls: ['./age-limit-section.component.scss'],
    }),
    __metadata("design:paramtypes", [])
], AgeLimitSectionComponent);
export { AgeLimitSectionComponent };
//# sourceMappingURL=age-limit-section.component.js.map