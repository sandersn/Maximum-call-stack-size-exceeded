/**
 * This is a Component that is only used for the tests.
 */

import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
	// eslint-disable-next-line literal-blacklist/literal-blacklist
	template: '<p-textarea [(ngModel)]="value"></p-textarea>',
	// template: `
	// 	<p-input-new [placeholder]="placeholder" [type]="type" [id]="id" [(ngModel)]="name"></p-input-new>
	// `,
	selector: 'p-custom-textarea-test-component',
})
export class CustomTextareaTestComponent {
	constructor(
		private cd : ChangeDetectorRef,
	) {
	}

	private _value : string = '';
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get value() : string {
		return this._value;
	}
	public set value(input : string) {
		this._value = input;
		this.cd.detectChanges();
	}
}
