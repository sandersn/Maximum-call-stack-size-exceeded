var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Input, NgIterable, TrackByFunction, QueryList, } from '@angular/core';
import { PCachingDirectiveBase } from './p-caching-directive-base';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../null-type-utils';
/**
 * Copy of https://github.com/angular/angular/blob/master/packages/common/src/directives/ng_for_of.ts
 * The difference is that this directive reuses views when data changes.
 * See https://www.telerik.com/blogs/blazing-fast-list-rendering-in-angular for more infos.
 */
export class PForOfContext {
    constructor($implicit, ngForOf, index, count) {
        this.$implicit = $implicit;
        this.ngForOf = ngForOf;
        this.index = index;
        this.count = count;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get first() { return this.index === 0; }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get last() { return this.index === this.count - 1; }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get even() { return this.index % 2 === 0; }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get odd() { return !this.even; }
}
/**
 * @hidden
 */
// @Directive({ selector: '[ngFor][ngForOf]' })
// eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
export class PForOfDirective extends PCachingDirectiveBase {
    constructor(_viewContainer, _template, _differs, changeDetector, zone) {
        super();
        this._viewContainer = _viewContainer;
        this._template = _template;
        this._differs = _differs;
        this.changeDetector = changeDetector;
        this.zone = zone;
        this.ngIncrementalBuild = null;
        this._differ = null;
    }
    set ngForTemplate(value) {
        if (value) {
            this._template = value;
        }
    }
    /* eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle */
    ngOnChanges(changes) {
        if ('ngForOf' in changes === false)
            return;
        const value = changes['pForOf'].currentValue;
        if (this._differ || !value) {
            return;
        }
        try {
            // eslint-disable-next-line unicorn/no-array-callback-reference
            this._differ = this._differs.find(value).create(this.ngForTrackBy);
        }
        catch (_a) {
            throw new Error(`Cannot find a differ supporting object '${value}' of type '${getTypeNameForDebugging(value)}'.`);
        }
    }
    // eslint-disable-next-line @angular-eslint/no-conflicting-lifecycle
    ngDoCheck() {
        if (!this._differ)
            return;
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
    clearViews() {
        if (!this.ngIncrementalBuild)
            throw new Error('There is no point of manually clearing the views when ngIncrementalBuild is not used.');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cache = this.getCachedViews(this._template._def.element.template.factory);
        for (let i = this._viewContainer.length - 1; i >= 0; i--) {
            const view = this._viewContainer.detach(i);
            assumeDefinedToGetStrictNullChecksRunning(view, 'view');
            cache.push(view);
        }
    }
    _applyChanges() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const cachedViews = this.getCachedViews(this._template._def.element.template.factory);
        // add views
        let addedViewsCount = 0;
        for (let i = this._viewContainer.length; i < this.dataLength && (!this.ngIncrementalBuild || addedViewsCount < this.ngIncrementalBuild); i++) {
            addedViewsCount++;
            // We need a new view. Is there one available from cache?
            const cachedView = this.popNextValidCachedView(cachedViews);
            if (cachedView) {
                this.insert(this._viewContainer, cachedView);
            }
            else {
                // Otherwise create a new one
                this._viewContainer.createEmbeddedView(this._template, new PForOfContext(null, this.ngForOf, -1, -1));
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
        const values = this.ngForOf instanceof QueryList ? this.ngForOf._results : this.ngForOf;
        for (let i = 0; i < this._viewContainer.length; i++) {
            // Update all views
            const view = this._viewContainer.get(i);
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
    get dataLength() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return this.ngForOf.length;
    }
}
__decorate([
    Input(),
    __metadata("design:type", typeof (_a = typeof NgIterable !== "undefined" && NgIterable) === "function" ? _a : Object)
], PForOfDirective.prototype, "ngForOf", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PForOfDirective.prototype, "ngIncrementalBuild", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_b = typeof TrackByFunction !== "undefined" && TrackByFunction) === "function" ? _b : Object)
], PForOfDirective.prototype, "ngForTrackBy", void 0);
__decorate([
    Input()
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    ,
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], PForOfDirective.prototype, "ngForTemplate", null);
/**
 * @hidden
 */
// eslint-disable-next-line func-style, @typescript-eslint/no-explicit-any
export function getTypeNameForDebugging(type) {
    return type.name || typeof type;
}
//# sourceMappingURL=p-for.directive.js.map