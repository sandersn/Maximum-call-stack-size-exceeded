import {
	DoCheck,
	EmbeddedViewRef,
	IterableDiffer,
	IterableDiffers,
	OnChanges,
	SimpleChanges,
	ViewContainerRef,
	ChangeDetectorRef,
	NgZone} from '@angular/core';
import {
	Input,
	NgIterable,
	TemplateRef,
	TrackByFunction,
	QueryList,
} from '@angular/core';
import { PCachingDirectiveBase } from './p-caching-directive-base';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../null-type-utils';

/**
 * Copy of https://github.com/angular/angular/blob/master/packages/common/src/directives/ng_for_of.ts
 * The difference is that this directive reuses views when data changes.
 * See https://www.telerik.com/blogs/blazing-fast-list-rendering-in-angular for more infos.
 */
export class PForOfContext<T> {
	constructor(
		public $implicit : T, public ngForOf : NgIterable<T>, public index : number,
		public count : number) { }

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get first() : boolean { return this.index === 0; }

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get last() : boolean { return this.index === this.count - 1; }

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get even() : boolean { return this.index % 2 === 0; }

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get odd() : boolean { return !this.even; }
}

/**
 * @hidden
 */
// @Directive({ selector: '[ngFor][ngForOf]' })
// eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
export class PForOfDirective<T> extends PCachingDirectiveBase implements DoCheck, OnChanges {
	@Input() public ngForOf ! : NgIterable<T>;
	@Input() public ngIncrementalBuild : number | null = null;

	@Input() public ngForTrackBy ?: TrackByFunction<T>;

	private _differ : IterableDiffer<T> | null = null;

	constructor(
		private _viewContainer : ViewContainerRef,
		private _template : TemplateRef<PForOfContext<T>>,
		private _differs : IterableDiffers,
		private changeDetector : ChangeDetectorRef,
		private zone : NgZone,
	) {
		super();
	}

	@Input()
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public set ngForTemplate(value : TemplateRef<PForOfContext<T>> | null) {
		if (value) {
			this._template = value;
		}
	}

	/* eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle */
	public ngOnChanges(changes : SimpleChanges) : void {
		if ('ngForOf' in changes === false) return;

		const value = changes['pForOf'].currentValue;

		if (this._differ || !value) { return; }

		try {
			// eslint-disable-next-line unicorn/no-array-callback-reference
			this._differ = this._differs.find(value).create(this.ngForTrackBy);
		} catch {
			throw new Error(
				`Cannot find a differ supporting object '${value}' of type '${getTypeNameForDebugging(value)}'.`,
			);
		}
	}

	// eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
	public ngDoCheck() : void {
		if (!this._differ) return;
		// TODO: We can probably use a faster diff check because we are only interested if list changed at all.
		// A linear check? Or can we omit this check at all and always update the list?
		const changes = this._differ.diff(this.ngForOf);

		// When data changes remove all items to rebuild them incrementally again
		if (changes && this.ngIncrementalBuild)
			this.clearViews();

		// update if there are data changes or when list is not build completely yet
		if (changes || this._viewContainer.length < this.dataLength) {
			this._applyChanges();
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public clearViews() : void {
		if (!this.ngIncrementalBuild)
			throw new Error('There is no point of manually clearing the views when ngIncrementalBuild is not used.');

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const cache = this.getCachedViews((this._template as any)._def.element.template.factory);

		for (let i = this._viewContainer.length - 1; i >= 0; i--) {
			const view = this._viewContainer.detach(i);
			assumeDefinedToGetStrictNullChecksRunning(view, 'view');
			cache.push(view);
		}
	}

	private _applyChanges() : void {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const cachedViews = this.getCachedViews((this._template as any)._def.element.template.factory);

		// add views
		let addedViewsCount = 0;
		for (	let i = this._viewContainer.length
			; 	i < this.dataLength && (!this.ngIncrementalBuild || addedViewsCount < this.ngIncrementalBuild)
			; 	i++) {
			addedViewsCount++;

			// We need a new view. Is there one available from cache?
			const cachedView = this.popNextValidCachedView(cachedViews);

			if (cachedView) {
				this.insert(this._viewContainer, cachedView);
			} else {
				// Otherwise create a new one
				this._viewContainer.createEmbeddedView(this._template, new PForOfContext<T>(null!, this.ngForOf, -1, -1));
			}
		}

		// remove views
		for (let i = this._viewContainer.length; i > this.dataLength; i--) {
			// Detach view and store it in cache
			const view = this._viewContainer.detach(i);
			assumeDefinedToGetStrictNullChecksRunning(view, 'view');
			cachedViews.push(view);
		}

		// update views
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const values = this.ngForOf instanceof QueryList ? (this.ngForOf as any)._results : this.ngForOf;

		for (let i = 0; i < this._viewContainer.length; i++) {
			// Update all views
			const view = this._viewContainer.get(i) as EmbeddedViewRef<PForOfContext<T>>;
			view.context.index = i;
			view.context.count = this.dataLength;
			view.context.$implicit = values[i];
			view.context.ngForOf = this.ngForOf;
		}

		// Not finished yet? Continue next iteration
		if (this._viewContainer.length < this.dataLength) {
			this.zone.runOutsideAngular(() => {
				window.setTimeout(() => {
					this.changeDetector.detectChanges();
				});
			});
		}
	}

	private get dataLength() : number {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return (this.ngForOf as any).length;
	}
}

/**
 * @hidden
 */
// eslint-disable-next-line func-style, @typescript-eslint/no-explicit-any
export function getTypeNameForDebugging(type : any) : string {
	return type.name || typeof type;
}
