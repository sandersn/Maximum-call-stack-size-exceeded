import { NgModule } from '@angular/core';
import { EventTypesService } from '@plano/client/plugin/p-custom-course-emails/event-types.service';
import { PBookingsModule } from '@plano/client/scheduling/shared/p-bookings/p-bookings.module';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { PFormsModule } from '@plano/client/shared/p-forms/p-forms.module';
import { PListsModule } from '@plano/client/shared/p-lists/p-lists.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { AgeLimitSectionComponent } from './age-limit-section/age-limit-section.component';
import { AssignMembersComponent } from './assign-members/assign-members.component';
import { PAssignMembersHeadlineComponent } from './assign-members/p-assign-members-headline/p-assign-members-headline.component';
import { PInputMemberEarningsComponent } from './assign-members/p-input-member-earnings/p-input-member-earnings.component';
import { CancellationPolicyComponent } from './cancellation-policy/cancellation-policy.component';
import { FeePeriodTimeTextComponent } from './fee-period-time-text/fee-period-time-text.component';
import { PShiftAndShiftmodelFormComponent } from './p-shift-and-shiftmodel-form.component';
import { PShiftAndShiftmodelFormService } from './p-shift-and-shiftmodel-form.service';
import { PShiftBookingsComponent } from './p-shift-bookings/p-shift-bookings.component';
import { PGridModule } from '../../../../shared/core/component/grid/grid.module';
import { PCollapsibleModule } from '../../p-collapsible/p-collapsible.module';
import { PEditableFormsModule } from '../../p-editable-forms/p-editable-forms.module';
import { PLedModule } from '../../p-led/p-led.module';
import { PMemberModule } from '../../p-member/p-member.module';
import { PShiftModule } from '../../p-shift-module/p-shift.module';
import { PTabsModule } from '../../p-tabs/p-tabs.module';
import { PTransmissionModule } from '../../p-transmission/p-transmission.module';
import { PageModule } from '../../page/page.module';

@NgModule({
	imports: [
		ClientSharedModule,
		CoreModule,
		PageModule,
		PBookingsModule,
		PCollapsibleModule,
		PEditableFormsModule,
		PFormsModule,
		PGridModule,
		PLedModule,
		PListsModule,
		PMemberModule,
		PShiftModule,
		PTabsModule,
		PTransmissionModule,
	],
	declarations: [
		AgeLimitSectionComponent,
		AssignMembersComponent,
		CancellationPolicyComponent,
		FeePeriodTimeTextComponent,
		PAssignMembersHeadlineComponent,
		PInputMemberEarningsComponent,
		PShiftAndShiftmodelFormComponent,
		PShiftBookingsComponent,
	],
	providers: [
		EventTypesService,
		PShiftAndShiftmodelFormService,
	],
	exports: [
		FeePeriodTimeTextComponent,
		PInputMemberEarningsComponent,
		PShiftAndShiftmodelFormComponent,
	],
})
export class PShiftAndShiftmodelFormModule {}
