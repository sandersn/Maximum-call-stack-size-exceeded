import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CoreModule } from '@plano/shared/core/core.module';
import { PEditableModalBoxComponent, PEditableModalBoxFormComponent, PEditableModalBoxHeaderComponent, PEditableModalBoxShowroomComponent, } from './p-editable-modal-box/p-editable-modal-box.component';
import { PEditableModule } from '../p-editable/p-editable.module';
import { PFormsModule } from '../p-forms/p-forms.module';
let PEditableFormsModule = class PEditableFormsModule {
};
PEditableFormsModule = __decorate([
    NgModule({
        imports: [
            CoreModule,
            PEditableModule,
            PFormsModule,
        ],
        declarations: [
            PEditableModalBoxComponent,
            PEditableModalBoxFormComponent, PEditableModalBoxHeaderComponent, PEditableModalBoxShowroomComponent,
        ],
        exports: [
            PEditableModalBoxComponent,
            PEditableModalBoxFormComponent, PEditableModalBoxHeaderComponent, PEditableModalBoxShowroomComponent,
        ],
    })
], PEditableFormsModule);
export { PEditableFormsModule };
//# sourceMappingURL=p-editable-forms.module.js.map