import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { AccountApiService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { PFormGroup } from '../../p-forms/p-form-control';
import { SectionWhitespace } from '../../page/section/section.component';
let AccountComponent = class AccountComponent {
    constructor(api, meService) {
        this.api = api;
        this.meService = meService;
        this.turnIntoRealAccountForm = false;
        this.SectionWhitespace = SectionWhitespace;
        this.PApiPrimitiveTypes = PApiPrimitiveTypes;
    }
};
__decorate([
    Input('group'),
    __metadata("design:type", PFormGroup)
], AccountComponent.prototype, "formGroup", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], AccountComponent.prototype, "turnIntoRealAccountForm", void 0);
AccountComponent = __decorate([
    Component({
        selector: 'p-account[group]',
        templateUrl: './account.component.html',
        styleUrls: ['./account.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [AccountApiService,
        MeService])
], AccountComponent);
export { AccountComponent };
//# sourceMappingURL=account.component.js.map