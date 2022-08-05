import { Subject } from 'rxjs';
import { ApiBase } from '@plano/shared/api/base/api-base';
import { Id } from '@plano/shared/api/base/id';
import { Meta } from '@plano/shared/api/base/meta';
import { ApiAttributeInfo } from './api-attribute-info';
import { ObjectWithRawData } from './object-with-raw-data';

/**
 * The base class for api data wrappers.
 */
export abstract class ApiDataWrapperBase extends ObjectWithRawData {
	public parent : ApiDataWrapperBase | null = null;

	public attributeInfoThis ! : ApiAttributeInfo<any, any>;

	/**
	 * A subject which completes on item destroy.
	 */
	public readonly destroyed = new Subject<ApiDataWrapperBase>();

	constructor(public api : ApiBase | null) {
		super();
	}

	/**
	 * Returns the id of this wrapper.
	 */
	public abstract get id() : Id | null;

	/**
	 * Replaces all id references which were found in the map "idReplacements" map.
	 * @param idReplacements
	 */
	public abstract _fixIds(idReplacements : Map<any, number>) : void;

	/**
	 * The `dni` number being used for `loadDetailed()`. `dni` meaning detailed-node-id. It identifies uniquely a node of current api.
	 */
	protected abstract get dni() : string;

	/**
	 * Updates the raw data of this wrapper.
	 * @param data New raw data.
	 * @param generateMissingData Should missing raw data be generated? I.e. if the wrapper structure
	 * 		requires a given structure but this is not available in the raw data then the missing
	 * 		part will be generated.
	 */
	public _updateRawData(data : any[] | null, _generateMissingData : boolean) : void {
		if (!data) {
			// wrapper is being "destroyed". Inform others.
			this.destroyed.next(this);
			this.destroyed.complete();
		}

		// Is this wrapper currently loaded in detail?
		if (data && this.api) {
			const di = this.api.getLastLoadSearchParams()?.get('di') ?? null;
			const dni = this.api.getLastLoadSearchParams()?.get('dni') ?? null;

			if (this.dni === dni && di && JSON.stringify(Meta.getId(data)) === di)
				this.api.currentlyDetailedLoaded = this;
		}
	}

	/**
	 * @returns Returns a list of the names of all child primitive attributes attached to this wrapper.
	 */
	public getChildPrimitiveNames() : Array<string> {
		const result = new Array<string>();

		// eslint-disable-next-line no-restricted-syntax
		for (const propertyName in this) {
			if (propertyName.startsWith('attributeInfo') && propertyName !== 'attributeInfoThis') {
				const attributeInfo = this[propertyName] as unknown as ApiAttributeInfo<ApiDataWrapperBase, unknown>;
				result.push(attributeInfo.name);
			}
		}

		return result;
	}

	/**
	 * @returns Returns a list of the names of all child wrapper attributes attached to this wrapper.
	 */
	public getChildWrapperNames() : Array<string> {
		const result = new Array<string>();

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
	public isPrimitive(attributeName : string) : boolean {
		// does primitive attribute-info exist for "attributeName"?
		const aIName = this.getPrimitiveAttributeInfoName(attributeName);
		return (this as any)[aIName];
	}

	private getPrimitiveAttributeInfoName(attributeName : string) : string {
		return `attributeInfo${  attributeName.charAt(0).toUpperCase()  }${attributeName.slice(1)}`;
	}

	/**
	 * @returns Returns the attribute-info for an attribute-name.
	 */
	public getAttributeInfo(attributeName : string) : ApiAttributeInfo<ApiDataWrapperBase, unknown> {
		// is primitive type?
		if (this.isPrimitive(attributeName)) {
			return (this as any)[this.getPrimitiveAttributeInfoName(attributeName)];
		} else {
			// otherwise it is a wrapper
			return (this as any)[attributeName].attributeInfoThis;
		}
	}

	/**
	 * Sets the array size of `data` to `arraySize` and replaces all fields with value `undefined`
	 * by `null`.
	 */
	protected fillWithDefaultValues(data : any[], arraySize : number) : void {
		data.length = arraySize;

		for (let i = 0; i < arraySize; ++i) {
			if (data[i] === undefined)
				data[i] = null;
		}
	}
}
