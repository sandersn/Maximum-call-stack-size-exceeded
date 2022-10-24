import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { PShiftmodelTariffService } from '../../p-forms/p-shiftmodel-tariff.service';
let PTariffMetaInfoComponent = class PTariffMetaInfoComponent {
    constructor(pShiftmodelTariffService) {
        this.pShiftmodelTariffService = pShiftmodelTariffService;
        this.negateForCourseDatesInterval = false;
        this.forCourseDatesFrom = null;
        this.forCourseDatesUntil = null;
        this.isInternal = false;
        this.isInternalLabel = null;
        this.longText = false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get hasCourseDatesData() {
        return this.pShiftmodelTariffService.hasCourseDatesData(this.negateForCourseDatesInterval, this.forCourseDatesFrom, this.forCourseDatesUntil);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PTariffMetaInfoComponent.prototype, "negateForCourseDatesInterval", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTariffMetaInfoComponent.prototype, "forCourseDatesFrom", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTariffMetaInfoComponent.prototype, "forCourseDatesUntil", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PTariffMetaInfoComponent.prototype, "isInternal", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTariffMetaInfoComponent.prototype, "isInternalLabel", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PTariffMetaInfoComponent.prototype, "longText", void 0);
PTariffMetaInfoComponent = __decorate([
    Component({
        selector: 'p-tariff-meta-info',
        templateUrl: './tariff-meta-info.component.html',
        styleUrls: ['./tariff-meta-info.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [PShiftmodelTariffService])
], PTariffMetaInfoComponent);
export { PTariffMetaInfoComponent };
//# sourceMappingURL=tariff-meta-info.component.js.map