import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MeService } from '@plano/shared/api';
import { PServiceWithCookiesInterface} from '@plano/shared/core/p-cookie.service';
import { PCookieService } from '@plano/shared/core/p-cookie.service';
import { assumeNonNull } from '../../shared/core/null-type-utils';

type UrlParamType = {
	start : number | null;
	end : number | null;
};

@Injectable()
export class ShiftExchangesService implements PServiceWithCookiesInterface {
	public defineCustomDateRange : boolean = false;

	public queryParams : HttpParams | null = null;

	public urlParam : UrlParamType | null = { start: null, end: null };

	constructor(
		private meService : MeService,
		private pCookieService : PCookieService,
	) {
		this.meService.isLoaded(() => {
			this.readCookies();
			this.initValues();
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get start() : number | null {
		assumeNonNull(this.urlParam);
		return this.urlParam.start;
	}
	public set start(value : number | null) {
		this.pCookieService.put({name: 'start', prefix: 'ShiftExchangesService'}, value);
		assumeNonNull(this.urlParam);
		this.urlParam.start = value;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get end() : number | null {
		assumeNonNull(this.urlParam);
		return this.urlParam.end;
	}
	public set end(value : number | null) {
		this.pCookieService.put({name: 'end', prefix: 'ShiftExchangesService'}, value);
		assumeNonNull(this.urlParam);
		this.urlParam.end = value;
	}

	/**
	 * Read values from cookies if available
	 */
	public readCookies() : void {
		const startCookie = this.pCookieService.get({name: 'start', prefix: 'ShiftExchangesService'});
		if (startCookie !== undefined) {
			assumeNonNull(this.urlParam);
			this.urlParam.start = !Number.isNaN(+startCookie) ? +startCookie : null;
		}
		const endCookie = this.pCookieService.get({name: 'end', prefix: 'ShiftExchangesService'});
		if (endCookie !== undefined) {
			assumeNonNull(this.urlParam);
			this.urlParam.end = !Number.isNaN(+endCookie) ? +endCookie : null;
		}
		const defineCustomDateRangeCookie = this.pCookieService.get({name: 'defineCustomDateRange', prefix: 'ShiftExchangesService'});
		if (defineCustomDateRangeCookie !== undefined) {
			this.defineCustomDateRange = defineCustomDateRangeCookie === 'true';
		}
	}

	/**
	 * Init all necessary values for this class
	 */
	public initValues() : void {
		if (!this.urlParam) this.urlParam = { start: null, end: null };
		// if (!this.urlParam.end) this.urlParam.end = undefined;
	}

	/**
	 * update queryParam values based on urlParam, bookingsService etc.
	 */
	public updateQueryParams() : void {
		// if (!this.urlParam.start) throw new Error('urlParam.start is undefined');
		this.queryParams = new HttpParams()
			.set('data', 'shiftExchange')
			.set('returnExpectedWorkingTimes', 'true');
		assumeNonNull(this.urlParam);
		if (this.urlParam.start !== null) {
			this.queryParams = this.queryParams.set('start', `${this.urlParam.start}`);
		} else {
			this.queryParams = this.queryParams.set('start', `${0}`);
		}
		if (this.urlParam.end !== null) {
			this.queryParams = this.queryParams.set('end', `${this.urlParam.end}`);
		} else if (this.urlParam.start) {

			/** Set timestamp to 'nearly infinite' */
			this.queryParams = this.queryParams.set('end', `${9999999999999}`);
		}
	}

	/**
	 * Write url params to service params if possible
	 */
	public writeUrlParamsToService(params : {
		start : number,
		end : number,
		[key : string] : unknown,
	}) : void {
		assumeNonNull(this.urlParam);
		if (params['start'] && params['start'] !== this.urlParam.start) {
			this.urlParam.start = +params['start'];
		}
		if (params['end'] && params['end'] !== this.urlParam.end) {
			this.urlParam.end = +params['end'];
		}
	}

	/** @see PServiceInterface['unload'] */
	public unload() : void {
		this.queryParams =  null;
		this.urlParam = null;
	}
}
