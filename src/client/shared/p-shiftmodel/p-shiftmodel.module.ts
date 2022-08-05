import { NgModule } from '@angular/core';
import { CoreModule } from '@plano/shared/core/core.module';
import { ColorMarkerComponent } from './color-marker/color-marker.component';
import { PShiftmodelListItemComponent } from './shiftmodel-list-item/shiftmodel-list-item.component';
import { PShiftmodelListComponent } from './shiftmodel-list/shiftmodel-list.component';
import { PTariffMetaInfoComponent } from './tariff-meta-info/tariff-meta-info.component';
import { PListsModule } from '../p-lists/p-lists.module';

@NgModule({
	imports: [
		CoreModule,
		PListsModule,
	],
	declarations: [
		ColorMarkerComponent,
		PShiftmodelListComponent,
		PShiftmodelListItemComponent,
		PTariffMetaInfoComponent,
	],
	providers: [
	],
	exports: [
		ColorMarkerComponent,
		PShiftmodelListComponent,
		PShiftmodelListItemComponent,
		PTariffMetaInfoComponent,
	],
})
export class PShiftModelModule {}
