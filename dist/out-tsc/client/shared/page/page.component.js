import { __decorate, __metadata } from "tslib";
import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
let PageComponent = class PageComponent {
    constructor() {
        this.whitespace = true;
        this._alwaysTrue = true;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PageComponent.prototype, "whitespace", void 0);
__decorate([
    HostBinding('class.flex-grow-1'),
    HostBinding('class.d-flex'),
    HostBinding('class.flex-column'),
    HostBinding('class.position-relative'),
    __metadata("design:type", Object)
], PageComponent.prototype, "_alwaysTrue", void 0);
PageComponent = __decorate([
    Component({
        selector: 'p-page',
        templateUrl: './page.component.html',
        styleUrls: ['./page.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], PageComponent);
export { PageComponent };
//# sourceMappingURL=page.component.js.map