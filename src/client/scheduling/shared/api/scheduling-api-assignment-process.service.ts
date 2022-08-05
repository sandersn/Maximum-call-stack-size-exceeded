import { SchedulingApiServiceBase} from '@plano/shared/api';
import { SchedulingApiAssignmentProcessShiftRefsBase } from '@plano/shared/api';
import { SchedulingApiShifts } from './scheduling-api.service';

export class SchedulingApiAssignmentProcessShiftRefs<ValidationMode extends 'draft' | 'validated' = 'validated'> extends
	SchedulingApiAssignmentProcessShiftRefsBase<ValidationMode> {
	constructor(
		public override api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public containsAnyShift(shifts : SchedulingApiShifts) : boolean {
		return this.some((item) => {
			return shifts.some((shift) => item.id.equals(shift.id));
		});
	}
}
