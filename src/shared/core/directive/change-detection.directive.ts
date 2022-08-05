import { Directive, Input, ChangeDetectorRef } from '@angular/core';

@Directive({
	/* eslint-disable @angular-eslint/directive-selector */
	selector: '[changeDetection]',
})
export class ChangeDetectionDirective {
	constructor(private changeDetectorRef : ChangeDetectorRef) {}

	/**
	 * Should changes be detected?
	 */
	@Input() public set changeDetection(enable : boolean) {
		if (enable) {
			this.changeDetectorRef.reattach();
		} else {
			this.changeDetectorRef.detach();
		}
	}

}
