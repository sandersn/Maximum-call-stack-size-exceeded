var _a, _b, _c, _d, _e;
import { __decorate, __metadata, __param } from "tslib";
import { Injectable, NgZone, Inject, LOCALE_ID } from '@angular/core';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { PCookieService } from '@plano/shared/core/p-cookie.service';
import { CalendarModes } from './calendar-modes';
import { AbstractSchedulingApiBasedPagesService } from './scheduling-api-based-pages.service';
import { BookingsService } from './shared/p-bookings/bookings.service';
let SchedulingService = class SchedulingService extends AbstractSchedulingApiBasedPagesService {
    constructor(zone, bookingsService, pCookieService, console, locale) {
        super('calendar', zone, bookingsService, pCookieService, console, locale);
        this.zone = zone;
        this.bookingsService = bookingsService;
        this.pCookieService = pCookieService;
        this.console = console;
        this.locale = locale;
        this._showDayAsList = null;
        this._showWeekAsList = null;
        this._wishPickerMode = null;
        this._earlyBirdMode = null;
        /**
         * afterNavigationCallbacks can store callbacks that can be executed later when the api is loaded
         */
        this.afterNavigationCallbacks = [];
        this.readCookies();
        this.initValues();
    }
    /**
     * Init all necessary default values for this class
     */
    initValues() {
        super.initValues();
        if (this._wishPickerMode === null)
            this._wishPickerMode = false;
        if (this._earlyBirdMode === null)
            this._earlyBirdMode = false;
        if (this._showDayAsList === null)
            this._showDayAsList = false;
        if (this._showWeekAsList === null)
            this._showWeekAsList = true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showDayAsList() {
        if (Config.IS_MOBILE || this._showDayAsList === null || this.urlParam.calendarMode === CalendarModes.MONTH) {
            return true;
        }
        return this._showDayAsList;
    }
    set showDayAsList(value) {
        this.pCookieService.put({ name: 'showDayAsList', prefix: null }, value);
        this._showDayAsList = value;
        this.changed(undefined);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showWeekAsList() {
        if (Config.IS_MOBILE || this._showWeekAsList === null || this.urlParam.calendarMode === CalendarModes.MONTH) {
            return true;
        }
        return this._showWeekAsList;
    }
    set showWeekAsList(value) {
        this.pCookieService.put({ name: 'showWeekAsList', prefix: null }, value);
        this._showWeekAsList = value;
        this.changed(undefined);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get wishPickerMode() {
        return this._wishPickerMode;
    }
    set wishPickerMode(value) {
        // NOTE: don’t write wishPickerMode to cookies. https://drplano.atlassian.net/browse/PLANO-7903
        // this.cookie.put({name: 'wishPickerMode', prefix: null}, value);
        this._earlyBirdMode = false;
        this._wishPickerMode = value;
        this.changed(undefined);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get earlyBirdMode() {
        return this._earlyBirdMode;
    }
    set earlyBirdMode(value) {
        // NOTE: don’t write earlyBirdMode to cookies. https://drplano.atlassian.net/browse/PLANO-7903
        // this.cookie.put({name: 'earlyBirdMode', prefix: null}, value);
        this._wishPickerMode = false;
        this._earlyBirdMode = value;
        this.changed(undefined);
    }
    /**
     * Read values from cookies if available
     */
    readCookies() {
        super.readCookies();
        if (this.pCookieService.has({ name: 'showWeekAsList', prefix: null })) {
            this.showWeekAsList = this.pCookieService.get({ name: 'showWeekAsList', prefix: null }) === 'true';
        }
        if (this.pCookieService.has({ name: 'showDayAsList', prefix: null })) {
            this.showDayAsList = this.pCookieService.get({ name: 'showDayAsList', prefix: null }) === 'true';
        }
        // NOTE: Don’t write wishPickerMode to cookies. https://drplano.atlassian.net/browse/PLANO-7903
        if (this.pCookieService.has({ name: 'wishPickerMode', prefix: null })) {
            this.wishPickerMode = this.pCookieService.get({ name: 'wishPickerMode', prefix: null }) === 'true';
        }
        // NOTE: Don’t write earlyBirdMode to cookies. https://drplano.atlassian.net/browse/PLANO-7903
        if (this.pCookieService.has({ name: 'earlyBirdMode', prefix: null })) {
            this.earlyBirdMode = this.pCookieService.get({ name: 'earlyBirdMode', prefix: null }) === 'true';
        }
    }
    /** @see PServiceInterface['unload'] */
    unload() {
        super.unload();
        this._showDayAsList = null;
        this._showWeekAsList = null;
        this._wishPickerMode = null;
        this._earlyBirdMode = null;
    }
};
SchedulingService = __decorate([
    Injectable(),
    __param(4, Inject(LOCALE_ID)),
    __metadata("design:paramtypes", [typeof (_a = typeof NgZone !== "undefined" && NgZone) === "function" ? _a : Object, typeof (_b = typeof BookingsService !== "undefined" && BookingsService) === "function" ? _b : Object, typeof (_c = typeof PCookieService !== "undefined" && PCookieService) === "function" ? _c : Object, typeof (_d = typeof LogService !== "undefined" && LogService) === "function" ? _d : Object, typeof (_e = typeof PSupportedLocaleIds !== "undefined" && PSupportedLocaleIds) === "function" ? _e : Object])
], SchedulingService);
export { SchedulingService };
//# sourceMappingURL=scheduling.service.js.map