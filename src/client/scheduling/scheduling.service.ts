import { Injectable, NgZone, Inject, LOCALE_ID } from '@angular/core';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { PServiceWithCookiesInterface} from '@plano/shared/core/p-cookie.service';
import { PCookieService } from '@plano/shared/core/p-cookie.service';
import { CalendarModes } from './calendar-modes';
import { AbstractSchedulingApiBasedPagesService } from './scheduling-api-based-pages.service';
import { BookingsService } from './shared/p-bookings/bookings.service';

@Injectable()
export class SchedulingService extends AbstractSchedulingApiBasedPagesService implements PServiceWithCookiesInterface {
	private _showDayAsList : boolean | null = null;
	private _showWeekAsList : boolean | null = null;
	private _wishPickerMode : boolean | null = null;
	private _earlyBirdMode : boolean | null = null;

	/**
	 * afterNavigationCallbacks can store callbacks that can be executed later when the api is loaded
	 */
	public override afterNavigationCallbacks : (() => void)[] = [];

	constructor(
		protected override readonly zone : NgZone,
		protected override readonly bookingsService : BookingsService,
		protected override readonly pCookieService : PCookieService,
		protected override readonly console : LogService,
		@Inject(LOCALE_ID) protected override readonly locale : PSupportedLocaleIds,
	) {
		super('calendar', zone, bookingsService, pCookieService, console, locale);
		this.readCookies();
		this.initValues();
	}

	/**
	 * Init all necessary default values for this class
	 */
	public override initValues() : void {
		super.initValues();

		if (this._wishPickerMode === null) this._wishPickerMode = false;
		if (this._earlyBirdMode === null) this._earlyBirdMode = false;
		if (this._showDayAsList === null) this._showDayAsList = false;
		if (this._showWeekAsList === null) this._showWeekAsList = true;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showDayAsList() : boolean {
		if (Config.IS_MOBILE || this._showDayAsList === null || this.urlParam!.calendarMode === CalendarModes.MONTH) {
			return true;
		}
		return this._showDayAsList;
	}
	public set showDayAsList(value : boolean) {
		this.pCookieService.put({name: 'showDayAsList', prefix: null}, value);
		this._showDayAsList = value;
		this.changed(undefined);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get showWeekAsList() : boolean {
		if (Config.IS_MOBILE || this._showWeekAsList === null || this.urlParam!.calendarMode === CalendarModes.MONTH) {
			return true;
		}
		return this._showWeekAsList;
	}
	public set showWeekAsList(value : boolean) {
		this.pCookieService.put({name: 'showWeekAsList', prefix: null}, value);
		this._showWeekAsList = value;
		this.changed(undefined);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get wishPickerMode() : boolean {
		return this._wishPickerMode!;
	}
	public set wishPickerMode(value : boolean) {
		// NOTE: don’t write wishPickerMode to cookies. https://drplano.atlassian.net/browse/PLANO-7903
		// this.cookie.put({name: 'wishPickerMode', prefix: null}, value);
		this._earlyBirdMode = false;
		this._wishPickerMode = value;
		this.changed(undefined);
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get earlyBirdMode() : boolean {
		return this._earlyBirdMode!;
	}
	public set earlyBirdMode(value : boolean) {
		// NOTE: don’t write earlyBirdMode to cookies. https://drplano.atlassian.net/browse/PLANO-7903
		// this.cookie.put({name: 'earlyBirdMode', prefix: null}, value);
		this._wishPickerMode = false;
		this._earlyBirdMode = value;
		this.changed(undefined);
	}

	/**
	 * Read values from cookies if available
	 */
	public override readCookies() : void {
		super.readCookies();

		if (this.pCookieService.has({name: 'showWeekAsList', prefix: null})) {
			this.showWeekAsList = this.pCookieService.get({name: 'showWeekAsList', prefix: null}) === 'true';
		}
		if (this.pCookieService.has({name: 'showDayAsList', prefix: null})) {
			this.showDayAsList = this.pCookieService.get({name: 'showDayAsList', prefix: null}) === 'true';
		}
		// NOTE: Don’t write wishPickerMode to cookies. https://drplano.atlassian.net/browse/PLANO-7903
		if (this.pCookieService.has({name: 'wishPickerMode', prefix: null})) {
			this.wishPickerMode = this.pCookieService.get({name: 'wishPickerMode', prefix: null}) === 'true';
		}
		// NOTE: Don’t write earlyBirdMode to cookies. https://drplano.atlassian.net/browse/PLANO-7903
		if (this.pCookieService.has({name: 'earlyBirdMode', prefix: null})) {
			this.earlyBirdMode = this.pCookieService.get({name: 'earlyBirdMode', prefix: null}) === 'true';
		}
	}

	/** @see PServiceInterface['unload'] */
	public override unload() : void {
		super.unload();
		this._showDayAsList = null;
		this._showWeekAsList = null;
		this._wishPickerMode = null;
		this._earlyBirdMode = null;
	}
}
