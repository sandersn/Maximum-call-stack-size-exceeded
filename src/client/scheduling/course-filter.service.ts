import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { PServiceWithCookiesInterface} from '@plano/shared/core/p-cookie.service';
import { PCookieService } from '@plano/shared/core/p-cookie.service';


// import { SchedulingApiService } from '@plano/shared/api';

@Injectable()
export class CourseFilterService implements PServiceWithCookiesInterface {
	private _courseVisible : boolean | null = null;
	private _bookingsVisible : boolean | null = null;

	public onChange : Subject<void> = new Subject<void>();

	constructor( private pCookieService : PCookieService ) {
	}

	/**
	 * Init all necessary values for this class
	 */
	public initValues() : void {
		if (this.bookingsVisible === null) this.bookingsVisible = false;
		if (this.courseVisible === null) this.courseVisible = true;
	}

	/**
	 * Read values from cookies if available
	 */
	public readCookies() : void {
		if (this.pCookieService.has({name: 'bookingsVisible', prefix: null})) {
			this.bookingsVisible = this.pCookieService.get({name: 'bookingsVisible', prefix: null}) === 'true';
		}
		if (this.pCookieService.has({name: 'courseVisible', prefix: null})) {
			this.courseVisible = this.pCookieService.get({name: 'courseVisible', prefix: null}) === 'true';
		}
	}

	// TODO: obsolete?
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get bookingsVisible() : boolean | null {
		return this._bookingsVisible;
	}
	public set bookingsVisible(value : boolean | null) {
		this.pCookieService.put({name: 'bookingsVisible', prefix: null}, value);
		this._bookingsVisible = value;

		this.onChange.next();
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get courseVisible() : boolean | null {
		return this._courseVisible!;
	}
	public set courseVisible(value : boolean | null) {
		this.pCookieService.put({name: 'courseVisible', prefix: null}, value);
		this._courseVisible = value;

		this.onChange.next();
	}

	/** @see PServiceInterface['unload'] */
	public unload() : void {
		this._bookingsVisible = null;
		this._courseVisible = null;
	}
}
