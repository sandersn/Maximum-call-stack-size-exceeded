/* eslint-disable @angular-eslint/sort-ngmodule-metadata-arrays */
import { NgModule } from '@angular/core';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { DeviceItemComponent } from './devices-list/device-item/device-item.component';
import { DevicesListComponent } from './devices-list/devices-list.component';
import { DevicesRoutingModule } from './devices-routing.module';
import { DevicesComponent } from './devices.component';
import { PCardModule } from '../../shared/core/component/card/card.module';
import { PFormsModule } from '../shared/p-forms/p-forms.module';

@NgModule({
	declarations: [
		DeviceItemComponent,
		DevicesListComponent,
		DevicesComponent,
	],
	imports: [
		CoreModule,
		PFormsModule,
		ClientSharedModule,
		DevicesRoutingModule,
		ScrollShadowBoxModule,
		PCardModule,
	],
	providers: [
	],
	exports: [
		DevicesComponent,
	],
})
export class DevicesModule {}
