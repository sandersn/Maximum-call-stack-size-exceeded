import { SchedulingApiAssignmentProcessShiftRefsBase } from '@plano/shared/api';
export class SchedulingApiAssignmentProcessShiftRefs extends SchedulingApiAssignmentProcessShiftRefsBase {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems);
        this.api = api;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    containsAnyShift(shifts) {
        return this.some((item) => {
            return shifts.some((shift) => item.id.equals(shift.id));
        });
    }
}
//# sourceMappingURL=scheduling-api-assignment-process.service.js.map