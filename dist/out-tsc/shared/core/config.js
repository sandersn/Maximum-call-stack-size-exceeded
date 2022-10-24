var Config_1;
import { __decorate } from "tslib";
/* eslint-disable regexp/no-unused-capturing-group, regexp/no-unused-capturing-group, regexp/no-super-linear-backtracking, regexp/optimal-quantifier-concatenation */
import 'firebase/compat/messaging';
import firebase from 'firebase/compat/app';
import * as $ from 'jquery';
import { Injectable } from '@angular/core';
import { getBrowserInfoByUserAgent } from './browser-utils';
import { ENVIRONMENT } from '../../environments/environment';
import { PSupportedCountryCodes, PSupportedCurrencyCodes, PSupportedLanguageCodes, PSupportedLocaleIds, PSupportedTimeZones } from '../api/base/generated-types.ag';
let Config = Config_1 = class Config {
    /**
     * Initializes the Config object.
     */
    static initialize() {
        // Is mobile?
        // Not sure what best solution is. For the moment we use combination of window width and userAgent check.
        // This is used quite often and was performance issue. So, we calculate this once.
        const agent = window.navigator.userAgent || window.navigator.vendor;
        Config_1.userAgentIsMobile = (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i // cSpell:disable-line
            // eslint-disable-next-line regexp/prefer-character-class
            .test(agent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw-(n|u)|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do(c|p)o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(-|_)|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-(m|p|t)|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c(-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac( |-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[23]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c(-|0|1)|47|mc|nd|ri)|sgh-|shar|sie(-|m)|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel(i|m)|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i // cSpell:disable-line
            .test(agent.slice(0, 4)));
        Config_1.windowWidth = $(window).width();
        if (!Config_1.userAgentIsMobile) // currently the width is only interesting on non mobile systems
            window.setInterval(() => {
                Config_1.windowWidth = $(window).width();
            }, 3000);
        // platform
        if (agent.includes('drpAppAndroid'))
            Config_1.platform = 'appAndroid';
        else if (agent.includes('drpAppIOS'))
            Config_1.platform = 'appIOS';
        else
            Config_1.platform = 'browser';
        // ANGULAR_FIRE_MESSAGING_ENABLED
        // We disable it on mobile intentionally to motivate users to download apps.
        Config_1.ANGULAR_FIRE_MESSAGING_ENABLED = Config_1.platform === 'browser' &&
            Config_1.APPLICATION_MODE !== 'TEST' &&
            firebase.messaging.isSupported();
    }
    /**
     * @returns the frontend url containing the country code. E.g.: https://www.dr-plano.com/de.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    static get FRONTEND_URL_LOCALIZED() {
        let result = Config_1.FRONTEND_URL;
        const countryCode = Config_1.getCountryCode();
        if (countryCode !== null)
            result += `/${countryCode.toLowerCase()}`;
        return result;
    }
    /**
     * @returns Returns the time-zone for given "local".
     */
    static getTimeZone(locale) {
        switch (locale) {
            case PSupportedLocaleIds.de_DE:
            case PSupportedLocaleIds.de_AT:
            case PSupportedLocaleIds.de_CH:
            case PSupportedLocaleIds.en_NL:
            case PSupportedLocaleIds.en_BE:
            case PSupportedLocaleIds.en_CZ:
            case PSupportedLocaleIds.en_SE:
            case PSupportedLocaleIds.de_LU:
                return PSupportedTimeZones.EUROPE_BERLIN;
            case PSupportedLocaleIds.en_GB:
                return PSupportedTimeZones.ETC_GMT;
            case PSupportedLocaleIds.en:
                // eslint-disable-next-line no-console
                if (Config_1.DEBUG)
                    console.error(`Unsupported timezone for locale »${locale}«`);
                return PSupportedTimeZones.ETC_GMT;
            default:
                // eslint-disable-next-line no-console
                if (Config_1.DEBUG)
                    console.error(`Unsupported timezone for locale »${locale}«`);
                return null;
        }
    }
    /**
     * @returns Returns time-zone of current frontend version.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    static get TIME_ZONE() {
        return Config_1.getTimeZone(Config_1.LOCALE_ID);
    }
    /**
     * @returns Returns currency-code of current frontend version.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    static get CURRENCY_CODE() {
        return Config_1.getCurrencyCode(Config_1.LOCALE_ID);
    }
    /**
     * @returns Returns the currency code for given "locale".
     */
    static getCurrencyCode(locale) {
        switch (locale) {
            case PSupportedLocaleIds.de_AT:
            case PSupportedLocaleIds.de_DE:
            case PSupportedLocaleIds.en_BE:
            case PSupportedLocaleIds.en_NL:
            case PSupportedLocaleIds.de_LU:
                return PSupportedCurrencyCodes.EUR;
            case PSupportedLocaleIds.de_CH:
                return PSupportedCurrencyCodes.CHF;
            case PSupportedLocaleIds.en_GB:
                return PSupportedCurrencyCodes.GBP;
            case PSupportedLocaleIds.en_CZ:
                return PSupportedCurrencyCodes.CZK;
            case PSupportedLocaleIds.en_SE:
                return PSupportedCurrencyCodes.SEK;
            case PSupportedLocaleIds.en:
                return null;
            default:
                throw new Error('not implemented');
        }
    }
    /**
     * @returns Returns the country code for given "locale".
     */
    static getCountryCode(locale) {
        locale = locale !== null && locale !== void 0 ? locale : Config_1.LOCALE_ID;
        const delimiterIndex = locale.indexOf('-');
        if (delimiterIndex < 0)
            return null;
        const CODE = locale.slice(delimiterIndex + 1);
        const CODE_IS_VALID = Object.values(PSupportedCountryCodes).includes(CODE);
        if (!CODE_IS_VALID && Config_1.DEBUG)
            throw new Error(`Code »${CODE}« is not supported yet.`);
        return CODE;
    }
    /**
     * Get language code by provided locale.
     * If no locale provided, the global locale will be used.
     */
    static getLanguageCode(locale) {
        locale = locale !== null && locale !== void 0 ? locale : Config_1.LOCALE_ID;
        const CODE = locale.slice(0, 2);
        const CODE_IS_VALID = Object.values(PSupportedLanguageCodes).includes(CODE);
        if (!CODE_IS_VALID && Config_1.DEBUG)
            throw new Error(`Code »${CODE}« is not supported yet.`);
        return CODE;
    }
    /**
     * Get the locale by country code.
     * Useful e.g. if you don’t have the locale but want to get the language by country code.
     */
    static getLocale(input) {
        switch (input) {
            case PSupportedCountryCodes.AT:
                return PSupportedLocaleIds.de_AT;
            case PSupportedCountryCodes.BE:
                return PSupportedLocaleIds.en_BE;
            case PSupportedCountryCodes.CH:
                return PSupportedLocaleIds.de_CH;
            case PSupportedCountryCodes.CZ:
                return PSupportedLocaleIds.en_CZ;
            case PSupportedCountryCodes.DE:
                return PSupportedLocaleIds.de_DE;
            case PSupportedCountryCodes.GB:
                return PSupportedLocaleIds.en_GB;
            case PSupportedCountryCodes.NL:
                return PSupportedLocaleIds.en_NL;
            case PSupportedCountryCodes.SE:
                return PSupportedLocaleIds.en_SE;
            case PSupportedCountryCodes.LU:
                return PSupportedLocaleIds.de_LU;
        }
    }
    /**
     * Is the app being shown on a mobile application?
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    static get IS_MOBILE() {
        return Config_1.userAgentIsMobile || Config_1.windowWidth < 992;
    }
    /**
     * @returns "name" is browser-name in lower case.
     * 	"version" contains only the major browser version (so it can be returned as type "number").
     */
    static get browser() {
        return getBrowserInfoByUserAgent(window.navigator.userAgent);
    }
};
Config.userAgentIsMobile = false;
Config.BACKEND_URL = ENVIRONMENT.BACKEND_URL_VALUE;
Config.FRONTEND_URL = ENVIRONMENT.FRONTEND_URL_VALUE;
Config.DEBUG = ENVIRONMENT.DEBUG_VALUE;
Config.APPLICATION_MODE = ENVIRONMENT.APPLICATION_MODE;
Config.IS_STAGING = ENVIRONMENT.IS_STAGING;
Config.API_IMAGE_BASE_URL = ENVIRONMENT.API_IMAGE_BASE_URL;
Config.ADYEN_MODE = ENVIRONMENT.ADYEN_MODE;
Config.ADYEN_CLIENT_KEY = ENVIRONMENT.ADYEN_CLIENT_KEY;
Config.ADYEN_MERCHANT = ENVIRONMENT.ADYEN_MERCHANT;
Config.LAUNCH_DARKLY_CLIENT_ID = ENVIRONMENT.LAUNCH_DARKLY_CLIENT_ID;
Config.RECAPTCHA_V3_SITE_KEY = ENVIRONMENT.RECAPTCHA_V3_SITE_KEY;
Config.PAYPAL_SHUTDOWN_DATE = 1642287540000; // = 15.1.2022, 23:59
Config.NEW_TRANSACTION_STYLE_WITHOUT_VAT_DATE = 1651356000000; // = 1.5.2022 0:00
/**
 * Timestamp of date of release 3.0.0 | Adyen.
 */
Config.ADYEN_RELEASE_DATE = 1636581600000; // = 1.11.2021, 2:00
// TODO: [PLANO-105130]
Config.ONBOARDING_DISCOUNT_DATE = 1640998800000; // = 1.1.2022, 02:00
/**
 * Http authentication code. This value is set during runtime when users login data are available.
 */
Config.HTTP_AUTH_CODE = null;
/**
 * The path to the log-out page. Can not be changed by the application.
 */
Config.LOGOUT_PATH = '/client/logout';
Config.platform = null;
Config.ANGULAR_FIRE_MESSAGING_ENABLED = false;
Config = Config_1 = __decorate([
    Injectable()
], Config);
export { Config };
Config.initialize();
//# sourceMappingURL=config.js.map