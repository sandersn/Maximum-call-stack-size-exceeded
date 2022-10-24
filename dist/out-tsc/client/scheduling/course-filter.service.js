var _a;
import { __decorate, __metadata } from "tslib";
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { PCookieService } from '@plano/shared/core/p-cookie.service';
// import { SchedulingApiService } from '@plano/shared/api';
let CourseFilterService = class CourseFilterService {
    constructor(pCookieService) {
        this.pCookieService = pCookieService;
        this._courseVisible = null;
        this._bookingsVisible = null;
        this.onChange = new Subject();
    }
    /**
     * Init all necessary values for this class
     */
    initValues() {
        if (this.bookingsVisible === null)
            this.bookingsVisible = false;
        if (this.courseVisible === null)
            this.courseVisible = true;
    }
    /**
     * Read values from cookies if available
     */
    readCookies() {
        if (this.pCookieService.has({ name: 'bookingsVisible', prefix: null })) {
            this.bookingsVisible = this.pCookieService.get({ name: 'bookingsVisible', prefix: null }) === 'true';
        }
        if (this.pCookieService.has({ name: 'courseVisible', prefix: null })) {
            this.courseVisible = this.pCookieService.get({ name: 'courseVisible', prefix: null }) === 'true';
        }
    }
    // TODO: obsolete?
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get bookingsVisible() {
        return this._bookingsVisible;
    }
    set bookingsVisible(value) {
        this.pCookieService.put({ name: 'bookingsVisible', prefix: null }, value);
        this._bookingsVisible = value;
        this.onChange.next();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get courseVisible() {
        return this._courseVisible;
    }
    set courseVisible(value) {
        this.pCookieService.put({ name: 'courseVisible', prefix: null }, value);
        this._courseVisible = value;
        this.onChange.next();
    }
    /** @see PServiceInterface['unload'] */
    unload() {
        this._bookingsVisible = null;
        this._courseVisible = null;
    }
};
CourseFilterService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof PCookieService !== "undefined" && PCookieService) === "function" ? _a : Object])
], CourseFilterService);
export { CourseFilterService };
//# sourceMappingURL=course-filter.service.js.map