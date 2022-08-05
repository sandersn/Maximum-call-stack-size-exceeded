import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgProgressModule } from 'ngx-progressbar';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';
import { WarningsComponent } from './alerts/warnings.component';
import { ErrorModalContentComponent } from './error-modal-content/error-modal-content.component';
import { PFaIconModule } from './fa-icon/fa-icon.module';
import { PInfoCircleComponent } from './info-circle/info-circle.component';
import { PToastComponent } from './p-toast/p-toast.component';
import { PTodoComponent } from './p-todo/p-todo.component';
// cSpell:ignore youtube
import { PYoutubeComponent } from './p-youtube/p-youtube.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { ValidationHintComponent } from './validation-hint/validation-hint.component';
import { PModalModule } from '../p-modal/modal.module';
import { CorePipesModule } from '../pipe/core-pipes.module';

@NgModule({
	imports: [
		CommonModule,
		CorePipesModule,
		FormsModule,
		NgProgressModule,
		PFaIconModule,
		PModalModule,
		TooltipModule,
	],
	declarations: [
		AlertComponent,
		ErrorModalContentComponent,
		PInfoCircleComponent,
		PToastComponent,
		PTodoComponent,
		PYoutubeComponent,
		SpinnerComponent,
		ValidationHintComponent,
		WarningsComponent, // TODO: This component includes MeService. Move to another Module, to make CoreComponentsModule Api-free. Alternative: Get SchedulingApiWarnings without bootstrapping our whole api-code.
	],
	providers: [],
	exports: [
		AlertComponent,
		ErrorModalContentComponent,
		PInfoCircleComponent,
		PToastComponent,
		PTodoComponent,
		PYoutubeComponent,
		SpinnerComponent,
		ValidationHintComponent,
		WarningsComponent,
	],
})
export class CoreComponentsModule {}
