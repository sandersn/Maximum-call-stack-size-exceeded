import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ScrollShadowBoxComponent } from './scroll-shadow-box.component';

@NgModule({
	imports: [
		CommonModule,
	],
	declarations: [ScrollShadowBoxComponent],
	exports: [ScrollShadowBoxComponent],
})
export class ScrollShadowBoxModule { }
