import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './page-not-found.component';
import { PFaIconModule } from '../core/component/fa-icon/fa-icon.module';

@NgModule({
	declarations: [
		PageNotFoundComponent,
	],
	exports: [
		PageNotFoundComponent,
	],
	imports: [
		PFaIconModule,
	],
	providers: [
	],
})
export class PageNotFoundModule {}
