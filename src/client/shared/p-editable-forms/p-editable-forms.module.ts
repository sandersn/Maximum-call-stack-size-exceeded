import { NgModule } from '@angular/core';
import { CoreModule } from '@plano/shared/core/core.module';
import {
	PEditableModalBoxComponent,
	PEditableModalBoxFormComponent, PEditableModalBoxHeaderComponent, PEditableModalBoxShowroomComponent,
} from './p-editable-modal-box/p-editable-modal-box.component';
import { PEditableModule } from '../p-editable/p-editable.module';
import { PFormsModule } from '../p-forms/p-forms.module';

@NgModule({
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
export class PEditableFormsModule {}
