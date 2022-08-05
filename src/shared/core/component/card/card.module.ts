import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CardComponent } from './card.component';

@NgModule({
	imports: [
		CommonModule,
	],
	declarations: [
		CardComponent,
	],
	providers: [],
	exports: [
		CardComponent,
	],
})
export class PCardModule {}
