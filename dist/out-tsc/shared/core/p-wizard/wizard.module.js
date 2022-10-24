import { __decorate } from "tslib";
import { NgWizardModule, THEME } from 'ng-wizard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
const ngWizardConfig = {
    theme: THEME.dots,
};
let PWizardModule = class PWizardModule {
};
PWizardModule = __decorate([
    NgModule({
        declarations: [],
        imports: [
            CommonModule,
            NgWizardModule.forRoot(ngWizardConfig),
        ],
        exports: [
            NgWizardModule,
        ],
    })
], PWizardModule);
export { PWizardModule };
//# sourceMappingURL=wizard.module.js.map