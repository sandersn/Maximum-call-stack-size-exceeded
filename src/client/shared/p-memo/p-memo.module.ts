import { NgModule } from '@angular/core';
import { CoreModule } from '@plano/shared/core/core.module';
import { PMemoModalContentComponent } from './p-memo-modal-content/p-memo-modal-content.component';
import { PFormsModule } from '../p-forms/p-forms.module';
import { PShiftModule } from '../p-shift-module/p-shift.module';

@NgModule({
	imports: [
		CoreModule,
		PFormsModule,
		PShiftModule,
	],
	declarations: [
		PMemoModalContentComponent,
	],
	providers: [
	],
	exports: [
		PMemoModalContentComponent,
	],
})
export class PMemoModule {}
