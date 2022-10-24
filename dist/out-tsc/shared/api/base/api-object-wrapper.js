import { HttpParams } from '@angular/common/http';
import { ApiDataWrapperBase } from '@plano/shared/api';
import { Meta } from '@plano/shared/api/base/meta';
import { IdBase } from './id-base';
import { notNull } from '../../core/null-type-utils';
/**
 * A wrapper class for api object data.
 */
export class ApiObjectWrapper extends ApiDataWrapperBase {
    constructor(api, implementationConstructor) {
        super(api);
        this.implementationConstructor = implementationConstructor;
    }
    /**
     * @returns Is this a newly created object?
     */
    isNewItem() {
        // Note that we explicitly use the id (instead of the newItemId) to check if an item is new because
        // newItemId is not resetted. See ApiListWrapper._updateRawData() for more details.
        return this.data && Meta.getId(this.data) === null;
    }
    /**
     * @returns The new-item-id of this object.
     */
    get newItemId() {
        return this.data[0][3];
    }
    /**
     * Use this method to define a function which can only be called by validated items.
     */
    functionAssumingValidated(fnc) {
        return fnc;
    }
    /**
     * currently this is equivalent to api.save().
     */
    saveDetailed({ success = null, error = null } = {}) {
        if (this.api === null)
            throw new Error('You can not use this method without a defined api');
        return this.api.save({ success: success, error: error });
    }
    /**
     * Loads the api data with a detailed view of this node.
     */
    loadDetailed({ success = null, error = null, searchParams = null } = {}) {
        if (this.api === null)
            throw new Error('You can not use loadDetailed() without a defined api');
        return ApiObjectWrapper.loadDetailedImpl(this.api, notNull(this.id), this.dni, { success: success, error: error, searchParams: searchParams });
    }
    /**
     * Implementation for loading a detailed view of this object.
     */
    static loadDetailedImpl(api, id, dni, { success = null, error = null, searchParams = null } = {}) {
        searchParams = searchParams !== null && searchParams !== void 0 ? searchParams : new HttpParams();
        searchParams = searchParams
            .set('dni', dni)
            .set('di', id.toString());
        return api.load({
            success: (response) => {
                if (success)
                    success(response);
            },
            error: (response) => {
                api.data._updateRawData(null, false);
                if (error)
                    error(response);
            },
            searchParams: searchParams,
        });
    }
    /**
     * @returns A copy of this item.
     */
    copy(doNotAddToIdReplacementListGetter) {
        // copy data
        const dataCopy = $.extend(true, [], this.data);
        const doNotAddToIdReplacementList = doNotAddToIdReplacementListGetter ? doNotAddToIdReplacementListGetter(dataCopy) : [];
        const idReplacements = Meta.replaceIdsByNewItemIds(dataCopy, doNotAddToIdReplacementList);
        // copy wrapper
        const newWrapper = new this.implementationConstructor(this.api);
        newWrapper._updateRawData(dataCopy, false);
        // fix id references
        newWrapper._fixIds(idReplacements);
        return newWrapper;
    }
    /**
     * Helper method to implement setters.
     */
    setterImpl(rawDataIndex, newValue, propertyName, postCode = null) {
        if (newValue instanceof IdBase)
            newValue = newValue.rawData;
        if (newValue !== this.data[rawDataIndex]) {
            this.data[rawDataIndex] = newValue;
            if (postCode !== null)
                postCode();
            if (this.api)
                this.api.changed(propertyName);
        }
    }
}
//# sourceMappingURL=api-object-wrapper.js.map