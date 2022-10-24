import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';
let PNoItemComponent = class PNoItemComponent {
    constructor() {
        this._alwaysTrue = true;
        this.size = null;
    }
};
__decorate([
    HostBinding('class.card'),
    HostBinding('class.text-muted'),
    HostBinding('class.text-center'),
    __metadata("design:type", Boolean)
], PNoItemComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PNoItemComponent.prototype, "size", void 0);
PNoItemComponent = __decorate([
    Component({
        selector: 'p-no-item',
        templateUrl: './p-no-item.component.html',
        styleUrls: ['./p-no-item.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], PNoItemComponent);
export { PNoItemComponent };
//# sourceMappingURL=p-no-item.component.js.map