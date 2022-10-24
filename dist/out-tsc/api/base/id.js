import { IdBase } from './id-base';
/**
 * Representing an database Id object. This should behave like an primitive.
 * The user expects to use the "=" operator to make copies. So, the content of an id should never be changed
 * afterward it was initialized.
 */
export class Id extends IdBase {
    /**
     * @param value The raw-data of the shift-id or a negative new-item-id.
     */
    static create(value) {
        return new Id(value);
    }
    constructor(value) {
        super(value);
    }
}
//# sourceMappingURL=id.js.map