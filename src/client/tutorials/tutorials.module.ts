import { NgModule } from '@angular/core';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { TutorialsRoutingModule } from './tutorials-routing.module';
import { TutorialsComponent } from './tutorials.component';
import { PGridModule } from '../../shared/core/component/grid/grid.module';
import { PageModule } from '../shared/page/page.module';

@NgModule({
	imports: [
		ClientSharedModule,
		CoreModule,
		PageModule,
		PGridModule,
		TutorialsRoutingModule,
	],
	declarations: [
		TutorialsComponent,
	],
	providers: [
	],
	exports: [
		TutorialsComponent,
	],
})
export class TutorialsModule {}
