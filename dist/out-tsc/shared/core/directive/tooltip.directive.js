var _a, _b, _c, _d, _e, _f;
import { __decorate, __metadata } from "tslib";
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';
import { PopoverConfig, PopoverDirective } from 'ngx-bootstrap/popover';
import { PositioningService } from 'ngx-bootstrap/positioning';
import { Directive, ElementRef, Input, Renderer2, ViewContainerRef } from '@angular/core';
import { LogService } from '../log.service';
let PTooltipDirective = class PTooltipDirective extends PopoverDirective {
    constructor(
    // eslint-disable-next-line max-len
    _config, _elementRef, _renderer, _viewContainerRef, cis, _positionService, console) {
        // super(_viewContainerRef, _changeDetectorRef, _resolver, _elementRef, _renderer);
        super(_config, _elementRef, _renderer, _viewContainerRef, cis, _positionService);
        this.console = console;
        this.pTooltip = null;
    }
    // @HostBinding('popover') private getTooltip() : string | null { return this.el.nativeElement?.textContent; }
    ngAfterViewChecked() {
        this.setTooltipAttribute();
        return null;
    }
    ngAfterViewInit() {
        var _a, _b;
        // I tried to add TemplateRef<any> to pTooltip Input, but it caused performance issues.
        if ((_a = this.pTooltip) === null || _a === void 0 ? void 0 : _a.match(/&nbsp;/)) {
            const fixedTooltipContent = this.pTooltip.replace(/&nbsp;/, ' ');
            this.console.error('pTooltip does not support HTML yet. Please remove &nbsp;', this.pTooltip, fixedTooltipContent);
            this.pTooltip = fixedTooltipContent;
        }
        const htmlTag = (_b = this.pTooltip) === null || _b === void 0 ? void 0 : _b.match(/<[a-z-]*>.*<\/[a-z-]*>/);
        if (!!htmlTag) {
            this.console.error(`pTooltip does not support HTML yet. Please remove »<{{htmlTag[1]}}>…</{{htmlTag[1]}}>« from string.`);
        }
    }
    /**
     * Set tooltip attribute
     */
    setTooltipAttribute() {
        var _a;
        this.popover = (_a = this.pTooltip) !== null && _a !== void 0 ? _a : '';
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTooltipDirective.prototype, "pTooltip", void 0);
PTooltipDirective = __decorate([
    Directive({
        selector: '[pTooltip]',
        exportAs: 'p-tooltip',
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof PopoverConfig !== "undefined" && PopoverConfig) === "function" ? _a : Object, typeof (_b = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _b : Object, typeof (_c = typeof Renderer2 !== "undefined" && Renderer2) === "function" ? _c : Object, typeof (_d = typeof ViewContainerRef !== "undefined" && ViewContainerRef) === "function" ? _d : Object, typeof (_e = typeof ComponentLoaderFactory !== "undefined" && ComponentLoaderFactory) === "function" ? _e : Object, typeof (_f = typeof PositioningService !== "undefined" && PositioningService) === "function" ? _f : Object, LogService])
], PTooltipDirective);
export { PTooltipDirective };
//# sourceMappingURL=tooltip.directive.js.map