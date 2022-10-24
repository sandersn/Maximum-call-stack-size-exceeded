var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Subject } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SchedulingApiService, SchedulingApiShift } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { PCookieService } from '@plano/shared/core/p-cookie.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PRouterService } from '@plano/shared/core/router.service';
import { BookingsSortedByEmum } from './booking-list/booking-list.component';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../shared/core/null-type-utils';
let BookingsService = class BookingsService {
    constructor(pCookieService, localize, pRouterService, schedulingApiService) {
        this.pCookieService = pCookieService;
        this.localize = localize;
        this.pRouterService = pRouterService;
        this.schedulingApiService = schedulingApiService;
        this.queryParams = null;
        this.COOKIE_PREFIX = 'BookingsService';
        this._byShiftTime = null;
        this._searchString = '';
        this._searchAll = null;
        this._groupByCourses = null;
        this._showInquiry = null;
        // Properties that will not be stored into cookies
        this.previousRequest = null;
        /**
         * Observable being called whenever api data change.
         */
        this.onChange = new Subject();
        /**
         * Start timestamp. Used for the api request and date picker.
         */
        this.start = null;
        /**
         * End timestamp. Used for the api request and date picker.
         */
        this.end = null;
        this._sortedBy = BookingsSortedByEmum.DATE_OF_BOOKING;
        this._sortedReverse = false;
    }
    /**
     * Read all related cookies initially
     */
    readCookies() {
        const byShiftTimeCookie = this.pCookieService.get({
            prefix: this.COOKIE_PREFIX,
            name: 'byShiftTime',
        });
        if (byShiftTimeCookie !== undefined) {
            this.byShiftTime = byShiftTimeCookie === 'true';
        }
        const searchAllCookie = this.pCookieService.get({
            prefix: this.COOKIE_PREFIX,
            name: 'searchAll',
        });
        if (searchAllCookie !== undefined) {
            this.searchAll = searchAllCookie === 'true';
            this.previousRequest = this.searchString;
        }
        const groupByCoursesCookie = this.pCookieService.get({
            prefix: this.COOKIE_PREFIX,
            name: 'groupByCourses',
        });
        if (groupByCoursesCookie !== undefined) {
            this.groupByCourses = groupByCoursesCookie === 'true';
        }
        const showInquiryCookie = this.pCookieService.get({
            prefix: this.COOKIE_PREFIX,
            name: 'showInquiry',
        });
        if (showInquiryCookie !== undefined) {
            this.showInquiry = showInquiryCookie === 'true';
        }
    }
    /**
     * Init all necessary values for this class
     */
    initValues() {
        if (this._byShiftTime === null)
            this._byShiftTime = false;
        if (this._searchString === null)
            this._searchString = '';
        if (this._searchAll === null)
            this._searchAll = false;
        if (this._groupByCourses === null)
            this._groupByCourses = true;
        if (this._showInquiry === null)
            this._showInquiry = true;
    }
    /**
     * Defines if the urlParams bookingsStart and bookingsEnd should be applied to
     * bookings.dateOfBooking or the time of the course(s)
     */
    get byShiftTime() {
        return this._byShiftTime;
    }
    set byShiftTime(value) {
        this.pCookieService.put({ prefix: this.COOKIE_PREFIX, name: 'byShiftTime' }, value !== null && value !== void 0 ? value : '');
        this._byShiftTime = value;
        // bookingsService.groupByCourses=$event
        this.onChange.next();
    }
    /**
     * Should all bookings be searched, or only the bookings within the defined time range?
     */
    get searchAll() {
        return this._searchAll;
    }
    set searchAll(value) {
        this.pCookieService.put({ prefix: this.COOKIE_PREFIX, name: 'searchAll' }, value);
        this._searchAll = value;
        this.onChange.next();
    }
    /**
     * The string that the user typed in while searching for a booking.
     */
    get searchString() {
        return this._searchString;
    }
    set searchString(value) {
        this._searchString = value;
        this.onChange.next();
    }
    /**
     * If ui shows a list of bookings, how should they be sorted?
     */
    get sortedBy() {
        return this._sortedBy;
    }
    set sortedBy(input) {
        this._sortedBy = input;
        this.onChange.next();
    }
    /**
     * If ui shows a sorted list of bookings, how should they be sorted asc or dec?
     */
    get sortedReverse() {
        return this._sortedReverse;
    }
    set sortedReverse(input) {
        this._sortedReverse = input;
        this.onChange.next();
    }
    /**
     * Should bookings be grouped by courses in the ui?
     */
    get groupByCourses() {
        return this._groupByCourses;
    }
    set groupByCourses(value) {
        this.pCookieService.put({ prefix: this.COOKIE_PREFIX, name: 'groupByCourses' }, value);
        this._groupByCourses = value;
        this.onChange.next();
    }
    /**
     * Should inquiries be visible in the list of bookings?
     */
    get showInquiry() {
        return this._showInquiry;
    }
    set showInquiry(value) {
        this.pCookieService.put({ prefix: this.COOKIE_PREFIX, name: 'showInquiry' }, value);
        this._showInquiry = value;
        this.onChange.next();
    }
    /** @see PServiceInterface['unload'] */
    unload() {
        this.start = null;
        this.end = null;
        this._byShiftTime = null;
        this._searchString = null;
        this._searchAll = null;
        this._groupByCourses = null;
        this._showInquiry = null;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    attendedCheckboxTooltipContent(booking) {
        if (!this.attendedCheckboxDisabled(booking))
            return undefined;
        if (booking.attendedSetByPos)
            return this.localize.transform('Die Anwesenheit wurde automatisch bestätigt aufgrund eines Vermerks von der Kasse, dass die Person die fällige Gebühr am Tag des Termins an der Kasse entrichtet hat.');
        return this.localize.transform('Die Anwesenheit darfst du nur am Tag des Termins selbst bearbeiten. Wende dich bitte ansonsten an einen Admin.');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    attendedCheckboxDisabled(booking) {
        return booking.canWriteAttended === false && !booking.isNewItem();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    updateQueryParams() {
        // eslint-disable-next-line no-console
        if (Config.DEBUG && !this.start)
            console.error(`set ${this.start} first`);
        assumeDefinedToGetStrictNullChecksRunning(this.start, 'start');
        assumeDefinedToGetStrictNullChecksRunning(this.end, 'end');
        if (+this.start > +this.end) { // HACK: This should NEVER happen. see comments below
            // The backend would return an error and produce a throw if frontend does not.
            // I guess the bug must be related to the cookies. So as a hotfix i clear related cookies.
            this.start = null;
            this.end = null;
            this.byShiftTime = null;
            this.initValues();
            throw new Error('bookingsStart must be <= bookingsEnd');
        }
        this.queryParams = new HttpParams()
            .set('data', 'bookings')
            .set('start', (this.start).toString())
            .set('end', (this.end).toString());
        this.updateBookingRelatedQueryParams();
    }
    updateBookingRelatedQueryParams() {
        // don’t send bookingsByShiftTime if user wants to filter by time of booking
        if (this.byShiftTime) {
            assumeDefinedToGetStrictNullChecksRunning(this.queryParams, 'queryParams');
            this.queryParams = this.queryParams
                .set('bookingsByShiftTime', 'true');
        }
        // bookingSearchString
        assumeDefinedToGetStrictNullChecksRunning(this.queryParams, 'queryParams');
        if (this.searchString) {
            this.queryParams = this.queryParams
                .set('searchString', this.searchString);
        }
    }
    /**
     * Open the form for given booking
     */
    onEditBooking(id) {
        this.pRouterService.navigate([`/client/booking/${id.toString()}`]);
    }
    /**
     * Toggle the selected value(s) of the given shift(s)
     */
    toggleRelatedShiftsFn(bookingCourseSelector, shifts) {
        const relatedShifts = this.relatedShifts(bookingCourseSelector, shifts);
        assumeNonNull(relatedShifts);
        const relatedShiftsSelected = this.relatedShiftsSelected(bookingCourseSelector, shifts);
        for (const relatedShift of relatedShifts) {
            this.setShiftSelectedFn(relatedShift, !relatedShiftsSelected);
        }
        const firstSelectedShift = this.schedulingApiService.data.shifts.sortedBy('start', false).find(item => item.selected);
        if (firstSelectedShift && !firstSelectedShift.isNewItem())
            this.pRouterService.scrollToSelector(`#scroll-target-id-${firstSelectedShift.id.toPrettyString()}`, undefined, true, true, false);
    }
    /**
     * Check if (each) selected shift(s) selected state is true
     */
    relatedShiftsSelected(bookingCourseSelector, shifts) {
        const relatedShifts = this.relatedShifts(bookingCourseSelector, shifts);
        if (relatedShifts instanceof SchedulingApiShift) {
            return relatedShifts.selected;
        }
        if (!relatedShifts || !relatedShifts.length) {
            return false;
        }
        if (relatedShifts.some(shift => !shift.selected))
            return false;
        return true;
    }
    /**
     * Set the selected state of a shift
     */
    setShiftSelectedFn(shift, newValue) {
        if (newValue !== undefined) {
            shift.selected = newValue;
        }
        else {
            shift.selected = true;
        }
        if (shift.selected) {
            shift.animateShift();
        }
    }
    /**
     * @returns Returns all shifts related to this booking.
     */
    relatedShifts(bookingCourseSelector, shifts) {
        // If there are no shifts, then there is nothing we can search.
        if (!shifts.length)
            return [];
        // If there are no courseSelector, then we don’t know what to search for.
        if (!bookingCourseSelector)
            return [];
        // If this bookingCourseSelector has a shiftIndex it means we can get the searched shift the easy way.
        if (bookingCourseSelector.shiftIndex) {
            const shift = shifts.get(bookingCourseSelector);
            return shift ? [shift] : null;
        }
        const filteredItems = shifts.filterBy(shift => bookingCourseSelector.contains(shift.id));
        return filteredItems.iterable();
    }
    /**
     * open detail view of new booking
     */
    addBooking() {
        this.pRouterService.navigate(['/client/booking/']);
    }
};
BookingsService = __decorate([
    Injectable({ providedIn: 'root' }),
    __metadata("design:paramtypes", [typeof (_a = typeof PCookieService !== "undefined" && PCookieService) === "function" ? _a : Object, typeof (_b = typeof LocalizePipe !== "undefined" && LocalizePipe) === "function" ? _b : Object, typeof (_c = typeof PRouterService !== "undefined" && PRouterService) === "function" ? _c : Object, typeof (_d = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _d : Object])
], BookingsService);
export { BookingsService };
//# sourceMappingURL=bookings.service.js.map