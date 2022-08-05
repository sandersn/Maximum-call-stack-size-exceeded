import { SchedulingApiShiftBase } from '@plano/shared/api';
import { CallByRef } from './call-by-ref';

describe('CallByRef #api-less', () => {
	const callByRef = new CallByRef<SchedulingApiShiftBase>();

	it('should create', () => {
		expect(callByRef).toBeDefined();
	});
});
