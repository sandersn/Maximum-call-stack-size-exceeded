import { DatePipe } from '@angular/common';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { PDurationPipe } from './p-duration.pipe';

describe('#PDurationPipe', () => {
	let pipe : PDurationPipe;

	beforeAll(() => {
		const L = PSupportedLocaleIds.de_DE;
		const DATE_PIPE = new DatePipe(L);
		const P_DATE_PIPE = new PDatePipe(DATE_PIPE, undefined);
		pipe = new PDurationPipe(L, P_DATE_PIPE);
	});

	it('timestamp 34200000 should return 09:30 Uhr', () => {
		expect(pipe.transform(34200000)).toBe('09:30 Uhr');
	});

	it('timestamp 86340000 should return 23:59 Uhr', () => {
		expect(pipe.transform(86340000)).toBe('23:59 Uhr');
	});
});
