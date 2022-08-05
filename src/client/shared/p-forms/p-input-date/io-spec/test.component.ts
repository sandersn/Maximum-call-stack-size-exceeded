/**
 * This is a Component that is only used for the tests.
 */

import { Component, ChangeDetectorRef } from '@angular/core';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { PInputDateTypes } from '../p-input-date.component';
import { PInputDateComponent} from '../p-input-date.component';

@Component({
	templateUrl: './test.component.html',
	styleUrls: ['./test.component.scss'],
	selector: 'p-custom-input-test-component',
})
export class PInputDateTestComponent {
	constructor(
		private cd : ChangeDetectorRef,
	) {}

	private _value : string | number = '';
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get value() : string | number {
		return this._value;
	}
	public set value(input : string | number) {
		this._value = input;
		this.cd.detectChanges();
	}

	// placeholder: string = 'custom placeholder';
	public type : PInputDateComponent['type'] = PInputDateTypes.deadline;
	public min : number | null = null;
	public max : number | null = null;
	public locale : PSupportedLocaleIds = PSupportedLocaleIds.de_DE;
}
