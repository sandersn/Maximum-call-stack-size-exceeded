/* eslint-disable @angular-eslint/sort-ngmodule-metadata-arrays */
import { NgModule } from '@angular/core';
import { CoreModule } from '@plano/shared/core/core.module';
import { AccountRoutingModule } from './account-routing.module';
import { AccountFormComponent } from './account.component';
import { ClientSharedModule } from '../shared/client-shared.module';
import { PAccountFormModule } from '../shared/p-account-form/p-account-form.module';
import { PAccountFormService } from '../shared/p-account-form/p-account-form.service';
import { PFormsModule } from '../shared/p-forms/p-forms.module';
import { PTabsModule } from '../shared/p-tabs/p-tabs.module';
import { PageModule } from '../shared/page/page.module';

@NgModule({
	declarations: [
		AccountFormComponent,
	],
	imports: [
		CoreModule,
		AccountRoutingModule,
		PAccountFormModule,
		ClientSharedModule,
		PTabsModule,
		PFormsModule,
		PageModule,
	],
	providers: [
		PAccountFormService,
	],
	exports: [
		AccountFormComponent,
	],
})
export class AccountModule {}
