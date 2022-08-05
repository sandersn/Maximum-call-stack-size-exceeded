/* eslint-disable @typescript-eslint/explicit-member-accessibility, jsdoc/require-jsdoc, jsdoc/require-returns-description */
import { InjectionToken } from '@angular/core';

type CookieMock = {
	name : string,
	value : string | number | boolean,
};

export class FakeCookieService {
	private cookies : CookieMock[] = [];

	get(name : string) : string | number | boolean {
		const result = this.cookies.find(item => item.name === name);
		if (!result) return '';
		return result.value;
	}

	set(name : string, value : string, _expires ?: number | Date, _path ?: string, _domain ?: string, _secure ?: boolean, _sameSite ?: 'Lax' | 'None' | 'Strict') : void {
		// eslint-disable-next-line no-console
		console.debug(`set: ${name}`);
		const existingCookie = this.cookies.find(item => item.name === name);
		if (existingCookie) { existingCookie.value = value; return; }

		this.cookies.push({
			name : name,
			value : value.toString(),
		});
	}

	check(name : string) : boolean {
		const existingCookie = this.cookies.find(item => item.name === name);
		return !!existingCookie;
	}

	delete(name : string, _path ?: string, _domain ?: string) : void {
		this.cookies = this.cookies.filter(item => item.name !== name);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
	constructor(_document : any | null, _platformId : InjectionToken<unknown> | null) {}

	/**
	 * @returns {}
	 */
	getAll() : unknown { return undefined; }

	/**
	 * @param _path   Cookie path
	 * @param _domain Cookie domain
	 */
	deleteAll(_path ?: string, _domain ?: string) : void {}

	/**
	 * @param _name Cookie name
	 * @returns {RegExp}
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private getCookieRegExp(_name : any) : void {}
}
