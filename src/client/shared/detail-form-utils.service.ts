import { Injectable } from '@angular/core';
import { ApiObjectWrapper } from '@plano/shared/api';
import { ApiListWrapper } from '@plano/shared/api';
import { ApiBase } from '@plano/shared/api';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PUrlParamsServiceInterface } from '@plano/shared/core/p-service.interface';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PRouterService } from '@plano/shared/core/router.service';
import { PThemeEnum } from './bootstrap-styles.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../shared/core/null-type-utils';
import { SchedulingApiService } from '../scheduling/shared/api/scheduling-api.service';
import { ToastsService } from '../service/toasts.service';

@Injectable()
export class PDetailFormUtilsService {
	constructor(
		private toastsService : ToastsService,
		private localize : LocalizePipe,
		private modalService : ModalService,
		private pRouterService : PRouterService,
	) {
	}

	/**
	 * Save the provided new item to the database
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public saveNewItem(api : ApiBase, item : ApiObjectWrapper<any>, itemTitle : string, success ?: () => void, canBeANewItem ?: boolean) : void {
		assumeDefinedToGetStrictNullChecksRunning(item, 'item');
		assumeDefinedToGetStrictNullChecksRunning(!!itemTitle ? itemTitle : undefined, 'itemTitle');
		if (!item.isNewItem() && !canBeANewItem) throw new Error('This is not a new item');

		api.mergeDataCopy();

		const text : string = this.localize.transform('${itemTitle} wurde angelegt.', { itemTitle: itemTitle });
		item.saveDetailed({
			success: () : void => {
				this.toastsService.addToast({
					content: text,
					theme: PThemeEnum.SUCCESS,
				});
				if (success) success();
			},
		});
	}

	/**
	 * Create new item which than can be filled with data from the form
	 */
	public createNewItem<T>(
		api : SchedulingApiService,
		items : ApiListWrapper<T>,
		paramsService : PUrlParamsServiceInterface,
		success : (createdItem : T) => void,
	) : void {
		const createIt = () : void => {
			api.createDataCopy();
			const ITEM = items.createNewItem();
			success(ITEM);
		};

		if (api.isLoaded()) {
			createIt();
			return;
		}

		// Make sure other data is loaded so that a new item can be created.
		paramsService.updateQueryParams();
		assumeDefinedToGetStrictNullChecksRunning(paramsService.queryParams, 'paramsService.queryParams');
		api.load({
			searchParams: paramsService.queryParams,
			success: () => {
				createIt();
			},
		});
	}

	/** onDestroy */
	public onDestroy(api : ApiBase) : void {
		if (api.hasDataCopy()) api.dismissDataCopy();
	}

	/**
	 * Handle Click on delete button
	 */
	public onRemoveClick({
		modalTitle = undefined!,
		description = undefined!,
		action = undefined,
		api = undefined!,
		items = undefined!,
		item = undefined!,
		removeItemFn = undefined,
	} : {
		modalTitle : string, description : string, action ?: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		api : ApiBase, items : ApiListWrapper<ApiObjectWrapper<any>>, item : ApiObjectWrapper<any>,

		/**
		 * A function that removes the item.
		 * Setting this overwrites the default how a item gets removed (default is item gets removed from items array).
		 * The done callback MUST be called inside the removeItemFn!
		 *
		 * @example removeItemFn: (done) => { item.trashed = true; done(); }
		 */
		removeItemFn ?: (success : () => void) => void,
	}) : void {
		this.modalService.openDefaultModal({
			modalTitle: modalTitle,
			description: description,
			closeBtnLabel: this.localize.transform('Ja, ${action}', {
				// eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
				action: action ? action : this.localize.transform('Löschen'),
			}),
			hideDismissBtn: false,
		}, {
			theme: PThemeEnum.DANGER,
			centered: true,
			success: () => {
				const afterSuccess = () : void => {
					this.pRouterService.navBack();
					api.save({
						success : () => {
						},
					});
				};

				if (removeItemFn) {
					removeItemFn(afterSuccess);
				} else {
					// Remove this item from the list of items
					items.removeItem(item);
					afterSuccess();
				}
			},
			size: null,
		});
	}
}
