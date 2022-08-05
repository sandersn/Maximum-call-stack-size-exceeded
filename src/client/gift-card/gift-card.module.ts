/* eslint-disable @angular-eslint/sort-ngmodule-metadata-arrays */
import { NgModule } from '@angular/core';
import { PBookingsModule } from '@plano/client/scheduling/shared/p-bookings/p-bookings.module';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { PFormsModule } from '@plano/client/shared/p-forms/p-forms.module';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { DetailFormComponent } from './detail-form/detail-form.component';
import { GiftCardRoutingModule } from './gift-card-routing.module';
import { GiftCardComponent } from './gift-card.component';
import { PGridModule } from '../../shared/core/component/grid/grid.module';
import { SalesModule } from '../sales/sales.module';
import { SalesSharedModule } from '../sales/shared/sales-shared.module';
import { PNoItemsModule } from '../shared/p-no-items/p-no-items.module';
import { PTransactionsModule } from '../shared/p-transactions/p-transactions.module';
import { PageModule } from '../shared/page/page.module';
import { SharedModule } from '../shared/shared/shared.module';

@NgModule({
	imports: [
		CoreModule,
		PFormsModule,
		ClientSharedModule,
		PBookingsModule,
		ScrollShadowBoxModule,
		GiftCardRoutingModule,
		PNoItemsModule,
		SalesModule,
		PageModule,
		SharedModule,
		PTransactionsModule,
		PGridModule,
		SalesSharedModule,
	],
	declarations: [
		GiftCardComponent,
		DetailFormComponent,
	],
	providers: [
	],
	exports: [
	],
})
export class GiftCardModule {}
