var _a;
import { __decorate, __metadata } from "tslib";
import { Input, ElementRef, HostListener, Directive } from '@angular/core';
import { LogService } from '../../../../shared/core/log.service';
/**
 * Makes the hight of a textarea grow automatically while user is writing more and more text.
 */
let AutosizeDirective = class AutosizeDirective {
    constructor(element, console) {
        this.element = element;
        this.console = console;
        this._minHeight = null;
        this._maxHeight = null;
        this.totalTime = 0;
        this.el = element.nativeElement;
        this._clientWidth = this.el.clientWidth;
    }
    get minHeight() { return this._minHeight; }
    set minHeight(value) {
        this._minHeight = value;
        this.updateMinHeight();
    }
    get maxHeight() {
        return this._maxHeight;
    }
    set maxHeight(value) {
        this._maxHeight = value;
        this.updateMaxHeight();
    }
    onResize() {
        // Only apply adjustment if element width had changed.
        if (this.el.clientWidth === this._clientWidth) {
            return;
        }
        this._clientWidth = this.element.nativeElement.clientWidth;
        this.adjust();
    }
    onInput() {
        this.adjust();
    }
    ngAfterViewInit() {
        // set element resize allowed manually by user
        const style = window.getComputedStyle(this.el, null);
        if (style.resize === 'both') {
            this.el.style.resize = 'horizontal';
        }
        else if (style.resize === 'vertical') {
            this.el.style.resize = 'none';
        }
        this.firstRunHack();
    }
    firstRunHack() {
        if (this.element.nativeElement.clientHeight &&
            this.element.nativeElement.scrollHeight &&
            this.element.nativeElement.clientHeight !== this.element.nativeElement.scrollHeight)
            return;
        // HACK: make sure first run works
        const runInitialAdjust = () => {
            requestAnimationFrame(() => {
                if (10000 < this.totalTime)
                    return;
                if (this.el.clientHeight === 0) {
                    window.setTimeout(runInitialAdjust, 100);
                    this.totalTime += 100;
                }
                // run first adjust
                this.adjust();
            });
        };
        runInitialAdjust();
    }
    /**
     * perform height adjustments after input changes, if height is different
     */
    adjust() {
        if (this.desiredHeight === null)
            return;
        if (this.el.style.height === `${this.desiredHeight}px`)
            return;
        this.el.style.overflow = this.maxHeightIsReached ? 'auto' : 'hidden';
        this.el.style.height = 'auto';
        this.el.style.height = `${this.desiredHeight}px`;
    }
    get maxHeightAsNumber() {
        const result = this.maxHeight ? +this.maxHeight.replace('px', '') : null;
        if (result !== null && Number.isNaN(result)) {
            this.console.error('could not calculate maxHeightAsNumber');
            return null;
        }
        return result;
    }
    get maxHeightIsReached() {
        const maxHeightAsNumber = this.maxHeightAsNumber;
        return maxHeightAsNumber === null ? false : this.el.scrollHeight >= maxHeightAsNumber;
    }
    get desiredHeight() {
        return this.maxHeightIsReached ? this.maxHeightAsNumber : this.el.scrollHeight;
    }
    /**
     * Set textarea min height if input defined
     */
    updateMinHeight() {
        this.el.style.minHeight = `${this._minHeight}px`;
    }
    /**
     * Set textarea max height if input defined
     */
    updateMaxHeight() {
        this.el.style.maxHeight = `${this._maxHeight}px`;
    }
};
__decorate([
    Input('minHeight'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], AutosizeDirective.prototype, "minHeight", null);
__decorate([
    Input('maxHeight'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], AutosizeDirective.prototype, "maxHeight", null);
__decorate([
    HostListener('window:resize', ['$event.target']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AutosizeDirective.prototype, "onResize", null);
__decorate([
    HostListener('input', ['$event.target']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AutosizeDirective.prototype, "onInput", null);
AutosizeDirective = __decorate([
    Directive({
        /* eslint-disable @angular-eslint/directive-selector */
        selector: 'textarea[autosize]',
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _a : Object, LogService])
], AutosizeDirective);
export { AutosizeDirective };
//# sourceMappingURL=autosize.directive.js.map