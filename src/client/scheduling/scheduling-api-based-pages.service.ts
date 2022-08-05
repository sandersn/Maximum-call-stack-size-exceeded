import { Subject } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { NgZone } from '@angular/core';
import { Params } from '@angular/router';
import { BookingsService } from '@plano/client/scheduling/shared/p-bookings/bookings.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '@plano/shared/core/config';
import { DataInput } from '@plano/shared/core/data/data-input';
import { LogService } from '@plano/shared/core/log.service';
import { PCookieService, PServiceWithCookiesInterface } from '@plano/shared/core/p-cookie.service';
import { PUrlParamsServiceInterface } from '@plano/shared/core/p-service.interface';
import { CalendarModes } from './calendar-modes';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../shared/core/null-type-utils';

export type DetailObjectType = 'shift' | 'shiftModel' | 'member';

class UrlParam extends DataInput implements PServiceWithCookiesInterface {
	constructor(
		protected override readonly zone : NgZone,
		protected readonly pCookieService : PCookieService,
		private console : LogService,
		private locale : PSupportedLocaleIds,
	) {
		super(zone);
	}

	private _calendarMode : CalendarModes | null = null;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get calendarMode() : CalendarModes | null {
		return this._calendarMode;
	}
	public set calendarMode(value : CalendarModes | null) {
		this.pCookieService.put({name: 'calendarMode', prefix: 'schedulingApiBasedPages'}, value);
		this._calendarMode = value;
		this.changed(undefined);
	}

	private _date : number | null = null;
	public set date(date : number | null) {
		const pMoment = new PMomentService(this.locale, this.console);
		const newValue = +pMoment.m(date ?? undefined).startOf('day');

		// ensure this.urlParam!.date is start of day
		this.pCookieService.put({name: 'date', prefix: 'schedulingApiBasedPages'}, newValue, 1);
		this._date = newValue;
		this.changed(undefined);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get date() : number | null {
		return this._date!;
	}

	public detailObject : DetailObjectType | null = null;
	public detailObjectId : number | null = null;

	/**
	 * Read values from cookies if available
	 */
	public readCookies() : void {
		// get current calendar mode
		if (this.pCookieService.has({name: 'calendarMode', prefix: 'schedulingApiBasedPages'})) {
			this.calendarMode = this.pCookieService.get({name: 'calendarMode', prefix: 'schedulingApiBasedPages'}) as CalendarModes;
		}
		if (this.pCookieService.has({name: 'date', prefix: 'schedulingApiBasedPages'})) {
			const schedulingApiBasedPagesDateValue = this.pCookieService.get({name: 'date', prefix: 'schedulingApiBasedPages'});
			assumeDefinedToGetStrictNullChecksRunning(schedulingApiBasedPagesDateValue, 'schedulingApiBasedPagesDateValue');
			this.date = +schedulingApiBasedPagesDateValue;
		}
	}

	/**
	 * Set some default values for properties that are not defined yet
	 */
	public initValues() : void {
		const pMoment = new PMomentService(this.locale, this.console);

		const currentMoment = pMoment.m();
		if (this._date === null) this._date = +currentMoment.startOf('day');
	}

	/**
	 * Takes params from this.route.snapshot.params and writes them to the related property of service.urlParam
	 */
	public writeUrlParamsToService(params : Params | null) : void {
		if (!params || JSON.stringify(params) === JSON.stringify({}) && Config.APPLICATION_MODE !== 'TEST') throw new Error('no params available');
		if (!params['date']) this.console.error('no date available');

		// Ignore params when being redirected to default route
		if (params['date'] !== '0') {
			if (params['calendarMode']) {
				this.calendarMode = params['calendarMode'];
			}
			if (params['date'] && params['date'] !== this.date) {
				this.date = +params['date'];
			}
		}

		if (params['detailObject'] !== this.detailObject) {
			if (params['detailObject']) {
				this.detailObject = params['detailObject'];
			} else {
				this.detailObject = null;
			}
			this.changed(undefined);
		}

		this.updateDetailObjectId(params);
	}

	private updateDetailObjectId(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		params : {[key : string] : any},
	) : void {
		if (params['detailObjectId'] === this.detailObjectId) return;

		if (params['detailObjectId']) {
			this.detailObjectId = Number.parseInt(params['detailObjectId'], 10);
		} else {
			this.detailObjectId = null;
		}
	}

	/** @see PServiceInterface['unload'] */
	public unload() : void {
		this._calendarMode = null;
		this._date = null;
		this.detailObject = null;
		this.detailObjectId = null;
	}

}

export type PossibleApiLoadDataValues = 'calendar' | 'shift-exchange' | 'reporting' | 'notifications' | 'bookings' | 'vouchers' | 'transactions' | 'bookingSystemSettings';

export abstract class AbstractSchedulingApiBasedPagesService extends DataInput
	implements PServiceWithCookiesInterface, PUrlParamsServiceInterface {
	public queryParams : HttpParams | null = null;
	public dataParam : PossibleApiLoadDataValues | null = null;

	/**
	 * afterNavigationCallbacks can store callbacks that can be executed later when the api is loaded
	 */
	public afterNavigationCallbacks : (() => void)[] = [];

	public urlParam : UrlParam | null = null;

	public schedulingApiHasBeenLoadedOnSchedulingComponent : Subject<void> = new Subject<void>();

	constructor(
		protected readonly dataParamInput : PossibleApiLoadDataValues,
		protected override readonly zone : NgZone,
		protected readonly bookingsService : BookingsService,
		protected readonly pCookieService : PCookieService,
		protected readonly console : LogService,
		protected readonly locale : PSupportedLocaleIds,
	) {
		super(zone);
		this.urlParam = new UrlParam(zone, pCookieService, console, locale);
		this.dataParam = dataParamInput;
		this.urlParam.onChange.subscribe(() => {
			this.changed(undefined);
		});
	}

	/**
	 * Read values from cookies if available
	 */
	public readCookies() : void {
		this.urlParam!.readCookies();
	}

	/**
	 * Init all necessary values for this class
	 */
	public initValues() : void {
		this.urlParam!.initValues();
	}

	/**
	 * Start timestamp of current calendarMode
	 * Examples:
	 * If calenderMode is 'week' then shiftsStart is timestamp of 'start of week'
	 * If calenderMode is 'month' then shiftsStart is timestamp of 'start of first week of month'
	 */
	public get shiftsStart() : number {
		const pMoment = new PMomentService(this.locale, this.console);
		const dateAsMoment = pMoment.m(this.urlParam!.date ?? undefined);
		if (Config.DEBUG && Config.APPLICATION_MODE !== 'TEST' && !this.urlParam!.calendarMode) {
			// eslint-disable-next-line no-console
			console.debug('calendarMode should be set here. »day« will be set as default.');
		}
		const firstDay = dateAsMoment.startOf(this.urlParam!.calendarMode ?? 'day');
		return +firstDay;
	}

	/**
	 * End timestamp of current calendarMode
	 * e.g. if .calenderMode is 'month' and .date is 21.07. then shiftsEnd is timestamp of last millisecond of 31.07.
	 */
	public get shiftsEnd() : number {
		const pMoment = new PMomentService(this.locale, this.console);
		const dateAsMoment = pMoment.m(this.urlParam!.date ?? undefined);
		if (Config.DEBUG && Config.APPLICATION_MODE !== 'TEST' && !this.urlParam!.calendarMode) {
			// eslint-disable-next-line no-console
			console.debug('calendarMode should be set here. »day« will be set as default.');
		}
		const firstDay = dateAsMoment.endOf(this.urlParam!.calendarMode ?? 'day');
		return +firstDay;
	}

	/**
	 * update queryParam values based on urlParam, bookingsService etc.
	 */
	public updateQueryParams(_skipBookings ?: boolean) : void {
		// eslint-disable-next-line no-console
		if (Config.DEBUG && this.urlParam!.date === 0) console.error(`set ${this.urlParam!.date} first`);

		assumeDefinedToGetStrictNullChecksRunning(this.dataParam, 'this.dataParam');
		this.queryParams = new HttpParams()
			.set('data', this.dataParam)
			.set('start', (this.shiftsStart).toString())
			.set('end', (this.shiftsEnd).toString());

		// if (!skipBookings) this.updateBookingRelatedQueryParams();
	}

	/**
	 * Takes params from this.route.snapshot.params and writes them to the related property of service.urlParam
	 */
	public writeUrlParamsToService(params : Parameters<UrlParam['writeUrlParamsToService']>[0]) : void {
		this.urlParam!.writeUrlParamsToService(params);
	}

	/** @see PServiceInterface['unload'] */
	public unload() : void {
		this.urlParam!.unload();
	}
}
