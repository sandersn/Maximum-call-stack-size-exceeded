/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import * as Sentry from '@sentry/angular';
import { Scope } from '@sentry/angular';
import { BrowserTracing } from '@sentry/tracing';
import { Primitive, Transaction } from '@sentry/types';
import { CaptureContext, Integration } from '@sentry/types';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import packageJson from '../../../package.json';
import { MeService } from '../api';
import { Config } from '../core/config';
import { assumeNonNull } from '../core/null-type-utils';
import { errorUtils } from '../core/typescript-utils';
import { AngularWrappedError } from '../core/typescript-utils-types';

type PTransactionId = `performance-of-${string}`;
type SentryDeviceDataType = {
	brand ?: string,
	family : string,
	model ?: string,
};
type SentryBrowserDataType = {
	name : string,
	version ?: string | null,
};

const transactions : {
	id : PTransactionId,
	transaction : Transaction,
}[] = [];

type TextReplaceReturnObject = {
	text : string,
	replacedItems : {[key : string] : string}[],
};

/**
 * Everything we do with Sentry should go here.
 */
@Injectable({ providedIn: 'root' })
export class PSentryService {
	public ignoreErrors : RegExp[] = [
		new RegExp(/^HttpErrorResponse:.*/),
		new RegExp(/.*tawk\.to.*/),
		new RegExp(/.*slick.*/),
		new RegExp(/Socket server did not execute the callback for setAttributes with data.*/),
		new RegExp(/Client could not be found. This error is expected when client has not activated their kletterszene integration./),
		// This is our tawk id. [PLANO-36160]
		new RegExp(/599aa06c1b1bed47ceb05bde/),
		// cSpell:ignore SIPCC
		/SIPCC/g,
	];

	private errorMatchesRegEx(error : Error, regex : RegExp) : boolean {
		return !!error.message.match(regex) || !!error.name.match(regex);
	}

	/**
	 * Should this error be dropped?
	 */
	public shouldDropError(error : Error, userMessage ?: string) : boolean {
		if (!!userMessage) return false;
		if (this.ignoreErrors.length === 0) return false;
		return this.ignoreErrors.some(regex => {
			return this.errorMatchesRegEx(error, regex);
		});
	}

	/**
	 * Turn something like
	 * `/de/client/shift/12345,0,0,0,61,1654034400000,1654120800000,2344/start-date/1234567890123/`
	 * into
	 * `/de/client/shift/<shift-id>/start-date/<timestamp>`
	 *
	 * and
	 *
	 * `Error: Could not find item »205434191«`
	 * into
	 * `Error: Could not find item »<number_0>«`
	 */
	// NOTE: Has to be public to be able to test it in the spec file
	public removeVarsFromText(text : string) : TextReplaceReturnObject {
		const result : TextReplaceReturnObject = { text: text, replacedItems: [] };
		const processItems = (title : string, regex : RegExp) : void => {
			const items = result.text.match(regex) ?? [];
			for (const item of items) {
				// Skip these replacements because they are most likely part of our localhost client url.
				const entryAlreadyExists = result.replacedItems.filter(findItem => {
					return !!Object.keys(findItem)[0].includes(title);
				});
				const key = !entryAlreadyExists.length ? `${title}_0` : `${title}_${entryAlreadyExists.length.toString()}`;
				result.replacedItems.push({[key]: item});
				result.text = result.text.replace(item, `<${key}>`);
			}
		};
		// eslint-disable-next-line unicorn/no-unsafe-regex
		processItems('shiftId', /[1-9]\d+(?:,[\w-]*)+,?/g);
		processItems('timestamp', /\d{13,14}/g);
		processItems('number', /[1-9]\d*(?!>)/g);
		processItems('hash', /[\da-f]{32}/g);
		// Remove trailing slash from url
		result.text = result.text.replace(/(<?\w+>?)\/$/g, '$1');
		return result;
	}

	/**
	 * Init Sentry and set everything up that wont change till Sentry calls go out
	 */
	public init() : void {
		let sentryProjectUrl : string;
		if (window.location.href.includes('dr-plano.com') && !window.location.href.includes('staging.dr-plano.com')) {
			sentryProjectUrl = 'https://7bc16c77d5784796a2345f4e2f443fff@sentry.io/5187494';
		} else {
			sentryProjectUrl = 'https://5f563ada6f7c468780086759f1338dec@o372563.ingest.sentry.io/5249158';
		}

		const integrations : Integration[] = [];
		integrations.push(
			new Sentry.Integrations.Breadcrumbs({
				console: true, // Log calls to `console.log`, `console.debug`, etc
				dom: true, // Log all click and keypress events
				fetch: true, // Log HTTP requests done with the Fetch API
				history: true, // Log calls to `history.pushState` and friends
				sentry: true, // Log whenever we send an event to the server
				xhr: true, // Log HTTP requests done with the XHR API
			}),
		);
		integrations.push(new Sentry.Integrations.HttpContext());
		integrations.push(new BrowserTracing({
			tracingOrigins: [
				// ::1 represents 0:0:0:0:0:0:0:1 which is the ipv6 counterpart to 127.0.0.1
				// Before we added this, we had CORS issues with network requests between localhost and 127.0.0.1
				'::1',
			],
			beforeNavigate: context => {
				return {
					...context,
					// We need to make the url string more geneal so that it gets grouped nicely in Sentry UIg
					name: this.removeVarsFromText(location.pathname).text,
				};
			},
		}));
		integrations.push(new Sentry.Integrations.InboundFilters());

		Sentry.init({
			dsn: sentryProjectUrl,
			attachStacktrace: true,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			release: (packageJson as any)?.version,
			denyUrls: [
				// Storybook
				/http:\/\/(localhost|127\.0\.0\.1):6006\/.*/,
				/http:\/\/(localhost|127\.0\.0\.1):6007\/.*/,
				// Tests
				/http:\/\/(localhost|127\.0\.0\.1):9876\/.*/,
				// Admin-Area
				/http:\/\/(localhost|127\.0\.0\.1):\d{4}\/\w*\/admin\/.*/,
			],
			ignoreErrors: [], // Leave this empty. Use this.ignoreErrors instead
			defaultIntegrations: false,
			integrations: integrations,
			tracesSampleRate: Config.DEBUG || Config.IS_STAGING ? 1.0 : 0.1,
		});

		this.setDetailsThatWontChangeDuringSession(Config.platform);
	}

	/**
	 * Start transaction
	 */
	public startTransaction(input : PTransactionId) : void {
		transactions.push({
			id: input,
			transaction: Sentry.startTransaction({ name: 'test-transaction' }),
		});
	}

	/**
	 * Stop transaction
	 */
	public stopTransaction(input : PTransactionId) : void {
		const transactionObject = transactions.find(item => item.id === input) ?? null;
		assumeNonNull(transactionObject, 'transaction', `Forgot to start Transaction »${input}« first?`);
		transactionObject.transaction.finish(); // Finishing the transaction will send it to Sentry
	}

	/**
	 * Send a console.error() from prod frontend to Sentry
	 */
	public captureMessage(
		subject : string,
		context : CaptureContext,
	) : PromiseLike<boolean> {
		this.setSentryTags();

		Sentry.captureMessage(subject, context);
		return Sentry.flush(2500);
	}

	/**
	 * Send error to error-tracking-tool
	 * @deprecated this was previously implemented in ErrorModalContentComponent.
	 * 		Use captureConsoleError() or captureMessage() instead.
	 */
	public captureException(
		error : Error | HttpErrorResponse | AngularWrappedError | string,
		me : MeService | null,
		userMessage ?: string,
	) : ReturnType<typeof Sentry.captureException> | ReturnType<typeof this.captureMessage> | null {
		if (!!userMessage) userMessage = userMessage.replace(/\r\n|\n|\r/g, ' ❦ ');

		this.setSentryTags();

		this.setSentryScopeForException(error, me, userMessage);
		const EXTRACTED_ERROR = this.extractError(error);
		if (this.shouldDropError(EXTRACTED_ERROR, userMessage)) return null;
		if (!!userMessage) {
			return this.captureMessage(userMessage, {
				level: 'fatal',
				fingerprint: [userMessage],
			});
		}
		return Sentry.captureException(EXTRACTED_ERROR, {
			level: 'fatal',
			fingerprint: [this.removeVarsFromText(EXTRACTED_ERROR.message).text],
		});
	}

	/** @see Sentry['flush'] */
	public async flush(timestamp : number) : Promise<boolean> {
		return Sentry.flush(timestamp);
	}

	/**
	 * Set user.
	 * Run this after user has logged in.
	 * Run this with null input when user logs out
	 */
	public setUserAndAccountScope(input : MeService | null) : void {
		if (input === null) {
			Sentry.setUser(null);
			Sentry.configureScope((scope) => {
				scope.setTag('locationName', undefined);
				scope.setTag('isRealAccount', undefined);
				scope.setTag('isOwner', undefined);
			});
			return;
		}
		Sentry.setUser({
			id: input.data.id.toString(),
			username: `${input.data.firstName} ${input.data.lastName}`,
			email: input.data.email,
			companyName: input.data.companyName,
		});

		Sentry.configureScope((scope) => {
			if (input.isLoaded()) {
				scope.setTag('locationName', input.data.locationName);
				scope.setTag('isRealAccount', (!input.isTestAccount).toString());
				scope.setTag('isOwner', input.data.isOwner.toString());
			}
		});
	}

	private setDetailsThatWontChangeDuringSession(platform : typeof Config['platform']) : void {
		switch (platform) {
			case 'appIOS': {
				const device : SentryDeviceDataType = {
					brand: 'Apple',
					family: 'iPhone',
					model: 'Unknown (Nativescript)',
				};
				this.addToContext('device', device);

				const browser : SentryBrowserDataType = {
					name: 'Nativescript WebView',
					version: null,
				};
				this.addToContext('browser', browser);

				type SentryOSDataType = {
					name : string,
				};
				const os : SentryOSDataType = {
					name : 'iOS',
				};
				this.addToContext('os', os);
				break;
			}

			case 'appAndroid': {
				const device : SentryDeviceDataType = {
					brand: 'Unknown (Nativescript)',
					family: 'Android',
					model: 'Unknown (Nativescript)',
				};
				this.addToContext('device', device);

				const browser : SentryBrowserDataType = {
					name: 'Nativescript WebView',
				};
				this.addToContext('browser', browser);

				type SentryOSDataType = {
					name : string,
				};
				const os : SentryOSDataType = {
					name : 'Android',
				};
				this.addToContext('os', os);
				break;
			}

			default:
				break;
		}

		Sentry.configureScope(scope => {
			scope.setTag('Config.DEBUG', Config.DEBUG ? Config.DEBUG.toString() : undefined);
		});

	}

	private setSentryTags() : void {
		const urlWithReplacements = this.removeVarsFromText(location.pathname);
		this.setTag('url', urlWithReplacements.text);
		for (const item of urlWithReplacements.replacedItems) {
			this.setTag(Object.keys(item)[0], Object.values(item)[0]);
		}
		this.setTag('config_locale', Config.LOCALE_ID);
	}

	/**
	 * Set sentry scope for an exception
	 */
	private setSentryScopeForException(
		error : Parameters<PSentryService['extractError']>[0],
		me : MeService | null,
		userMessage ?: string,
	) : void {
		const EXTRACTED_ERROR = this.extractError(error);

		if (userMessage) EXTRACTED_ERROR.name = this.getSubjectPrefix(true, me);

		Sentry.configureScope((scope) => {
			if (
				!!error &&
				typeof error !== 'string' &&
				errorUtils.isTypeHttpErrorResponse(error)
			) {
				this.addToContext('server', {
					stack: JSON.stringify(error.error, undefined, 2),
					status: error.status,
					statusText: error.statusText,
					message: error.message,
					url: error.url,
				});
			}

			if (!!userMessage) scope.setTag('userMessage', userMessage);
		});
	}

	/**
	 * Get a simple error object from the input, which can be a more complex error object.
	 * E.g. a HttpErrorResponse in Angular has properties like .status, .type but also a .error which contains the simple
	 * JS Error object.
	 */
	private extractError(error : Parameters<PSentryService['captureException']>[0]) : Error {
		try {
			if (typeof error === 'string') return new Error(error);

			if (errorUtils.isAngularWrappedError(error)) {
				// Try to unwrap zone.js error.
				// https://github.com/angular/angular/blob/master/packages/core/src/util/errors.ts
				if (errorUtils.isTypeError(error.ngOriginalError)) return error.ngOriginalError;
				return new Error(error.ngOriginalError);
			}

			if (errorUtils.isTypeHttpErrorResponse(error)) {
				// It happened that error.error is null [PLANO-FE-4MJ]
				if (!!error.error) {
					// If it's http module error, extract as much information from it as we can.

					// The `error` property of http exception can be either an `Error` object, which we can use directly…
					if (errorUtils.isTypeError(error.error)) {
						return error.error;
					}

					// …or an`ErrorEvent`, which can provide us with the message but no stack…
					if (
						errorUtils.isTypeErrorEvent(error.error) &&
						error.error.message // Inspired by https://github.com/getsentry/sentry-javascript/issues/2292#issuecomment-692494628
					) {
						return new Error(error.error.message);
					}

					return new Error(`${error.name}: ${error.status} ${error.error[0]}`);
				}

				// If we don't have any detailed information, fallback to the request message itself.
				return new Error(error.message);
			}

			// We can handle messages and Error objects directly.
			if (errorUtils.isTypeError(error)) return error;
		} catch (catchError) {
			console.error(`Error has unexpected type`, error, catchError);
			this.setTag('errorTypeUnexpected', `${catchError}`);
		}
		return error as never;
	}

	/**
	 * Create subject
	 */
	public getSubjectPrefix(
		hasUserMessage : boolean,
		me : MeService | null,
	) : string {
		let result = '';

		if (hasUserMessage) {
			result += '💬 | ';
		}

		if (me?.isLoaded()) {
			if (me.isTestAccount) result += '⏲️ ';
			if (me.data.isOwner) result += '👑 ';
			if (me.data.firstName && me.data.locationName) {
				result += `${me.data.firstName} @ ${me.data.locationName}`;
			}
		} else {
			result += '?';
		}

		// Jira creates tickets from our emails. The email subject will be the title of the ticket.
		// Character limit if Jira for titles is 255
		result = result.slice(0, 255);

		return result;
	}

	/**
	 * Set a Sentry Tag
	 * Use this if you want specific additional information on your entry.
	 */
	public setTag(name : string, value : Primitive) : void {
		Sentry.configureScope((scope) => {
			scope.setTag(name, value);
		});
	}

	/**
	 * Set subtitle for a sentry entry
	 */
	public setSubTitle(subTitle : string) : void {
		Sentry.configureScope((scope) => {
			scope.setTransactionName(subTitle);
		});
	}

	private async addToContext(
		contextName : string,
		data : Record<string, unknown>,
	) : Promise<void> {
		return new Promise(resolve => {
			Sentry.configureScope(scope => {
				scope.setContext(contextName, {
					...(scope as Scope & { _contexts : Record<string, unknown> })._contexts[contextName],
					...data,
				});

				resolve();
			});
		});
	}
}
