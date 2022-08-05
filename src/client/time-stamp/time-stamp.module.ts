import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { NgModule } from '@angular/core';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { PFormsModule } from '@plano/client/shared/p-forms/p-forms.module';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { LimitToPipe } from './pipe/limit-to.pipe';
import { ShiftSelectComponent } from './shift-select/shift-select.component';
import { StampedMembersCardComponent } from './stamped-members-card/stamped-members-card.component';
import { StopwatchComponent } from './stopwatch/stopwatch.component';
import { TimeStampResultsComponent } from './time-stamp-results/time-stamp-results.component';
import { TimeStampComponent } from './time-stamp.component';
import { PGridModule } from '../../shared/core/component/grid/grid.module';
// import { TimeStampRoutingModule } from './time-stamp-routing.module';

@NgModule({
	imports: [
		ClientSharedModule,
		BsDropdownModule.forRoot(),
		TimepickerModule.forRoot(),
		CoreModule,
		NgbDatepickerModule,
		PFormsModule,
		PGridModule,
		// TimeStampRoutingModule
		ScrollShadowBoxModule,
	],
	declarations: [
		LimitToPipe,
		ShiftSelectComponent,
		StampedMembersCardComponent,
		StopwatchComponent,
		TimeStampComponent,
		TimeStampResultsComponent,
	],
	providers: [
	],
	exports: [
		ShiftSelectComponent,
		StampedMembersCardComponent,
		StopwatchComponent,
		TimeStampComponent,
		TimeStampResultsComponent,
	],
})
export class TimeStampModule {}
