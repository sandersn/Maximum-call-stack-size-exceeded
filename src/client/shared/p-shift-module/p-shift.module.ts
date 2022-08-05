import { PopoverModule, PopoverConfig } from 'ngx-bootstrap/popover';
import { NgxPopperjsModule } from 'ngx-popperjs';
import { NgModule } from '@angular/core';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { PFormsModule } from '@plano/client/shared/p-forms/p-forms.module';
import { getPopoverConfig } from '@plano/ngx-bootstrap.config';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { AssignedMembersComponent } from './assigned-members/assigned-members.component';
import { PAssignMeButtonComponent } from './p-assign-me-button/p-assign-me-button.component';
import { PCourseInfoComponent } from './p-course-info/p-course-info.component';
import { CustomMultiSelectCheckboxTestComponent } from './p-multi-select-checkbox/io-spec/p-multi-select-checkbox-test.component';
import { PMultiSelectCheckboxComponent } from './p-multi-select-checkbox/p-multi-select-checkbox.component';
import { PShiftCommentComponent } from './p-shift-comments/p-shift-comment/p-shift-comment.component';
import { PShiftCommentsComponent } from './p-shift-comments/p-shift-comments.component';
import { ShiftCommentModalDirective } from './p-shift-comments/shift-comment-modal.directive';
import { PShiftItemTooltipComponent } from './p-shift-item-tooltip/p-shift-item-tooltip.component';
import { PShiftService } from './p-shift.service';
import { PShiftComponent } from './p-shift/p-shift.component';
import { QuickAssignmentComponent } from './quick-assignment/quick-assignment.component';
import { ShiftCommentMetaComponent } from './shift-comment-meta/shift-comment-meta.component';
import { PShiftCommentModalContentComponent } from './shift-comment-modal-content/shift-comment-modal-content.component';
import { ShiftMemberExchangeService } from './shift-member-exchange.service';
import { PEditableFormsModule } from '../p-editable-forms/p-editable-forms.module';
import { PEditableModule } from '../p-editable/p-editable.module';
import { PLedModule } from '../p-led/p-led.module';
import { PMemberModule } from '../p-member/p-member.module';
import { PShiftExchangeModule } from '../p-shift-exchange/p-shift-exchange.module';

@NgModule({
	imports: [
		ClientSharedModule,
		CoreModule,
		PEditableFormsModule,
		PEditableModule,
		NgxPopperjsModule.forRoot({ disableAnimation: true }),
		PFormsModule,
		PLedModule,
		PMemberModule,
		PopoverModule,
		PShiftExchangeModule,
		ScrollShadowBoxModule,
	],
	declarations: [
		AssignedMembersComponent,
		CustomMultiSelectCheckboxTestComponent,
		PAssignMeButtonComponent,
		PCourseInfoComponent,
		PMultiSelectCheckboxComponent,
		PShiftCommentComponent,
		PShiftCommentModalContentComponent,
		PShiftCommentsComponent,
		PShiftComponent,
		PShiftItemTooltipComponent,
		QuickAssignmentComponent,
		ShiftCommentMetaComponent,
		ShiftCommentModalDirective,
	],
	providers: [
		// BookingsService
		PShiftService,
		ShiftMemberExchangeService,
		{
			provide: PopoverConfig,
			useFactory: getPopoverConfig,
		},
	],
	exports: [
		AssignedMembersComponent,
		CustomMultiSelectCheckboxTestComponent,
		PAssignMeButtonComponent,
		PCourseInfoComponent,
		PMultiSelectCheckboxComponent,
		PShiftCommentComponent,
		PShiftCommentModalContentComponent,
		PShiftCommentsComponent,
		PShiftComponent,
		PShiftItemTooltipComponent,
		QuickAssignmentComponent,
		ShiftCommentMetaComponent,
		ShiftCommentModalDirective,
	],
})
export class PShiftModule {}
