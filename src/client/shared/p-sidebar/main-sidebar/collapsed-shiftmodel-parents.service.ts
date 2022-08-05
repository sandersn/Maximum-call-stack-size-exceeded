import { OnDestroy} from '@angular/core';
import { Injectable, NgZone } from '@angular/core';
import { PParentName} from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { DataInput } from '@plano/shared/core/data/data-input';
import { LogService } from '@plano/shared/core/log.service';
import { PServiceWithCookiesInterface, PCookieKeyDataType } from '@plano/shared/core/p-cookie.service';
import { PCookieService } from '@plano/shared/core/p-cookie.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';

export type FilterItem = PParentName;

/**
 * A list of cookies.
 */

export class CookieListOfItems<T extends string | number> {

	constructor(
		private pCookieService : PCookieService,
		private cookieName : PCookieKeyDataType,
	) {
	}

	/**
	 * Get an array of the cookies
	 */
	public get cookieArray() : T[] {
		if (!this.pCookieService.has(this.cookieName)) return [];
		const cookieValue = this.pCookieService.get(this.cookieName);
		assumeDefinedToGetStrictNullChecksRunning(cookieValue, 'cookieValue');
		const result = JSON.parse(cookieValue);
		if (!Array.isArray(result)) return [];
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public push(item : T) : void {
		this.addIdToCookie(item);
	}

	private addIdToCookie(item : T) : void {
		const primitiveArray = this.cookieArray;
		if (!primitiveArray.includes(item)) primitiveArray.push(item);
		this.pCookieService.put(this.cookieName, JSON.stringify(primitiveArray));
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public removeItem(item : T) : void {
		this.removeItemFromCookie(item);
	}

	private removeItemFromCookie(item : T) : void {
		const idArray = this.cookieArray;
		const indexOfItem = idArray.indexOf(item);
		if (indexOfItem > -1) idArray.splice(indexOfItem, 1);
		this.pCookieService.put(this.cookieName, JSON.stringify(idArray));
	}

	/**
	 * Removes all items of the list.
	 */
	public clear() : void {
		for (const cookieItem of this.cookieArray) this.removeItem(cookieItem);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get(item : T) : boolean {
		return this.cookieArray.includes(item);
	}
}

/**
 * Filter items that are visible in the calendar.
 * Most of this information gets stored in the cookies.
 */

@Injectable()
export class CollapsedShiftmodelsService extends DataInput implements OnDestroy, PServiceWithCookiesInterface {

	/**
	 * Contains all items that need to be hidden
	 */
	private hiddenParentNames : CookieListOfItems<PParentName>;

	constructor(
		public api : SchedulingApiService,
		private pCookieService : PCookieService,
		protected override zone : NgZone,
		private console : LogService,
	) {
		super(zone);

		this.hiddenParentNames = new CookieListOfItems(this.pCookieService, {name: 'hiddenParentNames', prefix: null});
		this.initValues();

		/**
		 * Guess what happens when an item gets removed from api.data through a api.load? Throw.
		 * So here we make sure every api.data load refills the arrays with valid data.
		 */
		this.api.onDataLoaded.subscribe(() => {
			this.hiddenParentNames = new CookieListOfItems(this.pCookieService, {name: 'hiddenParentNames', prefix: null});
			this.readCookies();
		});
	}

	/**
	 * Init all necessary values for this class
	 */
	public initValues() : void {
	}

	/**
	 * Read values from cookies if available
	 */
	public readCookies() : void {
		if (this.pCookieService.has({name: 'hiddenParentNames', prefix: null})) {
			for (const item of this.hiddenParentNames.cookieArray) {
				if (this.api.data.shiftModels.parentNames.includes(item)) this.hiddenParentNames.push(item);
			}
		}
	}

	public ngOnDestroy() : void {
		this.unload();
	}

	/** @see PServiceInterface['unload'] */
	public unload() : void {
		this.hiddenParentNames.clear();

		this.changed(null);
	}

	/** Checking hiddenParentNames always accesses the cookies. Thats expensive. So we cache it here. */
	private isVisibleCache : Map<string, boolean> | null = null;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public show(input : PParentName) : void {
		this.hiddenParentNames.removeItem(input);
		this.isVisibleCache = null;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public hide(input : PParentName) : void {
		this.hiddenParentNames.push(input);
		this.isVisibleCache = null;
	}

	/**
	 * Check if this item is visible
	 */
	public isVisible(parentName : PParentName) : boolean {
		const cachedValue = this.isVisibleCache?.get(parentName);
		if (cachedValue === undefined) {
			if (this.isVisibleCache === null) this.isVisibleCache = new Map();
			this.isVisibleCache.set(parentName, !this.hiddenParentNames.get(parentName));
		}
		return this.isVisibleCache!.get(parentName)!;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public toggleItem(item : PParentName) : void {
		if (!this.isVisible(item)) { this.show(item); return; }

		this.hide(item);
		for (const shiftModel of this.api.data.shiftModels.filterBy(itm => itm.parentName === item).iterable()) {
			this.api.data.shifts.getItemsRelatedTo(shiftModel).setSelected(false);
		}
	}

}
