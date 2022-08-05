/* eslint-disable @angular-eslint/sort-ngmodule-metadata-arrays */
import { NgModule } from '@angular/core';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { PFormsModule } from '@plano/client/shared/p-forms/p-forms.module';
import { PListsModule } from '@plano/client/shared/p-lists/p-lists.module';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { PCurrencyPipe } from '@plano/shared/core/pipe/p-currency.pipe';
import { AbsenceRoutingModule } from './absence-routing.module';
import { PAbsenceComponent } from './absence.component';
import { DetailFormComponent } from './detail-form/detail-form.component';
import { PAbsenceDetailFormService } from './detail-form/detail-form.service';
import { PGridModule } from '../../shared/core/component/grid/grid.module';
import { PEditableFormsModule } from '../shared/p-editable-forms/p-editable-forms.module';
import { PMemberModule } from '../shared/p-member/p-member.module';
import { PNoItemsModule } from '../shared/p-no-items/p-no-items.module';
import { PShiftExchangeModule } from '../shared/p-shift-exchange/p-shift-exchange.module';


@NgModule({
	imports: [
		CoreModule,
		PFormsModule,
		PEditableFormsModule,
		ClientSharedModule,
		PMemberModule,
		PListsModule,
		AbsenceRoutingModule,
		PShiftExchangeModule,
		ScrollShadowBoxModule,
		PNoItemsModule,
		PGridModule,
	],
	declarations: [
		PAbsenceComponent,
		DetailFormComponent,
	],
	providers: [
		PCurrencyPipe,
		PAbsenceDetailFormService,
	],
	exports: [
		PAbsenceComponent,
	],
})
export class AbsenceModule {}
