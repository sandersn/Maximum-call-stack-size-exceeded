import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
let PRadiosRadioComponent = class PRadiosRadioComponent {
    constructor() {
        this.icon = null;
        this.description = null;
        this.active = null;
        this.cannotEditHint = null;
        this.onClick = new EventEmitter();
        this.triggers = null;
        this.placement = null;
        this.disabled = false;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PRadiosRadioComponent.prototype, "value", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PRadiosRadioComponent.prototype, "icon", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PRadiosRadioComponent.prototype, "label", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PRadiosRadioComponent.prototype, "description", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PRadiosRadioComponent.prototype, "active", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PRadiosRadioComponent.prototype, "cannotEditHint", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PRadiosRadioComponent.prototype, "onClick", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PRadiosRadioComponent.prototype, "popover", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PRadiosRadioComponent.prototype, "triggers", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PRadiosRadioComponent.prototype, "container", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PRadiosRadioComponent.prototype, "placement", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PRadiosRadioComponent.prototype, "disabled", void 0);
PRadiosRadioComponent = __decorate([
    Component({
        selector: 'p-radios-radio[label]',
        templateUrl: './p-radios-radio.component.html',
        styleUrls: ['./p-radios-radio.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [])
], PRadiosRadioComponent);
export { PRadiosRadioComponent };
//# sourceMappingURL=p-radios-radio.component.js.map