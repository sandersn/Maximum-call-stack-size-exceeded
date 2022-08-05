import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PLedComponent } from './p-led.component';

@NgModule({
	imports: [
		CommonModule,
	],
	declarations: [
		PLedComponent,
	],
	providers: [
	],
	exports: [
		PLedComponent,
	],
})
export class PLedModule {}
