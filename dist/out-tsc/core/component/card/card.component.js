var _a;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy, HostBinding } from '@angular/core';
import { BootstrapSize } from '../../../../client/shared/bootstrap-styles.enum';
import { Config } from '../../config';
let CardComponent = class CardComponent {
    // @HostBinding('class.card') protected _alwaysTrue = true;
    constructor() {
        this.isLoading = false;
    }
    ngAfterContentInit() {
        if (Config.DEBUG)
            this.validateContent();
    }
    validateContent() {
        // if (!this.elementRef.nativeElement.children.length) return;
        // for (const child of this.elementRef.nativeElement.children) {
        // 	if (child.classList.contains('col') || child.classList.value.match(/col-[\w-]*/)) return;
        // 	this.console.error('Ups. There is a child of a <p-grid> which has no col class.');
        // }
    }
    get _hasClassBorderLG() {
        return this.radiusSize === BootstrapSize.LG;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], CardComponent.prototype, "isLoading", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_a = typeof BootstrapSize !== "undefined" && BootstrapSize.LG) === "function" ? _a : Object)
], CardComponent.prototype, "radiusSize", void 0);
__decorate([
    HostBinding('class.rounded-lg'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], CardComponent.prototype, "_hasClassBorderLG", null);
CardComponent = __decorate([
    Component({
        selector: 'p-card',
        templateUrl: './card.component.html',
        styleUrls: ['./card.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], CardComponent);
export { CardComponent };
//# sourceMappingURL=card.component.js.map