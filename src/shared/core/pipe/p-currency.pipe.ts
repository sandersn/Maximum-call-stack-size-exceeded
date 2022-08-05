import { CurrencyPipe} from '@angular/common';
import { getLocaleNumberSymbol, NumberSymbol } from '@angular/common';
import { PipeTransform } from '@angular/core';
import { Pipe } from '@angular/core';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { PSupportedCurrencyCodes } from '@plano/shared/api/base/generated-types.ag';
import { SchedulingApiPaymentMethodType, SchedulingApiTransactionPaymentMethodType } from '../../api/scheduling-api/scheduling-api.service.ag';
import { FaIcon, PFaIcon } from '../component/fa-icon/fa-icon-types';
import { Config } from '../config';
import { LogService } from '../log.service';
import { PlanoFaIconPool } from '../plano-fa-icon-pool.enum';

@Pipe({ name: 'currency' })

export class PCurrencyPipe implements PipeTransform {
	constructor(
		private currencyPipe : CurrencyPipe | null,
		private console : LogService | null,
	) {
	}

	public transform(
		value : string | number,
		// TODO: remove | 'EUR'
		currencyCode ?: PSupportedCurrencyCodes | `${PSupportedCurrencyCodes}` | null,
		display ?: Parameters<CurrencyPipe['transform']>[2],
		digitsInfo ?: string,
		locale ?: PSupportedLocaleIds,
		trimUnnecessaryZeros ?: boolean,
		alwaysShowPrependingSign ?: boolean,
	) : string;
	public transform(
		value : string | number | null,
		// TODO: remove | 'EUR'
		currencyCode ?: PSupportedCurrencyCodes | `${PSupportedCurrencyCodes}` | null,
		display ?: Parameters<CurrencyPipe['transform']>[2],
		digitsInfo ?: string,
		locale ?: PSupportedLocaleIds,
		trimUnnecessaryZeros ?: boolean,
		alwaysShowPrependingSign ?: boolean,
	) : string | null;

	/**
	 * Turn a number into a country-specific currency format.
	 * @param value amount of money as float
	 * @param currencyCode the code of the currency
	 * @param display a formatting
	 * @param digitsInfo TODO: Description missing here
	 * @param locale information about the country
	 * @param trimUnnecessaryZeros removes 00 from 2,00 €
	 * @param alwaysShowPrependingSign Shows prepending sign no matter if positive or negative amount.
	 * 		Turns 2€ and -3,50€ into +2€ and -3,50€
	 */
	public transform(
		value : string | number | null,
		// TODO: remove | 'EUR'
		currencyCode ?: PSupportedCurrencyCodes | `${PSupportedCurrencyCodes}` | null,
		display ?: Parameters<CurrencyPipe['transform']>[2],
		digitsInfo ?: string,
		locale ?: PSupportedLocaleIds,
		trimUnnecessaryZeros ?: boolean,
		alwaysShowPrependingSign ?: boolean,
	) : string | null {
		if (!this.currencyPipe) throw new Error('currencyPipe is not available');
		if (value === null) return null;

		if (typeof value === 'string' && value.match(/\d+[,.]/)) {
			value = value.replace(/[,.]/, '');
		}

		if (typeof value === 'string' && Number.isNaN(+value)) value = null;

		let code = (() => {
			if (currencyCode) return currencyCode;
			if (locale) return Config.getCurrencyCode(locale);
			return Config.CURRENCY_CODE;
		})();
		if (code === null) {
			code = PSupportedCurrencyCodes.EUR;
			if (Config.DEBUG) this.console?.error('currencyCode could not be determined');
		}

		let result : string | null = null;
		if (alwaysShowPrependingSign && value !== null && value > 0) {
			// If the currency sign is at the front of the string, we have to place the prepending sign between currency symbol and value.
			const invertedResult = this.currencyPipe.transform(-value, code.toString(), display, digitsInfo, locale);
			if (!invertedResult) throw new Error('invertedResult is not defined');
			result = invertedResult.replace('-', `+`);
		} else {
			result = this.currencyPipe.transform(value, code.toString(), display, digitsInfo, locale);
		}

		// Remove all unnecessary whitespace
		if (result) result = result.trim();
		// Remove trailing `,00` if trimUnnecessaryZeros is true

		if (result && trimUnnecessaryZeros) {
			const decimalSeparator = getLocaleNumberSymbol(locale ?? Config.LOCALE_ID, NumberSymbol.Decimal);
			const thousandsSeparator = decimalSeparator === ',' ? '.' : ',';
			const REGEX_STRING = `((?:.*\u00A0)?-?)?(0|(?:[1-9](?:[0-9]{1,2})?(?:[\\${thousandsSeparator}]?[0-9]{0,3})*))([\\${decimalSeparator}]00)?(\u00A0.*)?`;
			result = result.replace(new RegExp(REGEX_STRING), '$1$2$4');
		}

		return result;
	}

	/**
	 * Get a fontawesome icon name for provided currency
	 */
	public getCurrencyIcon(currencyCode ?: PSupportedCurrencyCodes | null) : PFaIcon {
		let code = currencyCode ?? Config.CURRENCY_CODE;
		if (code === null) {
			this.console?.error(`Currency code should be defined here. Currency code is »null«`);
			code = PSupportedCurrencyCodes.EUR;
		}
		switch (code) {
			case PSupportedCurrencyCodes.EUR : case PSupportedCurrencyCodes[PSupportedCurrencyCodes.EUR] :
				return PlanoFaIconPool.EUR;
			case PSupportedCurrencyCodes.GBP : case PSupportedCurrencyCodes[PSupportedCurrencyCodes.GBP] :
				return PlanoFaIconPool.GBP;
			case PSupportedCurrencyCodes.CHF : case PSupportedCurrencyCodes[PSupportedCurrencyCodes.CHF] :

				/**
				 * Sadly fontawesome has no icon for CHF. See: https://github.com/FortAwesome/Font-Awesome/issues/10896
				 * When we get our first swiss customer then its time to add a CHF icon.
				 */
				return 'coins';
			case PSupportedCurrencyCodes.CZK : case PSupportedCurrencyCodes[PSupportedCurrencyCodes.CZK] :
				return 'czk-sign';
			case PSupportedCurrencyCodes.SEK :
				return 'kr';
			default :
				if (Config.DEBUG) {
					const missingCode : never = code;
					this.console?.error(`Currency not supported yet: »${missingCode}«`);
				}
				return 'coins';
		}
	}

	/**
	 * Get a fontawesome icon name for provided payment method
	 */
	public getPaymentMethodIcon(
		paymentMethodType : SchedulingApiTransactionPaymentMethodType | SchedulingApiPaymentMethodType | null,
		name : string | null,
	) : FaIcon | null {
		switch (paymentMethodType) {
			case SchedulingApiPaymentMethodType.ONLINE_PAYMENT:
			case SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT:
				return PlanoFaIconPool.ONLINE_PAYMENT;
			case SchedulingApiPaymentMethodType.PAYPAL:
			case SchedulingApiTransactionPaymentMethodType.PAYPAL:
				return PlanoFaIconPool.BRAND_PAYPAL;
			case SchedulingApiTransactionPaymentMethodType.POS:
				return 'cash-register';
			case SchedulingApiTransactionPaymentMethodType.MISC:
			default:
				break;
		}

		if (!name) return null;
		return this.determinePaymentMethodIconByName(name);
	}

	private determinePaymentMethodIconByName(name : string) : FaIcon {
		// Write the phrases in lower case as all payment methods are set to lower case before the matching starts.
		const NAME = name.toLowerCase();
		if (NAME.includes('kasse') || NAME.includes('vor ort') || NAME.includes('vorort') || NAME.includes('vor-ort') || NAME.includes('on-site') || NAME.includes('bar') || NAME.includes('theke') || NAME.includes('halle') || NAME.includes('counter') || NAME.includes('wettkampftag')) return 'cash-register';
		if (NAME.includes('er karte') || NAME.includes('abo') || NAME.includes('dauerkarte') || NAME.includes('mitglied')) return 'address-card';
		if (NAME.includes('überweisung')) return 'money-check';
		if (NAME.includes('bezahlung')) return 'wallet';
		if (NAME.includes('lastschrift') || NAME.includes('einzug') || NAME.includes('sepa')) return 'university';
		if (NAME.includes('gutschein') || NAME.includes('voucher') || NAME.includes('gift')) return 'gift';
		if (NAME.includes('rechnung') || NAME.includes('invoice') || NAME.includes('bill')) return 'file-alt';
		if (NAME.includes('urban')) return 'barcode';
		if (NAME.includes('mastercard')) return ['fab', 'cc-mastercard'];
		if (NAME.includes('visa')) return ['fab', 'cc-visa'];
		if (NAME.includes('google')) return ['fab', 'google-pay'];
		if (NAME.includes('apple')) return ['fab', 'apple-pay'];
		if (NAME.includes('amazon')) return ['fab', 'amazon-pay'];
		if (NAME.includes('ideal')) return ['fab', 'ideal'];
		if (NAME.includes('kreditkarte') || NAME.includes('credit card')) return 'credit-card';
		if (NAME.includes('bitcoin')) return ['fab', 'bitcoin'];
		if (NAME.includes('paypal')) return PlanoFaIconPool.BRAND_PAYPAL;
		return 'piggy-bank';
	}
}
