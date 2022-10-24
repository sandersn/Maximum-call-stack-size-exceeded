import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShiftExchangesComponent } from './shift-exchanges.component';
export const ROUTES = [
    {
        path: '',
        component: ShiftExchangesComponent,
    },
    { path: ':start', component: ShiftExchangesComponent },
    { path: ':start/:end', component: ShiftExchangesComponent },
];
let ShiftExchangesRoutingModule = class ShiftExchangesRoutingModule {
};
ShiftExchangesRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(ROUTES)],
        exports: [RouterModule],
    })
], ShiftExchangesRoutingModule);
export { ShiftExchangesRoutingModule };
//# sourceMappingURL=shift-exchanges-routing.module.js.map