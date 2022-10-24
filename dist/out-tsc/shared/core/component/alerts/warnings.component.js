var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy, ElementRef, Renderer2 } from '@angular/core';
import { SLIDE_ON_NGIF_TRIGGER } from '@plano/animations';
import { SchedulingApiWarnings } from '@plano/shared/api';
let WarningsComponent = class WarningsComponent {
    constructor(el, renderer) {
        this.el = el;
        this.renderer = renderer;
        this.disableAnimation = null;
    }
    ngAfterContentInit() {
        this.setAnimation();
    }
    setAnimation() {
        if (this.disableAnimation)
            return;
        // get overlay container to set property that disables animations
        const overlayContainerElement = this.el.nativeElement;
        // angular animations renderer hooks up the logic to disable animations into setProperty
        this.renderer.setProperty(overlayContainerElement, '@slideVertical', true);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get hasClassRoundedBottom() {
        var _a;
        return !!((_a = this.class) === null || _a === void 0 ? void 0 : _a.includes('rounded-bottom'));
    }
};
__decorate([
    Input(),
    __metadata("design:type", typeof (_c = typeof SchedulingApiWarnings !== "undefined" && SchedulingApiWarnings) === "function" ? _c : Object)
], WarningsComponent.prototype, "warnings", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], WarningsComponent.prototype, "disableAnimation", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], WarningsComponent.prototype, "class", void 0);
WarningsComponent = __decorate([
    Component({
        selector: 'p-warnings[warnings]',
        templateUrl: './warnings.component.html',
        styleUrls: ['./warnings.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        animations: [SLIDE_ON_NGIF_TRIGGER],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _a : Object, typeof (_b = typeof Renderer2 !== "undefined" && Renderer2) === "function" ? _b : Object])
], WarningsComponent);
export { WarningsComponent };
//# sourceMappingURL=warnings.component.js.map