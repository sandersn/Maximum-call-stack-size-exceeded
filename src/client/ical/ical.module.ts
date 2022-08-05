/* eslint-disable @angular-eslint/sort-ngmodule-metadata-arrays */
import { NgModule } from '@angular/core';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { IcalRoutingModule } from './ical-routing.module';
import { IcalComponent } from './ical.component';
import { PFormsModule } from '../shared/p-forms/p-forms.module';
import { PListsModule } from '../shared/p-lists/p-lists.module';

@NgModule({
	declarations: [
		IcalComponent,
	],
	imports: [
		CoreModule,
		ClientSharedModule,
		IcalRoutingModule,
		PFormsModule,
		PListsModule,
		ScrollShadowBoxModule,
	],
	providers: [
	],
	exports: [
		IcalComponent,
	],
})
export class IcalModule {}
