import { SchedulingApiShift } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { AffectedShiftsApiService} from '@plano/shared/api';
import { AffectedShiftsApiShiftsBase, AffectedShiftsApiShiftBase } from '@plano/shared/api';

export class AffectedShiftsApiShift<ValidationMode extends 'draft' | 'validated' = 'validated'> extends AffectedShiftsApiShiftBase<ValidationMode> {
	constructor(public override readonly api : AffectedShiftsApiService<ValidationMode> | null) {
		super(api);
	}

	/**
	 * Calculate how many members can be assigned till this shift is saturated
	 */
	public get emptyMemberSlots() : SchedulingApiShift['emptyMemberSlots'] {
		let result : number;
		const amountOfEmptyBadges = this.neededMembersCount - this.assignedMemberIds.length;
		if (amountOfEmptyBadges >= 0) {
			result = amountOfEmptyBadges;
		} else {
			result = 0;
		}
		return result;
	}
}

export class AffectedShiftsApiShifts<ValidationMode extends 'draft' | 'validated' = 'validated'> extends AffectedShiftsApiShiftsBase<ValidationMode> {
	constructor(public override readonly api : AffectedShiftsApiService<ValidationMode> | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems);
	}

	/**
	 * Filters a list of Shifts by a function that returns a boolean.
	 * Returns a new list of Shifts.
	 */
	public filterBy(
		fn : (item : AffectedShiftsApiShift) => boolean,
	) : AffectedShiftsApiShifts<ValidationMode> {
		const result = new AffectedShiftsApiShifts(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}
}
