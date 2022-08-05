import { NgxPopperjsModule } from 'ngx-popperjs';
import { NgModule } from '@angular/core';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { ShiftExchangesRoutingModule } from './shift-exchanges-routing.module';
import { ShiftExchangesComponent } from './shift-exchanges.component';
import { ShiftExchangesService } from './shift-exchanges.service';
import { PSchedulingCalendarModule } from '../scheduling/shared/p-scheduling-calendar/p-calendar.module';
import { ClientSharedModule } from '../shared/client-shared.module';
import { PAccountFormService } from '../shared/p-account-form/p-account-form.service';
import { PCalendarModule } from '../shared/p-calendar/p-calendar.module';
import { PFormsModule } from '../shared/p-forms/p-forms.module';
import { PMemberModule } from '../shared/p-member/p-member.module';
import { PShiftExchangeModule } from '../shared/p-shift-exchange/p-shift-exchange.module';
import { PShiftModule } from '../shared/p-shift-module/p-shift.module';
import { PShiftPickerModule } from '../shared/p-shift-picker/p-shift-picker.module';
import { PSidebarModule } from '../shared/p-sidebar/p-sidebar.module';

@NgModule({
	imports: [
		ClientSharedModule,
		CoreModule,
		NgxPopperjsModule,
		PCalendarModule,
		PFormsModule,
		PMemberModule,
		PSchedulingCalendarModule,
		PShiftExchangeModule,
		PShiftModule,
		PShiftPickerModule,
		PSidebarModule,
		ScrollShadowBoxModule,
		ShiftExchangesRoutingModule,
	],
	declarations: [
		ShiftExchangesComponent,
	],
	providers: [
		PAccountFormService,
		ShiftExchangesService,
	],
	exports: [
		ShiftExchangesComponent,
	],
})
export class ShiftExchangesModule {}
