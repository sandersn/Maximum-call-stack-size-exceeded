import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { CoreModule } from '@plano/shared/core/core.module';
import { EditableDirective, EditableTriggerFocussableDirective, EditableTriggerClickableDirective, EditableSuccessButtonDirective, EditableDismissButtonDirective, EditableInstantSaveButtonDirective, PVisibleInEditModeDirective, HiddenInEditModeDirective } from './editable/editable.directive';
import { PEditableBoxComponent, PEditableBoxFormComponent, PEditableBoxHeaderComponent, PEditableBoxShowroomComponent, } from './p-editable-box/p-editable-box.component';
import { PEditableModalButtonComponent, PEditableModalButtonFormComponent, PEditableModalButtonHeaderComponent, } from './p-editable-modal-button/p-editable-modal-button.component';
import { PFaIconModule } from '../../../shared/core/component/fa-icon/fa-icon.module';
let PEditableModule = class PEditableModule {
};
PEditableModule = __decorate([
    NgModule({
        imports: [
            CoreModule,
            PFaIconModule,
        ],
        declarations: [
            EditableDirective,
            EditableDismissButtonDirective,
            EditableInstantSaveButtonDirective,
            EditableSuccessButtonDirective,
            EditableTriggerClickableDirective,
            EditableTriggerFocussableDirective,
            HiddenInEditModeDirective,
            PEditableBoxComponent,
            PEditableBoxFormComponent,
            PEditableBoxHeaderComponent,
            PEditableBoxShowroomComponent,
            PEditableModalButtonComponent,
            PEditableModalButtonFormComponent, PEditableModalButtonHeaderComponent, PVisibleInEditModeDirective,
        ],
        exports: [
            EditableDirective,
            EditableDismissButtonDirective,
            EditableInstantSaveButtonDirective,
            EditableSuccessButtonDirective,
            EditableTriggerClickableDirective,
            EditableTriggerFocussableDirective,
            HiddenInEditModeDirective,
            PEditableBoxComponent,
            PEditableBoxFormComponent,
            PEditableBoxHeaderComponent, PEditableBoxShowroomComponent,
            PEditableModalButtonComponent,
            PEditableModalButtonFormComponent, PEditableModalButtonHeaderComponent, PVisibleInEditModeDirective,
        ],
    })
], PEditableModule);
export { PEditableModule };
//# sourceMappingURL=p-editable.module.js.map