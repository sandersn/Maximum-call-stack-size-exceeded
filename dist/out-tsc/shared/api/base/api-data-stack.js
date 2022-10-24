import { ObjectDiff } from './object-diff';
import { Meta } from '..';
import { assumeNonNull } from '../../core/null-type-utils';
/**
 * Data Stacks. Note that the order is important as the stack with highest ordinal which has data is the one
 * which is revealed outside of api. See method getTop().
 */
var Stack;
(function (Stack) {
    /**
     * Source of the data which is used to calculate diffs to be saved.
     */
    Stack[Stack["SRC"] = 0] = "SRC";
    /**
     * Current client data. All backend operations are done on this level.
     * Consequently, COPY is just a temporary copy which is ignored for any backend operations.
     */
    Stack[Stack["CURRENT"] = 1] = "CURRENT";
    /**
     * Current copied data.
     */
    Stack[Stack["COPY"] = 2] = "COPY";
    /**
     * Number of stacks.
     */
    Stack[Stack["STACK_COUNT"] = 3] = "STACK_COUNT";
})(Stack || (Stack = {}));
/**
 * This internal class manages the api data. Note that this class does not supported
 * simultaneous backend operations (See "PREVENT OVERLAPPING SAVES" in api -> common.txt).
 */
export class ApiDataStack {
    constructor(onDataObjectChanged) {
        this.onDataObjectChanged = onDataObjectChanged;
        // initialize stack
        this.stack = Array(Stack.STACK_COUNT);
        this.clear(false);
    }
    /**
     * Clear all available api data.
     */
    clear(notifyChange = true) {
        for (let i = 0; i < Stack.STACK_COUNT; ++i)
            this.stack[i] = null;
        if (notifyChange)
            this.onDataObjectChanged('clear');
    }
    /**
     * Returns the diff between backend data and data queued for save.
     */
    getDataToSave(onlySavePath) {
        return ObjectDiff.diff(this.stack[Stack.SRC], this.getTop(), onlySavePath);
    }
    /**
     * @returns Is any api data available?
     */
    isDataLoaded() {
        return !!this.stack[Stack.CURRENT];
    }
    /**
     * Callback being called when backend responds with an error code.
     */
    onBackendError() {
        // On error don’t change the data. There are two cases:
        // - Server is not reachable: Then the changes are not lost. So the user should still be
        //		able to retrigger the save. I think this cases is not working properly at the moment.
        //		See "V1" in https://drplano.atlassian.net/browse/PLANO-14194
        // - Backend error: Currently some automatic tests intentionally trigger some errors and
        // 		after that there should be still a state to work with.
        // 		See e.g. shift-exchange tests.
        // 		For normal app there is anyway an error modal to enforce reload of page. So the invalid state
        //		is discarded.
    }
    /**
     * Callback being called when a load operation is initiated.
     */
    onLoadOperation() {
    }
    /**
     * Callback being called when a save operation is initiated.
     */
    onSaveOperation(dataToSave) {
        // merge data being saved with current SRC to get new SRC
        ObjectDiff.merge(this.stack[Stack.SRC], dataToSave);
    }
    /**
     * @param data Response from backend.
     */
    onBackendResponse(data) {
        // ensure changes on data-stacks are not lost
        this.updateDataStack(data, Stack.CURRENT);
        if (this.stack[Stack.COPY])
            this.updateDataStack(data, Stack.COPY);
        // Backend response becomes new source
        this.stack[Stack.SRC] = this.copy(data);
        this.onDataObjectChanged('onBackendResponse');
    }
    /**
     * See `Meta.updateNewItemDbIds()`
     * @param data Response from backend.
     */
    updateNewItemDbIds(data) {
        Meta.updateNewItemDbIds(this.stack[Stack.CURRENT], data);
        if (this.stack[Stack.COPY])
            Meta.updateNewItemDbIds(this.stack[Stack.COPY], data);
        this.onDataObjectChanged('onBackendResponse');
    }
    updateDataStack(backendResponse, stackIndex) {
        // If there is some old value ensure changes are not los
        if (this.stack[stackIndex]) {
            const diff = ObjectDiff.diff(this.stack[Stack.SRC], this.stack[stackIndex]);
            // take backend-response plus diffs done on the data
            this.stack[stackIndex] = this.copy(backendResponse);
            ObjectDiff.merge(this.stack[stackIndex], diff);
        }
        else {
            // otherwise just copy backend response
            this.stack[stackIndex] = this.copy(backendResponse);
        }
    }
    /**
     * Callback being called when backend response of a load operation arrives.
     */
    onLoadResponse(data) {
        this.onBackendResponse(data);
    }
    /**
     * Callback being called when backend response of a save operation arrives.
     */
    onSaveResponse(data, isResponseForLastApiCall) {
        // If this response is not for the last load() or save() call we can ignore it
        // or otherwise it will "shadow" changes done after the save() call. See
        // "consecutive-save-call-changes-are-not-shadowed" test.
        // We only need to ensure that new-items are updated with incoming db-ids
        // or otherwise wrapper items will get invalid because they cannot be associated
        // anymore with the correct item. See
        // "new-item-wrapper-is-not-lost-when-calling-load-after-item-creation" test.
        if (isResponseForLastApiCall)
            this.onBackendResponse(data);
        else
            this.updateNewItemDbIds(data);
    }
    /**
     * @returns Does a data-copy exists?
     */
    hasCopy() {
        return this.stack[Stack.COPY] !== null;
    }
    /**
     * Creates a data-copy.
     */
    createCopy() {
        // Only one copy is supported
        if (this.stack[Stack.COPY])
            throw new Error('You cannot create a data copy when already one is available.');
        // create copy
        this.stack[Stack.COPY] = this.copy(this.getTop());
        this.onDataObjectChanged('createCopy');
    }
    /**
     * Dismiss the data-copy.
     */
    dismissCopy() {
        // no copy available to dismiss?
        if (this.stack[Stack.COPY] === null)
            throw new Error('No data copy available. Forgot to call createCopy()?');
        this.stack[Stack.COPY] = null;
        this.onDataObjectChanged('dismissCopy');
    }
    /**
     * Merge the data-copy.
     */
    mergeCopy() {
        // no copy available to merge?
        if (this.stack[Stack.COPY] === null)
            throw new Error('No data copy available. Forgot to call createCopy()?');
        // find diff of copied data
        this.stack[Stack.CURRENT] = this.stack[Stack.COPY];
        this.stack[Stack.COPY] = null;
        this.onDataObjectChanged('mergeCopy');
    }
    /**
     * @returns Does the data-copy have any changes?
     */
    hasCopyChanged() {
        // no copy available to merge?
        if (this.stack[Stack.COPY] === null)
            throw new Error('No data copy available. Forgot to call createCopy()?');
        // find diff of copied data
        const copy = this.stack[Stack.COPY];
        assumeNonNull(copy);
        const diff = ObjectDiff.diff(this.stack[Stack.SRC], copy);
        return !!diff;
    }
    /**
     * @returns Has there been any changes between what api has sent and the current data?
     */
    hasTopChanged() {
        // find diff of TOP data
        const top = this.getTop();
        if (!top)
            throw new Error('No data exists.');
        const diff = ObjectDiff.diff(this.stack[Stack.SRC], top);
        return !!diff;
    }
    /**
     * @returns The data which has originally been sent by the api.
     */
    getDataSource() {
        return this.stack[Stack.SRC];
    }
    /**
     * @returns The current api data. This ignores any data copy.
     */
    getCurrent() {
        return this.stack[Stack.CURRENT];
    }
    /**
     * Returns the top level data of the stack. This is the data the user will work with,
     * i.e. the wrappers are bound to this data.
     */
    getTop() {
        // find the topmost stack level with data
        for (let i = Stack.STACK_COUNT - 1; i >= 0; --i) {
            if (this.stack[i] !== null)
                return this.stack[i];
        }
        return null;
    }
    copy(data) {
        // copy of null is null. right? :)
        if (data === null)
            return null;
        // JSON.parse(JSON.stringify(data)) was faster than the jQuery function.
        // But it would convert "undefined" to "null" because json does not know "undefined".
        // That was a problem for the diff methods.
        return $.extend(true, [], data);
    }
}
//# sourceMappingURL=api-data-stack.js.map