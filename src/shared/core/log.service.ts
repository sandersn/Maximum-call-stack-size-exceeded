/* eslint-disable no-console, @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Config } from './config';
import { PSentryService } from '../sentry/sentry.service';

/**
 * Replacer fo prevent issues with circular objects
 */

/**
 * Overwrites console
 * Problem that gets solved here: When a component has e.g. a console.debug(…) and it gets used hundreds of times
 * then the console gets spammed and the app gets slow. Use LogService and the message gets logged one time.
 */

@Injectable({
	providedIn: 'root',
})
export class LogService {
	constructor(
		private pSentryService ?: PSentryService,
	) {
	}

	private spamBlockerIsActive = false;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public debug(firstArg : any, ...otherArgs : any[]) : void {
		this.logItToConsole(console.debug, '🚧', firstArg, '#495057', ...otherArgs);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public info(firstArg : any, ...otherArgs : any[]) : void {
		this.logItToConsole(console.info, '🚧', firstArg, '#495057', ...otherArgs);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public log(firstArg : any, ...otherArgs : any[]) : void {
		this.logItToConsole(console.log, 'ℹ️', firstArg, '#2c93a5', ...otherArgs);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public warn(firstArg : any, ...otherArgs : any[]) : void {
		if (this.sameArgsAsBefore(firstArg, otherArgs)) return;

		if (Config.DEBUG && Config.APPLICATION_MODE !== 'TEST') {
			// NOTE: In debug mode a warn gets handled like an error
			// NOTE: I add this line when i am in a work phase where i want everything to be clean. ^nn
			// if (Config.DEBUG && Config.APPLICATION_MODE !== 'TEST') throw new Error(firstArg);
			// return;
		}

		this.logItToConsole(console.warn, '⚠️', firstArg, '#e28e33', ...otherArgs);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public deprecated(firstArg : any, ...otherArgs : any[]) : void {
		if (this.sameArgsAsBefore(firstArg, otherArgs)) return;

		this.logItToConsole(console.debug, '♻️', firstArg, '#f3f', ...otherArgs);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public error(firstArg : any, ...otherArgs : any[]) : void {
		if (this.sameArgsAsBefore(firstArg, otherArgs)) return;

		if (Config.DEBUG && Config.APPLICATION_MODE !== 'TEST') {
			// NOTE: In debug mode a warn gets handled like an error
			throw new Error(firstArg);
		}

		this.reportLogError(console.error, '⚠️', firstArg, '#d12733', ...otherArgs);
	}

	private reportLogError(
		fn : (msg ?: any, ...optionalParams : any[]) => void,
		icon : string,
		firstArg : string,
		color : string = '#ccc',
		...otherArgs : any[]
	) : void {
		if (this.spamBlockerIsActive) {
			console.warn('Error reporting has been blocked', firstArg, ...otherArgs);
			return;
		}

		this.spamBlockerIsActive = true;
		window.setTimeout(() => {
			this.spamBlockerIsActive = false;
		}, 1000);

		// NOTE: If app is in debug mode, just log it.
		if (Config.DEBUG) {
			this.logItToConsole(fn, icon, firstArg, color, ...otherArgs);
		}

		// if (Config.DEBUG) return;

		// NOTE: If app is in prod mode then its probably one of our real users online. don’t bother him with error-modals
		// but send us a mail with some data about this error.
		console.error(icon, firstArg);

		this.pSentryService?.captureMessage(`${icon} ${firstArg}`, {
			level: 'error',
			fingerprint: [firstArg, ...otherArgs],
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public group(firstArg : any) : void {
		console.group(
			// eslint-disable-next-line literal-blacklist/literal-blacklist
			`%c${firstArg}`, 'font-weight:normal;font-family:"FiraMono", monospace;font-size:0.8rem;padding: 4px 0',
		);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public groupCollapsed(firstArg : any) : void {
		console.groupCollapsed(
			// eslint-disable-next-line literal-blacklist/literal-blacklist
			`%c${firstArg}`, 'font-weight:normal;font-family:"FiraMono", monospace;font-size:0.8rem;padding: 4px 0',
		);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public groupEnd() : void {
		console.groupEnd();
	}

	private logItToConsole(
		fn : (msg ?: any, ...optionalParams : any[]) => void,
		icon : string,
		firstArg : any,
		color : string = '#ccc',
		...otherArgs : any[]
	) : void {
		if (!Config.DEBUG) return;

		if (fn === console.debug) {
			const params = [`${icon} ${firstArg}`];
			if (typeof firstArg !== 'string') params.push(firstArg);
			params.push(...otherArgs);
			console.debug(...params);
			return;
		}

		console.groupCollapsed(
			`%c${icon} ${firstArg}`,
			`color:${color};font-weight:normal;font-family:"FiraMono", monospace;font-size:0.8rem;padding: 4px 0`,
		);
		fn('args:', ...otherArgs);
		console.trace();
		console.groupEnd();
	}

	private firstArgCache : any;
	private otherArgsCache : any;
	private sameArgsAsBefore(
		firstArg : any,
		...otherArgs : any[]
	) : boolean {
		const otherArgsString = JSON.stringify(otherArgs, (k, v) => (k ? `${v}` : v));
		if (this.firstArgCache === firstArg && this.otherArgsCache === otherArgsString) return true;

		this.firstArgCache = firstArg;
		this.otherArgsCache = otherArgsString;
		return false;
	}

}
