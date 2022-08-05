import { OnChanges, SimpleChanges, TemplateRef, ViewContainerRef } from '@angular/core';
import { Input } from '@angular/core';
import { PCachingDirectiveBase } from './p-caching-directive-base';

/**
 * Copy of https://github.com/angular/angular/blob/8.0.1/packages/common/src/directives/ng_template_outlet.ts
 * The difference is that this directive reuses views when data changes.
 */
// @Directive({ selector: '[ngTemplateOutlet]' })
export class PTemplateOutletDirective extends PCachingDirectiveBase implements OnChanges {

	@Input() public ngTemplateOutletContext : { [key : string] : unknown } | null = null;
	@Input() public ngTemplateOutlet : TemplateRef<unknown> | null = null;

	constructor(private _viewContainer : ViewContainerRef) {
		super();
	}

	private detachCurrentView() : void {
		const prevView = this._viewContainer.detach();

		if (prevView) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			this.getCachedViews((prevView as any)._view.def.factory).push(prevView);
		}
	}

	public ngOnChanges(changes : SimpleChanges) : void {
		// template has changed?
		if (changes['pTemplateOutlet'] as unknown	&&
		(	!changes['pTemplateOutlet'].previousValue	||
			(changes['pTemplateOutlet'].previousValue)._def.element.template.factory !==
				(changes['pTemplateOutlet'].currentValue)._def.element.template.factory)) {
			// detach old view
			this.detachCurrentView();

			// add new view
			if (this.ngTemplateOutlet) {
				// view available in cache?
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const cachedViews = this.getCachedViews((this.ngTemplateOutlet as any)._def.element.template.factory);
				const cachedView = this.popNextValidCachedView(cachedViews);

				if (cachedView) {
					this.insert(this._viewContainer, cachedView);
				} else {
					// otherwise create new view
					this._viewContainer.createEmbeddedView(this.ngTemplateOutlet, this.ngTemplateOutletContext);
				}
			}
		}

		// update context
		if (changes['pTemplateOutletContext'] as unknown) {
			const view = this._viewContainer.get(0);

			if (view && this.ngTemplateOutletContext) {
				for (const propertyName of Object.keys(this.ngTemplateOutletContext)) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(view as any)._view.context[propertyName] = this.ngTemplateOutletContext[propertyName];
				}
			}
		}
	}
}
