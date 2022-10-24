import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { AccountApiType, MeService } from '@plano/shared/api';
import { AccountApiService } from '@plano/shared/api';
import { PSupportedCurrencyCodes } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '@plano/shared/core/config';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../shared/core/null-type-utils';
import { BootstrapSize, PThemeEnum } from '../shared/bootstrap-styles.enum';
import { PAccountFormService } from '../shared/p-account-form/p-account-form.service';
let TestAccountComponent = class TestAccountComponent {
    constructor(pAccountFormService, meService, modalService, api, pRouterService, pMoment) {
        this.pAccountFormService = pAccountFormService;
        this.meService = meService;
        this.modalService = modalService;
        this.api = api;
        this.pRouterService = pRouterService;
        this.pMoment = pMoment;
        this._alwaysTrue = true;
        this.AccountApiType = AccountApiType;
        this.Config = Config;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.PSupportedCurrencyCodes = PSupportedCurrencyCodes;
        this.PThemeEnum = PThemeEnum;
        this.agreedToTerms = false;
        this.agreedToDataUsage = false;
        this.formGroup = null;
        this.api.data.transformingToPaidAccount = true;
    }
    ngAfterContentInit() {
        this.initComponent();
    }
    ngOnDestroy() {
        this.api.data.transformingToPaidAccount = false;
    }
    /**
     * Load and set everything that is necessary for this component
     */
    initComponent(done) {
        this.today = +this.pMoment.m().startOf('day');
        // Site must be reloaded no matter where user is navigation from
        // if (this.api.isLoaded()) {
        // 	this.initFormGroup();
        // 	return;
        // }
        this.api.load({
            success: () => {
                this.initFormGroup();
                if (done) {
                    done();
                }
            },
        });
    }
    /**
     * Initialize the form-group for this component
     */
    initFormGroup() {
        if (this.formGroup)
            this.formGroup = null;
        this.formGroup = this.pAccountFormService.getPAccountFormGroup(this.api);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    convertIntoRealAccount(modalContent, successModalContent) {
        return this.modalService.getEditableHook(modalContent, {
            size: 'xl',
            success: () => {
                this.api.data.type = AccountApiType.PAID;
                this.api.save({
                    success: () => {
                        this.meService.load();
                        this.modalService.openModal(successModalContent, {
                            size: BootstrapSize.LG,
                            backdrop: 'static',
                        });
                    },
                });
            },
            dismiss: () => {
                this.dismissConfirmModal();
            },
        });
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onYeah() {
        this.pRouterService.navigate(['/client/']);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    dismissConfirmModal(d) {
        var _a, _b;
        this.agreedToDataUsage = false;
        this.agreedToTerms = false;
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        const sepaControl = (_b = (_a = this.formGroup.get('payment')) === null || _a === void 0 ? void 0 : _a.get('sepaAgreement')) !== null && _b !== void 0 ? _b : null;
        assumeNonNull(sepaControl, `We assume 'sepaAgreement' to be defined here`);
        sepaControl.setValue(false);
        if (d)
            d('Dismiss click');
    }
};
__decorate([
    HostBinding('class.flex-grow-1'),
    HostBinding('class.d-flex'),
    HostBinding('class.position-relative'),
    __metadata("design:type", Object)
], TestAccountComponent.prototype, "_alwaysTrue", void 0);
TestAccountComponent = __decorate([
    Component({
        selector: 'p-test-account',
        templateUrl: './test-account.component.html',
        styleUrls: ['./test-account.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [PAccountFormService,
        MeService,
        ModalService,
        AccountApiService,
        PRouterService,
        PMomentService])
], TestAccountComponent);
export { TestAccountComponent };
//# sourceMappingURL=test-account.component.js.map