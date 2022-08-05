import { NgModule } from '@angular/core';
import { PBookingsModule } from '@plano/client/scheduling/shared/p-bookings/p-bookings.module';
import { PSchedulingCalendarModule } from '@plano/client/scheduling/shared/p-scheduling-calendar/p-calendar.module';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { PFormsModule } from '@plano/client/shared/p-forms/p-forms.module';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { PBookingFormService } from './booking-form.service';
import { BookingRoutingModule } from './booking-routing.module';
import { BookingComponent } from './booking.component';
import { DetailFormComponent } from './detail-form/detail-form.component';
import { PParticipantsComponent } from './detail-form/p-participants/p-participants.component';
import { PParticipantsService } from './detail-form/p-participants/p-participants.service';
import { PShiftSelectionComponent } from './detail-form/p-shift-selection/p-shift-selection.component';
import { PFaIconModule } from '../../shared/core/component/fa-icon/fa-icon.module';
import { PGridModule } from '../../shared/core/component/grid/grid.module';
import { SalesModule } from '../sales/sales.module';
import { SalesSharedModule } from '../sales/shared/sales-shared.module';
import { PCalendarModule } from '../shared/p-calendar/p-calendar.module';
import { PEditableFormsModule } from '../shared/p-editable-forms/p-editable-forms.module';
import { PNoItemsModule } from '../shared/p-no-items/p-no-items.module';
import { PShiftExchangeModule } from '../shared/p-shift-exchange/p-shift-exchange.module';
import { PShiftModule } from '../shared/p-shift-module/p-shift.module';
import { PTabsModule } from '../shared/p-tabs/p-tabs.module';
import { PTransactionsModule } from '../shared/p-transactions/p-transactions.module';
import { PageModule } from '../shared/page/page.module';
import { SharedModule } from '../shared/shared/shared.module';

@NgModule({
	imports: [
		BookingRoutingModule,
		ClientSharedModule,
		CoreModule,
		PageModule,
		PBookingsModule,
		PCalendarModule,
		PEditableFormsModule,
		PFaIconModule,
		PFormsModule,
		PGridModule,
		PNoItemsModule,
		PSchedulingCalendarModule,
		PShiftExchangeModule,
		PShiftModule,
		PTabsModule,
		PTransactionsModule,
		SalesModule,
		SalesSharedModule,
		ScrollShadowBoxModule,
		SharedModule,
	],
	declarations: [
		BookingComponent,
		DetailFormComponent,
		PParticipantsComponent,
		PShiftSelectionComponent,
	],
	providers: [
		PBookingFormService,
		PParticipantsService,
	],
	exports: [
		BookingComponent,
	],
})
export class BookingModule {}
