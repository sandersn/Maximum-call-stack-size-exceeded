import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CoreModule } from '@plano/shared/core/core.module';
import { TransactionListHeadlineComponent } from './transaction-list-headline/transaction-list-headline.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionTotalsComponent } from './transaction-totals/transaction-totals.component';
import { PFormsModule } from '../p-forms/p-forms.module';
import { PListsModule } from '../p-lists/p-lists.module';
import { SharedModule } from '../shared/shared.module';
let PTransactionsModule = class PTransactionsModule {
};
PTransactionsModule = __decorate([
    NgModule({
        imports: [
            CoreModule,
            PFormsModule,
            PListsModule,
            SharedModule,
        ],
        declarations: [
            TransactionListComponent,
            TransactionListHeadlineComponent,
            TransactionTotalsComponent,
        ],
        providers: [],
        exports: [
            TransactionListComponent,
            TransactionListHeadlineComponent,
            TransactionTotalsComponent,
        ],
    })
], PTransactionsModule);
export { PTransactionsModule };
//# sourceMappingURL=p-transactions.module.js.map