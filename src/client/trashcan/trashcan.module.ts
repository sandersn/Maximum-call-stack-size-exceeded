import { NgModule } from '@angular/core';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { TrashcanComponent } from './trashcan.component';

@NgModule({
	declarations: [
		TrashcanComponent,
	],
	imports: [
		ClientSharedModule,
		CoreModule,
		// MemberModule
	],
	providers: [
	],
	exports: [
		TrashcanComponent,
	],
})
export class TrashcanModule {}
