import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '@plano/shared/core/core.module';
import { AccountComponent } from './account/account.component';
import { BillingComponent } from './billing/billing.component';
import { LocationComponent } from './location/location.component';
import { PaymentComponent } from './payment/payment.component';
import { PGridModule } from '../../../shared/core/component/grid/grid.module';
import { ClientSharedComponentsModule } from '../component/client-shared-components.module';
import { PEditableFormsModule } from '../p-editable-forms/p-editable-forms.module';
import { PEditableModule } from '../p-editable/p-editable.module';
import { PFormsModule } from '../p-forms/p-forms.module';
import { PTabsModule } from '../p-tabs/p-tabs.module';
import { PageModule } from '../page/page.module';

@NgModule({
	imports: [
		ClientSharedComponentsModule,
		CommonModule,
		CoreModule,
		PageModule,
		PEditableFormsModule,
		PEditableModule,
		PFormsModule,
		PGridModule,
		PTabsModule,
	],
	declarations: [
		AccountComponent,
		BillingComponent,
		LocationComponent,
		PaymentComponent,
	],
	providers: [
	],
	exports: [
		AccountComponent,
		BillingComponent,
		LocationComponent,
		PaymentComponent,
	],
})
export class PAccountFormModule { }
