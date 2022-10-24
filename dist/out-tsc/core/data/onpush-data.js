import { DataBase } from './data-base';
export class OnPushData extends DataBase {
    constructor(changeDetectorRef, input1 = null, input2 = null, input3 = null) {
        super(input1, input2, input3);
        this.changeDetectorRef = changeDetectorRef;
        this.lastValue = null;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    update(calculateFn) {
        if (this.inputsChanged())
            this.cachedValue = calculateFn();
        if (this.cachedValue !== this.lastValue) {
            this.lastValue = this.cachedValue;
            this.changeDetectorRef.markForCheck();
        }
    }
}
//# sourceMappingURL=onpush-data.js.map