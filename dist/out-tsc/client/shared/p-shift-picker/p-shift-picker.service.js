import { __decorate, __metadata } from "tslib";
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { ShiftId } from '@plano/shared/api';
import { SchedulingApiShiftExchangeShiftRefs, SchedulingApiShiftExchangeCommunicationSwapOffers } from '@plano/shared/api';
import { SchedulingApiShiftExchangeSwappedShiftRefs } from '@plano/shared/api';
import { Assertions } from '@plano/shared/core/assertions';
let PShiftPickerService = class PShiftPickerService {
    constructor(pMoment) {
        this.pMoment = pMoment;
        this.mode = CalendarModes.MONTH;
        this.queryParams = null;
        /**
         * If its a existing shiftExchange, the api calls always send the necessary shifts
         * If its a new shiftExchange, the api calls must be filled with the ensureShifts param
         */
        this.ensureShifts = [];
        this.initValues();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get date() { return this._date; }
    set date(input) {
        Assertions.ensureIsDayStart(input);
        this._date = input;
    }
    get ensureShiftsAsAsString() {
        return JSON.stringify(this.ensureShifts, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (_key, value) => {
            return (value instanceof ShiftId ? value.rawData : value);
        });
    }
    /**
     * update queryParam values based on urlParam, bookingsService etc.
     */
    updateQueryParams() {
        const start = (+this.pMoment.m(this.date).startOf(this.mode)).toString();
        const end = (+this.pMoment.m(this.date).startOf(this.mode).add(1, this.mode)).toString();
        this.queryParams = new HttpParams()
            .set('data', 'calendar')
            .set('start', start)
            .set('end', end);
        this.updateEnsureShiftsParam();
    }
    updateEnsureShiftsParam() {
        if (!this.ensureShifts.length)
            return;
        this.queryParams = this.queryParams
            .set('ensureShifts', this.ensureShiftsAsAsString);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    initValues() {
        this._date = +this.pMoment.m().startOf('day');
        if (!this.date)
            this.date = +this.pMoment.m().startOf('day');
    }
    /** @see PServiceInterface['unload'] */
    unload() {
        this.ensureShifts = [];
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onRemoveOffer(
    // eslint-disable-next-line @typescript-eslint/ban-types
    formArray, offersRef, offer) {
        const itmToSearch = offer instanceof SchedulingApiShiftExchangeShiftRefs ? offer.get(0) : offer;
        const itemToRemove = formArray.controls.find((item) => item.value === itmToSearch);
        if (!itemToRemove)
            throw new Error('Could not find shiftRef in formArray');
        const itemToRemoveIndex = formArray.controls.indexOf(itemToRemove);
        formArray.removeAt(itemToRemoveIndex);
        // formArray.updateValueAndValidity();
        if (offersRef instanceof SchedulingApiShiftExchangeCommunicationSwapOffers) {
            offersRef.removeItem(itmToSearch);
        }
        else if (offersRef instanceof SchedulingApiShiftExchangeSwappedShiftRefs) {
            offersRef.removeItem(itmToSearch);
        }
        else {
            offersRef.removeItem(itmToSearch);
        }
    }
};
PShiftPickerService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PMomentService])
], PShiftPickerService);
export { PShiftPickerService };
//# sourceMappingURL=p-shift-picker.service.js.map