/**
 * This is a Component that is only used for the tests.
 */
import { Component, ChangeDetectorRef } from '@angular/core';
import { PFormControl } from '../../p-form-control';

@Component({
	template: `<p-multi-value-input
		[(ngModel)]="value"
		[formControl]="formControl"
	></p-multi-value-input>`,
	// template: `
	// 	<p-input-new [placeholder]="placeholder" [type]="type" [id]="id" [(ngModel)]="name"></p-input-new>
	// `,
	selector: 'p-multi-value-input-component',
})
export class CustomMultiValueInputTestComponent {
	constructor(
		private cd : ChangeDetectorRef,
	) {
	}

	public formControl = new PFormControl({});

	private _value : string[] = [];
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get value() : string[] {
		return this._value;
	}
	public set value(input : string[]) {
		this._value = input;
		this.cd.detectChanges();
	}
}
