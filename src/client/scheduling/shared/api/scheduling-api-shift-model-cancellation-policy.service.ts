import { SchedulingApiServiceBase} from '@plano/shared/api';
import { SchedulingApiShiftModelCancellationPolicyFeePeriodBase, SchedulingApiShiftModelCancellationPolicyFeePeriodsBase } from '@plano/shared/api';
import { Days } from '../../../../shared/api/base/generated-types.ag';
import { PPossibleErrorNames, PValidatorObject } from '../../../../shared/core/validators.types';


export class SchedulingApiShiftModelCancellationPolicyFeePeriods<ValidationMode extends 'draft' | 'validated' = 'validated'> extends
	SchedulingApiShiftModelCancellationPolicyFeePeriodsBase<ValidationMode> {
	constructor(
		public override api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/**
	 * Throws a validation error when the first fee period in the list does not have `start` equal `null`.
	 */
	public checkFirstPeriodShouldHaveNullStart() : PValidatorObject {
		return new PValidatorObject({name: PPossibleErrorNames.FIRST_FEE_PERIOD_START_IS_NULL, fn: (_control) => {

			if (this.length <= 0) return null;
			const firstItem = this.get(0)!;

			// An undefined start is not valid. So the user has to fix this first anyway.
			if (firstItem.start as Days | undefined === undefined) return null;

			if (firstItem.start === null) return null;

			return { [PPossibleErrorNames.FIRST_FEE_PERIOD_START_IS_NULL]: {
				name: PPossibleErrorNames.FIRST_FEE_PERIOD_START_IS_NULL,
				primitiveType: null,
				actual: firstItem.start,
			}};
		}});
	}
}
export class SchedulingApiShiftModelCancellationPolicyFeePeriod<ValidationMode extends 'draft' | 'validated' = 'validated'> extends
	SchedulingApiShiftModelCancellationPolicyFeePeriodBase<ValidationMode> {
	constructor(
		public override api : SchedulingApiServiceBase | null,
	) {
		super(api);
	}

	/**
	 * Returns the `end` automatically calculated based on the `start` of the next period.
	 * This value is calculated in Frontend so it is also available during item creation.
	 */
	public override get end() : Days | null {
		if (!this.parent) return null;

		const index = this.parent.indexOf(this);
		const nextPeriod = this.parent.get(index + 1);

		if (nextPeriod === null)
			return null;

		const startOfNextPeriod = nextPeriod.start;
		if (startOfNextPeriod === null) return null;
		// eslint-disable-next-line unicorn/prefer-number-properties
		if (isNaN(startOfNextPeriod)) throw new Error('startOfNextPeriod must be a number here');
		return startOfNextPeriod + 1;
	}
}

