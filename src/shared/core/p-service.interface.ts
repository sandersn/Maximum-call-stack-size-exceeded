import { HttpParams } from '@angular/common/http';

/**
 * A Interface for Services in our app.
 * If your Service uses Cookies, please consider implementing PServiceWithCookiesInterface instead of PServiceInterface
 */

export interface PServiceInterface {

	/**
	 * Init all necessary values for this class
	 * Only set properties if they are undefined.
	 *
	 * Example:
	 *   public initValues() : void {
	 *     if (this.someProperty === undefined) this.someProperty = true;
	 *   }
	 */
	initValues() : void;

	/**
	 * Clear all stored values of this service.
	 * Make sure you don’t write anything to the cookies here.
	 *
	 * If you have a property that gets stored to the cookies, then set
	 * this._{property-name} to undefined instead of
	 * this.{property-name}, because if you would set this.{property-name}, you would overwrite the cookie.
	 *
	 * Example:
	 *   public unload() : void {
	 *     this._someProperty = undefined;
	 *   }
	 */
	unload() : void;
}

export interface PUrlParamsServiceInterface extends PServiceInterface {

	/**
	 * update queryParam values based on urlParam, bookingsService etc.
	 *
	 * Example:
	 *   public updateQueryParams() : void {
	 *     if (!this.urlParam.start) throw new Error('urlParam.start is undefined');
	 *     if (!this.urlParam.end) throw new Error('urlParam.end is undefined');
	 *     this.queryParams = new HttpParams()
	 *       .set('data', 'reporting')
	 *       .set('start', `${this.urlParam.start}`)
	 *       .set('end', `${this.urlParam.end}`)
	 *       .set('returnExpectedWorkingTimes', 'true');
	 *     }
	 *   }
	 */
	updateQueryParams() : void;

	/**
	 * A place to store the variables, necessary for the .load()
	 */
	queryParams : HttpParams | null;
}
