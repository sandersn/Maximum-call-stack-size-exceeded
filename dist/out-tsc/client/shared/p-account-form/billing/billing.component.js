import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { AccountApiCountry, AccountApiService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { TranslatePipe } from '@plano/shared/core/pipe/translate.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PThemeEnum } from '../../bootstrap-styles.enum';
import { PFormGroup } from '../../p-forms/p-form-control';
import { SectionWhitespace } from '../../page/section/section.component';
let BillingComponent = class BillingComponent {
    constructor(api, translatePipe, modalService, pFormsService) {
        this.api = api;
        this.translatePipe = translatePipe;
        this.modalService = modalService;
        this.pFormsService = pFormsService;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.CONFIG = Config;
        this.turnIntoRealAccountForm = false;
        this.countriesArray = Object.values(AccountApiCountry).filter((value) => !Number.isNaN(Number(value)));
        this.initFormGroup = new EventEmitter();
        this.PThemeEnum = PThemeEnum;
        this.SectionWhitespace = SectionWhitespace;
    }
    ngAfterContentInit() {
        this.countriesArray = this.countriesArray.sort((a, b) => {
            const aKey = AccountApiCountry[a];
            const bKey = AccountApiCountry[b];
            const aLabel = this.translatePipe.transform(aKey);
            const bLabel = this.translatePipe.transform(bKey);
            if (aLabel === null || bLabel === null)
                return 0;
            if (typeof aLabel !== 'string' || typeof bLabel !== 'string')
                return 0;
            return aLabel.toLowerCase().localeCompare(bLabel.toLowerCase());
        });
    }
    /**
     * Returns a modal that should shw up when the user switches to another country.
     */
    getBillCountryHook(billCountryHookContent) {
        // Always return a hook. Sometimes the hook is instantly successful. Sometimes it opens a modal.
        return (success, dismiss) => {
            if (this.api.data.billing.country === AccountApiCountry.GERMANY) {
                success();
                return;
            }
            if (!!this.api.data.billing.vatNumber) {
                success();
                return;
            }
            this.modalService.openModal(billCountryHookContent, {
                success: success,
                dismiss: dismiss,
            });
        };
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isNoneGermanClient() {
        return this.api.data.locationCountry !== AccountApiCountry.GERMANY;
    }
};
__decorate([
    Input('group'),
    __metadata("design:type", PFormGroup)
], BillingComponent.prototype, "formGroup", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], BillingComponent.prototype, "turnIntoRealAccountForm", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], BillingComponent.prototype, "initFormGroup", void 0);
BillingComponent = __decorate([
    Component({
        selector: 'p-billing[group]',
        templateUrl: './billing.component.html',
        styleUrls: ['./billing.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [AccountApiService,
        TranslatePipe,
        ModalService,
        PFormsService])
], BillingComponent);
export { BillingComponent };
//# sourceMappingURL=billing.component.js.map