import { Injectable, NgZone } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { DataInput } from '@plano/shared/core/data/data-input';
import { PServiceWithCookiesInterface} from '@plano/shared/core/p-cookie.service';
import { PCookieService } from '@plano/shared/core/p-cookie.service';
import { SchedulingApiWorkingTime } from '../scheduling/shared/api/scheduling-api-working-time.service';
import { SchedulingApiAbsence } from '../scheduling/shared/api/scheduling-api.service';
import { FilterServiceInterface } from '../shared/filter.service';

@Injectable()
export class ReportFilterService extends DataInput
	implements OnDestroy, PServiceWithCookiesInterface, FilterServiceInterface {
	private _showWorkingTimes : boolean | null = null;
	private _showWorkingTimesForecast : boolean | null = null;
	private _showAbsences : boolean | null = null;
	private _showUnpaidAbsences : boolean | null = null;
	private _showUsersWithoutEntries : boolean | null = null;

	constructor(
		private pCookieService : PCookieService,
		protected override zone : NgZone,
	) {
		super(zone);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showAbsences() : boolean {
		return this._showAbsences!;
	}
	public set showAbsences(value : boolean) {
		this.pCookieService.put({name: 'showAbsences', prefix: null}, value);
		if (!value) this.showUnpaidAbsences = false;
		this._showAbsences = value;
		this.changed(undefined);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showUnpaidAbsences() : boolean {
		return this._showUnpaidAbsences!;
	}
	public set showUnpaidAbsences(value : boolean) {
		this.pCookieService.put({name: 'showUnpaidAbsences', prefix: null}, value);
		this._showUnpaidAbsences = value;
		this.changed(undefined);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showUsersWithoutEntries() : boolean {
		return this._showUsersWithoutEntries!;
	}
	public set showUsersWithoutEntries(value : boolean) {
		this.pCookieService.put({name: 'showUsersWithoutEntries', prefix: null}, value);
		this._showUsersWithoutEntries = value;
		this.changed(undefined);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showWorkingTimes() : boolean {
		return this._showWorkingTimes!;
	}
	public set showWorkingTimes(value : boolean) {
		this.pCookieService.put({name: 'showWorkingTimes', prefix: null}, value);
		if (!value) this.showWorkingTimesForecast = false;
		this._showWorkingTimes = value;
		this.changed(undefined);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showWorkingTimesForecast() : boolean {
		return this._showWorkingTimesForecast!;
	}
	public set showWorkingTimesForecast(value : boolean) {
		this.pCookieService.put({name: 'showWorkingTimesForecast', prefix: null}, value);
		this._showWorkingTimesForecast = value;
		this.changed(undefined);
	}

	/**
	 * Read values from cookies if available
	 */
	public readCookies() : void {
		if (this.pCookieService.has({name: 'showWorkingTimes', prefix: null})) {
			this.showWorkingTimes = this.pCookieService.get({name: 'showWorkingTimes', prefix: null}) === 'true';
		}
		if (this.pCookieService.has({name: 'showWorkingTimesForecast', prefix: null})) {
			this.showWorkingTimesForecast = this.pCookieService.get({name: 'showWorkingTimesForecast', prefix: null}) === 'true';
		}
		if (this.pCookieService.has({name: 'showUsersWithoutEntries', prefix: null})) {
			this.showUsersWithoutEntries = this.pCookieService.get({name: 'showUsersWithoutEntries', prefix: null}) === 'true';
		}
		if (this.pCookieService.has({name: 'showAbsences', prefix: null})) {
			this.showAbsences = this.pCookieService.get({name: 'showAbsences', prefix: null}) === 'true';
		}
		if (this.pCookieService.has({name: 'showUnpaidAbsences', prefix: null})) {
			this.showUnpaidAbsences = this.pCookieService.get({name: 'showUnpaidAbsences', prefix: null}) === 'true';
		}
	}

	/**
	 * Init all necessary values for this class
	 */
	public initValues() : void {
		if (this._showWorkingTimes === null) this._showWorkingTimes = true;
		if (this._showWorkingTimesForecast === null) this._showWorkingTimesForecast = true;
		if (this._showAbsences === null) this._showAbsences = true;
		if (this._showUnpaidAbsences === null) this._showUnpaidAbsences = true;
		if (this._showUsersWithoutEntries === null) this._showUsersWithoutEntries = true;
	}

	public ngOnDestroy() : void {
		this.unload();
	}

	/**
	 * Clear all stored values of this service
	 */
	public unload() : void {
		this.unloadFilters();
	}

	/**
	 * Reset all filters to default
	 */
	public unloadFilters() : void {
		this._showWorkingTimes = null;
		this._showWorkingTimesForecast = null;
		this._showAbsences = null;
		this._showUnpaidAbsences = null;
		this._showUsersWithoutEntries = null;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public isVisible(input : SchedulingApiAbsence | SchedulingApiWorkingTime) : boolean {
		if (input instanceof SchedulingApiAbsence) {
			return this.isVisibleAbsence(input);
		}
		if (input instanceof SchedulingApiWorkingTime) {
			return this.isVisibleWorkingtime(input);
		}
		throw new Error('unexpected instance of input');
	}

	private isVisibleAbsence(input : SchedulingApiAbsence) : boolean {
		if (!this.showAbsences) return false;

		// Is this a paid absence?
		if (input.hourlyEarnings) return true;

		// User wants to see absences even if unpaid?
		if (this.showUnpaidAbsences && !input.hourlyEarnings) return true;

		return false;
	}

	private isVisibleWorkingtime(input : SchedulingApiWorkingTime) : boolean {
		if (!this.showWorkingTimes) return false;

		// Is this a paid absence?
		if (!input.isExpectedWorkingTime) return true;

		// User wants to see absences even if unpaid?
		if (this.showWorkingTimesForecast) return true;

		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isSetToShowAll() : boolean {
		if (!this.showAbsences) return false;
		if (!this.showUnpaidAbsences) return false;
		if (!this.showUsersWithoutEntries) return false;
		if (!this.showWorkingTimes) return false;
		if (!this.showWorkingTimesForecast) return false;
		return true;
	}

}
