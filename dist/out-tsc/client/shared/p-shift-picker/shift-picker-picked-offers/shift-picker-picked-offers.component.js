var _a, _b, _c, _d, _e, _f, _g, _h;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { SchedulingApiShiftExchangeCommunicationSwapOffer } from '@plano/shared/api';
import { SchedulingApiShifts } from '@plano/shared/api';
import { SchedulingApiShiftExchangeCommunicationSwapOffers, SchedulingApiShiftExchangeShiftRefs } from '@plano/shared/api';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { PShiftExchangeService } from '../../p-shift-exchange/shift-exchange.service';
let PShiftPickerPickedOffersComponent = class PShiftPickerPickedOffersComponent {
    constructor(pShiftExchangeService, localize) {
        this.pShiftExchangeService = pShiftExchangeService;
        this.localize = localize;
        this.hideAddToOffersBtn = false;
        this.offerTemplate = null;
        this.showBoundShiftOfferSetBtn = false;
        this.alerts = null;
        this.addToOffer = new EventEmitter();
        this.addToOffers = new EventEmitter();
        this.addSelectedShiftsAsPacket = new EventEmitter();
        this.onRemoveOffer = new EventEmitter();
        this.onRemoveShiftRefFromOffer = new EventEmitter();
        this.addToOffersBtnLabel = null;
        this.PlanoFaIconPool = PlanoFaIconPool;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    offerSelected(
    // TODO: Get rid of `| any`
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents */
    offer) {
        assumeDefinedToGetStrictNullChecksRunning(this.shiftsToBeAdded, 'shiftsToBeAdded');
        return this.pShiftExchangeService.offerSelected(offer, this.shiftsToBeAdded);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    offerAffected(
    // TODO: Get rid of `| any`
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents */
    offer) {
        assumeDefinedToGetStrictNullChecksRunning(this.shiftsToBeAdded, 'shiftsToBeAdded');
        return this.pShiftExchangeService.offerAffected(offer, this.shiftsToBeAdded);
    }
    ngAfterContentInit() {
        this.initValues();
    }
    /**
     * Set values that are necessary for this function.
     * These initValues methods are used in many components.
     * They mostly get used for class attributes that would cause performance issues as a getter.
     */
    initValues() {
        if (this.addToOffersBtnLabel === null) {
            this.addToOffersBtnLabel = this.localize.transform('Der Auswahl hinzufügen');
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    addToOfferBtnDisabled(offer) {
        if (offer instanceof SchedulingApiShiftExchangeShiftRefs) {
            if (!this.shiftsToBeAdded.length)
                return true;
            return false;
        }
        if (!(offer instanceof SchedulingApiShiftExchangeCommunicationSwapOffer))
            return undefined;
        if (!this.shiftsToBeAdded.length)
            return true;
        const shiftsCanBeAddedCounter = this.shiftsToBeAdded.filterBy((item) => {
            /** Shifts can be added if they are not already contained */
            return !offer.shiftRefs.contains(item.id);
        }).length;
        if (!shiftsCanBeAddedCounter)
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    removeFromOffer(shiftRef, 
    // TODO: Get rid of `| any`
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents */
    offer) {
        this.onRemoveShiftRefFromOffer.emit({
            shiftRef: shiftRef,
            offer: offer,
        });
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isShiftExchangeShiftRefs() {
        return !!this.offers && this.offers instanceof SchedulingApiShiftExchangeShiftRefs;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftRefs() {
        if (!this.offers)
            return undefined;
        if (!(this.offers instanceof SchedulingApiShiftExchangeShiftRefs))
            return undefined;
        return this.offers;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get boundShiftOfferSetBtnDisabled() {
        return this.shiftsToBeAdded.length <= 1;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get addToOffersBtnDisabled() {
        return !this.shiftsToBeAdded.length;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get addToOffersBtnPopover() {
        if (!this.addToOffersBtnDisabled)
            return undefined;
        return this.localize.transform('Wähle im Kalender mindestens 1 Schicht, die du hinzufügen möchtest.');
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get boundShiftOfferSetBtnPopover() {
        if (!this.boundShiftOfferSetBtnDisabled)
            return undefined;
        return this.localize.transform('Fügst du 2 oder mehr Schichten gebündelt hinzu, müssen sie komplett von einer Person übernommen werden.');
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftExchangeShiftRefs() {
        if (this.offers instanceof SchedulingApiShiftExchangeCommunicationSwapOffers)
            return undefined;
        return this.offers;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PShiftPickerPickedOffersComponent.prototype, "hideAddToOffersBtn", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftPickerPickedOffersComponent.prototype, "offerTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PShiftPickerPickedOffersComponent.prototype, "showBoundShiftOfferSetBtn", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftPickerPickedOffersComponent.prototype, "alerts", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftPickerPickedOffersComponent.prototype, "offers", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_d = typeof SchedulingApiShifts !== "undefined" && SchedulingApiShifts) === "function" ? _d : Object)
], PShiftPickerPickedOffersComponent.prototype, "shiftsToBeAdded", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_e = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _e : Object)
], PShiftPickerPickedOffersComponent.prototype, "addToOffer", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_f = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _f : Object)
], PShiftPickerPickedOffersComponent.prototype, "addToOffers", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_g = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _g : Object)
], PShiftPickerPickedOffersComponent.prototype, "addSelectedShiftsAsPacket", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PShiftPickerPickedOffersComponent.prototype, "onRemoveOffer", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_h = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _h : Object)
], PShiftPickerPickedOffersComponent.prototype, "onRemoveShiftRefFromOffer", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftPickerPickedOffersComponent.prototype, "addToOffersBtnLabel", void 0);
PShiftPickerPickedOffersComponent = __decorate([
    Component({
        selector: 'p-shift-picker-picked-offers[shiftsToBeAdded]',
        templateUrl: './shift-picker-picked-offers.component.html',
        styleUrls: ['./shift-picker-picked-offers.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [PShiftExchangeService,
        LocalizePipe])
], PShiftPickerPickedOffersComponent);
export { PShiftPickerPickedOffersComponent };
//# sourceMappingURL=shift-picker-picked-offers.component.js.map