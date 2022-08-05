import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PGiftCardsService {
	public start : number | null = null;
	public end : number | null = null;

	/**
	 * The string which should be searched for
	 * This will get used for api requests
	 * Changing it should trigger a api load
	 */
	public searchString : string | null = null;

	/**
	 * Should all items be searched or only the visible ones?
	 * Changing it should trigger a api load
	 */
	public searchAll : boolean | null = null;

	constructor() {
		this.initValues();
	}

	/**
	 * Set some default values for properties that are not defined yet
	 */
	public initValues() : void {
		if (this.searchAll === null) this.searchAll = false;
	}
}
