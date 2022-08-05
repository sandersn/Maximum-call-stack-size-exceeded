/**
 * This is a Component that is only used for the tests.
 */

import { Component, ChangeDetectorRef } from '@angular/core';

@Component({
	// eslint-disable-next-line literal-blacklist/literal-blacklist
	template: '<p-multi-select-checkbox [(ngModel)]="checked"></p-multi-select-checkbox>',
	// template: `
	// 	<p-input-new [placeholder]="placeholder" [type]="type" [id]="id" [(ngModel)]="name"></p-input-new>
	// `,
	selector: 'p-custom-checkbox-test-component',
})
export class CustomMultiSelectCheckboxTestComponent {
	constructor(
		private cd : ChangeDetectorRef,
	) {
	}

	private _checked : boolean = false;
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get checked() : boolean {
		return this._checked;
	}
	public set checked(input : boolean) {
		this._checked = input;
		this.cd.detectChanges();
	}
}
