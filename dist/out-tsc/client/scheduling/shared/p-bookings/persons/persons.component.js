import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { Config } from '@plano/shared/core/config';
import { PThemeEnum } from '../../../../shared/bootstrap-styles.enum';
let PPersonsComponent = class PPersonsComponent {
    constructor() {
        this.count = '?';
        this.tariffName = '?';
        this.ageMin = '?';
        this.ageMax = '?';
        this.additionalFieldLabel = null;
        this.additionalFieldValue = null;
        this.price = null;
        this.tariffNotAvailableThatTime = false;
        this.ageLimitWarning = null;
        this.CONFIG = Config;
        this.PThemeEnum = PThemeEnum;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PPersonsComponent.prototype, "count", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PPersonsComponent.prototype, "tariffName", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PPersonsComponent.prototype, "ageMin", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PPersonsComponent.prototype, "ageMax", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PPersonsComponent.prototype, "additionalFieldLabel", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PPersonsComponent.prototype, "additionalFieldValue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PPersonsComponent.prototype, "price", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PPersonsComponent.prototype, "tariffNotAvailableThatTime", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PPersonsComponent.prototype, "ageLimitWarning", void 0);
PPersonsComponent = __decorate([
    Component({
        selector: 'p-persons',
        templateUrl: './persons.component.html',
        styleUrls: ['./persons.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], PPersonsComponent);
export { PPersonsComponent };
//# sourceMappingURL=persons.component.js.map