export {};
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
//# sourceMappingURL=page-with-detail-form-component.interface.js.map