import { __decorate } from "tslib";
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PCollapsibleComponent } from './p-collapsible.component';
import { PFaIconModule } from '../../../shared/core/component/fa-icon/fa-icon.module';
let PCollapsibleModule = class PCollapsibleModule {
};
PCollapsibleModule = __decorate([
    NgModule({
        imports: [
            CommonModule,
            PFaIconModule,
        ],
        exports: [PCollapsibleComponent],
        declarations: [PCollapsibleComponent],
        providers: [],
    })
], PCollapsibleModule);
export { PCollapsibleModule };
//# sourceMappingURL=p-collapsible.module.js.map