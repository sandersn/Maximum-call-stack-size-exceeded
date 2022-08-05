
/* eslint-disable @angular-eslint/sort-ngmodule-metadata-arrays */
// NOTE: 	[PLANO-62957] It looks like sorting has effect on routing. Routing for /client breaks when i let eslint sort this file.
// 				Seems to me like something is wrong with the AppRoutingModule or ClientRoutingModule

import { NgModule } from '@angular/core';
import { PBookingsModule } from '@plano/client/scheduling/shared/p-bookings/p-bookings.module';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { PFormsModule } from '@plano/client/shared/p-forms/p-forms.module';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { DetailFormComponent } from './detail-form/detail-form.component';
import { TransactionRoutingModule } from './transaction-routing.module';
import { TransactionComponent } from './transaction.component';
import { PGridModule } from '../../shared/core/component/grid/grid.module';
import { SalesModule } from '../sales/sales.module';
import { PMemberModule } from '../shared/p-member/p-member.module';
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
		TransactionRoutingModule,
		PNoItemsModule,
		SalesModule,
		PageModule,
		SharedModule,
		PTransactionsModule,
		PMemberModule,
		PGridModule,
	],
	declarations: [
		TransactionComponent,
		DetailFormComponent,
	],
	providers: [
	],
	exports: [
	],
})
export class TransactionModule {}
