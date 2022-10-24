var _a;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
let PauseDurationComponent = class PauseDurationComponent {
    constructor() {
        this.merged = false;
        this.duration = null;
        this.regularPauseDuration = null;
        this.automaticPauseDuration = null;
        this.memberName = null;
        this.tooltipTemplate = null;
        this.isForecast = false;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PauseDurationComponent.prototype, "merged", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PauseDurationComponent.prototype, "duration", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PauseDurationComponent.prototype, "regularPauseDuration", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PauseDurationComponent.prototype, "automaticPauseDuration", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PauseDurationComponent.prototype, "memberName", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PauseDurationComponent.prototype, "tooltipTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PauseDurationComponent.prototype, "isForecast", void 0);
PauseDurationComponent = __decorate([
    Component({
        selector: 'p-pause-duration',
        templateUrl: './pause-duration.component.html',
        styleUrls: ['./pause-duration.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], PauseDurationComponent);
export { PauseDurationComponent };
//# sourceMappingURL=pause-duration.component.js.map