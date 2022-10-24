import { Subject } from 'rxjs';
import { Meta } from '@plano/shared/api/base/meta';
import { ObjectWithRawData } from './object-with-raw-data';
/**
 * The base class for api data wrappers.
 */
export class ApiDataWrapperBase extends ObjectWithRawData {
    constructor(api) {
        super();
        this.api = api;
        this.parent = null;
        /**
         * A subject which completes on item destroy.
         */
        this.destroyed = new Subject();
    }
    /**
     * Updates the raw data of this wrapper.
     * @param data New raw data.
     * @param generateMissingData Should missing raw data be generated? I.e. if the wrapper structure
     * 		requires a given structure but this is not available in the raw data then the missing
     * 		part will be generated.
     */
    _updateRawData(data, _generateMissingData) {
        var _a, _b, _c, _d;
        if (!data) {
            // wrapper is being "destroyed". Inform others.
            this.destroyed.next(this);
            this.destroyed.complete();
        }
        // Is this wrapper currently loaded in detail?
        if (data && this.api) {
            const di = (_b = (_a = this.api.getLastLoadSearchParams()) === null || _a === void 0 ? void 0 : _a.get('di')) !== null && _b !== void 0 ? _b : null;
            const dni = (_d = (_c = this.api.getLastLoadSearchParams()) === null || _c === void 0 ? void 0 : _c.get('dni')) !== null && _d !== void 0 ? _d : null;
            if (this.dni === dni && di && JSON.stringify(Meta.getId(data)) === di)
                this.api.currentlyDetailedLoaded = this;
        }
    }
    /**
     * @returns Returns a list of the names of all child primitive attributes attached to this wrapper.
     */
    getChildPrimitiveNames() {
        const result = new Array();
        // eslint-disable-next-line no-restricted-syntax
        for (const propertyName in this) {
            if (propertyName.startsWith('attributeInfo') && propertyName !== 'attributeInfoThis') {
                const attributeInfo = this[propertyName];
                result.push(attributeInfo.name);
            }
        }
        return result;
    }
    /**
     * @returns Returns a list of the names of all child wrapper attributes attached to this wrapper.
     */
    getChildWrapperNames() {
        const result = new Array();
        // eslint-disable-next-line no-restricted-syntax
        for (const propertyName in this) {
            if (propertyName.endsWith('Wrapper')) {
                // remove "Wrapper" from end
                const wrapperAttributeName = propertyName.slice(0, -7);
                result.push(wrapperAttributeName);
            }
        }
        return result;
    }
    /**
     * @returns Is "attributeName" a primitive attribute?
     */
    isPrimitive(attributeName) {
        // does primitive attribute-info exist for "attributeName"?
        const aIName = this.getPrimitiveAttributeInfoName(attributeName);
        return this[aIName];
    }
    getPrimitiveAttributeInfoName(attributeName) {
        return `attributeInfo${attributeName.charAt(0).toUpperCase()}${attributeName.slice(1)}`;
    }
    /**
     * @returns Returns the attribute-info for an attribute-name.
     */
    getAttributeInfo(attributeName) {
        // is primitive type?
        if (this.isPrimitive(attributeName)) {
            return this[this.getPrimitiveAttributeInfoName(attributeName)];
        }
        else {
            // otherwise it is a wrapper
            return this[attributeName].attributeInfoThis;
        }
    }
    /**
     * Sets the array size of `data` to `arraySize` and replaces all fields with value `undefined`
     * by `null`.
     */
    fillWithDefaultValues(data, arraySize) {
        data.length = arraySize;
        for (let i = 0; i < arraySize; ++i) {
            if (data[i] === undefined)
                data[i] = null;
        }
    }
}
//# sourceMappingURL=api-data-wrapper-base.js.map