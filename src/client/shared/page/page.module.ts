import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollShadowBoxModule } from '@plano/shared/core/component/scroll-shadow-box/scroll-shadow-box.module';
import { PageComponent } from './page.component';
import { PFormSectionComponent } from './section/section.component';

@NgModule({
	imports: [
		CommonModule,
		ScrollShadowBoxModule,
	],
	declarations: [
		PageComponent,
		PFormSectionComponent,
	],
	exports: [
		PageComponent,
		PFormSectionComponent,
	],
})
export class PageModule { }
