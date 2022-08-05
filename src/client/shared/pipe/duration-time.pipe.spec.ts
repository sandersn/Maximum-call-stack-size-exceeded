import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { PDurationTimePipe, SupportedDurationTimePipeUnits } from './duration-time.pipe';
import { LogService } from '../../../shared/core/log.service';
import { LocalizePipe } from '../../../shared/core/pipe/localize.pipe';
import { PSentryService } from '../../../shared/sentry/sentry.service';
import { PMomentService } from '../p-moment.service';

describe('#PDurationTimePipe', () => {
	let pipe : PDurationTimePipe;

	beforeAll(() => {
		const L = PSupportedLocaleIds.de_DE;
		const moment = new PMomentService(L);
		const pSentryService = new PSentryService();
		const logService = new LogService(pSentryService);
		const localize = new LocalizePipe(logService, L);
		pipe = new PDurationTimePipe(moment, localize);
	});

	it('timestamp 123456789 should return expected result', () => {
		expect(pipe.transform(123456789, SupportedDurationTimePipeUnits.SECONDS, false)).toBe('1 Tag 10 Std. 17 Min. 36 Sek. ');
	});

	it('timestamp 123456789 should return expected result', () => {
		expect(pipe.transform(123456789, SupportedDurationTimePipeUnits.HOURS, false)).toBe('1 Tag 10 Std. ');
	});

	it('timestamp 86400000 should return expected result', () => {
		expect(pipe.transform(86400000, SupportedDurationTimePipeUnits.SECONDS, false)).toBe('1 Tag 0 Std. 00 Min. 00 Sek. ');
	});

	it('storybook examples should return expected result', () => {
		expect(pipe.transform(1586886748375, SupportedDurationTimePipeUnits.SECONDS)).toBe('18366<sub>Tage</sub> 17<sub>Std</sub> 52<sub>M</sub> 28<sub>S</sub> ');
		expect(pipe.transform(1586886748375, SupportedDurationTimePipeUnits.SECONDS, false)).toBe('18366 Tage 17 Std. 52 Min. 28 Sek. ');
		expect(pipe.transform(26 * 60 * 60 * 1000, SupportedDurationTimePipeUnits.SECONDS, false)).toBe('1 Tag 2 Std. 00 Min. 00 Sek. ');
		expect(pipe.transform(26 * 60 * 60 * 1000, SupportedDurationTimePipeUnits.SECONDS, false, true)).toBe('1 Tag 2 Std. ');
		expect(pipe.transform(19168867, SupportedDurationTimePipeUnits.SECONDS, false)).toBe('5 Std. 19 Min. 28 Sek. ');
		expect(pipe.transform(1916886, SupportedDurationTimePipeUnits.SECONDS, false)).toBe('31 Min. 56 Sek. ');
		expect(pipe.transform(19168, SupportedDurationTimePipeUnits.SECONDS, false)).toBe('19 Sek. ');
		expect(pipe.transform(0)).toBe('');
	});

});
