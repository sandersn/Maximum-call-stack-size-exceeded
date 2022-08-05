import { NgxPopperjsModule } from 'ngx-popperjs';
import { NgModule } from '@angular/core';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { PShiftExchangeCommunicationModalComponent } from './detail-form/p-shift-exchange-communication/p-shift-exchange-communication-modal/p-shift-exchange-communication-modal.component';
import { PShiftExchangeCommunicationComponent } from './detail-form/p-shift-exchange-communication/p-shift-exchange-communication.component';
import { ShiftExchangeDetailFormComponent } from './detail-form/shift-exchange-detail-form.component';
import { PShiftExchangeRelatedAbsenceComponent } from './detail-form/shift-exchange-related-absences/shift-exchange-related-absence/shift-exchange-related-absence.component';
import { PShiftExchangeRelatedAbsencesComponent } from './detail-form/shift-exchange-related-absences/shift-exchange-related-absences.component';
import { PGenerateAbsencesOptionsComponent } from './generate-absences-options/generate-absences-options.component';
import { PGenerateShiftExchangesOptionsComponent } from './generate-shift-exchanges-options/generate-shift-exchanges-options.component';
import { ShiftExchangeComponent } from './shift-exchange.component';
import { CoreComponentsModule } from '../../shared/core/component/core-components.module';
import { PGridModule } from '../../shared/core/component/grid/grid.module';
import { ReportModule } from '../report/report.module';
import { PSchedulingCalendarModule } from '../scheduling/shared/p-scheduling-calendar/p-calendar.module';
import { PShiftItemModule } from '../scheduling/shared/p-scheduling-calendar/p-shift-item-module/p-shift-item.module';
import { PWishesService } from '../scheduling/wishes.service';
import { ClientSharedModule } from '../shared/client-shared.module';
import { PAccountFormService } from '../shared/p-account-form/p-account-form.service';
import { PCalendarModule } from '../shared/p-calendar/p-calendar.module';
import { PEditableFormsModule } from '../shared/p-editable-forms/p-editable-forms.module';
import { PFormsModule } from '../shared/p-forms/p-forms.module';
import { PMemberModule } from '../shared/p-member/p-member.module';
import { PNoItemsModule } from '../shared/p-no-items/p-no-items.module';
import { PShiftExchangeModule } from '../shared/p-shift-exchange/p-shift-exchange.module';
import { PShiftModule } from '../shared/p-shift-module/p-shift.module';
import { PShiftPickerModule } from '../shared/p-shift-picker/p-shift-picker.module';
import { PSidebarModule } from '../shared/p-sidebar/p-sidebar.module';
import { PageModule } from '../shared/page/page.module';
import { ShiftExchangesService } from '../shift-exchanges/shift-exchanges.service';
// FIXME: Something with providedIn: 'root' is broken
// import { ShiftExchangeRoutingModule } from './shift-exchange-routing.module';

@NgModule({
	imports: [
		// FIXME: Something with providedIn: 'root' is broken
		// ShiftExchangeRoutingModule,
		ClientSharedModule,
		CoreComponentsModule,
		CoreModule,
		NgxPopperjsModule,
		PageModule,
		PCalendarModule,
		PEditableFormsModule,
		PFormsModule,
		PGridModule,
		PMemberModule,
		PNoItemsModule,
		PSchedulingCalendarModule,
		PShiftExchangeModule,
		PShiftItemModule,
		PShiftModule,
		PShiftPickerModule,
		PSidebarModule,
		ReportModule,
		ScrollShadowBoxModule,
	],
	declarations: [
		PGenerateAbsencesOptionsComponent,
		PGenerateShiftExchangesOptionsComponent,
		PShiftExchangeCommunicationComponent,
		PShiftExchangeCommunicationModalComponent,
		PShiftExchangeRelatedAbsenceComponent,
		PShiftExchangeRelatedAbsencesComponent,
		ShiftExchangeComponent,
		ShiftExchangeDetailFormComponent,
	],
	providers: [
		PAccountFormService,
		PWishesService,
		ShiftExchangesService,
	],
	exports: [
		PShiftExchangeRelatedAbsencesComponent,
		ShiftExchangeComponent,
		ShiftExchangeComponent,
	],
})
export class ShiftExchangeModule {}
