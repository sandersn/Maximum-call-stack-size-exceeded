var _a;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { TransactionsSortedByEmum } from '@plano/client/sales/transactions/transactions.component';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PCurrencyPipe } from '../../../../shared/core/pipe/p-currency.pipe';
import { PMomentService } from '../../p-moment.service';
let TransactionListComponent = class TransactionListComponent {
    constructor(pCurrencyPipe, pMomentService) {
        this.pCurrencyPipe = pCurrencyPipe;
        this.pMomentService = pMomentService;
        this.isLoading = null;
        this.transactions = [];
        this.onEditItem = new EventEmitter();
        this.excludedColumn = [];
        this.TransactionsSortedByEmum = TransactionsSortedByEmum;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.now = +this.pMomentService.m().startOf('minute').add('minute');
    }
    /**
     * Label of type
     */
    getTypeIcon(transaction) {
        return this.pCurrencyPipe.getPaymentMethodIcon(transaction.paymentMethodType, transaction.paymentMethodName);
    }
    /** Remove when type of SchedulingApiVoucher['price'] is fixed */
    time(transaction) {
        var _a;
        return (_a = transaction.attributeInfoDateTime.value) !== null && _a !== void 0 ? _a : this.now;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], TransactionListComponent.prototype, "isLoading", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], TransactionListComponent.prototype, "transactions", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_a = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _a : Object)
], TransactionListComponent.prototype, "onEditItem", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], TransactionListComponent.prototype, "excludedColumn", void 0);
TransactionListComponent = __decorate([
    Component({
        selector: 'p-transaction-list',
        templateUrl: './transaction-list.component.html',
        styleUrls: ['./transaction-list.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [PCurrencyPipe,
        PMomentService])
], TransactionListComponent);
export { TransactionListComponent };
//# sourceMappingURL=transaction-list.component.js.map