import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GridComponent } from './grid.component';

@NgModule({
	imports: [
		CommonModule,
	],
	declarations: [
		GridComponent,
	],
	providers: [],
	exports: [
		GridComponent,
	],
})
export class PGridModule {}
