var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { SLIDE_ON_NGIF_TRIGGER } from '@plano/animations';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiWarnings } from '@plano/shared/api';
import { SchedulingApiShiftExchangeCommunicationSwapOffer } from '@plano/shared/api';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
let PickedOfferComponent = class PickedOfferComponent {
    constructor(api) {
        this.api = api;
        this.readMode = false;
        this.offer = null;
        this.addToOfferBtnDisabled = false;
        this.selectedOffer = false;
        this.affectedOffer = false;
        this.addToOffer = new EventEmitter();
        this.onRemoveOffer = new EventEmitter();
        this.onRemoveFromOffer = new EventEmitter();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get warnings() {
        const emptyList = new SchedulingApiWarnings(null, false);
        if (!this.api.isLoaded())
            return emptyList;
        if (!(this.offer instanceof SchedulingApiShiftExchangeCommunicationSwapOffer))
            return emptyList;
        assumeDefinedToGetStrictNullChecksRunning(this.api.data.warnings, 'api.data.warnings');
        return this.api.data.warnings.getByOffer(this.offer);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PickedOfferComponent.prototype, "readMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PickedOfferComponent.prototype, "offer", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PickedOfferComponent.prototype, "addToOfferBtnDisabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PickedOfferComponent.prototype, "selectedOffer", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PickedOfferComponent.prototype, "affectedOffer", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_b = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _b : Object)
], PickedOfferComponent.prototype, "addToOffer", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PickedOfferComponent.prototype, "onRemoveOffer", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], PickedOfferComponent.prototype, "onRemoveFromOffer", void 0);
PickedOfferComponent = __decorate([
    Component({
        selector: 'p-picked-offer',
        templateUrl: './picked-offer.component.html',
        styleUrls: ['./picked-offer.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        animations: [SLIDE_ON_NGIF_TRIGGER],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object])
], PickedOfferComponent);
export { PickedOfferComponent };
//# sourceMappingURL=picked-offer.component.js.map