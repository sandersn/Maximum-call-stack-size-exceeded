import { DataBase } from './data-base';
/**
 * A Data class which uses three parameters to calculate its value.
 * This class caches the result for each parameter combination which is called. When any
 * of the DataInput changes the whole cache is then cleared.
 *
 * This class does not support "undefined" values being passed as parameters.
 * Also see toNumber() for currently supported parameter types.
 */
export class ThreeParameterData extends DataBase {
    constructor(input1, input2 = null, input3 = null) {
        super(input1, input2, input3);
        this.cachedValue = new Array();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get(param1, param2, param3, calculateFn) {
        // reset all data because input changed?
        if (this.inputsChanged())
            this.cachedValue = new Array();
        // ensure array structure
        const index1 = this.toNumber(param1);
        const index2 = this.toNumber(param2);
        const index3 = this.toNumber(param3);
        if (!this.cachedValue[index1])
            this.cachedValue[index1] = new Array();
        if (!this.cachedValue[index1][index2])
            this.cachedValue[index1][index2] = new Array();
        // get value
        let result = this.cachedValue[index1][index2][index3];
        if (result === undefined) {
            result = calculateFn();
            this.cachedValue[index1][index2][index3] = result;
        }
        return result;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toNumber(value) {
        if (typeof value === 'boolean')
            return value ? 1 : 0;
        else if (typeof value === 'number')
            return value;
        throw new Error('Unsupported parameter type.');
    }
}
//# sourceMappingURL=three-parameter-data.js.map