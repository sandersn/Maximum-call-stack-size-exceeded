var _a, _b;
import { __decorate, __metadata } from "tslib";
import { Injectable, NgZone } from '@angular/core';
import { SchedulingApiService } from '@plano/shared/api';
import { DataInput } from '@plano/shared/core/data/data-input';
import { LogService } from '@plano/shared/core/log.service';
import { PCookieService } from '@plano/shared/core/p-cookie.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
/**
 * A list of cookies.
 */
export class CookieListOfItems {
    constructor(pCookieService, cookieName) {
        this.pCookieService = pCookieService;
        this.cookieName = cookieName;
    }
    /**
     * Get an array of the cookies
     */
    get cookieArray() {
        if (!this.pCookieService.has(this.cookieName))
            return [];
        const cookieValue = this.pCookieService.get(this.cookieName);
        assumeDefinedToGetStrictNullChecksRunning(cookieValue, 'cookieValue');
        const result = JSON.parse(cookieValue);
        if (!Array.isArray(result))
            return [];
        return result;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    push(item) {
        this.addIdToCookie(item);
    }
    addIdToCookie(item) {
        const primitiveArray = this.cookieArray;
        if (!primitiveArray.includes(item))
            primitiveArray.push(item);
        this.pCookieService.put(this.cookieName, JSON.stringify(primitiveArray));
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    removeItem(item) {
        this.removeItemFromCookie(item);
    }
    removeItemFromCookie(item) {
        const idArray = this.cookieArray;
        const indexOfItem = idArray.indexOf(item);
        if (indexOfItem > -1)
            idArray.splice(indexOfItem, 1);
        this.pCookieService.put(this.cookieName, JSON.stringify(idArray));
    }
    /**
     * Removes all items of the list.
     */
    clear() {
        for (const cookieItem of this.cookieArray)
            this.removeItem(cookieItem);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get(item) {
        return this.cookieArray.includes(item);
    }
}
/**
 * Filter items that are visible in the calendar.
 * Most of this information gets stored in the cookies.
 */
let CollapsedShiftmodelsService = class CollapsedShiftmodelsService extends DataInput {
    constructor(api, pCookieService, zone, console) {
        super(zone);
        this.api = api;
        this.pCookieService = pCookieService;
        this.zone = zone;
        this.console = console;
        /** Checking hiddenParentNames always accesses the cookies. Thats expensive. So we cache it here. */
        this.isVisibleCache = null;
        this.hiddenParentNames = new CookieListOfItems(this.pCookieService, { name: 'hiddenParentNames', prefix: null });
        this.initValues();
        /**
         * Guess what happens when an item gets removed from api.data through a api.load? Throw.
         * So here we make sure every api.data load refills the arrays with valid data.
         */
        this.api.onDataLoaded.subscribe(() => {
            this.hiddenParentNames = new CookieListOfItems(this.pCookieService, { name: 'hiddenParentNames', prefix: null });
            this.readCookies();
        });
    }
    /**
     * Init all necessary values for this class
     */
    initValues() {
    }
    /**
     * Read values from cookies if available
     */
    readCookies() {
        if (this.pCookieService.has({ name: 'hiddenParentNames', prefix: null })) {
            for (const item of this.hiddenParentNames.cookieArray) {
                if (this.api.data.shiftModels.parentNames.includes(item))
                    this.hiddenParentNames.push(item);
            }
        }
    }
    ngOnDestroy() {
        this.unload();
    }
    /** @see PServiceInterface['unload'] */
    unload() {
        this.hiddenParentNames.clear();
        this.changed(null);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    show(input) {
        this.hiddenParentNames.removeItem(input);
        this.isVisibleCache = null;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    hide(input) {
        this.hiddenParentNames.push(input);
        this.isVisibleCache = null;
    }
    /**
     * Check if this item is visible
     */
    isVisible(parentName) {
        var _a;
        const cachedValue = (_a = this.isVisibleCache) === null || _a === void 0 ? void 0 : _a.get(parentName);
        if (cachedValue === undefined) {
            if (this.isVisibleCache === null)
                this.isVisibleCache = new Map();
            this.isVisibleCache.set(parentName, !this.hiddenParentNames.get(parentName));
        }
        return this.isVisibleCache.get(parentName);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    toggleItem(item) {
        if (!this.isVisible(item)) {
            this.show(item);
            return;
        }
        this.hide(item);
        for (const shiftModel of this.api.data.shiftModels.filterBy(itm => itm.parentName === item).iterable()) {
            this.api.data.shifts.getItemsRelatedTo(shiftModel).setSelected(false);
        }
    }
};
CollapsedShiftmodelsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, PCookieService, typeof (_b = typeof NgZone !== "undefined" && NgZone) === "function" ? _b : Object, LogService])
], CollapsedShiftmodelsService);
export { CollapsedShiftmodelsService };
//# sourceMappingURL=collapsed-shiftmodel-parents.service.js.map