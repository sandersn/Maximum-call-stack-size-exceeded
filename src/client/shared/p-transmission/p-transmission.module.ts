import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule, DateAdapter, CalendarDateFormatter, CalendarMomentDateFormatter, MOMENT } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment-timezone';
import { NgModule } from '@angular/core';
import { CoreModule } from '@plano/shared/core/core.module';
import { ChangeSelectorsModalComponent } from './change-selectors-modal.component';
import { TransmissionPreviewComponent } from './transmission-preview/transmission-preview.component';
import { PGridModule } from '../../../shared/core/component/grid/grid.module';
import { PWizardModule } from '../../../shared/core/p-wizard/wizard.module';
import { ClientSharedComponentsModule } from '../component/client-shared-components.module';
import { PCalendarModule } from '../p-calendar/p-calendar.module';
import { PFormsModule } from '../p-forms/p-forms.module';
import { PMemberModule } from '../p-member/p-member.module';
import { PShiftModule } from '../p-shift-module/p-shift.module';
import { PShiftModelModule } from '../p-shiftmodel/p-shiftmodel.module';
import { PageModule } from '../page/page.module';

export const momentAdapterFactory = () : DateAdapter => {
	return adapterFactory(moment);
};

@NgModule({
	imports: [
		CalendarModule.forRoot(
			{
				provide: DateAdapter,
				useFactory: momentAdapterFactory,
			},
			{
				dateFormatter: {
					provide: CalendarDateFormatter,
					useClass: CalendarMomentDateFormatter,
				},
			},
		),
		ClientSharedComponentsModule,
		CoreModule,
		NgbDatepickerModule,
		PageModule,
		PCalendarModule,
		PFormsModule,
		PGridModule,
		PMemberModule,
		PShiftModelModule,
		PShiftModule,
		PWizardModule,
	],
	declarations: [
		ChangeSelectorsModalComponent,
		TransmissionPreviewComponent,
	],
	providers: [
		{
			provide: MOMENT,
			useValue: moment,
		},
	],
	exports: [
		ChangeSelectorsModalComponent,
		TransmissionPreviewComponent,
	],
})
export class PTransmissionModule {}
