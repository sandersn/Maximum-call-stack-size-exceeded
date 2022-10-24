import { ApiObjectWrapper } from '..';
class AttributeInfoVars {
}
export class ApiAttributeInfo {
    constructor(args) {
        this.args = args;
    }
    /**
     * The wrapper object to which this attribute-info belongs.
     */
    get apiObjWrapper() {
        return this.args.apiObjWrapper;
    }
    /**
     * The name of the attribute represented by this attribute-info object.
     */
    get name() {
        return this.args.name;
    }
    /**
     * The api-node name for this attribute. This value is unique in this api.
     */
    get id() {
        return this.args.id;
    }
    /**
     * The api object.
     */
    get api() {
        return this.args.apiObjWrapper.api;
    }
    /**
     * The primitive type of this attribute-info. Note, that when this is a wrapper object
     * then it does not represent a primitive type and thus this returns `null`.
     */
    get primitiveType() {
        if (typeof this.args.primitiveType !== 'function')
            return this.args.primitiveType;
        return this.args.primitiveType.call(this.args.apiObjWrapper);
    }
    /**
     * @returns Is the wrapper of this attribute-info a new item?
     */
    isNewItem() {
        return (this.args.apiObjWrapper instanceof ApiObjectWrapper) ? this.args.apiObjWrapper.isNewItem() : false;
    }
    /**
     * @returns Returns the value.
     */
    get value() {
        return this.args.apiObjWrapper[this.args.name];
    }
    /**
     * Sets the value.
     */
    set value(value) {
        this.args.apiObjWrapper[this.args.name] = value;
    }
    /**
     * @returns Should the input/control associated with the attribute be shown?
     */
    get show() {
        const parent = this.parentAttributeInfo;
        if (parent && !parent.show)
            return false;
        return this.args.show ? this.args.show.call(this.args.apiObjWrapper) : true;
    }
    /**
     * @returns Can the value of this attribute be edited now?
     */
    get canEdit() {
        const parent = this.parentAttributeInfo;
        if (parent && !parent.canEdit)
            return false;
        return this.args.canEdit ? this.args.canEdit.call(this.args.apiObjWrapper) : true;
    }
    /**
     * @returns Is the value of this attribute generally not editable for current user? Then it
     * is in read-mode and it will be visualized more like a label.
     */
    get readMode() {
        const parent = this.parentAttributeInfo;
        if (parent === null || parent === void 0 ? void 0 : parent.readMode)
            return true;
        return (this.args.readMode ? this.args.readMode.call(this.args.apiObjWrapper) : false) && !this.canEdit;
    }
    /**
     * @returns Returns a list of validators for this attribute.
     */
    get validations() {
        return this.args.validations ? this.args.validations.call(this.args.apiObjWrapper) : [];
    }
    /**
     * Additional vars for this attribute-info. See `AttributeInfoVars` for possible values.
     */
    get vars() {
        var _a;
        return (_a = this.args.vars) !== null && _a !== void 0 ? _a : {};
    }
    get parentAttributeInfo() {
        // Is this the attribute-info of the object wrapper?
        if (this.args.apiObjWrapper.attributeInfoThis === this) {
            // Then return the attribute info of parent
            const parent = this.args.apiObjWrapper.parent;
            return parent ? parent.attributeInfoThis : null;
        }
        else {
            // otherwise it a primitive type attribute-info.
            return this.args.apiObjWrapper.attributeInfoThis;
        }
    }
}
//# sourceMappingURL=api-attribute-info.js.map