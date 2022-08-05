import { NgModule } from '@angular/core';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { PEditableModule } from '@plano/client/shared/p-editable/p-editable.module';
import { PFormsModule } from '@plano/client/shared/p-forms/p-forms.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { EventTypesService } from './event-types.service';
import { PCustomCourseEmailsComponent } from './p-custom-course-emails.component';

@NgModule({
	imports: [
		ClientSharedModule,
		CoreModule,
		PEditableModule,
		PFormsModule,
	],
	declarations: [
		PCustomCourseEmailsComponent,
	],
	providers: [
		EventTypesService,
	],
	exports: [
		PCustomCourseEmailsComponent,
	],
})
export class PCustomCourseEmailsModule {}
