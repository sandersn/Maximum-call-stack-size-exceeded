import { NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PopoverModule, PopoverConfig } from 'ngx-bootstrap/popover';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgModule } from '@angular/core';
import { AbsenceService } from '@plano/client/shared/absence.service';
import { WarningsService } from '@plano/client/shared/warnings.service';
import { CustomDatepickerI18n } from '@plano/datepicker-i18n.service';
import { getPopoverConfig } from '@plano/ngx-bootstrap.config';
import { CoreModule } from '@plano/shared/core/core.module';
import { ClientSharedComponentsModule } from './component/client-shared-components.module';
import { PDetailFormUtilsService } from './detail-form-utils.service';
import { FilterService } from './filter.service';
import { FormattedDateTimePipe } from './formatted-date-time.pipe';
import { PAccountFormModule } from './p-account-form/p-account-form.module';
import { PEditableModule } from './p-editable/p-editable.module';
import { PExportService } from './p-export.service';
import { PMomentService } from './p-moment.service';
import { PShiftModelModule } from './p-shiftmodel/p-shiftmodel.module';
import { PTabsModule } from './p-tabs/p-tabs.module';
import { PageModule } from './page/page.module';

@NgModule({
	imports: [
		ClientSharedComponentsModule,
		TypeaheadModule.forRoot(),
		CoreModule,
		PAccountFormModule,
		PageModule,
		PTabsModule,
	],
	declarations: [
	],
	providers: [
		{
			provide: PopoverConfig,
			useFactory: getPopoverConfig,
		},
		AbsenceService,
		FilterService,
		FormattedDateTimePipe,
		PDetailFormUtilsService,
		{
			provide: NgbDatepickerI18n,
			useClass: CustomDatepickerI18n,
		},
		PExportService,
		PMomentService,
		WarningsService,
	],
	exports: [
		BsDropdownModule,
		ClientSharedComponentsModule,
		PAccountFormModule,
		PEditableModule,
		PopoverModule,
		PShiftModelModule,
		PTabsModule,
	],
})
export class ClientSharedModule {}
