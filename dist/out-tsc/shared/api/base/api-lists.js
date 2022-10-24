import { ApiListWrapper } from '@plano/shared/api';
/**
 * A list class containing other api-lists.
 */
export class ApiLists extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems);
        this.api = api;
    }
    createNewItem() {
        throw new Error('unsupported');
    }
    wrapItem(_item, _generateMissingData) {
        throw new Error('unsupported');
    }
    /**
     * @returns Does this list contains primitive items?
     */
    containsPrimitives() {
        return false;
    }
    /**
     * @returns Does this list contains id items?
     */
    containsIds() {
        return false;
    }
    /**
     * @returns The `dni` value of this list. See `common.txt`.
     */
    get dni() {
        return '0';
    }
    /**
     * @returns Creates and returns a new instance of this list.
     */
    createInstance(removeDestroyedItems) {
        return new ApiLists(this.api, removeDestroyedItems);
    }
}
//# sourceMappingURL=api-lists.js.map