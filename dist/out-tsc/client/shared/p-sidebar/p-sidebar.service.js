var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Config } from '@plano/shared/core/config';
import { PCookieService } from '@plano/shared/core/p-cookie.service';
import { SidebarTab } from './p-sidebar.types';
let PSidebarService = class PSidebarService {
    constructor(pCookieService, activatedRoute, location, router) {
        this.pCookieService = pCookieService;
        this.activatedRoute = activatedRoute;
        this.location = location;
        this.router = router;
        this._mainSidebarIsCollapsed = null;
        this.currentTab = null;
        this._isWorkloadMode = null;
        this._editMemberListItemsMode = null;
        this._editShiftModelListItemsMode = null;
        this._filterMembersModeActive = null;
        this._filterShiftModelsModeActive = null;
        this._memberSearchTerm = null;
        this._shiftModelSearchTerm = null;
        this.showWorkload = { 0: true, 1: true };
        // watch query params
        this.activatedRoute.queryParams.subscribe((inputQueryParams) => {
            // show members workload?
            if (inputQueryParams['showMembersWorkload'] !== 'true')
                return;
            // remove query params so reloading page does not trigger this again.
            // We use this.location which also removes the params from browsers history stack.
            const urlWithoutParams = this.router.url.split('?')[0];
            this.location.replaceState(urlWithoutParams);
            // show members workload
            this.currentTab = SidebarTab.MEMBERS;
            this.isWorkloadMode = true;
        });
    }
    /**
     * Init all necessary values for this class
     */
    initValues() {
        if (this.mainSidebarIsCollapsed === null)
            this.mainSidebarIsCollapsed = false;
        if (this.currentTab === null)
            this.currentTab = SidebarTab.DESK;
        if (this.isWorkloadMode === null)
            this.isWorkloadMode = false;
        if (this.editMemberListItemsMode === null)
            this.editMemberListItemsMode = false;
        if (this.editShiftModelListItemsMode === null)
            this.editShiftModelListItemsMode = false;
        if (this.filterMembersModeActive === null)
            this.filterMembersModeActive = false;
        if (this.filterShiftModelsModeActive === null)
            this.filterShiftModelsModeActive = false;
        if (this.memberSearchTerm === '')
            this.memberSearchTerm = '';
        if (this.shiftModelSearchTerm === null)
            this.shiftModelSearchTerm = '';
    }
    /**
     * Read values from cookies if available
     */
    readCookies() {
        if (this.mainSidebarIsCollapsed === null && this.pCookieService.has({ name: 'mainSidebarIsCollapsed', prefix: null })) {
            this.mainSidebarIsCollapsed = this.pCookieService.get({ name: 'mainSidebarIsCollapsed', prefix: null }) === 'true';
        }
        if (this.isWorkloadMode === null && this.pCookieService.has({ name: 'isWorkloadMode', prefix: null })) {
            this.isWorkloadMode = this.pCookieService.get({ name: 'isWorkloadMode', prefix: null }) === 'true';
        }
        if (this.editMemberListItemsMode === null && this.pCookieService.has({ name: 'editMemberListItemsMode', prefix: null })) {
            this.editMemberListItemsMode = this.pCookieService.get({ name: 'editMemberListItemsMode', prefix: null }) === 'true';
        }
        if (this.editShiftModelListItemsMode === null && this.pCookieService.has({ name: 'editShiftModelListItemsMode', prefix: null })) {
            this.editShiftModelListItemsMode = this.pCookieService.get({ name: 'editShiftModelListItemsMode', prefix: null }) === 'true';
        }
        if (this.filterMembersModeActive === null && this.pCookieService.has({ name: 'filterMembersModeActive', prefix: null })) {
            this.filterMembersModeActive = this.pCookieService.get({ name: 'filterMembersModeActive', prefix: null }) === 'true';
        }
        if (this.filterShiftModelsModeActive === null && this.pCookieService.has({ name: 'filterShiftModelsModeActive', prefix: null })) {
            this.filterShiftModelsModeActive = this.pCookieService.get({ name: 'filterShiftModelsModeActive', prefix: null }) === 'true';
        }
        if (this.memberSearchTerm === null && this.pCookieService.has({ name: 'memberSearchTerm', prefix: null })) {
            this.memberSearchTerm = this.pCookieService.get({ name: 'memberSearchTerm', prefix: null });
        }
        if (this.shiftModelSearchTerm === null && this.pCookieService.has({ name: 'shiftModelSearchTerm', prefix: null })) {
            this.shiftModelSearchTerm = this.pCookieService.get({ name: 'shiftModelSearchTerm', prefix: null });
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get mainSidebarIsCollapsed() {
        if (Config.IS_MOBILE)
            return true;
        return this._mainSidebarIsCollapsed;
    }
    set mainSidebarIsCollapsed(value) {
        this.pCookieService.put({ name: 'mainSidebarIsCollapsed', prefix: null }, value !== null && value !== void 0 ? value : false);
        this._mainSidebarIsCollapsed = value;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isWorkloadMode() {
        return this._isWorkloadMode;
    }
    set isWorkloadMode(value) {
        this.pCookieService.put({ name: 'isWorkloadMode', prefix: null }, value !== null && value !== void 0 ? value : false);
        this._isWorkloadMode = value;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get editMemberListItemsMode() {
        return this._editMemberListItemsMode;
    }
    set editMemberListItemsMode(value) {
        this.pCookieService.put({ name: 'editMemberListItemsMode', prefix: null }, value !== null && value !== void 0 ? value : false);
        this._editMemberListItemsMode = value;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get editShiftModelListItemsMode() {
        return this._editShiftModelListItemsMode;
    }
    set editShiftModelListItemsMode(value) {
        this.pCookieService.put({ name: 'editShiftModelListItemsMode', prefix: null }, value !== null && value !== void 0 ? value : false);
        this._editShiftModelListItemsMode = value;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get filterMembersModeActive() {
        return this._filterMembersModeActive;
    }
    set filterMembersModeActive(value) {
        this.pCookieService.put({ name: 'filterMembersModeActive', prefix: null }, value !== null && value !== void 0 ? value : false);
        this._filterMembersModeActive = value;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get filterShiftModelsModeActive() {
        return this._filterShiftModelsModeActive;
    }
    set filterShiftModelsModeActive(value) {
        this.pCookieService.put({ name: 'filterShiftModelsModeActive', prefix: null }, value !== null && value !== void 0 ? value : false);
        this._filterShiftModelsModeActive = value;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get memberSearchTerm() {
        return this._memberSearchTerm;
    }
    set memberSearchTerm(value) {
        this.pCookieService.put({ name: 'memberSearchTerm', prefix: null }, value !== null && value !== void 0 ? value : '');
        this._memberSearchTerm = value;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftModelSearchTerm() {
        var _a;
        return (_a = this._shiftModelSearchTerm) !== null && _a !== void 0 ? _a : '';
    }
    set shiftModelSearchTerm(value) {
        this.pCookieService.put({ name: 'shiftModelSearchTerm', prefix: null }, value !== null && value !== void 0 ? value : '');
        this._shiftModelSearchTerm = value;
    }
    /** @see PServiceInterface['unload'] */
    unload() {
        this._mainSidebarIsCollapsed = null;
        this.currentTab = null;
        this._isWorkloadMode = null;
        this._editMemberListItemsMode = null;
        this._editShiftModelListItemsMode = null;
        this._filterMembersModeActive = null;
        this._filterShiftModelsModeActive = null;
        this._memberSearchTerm = null;
        this._shiftModelSearchTerm = null;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        this.showWorkload = { 0: true, 1: true };
    }
};
PSidebarService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [PCookieService, typeof (_a = typeof ActivatedRoute !== "undefined" && ActivatedRoute) === "function" ? _a : Object, typeof (_b = typeof Location !== "undefined" && Location) === "function" ? _b : Object, typeof (_c = typeof Router !== "undefined" && Router) === "function" ? _c : Object])
], PSidebarService);
export { PSidebarService };
//# sourceMappingURL=p-sidebar.service.js.map