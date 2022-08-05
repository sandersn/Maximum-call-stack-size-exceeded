import { HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { ApiLoadArgs, ApiSaveArgs} from '@plano/shared/api';
import { ApiDataWrapperBase } from '@plano/shared/api';
import { ApiBase } from '@plano/shared/api/base/api-base';
import { Meta } from '@plano/shared/api/base/meta';
import { Id } from './id';
import { IdBase } from './id-base';
import { notNull } from '../../core/null-type-utils';

/**
 * A wrapper class for api object data.
 */
export abstract class ApiObjectWrapper<T extends ApiObjectWrapper<any, any>, ValidationMode extends 'draft' | 'validated'> extends ApiDataWrapperBase {
	constructor(api : ApiBase | null, private implementationConstructor: (new (api : ApiBase | null) => T)) {
		super(api);
	}

	/**
	 * @returns Is this a newly created object?
	 */
	public isNewItem() : boolean {
		// Note that we explicitly use the id (instead of the newItemId) to check if an item is new because
		// newItemId is not resetted. See ApiListWrapper._updateRawData() for more details.
		return this.data && Meta.getId(this.data) === null;
	}

	/**
	 * @returns The new-item-id of this object.
	 */
	public get newItemId() : number {
		return this.data[0][3];
	}

	/**
	 * Use this method to define a function which can only be called by validated items.
	 */
	protected functionAssumingValidated<FunctionType>(fnc : FunctionType) : (ValidationMode extends 'validated' ? FunctionType : never) {
		return fnc as any;
	}

	/**
	 * currently this is equivalent to api.save().
	 */
	public saveDetailed({success = null, error = null} : ApiSaveArgs = {}) : Promise<HttpResponse<unknown>> {
		if (this.api === null) throw new Error('You can not use this method without a defined api');
		return this.api.save({success: success, error: error});
	}

	/**
	 * Loads the api data with a detailed view of this node.
	 */
	public loadDetailed({success = null, error = null, searchParams = null} : ApiLoadArgs = {}) : Promise<HttpResponse<unknown>> {
		if (this.api === null) throw new Error('You can not use loadDetailed() without a defined api');
		return ApiObjectWrapper.loadDetailedImpl(this.api, notNull(this.id), this.dni, { success: success, error: error, searchParams: searchParams});
	}

	/**
	 * Implementation for loading a detailed view of this object.
	 */
	protected static loadDetailedImpl(	api : ApiBase
		,	id : Id
		,	dni : string
		,	{success = null, error = null, searchParams = null} : ApiLoadArgs = {},
	) : Promise<HttpResponse<unknown>> {
		searchParams = searchParams ?? new HttpParams();

		searchParams = searchParams
			.set('dni', dni)
			.set('di', id.toString());

		return api.load({
			success: (response : HttpResponse<unknown>) => {
				if (success)
					success(response);
			},
			error: (response : HttpErrorResponse) => {
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
	public copy(doNotAddToIdReplacementListGetter ?: (data : any[]) => any[]) : T {
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
	protected setterImpl(rawDataIndex : number, newValue : any, propertyName : string, postCode : (() => void) | null = null) : void {
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
