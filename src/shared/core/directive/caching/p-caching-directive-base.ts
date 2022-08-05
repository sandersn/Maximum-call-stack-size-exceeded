/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Copy of https://github.com/angular/angular/blob/8.0.0/packages/common/src/directives/ng_if.ts
 * The difference is that this directive reuses views when data changes.
 */
import { ViewContainerRef, ViewRef } from '@angular/core';


export class PCachingDirectiveBase {
	private static cachedViewsMap : Map<string, ViewRef[]> =
		new Map<any, ViewRef[]>();

	// eslint-disable-next-line jsdoc/require-jsdoc
	protected getCachedViews(factory : any) : ViewRef[] {
		const cacheKey = factory;
		let cachedViews = PCachingDirectiveBase.cachedViewsMap.get(cacheKey);

		if (!cachedViews) {
			cachedViews = new Array<ViewRef>();
			PCachingDirectiveBase.cachedViewsMap.set(cacheKey, cachedViews);
		}

		return cachedViews;
	}

	/**
	 *  When this directive is destroyed we have no way to prevent the destruction of the embeddedViews
	 *  because angular first destroys them and then calls this method
	 *  Once the embeddedViews are destroyed they cannot be reused anymore because does not
	 *  let reattachment of views which were destroyed.
	 *  Normally the caching directives are not going to be destroyed because
	 *  we are using our own pIf, pFor and pTemplateOutlet implementations which all do not
	 *  destroy views. But there might still be cases where this happen. E.g. NgbModal still does it.
	 *  We could do our own implementation of NgbModal which does not do it. But,
	 *  I am too lazy now ;)
	 *  So, to be safe we check if a view is destroyed or not and if so we discard it from the cache.
	 *
	 * A better solution could be to prevent the destruction of views once the directives is being destroyed
	 * by beforehand detaching them on onBeforeDestroy. See
	 * https://github.com/angular/angular/issues/17404
	 */
	protected popNextValidCachedView(cachedViews : ViewRef[]) : ViewRef | null {
		for (let i = cachedViews.length - 1; i >= 0; --i) {
			const cachedView = cachedViews.pop()!;

			if (!cachedView.destroyed)
				return cachedView;
		}

		return null;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	protected insert(viewContainer : ViewContainerRef, view : ViewRef) : void {
		const component = (viewContainer as any)._view.component;

		// angular "viewContainer.insert()" does not update the components. So, we do it manually
		this.updateComponent((view as any)._view, component);

		// angular "viewContainer.insert()" does not update the parent. So, we do it manually
		(view as any)._view.parent = (viewContainer as any)._view;

		// insert view
		viewContainer.insert(view);
	}

	private updateComponent(root : any, component : any) : void {
		if (!root)
			return;

		if (root.component) {
			// same type?
			if (root.component.constructor === component.constructor) {
				// update instance
				root.component = component;
			} else {
				// We updated all instances in this branch. Cancel recursion
				return;
			}
		}

		// continue recursively
		let list : any;

		if (root.nodes)
			list = root.nodes;
		else if (root.viewContainer)
			list = root.viewContainer._embeddedViews;

		if (list) {
			for (const item of list)
				this.updateComponent(item, component);
		}
	}
}
