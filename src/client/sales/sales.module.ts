import { NgModule } from '@angular/core';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { BookingsComponent } from './bookings/bookings.component';
import { GiftCardsComponent } from './gift-cards/gift-cards.component';
import { PGiftCardsService } from './gift-cards/gift-cards.service';
import { SalesRoutingModule } from './sales-routing.module';
import { SalesComponent } from './sales.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { PTransactionsService } from './transactions/transactions.service';
import { PGridModule } from '../../shared/core/component/grid/grid.module';
import { PBookingsModule } from '../scheduling/shared/p-bookings/p-bookings.module';
import { PCollapsibleModule } from '../shared/p-collapsible/p-collapsible.module';
import { PFormsModule } from '../shared/p-forms/p-forms.module';
import { PLedModule } from '../shared/p-led/p-led.module';
import { PListsModule } from '../shared/p-lists/p-lists.module';
import { PNoItemsModule } from '../shared/p-no-items/p-no-items.module';
import { PSidebarModule } from '../shared/p-sidebar/p-sidebar.module';
import { PTabsModule } from '../shared/p-tabs/p-tabs.module';
import { PTransactionsModule } from '../shared/p-transactions/p-transactions.module';
import { PageModule } from '../shared/page/page.module';
import { SharedModule } from '../shared/shared/shared.module';

@NgModule({
	imports: [
		CoreModule,
		PageModule,
		PBookingsModule,
		PCollapsibleModule,
		PFormsModule,
		PGridModule,
		PLedModule,
		PListsModule,
		PNoItemsModule,
		PSidebarModule,
		PTabsModule,
		PTransactionsModule,
		SalesRoutingModule,
		ScrollShadowBoxModule,
		SharedModule,
	],
	providers: [
		PGiftCardsService,
		PTransactionsService,
	],
	declarations: [
		BookingsComponent,
		GiftCardsComponent,
		SalesComponent,
		TransactionsComponent,
	],
	exports: [
	],
})
export class SalesModule { }
