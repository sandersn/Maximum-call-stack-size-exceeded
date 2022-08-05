import { DataBase } from './data-base';
import { DataInputBase } from './data-input-base';

export class Data<T> extends DataBase<T> {
	constructor(input1 : DataInputBase | null, input2 : DataInputBase | null = null, input3 : DataInputBase | null = null) {
		super(input1, input2, input3);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get(calculateFn : () => T) : T {
		if (this.inputsChanged()) {
			this.cachedValue = calculateFn();
		}

		return this.cachedValue;
	}
}
