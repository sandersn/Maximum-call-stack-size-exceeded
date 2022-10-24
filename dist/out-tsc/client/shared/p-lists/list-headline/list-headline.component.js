var _a;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { PThemeEnum } from '../../bootstrap-styles.enum';
/**
 * @deprecated remove the darf/macht stuff from this component or use another one.
 */
let ListHeadlineComponent = class ListHeadlineComponent {
    constructor() {
        this.text = '';
        this.textTooltipHtml = undefined;
        this.showMembersHeadlineCardOptions = false;
        this.showHearts = false;
        this.headlineIconAlign = null;
        this.theme = null;
        this.onClick = new EventEmitter();
        this.PThemeEnum = PThemeEnum;
    }
    /**
     * Is there a (onClick)="…" on this component?
     */
    get hasOnClickBinding() {
        return this.onClick.observers.length > 0;
    }
};
__decorate([
    Input(),
    __metadata("design:type", String)
], ListHeadlineComponent.prototype, "text", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ListHeadlineComponent.prototype, "textTooltipHtml", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ListHeadlineComponent.prototype, "showMembersHeadlineCardOptions", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ListHeadlineComponent.prototype, "showHearts", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ListHeadlineComponent.prototype, "headlineIconAlign", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ListHeadlineComponent.prototype, "theme", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_a = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _a : Object)
], ListHeadlineComponent.prototype, "onClick", void 0);
ListHeadlineComponent = __decorate([
    Component({
        // eslint-disable-next-line @angular-eslint/component-selector
        selector: 'list-headline',
        templateUrl: './list-headline.component.html',
        styleUrls: ['./list-headline.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], ListHeadlineComponent);
export { ListHeadlineComponent };
//# sourceMappingURL=list-headline.component.js.map