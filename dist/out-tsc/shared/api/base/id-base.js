import { Meta } from './meta';
import { ObjectWithRawData } from './object-with-raw-data';
/**
 * Internal base class for all id classes. This should behave like an primitive.
 * The user expects to use the "=" operator to make copies. So, the content of an id should never be changed
 * afterward it was initialized.
 */
export class IdBase extends ObjectWithRawData {
    constructor(value) {
        super();
        this.data = value;
    }
    /**
     * Check if the passed "id" is equal this id. Note that the given id objects are not checked for equality.
     * Instead it is checked if the content of the rawData are equal.
     * @param id Should be a valid id object.
     */
    equals(id) {
        return id !== null && Meta.isSameId(this.data, id.data);
    }
    /**
     * Is this an id of an new entity?
     */
    isOfNewItem() {
        return typeof (this.data) === 'number' && this.data < 0;
    }
    toString() {
        return JSON.stringify(this.data);
    }
    /**
     * @returns Returns the item itself.
     */
    get id() {
        return this;
    }
}
//# sourceMappingURL=id-base.js.map