import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TestAccountComponent } from './test-account.component';
export const ROUTES = [
    { path: '', component: TestAccountComponent },
];
let TestaccountRoutingModule = class TestaccountRoutingModule {
};
TestaccountRoutingModule = __decorate([
    NgModule({
        imports: [RouterModule.forChild(ROUTES)],
        exports: [RouterModule],
    })
], TestaccountRoutingModule);
export { TestaccountRoutingModule };
//# sourceMappingURL=test-account-routing.module.js.map