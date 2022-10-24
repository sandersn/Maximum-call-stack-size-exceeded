var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Component, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingApiShiftModel } from '@plano/shared/api';
import { PThemeEnum } from '../../../../client/shared/bootstrap-styles.enum';
let ModalHeaderComponent = class ModalHeaderComponent {
    constructor() {
        this.title = null;
        this.item = null;
        this.onClose = new EventEmitter();
        this.theme = null;
        this.hasDanger = null;
    }
    /**
     * Calculate the text color
     */
    get textWhite() {
        return (!!this.theme &&
            this.theme !== PThemeEnum.WARNING &&
            this.theme !== PThemeEnum.LIGHT);
    }
    /**
     * Start of item
     */
    get start() {
        if (this.item === null)
            return null;
        if (this.item instanceof SchedulingApiShiftModel)
            return null;
        return this.item.start;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], ModalHeaderComponent.prototype, "title", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ModalHeaderComponent.prototype, "item", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], ModalHeaderComponent.prototype, "onClose", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ModalHeaderComponent.prototype, "theme", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ModalHeaderComponent.prototype, "hasDanger", void 0);
ModalHeaderComponent = __decorate([
    Component({
        selector: 'p-modal-header',
        templateUrl: './modal-header.component.html',
        styleUrls: ['./modal-header.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [])
], ModalHeaderComponent);
export { ModalHeaderComponent };
//# sourceMappingURL=modal-header.component.js.map