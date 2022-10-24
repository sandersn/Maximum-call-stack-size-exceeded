import { DataBase } from './data-base';
export class Data extends DataBase {
    constructor(input1, input2 = null, input3 = null) {
        super(input1, input2, input3);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get(calculateFn) {
        if (this.inputsChanged()) {
            this.cachedValue = calculateFn();
        }
        return this.cachedValue;
    }
}
//# sourceMappingURL=data.js.map