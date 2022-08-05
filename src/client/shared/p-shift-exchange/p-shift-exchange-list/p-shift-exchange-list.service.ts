import { Injectable } from '@angular/core';
import { MeService } from '@plano/shared/api';
import { PServiceWithCookiesInterface} from '@plano/shared/core/p-cookie.service';
import { PCookieService } from '@plano/shared/core/p-cookie.service';

type SortByKey = 'shiftRefs' | 'state' | 'lastUpdate';

@Injectable()
export class PShiftExchangeListService implements PServiceWithCookiesInterface {
	private _key : SortByKey | null = null;
	private _reverse : boolean | null = null;

	constructor(
		private meService : MeService,
		private pCookieService : PCookieService,
	) {
		this.meService.onChange.subscribe(() => {
			this.readCookies();
			this.initValues();
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get key() : SortByKey | null {
		return this._key;
	}
	public set key(value : SortByKey | null) {
		this.pCookieService.put({name: 'PShiftExchangeListServiceKey', prefix: null}, `${value}`);
		this._key = value;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get reverse() : boolean | null {
		return this._reverse;
	}
	public set reverse(value : boolean | null) {
		this.pCookieService.put({name: 'PShiftExchangeListServiceReverse', prefix: null}, `${value}`);
		this._reverse = value;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public readCookies() : void {
		const keyCookie = this.pCookieService.get({name: 'PShiftExchangeListServiceKey', prefix: null}) as SortByKey | undefined;
		if (keyCookie !== undefined) {
			this.key = keyCookie;
		}
		const reverseCookie = this.pCookieService.get({name: 'PShiftExchangeListServiceReverse', prefix: null});
		if (reverseCookie !== undefined) {
			this.reverse = reverseCookie === 'true';
		}
	}

	/**
	 * Init all necessary values for this class
	 */
	public initValues() : void {
		if (this._key === null) this.key = 'shiftRefs';
		if (this._reverse === null) this.reverse = false;
	}

	/** @see PServiceInterface['unload'] */
	public unload() : void {
		this._key = null;
		this._reverse = null;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public setSortBy(key : SortByKey) : void {
		if (this.key === key) {
			this.reverse = !this.reverse;
		} else {
			this.key = key;
			this.reverse = false;
		}
	}

}
