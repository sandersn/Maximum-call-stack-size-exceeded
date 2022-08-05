import { NgModule } from '@angular/core';
import { PParticipantsService } from '@plano/client/booking/detail-form/p-participants/p-participants.service';
import { BookingListService } from '@plano/client/sales/bookings/booking-list.service';
import { PSchedulingCalendarModule } from '@plano/client/scheduling/shared/p-scheduling-calendar/p-calendar.module';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { ClientSharedComponentsModule } from '@plano/client/shared/component/client-shared-components.module';
import { PCalendarModule } from '@plano/client/shared/p-calendar/p-calendar.module';
import { PCollapsibleModule } from '@plano/client/shared/p-collapsible/p-collapsible.module';
import { PEditableFormsModule } from '@plano/client/shared/p-editable-forms/p-editable-forms.module';
import { PFormsModule } from '@plano/client/shared/p-forms/p-forms.module';
import { PListsModule } from '@plano/client/shared/p-lists/p-lists.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { PBookingPersonCardComponent } from './booking-item/booking-details-modal/booking-person-card/booking-person-card.component';
import { PTariffInputComponent } from './booking-item/booking-details-modal/p-tariff-input/p-tariff-input.component';
import { PBookingItemComponent } from './booking-item/booking-item.component';
import { DumbBookingItemComponent } from './booking-item/dumb-booking-item/dumb-booking-item.component';
import { BookingListHeadlineComponent } from './booking-list-headline/booking-list-headline.component';
import { BookingListComponent } from './booking-list/booking-list.component';
import { BookingRelatedCourseComponent } from './legacy-booking-list/booking-related-course/booking-related-course.component';
import { PMoreBtnService } from './legacy-booking-list/more-btn.service';
import { PPersonComponent } from './person/person.component';
import { PPersonsComponent } from './persons/persons.component';
import { PGridModule } from '../../../../shared/core/component/grid/grid.module';

@NgModule({
	imports: [
		ClientSharedComponentsModule,
		ClientSharedModule,
		CoreModule,
		PCalendarModule,
		PCollapsibleModule,
		PEditableFormsModule,
		PFormsModule,
		PGridModule,
		PListsModule,
		PSchedulingCalendarModule,
	],
	declarations: [
		BookingListComponent,
		BookingListHeadlineComponent,
		BookingRelatedCourseComponent,
		DumbBookingItemComponent,
		PBookingItemComponent,
		PBookingPersonCardComponent,
		PPersonComponent,
		PPersonsComponent,
		PTariffInputComponent,
	],
	providers: [
		BookingListService,
		PMoreBtnService,
		PParticipantsService,
	],
	exports: [
		BookingListComponent,
		BookingListHeadlineComponent,
		BookingRelatedCourseComponent,
		DumbBookingItemComponent,
		PBookingItemComponent,
		PBookingPersonCardComponent,
		PPersonComponent,
		PPersonsComponent,
		PTariffInputComponent,
	],
})
export class PBookingsModule {}
