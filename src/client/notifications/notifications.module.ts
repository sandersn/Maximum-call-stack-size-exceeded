/* eslint-disable @angular-eslint/sort-ngmodule-metadata-arrays */
import { NgModule } from '@angular/core';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';
import { PGridModule } from '../../shared/core/component/grid/grid.module';
import { PCollapsibleModule } from '../shared/p-collapsible/p-collapsible.module';
import { PFormsModule } from '../shared/p-forms/p-forms.module';

@NgModule({
	imports: [
		CoreModule,
		ClientSharedModule,
		NotificationsRoutingModule,
		PFormsModule,
		ScrollShadowBoxModule,
		PCollapsibleModule,
		PGridModule,
	],
	declarations: [
		NotificationsComponent,
	],
	providers: [
	],
	exports: [
		NotificationsComponent,
	],
})
export class NotificationsModule {}
