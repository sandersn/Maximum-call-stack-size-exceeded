var _a, _b;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { TransactionsSortedByEmum } from '@plano/client/sales/transactions/transactions.component';
import { ListSortDirection } from '../../p-lists/list-headline-item/list-headline-item.component';
let TransactionListHeadlineComponent = class TransactionListHeadlineComponent {
    constructor() {
        this.isLoading = false;
        this.sorter = null;
        this.sorterChange = new EventEmitter();
        this.sortedReverse = null;
        this.sortedReverseChange = new EventEmitter();
        this.excludedColumn = [];
        this.canEditTransactions = true;
        this.TransactionsSortedByEmum = TransactionsSortedByEmum;
        this.ListSortDirection = ListSortDirection;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], TransactionListHeadlineComponent.prototype, "isLoading", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TransactionListHeadlineComponent.prototype, "sorter", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], TransactionListHeadlineComponent.prototype, "sorterChange", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TransactionListHeadlineComponent.prototype, "sortedReverse", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], TransactionListHeadlineComponent.prototype, "sortedReverseChange", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], TransactionListHeadlineComponent.prototype, "excludedColumn", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], TransactionListHeadlineComponent.prototype, "canEditTransactions", void 0);
TransactionListHeadlineComponent = __decorate([
    Component({
        selector: 'p-transaction-list-headline',
        templateUrl: './transaction-list-headline.component.html',
        styleUrls: ['./transaction-list-headline.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], TransactionListHeadlineComponent);
export { TransactionListHeadlineComponent };
//# sourceMappingURL=transaction-list-headline.component.js.map