import { DataInputBase } from './data-input-base';
export class PrimitiveDataInput extends DataInputBase {
    constructor(calculateFn) {
        super();
        this.calculateFn = calculateFn;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get dataVersion() {
        return this.calculateFn();
    }
}
//# sourceMappingURL=primitive-data-input.js.map