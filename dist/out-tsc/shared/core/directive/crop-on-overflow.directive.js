var _a, _b, _c, _d, _e, _f;
import { __decorate, __metadata } from "tslib";
import { ResizeObserver } from '@juggle/resize-observer';
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';
import { PopoverConfig } from 'ngx-bootstrap/popover';
import { PositioningService } from 'ngx-bootstrap/positioning';
import { Directive, ElementRef, HostBinding, Renderer2, ViewContainerRef } from '@angular/core';
import { PTooltipDirective } from './tooltip.directive';
import { LogService } from '../log.service';
let PCropOnOverflowDirective = class PCropOnOverflowDirective extends PTooltipDirective {
    constructor(
    // eslint-disable-next-line max-len
    _config, _elementRef, _renderer, _viewContainerRef, cis, _positionService, _console) {
        super(_config, _elementRef, _renderer, _viewContainerRef, cis, _positionService, _console);
        this._alwaysTrue = true;
        this.previousDivWidth = null;
        this.resizeObserver = null;
        this.el = _elementRef;
    }
    ngAfterViewChecked() {
        return super.ngAfterViewChecked();
    }
    ngAfterContentInit() {
        this.setRecalculationListener();
    }
    setRecalculationListener() {
        this.resizeObserver = new ResizeObserver((entries) => {
            // Div has no content? Then there is no need for a tooltip.
            if (this.el.nativeElement.textContent === '')
                return;
            this.reCalculateTooltip(entries[0]);
        });
        this.resizeObserver.observe(this.el.nativeElement);
    }
    /**
     * Calculate if the tooltip is necessary or not.
     * Can be re-executed if necessary.
     */
    reCalculateTooltip(entry) {
        const target = entry.target;
        const contentWith = target.scrollWidth;
        // Size has not changed? Then there is nothing to recalculate.
        if (this.previousDivWidth === contentWith)
            return;
        this.previousDivWidth = contentWith;
        // Content has 0 px width? No need for a tooltip
        if (!contentWith)
            return;
        const divWidth = target.offsetWidth;
        const needsTooltip = divWidth < contentWith;
        if (needsTooltip) {
            if (!!this.pTooltip)
                return;
            this.pTooltip = this.el.nativeElement.textContent;
            this.setTooltipAttribute();
        }
        else {
            if (!this.pTooltip)
                return;
            this.pTooltip = null;
            this.setTooltipAttribute();
        }
    }
    ngOnDestroy() {
        var _a;
        (_a = this.resizeObserver) === null || _a === void 0 ? void 0 : _a.disconnect();
    }
};
__decorate([
    HostBinding('class.crop-on-overflow'),
    __metadata("design:type", Object)
], PCropOnOverflowDirective.prototype, "_alwaysTrue", void 0);
PCropOnOverflowDirective = __decorate([
    Directive({ selector: '[pCropOnOverflow]' }),
    __metadata("design:paramtypes", [typeof (_a = typeof PopoverConfig !== "undefined" && PopoverConfig) === "function" ? _a : Object, typeof (_b = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _b : Object, typeof (_c = typeof Renderer2 !== "undefined" && Renderer2) === "function" ? _c : Object, typeof (_d = typeof ViewContainerRef !== "undefined" && ViewContainerRef) === "function" ? _d : Object, typeof (_e = typeof ComponentLoaderFactory !== "undefined" && ComponentLoaderFactory) === "function" ? _e : Object, typeof (_f = typeof PositioningService !== "undefined" && PositioningService) === "function" ? _f : Object, LogService])
], PCropOnOverflowDirective);
export { PCropOnOverflowDirective };
//# sourceMappingURL=crop-on-overflow.directive.js.map