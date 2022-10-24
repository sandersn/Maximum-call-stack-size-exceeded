import { SchedulingApiShiftModelCancellationPolicyFeePeriodBase, SchedulingApiShiftModelCancellationPolicyFeePeriodsBase } from '@plano/shared/api';
import { PPossibleErrorNames, PValidatorObject } from '../../../../shared/core/validators.types';
export class SchedulingApiShiftModelCancellationPolicyFeePeriods extends SchedulingApiShiftModelCancellationPolicyFeePeriodsBase {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems);
        this.api = api;
    }
    /**
     * Throws a validation error when the first fee period in the list does not have `start` equal `null`.
     */
    checkFirstPeriodShouldHaveNullStart() {
        return new PValidatorObject({ name: PPossibleErrorNames.FIRST_FEE_PERIOD_START_IS_NULL, fn: (_control) => {
                if (this.length <= 0)
                    return null;
                const firstItem = this.get(0);
                // An undefined start is not valid. So the user has to fix this first anyway.
                if (firstItem.start === undefined)
                    return null;
                if (firstItem.start === null)
                    return null;
                return { [PPossibleErrorNames.FIRST_FEE_PERIOD_START_IS_NULL]: {
                        name: PPossibleErrorNames.FIRST_FEE_PERIOD_START_IS_NULL,
                        primitiveType: null,
                        actual: firstItem.start,
                    } };
            } });
    }
}
export class SchedulingApiShiftModelCancellationPolicyFeePeriod extends SchedulingApiShiftModelCancellationPolicyFeePeriodBase {
    constructor(api) {
        super(api);
        this.api = api;
    }
    /**
     * Returns the `end` automatically calculated based on the `start` of the next period.
     * This value is calculated in Frontend so it is also available during item creation.
     */
    get end() {
        if (!this.parent)
            return null;
        const index = this.parent.indexOf(this);
        const nextPeriod = this.parent.get(index + 1);
        if (nextPeriod === null)
            return null;
        const startOfNextPeriod = nextPeriod.start;
        if (startOfNextPeriod === null)
            return null;
        // eslint-disable-next-line unicorn/prefer-number-properties
        if (isNaN(startOfNextPeriod))
            throw new Error('startOfNextPeriod must be a number here');
        return startOfNextPeriod + 1;
    }
}
//# sourceMappingURL=scheduling-api-shift-model-cancellation-policy.service.js.map