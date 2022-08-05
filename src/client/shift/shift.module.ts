import { NgModule } from '@angular/core';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { PShiftAndShiftmodelFormModule } from '@plano/client/shared/component/p-shift-and-shiftmodel-form/p-shift-and-shiftmodel-form.module';
import { PFormsModule } from '@plano/client/shared/p-forms/p-forms.module';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { DetailFormComponent } from './detail-form/detail-form.component';
import { ShiftComponent } from './shift.component';
import { PNoItemsModule } from '../shared/p-no-items/p-no-items.module';
import { PTransmissionModule } from '../shared/p-transmission/p-transmission.module';

@NgModule({
	imports: [
		ClientSharedModule,
		CoreModule,
		PFormsModule,
		PNoItemsModule,
		PShiftAndShiftmodelFormModule,
		PTransmissionModule,
		ScrollShadowBoxModule,
	],
	declarations: [
		DetailFormComponent,
		ShiftComponent,
	],
	providers: [
	],
	exports: [
		ShiftComponent,
	],
})
export class ShiftModule {}
