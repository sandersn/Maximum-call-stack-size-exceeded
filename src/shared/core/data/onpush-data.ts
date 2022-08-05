import { ChangeDetectorRef } from '@angular/core';
import { DataBase } from './data-base';
import { DataInput } from './data-input';

export class OnPushData<T> extends DataBase<T> {
	private lastValue : T | null = null;

	constructor(private changeDetectorRef : ChangeDetectorRef
		, 	       input1 : DataInput | null = null
		, 	       input2 : DataInput | null = null
		, 	       input3 : DataInput | null = null) {
		super(input1, input2, input3);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public update(calculateFn : () => T) : void {
		if (this.inputsChanged())
			this.cachedValue = calculateFn();

		if (this.cachedValue !== this.lastValue) {
			this.lastValue = this.cachedValue;
			this.changeDetectorRef.markForCheck();
		}
	}
}
