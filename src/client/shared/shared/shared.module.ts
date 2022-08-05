import { NgModule } from '@angular/core';
import { CoreModule } from '@plano/shared/core/core.module';
import { PBadgeComponent } from './p-badge/p-badge.component';

@NgModule({
	imports: [
		CoreModule,
	],
	declarations: [
		PBadgeComponent,
	],
	providers: [
	],
	exports: [
		PBadgeComponent,
	],
})
export class SharedModule {}
