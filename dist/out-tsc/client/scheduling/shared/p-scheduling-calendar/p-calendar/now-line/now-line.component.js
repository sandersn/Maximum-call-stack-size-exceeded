import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
let PNowLineComponent = class PNowLineComponent {
    constructor() {
        this._alwaysTrue = true;
    }
};
__decorate([
    HostBinding('class.scroll-target-id-now-line'),
    __metadata("design:type", Object)
], PNowLineComponent.prototype, "_alwaysTrue", void 0);
PNowLineComponent = __decorate([
    Component({
        selector: 'p-now-line',
        templateUrl: './now-line.component.html',
        styleUrls: ['./now-line.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [])
], PNowLineComponent);
export { PNowLineComponent };
//# sourceMappingURL=now-line.component.js.map