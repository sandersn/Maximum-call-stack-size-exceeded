/* eslint-disable @angular-eslint/sort-ngmodule-metadata-arrays */
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { PFormsModule } from '@plano/client/shared/p-forms/p-forms.module';
import { PListsModule } from '@plano/client/shared/p-lists/p-lists.module';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { AssignShiftmodelsComponent } from './detail-form/assign-shiftmodels/assign-shiftmodels.component';
import { PInputShiftmodelEarningsComponent } from './detail-form/assign-shiftmodels/p-input-shiftmodel-earnings/p-input-shiftmodel-earnings.component';
import { DetailFormComponent } from './detail-form/detail-form.component';
import { MemberRoutingModule } from './member-routing.module';
import { MemberComponent } from './member.component';
import { PGridModule } from '../../shared/core/component/grid/grid.module';
import { PEditableFormsModule } from '../shared/p-editable-forms/p-editable-forms.module';
import { PMemberModule } from '../shared/p-member/p-member.module';
import { PNoItemsModule } from '../shared/p-no-items/p-no-items.module';

@NgModule({
	imports: [
		CoreModule,
		PFormsModule,
		PEditableFormsModule,
		PListsModule,
		PMemberModule,
		ClientSharedModule,
		MemberRoutingModule,
		NgbDatepickerModule,
		ScrollShadowBoxModule,
		PNoItemsModule,
		PGridModule,
	],
	declarations: [
		MemberComponent,
		DetailFormComponent,
		AssignShiftmodelsComponent,
		PInputShiftmodelEarningsComponent,
	],
	providers: [
	],
	exports: [
		MemberComponent,
	],
})
export class MemberModule {}
