import { NgModule } from '@angular/core';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { PFormsModule } from '@plano/client/shared/p-forms/p-forms.module';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { DetailFormComponent } from './detail-form/detail-form.component';
import { WorkingtimeRoutingModule } from './workingtime-routing.module';
import { WorkingtimeComponent } from './workingtime.component';
import { PGridModule } from '../../shared/core/component/grid/grid.module';
import { PEditableFormsModule } from '../shared/p-editable-forms/p-editable-forms.module';
import { PNoItemsModule } from '../shared/p-no-items/p-no-items.module';


@NgModule({
	imports: [
		ClientSharedModule,
		CoreModule,
		PEditableFormsModule,
		PFormsModule,
		PGridModule,
		PNoItemsModule,
		ScrollShadowBoxModule,
		WorkingtimeRoutingModule,
	],
	declarations: [
		DetailFormComponent,
		WorkingtimeComponent,
	],
	providers: [
	],
	exports: [
		WorkingtimeComponent,
	],
})
export class WorkingtimeModule {}
