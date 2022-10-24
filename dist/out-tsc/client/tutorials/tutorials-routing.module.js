import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TutorialsComponent } from './tutorials.component';
export const ROUTES = [
    { path: '', component: TutorialsComponent },
];
let TutorialsRoutingModule = class TutorialsRoutingModule {
};
TutorialsRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(ROUTES)],
        exports: [RouterModule],
    })
], TutorialsRoutingModule);
export { TutorialsRoutingModule };
//# sourceMappingURL=tutorials-routing.module.js.map