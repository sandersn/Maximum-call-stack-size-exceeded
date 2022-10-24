import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { BootstrapSize, PThemeEnum } from '../../bootstrap-styles.enum';
let TransactionTotalsComponent = class TransactionTotalsComponent {
    constructor() {
        this.isLoading = null;
        this.totalIncomingPayments = null;
        this.totalOutgoingPayments = null;
        this.onlineRefundableAmount = null;
        this.onlineRefundableAmountInfoText = null;
        this.PThemeEnum = PThemeEnum;
        this.BootstrapSize = BootstrapSize;
    }
    /**
     * The total incoming payments for this booking
     */
    get incomingPayments() {
        if (this.isLoading)
            return null;
        return this.totalIncomingPayments;
    }
    /**
     * The total outgoing payments for this booking
     */
    get outgoingPayments() {
        if (this.isLoading)
            return null;
        return this.totalOutgoingPayments;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], TransactionTotalsComponent.prototype, "isLoading", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TransactionTotalsComponent.prototype, "totalIncomingPayments", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TransactionTotalsComponent.prototype, "totalOutgoingPayments", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TransactionTotalsComponent.prototype, "onlineRefundableAmount", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TransactionTotalsComponent.prototype, "onlineRefundableAmountInfoText", void 0);
TransactionTotalsComponent = __decorate([
    Component({
        selector: 'p-transaction-totals',
        templateUrl: './transaction-totals.component.html',
        styleUrls: ['./transaction-totals.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], TransactionTotalsComponent);
export { TransactionTotalsComponent };
//# sourceMappingURL=transaction-totals.component.js.map