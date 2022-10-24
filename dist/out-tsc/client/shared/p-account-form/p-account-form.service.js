import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { MeService } from '@plano/shared/api';
import { AccountApiService } from '@plano/shared/api';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PCurrencyPipe } from '@plano/shared/core/pipe/p-currency.pipe';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PApiPrimitiveTypes } from '../../../shared/api/base/generated-types.ag';
import { PFormControl } from '../p-forms/p-form-control';
let PAccountFormService = class PAccountFormService {
    constructor(meService, validators, api, pFormsService, currencyPipe, localize) {
        this.meService = meService;
        this.validators = validators;
        this.api = api;
        this.pFormsService = pFormsService;
        this.currencyPipe = currencyPipe;
        this.localize = localize;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    getPAccountFormGroup(api) {
        return this.pFormsService.group({
            location: this.getLocationFormGroup(),
            billing: this.getBillingFormGroup(api),
            account: this.getAccountFormGroup(),
            payment: this.getPaymentFormGroup(),
            discountCode: new PFormControl({
                formState: {
                    value: this.api.data.discountCode,
                    disabled: false,
                },
            }),
        });
    }
    getLocationFormGroup() {
        return this.pFormsService.group({});
    }
    getBillingFormGroup(api) {
        const result = this.pFormsService.group({});
        // bill country has influence to the validation of vat. Therefore we need a 'cross-validation-update' here.
        // no need to google cross-validation-update. its not a real thing. i just invented it. lol.
        const billCountryFormControl = this.pFormsService.getByAI(result, api.data.billing.attributeInfoCountry);
        const vatFormControl = this.pFormsService.getByAI(result, api.data.billing.attributeInfoVatNumber);
        result.controls[api.data.billing.attributeInfoCountry.id].valueChanges.subscribe((_value) => {
            if (api.data.billing.attributeInfoVatNumber.canEdit) {
                vatFormControl.enable();
            }
            else {
                vatFormControl.disable();
            }
            vatFormControl.updateValueAndValidity();
        });
        // same as above. but now for billAddressIsLocationAddressFormControl > attributeInfoBillCountry.canEdit
        const billAddressIsLocationAddressFormControl = this.pFormsService.getByAI(result, api.data.billing.attributeInfoBillAddressIsLocationAddress);
        billAddressIsLocationAddressFormControl.valueChanges.subscribe((_value) => {
            if (api.data.billing.attributeInfoCountry.canEdit) {
                billCountryFormControl.enable();
            }
            else {
                billCountryFormControl.disable();
            }
            vatFormControl.updateValueAndValidity();
        });
        return result;
    }
    getAccountFormGroup() {
        const result = this.pFormsService.group({
            customerId: new PFormControl({
                formState: {
                    value: this.api.data.customerId,
                    disabled: !this.api.data.attributeInfoCustomerId.canEdit,
                },
            }),
        });
        this.pFormsService.addControl(result, 'accountingPeriodStartDay', {
            value: this.api.data.accountingPeriodStartDay,
            disabled: !this.api.data.attributeInfoAccountingPeriodStartDay.canEdit,
        }, [
            this.validators.required(PApiPrimitiveTypes.Days),
            this.validators.min(1, true, this.api.data.attributeInfoAccountingPeriodStartDay.primitiveType),
            this.validators.max(28, true, this.api.data.attributeInfoAccountingPeriodStartDay.primitiveType),
            this.validators.maxDecimalPlacesCount(0, PApiPrimitiveTypes.Days),
        ], (value) => {
            const number = +value;
            if (!Number.isNaN(number)) {
                this.api.data.accountingPeriodStartDay = number;
            }
        });
        return result;
    }
    getPaymentFormGroup() {
        const formGroup = this.pFormsService.group({});
        formGroup.addControl('sepaAgreement', new PFormControl({
            formState: {
                value: !(this.meService.isLoaded() && this.meService.data.testAccountDeadline),
                disabled: false,
            },
        }));
        return formGroup;
    }
};
PAccountFormService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [MeService,
        ValidatorsService,
        AccountApiService,
        PFormsService,
        PCurrencyPipe,
        LocalizePipe])
], PAccountFormService);
export { PAccountFormService };
//# sourceMappingURL=p-account-form.service.js.map