import { AfterViewInit} from '@angular/core';
import { Directive, ElementRef } from '@angular/core';

@Directive({
	/* eslint-disable @angular-eslint/directive-selector */
	selector: '[autofocus]',
})
export class AutofocusDirective implements AfterViewInit {
	constructor(private elementRef : ElementRef) {}

	public ngAfterViewInit() : void {
		this.elementRef.nativeElement.focus();
	}

}
