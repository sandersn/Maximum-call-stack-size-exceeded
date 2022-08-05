import { DataInputBase } from './data-input-base';

export class PrimitiveDataInput<T> extends DataInputBase {
	constructor(private calculateFn : () => T) {
		super();
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get dataVersion() : T {
		return this.calculateFn();
	}
}
