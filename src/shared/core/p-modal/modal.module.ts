import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { PModalDefaultTemplateComponent } from './modal-default-template/modal-default-template.component';
import { ModalHeaderComponent } from './modal-header/modal-header.component';
import { ModalDirective } from './modal.directive';
import { PModalContentBodyComponent, PModalContentComponent, PModalContentFooterComponent } from './p-modal-content/p-modal-content.component';
import { PFaIconModule } from '../component/fa-icon/fa-icon.module';

@NgModule({
	imports: [
		CommonModule,
		NgbModule,
		PFaIconModule,
	],
	declarations: [
		ModalDirective,
		ModalHeaderComponent,
		PConfirmModalComponent,
		PModalContentBodyComponent,
		PModalContentComponent,
		PModalContentFooterComponent,
		PModalDefaultTemplateComponent,
	],
	providers: [],
	exports: [
		ModalDirective,
		ModalHeaderComponent,
		PModalContentBodyComponent,
		PModalContentComponent,
		PModalContentFooterComponent,
	],
})
export class PModalModule {}
