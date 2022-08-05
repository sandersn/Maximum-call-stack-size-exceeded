import { CurrencyPipe } from '@angular/common';
import { PCurrencyPipe } from './p-currency.pipe';
import { PSupportedCurrencyCodes, PSupportedLocaleIds } from '../../api/base/generated-types.ag';
import { PSentryService } from '../../sentry/sentry.service';
import { Config } from '../config';
import { LogService } from '../log.service';

describe('PCurrencyPipe', () => {
	let pipe : PCurrencyPipe;
	let currencyPipe : CurrencyPipe;
	let logService : LogService;

	beforeAll(() => {
		currencyPipe = new CurrencyPipe(Config.LOCALE_ID);
		const pSentryService = new PSentryService();
		logService = new LogService(pSentryService);
	});

	describe('en', () => {
		beforeAll(() => {
			pipe = new PCurrencyPipe(currencyPipe, logService);
		});

		// const addIt = () => {}
		it('1 should be $1.00', () => {
			const newCurrencyPipeInstance = new CurrencyPipe('en-US');
			const value = '1';
			const expected = '$1.00';

			expect(newCurrencyPipeInstance.transform(value)).toEqual(expected);
		});

		it('1 should be 1,00 EUR', () => {
			const newCurrencyPipeInstance = new CurrencyPipe('en-US');
			const value = 1;
			const expected = '1,00\u00A0EUR';

			expect(newCurrencyPipeInstance.transform(value, 'EUR', false, undefined, 'de-DE')).toEqual(expected);
		});

		it('should transform »1«', () => {
			const value = pipe.transform(1);
			const expected = '1,00\u00A0€';
			expect(value).toBe(expected);
		});
		it('should transform »1234.56«', () => {
			const value = pipe.transform(1234.56);
			const expected = '1.234,56\u00A0€';
			expect(value).toBe(expected);
		});

		it('should transform »1« and trim', () => {
			const value = pipe.transform(1, PSupportedCurrencyCodes.EUR, undefined, undefined, undefined, true, undefined);
			const expected = '1\u00A0€';
			expect(value).toBe(expected);
		});
		it('should transform »1000« to »1.000«', () => {
			const value = pipe.transform(1000, PSupportedCurrencyCodes.EUR, '', undefined, PSupportedLocaleIds.en_NL, true);
			const expected = '1.000';
			expect(value).toBe(expected);
		});

		// cSpell:ignore prepending
		it('should add a prepending sign 1', () => {
			expect(pipe.transform(1, PSupportedCurrencyCodes.EUR, undefined, undefined, undefined, true, true)).toBe('+1\u00A0€');
		});
		it('should add a prepending sign 2', () => {
			expect(pipe.transform(1, PSupportedCurrencyCodes.EUR, undefined, undefined, PSupportedLocaleIds.en_NL, true, true)).toBe('€\u00A0+1');
		});
		it('should add a prepending sign to wide symbol', () => {
			expect(pipe.transform(1, PSupportedCurrencyCodes.EUR, 'code', undefined, PSupportedLocaleIds.en_NL, true, true)).toBe('EUR\u00A0+1');
		});
		it('should add a prepending minus', () => {
			expect(pipe.transform(-1, PSupportedCurrencyCodes.EUR, 'code', undefined, PSupportedLocaleIds.en_NL, true, true)).toBe('EUR\u00A0-1');
		});
	});
});

