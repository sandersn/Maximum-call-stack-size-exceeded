/* eslint-disable @angular-eslint/sort-ngmodule-metadata-arrays */
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgModule } from '@angular/core';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { PFormsModule } from '@plano/client/shared/p-forms/p-forms.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { AccessControlToggleComponent } from './accesscontrol-toggle/accesscontrol-toggle.component';
import { AccessControlComponent } from './accesscontrol.component';
import { PPermissionService } from './permission.service';
import { RightgroupHeaderComponent } from './rightgroup-header/rightgroup-header.component';
import { RightsTableComponent } from './rights-table/rights-table.component';
import { RightsService } from './rights.service';
import { PageModule } from '../shared/page/page.module';

@NgModule({
	imports: [
		BsDropdownModule.forRoot(),
		CoreModule,
		ClientSharedModule,
		PFormsModule,
		PageModule,
	],
	declarations: [
		AccessControlComponent,
		AccessControlToggleComponent,
		RightgroupHeaderComponent,
		RightsTableComponent,
	],
	providers: [
		RightsService,
		PPermissionService,
	],
	exports: [
		AccessControlComponent,
		RightsTableComponent,
		RightgroupHeaderComponent,
	],
})
export class AccesscontrolModule {}
