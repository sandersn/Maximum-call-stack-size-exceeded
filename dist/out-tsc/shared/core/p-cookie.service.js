var _a;
import { __decorate, __metadata } from "tslib";
import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { MeService } from '@plano/shared/api';
import { Config } from './config';
import { LogService } from './log.service';
import { PMomentService } from '../../client/shared/p-moment.service';
let PCookieService = class PCookieService {
    constructor(cookie, meService, console) {
        this.cookie = cookie;
        this.meService = meService;
        this.console = console;
        /**
         * Cookie access is quite expensive so we cache them.
         */
        this.cache = new Map();
    }
    getCacheKey(cookieKeyData) {
        return this.getCookieKey(cookieKeyData, false, false);
    }
    /**
     * remove a cookie
     */
    remove(cookieKeyData) {
        // update cookie
        this.cookie.delete(this.getCookieKey(cookieKeyData), '/');
        // update cache
        this.cache.delete(this.getCacheKey(cookieKeyData));
    }
    /**
     * Set cookie based on provided information
     */
    put(cookieKeyData, input, expiresAfterDays = 35600) {
        var _a;
        // don’t write cookies if they can not be personalized.
        if (!this.meService.isLoaded()) {
            (_a = this.console) === null || _a === void 0 ? void 0 : _a.debug('Can not write cookies because meService is not loaded.');
            return;
        }
        if (input === null) {
            this.cache.delete(this.getCacheKey(cookieKeyData));
            return;
        }
        // Get new cookie value as string
        const cookieValue = typeof input === 'string' ? input : input.toString();
        // Get expiring date as timestamp
        const moment = new PMomentService(Config.LOCALE_ID, this.console).m();
        moment.add(expiresAfterDays, 'days').startOf('day');
        const expireDate = moment.toDate();
        // update cookie
        this.cookie.set(this.getCookieKey(cookieKeyData), cookieValue, expireDate, '/', undefined, undefined, 'Lax');
        // update cache
        this.cache.set(this.getCacheKey(cookieKeyData), cookieValue);
    }
    /**
     * Get cookies by name/id
     */
    get(cookieKeyData) {
        // if possible return from cache
        const cacheKey = this.getCacheKey(cookieKeyData);
        if (this.cache.has(cacheKey))
            return this.cache.get(cacheKey);
        // don’t get cookies if they can not be personalized.
        if (!this.meService.isLoaded())
            return undefined;
        const cookie = this.cookie.get(this.getCookieKey(cookieKeyData));
        return cookie !== '' ? cookie : undefined;
    }
    /**
     * Return `true` if {@link Document} is accessible, otherwise return `false`
     *
     * @param name Cookie name
     * @returns boolean - whether cookie with specified name exists
     */
    has(cookieKeyData) {
        // don’t get cookies if they can not be personalized.
        if (!this.meService.isLoaded())
            return undefined;
        return this.get(cookieKeyData) !== undefined;
    }
    getCookieKey(cookieKeyData, personalize = true, addDrpPrefix = true) {
        var _a;
        let result = cookieKeyData.prefix === null ? cookieKeyData.name : `${cookieKeyData.prefix}_${cookieKeyData.name}`;
        if (personalize) {
            if (!this.meService.isLoaded()) {
                (_a = this.console) === null || _a === void 0 ? void 0 : _a.error('Cookies could not be personalized');
                return result;
            }
            result = `${this.meService.data.id.rawData.toString()}_${result}`;
        }
        if (addDrpPrefix)
            result = `drp_${result}`;
        return result;
    }
    /** @see PServiceInterface['unload'] */
    unload() {
        this.cache = new Map();
    }
    /** Should the section be visible? */
    sectionIsVisible(cookieKeyData, defaultValue = true) {
        var _a;
        const cookieValue = (_a = this.get(cookieKeyData)) !== null && _a !== void 0 ? _a : null;
        if (cookieValue === null) {
            this.put(cookieKeyData, defaultValue);
            return defaultValue;
        }
        return cookieValue === 'true';
    }
    /** Hide this section */
    hideSection(cookieKeyData) {
        this.put(cookieKeyData, false);
    }
    /** Un-hide this section */
    showSection(cookieKeyData) {
        this.put(cookieKeyData, true);
    }
};
PCookieService = __decorate([
    Injectable({
        providedIn: 'root',
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof CookieService !== "undefined" && CookieService) === "function" ? _a : Object, MeService,
        LogService])
], PCookieService);
export { PCookieService };
//# sourceMappingURL=p-cookie.service.js.map