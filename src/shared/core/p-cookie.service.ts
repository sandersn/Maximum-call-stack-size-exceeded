import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';
import { MeService } from '@plano/shared/api';
import { PServiceInterface } from '@plano/shared/core/p-service.interface';
import { Config } from './config';
import { LogService } from './log.service';
import { PPushNotificationsServiceCookieKeyDataType } from './p-push-notifications.service.types';
import { ReportFilterServiceCookieKeyDataType } from '../../client/report/report-filter.service.types';
import { CourseFilterServiceCookieKeyDataType } from '../../client/scheduling/course-filter.service.types';
import { SchedulingApiBasedPagesCookieKeyDataType } from '../../client/scheduling/scheduling-api-based-pages.service.types';
import { SchedulingFilterServiceCookieKeyDataType } from '../../client/scheduling/scheduling-filter.service.types';
import { SchedulingServiceCookieKeyDataType } from '../../client/scheduling/scheduling.service.types';
import { BookingsCookieKeyDataType } from '../../client/scheduling/shared/p-bookings/bookings.types';
import { FilterServiceCookieKeyDataType } from '../../client/shared/filter.service.types';
import { PMomentService } from '../../client/shared/p-moment.service';
import { PShiftExchangeListServiceCookieKeyDataType } from '../../client/shared/p-shift-exchange/p-shift-exchange-list/p-shift-exchange-list.service.types';
import { CollapsedShiftmodelsServiceCookieKeyDataType } from '../../client/shared/p-sidebar/main-sidebar/collapsed-shiftmodel-parents.service.types';
import { LaunchDarklyCookieKeyDataType } from '../../client/shared/p-sidebar/main-sidebar/p-sidebar-desk/sidebar-desk.types';
import { SidebarMembersCookieKeyDataType } from '../../client/shared/p-sidebar/main-sidebar/p-sidebar-members/sidebar-members.types';
import { PSidebarServiceCookieKeyDataType } from '../../client/shared/p-sidebar/p-sidebar.types';
import { ShiftExchangesServiceCookieKeyDataType } from '../../client/shift-exchanges/shift-exchanges.service.types';

/**
 * Service to handle data in cookies.
 * Every Service that injects PCookieService needs to implement PServiceWithCookiesInterface
 */

export interface PServiceWithCookiesInterface extends PServiceInterface {

	/**
	 * Read values from cookies if available
	 * Make sure you don’t run initValues() before readCookies()
	 *
	 * Example:
	 *   public readCookies() : void {
	 *     if (this.pCookieService.has({name: 'someProperty', prefix: 'SomeService'})) {
	 *       this.someProperty = this.pCookieService.get({name: 'someProperty', prefix: 'SomeService'}) === 'true';
	 *     }
	 *   }
	 */
	readCookies() : void;
}

export type PCookieKeyDataType = (
	LaunchDarklyCookieKeyDataType |
	SidebarMembersCookieKeyDataType |
	BookingsCookieKeyDataType |
	PPushNotificationsServiceCookieKeyDataType |
	ShiftExchangesServiceCookieKeyDataType |
	PSidebarServiceCookieKeyDataType |
	ReportFilterServiceCookieKeyDataType |
	PShiftExchangeListServiceCookieKeyDataType |
	FilterServiceCookieKeyDataType |
	SchedulingApiBasedPagesCookieKeyDataType |
	CollapsedShiftmodelsServiceCookieKeyDataType |
	SchedulingServiceCookieKeyDataType |
	SchedulingFilterServiceCookieKeyDataType |
	CourseFilterServiceCookieKeyDataType
);
@Injectable({
	providedIn: 'root',
})
export class PCookieService {

	/**
	 * Cookie access is quite expensive so we cache them.
	 */
	private cache = new Map();

	constructor(
		private cookie : CookieService,
		private meService : MeService,
		private console ?: LogService,
	) {
	}

	private getCacheKey(cookieKeyData : PCookieKeyDataType) : string {
		return this.getCookieKey(cookieKeyData, false, false);
	}

	/**
	 * remove a cookie
	 */
	public remove(cookieKeyData : PCookieKeyDataType) : void {
		// update cookie
		this.cookie.delete(this.getCookieKey(cookieKeyData), '/');

		// update cache
		this.cache.delete(this.getCacheKey(cookieKeyData));
	}

	/**
	 * Set cookie based on provided information
	 */
	public put(cookieKeyData : PCookieKeyDataType, input : boolean | string | number | null, expiresAfterDays : number = 35600)
		: void {
		// don’t write cookies if they can not be personalized.
		if (!this.meService.isLoaded()) {
			this.console?.debug('Can not write cookies because meService is not loaded.');
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
	public get(cookieKeyData : PCookieKeyDataType) : string | undefined {
		// if possible return from cache
		const cacheKey = this.getCacheKey(cookieKeyData);

		if (this.cache.has(cacheKey))
			return this.cache.get(cacheKey);

		// don’t get cookies if they can not be personalized.
		if (!this.meService.isLoaded()) return undefined;

		const cookie = this.cookie.get(this.getCookieKey(cookieKeyData));
		return cookie !== '' ? cookie : undefined;
	}

	/**
	 * Return `true` if {@link Document} is accessible, otherwise return `false`
	 *
	 * @param name Cookie name
	 * @returns boolean - whether cookie with specified name exists
	 */
	public has(cookieKeyData : PCookieKeyDataType) : boolean | undefined {
		// don’t get cookies if they can not be personalized.
		if (!this.meService.isLoaded()) return undefined;

		return this.get(cookieKeyData) !== undefined;
	}

	private getCookieKey(cookieKeyData : PCookieKeyDataType, personalize : boolean = true, addDrpPrefix : boolean = true) : string {
		let result = cookieKeyData.prefix === null ? cookieKeyData.name : `${cookieKeyData.prefix}_${cookieKeyData.name}`;

		if (personalize) {
			if (!this.meService.isLoaded()) {
				this.console?.error('Cookies could not be personalized');
				return result;
			}

			result = `${this.meService.data.id.rawData.toString()}_${result}`;
		}

		if (addDrpPrefix) result = `drp_${result}`;
		return result;
	}

	/** @see PServiceInterface['unload'] */
	public unload() : void {
		this.cache = new Map();
	}

	/** Should the section be visible? */
	public sectionIsVisible(cookieKeyData : PCookieKeyDataType, defaultValue : boolean = true) : boolean {
		const cookieValue = this.get(cookieKeyData) ?? null;
		if (cookieValue === null) {
			this.put(cookieKeyData, defaultValue);
			return defaultValue;
		}
		return cookieValue === 'true';
	}

	/** Hide this section */
	public hideSection(cookieKeyData : PCookieKeyDataType) : void {
		this.put(cookieKeyData, false);
	}

	/** Un-hide this section */
	public showSection(cookieKeyData : PCookieKeyDataType) : void {
		this.put(cookieKeyData, true);
	}
}
