import { NgModule } from '@angular/core';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { MenuRoutingModule } from './menu-routing.module';
import { MenuComponent } from './menu.component';
import { SettingsMenuForMobileComponent } from './settings-menu-for-mobile/settings-menu-for-mobile.component';
import { ClientSharedModule } from '../shared/client-shared.module';
import { ClientSharedComponentsModule } from '../shared/component/client-shared-components.module';
import { PFormsModule } from '../shared/p-forms/p-forms.module';
import { PMemberModule } from '../shared/p-member/p-member.module';

@NgModule({
	declarations: [
		MenuComponent,
		SettingsMenuForMobileComponent,
	],
	imports: [
		ClientSharedComponentsModule,
		ClientSharedModule,
		CoreModule,
		MenuRoutingModule,
		PFormsModule,
		PMemberModule,
		ScrollShadowBoxModule,
	],
	providers: [
	],
	exports: [
		MenuComponent,
		SettingsMenuForMobileComponent,
	],
})
export class MenuModule {}
