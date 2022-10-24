import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CoreModule } from '@plano/shared/core/core.module';
import { PBadgeComponent } from './p-badge/p-badge.component';
let SharedModule = class SharedModule {
};
SharedModule = __decorate([
    NgModule({
        imports: [
            CoreModule,
        ],
        declarations: [
            PBadgeComponent,
        ],
        providers: [],
        exports: [
            PBadgeComponent,
        ],
    })
], SharedModule);
export { SharedModule };
//# sourceMappingURL=shared.module.js.map