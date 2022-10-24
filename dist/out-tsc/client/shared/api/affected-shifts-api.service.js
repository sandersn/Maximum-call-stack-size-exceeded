import { AffectedShiftsApiShiftsBase, AffectedShiftsApiShiftBase } from '@plano/shared/api';
export class AffectedShiftsApiShift extends AffectedShiftsApiShiftBase {
    constructor(api) {
        super(api);
        this.api = api;
    }
    /**
     * Calculate how many members can be assigned till this shift is saturated
     */
    get emptyMemberSlots() {
        let result;
        const amountOfEmptyBadges = this.neededMembersCount - this.assignedMemberIds.length;
        if (amountOfEmptyBadges >= 0) {
            result = amountOfEmptyBadges;
        }
        else {
            result = 0;
        }
        return result;
    }
}
export class AffectedShiftsApiShifts extends AffectedShiftsApiShiftsBase {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems);
        this.api = api;
    }
    /**
     * Filters a list of Shifts by a function that returns a boolean.
     * Returns a new list of Shifts.
     */
    filterBy(fn) {
        const result = new AffectedShiftsApiShifts(this.api, false);
        for (const item of this.iterable()) {
            if (!fn(item))
                continue;
            result.push(item);
        }
        return result;
    }
}
//# sourceMappingURL=affected-shifts-api.service.js.map