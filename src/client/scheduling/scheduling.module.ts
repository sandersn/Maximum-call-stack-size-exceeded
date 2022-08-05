/* eslint-disable @angular-eslint/sort-ngmodule-metadata-arrays */
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { PFormsModule } from '@plano/client/shared/p-forms/p-forms.module';
import { PListsModule } from '@plano/client/shared/p-lists/p-lists.module';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { CourseFilterService } from './course-filter.service';
import { EarlyBirdService } from './early-bird.service';
import { SchedulingFilterService } from './scheduling-filter.service';
import { SchedulingComponent } from './scheduling.component';
import { SchedulingService } from './scheduling.service';
import { PBookingsModule } from './shared/p-bookings/p-bookings.module';
import { PSchedulingCalendarModule } from './shared/p-scheduling-calendar/p-calendar.module';
import { TextToHtmlService } from './shared/text-to-html.service';
import { PWishesService } from './wishes.service';
import { FilterService } from '../shared/filter.service';
import { PCalendarModule } from '../shared/p-calendar/p-calendar.module';
import { PMemberModule } from '../shared/p-member/p-member.module';
import { PMemoModule } from '../shared/p-memo/p-memo.module';
import { PShiftModule } from '../shared/p-shift-module/p-shift.module';
import { PSidebarModule } from '../shared/p-sidebar/p-sidebar.module';
import { PSidebarService } from '../shared/p-sidebar/p-sidebar.service';
// import { SchedulingRoutingModule } from './scheduling-routing.module';

@NgModule({
	imports: [
		// SchedulingRoutingModule,
		// ShiftExchangesModule,
		ClientSharedModule,
		CoreModule,
		PBookingsModule,
		PCalendarModule,
		PFormsModule,
		PListsModule,
		PMemberModule,
		PSchedulingCalendarModule,
		PShiftModule,
		PMemoModule,
		PSidebarModule,
		ScrollShadowBoxModule,
	],
	declarations: [
		SchedulingComponent,
		// PShiftExchangeMarketComponent,
	],
	providers: [
		CourseFilterService,
		EarlyBirdService,
		NgbActiveModal,
		PSidebarService,
		PWishesService,
		FilterService,
		SchedulingFilterService,
		SchedulingService,
		TextToHtmlService,
	],
	exports: [
		SchedulingComponent,
	],
})
export class SchedulingModule {}
