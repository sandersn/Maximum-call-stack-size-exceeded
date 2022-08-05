import { NgModule } from '@angular/core';
import { PSchedulingCalendarModule } from '@plano/client/scheduling/shared/p-scheduling-calendar/p-calendar.module';
import { PShiftItemModule } from '@plano/client/scheduling/shared/p-scheduling-calendar/p-shift-item-module/p-shift-item.module';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { POfferPickerComponent } from './p-offer-picker/p-offer-picker.component';
import { PShiftPickerModalBoxComponent } from './p-shift-picker-modal-box/p-shift-picker-modal-box.component';
import { PShiftPickerService } from './p-shift-picker.service';
import { PShiftPickerComponent } from './p-shift-picker/p-shift-picker.component';
import { PickedOfferComponent } from './picked-offer/picked-offer.component';
import { PShiftPickerCalendarComponent } from './shift-picker-calendar/shift-picker-calendar.component';
import { PShiftPickerPickedOffersComponent } from './shift-picker-picked-offers/shift-picker-picked-offers.component';
import { ShiftRefsComponent } from './shift-refs/shift-refs.component';
import { ClientSharedModule } from '../client-shared.module';
import { PCalendarModule } from '../p-calendar/p-calendar.module';
import { PEditableFormsModule } from '../p-editable-forms/p-editable-forms.module';
import { PEditableModule } from '../p-editable/p-editable.module';
import { PFormsModule } from '../p-forms/p-forms.module';
import { PMemberModule } from '../p-member/p-member.module';
import { PShiftExchangeModule } from '../p-shift-exchange/p-shift-exchange.module';
import { PShiftModule } from '../p-shift-module/p-shift.module';
import { PageModule } from '../page/page.module';

@NgModule({
	imports: [
		ClientSharedModule,
		CoreModule,
		PageModule,
		PCalendarModule,
		PEditableFormsModule,
		PEditableModule,
		PFormsModule,
		PMemberModule,
		PSchedulingCalendarModule,
		PShiftExchangeModule,
		PShiftItemModule,
		PShiftModule,
		ScrollShadowBoxModule,
	],
	declarations: [
		PickedOfferComponent,
		POfferPickerComponent,
		PShiftPickerCalendarComponent,
		PShiftPickerComponent,
		PShiftPickerModalBoxComponent,
		PShiftPickerPickedOffersComponent,
		ShiftRefsComponent,
	],
	providers: [
		PDatePipe,
		PShiftPickerService,
	],
	exports: [
		PickedOfferComponent,
		POfferPickerComponent,
		PShiftPickerComponent,
		PShiftPickerModalBoxComponent,
	],
})
export class PShiftPickerModule {}
