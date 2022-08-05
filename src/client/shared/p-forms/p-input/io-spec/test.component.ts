/**
 * This is a Component that is only used for the tests.
 */

import { Component, ChangeDetectorRef } from '@angular/core';
import { PApiPrimitiveTypes, PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';import { PInputComponent } from '../p-input.component';
// import { AbstractControl } from '@angular/forms';

@Component({
	templateUrl: './test.component.html',
	styleUrls: ['./test.component.scss'],
	selector: 'p-custom-input-test-component',
})
export class PInputTestComponent {
	constructor(
		private cd : ChangeDetectorRef,
	) {
		// this.formGroup = new PFormGroup({});
	}

	// public override ngAfterContentChecked() : void {
	// 	if (!this.formControl) throw new Error('formControl is required for CustomInputTestComponent');
	// }

	// protected formGroup : PFormGroup;
	// public get formControl() : AbstractControl { return this.formGroup.get('someControl'); }
	// public set formControl(input : AbstractControl) {
	// 	this.formGroup.removeControl('someControl');
	// 	this.formGroup.addControl('someControl', input);
	// }

	private _value : string | number | null = null;
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get value() : string | number | null {
		return this._value;
	}
	public set value(input : string | number | null) {
		this._value = input;
		this.cd.detectChanges();
	}

	public placeholder : string = 'custom placeholder';
	public type : PInputComponent['type'] = PApiPrimitiveTypes.string;
	public id : string = 'custom_id';
	public locale : PSupportedLocaleIds = PSupportedLocaleIds.de_DE;
	public durationUIType : PInputComponent['durationUIType'] = null;
}
