import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShiftModelComponent } from './shiftmodel.component';
export const ROUTES = [
    {
        path: 'copy',
        children: [
            { path: '', redirectTo: '0', pathMatch: 'full' },
            { path: ':id/:opentab', component: ShiftModelComponent },
            { path: ':id', component: ShiftModelComponent },
        ],
    },
    {
        path: '',
        children: [
            { path: '', redirectTo: '0', pathMatch: 'full' },
            { path: ':id/:opentab', component: ShiftModelComponent },
            { path: ':id', component: ShiftModelComponent },
        ],
    },
];
let ShiftModelRoutingModule = class ShiftModelRoutingModule {
};
ShiftModelRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(ROUTES)],
        exports: [RouterModule],
    })
], ShiftModelRoutingModule);
export { ShiftModelRoutingModule };
//# sourceMappingURL=shiftmodel-routing.module.js.map