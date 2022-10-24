var _a;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, HostBinding } from '@angular/core';
let PShiftComponent = class PShiftComponent {
    constructor() {
        this.id = null;
        this.selected = false;
        this.selectedChange = new EventEmitter();
        this.disabled = false;
        this.showDate = true;
    }
    // @HostBinding('class.clickable') private _hasClickableClass() : boolean {
    // 	return this.showCheckbox;
    // }
    get _hasSelectedClass() {
        return this.selected;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showCheckbox() {
        return !!this.selectedChange.observers.length;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftComponent.prototype, "id", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PShiftComponent.prototype, "selected", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_a = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _a : Object)
], PShiftComponent.prototype, "selectedChange", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PShiftComponent.prototype, "disabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PShiftComponent.prototype, "showDate", void 0);
__decorate([
    HostBinding('class.selected'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PShiftComponent.prototype, "_hasSelectedClass", null);
PShiftComponent = __decorate([
    Component({
        selector: 'p-shift',
        templateUrl: './p-shift.component.html',
        styleUrls: ['./p-shift.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [])
], PShiftComponent);
export { PShiftComponent };
//# sourceMappingURL=p-shift.component.js.map