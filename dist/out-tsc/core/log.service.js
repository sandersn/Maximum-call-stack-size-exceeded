import { __decorate, __metadata } from "tslib";
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
let LogService = class LogService {
    constructor(pSentryService) {
        this.pSentryService = pSentryService;
        this.spamBlockerIsActive = false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    debug(firstArg, ...otherArgs) {
        this.logItToConsole(console.debug, '🚧', firstArg, '#495057', ...otherArgs);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    info(firstArg, ...otherArgs) {
        this.logItToConsole(console.info, '🚧', firstArg, '#495057', ...otherArgs);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    log(firstArg, ...otherArgs) {
        this.logItToConsole(console.log, 'ℹ️', firstArg, '#2c93a5', ...otherArgs);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    warn(firstArg, ...otherArgs) {
        if (this.sameArgsAsBefore(firstArg, otherArgs))
            return;
        if (Config.DEBUG && Config.APPLICATION_MODE !== 'TEST') {
            // NOTE: In debug mode a warn gets handled like an error
            // NOTE: I add this line when i am in a work phase where i want everything to be clean. ^nn
            // if (Config.DEBUG && Config.APPLICATION_MODE !== 'TEST') throw new Error(firstArg);
            // return;
        }
        this.logItToConsole(console.warn, '⚠️', firstArg, '#e28e33', ...otherArgs);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    deprecated(firstArg, ...otherArgs) {
        if (this.sameArgsAsBefore(firstArg, otherArgs))
            return;
        this.logItToConsole(console.debug, '♻️', firstArg, '#f3f', ...otherArgs);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    error(firstArg, ...otherArgs) {
        if (this.sameArgsAsBefore(firstArg, otherArgs))
            return;
        if (Config.DEBUG && Config.APPLICATION_MODE !== 'TEST') {
            // NOTE: In debug mode a warn gets handled like an error
            throw new Error(firstArg);
        }
        this.reportLogError(console.error, '⚠️', firstArg, '#d12733', ...otherArgs);
    }
    reportLogError(fn, icon, firstArg, color = '#ccc', ...otherArgs) {
        var _a;
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
        (_a = this.pSentryService) === null || _a === void 0 ? void 0 : _a.captureMessage(`${icon} ${firstArg}`, {
            level: 'error',
            fingerprint: [firstArg, ...otherArgs],
        });
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    group(firstArg) {
        console.group(
        // eslint-disable-next-line literal-blacklist/literal-blacklist
        `%c${firstArg}`, 'font-weight:normal;font-family:"FiraMono", monospace;font-size:0.8rem;padding: 4px 0');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    groupCollapsed(firstArg) {
        console.groupCollapsed(
        // eslint-disable-next-line literal-blacklist/literal-blacklist
        `%c${firstArg}`, 'font-weight:normal;font-family:"FiraMono", monospace;font-size:0.8rem;padding: 4px 0');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    groupEnd() {
        console.groupEnd();
    }
    logItToConsole(fn, icon, firstArg, color = '#ccc', ...otherArgs) {
        if (!Config.DEBUG)
            return;
        if (fn === console.debug) {
            const params = [`${icon} ${firstArg}`];
            if (typeof firstArg !== 'string')
                params.push(firstArg);
            params.push(...otherArgs);
            console.debug(...params);
            return;
        }
        console.groupCollapsed(`%c${icon} ${firstArg}`, `color:${color};font-weight:normal;font-family:"FiraMono", monospace;font-size:0.8rem;padding: 4px 0`);
        fn('args:', ...otherArgs);
        console.trace();
        console.groupEnd();
    }
    sameArgsAsBefore(firstArg, ...otherArgs) {
        const otherArgsString = JSON.stringify(otherArgs, (k, v) => (k ? `${v}` : v));
        if (this.firstArgCache === firstArg && this.otherArgsCache === otherArgsString)
            return true;
        this.firstArgCache = firstArg;
        this.otherArgsCache = otherArgsString;
        return false;
    }
};
LogService = __decorate([
    Injectable({
        providedIn: 'root',
    }),
    __metadata("design:paramtypes", [PSentryService])
], LogService);
export { LogService };
//# sourceMappingURL=log.service.js.map