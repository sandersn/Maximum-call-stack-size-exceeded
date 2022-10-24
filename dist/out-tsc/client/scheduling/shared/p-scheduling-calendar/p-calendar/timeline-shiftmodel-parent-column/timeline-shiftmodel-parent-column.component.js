import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
let PTimelineShiftModelParentColumnComponent = class PTimelineShiftModelParentColumnComponent {
    constructor() {
        this._alwaysTrue = true;
        this.name = null;
    }
};
__decorate([
    HostBinding('class.border-left'),
    HostBinding('class.p-2'),
    __metadata("design:type", Object)
], PTimelineShiftModelParentColumnComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTimelineShiftModelParentColumnComponent.prototype, "name", void 0);
PTimelineShiftModelParentColumnComponent = __decorate([
    Component({
        selector: 'p-timeline-shiftmodel-parent-column',
        templateUrl: './timeline-shiftmodel-parent-column.component.html',
        styleUrls: ['./timeline-shiftmodel-parent-column.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], PTimelineShiftModelParentColumnComponent);
export { PTimelineShiftModelParentColumnComponent };
//# sourceMappingURL=timeline-shiftmodel-parent-column.component.js.map