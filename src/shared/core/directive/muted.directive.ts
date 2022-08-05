import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
	/* eslint-disable @angular-eslint/directive-selector */
	selector: '[muted]',
})
export class MutedDirective {
	@HostBinding('class.muted-item') private get isMuted() : boolean {
		return this.muted === true;
	}
	@HostBinding('class.unmuted-item') private get isUnmuted() : boolean {
		return this.muted === false;
	}

	@Input() public muted ! : boolean;

	constructor() {}
}
