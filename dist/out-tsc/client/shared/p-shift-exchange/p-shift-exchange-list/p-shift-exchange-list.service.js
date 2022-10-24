import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { MeService } from '@plano/shared/api';
import { PCookieService } from '@plano/shared/core/p-cookie.service';
let PShiftExchangeListService = class PShiftExchangeListService {
    constructor(meService, pCookieService) {
        this.meService = meService;
        this.pCookieService = pCookieService;
        this._key = null;
        this._reverse = null;
        this.meService.onChange.subscribe(() => {
            this.readCookies();
            this.initValues();
        });
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get key() {
        return this._key;
    }
    set key(value) {
        this.pCookieService.put({ name: 'PShiftExchangeListServiceKey', prefix: null }, `${value}`);
        this._key = value;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get reverse() {
        return this._reverse;
    }
    set reverse(value) {
        this.pCookieService.put({ name: 'PShiftExchangeListServiceReverse', prefix: null }, `${value}`);
        this._reverse = value;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    readCookies() {
        const keyCookie = this.pCookieService.get({ name: 'PShiftExchangeListServiceKey', prefix: null });
        if (keyCookie !== undefined) {
            this.key = keyCookie;
        }
        const reverseCookie = this.pCookieService.get({ name: 'PShiftExchangeListServiceReverse', prefix: null });
        if (reverseCookie !== undefined) {
            this.reverse = reverseCookie === 'true';
        }
    }
    /**
     * Init all necessary values for this class
     */
    initValues() {
        if (this._key === null)
            this.key = 'shiftRefs';
        if (this._reverse === null)
            this.reverse = false;
    }
    /** @see PServiceInterface['unload'] */
    unload() {
        this._key = null;
        this._reverse = null;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    setSortBy(key) {
        if (this.key === key) {
            this.reverse = !this.reverse;
        }
        else {
            this.key = key;
            this.reverse = false;
        }
    }
};
PShiftExchangeListService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [MeService,
        PCookieService])
], PShiftExchangeListService);
export { PShiftExchangeListService };
//# sourceMappingURL=p-shift-exchange-list.service.js.map