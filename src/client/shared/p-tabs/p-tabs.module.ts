import { NgModule } from '@angular/core';
import { CoreModule } from '@plano/shared/core/core.module';
import { PTabComponent } from './p-tabs/p-tab/p-tab.component';
import { PTabsComponent } from './p-tabs/p-tabs.component';
import { PLedModule } from '../p-led/p-led.module';
import { PMomentService } from '../p-moment.service';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	imports: [
		CoreModule,
		PLedModule,
		SharedModule,
	],
	declarations: [
		PTabComponent,
		PTabsComponent,
	],
	providers: [
		PMomentService,
	],
	exports: [
		PTabComponent,
		PTabsComponent,
	],
})
export class PTabsModule {}
