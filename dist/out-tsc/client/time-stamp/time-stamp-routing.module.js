import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TimeStampComponent } from './time-stamp.component';
export const ROUTES = [
    {
        path: '',
        component: TimeStampComponent,
    },
];
let TimeStampRoutingModule = class TimeStampRoutingModule {
};
TimeStampRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(ROUTES)],
        exports: [RouterModule],
    })
], TimeStampRoutingModule);
export { TimeStampRoutingModule };
//# sourceMappingURL=time-stamp-routing.module.js.map