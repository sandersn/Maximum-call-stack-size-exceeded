/* eslint-disable @angular-eslint/sort-ngmodule-metadata-arrays */
import { NgModule } from '@angular/core';
import { PBookingsModule } from '@plano/client/scheduling/shared/p-bookings/p-bookings.module';
import { ClientSharedModule } from '@plano/client/shared/client-shared.module';
import { PFormsModule } from '@plano/client/shared/p-forms/p-forms.module';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { CoreModule } from '@plano/shared/core/core.module';
import { DetailFormComponent } from './detail-form/detail-form.component';
import { PCustomCourseEmailPlaceholdersComponent } from './detail-form/p-custom-course-email-placeholders/p-custom-course-email-placeholders.component';
import { PPlaceholderInputComponent } from './detail-form/p-custom-course-email-placeholders/p-placeholder-input/p-placeholder-input.component';
import { EmailRoutingModule } from './email-routing.module';
import { EmailComponent } from './email.component';
import { PGridModule } from '../../shared/core/component/grid/grid.module';
import { PEditableFormsModule } from '../shared/p-editable-forms/p-editable-forms.module';
import { PNoItemsModule } from '../shared/p-no-items/p-no-items.module';


@NgModule({
	imports: [
		CoreModule,
		PFormsModule,
		PEditableFormsModule,
		ClientSharedModule,
		PBookingsModule,
		EmailRoutingModule,
		ScrollShadowBoxModule,
		PNoItemsModule,
		PGridModule,
	],
	declarations: [
		EmailComponent,
		DetailFormComponent,
		PCustomCourseEmailPlaceholdersComponent,
		PPlaceholderInputComponent,
	],
	providers: [
	],
	exports: [
		EmailComponent,
		PPlaceholderInputComponent,
		PCustomCourseEmailPlaceholdersComponent,
	],
})
export class EmailModule {}
