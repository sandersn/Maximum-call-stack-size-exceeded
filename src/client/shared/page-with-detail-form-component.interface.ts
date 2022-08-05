import { TemplateRef } from '@angular/core';
import { ApiObjectWrapper } from '../../shared/api';

export interface PageWithDetailFormComponentInterface<T extends ApiObjectWrapper<'validated' | 'draft'>> {
	// eslint-disable-next-line @typescript-eslint/ban-types
	constructor : Function;
	// routeHasId
	// ngAfterContentInit() : void;

	ngOnInit() : void; // put getItem() inside it
	getItem() : void; // put getByRouteId() and createNewItem() inside it
	// getByRouteId() : void;
	createNewItem() : void; // use this.pDetailFormUtilsService.createNewItem
	saveNewItem(item : T) : void; // use this.pDetailFormUtilsService.saveNewItem
	ngOnDestroy() : void; // run this.pDetailFormUtilsService.onDestroy(this.api) here

	/**
	 * Handle Click on delete button
	 * You should call pDetailFormUtilsService.onRemoveClick inside
	 */
	onRemoveClick(modalContent ?: TemplateRef<unknown>) : void;
}

// export class PageWithDetailFormComponentUtils {
// 	// getItem() : void; // put getByRouteId() inside it
// 	getByRouteId(
// 		api : SchedulingApiService,
// 		items : ApiListWrapper<ApiObjectWrapper>,
// 		routeId : Id,
// 		staticClass : typeof SchedulingApiMember,
// 	) : ApiObjectWrapper {
// 		if (!routeId) return false;
// 		let item : SchedulingApiMember = items.get(routeId);
// 		if (!item) {
// 			staticClass.loadDetailed(api, routeId, {
// 				success: () => {
// 					return items.get(routeId);
// 				},
// 			});
// 			return true;
// 		}
// 		if (item.isNewItem()) {
// 			return item;
// 		}
//
// 		item.loadDetailed({
// 			success: () => {
// 			 if (item === null) throw new Error('Item should have been available after item.loadDetailed');
// 				return item;
// 			},
// 		});
// 		return true;
// 	}
// }
