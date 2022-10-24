import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CoreModule } from '@plano/shared/core/core.module';
import { AttributeInfoComponentBaseDirective } from './attribute-info-component-base';
let PAttributeInfoModule = class PAttributeInfoModule {
};
PAttributeInfoModule = __decorate([
    NgModule({
        imports: [
            CoreModule,
        ],
        declarations: [
            AttributeInfoComponentBaseDirective,
        ],
        providers: [],
        exports: [
            AttributeInfoComponentBaseDirective,
        ],
    })
], PAttributeInfoModule);
export { PAttributeInfoModule };
//# sourceMappingURL=attribute-info.module.js.map