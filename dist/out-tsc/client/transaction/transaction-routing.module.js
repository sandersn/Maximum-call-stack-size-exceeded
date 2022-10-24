import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TransactionComponent } from './transaction.component';
export const ROUTES = [
    {
        path: '',
        children: [
            { path: '', redirectTo: '0', pathMatch: 'full' },
            { path: ':id', component: TransactionComponent },
            { path: ':id/:opentab', component: TransactionComponent },
        ],
    },
];
let TransactionRoutingModule = class TransactionRoutingModule {
};
TransactionRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(ROUTES)],
        exports: [RouterModule],
    })
], TransactionRoutingModule);
export { TransactionRoutingModule };
//# sourceMappingURL=transaction-routing.module.js.map