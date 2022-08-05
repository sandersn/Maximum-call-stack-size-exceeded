import { NgModule } from '@angular/core';
import { BookingTransactionFormComponent } from './booking-transaction-form/booking-transaction-form.component';
import { CancellationAmountAlertComponent } from './cancellation-amount-alert/cancellation-amount-alert.component';
import { EmailHistoryComponent } from './email-history/email-history.component';
import { OpenAmountDisplayComponent } from './open-amount-display/open-amount-display.component';
import { CoreComponentsModule } from '../../../shared/core/component/core-components.module';
import { PGridModule } from '../../../shared/core/component/grid/grid.module';
import { CoreModule } from '../../../shared/core/core.module';
import { PShiftAndShiftmodelFormModule } from '../../shared/component/p-shift-and-shiftmodel-form/p-shift-and-shiftmodel-form.module';
import { PFormsModule } from '../../shared/p-forms/p-forms.module';
import { PNoItemsModule } from '../../shared/p-no-items/p-no-items.module';
import { PageModule } from '../../shared/page/page.module';

@NgModule({
	imports: [
		CoreComponentsModule,
		CoreModule,
		PageModule,
		PFormsModule,
		PGridModule,
		PNoItemsModule,
		PShiftAndShiftmodelFormModule,
	],
	declarations: [
		BookingTransactionFormComponent,
		CancellationAmountAlertComponent,
		EmailHistoryComponent,
		OpenAmountDisplayComponent,
	],
	providers: [
	],
	exports: [
		BookingTransactionFormComponent,
		CancellationAmountAlertComponent,
		EmailHistoryComponent,
		OpenAmountDisplayComponent,
	],
})
export class SalesSharedModule {}
