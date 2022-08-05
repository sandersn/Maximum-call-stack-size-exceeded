import { DataBase } from './data-base';
import { DataInputBase } from './data-input-base';

/**
 * A Data class which uses three parameters to calculate its value.
 * This class caches the result for each parameter combination which is called. When any
 * of the DataInput changes the whole cache is then cleared.
 *
 * This class does not support "undefined" values being passed as parameters.
 * Also see toNumber() for currently supported parameter types.
 */
export class ThreeParameterData<TData, TParam1, TParam2, TParam3> extends DataBase<TData[][][]> {
	constructor(input1 : DataInputBase, input2 : DataInputBase | null = null, input3 : DataInputBase | null = null) {
		super(input1, input2, input3);

		this.cachedValue = new Array<TData[][]>();
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get(
		param1 : TParam1,
		param2 : TParam2,
		param3 : TParam3,
		calculateFn : () => TData) : TData {
		// reset all data because input changed?
		if (this.inputsChanged())
			this.cachedValue = new Array<TData[][]>();

		// ensure array structure
		const index1 = this.toNumber(param1);
		const index2 = this.toNumber(param2);
		const index3 = this.toNumber(param3);

		if (!this.cachedValue[index1])
			this.cachedValue[index1] = new Array<TData[]>();

		if (!this.cachedValue[index1][index2])
			this.cachedValue[index1][index2] = new Array<TData>();

		// get value
		let result = this.cachedValue[index1][index2][index3];

		if (result === undefined) {
			result = calculateFn();
			this.cachedValue[index1][index2][index3] = result;
		}

		return result;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private toNumber(value : any) : number {
		if (typeof value === 'boolean')
			return value ? 1 : 0;
		else if (typeof value === 'number')
			return value;

		throw new Error('Unsupported parameter type.');
	}
}
