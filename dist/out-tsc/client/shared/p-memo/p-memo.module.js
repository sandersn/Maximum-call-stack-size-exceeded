import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CoreModule } from '@plano/shared/core/core.module';
import { PMemoModalContentComponent } from './p-memo-modal-content/p-memo-modal-content.component';
import { PFormsModule } from '../p-forms/p-forms.module';
import { PShiftModule } from '../p-shift-module/p-shift.module';
let PMemoModule = class PMemoModule {
};
PMemoModule = __decorate([
    NgModule({
        imports: [
            CoreModule,
            PFormsModule,
            PShiftModule,
        ],
        declarations: [
            PMemoModalContentComponent,
        ],
        providers: [],
        exports: [
            PMemoModalContentComponent,
        ],
    })
], PMemoModule);
export { PMemoModule };
//# sourceMappingURL=p-memo.module.js.map