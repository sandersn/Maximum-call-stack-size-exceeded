import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { LogService } from '@plano/shared/core/log.service';
import { PUrlParamsServiceInterface } from '@plano/shared/core/p-service.interface';

// class ReportUrlParam implements PServiceWithCookiesInterface {
// 	constructor(
// 		protected readonly pCookieService : PCookieService,
// 	) {
// 	}
//
// 	public _start : number | null = null;
// 	public get start() : number {
// 		return this._start;
// 	}
// 	public set start(value : number) {
// 		this.pCookieService.put({name: 'start', prefix: 'reportUrlParam'}, value);
// 		this._start = value;
// 	}
//
// 	public _end : number | null = null;
// 	public get end() : number {
// 		return this._end;
// 	}
// 	public set end(value : number) {
// 		this.pCookieService.put({name: 'end', prefix: 'reportUrlParam'}, value);
// 		this._end = value;
// 	}
//
// 	// TODO: do it like in schedulingService
// }

@Injectable()
export class ReportUrlParamsService implements PUrlParamsServiceInterface {
	public queryParams : HttpParams | null = null;

	public urlParam : {
		start ?: number;
		end ?: number;
	} = {};

	constructor(
		private pMoment : PMomentService,
		private console : LogService,
	) {
		this.initValues();
	}

	/**
	 * Init all necessary values for this class
	 */
	public initValues() : void {
		// NOTE: Do not set defaults for start and end. They need to be undefined in order to
		// trigger ReportComponent.defaultStart
		// if (!this.urlParam.start) this.urlParam.start = +this.pMoment.m().add(1, 'day').startOf('day').subtract(1, 'month');
		// if (!this.urlParam.end) this.urlParam.end = +this.pMoment.m().add(1, 'day').startOf('day');

	}

	private setInitialDataIfNecessary() : void {
		// TODO: Remove this hack
		// HACK: This should not be necessary. Usually Report component handles the initial data. Problem is e.g. when
		// someone reloads the absence form - then there is no initial data.

		if (!this.urlParam.start) {
			this.urlParam.start = +this.pMoment.m().startOf('day');
		}
		if (!this.urlParam.end) {
			this.urlParam.end = +this.pMoment.m().add(1, 'month').startOf('day');
		}
	}

	/**
	 * update queryParam values based on urlParam, bookingsService etc.
	 */
	public updateQueryParams() : void {
		this.setInitialDataIfNecessary();
		this.queryParams = new HttpParams()
			.set('data', 'reporting')
			.set('start', `${this.urlParam.start}`)
			.set('end', `${this.urlParam.end}`)
			.set('returnExpectedWorkingTimes', 'true');
	}

	/**
	 * Write url params to service params if possible
	 */
	public writeUrlParamsToService(params : Params) : void {
		if (params['start'] && params['start'] !== this.urlParam.start) {
			this.urlParam.start = +params['start'];
		}
		if (params['end'] && params['end'] !== this.urlParam.end) {
			this.urlParam.end = +params['end'];
		}
	}

	/**
	 * Clear all stored values of this service
	 */
	public unload() : void {
		this.queryParams = null;
		this.urlParam = {};
	}

}
