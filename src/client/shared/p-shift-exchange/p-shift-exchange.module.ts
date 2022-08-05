import { NgModule } from '@angular/core';
import { CoreModule } from '@plano/shared/core/core.module';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { PDeadlineComponent } from './deadline/deadline.component';
import { PShiftExchangeBtnComponent } from './p-shift-exchange-btn/p-shift-exchange-btn.component';
import { PShiftExchangeConceptService } from './p-shift-exchange-concept.service';
import { PShiftExchangeListItemComponent } from './p-shift-exchange-list-item/p-shift-exchange-list-item.component';
import { PShiftExchangeListComponent } from './p-shift-exchange-list/p-shift-exchange-list.component';
import { PShiftExchangeListService } from './p-shift-exchange-list/p-shift-exchange-list.service';
import { PShiftExchangeStateBadgeComponent } from './p-shift-exchange-state-badge/p-shift-exchange-state-badge.component';
import { PShiftsInfoComponent, PShiftInfoContentLeftComponent, PShiftInfoContentRightComponent, PShiftInfoContentInsideBasicInfoComponent } from './p-shifts-info/p-shifts-info.component';
import { PShiftExchangeService } from './shift-exchange.service';
import { ClientSharedModule } from '../client-shared.module';
import { ClientSharedComponentsModule } from '../component/client-shared-components.module';
import { PAttributeInfoModule } from '../p-attribute-info/attribute-info.module';
import { PEditableFormsModule } from '../p-editable-forms/p-editable-forms.module';
import { PEditableModule } from '../p-editable/p-editable.module';
import { PFormsModule } from '../p-forms/p-forms.module';
import { PListsModule } from '../p-lists/p-lists.module';
import { PMemberModule } from '../p-member/p-member.module';
import { PShiftModelModule } from '../p-shiftmodel/p-shiftmodel.module';
import { ClientPipesModule } from '../pipe/client-pipes.module';

@NgModule({
	imports: [
		ClientPipesModule,
		ClientSharedComponentsModule,
		ClientSharedModule,
		CoreModule,
		PAttributeInfoModule,
		PEditableFormsModule,
		PEditableModule,
		PFormsModule,
		PListsModule,
		PMemberModule,
		PShiftModelModule,
	],
	declarations: [
		PDeadlineComponent,
		PShiftExchangeBtnComponent,
		PShiftExchangeListComponent,
		PShiftExchangeListItemComponent,
		PShiftExchangeStateBadgeComponent,
		PShiftInfoContentInsideBasicInfoComponent,
		PShiftInfoContentLeftComponent,
		PShiftInfoContentRightComponent,
		PShiftsInfoComponent,
	],
	providers: [
		PDatePipe,
		PShiftExchangeConceptService,
		PShiftExchangeListService,
		PShiftExchangeService,
	],
	exports: [
		PAttributeInfoModule,
		PDeadlineComponent,
		PShiftExchangeBtnComponent,
		PShiftExchangeListComponent,
		PShiftExchangeListItemComponent,
		PShiftExchangeStateBadgeComponent,
		PShiftInfoContentInsideBasicInfoComponent,
		PShiftInfoContentLeftComponent,
		PShiftInfoContentRightComponent,
		PShiftsInfoComponent,
	],
})
export class PShiftExchangeModule {}
