import { Subject } from 'rxjs';
import { DataInputBase } from './data-input-base';
export class DataInput extends DataInputBase {
    constructor(zone) {
        super();
        this.zone = zone;
        /**
         * The value is the property name which changed.
         */
        this.onChange = new Subject();
        this._dataVersion = 0;
    }
    /**
     * @param change What has changed?
     */
    changed(change) {
        ++this._dataVersion;
        // don’t trigger change detection for performance reasons
        this.zone.runOutsideAngular(() => {
            this.onChange.next(change !== null && change !== void 0 ? change : null);
        });
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get dataVersion() {
        return this._dataVersion;
    }
}
//# sourceMappingURL=data-input.js.map