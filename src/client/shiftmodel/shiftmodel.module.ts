import { NgModule } from '@angular/core';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import {
	PShiftAndShiftmodelFormModule,
} from '@plano/client/shared/component/p-shift-and-shiftmodel-form/p-shift-and-shiftmodel-form.module';
import { PFormsModule } from '@plano/client/shared/p-forms/p-forms.module';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { DetailFormComponent } from './detail-form/detail-form.component';
import { ShiftModelRoutingModule } from './shiftmodel-routing.module';
import { ShiftModelComponent } from './shiftmodel.component';
import { PNoItemsModule } from '../shared/p-no-items/p-no-items.module';
import { PShiftModelModule } from '../shared/p-shiftmodel/p-shiftmodel.module';

@NgModule({
	imports: [
		ClientSharedModule,
		CoreModule,
		PFormsModule,
		PNoItemsModule,
		PShiftAndShiftmodelFormModule,
		PShiftModelModule,
		ScrollShadowBoxModule,
		ShiftModelRoutingModule,
	],
	declarations: [
		DetailFormComponent,
		ShiftModelComponent,
	],
	exports: [
		ShiftModelComponent,
	],
})
export class ShiftModelModule {}
