import { NgbDatepickerModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { CommentComponent } from './day-comment/comment/comment.component';
import { DayCommentComponent } from './day-comment/day-comment.component';
import { CollapsedShiftmodelsService } from './main-sidebar/collapsed-shiftmodel-parents.service';
import { MainSidebarComponent } from './main-sidebar/main-sidebar.component';
import { PSidebarDeskComponent } from './main-sidebar/p-sidebar-desk/sidebar-desk.component';
import { PSidebarMembersComponent } from './main-sidebar/p-sidebar-members/sidebar-members.component';
import { PSidebarShiftModelsComponent } from './main-sidebar/p-sidebar-shiftmodels/sidebar-shiftmodels.component';
import { AssignmentProcessesService } from './p-assignment-processes/assignment-processes.service';
import { PAssignmentProcessTypeCaptionComponent } from './p-assignment-processes/p-assignment-process/p-assignment-process-type-caption/p-assignment-process-type-caption.component';
import { PAssignmentProcessComponent } from './p-assignment-processes/p-assignment-process/p-assignment-process.component';
import { PAssignmentProcessesComponent } from './p-assignment-processes/p-assignment-processes.component';
import { PSidebarComponent } from './p-sidebar/p-sidebar.component';
import { ShiftmodelListItemComponent } from './shiftmodel-list-item/shiftmodel-list-item.component';
import { SidebarItemComponent, SidebarItemContentDirective, SidebarItemHeaderDirective, SidebarItemOptionsDirective } from './sidebar-item/sidebar-item.component';
import { PCardModule } from '../../../shared/core/component/card/card.module';
import { ClientSharedComponentsModule } from '../component/client-shared-components.module';
import { PEditableFormsModule } from '../p-editable-forms/p-editable-forms.module';
import { PEditableModule } from '../p-editable/p-editable.module';
import { PFormsModule } from '../p-forms/p-forms.module';
import { PLedModule } from '../p-led/p-led.module';
import { PListsModule } from '../p-lists/p-lists.module';
import { PMemberModule } from '../p-member/p-member.module';
import { PMemoModule } from '../p-memo/p-memo.module';
import { PShiftExchangeModule } from '../p-shift-exchange/p-shift-exchange.module';
import { PShiftModule } from '../p-shift-module/p-shift.module';
import { PShiftModelModule } from '../p-shiftmodel/p-shiftmodel.module';
import { PTabsModule } from '../p-tabs/p-tabs.module';
import { ClientRoutingService } from '../routing.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	imports: [
		ClientSharedComponentsModule,
		CoreModule,
		NgbDatepickerModule,
		NgbModalModule,
		PCardModule,
		PEditableFormsModule,
		PEditableModule,
		PFormsModule,
		PLedModule,
		PListsModule,
		PMemberModule,
		PMemoModule,
		PShiftExchangeModule,
		PShiftModelModule,
		PShiftModule,
		PTabsModule,
		ScrollShadowBoxModule,
		SharedModule,
	],
	declarations: [
		CommentComponent,
		DayCommentComponent,
		MainSidebarComponent,
		PAssignmentProcessComponent,
		PAssignmentProcessesComponent,
		PAssignmentProcessTypeCaptionComponent,
		PSidebarComponent,
		PSidebarDeskComponent,
		PSidebarMembersComponent,
		PSidebarShiftModelsComponent,
		ShiftmodelListItemComponent,
		SidebarItemComponent,
		SidebarItemContentDirective,
		SidebarItemHeaderDirective,
		SidebarItemOptionsDirective,
	],
	providers: [
		AssignmentProcessesService,
		ClientRoutingService,
		CollapsedShiftmodelsService,
	],
	exports: [
		CommentComponent,
		DayCommentComponent,
		MainSidebarComponent,
		PAssignmentProcessesComponent,
		PSidebarDeskComponent,
		PSidebarMembersComponent,
		PSidebarShiftModelsComponent,
	],
})
export class PSidebarModule {}
