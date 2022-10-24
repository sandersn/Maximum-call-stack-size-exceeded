import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, HostBinding, Input } from '@angular/core';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
let SpinnerComponent = class SpinnerComponent {
    constructor() {
        this._alwaysTrue = true;
        this.size = null;
        this.BootstrapSize = BootstrapSize;
    }
};
__decorate([
    HostBinding('class.align-items-center'),
    HostBinding('class.justify-content-center'),
    HostBinding('class.h-100'),
    __metadata("design:type", Object)
], SpinnerComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], SpinnerComponent.prototype, "size", void 0);
SpinnerComponent = __decorate([
    Component({
        selector: 'p-spinner',
        templateUrl: './spinner.component.html',
        styleUrls: ['./spinner.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], SpinnerComponent);
export { SpinnerComponent };
//# sourceMappingURL=spinner.component.js.map