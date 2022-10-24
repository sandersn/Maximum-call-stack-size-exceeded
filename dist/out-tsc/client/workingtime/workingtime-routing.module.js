import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WorkingtimeComponent } from './workingtime.component';
export const ROUTES = [
    {
        path: '',
        children: [
            { path: '', redirectTo: '0', pathMatch: 'full' },
            { path: ':id', component: WorkingtimeComponent },
        ],
    },
];
let WorkingtimeRoutingModule = class WorkingtimeRoutingModule {
};
WorkingtimeRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(ROUTES)],
        exports: [RouterModule],
    })
], WorkingtimeRoutingModule);
export { WorkingtimeRoutingModule };
//# sourceMappingURL=workingtime-routing.module.js.map