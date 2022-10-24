import { __decorate } from "tslib";
/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import * as Sentry from '@sentry/angular';
import { BrowserTracing } from '@sentry/tracing';
import { Injectable } from '@angular/core';
import packageJson from '../../../package.json';
import { Config } from '../core/config';
import { assumeNonNull } from '../core/null-type-utils';
import { errorUtils } from '../core/typescript-utils';
const transactions = [];
/**
 * Everything we do with Sentry should go here.
 */
let PSentryService = class PSentryService {
    constructor() {
        this.ignoreErrors = [
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
    }
    errorMatchesRegEx(error, regex) {
        return !!error.message.match(regex) || !!error.name.match(regex);
    }
    /**
     * Should this error be dropped?
     */
    shouldDropError(error, userMessage) {
        if (!!userMessage)
            return false;
        if (this.ignoreErrors.length === 0)
            return false;
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
    removeVarsFromText(text) {
        const result = { text: text, replacedItems: [] };
        const processItems = (title, regex) => {
            var _a;
            const items = (_a = result.text.match(regex)) !== null && _a !== void 0 ? _a : [];
            for (const item of items) {
                // Skip these replacements because they are most likely part of our localhost client url.
                const entryAlreadyExists = result.replacedItems.filter(findItem => {
                    return !!Object.keys(findItem)[0].includes(title);
                });
                const key = !entryAlreadyExists.length ? `${title}_0` : `${title}_${entryAlreadyExists.length.toString()}`;
                result.replacedItems.push({ [key]: item });
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
    init() {
        let sentryProjectUrl;
        if (window.location.href.includes('dr-plano.com') && !window.location.href.includes('staging.dr-plano.com')) {
            sentryProjectUrl = 'https://7bc16c77d5784796a2345f4e2f443fff@sentry.io/5187494';
        }
        else {
            sentryProjectUrl = 'https://5f563ada6f7c468780086759f1338dec@o372563.ingest.sentry.io/5249158';
        }
        const integrations = [];
        integrations.push(new Sentry.Integrations.Breadcrumbs({
            console: true,
            dom: true,
            fetch: true,
            history: true,
            sentry: true,
            xhr: true, // Log HTTP requests done with the XHR API
        }));
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
            release: packageJson === null || packageJson === void 0 ? void 0 : packageJson.version,
            denyUrls: [
                // Storybook
                /http:\/\/(localhost|127\.0\.0\.1):6006\/.*/,
                /http:\/\/(localhost|127\.0\.0\.1):6007\/.*/,
                // Tests
                /http:\/\/(localhost|127\.0\.0\.1):9876\/.*/,
                // Admin-Area
                /http:\/\/(localhost|127\.0\.0\.1):\d{4}\/\w*\/admin\/.*/,
            ],
            ignoreErrors: [],
            defaultIntegrations: false,
            integrations: integrations,
            tracesSampleRate: Config.DEBUG || Config.IS_STAGING ? 1.0 : 0.1,
        });
        this.setDetailsThatWontChangeDuringSession(Config.platform);
    }
    /**
     * Start transaction
     */
    startTransaction(input) {
        transactions.push({
            id: input,
            transaction: Sentry.startTransaction({ name: 'test-transaction' }),
        });
    }
    /**
     * Stop transaction
     */
    stopTransaction(input) {
        var _a;
        const transactionObject = (_a = transactions.find(item => item.id === input)) !== null && _a !== void 0 ? _a : null;
        assumeNonNull(transactionObject, 'transaction', `Forgot to start Transaction »${input}« first?`);
        transactionObject.transaction.finish(); // Finishing the transaction will send it to Sentry
    }
    /**
     * Send a console.error() from prod frontend to Sentry
     */
    captureMessage(subject, context) {
        this.setSentryTags();
        Sentry.captureMessage(subject, context);
        return Sentry.flush(2500);
    }
    /**
     * Send error to error-tracking-tool
     * @deprecated this was previously implemented in ErrorModalContentComponent.
     * 		Use captureConsoleError() or captureMessage() instead.
     */
    captureException(error, me, userMessage) {
        if (!!userMessage)
            userMessage = userMessage.replace(/\r\n|\n|\r/g, ' ❦ ');
        this.setSentryTags();
        this.setSentryScopeForException(error, me, userMessage);
        const EXTRACTED_ERROR = this.extractError(error);
        if (this.shouldDropError(EXTRACTED_ERROR, userMessage))
            return null;
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
    async flush(timestamp) {
        return Sentry.flush(timestamp);
    }
    /**
     * Set user.
     * Run this after user has logged in.
     * Run this with null input when user logs out
     */
    setUserAndAccountScope(input) {
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
    setDetailsThatWontChangeDuringSession(platform) {
        switch (platform) {
            case 'appIOS': {
                const device = {
                    brand: 'Apple',
                    family: 'iPhone',
                    model: 'Unknown (Nativescript)',
                };
                this.addToContext('device', device);
                const browser = {
                    name: 'Nativescript WebView',
                    version: null,
                };
                this.addToContext('browser', browser);
                const os = {
                    name: 'iOS',
                };
                this.addToContext('os', os);
                break;
            }
            case 'appAndroid': {
                const device = {
                    brand: 'Unknown (Nativescript)',
                    family: 'Android',
                    model: 'Unknown (Nativescript)',
                };
                this.addToContext('device', device);
                const browser = {
                    name: 'Nativescript WebView',
                };
                this.addToContext('browser', browser);
                const os = {
                    name: 'Android',
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
    setSentryTags() {
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
    setSentryScopeForException(error, me, userMessage) {
        const EXTRACTED_ERROR = this.extractError(error);
        if (userMessage)
            EXTRACTED_ERROR.name = this.getSubjectPrefix(true, me);
        Sentry.configureScope((scope) => {
            if (!!error &&
                typeof error !== 'string' &&
                errorUtils.isTypeHttpErrorResponse(error)) {
                this.addToContext('server', {
                    stack: JSON.stringify(error.error, undefined, 2),
                    status: error.status,
                    statusText: error.statusText,
                    message: error.message,
                    url: error.url,
                });
            }
            if (!!userMessage)
                scope.setTag('userMessage', userMessage);
        });
    }
    /**
     * Get a simple error object from the input, which can be a more complex error object.
     * E.g. a HttpErrorResponse in Angular has properties like .status, .type but also a .error which contains the simple
     * JS Error object.
     */
    extractError(error) {
        try {
            if (typeof error === 'string')
                return new Error(error);
            if (errorUtils.isAngularWrappedError(error)) {
                // Try to unwrap zone.js error.
                // https://github.com/angular/angular/blob/master/packages/core/src/util/errors.ts
                if (errorUtils.isTypeError(error.ngOriginalError))
                    return error.ngOriginalError;
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
                    if (errorUtils.isTypeErrorEvent(error.error) &&
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
            if (errorUtils.isTypeError(error))
                return error;
        }
        catch (catchError) {
            console.error(`Error has unexpected type`, error, catchError);
            this.setTag('errorTypeUnexpected', `${catchError}`);
        }
        return error;
    }
    /**
     * Create subject
     */
    getSubjectPrefix(hasUserMessage, me) {
        let result = '';
        if (hasUserMessage) {
            result += '💬 | ';
        }
        if (me === null || me === void 0 ? void 0 : me.isLoaded()) {
            if (me.isTestAccount)
                result += '⏲️ ';
            if (me.data.isOwner)
                result += '👑 ';
            if (me.data.firstName && me.data.locationName) {
                result += `${me.data.firstName} @ ${me.data.locationName}`;
            }
        }
        else {
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
    setTag(name, value) {
        Sentry.configureScope((scope) => {
            scope.setTag(name, value);
        });
    }
    /**
     * Set subtitle for a sentry entry
     */
    setSubTitle(subTitle) {
        Sentry.configureScope((scope) => {
            scope.setTransactionName(subTitle);
        });
    }
    async addToContext(contextName, data) {
        return new Promise(resolve => {
            Sentry.configureScope(scope => {
                scope.setContext(contextName, {
                    ...scope._contexts[contextName],
                    ...data,
                });
                resolve();
            });
        });
    }
};
PSentryService = __decorate([
    Injectable({ providedIn: 'root' })
], PSentryService);
export { PSentryService };
//# sourceMappingURL=sentry.service.js.map