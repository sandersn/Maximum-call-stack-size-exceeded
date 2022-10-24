import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
let PMinimalPacketInfoComponent = class PMinimalPacketInfoComponent {
    constructor() {
        this.packetShiftsLength = null;
        this.shiftIndex = null;
        this.PlanoFaIconPool = PlanoFaIconPool;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PMinimalPacketInfoComponent.prototype, "packetShiftsLength", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PMinimalPacketInfoComponent.prototype, "shiftIndex", void 0);
PMinimalPacketInfoComponent = __decorate([
    Component({
        selector: 'p-minimal-packet-info',
        templateUrl: './minimal-packet-info.component.html',
        styleUrls: ['./minimal-packet-info.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], PMinimalPacketInfoComponent);
export { PMinimalPacketInfoComponent };
//# sourceMappingURL=minimal-packet-info.component.js.map