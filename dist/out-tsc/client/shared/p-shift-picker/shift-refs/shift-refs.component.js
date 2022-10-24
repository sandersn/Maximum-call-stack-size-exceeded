var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { SchedulingApiShiftExchangeShiftRefs, SchedulingApiShiftExchangeCommunicationSwapOffer } from '@plano/shared/api';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { LogService } from '../../../../shared/core/log.service';
import { assumeNonNull } from '../../../../shared/core/null-type-utils';
import { BootstrapRounded, BootstrapSize, PThemeEnum } from '../../bootstrap-styles.enum';
let ShiftRefsComponent = class ShiftRefsComponent {
    constructor(localize, console) {
        this.localize = localize;
        this.console = console;
        this.readMode = false;
        this.offer = null;
        this.onAddToOffer = new EventEmitter();
        this.onRemoveOffer = new EventEmitter();
        this.onRemoveFromOffer = new EventEmitter();
        this.selectedOffer = false;
        this.selectedOfferChange = new EventEmitter();
        this.affectedOffer = false;
        this.selectable = false;
        this.addToOfferBtnDisabled = false;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.PThemeEnum = PThemeEnum;
        this.BootstrapSize = BootstrapSize;
        this.BootstrapRounded = BootstrapRounded;
    }
    ngAfterContentInit() {
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftId() {
        if (this.isPaket)
            return null;
        if (this.offer instanceof SchedulingApiShiftExchangeShiftRefs) {
            const OFFER = this.offer.get(0);
            return OFFER !== null ? OFFER.id : null;
        }
        if (this.offer === null)
            throw new Error('Can not get shiftId when offer is undefined [PLANO-FE-4NX]');
        // NOTE: I had to make p-shifts-info>shiftId happy and remove null from method return type
        this.console.error('Add Id as possible type to PShiftsInfoComponent.shiftId');
        return this.offer.id;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftRefs() {
        if (!this.isPaket)
            return null;
        if (this.offer instanceof SchedulingApiShiftExchangeShiftRefs)
            return this.offer;
        return this.offer.shiftRefs;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onSelect(offer) {
        this.selectedOffer = !this.selectedOffer;
        this.selectedOfferChange.emit(this.selectedOffer ? offer : undefined);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isPaket() {
        if (this.offer instanceof SchedulingApiShiftExchangeShiftRefs)
            return true;
        if (this.offer instanceof SchedulingApiShiftExchangeCommunicationSwapOffer)
            return true;
        return undefined;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showAddToOfferButton() {
        if (this.readMode)
            return false;
        if (!this.isPaket)
            return false;
        return this.onAddToOffer.observers.length > 0;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showOnRemoveOfferButton() {
        if (this.readMode)
            return false;
        if (this.offer instanceof SchedulingApiShiftExchangeShiftRefs)
            return this.offer.length === 1;
        return this.onRemoveOffer.observers.length > 0;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showOnRemoveFromOfferButton() {
        if (this.readMode)
            return false;
        if (!this.isPaket)
            return false;
        return this.onRemoveFromOffer.observers.length > 0;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showOnSelectButton() {
        if (this.readMode)
            return false;
        if (!this.isPaket)
            return false;
        return this.selectable;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    addToOffer(shiftRefs) {
        assumeNonNull(shiftRefs);
        if (this.addToOfferBtnDisabled)
            return;
        this.onAddToOffer.emit(shiftRefs);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get addToOfferBtnDisabledLabel() {
        if (!this.addToOfferBtnDisabled)
            return undefined;
        return this.localize.transform('Wähle weitere Schichten im Kalender, um sie diesem Angebot gebündelt hinzuzufügen.');
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftRefsComponent.prototype, "readMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftRefsComponent.prototype, "offer", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_a = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _a : Object)
], ShiftRefsComponent.prototype, "onAddToOffer", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], ShiftRefsComponent.prototype, "onRemoveOffer", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_b = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _b : Object)
], ShiftRefsComponent.prototype, "onRemoveFromOffer", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftRefsComponent.prototype, "selectedOffer", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], ShiftRefsComponent.prototype, "selectedOfferChange", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftRefsComponent.prototype, "affectedOffer", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftRefsComponent.prototype, "selectable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftRefsComponent.prototype, "addToOfferBtnDisabled", void 0);
ShiftRefsComponent = __decorate([
    Component({
        selector: 'p-shift-refs',
        templateUrl: './shift-refs.component.html',
        styleUrls: ['./shift-refs.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [LocalizePipe,
        LogService])
], ShiftRefsComponent);
export { ShiftRefsComponent };
//# sourceMappingURL=shift-refs.component.js.map