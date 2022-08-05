import { Subject } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SchedulingApiShifts, ShiftSelector } from '@plano/shared/api';
import { SchedulingApiService, SchedulingApiShift } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { PServiceWithCookiesInterface} from '@plano/shared/core/p-cookie.service';
import { PCookieService } from '@plano/shared/core/p-cookie.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { ScrollTarget } from '@plano/shared/core/router.service';
import { PRouterService } from '@plano/shared/core/router.service';
import { BookingsSortedByEmum } from './booking-list/booking-list.component';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../shared/core/null-type-utils';
import { SchedulingApiBooking } from '../api/scheduling-api-booking.service';

@Injectable({providedIn: 'root'})
export class BookingsService implements PServiceWithCookiesInterface {
	public queryParams : HttpParams | null = null;

	private readonly COOKIE_PREFIX = 'BookingsService';

	private _byShiftTime : boolean | null = null;
	private _searchString : string | null = '';
	private _searchAll : boolean | null = null;
	private _groupByCourses : boolean | null = null;
	private _showInquiry : boolean | null = null;

	// Properties that will not be stored into cookies
	public previousRequest : string | null = null;

	/**
	 * Observable being called whenever api data change.
	 */
	public onChange : Subject<void> = new Subject<void>();

	constructor(
		private pCookieService : PCookieService,
		private localize : LocalizePipe,
		private pRouterService : PRouterService,
		private schedulingApiService : SchedulingApiService,
	) {
	}

	/**
	 * Read all related cookies initially
	 */
	public readCookies() : void {
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
	public initValues() : void {
		if (this._byShiftTime === null) this._byShiftTime = false;
		if (this._searchString === null) this._searchString = '';
		if (this._searchAll === null) this._searchAll = false;
		if (this._groupByCourses === null) this._groupByCourses = true;
		if (this._showInquiry === null) this._showInquiry = true;
	}

	/**
	 * Start timestamp. Used for the api request and date picker.
	 */
	public start : number | null = null;

	/**
	 * End timestamp. Used for the api request and date picker.
	 */
	public end : number | null = null;

	/**
	 * Defines if the urlParams bookingsStart and bookingsEnd should be applied to
	 * bookings.dateOfBooking or the time of the course(s)
	 */
	public get byShiftTime() : boolean | null {
		return this._byShiftTime;
	}
	public set byShiftTime(value : boolean | null) {
		this.pCookieService.put({ prefix: this.COOKIE_PREFIX, name: 'byShiftTime' }, value ?? '');
		this._byShiftTime = value;
		// bookingsService.groupByCourses=$event
		this.onChange.next();
	}

	/**
	 * Should all bookings be searched, or only the bookings within the defined time range?
	 */
	public get searchAll() : boolean {
		return this._searchAll!;
	}
	public set searchAll(value : boolean) {
		this.pCookieService.put({ prefix: this.COOKIE_PREFIX, name: 'searchAll' }, value);
		this._searchAll = value;
		this.onChange.next();
	}

	/**
	 * The string that the user typed in while searching for a booking.
	 */
	public get searchString() : string | null {
		return this._searchString;
	}
	public set searchString(value : string | null) {
		this._searchString = value;
		this.onChange.next();
	}

	/**
	 * If ui shows a list of bookings, how should they be sorted?
	 */
	public get sortedBy() : BookingsSortedByEmum {
		return this._sortedBy;
	}

	public set sortedBy(input : BookingsSortedByEmum) {
		this._sortedBy = input;
		this.onChange.next();
	}

	private _sortedBy : BookingsSortedByEmum = BookingsSortedByEmum.DATE_OF_BOOKING;

	/**
	 * If ui shows a sorted list of bookings, how should they be sorted asc or dec?
	 */
	public get sortedReverse() : boolean {
		return this._sortedReverse;
	}

	public set sortedReverse(input : boolean) {
		this._sortedReverse = input;
		this.onChange.next();
	}

	private _sortedReverse : boolean = false;

	/**
	 * Should bookings be grouped by courses in the ui?
	 */
	public get groupByCourses() : boolean {
		return this._groupByCourses!;
	}
	public set groupByCourses(value : boolean) {
		this.pCookieService.put({ prefix: this.COOKIE_PREFIX, name: 'groupByCourses' }, value);
		this._groupByCourses = value;
		this.onChange.next();
	}

	/**
	 * Should inquiries be visible in the list of bookings?
	 */
	public get showInquiry() : boolean {
		return this._showInquiry!;
	}
	public set showInquiry(value : boolean) {
		this.pCookieService.put({ prefix: this.COOKIE_PREFIX, name: 'showInquiry' }, value);
		this._showInquiry = value;
		this.onChange.next();
	}

	/** @see PServiceInterface['unload'] */
	public unload() : void {
		this.start = null;
		this.end = null;
		this._byShiftTime = null;
		this._searchString = null;
		this._searchAll = null;
		this._groupByCourses = null;
		this._showInquiry = null;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public attendedCheckboxTooltipContent(booking : SchedulingApiBooking) : string | undefined {
		if (!this.attendedCheckboxDisabled(booking)) return undefined;
		if (booking.attendedSetByPos) return this.localize.transform('Die Anwesenheit wurde automatisch bestätigt aufgrund eines Vermerks von der Kasse, dass die Person die fällige Gebühr am Tag des Termins an der Kasse entrichtet hat.');
		return this.localize.transform('Die Anwesenheit darfst du nur am Tag des Termins selbst bearbeiten. Wende dich bitte ansonsten an einen Admin.');
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public attendedCheckboxDisabled(booking : SchedulingApiBooking) : boolean {
		return booking.canWriteAttended === false && !booking.isNewItem();
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public updateQueryParams() : void {
		// eslint-disable-next-line no-console
		if (Config.DEBUG && !this.start) console.error(`set ${this.start} first`);

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

	private updateBookingRelatedQueryParams() : void {
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
	public onEditBooking(id : Id) : void {
		this.pRouterService.navigate([`/client/booking/${id.toString()}`]);
	}

	/**
	 * Toggle the selected value(s) of the given shift(s)
	 */
	public toggleRelatedShiftsFn(bookingCourseSelector : ShiftSelector, shifts : SchedulingApiShifts) : void {
		const relatedShifts = this.relatedShifts(bookingCourseSelector, shifts);
		assumeNonNull(relatedShifts);
		const relatedShiftsSelected = this.relatedShiftsSelected(bookingCourseSelector, shifts);
		for (const relatedShift of relatedShifts) {
			this.setShiftSelectedFn(relatedShift, !relatedShiftsSelected);
		}

		const firstSelectedShift = this.schedulingApiService.data.shifts.sortedBy('start', false).find(item => item.selected);
		if (firstSelectedShift && !firstSelectedShift.isNewItem()) this.pRouterService.scrollToSelector(
			`#scroll-target-id-${firstSelectedShift.id.toPrettyString()}` as ScrollTarget,
			undefined,
			true,
			true,
			false,
		);
	}

	/**
	 * Check if (each) selected shift(s) selected state is true
	 */
	public relatedShiftsSelected(bookingCourseSelector : ShiftSelector, shifts : SchedulingApiShifts) : boolean {
		const relatedShifts = this.relatedShifts(bookingCourseSelector, shifts);

		if (relatedShifts instanceof SchedulingApiShift) {
			return relatedShifts.selected;
		}
		if (!relatedShifts || !relatedShifts.length) { return false; }
		if (relatedShifts.some(shift => !shift.selected)) return false;
		return true;
	}

	/**
	 * Set the selected state of a shift
	 */
	public setShiftSelectedFn(shift : SchedulingApiShift, newValue ?: boolean) : void {
		if (newValue !== undefined) {
			shift.selected = newValue;
		} else {
			shift.selected = true;
		}
		if (shift.selected) {
			shift.animateShift();
		}
	}

	/**
	 * @returns Returns all shifts related to this booking.
	 */
	public relatedShifts(bookingCourseSelector : ShiftSelector | null, shifts : SchedulingApiShifts) : SchedulingApiShift[] | null {
		// If there are no shifts, then there is nothing we can search.
		if (!shifts.length) return [];
		// If there are no courseSelector, then we don’t know what to search for.
		if (!bookingCourseSelector) return [];

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
	public addBooking() : void {
		this.pRouterService.navigate(['/client/booking/']);
	}
}
