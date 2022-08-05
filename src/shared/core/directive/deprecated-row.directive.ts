import { Directive } from '@angular/core';
import { LogService } from '../log.service';

@Directive({
	/* eslint-disable @angular-eslint/directive-selector */
	selector: '.row',
})
export class DeprecatedRowDirective {
	constructor(
		private console : LogService,
	) {
		this.console.deprecated(`Deprecated: Please replace e.g. <div class="row"> with <p-grid>`);
	}
}
