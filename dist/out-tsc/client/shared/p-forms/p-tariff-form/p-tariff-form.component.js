var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { RightsService } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '@plano/shared/core/config';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../shared/core/null-type-utils';
import { ValidatorsService } from '../../../../shared/core/validators.service';
import { SectionWhitespace } from '../../page/section/section.component';
import { PFormGroup } from '../p-form-control';
import { PShiftmodelTariffService } from '../p-shiftmodel-tariff.service';
let PTariffFormComponent = class PTariffFormComponent {
    constructor(rightsService, pShiftmodelTariffService, pFormsService, validators) {
        this.rightsService = rightsService;
        this.pShiftmodelTariffService = pShiftmodelTariffService;
        this.pFormsService = pFormsService;
        this.validators = validators;
        this.shiftModel = null;
        this.booking = null;
        this.api = null;
        this.dismissFeeBox = new EventEmitter();
        this.Config = Config;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.PApiPrimitiveTypes = PApiPrimitiveTypes;
        this.SectionWhitespace = SectionWhitespace;
    }
    /**
     * Check if user can edit this shift
     */
    get userCanWrite() {
        if (this.shiftModel === null)
            return null;
        return this.rightsService.userCanWrite(this.shiftModel);
    }
    /**
     * Is this the 'Per Person Fee'?
     */
    isFancyFee(fee) {
        // eslint-disable-next-line @typescript-eslint/ban-types
        const fancyFee = this.pShiftmodelTariffService.getFancyFeeFormGroup(this.formGroup.get('fees'));
        if (!fancyFee)
            return false;
        const fancyFeeControl = fancyFee.get('reference');
        assumeNonNull(fancyFeeControl);
        if (fancyFeeControl.value !== fee)
            return false;
        return true;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    toggleDisabledStateOfAdditionalFieldLabel(checkboxValue) {
        if (checkboxValue) {
            this.formGroup.get('additionalFieldLabel').enable();
            this.formGroup.get('additionalFieldLabel').setValidators([
                this.validators.maxLength(30, PApiPrimitiveTypes.string).fn,
                this.validators.required(PApiPrimitiveTypes.string).fn,
            ]);
        }
        else {
            this.formGroup.get('additionalFieldLabel').setValue('');
            this.formGroup.get('additionalFieldLabel').disable();
            this.formGroup.get('additionalFieldLabel').setValidators([
                this.validators.maxLength(30, PApiPrimitiveTypes.string).fn,
            ]);
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onClickAddTariffFee() {
        assumeDefinedToGetStrictNullChecksRunning(this.userCanWrite, 'this.userCanWrite', 'can not add tariff id userCanWrite is still unclear');
        this.pShiftmodelTariffService.addTariffFee({
            tariffFormGroup: this.formGroup,
            userCanWrite: this.userCanWrite,
            modeIsEditShiftModel: !this.booking && !!this.shiftModel && !this.shiftModel.isNewItem(),
            shiftModel: this.shiftModel,
            tariff: this.formGroup.get('reference').value,
            booking: this.booking,
        });
    }
};
__decorate([
    Input(),
    __metadata("design:type", PFormGroup)
], PTariffFormComponent.prototype, "formGroup", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTariffFormComponent.prototype, "shiftModel", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTariffFormComponent.prototype, "booking", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTariffFormComponent.prototype, "api", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_d = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _d : Object)
], PTariffFormComponent.prototype, "dismissFeeBox", void 0);
PTariffFormComponent = __decorate([
    Component({
        selector: 'p-tariff-form[formGroup]',
        templateUrl: './p-tariff-form.component.html',
        styleUrls: ['./p-tariff-form.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof RightsService !== "undefined" && RightsService) === "function" ? _a : Object, PShiftmodelTariffService,
        PFormsService,
        ValidatorsService])
], PTariffFormComponent);
export { PTariffFormComponent };
//# sourceMappingURL=p-tariff-form.component.js.map