var _a;
import { __decorate, __metadata } from "tslib";
import { Component, Input, EventEmitter, Output, HostBinding, HostListener, ChangeDetectionStrategy } from '@angular/core';
let PListItemComponent = class PListItemComponent {
    constructor() {
        this.cssClasses = null;
        this.hideListItemStyle = false;
        this.size = 'medium';
        this.onClick = new EventEmitter();
    }
    _handleClick(event) {
        this.onClick.emit(event);
    }
    get _hasListGroupItem() {
        return !this.hideListItemStyle;
    }
    get _hasOnClickBinding() {
        return this.onClick.observers.length > 0;
    }
    get _hasP0() { return this.size === 'frameless'; }
    get _hasP1() { return this.size === 'small'; }
    get _hasP2() { return this.size === 'medium'; }
    get _hasP3() { return this.size === 'large'; }
    get _hasAlignItemsStretch() {
        if (!this.cssClasses)
            return false;
        if (this.cssClasses.includes('align-items-'))
            return false;
        return true;
    }
};
__decorate([
    HostListener('click', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], PListItemComponent.prototype, "_handleClick", null);
__decorate([
    Input('class'),
    __metadata("design:type", Object)
], PListItemComponent.prototype, "cssClasses", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PListItemComponent.prototype, "hideListItemStyle", void 0);
__decorate([
    HostBinding('class.list-group-item'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PListItemComponent.prototype, "_hasListGroupItem", null);
__decorate([
    HostBinding('class.list-group-item-action'),
    HostBinding('class.clickable'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PListItemComponent.prototype, "_hasOnClickBinding", null);
__decorate([
    HostBinding('class.p-0'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PListItemComponent.prototype, "_hasP0", null);
__decorate([
    HostBinding('class.p-1'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PListItemComponent.prototype, "_hasP1", null);
__decorate([
    HostBinding('class.p-2'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PListItemComponent.prototype, "_hasP2", null);
__decorate([
    HostBinding('class.p-3'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PListItemComponent.prototype, "_hasP3", null);
__decorate([
    HostBinding('class.align-items-stretch'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PListItemComponent.prototype, "_hasAlignItemsStretch", null);
__decorate([
    Input(),
    __metadata("design:type", String)
], PListItemComponent.prototype, "size", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_a = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _a : Object)
], PListItemComponent.prototype, "onClick", void 0);
PListItemComponent = __decorate([
    Component({
        selector: 'p-list-item',
        templateUrl: './p-list-item.component.html',
        styleUrls: ['./p-list-item.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [])
], PListItemComponent);
export { PListItemComponent };
let PListItemAppendAppendComponent = class PListItemAppendAppendComponent {
    constructor() {
        this._alwaysTrue = true;
    }
};
__decorate([
    HostBinding('class.p-list-item-append'),
    __metadata("design:type", Object)
], PListItemAppendAppendComponent.prototype, "_alwaysTrue", void 0);
PListItemAppendAppendComponent = __decorate([
    Component({
        selector: 'p-list-item-append',
        template: '<ng-content></ng-content>',
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], PListItemAppendAppendComponent);
export { PListItemAppendAppendComponent };
//# sourceMappingURL=p-list-item.component.js.map