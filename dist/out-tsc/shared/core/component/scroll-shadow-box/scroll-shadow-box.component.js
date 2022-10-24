var _a;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { Config } from '@plano/shared/core/config';
let ScrollShadowBoxComponent = class ScrollShadowBoxComponent {
    // @Input() public shadowsDisabled : boolean = false;
    constructor() {
        this.backgroundStyleTop = null;
        this.backgroundStyleBottom = null;
        this.backgroundStyle = null;
        this.alwaysShowScrollbar = false;
        this.contentContainerStyles = null;
        this.fixedFooterTemplate = null;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shadowsDisabled() {
        // HACK: PLANO-16038 iOS has problems with the position of the sticky overlays.
        if (this.shadowsDisabledOnPlatform)
            return true;
        if (this.shadowsDisabledOnBrowser)
            return true;
        return false;
    }
    get shadowsDisabledOnPlatform() {
        // HACK: PLANO-16038 iOS has problems with the position of the sticky overlays.
        if (!Config.platform)
            return false;
        if (Config.platform.toLowerCase() === 'appIOS'.toLowerCase())
            return true;
        return false;
    }
    get shadowsDisabledOnBrowser() {
        // HACK: PLANO-16038 iOS has problems with the position of the sticky overlays.
        if (!Config.browser.name)
            return false;
        if (Config.browser.name.toLowerCase() === 'Safari'.toLowerCase())
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showFooterAsFixed() {
        if (Config.IS_MOBILE)
            return false;
        return !!this.fixedFooterTemplate;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get backgroundColor() {
        if (this.backgroundStyle)
            return this.backgroundStyle;
        return undefined;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get backgroundColorTop() {
        if (this.backgroundStyleTop)
            return this.backgroundStyleTop;
        if (this.backgroundStyle)
            return this.backgroundStyle;
        return undefined;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get backgroundColorBottom() {
        if (this.backgroundStyleBottom)
            return this.backgroundStyleBottom;
        if (this.backgroundStyle)
            return this.backgroundStyle;
        return undefined;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], ScrollShadowBoxComponent.prototype, "backgroundStyleTop", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ScrollShadowBoxComponent.prototype, "backgroundStyleBottom", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ScrollShadowBoxComponent.prototype, "backgroundStyle", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ScrollShadowBoxComponent.prototype, "alwaysShowScrollbar", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ScrollShadowBoxComponent.prototype, "contentContainerStyles", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ScrollShadowBoxComponent.prototype, "fixedFooterTemplate", void 0);
ScrollShadowBoxComponent = __decorate([
    Component({
        /* eslint-disable-next-line @angular-eslint/component-selector */
        selector: 'scroll-shadow-box',
        templateUrl: './scroll-shadow-box.component.html',
        styleUrls: ['./scroll-shadow-box.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], ScrollShadowBoxComponent);
export { ScrollShadowBoxComponent };
//# sourceMappingURL=scroll-shadow-box.component.js.map