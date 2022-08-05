import { DatePipe } from '@angular/common';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { PDatePipe } from './p-date.pipe';
import { PSupportedTimeZoneOffset } from '../time-zones.enums';

describe('PDatePipe', () => {
	let pipe : PDatePipe;

	beforeAll(() => {
		const L = PSupportedLocaleIds.de_DE;
		pipe = new PDatePipe(new DatePipe(L), undefined);
	});

	describe(`format: 'shortTime'`, () => {
		it('timestamp 86340000 should return 23:59 Uhr in timezone UTC±0', () => {
			expect(pipe.transform(86340000, 'shortTime', PSupportedTimeZoneOffset.NO_ZONE)).toBe('23:59 Uhr');
		});

		it('timestamp 1578345850000 should return 22:24 Uhr in timezone of Berlin', () => {
			expect(pipe.transform(1578345850000, 'shortTime', PSupportedTimeZoneOffset.EUROPE_BERLIN)).toBe('22:24 Uhr');
		});

		it('timestamp 86340000 should return 01:59 Uhr in timezone of Berlin in summer (with day saving time)', () => {
			expect(pipe.transform(86340000, 'shortTime', PSupportedTimeZoneOffset.EUROPE_BERLIN_DST)).toBe('01:59 Uhr');
		});
	});

	describe(`format: 'veryShortTime'`, () => {
		it('timestamp 86340000 should return 23:59 in timezone UTC±0', () => {
			expect(pipe.transform(86340000, 'veryShortTime', PSupportedTimeZoneOffset.NO_ZONE)).toBe('23:59');
		});

		it('timestamp 1578345850000 should return 22:24 in timezone of Berlin', () => {
			expect(pipe.transform(1578345850000, 'veryShortTime', PSupportedTimeZoneOffset.EUROPE_BERLIN)).toBe('22:24');
		});

		it('timestamp 86340000 should return 1:59 in timezone of Berlin in summer (with day saving time)', () => {
			expect(pipe.transform(86340000, 'veryShortTime', PSupportedTimeZoneOffset.EUROPE_BERLIN_DST)).toBe('01:59');
		});

		// TODO: PLANO-122678 test einschalten
		// it('timestamp 0 should return 0:00 in timezone of Berlin in summer (with day saving time)', () => {
		// 	expect(pipe.transform(0, 'veryShortTime', PSupportedTimeZoneOffset.EUROPE_BERLIN_DST)).toBe('0:00');
		// });
	});
});
