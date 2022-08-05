import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
	/* eslint-disable @angular-eslint/directive-selector */
	selector: '[affected]',
})
export class AffectedDirective {
	@HostBinding('class.affected')
	@Input() public affected ! : boolean;

	constructor() {}
}
