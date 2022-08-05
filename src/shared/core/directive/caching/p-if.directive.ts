/* eslint-disable unicorn/no-empty-file */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// // import { Input, TemplateRef, ViewContainerRef, ɵstringify as stringify } from '@angular/core';
// import { PCachingDirectiveBase } from './p-caching-directive-base';

// /**
//  * Copy of https://github.com/angular/angular/blob/8.0.0/packages/common/src/directives/ng_if.ts
//  * The difference is that this directive reuses views when data changes.
//  */
// // @Directive({ selector: '[ngIf]' })
// export class PIfDirective extends PCachingDirectiveBase {
// 	private condition : boolean = undefined;
// 	private ifThenTemplate : TemplateRef<PIfContext>;
// 	private ifElseTemplate : TemplateRef<PIfContext>;

// 	constructor(private _viewContainer : ViewContainerRef, templateRef : TemplateRef<PIfContext>) {
// 		super();

// 		this.ngIfThen = templateRef;
// 	}

// 	/**
// 	 * The Boolean expression to evaluate as the condition for showing a template.
// 	 */
// 	@Input()
// 	public set ngIf(condition : any) {
// 		// It is also possible to use other types (e.g. objects) as conditions.
// 		// The object might change but still evaluate to "true" in which case we do not to do anything.
// 		// But because the object changed angular will trigger this function.
// 		// So transform "condition" to boolean and only do anything when the boolean value changed.
// 		const booleanCondition = !!condition;

// 		if(this.condition !== booleanCondition) {
// 			this.condition = booleanCondition;
// 			this._updateView();
// 		}
// 	}

// 	/**
// 	 * A template to show if the condition expression evaluates to true.
// 	 */
// 	@Input()
// 	public set ngIfThen(templateRef : TemplateRef<PIfContext> | null) {
// 		assertTemplate('pIfThen', templateRef);

// 		this.ifThenTemplate = templateRef;
// 		this._updateView();
// 	}

// 	/**
// 	 * A template to show if the condition expression evaluates to false.
// 	 */
// 	@Input()
// 	public set ngIfElse(templateRef : TemplateRef<PIfContext> | null) {
// 		assertTemplate('pIfElse', templateRef);

// 		this.ifElseTemplate = templateRef;
// 		this._updateView();
// 	}

// 	private detachCurrentView() : void {
// 		const prevView = this._viewContainer.detach();

// 		if(prevView)
// 			this.getCachedViews((prevView as any)._view.def.factory).push(prevView);
// 	}

// 	private _updateView() : void {
// 		this.detachCurrentView();

// 		// add new view
// 		const newViewTemplate = this.condition
// 			? this.ifThenTemplate
// 			:	this.ifElseTemplate;

// 		if(newViewTemplate) {
// 			// view available in cache?
// 			const cachedViews = this.getCachedViews((newViewTemplate as any)._def.element.template.factory);
// 			const cachedView = this.popNextValidCachedView(cachedViews);

// 			if(cachedView) {
// 				this.insert(this._viewContainer, cachedView);
// 			} else {
// 				// otherwise create new view
// 				const context = new PIfContext();
// 				context.$implicit = this.condition;
// 				context.ngIf = this.condition;

// 				this._viewContainer.createEmbeddedView(newViewTemplate);
// 			}
// 		}
// 	}

// 	/**
// 	 * Assert the correct type of the expression bound to the `ngIf` input within the template.
// 	 *
// 	 * The presence of this method is a signal to the Ivy template type check compiler that when the
// 	 * `NgIf` structural directive renders its template, the type of the expression bound to `ngIf`
// 	 * should be narrowed in some way. For `NgIf`, it is narrowed to be non-null, which allows the
// 	 * strictNullChecks feature of TypeScript to work with `NgIf`.
// 	 */
// 	// eslint-disable-next-line @typescript-eslint/naming-convention
// 	public static pTemplateGuard_pIf<E>(_directive : PIfDirective, _expr : E) : _expr is NonNullAndNonUndefined<E> { return true; }
// }

// /**
//  * @publicApi
//  */
// export class PIfContext {
// 	public $implicit : any | null = null;
// 	public ngIf : any | null = null;
// }

// // eslint-disable-next-line func-style
// function assertTemplate(property : string, templateRef : TemplateRef<unknown> | null) : void {
// 	const isTemplateRefOrNull = !!(!templateRef || templateRef.createEmbeddedView);
// 	if (!isTemplateRefOrNull) {
// 		throw new Error(`${property} must be a TemplateRef, but received '${stringify(templateRef)}'.`);
// 	}
// }
