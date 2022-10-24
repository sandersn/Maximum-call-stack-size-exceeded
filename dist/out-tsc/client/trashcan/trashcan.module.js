import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { TrashcanComponent } from './trashcan.component';
let TrashcanModule = class TrashcanModule {
};
TrashcanModule = __decorate([
    NgModule({
        declarations: [
            TrashcanComponent,
        ],
        imports: [
            ClientSharedModule,
            CoreModule,
            // MemberModule
        ],
        providers: [],
        exports: [
            TrashcanComponent,
        ],
    })
], TrashcanModule);
export { TrashcanModule };
//# sourceMappingURL=trashcan.module.js.map