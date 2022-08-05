import { PValidatorObject } from '@plano/shared/core/validators.types';
import { ApiBase } from './api-base';
import { Integer, PApiPrimitiveTypes } from './generated-types.ag';
import { ApiDataWrapperBase} from '..';
import { ApiObjectWrapper } from '..';
import { NonNullAndNonUndefined } from '../../core/null-type-utils';
import { PDictionarySourceString } from '../../core/pipe/localize.dictionary';

class AttributeInfoVars {

	/**
	 * What is the expected validation error text for this attribute-info? When undefined then
	 * this means that no validation errors should exist.
	 *
	 * This is used for implementing automatic testing and has no relevance for the normal app.
	 */
	public expectedValidationError ?: string;

	/**
	 * The image ration (= width / height). Can only be used with type `Image`
	 */
	public imageRatio ?: number;

	/**
	 * Max file size in kilobytes. Can only be used with type `Image`.
	 */
	public imageMaxSize ?: Integer;

	/**
	 * Min image width in pixels. Can only be used with type `Image`.
	 */
	public imageMinWidth ?: Integer;

	/**
	 * Min image height in pixels. Can only be used with type `Image`.
	 */
	public imageMinHeight ?: Integer;

	/**
	 * A hint to be shown to the user when this attribute cannot be edited.
	 * Set a function here, if the text has potential to change under a certain condition.
	 */
	public cannotEditHint ?: PDictionarySourceString | (() => PDictionarySourceString);
}

/**
 * Note that the passed methods have a "this" parameter which has the correct Wrapper type (not the base wrapper type).
 */
interface ApiAttributeInfoArgs<X extends ApiDataWrapperBase> {
	apiObjWrapper : X;

	/**
	 * The api attribute name.
	 */
	name : string;

	/**
	 * This should be the api node-name. It is unique in the given api.
	 */
	id : string;

	/**
	 * The PrimitiveType of the attributeInfo's value.
	 * Can be `null` in case of so called wrapper classes like SchedulingApiList.attributeInfoThis.primitiveType
	 */
	primitiveType ?: PApiPrimitiveTypes | (() => PApiPrimitiveTypes) | null;

	show ?: ((this : X) => boolean) | null;
	canEdit ?: ((this : X) => boolean) | null;

	/**
	 * This attribute-info should return readMode() true when:
	 * 	(parent.readMode || (this.readMode && !this.canEdit)).
	 */
	readMode ?: ((this : X) => boolean) | null;

	validations ?: ((this : X) => (() => PValidatorObject | null)[]) | null;

	vars ?: AttributeInfoVars | null;
}


export class ApiAttributeInfo<X extends ApiDataWrapperBase, Y> {
	constructor(private args : ApiAttributeInfoArgs<X>) {
	}

	/**
	 * The wrapper object to which this attribute-info belongs.
	 */
	public get apiObjWrapper() : X {
		return this.args.apiObjWrapper;
	}

	/**
	 * The name of the attribute represented by this attribute-info object.
	 */
	public get name() : string {
		return this.args.name;
	}

	/**
	 * The api-node name for this attribute. This value is unique in this api.
	 */
	public get id() : string {
		return this.args.id;
	}

	/**
	 * The api object.
	 */
	public get api() : ApiBase | null {
		return this.args.apiObjWrapper.api;
	}

	/**
	 * The primitive type of this attribute-info. Note, that when this is a wrapper object
	 * then it does not represent a primitive type and thus this returns `null`.
	 */
	public get primitiveType() : (Y extends ApiDataWrapperBase ? null : PApiPrimitiveTypes) {
		if (typeof this.args.primitiveType !== 'function') return this.args.primitiveType as any;
		return this.args.primitiveType.call(this.args.apiObjWrapper) as any;
	}

	/**
	 * @returns Is the wrapper of this attribute-info a new item?
	 */
	public isNewItem() : boolean {
		return (this.args.apiObjWrapper instanceof ApiObjectWrapper) ? this.args.apiObjWrapper.isNewItem() : false;
	}

	/**
	 * @returns Returns the value.
	 */
	public get value() : NonNullAndNonUndefined<Y> | null {
		return (this.args.apiObjWrapper as any)[this.args.name];
	}

	/**
	 * Sets the value.
	 */
	public set value(value : NonNullAndNonUndefined<Y> | null) {
		(this.args.apiObjWrapper as any)[this.args.name] = value;
	}

	/**
	 * @returns Should the input/control associated with the attribute be shown?
	 */
	public get show() : boolean {
		const parent = this.parentAttributeInfo;
		if (parent && !parent.show)
			return false;

		return this.args.show ? this.args.show.call(this.args.apiObjWrapper) : true;
	}

	/**
	 * @returns Can the value of this attribute be edited now?
	 */
	public get canEdit() : boolean {
		const parent = this.parentAttributeInfo;
		if (parent && !parent.canEdit)
			return false;

		return this.args.canEdit ? this.args.canEdit.call(this.args.apiObjWrapper) : true;
	}

	/**
	 * @returns Is the value of this attribute generally not editable for current user? Then it
	 * is in read-mode and it will be visualized more like a label.
	 */
	public get readMode() : boolean {
		const parent = this.parentAttributeInfo;
		if (parent?.readMode)
			return true;

		return (this.args.readMode ? this.args.readMode.call(this.args.apiObjWrapper) : false) && !this.canEdit;
	}

	/**
	 * @returns Returns a list of validators for this attribute.
	 */
	public get validations() : (() => PValidatorObject | null)[] {
		return this.args.validations ? this.args.validations.call(this.args.apiObjWrapper) : [];
	}

	/**
	 * Additional vars for this attribute-info. See `AttributeInfoVars` for possible values.
	 */
	public get vars() : AttributeInfoVars {
		return this.args.vars ?? {};
	}

	private get parentAttributeInfo() : ApiAttributeInfo<any, any> | null {
		// Is this the attribute-info of the object wrapper?
		if (this.args.apiObjWrapper.attributeInfoThis === this) {
			// Then return the attribute info of parent
			const parent = this.args.apiObjWrapper.parent;
			return parent ? parent.attributeInfoThis : null;
		} else {
			// otherwise it a primitive type attribute-info.
			return this.args.apiObjWrapper.attributeInfoThis;
		}
	}
}
