import { NgModule } from '@angular/core';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { TestaccountRoutingModule } from './test-account-routing.module';
import { TestAccountComponent } from './test-account.component';
import { PGridModule } from '../../shared/core/component/grid/grid.module';
import { ClientSharedModule } from '../shared/client-shared.module';
import { PAccountFormModule } from '../shared/p-account-form/p-account-form.module';
import { PAccountFormService } from '../shared/p-account-form/p-account-form.service';
import { PEditableFormsModule } from '../shared/p-editable-forms/p-editable-forms.module';
import { PEditableModule } from '../shared/p-editable/p-editable.module';
import { PFormsModule } from '../shared/p-forms/p-forms.module';
import { PageModule } from '../shared/page/page.module';

@NgModule({
	imports: [
		ClientSharedModule,
		CoreModule,
		PAccountFormModule,
		PageModule,
		PEditableFormsModule,
		PEditableModule,
		PFormsModule,
		PGridModule,
		ScrollShadowBoxModule,
		TestaccountRoutingModule,
	],
	declarations: [
		TestAccountComponent,
	],
	providers: [
		PAccountFormService,
	],
	exports: [
		TestAccountComponent,
	],
})
export class TestAccountModule {}
