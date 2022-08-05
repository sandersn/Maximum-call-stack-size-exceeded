import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PCollapsibleComponent } from './p-collapsible.component';
import { PFaIconModule } from '../../../shared/core/component/fa-icon/fa-icon.module';

@NgModule({
	imports: [
		CommonModule,
		PFaIconModule,
	],
	exports: [PCollapsibleComponent],
	declarations: [PCollapsibleComponent],
	providers: [],
})
export class PCollapsibleModule { }
