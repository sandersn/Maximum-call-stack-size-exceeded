var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Output, EventEmitter, Input } from '@angular/core';
import { BookingTab } from '@plano/client/booking/booking.component';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { BootstrapSize, PTextColorEnum, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { FormControlSwitchType } from '@plano/client/shared/p-forms/p-form-control-switch/p-form-control-switch.component';
import { SectionWhitespace } from '@plano/client/shared/page/section/section.component';
import { RightsService, SchedulingApiTransaction, SchedulingApiTransactionPaymentMethodType, SchedulingApiTransactionType } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PCurrencyPipe } from '@plano/shared/core/pipe/p-currency.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { Config } from '../../../shared/core/config';
let DetailFormComponent = class DetailFormComponent {
    constructor(api, pFormsService, pRouterService, rightsService, localizePipe, pCurrencyPipe) {
        this.api = api;
        this.pFormsService = pFormsService;
        this.pRouterService = pRouterService;
        this.rightsService = rightsService;
        this.localizePipe = localizePipe;
        this.pCurrencyPipe = pCurrencyPipe;
        this.formGroup = null;
        this.Config = Config;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.PThemeEnum = PThemeEnum;
        this.PApiPrimitiveTypes = PApiPrimitiveTypes;
        this.BootstrapSize = BootstrapSize;
        this.FormControlSwitchType = FormControlSwitchType;
        this.SectionWhitespace = SectionWhitespace;
        this.SchedulingApiTransactionType = SchedulingApiTransactionType;
        this.onAddItem = new EventEmitter();
    }
    /**
     * Get a description for the dr plano fee.
     */
    drPlanoFeeDescription(transaction) {
        if (!transaction.drPlanoFeeVatDeprecated)
            return null;
        return this.localizePipe.transform('+ ${value} USt.', {
            value: this.pCurrencyPipe.transform(transaction.drPlanoFeeVatDeprecated),
        });
    }
    ngAfterContentInit() {
        this.initComponent();
    }
    /**
     * Set values that are necessary for this function.
     * These initValues methods are used in many components.
     * They mostly get used for class attributes that would cause performance issues as a getter.
     */
    initValues() {
    }
    /**
     * Load and set everything that is necessary for this component
     */
    initComponent(success) {
        if (!this.item.isNewItem()) {
            this.item.loadDetailed({
                success: () => {
                    this.initValues();
                    this.initFormGroup();
                    if (success) {
                        success();
                    }
                },
            });
        }
        else {
            this.initValues();
            this.initFormGroup();
            if (success) {
                success();
            }
        }
    }
    /**
     * Initialize the formGroup for this component
     */
    initFormGroup() {
        if (this.formGroup) {
            this.formGroup = null;
        }
        const newFormGroup = this.pFormsService.group({});
        // this.pFormsService.addPControl(newFormGroup, 'type', {
        // 	formState: {
        // 		value: 'BootstrapSize',
        // 		disabled: undefined,
        // 	},
        // 	isReadMode: true,
        // })
        this.formGroup = newFormGroup;
    }
    /**
     * Remove Item of this Detail page
     */
    removeItem() {
        this.formGroup = null;
        this.api.data.transactions.removeItem(this.item);
        this.pRouterService.navBack();
        this.api.save({
            success: () => {
            },
        });
    }
    /**
     * Save this item
     */
    saveItem() {
        if (!this.item.isNewItem())
            return;
        this.onAddItem.emit(this.item);
        this.pRouterService.navBack();
    }
    /**
     * Navigate to the related booking
     */
    navToBooking() {
        if (this.item.bookingId === null)
            throw new Error('This transaction does not belong to a booking.');
        this.pRouterService.navigate([`client/booking/${this.item.bookingId.toString()}/${BookingTab.TRANSACTIONS}`]);
    }
    /**
     * Navigate to the related booking
     */
    navToGiftCard() {
        if (this.item.voucherId === null)
            throw new Error('This transaction does not belong to a voucher.');
        this.pRouterService.navigate([`client/gift-card/${this.item.voucherId.toString()}`]);
    }
    /**
     * Export this transaction as pdf
     */
    exportAsPdf() {
        // TODO: [PLANO-48169]
        throw new Error('not implemented yet');
    }
    /**
     * The creator of this transaction. Its a member of the submerchant
     */
    get creator() {
        if (this.item.creatorId === null)
            return null;
        return this.api.data.members.get(this.item.creatorId);
    }
    /**
     * get css classes for balance change
     */
    get balanceChangeTheme() {
        if (this.item.paymentMethodType === SchedulingApiTransactionPaymentMethodType.POS)
            return PTextColorEnum.MUTED;
        if (this.item.paymentMethodType === SchedulingApiTransactionPaymentMethodType.MISC)
            return PTextColorEnum.MUTED;
        const value = this.item.balanceChange;
        if (value > 0)
            return PThemeEnum.SUCCESS;
        if (value < 0)
            return PThemeEnum.DANGER;
        return PTextColorEnum.MUTED;
    }
    /**
     * get balance change
     */
    get balanceChange() {
        if (this.item.paymentMethodType === SchedulingApiTransactionPaymentMethodType.POS)
            return this.localizePipe.transform('nicht relevant');
        if (this.item.paymentMethodType === SchedulingApiTransactionPaymentMethodType.MISC)
            return this.localizePipe.transform('nicht relevant');
        const BALANCE = !!this.item.balanceChange ? this.item.balanceChange : 0;
        return this.pCurrencyPipe.transform(BALANCE, undefined, undefined, undefined, undefined, undefined, true);
    }
    /**
     * A fitting label for the creator
     */
    get creatorIdLabel() {
        switch (this.item.type) {
            case SchedulingApiTransactionType.PAYMENT:
                return this.item.creatorId !== null ? 'Zahlung erfasst von' : null;
            case SchedulingApiTransactionType.REFUND:
                if (this.item.paymentMethodType === SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT)
                    return 'Zahlung veranlasst von';
                return 'Zahlung erfasst von';
            case SchedulingApiTransactionType.PAYOUT:
            case SchedulingApiTransactionType.AUTO_DEBIT:
                return 'Mit ♥ beauftragt von';
            case SchedulingApiTransactionType.PAYOUT_FAILED:
            case SchedulingApiTransactionType.CHARGEBACK:
            case SchedulingApiTransactionType.CHARGEBACK_REVERSED:
            case SchedulingApiTransactionType.SECOND_CHARGEBACK:
            case SchedulingApiTransactionType.PAYMENT_FAILED:
            case SchedulingApiTransactionType.REFUND_FAILED:
            case SchedulingApiTransactionType.AUTO_DEBIT_FAILED:
            case SchedulingApiTransactionType.DR_PLANO_FEE_VAT:
                return null;
        }
    }
    /**
     * What kind of creator doe’s this transaction have?
     */
    get creatorType() {
        if (this.item.type === SchedulingApiTransactionType.PAYOUT || this.item.type === SchedulingApiTransactionType.AUTO_DEBIT)
            return 'dr-plano';
        if (this.item.creatorId !== null)
            return 'member';
        return null;
    }
    /**
     * Get an fitting icon for this payment-method name
     */
    get paymentMethodIcon() {
        return this.pCurrencyPipe.getPaymentMethodIcon(this.item.paymentMethodType, this.item.paymentMethodName);
    }
    /**
     * Nav to the transaction with id `transactionId`.
     */
    navToTransaction(transactionId) {
        if (transactionId === null)
            throw new Error('Button should not have been triggered');
        return this.pRouterService.navigate([`client/transaction/${transactionId.toString()}`]);
    }
};
__decorate([
    Input(),
    __metadata("design:type", typeof (_c = typeof SchedulingApiTransaction !== "undefined" && SchedulingApiTransaction) === "function" ? _c : Object)
], DetailFormComponent.prototype, "item", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_d = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _d : Object)
], DetailFormComponent.prototype, "onAddItem", void 0);
DetailFormComponent = __decorate([
    Component({
        selector: 'p-detail-form[item]',
        templateUrl: './detail-form.component.html',
        styleUrls: ['./detail-form.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, PFormsService,
        PRouterService, typeof (_b = typeof RightsService !== "undefined" && RightsService) === "function" ? _b : Object, LocalizePipe,
        PCurrencyPipe])
], DetailFormComponent);
export { DetailFormComponent };
//# sourceMappingURL=detail-form.component.js.map