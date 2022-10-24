var _a;
import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, Input, Output } from '@angular/core';
let PFormControlSwitchItemComponent = class PFormControlSwitchItemComponent {
    constructor() {
        this.icon = null;
        this.description = null;
        this.active = null;
        this.disabled = false;
        this.cannotEditHint = null;
        this.onClick = new EventEmitter();
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchItemComponent.prototype, "value", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchItemComponent.prototype, "icon", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchItemComponent.prototype, "label", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchItemComponent.prototype, "description", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchItemComponent.prototype, "active", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchItemComponent.prototype, "disabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlSwitchItemComponent.prototype, "cannotEditHint", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_a = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _a : Object)
], PFormControlSwitchItemComponent.prototype, "onClick", void 0);
PFormControlSwitchItemComponent = __decorate([
    Component({
        selector: 'p-form-control-switch-item[label]',
        templateUrl: './p-form-control-switch-item.component.html',
        styleUrls: ['./p-form-control-switch-item.component.scss'],
    }),
    __metadata("design:paramtypes", [])
], PFormControlSwitchItemComponent);
export { PFormControlSwitchItemComponent };
//# sourceMappingURL=p-form-control-switch-item.component.js.map