/* eslint-disable @angular-eslint/sort-ngmodule-metadata-arrays */
import { NgModule } from '@angular/core';
import { PSidebarModule } from '@plano/client/shared/p-sidebar/p-sidebar.module';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { DeskRoutingModule } from './desk-routing.module';
import { DeskComponent } from './desk.component';
import { PCardModule } from '../../shared/core/component/card/card.module';
import { ClientSharedModule } from '../shared/client-shared.module';
import { PFormsModule } from '../shared/p-forms/p-forms.module';
import { PListsModule } from '../shared/p-lists/p-lists.module';
import { PShiftExchangeModule } from '../shared/p-shift-exchange/p-shift-exchange.module';
import { PShiftModule } from '../shared/p-shift-module/p-shift.module';

@NgModule({
	declarations: [
		DeskComponent,
	],
	imports: [
		CoreModule,
		DeskRoutingModule,
		PFormsModule,
		ClientSharedModule,
		PSidebarModule,
		PListsModule,
		PShiftModule,
		PShiftExchangeModule,
		ScrollShadowBoxModule,
		PCardModule,
		PSidebarModule,
	],
	providers: [
	],
	exports: [
		DeskComponent,
	],
})
export class DeskModule {}
