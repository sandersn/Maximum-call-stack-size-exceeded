import { PSupportedLanguageCodes, PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { LocalizePipe } from './localize.pipe';
import { PSentryService } from '../../sentry/sentry.service';
import { LogService } from '../log.service';

describe('LocalizePipe', () => {
	let pipe : LocalizePipe = null!;
	let logService : LogService = null!;

	beforeAll(() => {
		const pSentryService = new PSentryService();
		logService = new LogService(pSentryService);
	});

	describe('en', () => {
		beforeAll(() => {
			pipe = new LocalizePipe(logService, PSupportedLocaleIds.en);
			pipe.languageTestSetter(PSupportedLanguageCodes.en);
		});

		it('should translate »Hallo Welt«', () => {
			expect(pipe.transform('Hallo Welt')).toBe('Hello World');
		});

		it('should replace variables in »Hallo ${name}«', () => {
			expect(pipe.transform('Hallo ${name}.', { name: 'Nils' })).toBe('Nils, yo!');
		});

		it('should replace variables if they are used twice', () => {
			const result = pipe.transform('Hallo ${name}, ${name} ist ein schöner Name!', { name: 'Nils' });
			expect(result).toBe('Yo Nils, Nils is a wonderful name!');
		});

		it('first letter of nouns in translation', () => {
			const result = pipe.transform('Im Deutschen wird ${shiftPluralisation} im Satz groß geschrieben.', {
				shiftPluralisation: pipe.transform('Schichten'),
			});
			expect(result).toBe('In english, shifts should be lowercase.');
		});

		it('first letter of names in translation', () => {
			const member = { firstName : 'Nils' };
			const result = pipe.transform('Im Deutschen wird der erste Buchstabe von ${firstName} immer groß geschrieben.', {
				firstName: member.firstName,
			});
			expect(result).toBe('In english the first letter of Nils will always be uppercase.');
		});

		// FIXME: PLANO-44423
		// it('first letter of nouns in translation when at beginning of a sentence', () => {
		// 	const result = pipe.transform('${shiftPluralisation} wird am Anfang eines Satzes immer groß geschrieben.', {
		// 		shiftPluralisation: pipe.transform('Schichten'),
		// 	});
		// 	expect(result).toBe('Shifts, if placed at the beginning of a sentence, will always be uppercase.');
		// });

	});
});

