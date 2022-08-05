import { NgModule } from '@angular/core';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { PFormsModule } from '@plano/client/shared/p-forms/p-forms.module';
import { SchedulingApiService } from '@plano/shared/api';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { ReportFilterService } from './report-filter.service';
import { ReportUrlParamsService } from './report-url-params.service';
import { ReportComponent } from './report.component';
import { ReportService } from './report.service';
import { AbsenceListItemComponent } from './shared/absence-list-item/absence-list-item.component';
import { ForecastBadgeComponent } from './shared/forecast-badge/forecast-badge.component';
import { MemberWorkingTimesComponent } from './shared/member-working-times/member-working-times.component';
import { ReportRowComponent } from './shared/report-row/report-row.component';
import { WorkingtimeListItemComponent } from './shared/workingtime-list-item/workingtime-list-item.component';
import { PMemberModule } from '../shared/p-member/p-member.module';
import { PSidebarModule } from '../shared/p-sidebar/p-sidebar.module';

@NgModule({
	imports: [
		ClientSharedModule,
		CoreModule,
		PFormsModule,
		PMemberModule,
		PSidebarModule,
		ScrollShadowBoxModule,
	],
	declarations: [
		AbsenceListItemComponent,
		ForecastBadgeComponent,
		MemberWorkingTimesComponent,
		ReportComponent,
		ReportRowComponent,
		WorkingtimeListItemComponent,
	],
	providers: [
		ReportFilterService,
		ReportService,
		ReportUrlParamsService,
		SchedulingApiService,
	],
	exports: [
		MemberWorkingTimesComponent,
		ReportComponent,
		ReportRowComponent,
	],
})
export class ReportModule {}
