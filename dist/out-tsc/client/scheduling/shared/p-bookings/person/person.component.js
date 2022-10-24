import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Config } from '@plano/shared/core/config';
let PPersonComponent = class PPersonComponent {
    constructor() {
        this.firstName = '?';
        this.lastName = '?';
        this.tariffName = '?';
        this.price = null;
        this.additionalField = null;
        this.additionalFieldValue = null;
        this.CONFIG = Config;
    }
};
__decorate([
    Input(),
    __metadata("design:type", String)
], PPersonComponent.prototype, "firstName", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], PPersonComponent.prototype, "lastName", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PPersonComponent.prototype, "tariffName", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PPersonComponent.prototype, "price", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PPersonComponent.prototype, "additionalField", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PPersonComponent.prototype, "additionalFieldValue", void 0);
PPersonComponent = __decorate([
    Component({
        selector: 'p-person',
        templateUrl: './person.component.html',
        styleUrls: ['./person.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], PPersonComponent);
export { PPersonComponent };
//# sourceMappingURL=person.component.js.map