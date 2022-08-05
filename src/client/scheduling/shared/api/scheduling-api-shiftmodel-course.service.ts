import { SchedulingApiServiceBase, SchedulingApiCustomBookableMailEventType, SchedulingApiShiftModelCoursePaymentMethod } from '@plano/shared/api';
import { SchedulingApiShiftModelCourseTariffsBase, SchedulingApiShiftModelCourseTariffBase, SchedulingApiShiftModelCoursePaymentMethodsBase, SchedulingApiCustomBookableMailsBase } from '@plano/shared/api';

export class SchedulingApiCustomBookableMails<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiCustomBookableMailsBase<ValidationMode> {
	constructor(
		public override api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/**
	 * get a list of
	 */
	public getByEventType( eventType : SchedulingApiCustomBookableMailEventType ) : SchedulingApiCustomBookableMails {
		const list = new SchedulingApiCustomBookableMails(this.api, false);
		for (const item of this.iterable()) {
			if (item.eventType === eventType) {
				list.push(item);
			}
		}
		return list;
	}
}

export class SchedulingApiShiftModelCoursePaymentMethods<ValidationMode extends 'draft' | 'validated' = 'validated'> extends
	SchedulingApiShiftModelCoursePaymentMethodsBase<ValidationMode> {
	constructor(
		public override api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/**
	 * Check if there is at least one untrashed item
	 */
	public get hasUntrashedItem() : boolean {
		return this.some(item => !item.trashed);
	}

	/**
	 * Filters a list of Shifts by a function that returns a boolean.
	 * Returns a new list of Shifts.
	 */
	public filterBy(
		fn : (item : SchedulingApiShiftModelCoursePaymentMethod) => boolean,
	) : SchedulingApiShiftModelCoursePaymentMethods {
		const result = new SchedulingApiShiftModelCoursePaymentMethods(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}

}

export class SchedulingApiShiftModelCourseTariff<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiShiftModelCourseTariffBase<ValidationMode> {
	constructor( public override api : SchedulingApiServiceBase | null ) {
		super(api);
	}

	/**
	 * Get total fee for specific booking
	 */
	public getTotalFee(participantCount : number) : number {
		if (participantCount === 0) return 0;

		let result = 0;
		for (const fee of this.fees.iterable()) {
			const times = Math.ceil(participantCount / fee.perXParticipants);
			result += (fee.fee * times);
		}
		return result;
	}
}

export class SchedulingApiShiftModelCourseTariffs<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiShiftModelCourseTariffsBase<ValidationMode> {
	constructor(
		public override api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/**
	 * Check if there is at least one untrashed item
	 */
	public get hasUntrashedItem() : boolean {
		return this.some(item => !item.trashed);
	}

	/**
	 * Filters a list of Shifts by a function that returns a boolean.
	 * Returns a new list of Shifts.
	 */
	public filterBy(
		fn : (item : SchedulingApiShiftModelCourseTariff) => boolean,
	) : SchedulingApiShiftModelCourseTariffs {
		const result = new SchedulingApiShiftModelCourseTariffs(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}

}
