import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule, PopoverConfig } from 'ngx-bootstrap/popover';
import { NgModule } from '@angular/core';
import { getPopoverConfig } from '@plano/ngx-bootstrap.config';
import { CoreModule } from '@plano/shared/core/core.module';
import { PBasicInfoComponent } from './basic-shift-info/basic-info.component';
import { PInputShiftModelIdModalComponent } from './input-shiftmodel-id-modal/input-shiftmodel-id-modal.component';
import { MemberListItemComponent } from './member-list-item/member-list-item.component';
import { PAssignmentProcessIconComponent } from './p-assignment-process-icon/p-assignment-process-icon.component';
import { PNotificationConfFormComponent } from './p-notification-conf-form/p-notification-conf-form.component';
import { PSubheaderComponent } from './p-subheader/p-subheader.component';
import { PacketShiftsComponent } from './packet-shifts/packet-shifts.component';
import { PauseDurationComponent } from './pause-duration/pause-duration.component';
import { StickyNoteComponent } from './sticky-note/sticky-note.component';
import { StopwatchImageComponent } from './stopwatch-image/stopwatch-image.component';
import { WeekdaysComponent } from './weekdays/weekdays.component';
import { PBookingFormService } from '../../booking/booking-form.service';
import { PEditableFormsModule } from '../p-editable-forms/p-editable-forms.module';
import { PEditableModule } from '../p-editable/p-editable.module';
import { PFormsModule } from '../p-forms/p-forms.module';
import { PListsModule } from '../p-lists/p-lists.module';
import { PMemberModule } from '../p-member/p-member.module';
import { PShiftModelModule } from '../p-shiftmodel/p-shiftmodel.module';
import { ClientPipesModule } from '../pipe/client-pipes.module';

@NgModule({
	imports: [
		ClientPipesModule,
		CoreModule,
		PEditableFormsModule,
		PEditableModule,
		PFormsModule,
		BsDropdownModule.forRoot(),
		PListsModule,
		PMemberModule,
		PopoverModule,
		PShiftModelModule,
	],
	declarations: [
		MemberListItemComponent,
		PacketShiftsComponent,
		PAssignmentProcessIconComponent,
		PauseDurationComponent,
		PBasicInfoComponent,
		PInputShiftModelIdModalComponent,
		PNotificationConfFormComponent,
		PSubheaderComponent,
		StickyNoteComponent,
		StopwatchImageComponent,
		WeekdaysComponent,
	],
	providers: [
		{
			provide: PopoverConfig,
			useFactory: getPopoverConfig,
		},
		PBookingFormService,
	],
	exports: [
		ClientPipesModule,
		MemberListItemComponent,
		PacketShiftsComponent,
		PAssignmentProcessIconComponent,
		PauseDurationComponent,
		PBasicInfoComponent,
		PInputShiftModelIdModalComponent,
		PNotificationConfFormComponent,
		PSubheaderComponent,
		StickyNoteComponent,
		StopwatchImageComponent,
		WeekdaysComponent,
	],
})
export class ClientSharedComponentsModule {}
