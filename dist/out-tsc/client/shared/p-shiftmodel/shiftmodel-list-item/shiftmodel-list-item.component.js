var _a;
import { __decorate, __metadata } from "tslib";
import { Input, Component, ChangeDetectionStrategy, HostBinding, EventEmitter, Output } from '@angular/core';
let PShiftmodelListItemComponent = class PShiftmodelListItemComponent {
    constructor() {
        this._alwaysTrue = true;
        this._hasOnClickBinding = null;
        this.color = null;
        this.isPacket = null;
        this.onClick = new EventEmitter();
    }
    /**
     * Is there a (onClick)="…" on this component?
     */
    get hasOnClickBinding() {
        if (this._hasOnClickBinding !== null)
            return this._hasOnClickBinding;
        return this.onClick.observers.length > 0;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get hexColor() {
        if (!this.color)
            return null;
        return `#${this.color}`;
    }
};
__decorate([
    HostBinding('class.d-flex'),
    HostBinding('class.justify-content-between'),
    HostBinding('class.align-items-center'),
    HostBinding('class.position-relative'),
    __metadata("design:type", Object)
], PShiftmodelListItemComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input('hasOnClickBinding'),
    __metadata("design:type", Object)
], PShiftmodelListItemComponent.prototype, "_hasOnClickBinding", void 0);
__decorate([
    HostBinding('class.list-group-item-action'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PShiftmodelListItemComponent.prototype, "hasOnClickBinding", null);
__decorate([
    Input(),
    __metadata("design:type", String)
], PShiftmodelListItemComponent.prototype, "label", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftmodelListItemComponent.prototype, "color", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftmodelListItemComponent.prototype, "isPacket", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_a = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _a : Object)
], PShiftmodelListItemComponent.prototype, "onClick", void 0);
PShiftmodelListItemComponent = __decorate([
    Component({
        selector: 'p-shiftmodel-list-item[label]',
        templateUrl: './shiftmodel-list-item.component.html',
        styleUrls: ['./shiftmodel-list-item.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], PShiftmodelListItemComponent);
export { PShiftmodelListItemComponent };
//# sourceMappingURL=shiftmodel-list-item.component.js.map