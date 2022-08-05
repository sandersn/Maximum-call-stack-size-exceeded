import { SchedulingModule } from '@plano/client/scheduling/scheduling.module';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '@plano/shared/core/config';
import { TestingUtils } from '@plano/shared/testing/testing-utils';
import { FormattedDateTimePipe } from './formatted-date-time.pipe';

describe('#FormattedDateTimePipe', () => {
	let service : FormattedDateTimePipe;
	const testingUtils = new TestingUtils();

	testingUtils.init({
		imports: [SchedulingModule],
	});

	beforeAll(done => {
		service = testingUtils.getService(FormattedDateTimePipe);
		Config.LOCALE_ID = PSupportedLocaleIds.de_DE;
		done();
	});

	it('should have a defined instance', () => {
		expect(service).toBeDefined();
	});

	describe('getFormattedDateInfo()#IO', () => {
		it('(undefined, undefined)', () => {
			expect(service.getFormattedDateInfo(null, null).full).toBe(null);
		});

		it('(1583971200000, 1583971200000)', () => {
			const dateInfo = service.getFormattedDateInfo(1583971200000, 1583971200000);
			expect(dateInfo.start).toBe('');
			expect(dateInfo.separator).toBe('');
			expect(dateInfo.end).toBe('12. März  2020');
			expect(dateInfo.full).toBe('12. März  2020');
		});

		it('(1583971200000, 1583971200000, true)', () => {
			const dateInfo = service.getFormattedDateInfo(1583971200000, 1583971200000, true);
			expect(dateInfo.start).toBe('');
			expect(dateInfo.separator).toBe('');
			expect(dateInfo.end).toBe('12.03.20');
			expect(dateInfo.full).toBe('12.03.20');
		});

		it('(1584000000000, 1584032400000, true)', () => {
			const dateInfo = service.getFormattedDateInfo(1584000000000, 1584032400000, true);
			expect(dateInfo.start).toBe('');
			expect(dateInfo.separator).toBe('');
			expect(dateInfo.end).toBe('12.03.20');
			expect(dateInfo.full).toBe('12.03.20');
		});

		it('(1584000000000, 1584057600000, true)', () => {
			const dateInfo = service.getFormattedDateInfo(1584000000000, 1584057600000, true);
			expect(dateInfo.start).toBe('12.03.');
			expect(dateInfo.separator).toBe(' – ');
			expect(dateInfo.end).toBe('13.03.20');
			expect(dateInfo.full).toBe('12.03. – 13.03.20');
		});

		it('(1584000000000, 1586678400000, true)', () => {
			const dateInfo = service.getFormattedDateInfo(1584000000000, 1586678400000, true);
			expect(dateInfo.start).toBe('12.03.');
			expect(dateInfo.separator).toBe(' – ');
			expect(dateInfo.end).toBe('12.04.20');
			expect(dateInfo.full).toBe('12.03. – 12.04.20');
		});

		it('(1584000000000, 1618214400000, true)', () => {
			const dateInfo = service.getFormattedDateInfo(1584000000000, 1618214400000, true);
			expect(dateInfo.start).toBe('12.03.20');
			expect(dateInfo.separator).toBe(' – ');
			expect(dateInfo.end).toBe('12.04.21');
			expect(dateInfo.full).toBe('12.03.20 – 12.04.21');

		});
	});

	describe('getFormattedTimeInfo()#IO', () => {
		it('(1583971200000, 1583971200000)', () => {
			const dateInfo = service.getFormattedTimeInfo(1583971200000, 1583971200000);
			expect(dateInfo.start).toBe('01:00 Uhr');
			expect(dateInfo.separator).toBe(null);
			expect(dateInfo.end).toBe(null);
			expect(dateInfo.full).toBe('01:00 Uhr');
		});

		it('(1583971200000, 1583971200000, true)', () => {
			const dateInfo = service.getFormattedTimeInfo(1583971200000, 1583971200000, true);
			expect(dateInfo.start).toBe('01:00');
			expect(dateInfo.separator).toBe(null);
			expect(dateInfo.end).toBe(null);
			expect(dateInfo.full).toBe('01:00');
		});

		it('(1584000000000, 1584032400000, true)', () => {
			const dateInfo = service.getFormattedTimeInfo(1584000000000, 1584032400000, true);
			expect(dateInfo.start).toBe('09:00');
			expect(dateInfo.separator).toBe(' – ');
			expect(dateInfo.end).toBe('18:00');
			expect(dateInfo.full).toBe('09:00 – 18:00');
		});

	});
});
