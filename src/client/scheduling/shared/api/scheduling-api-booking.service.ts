import { SchedulingApiBookable } from './scheduling-api-bookable.service';
import { SchedulingApiTransactions } from './scheduling-api-transactions.service';
import { SchedulingApiShiftModel } from './scheduling-api.service';
import { PPaymentStatusEnum } from './scheduling-api.utils';
import { SchedulingApiBookingBase, SchedulingApiBookingState, SchedulingApiBookingsBase, SchedulingApiBookingParticipantBase } from '../../../../shared/api';
import { SchedulingApiServiceBase, SchedulingApiShiftModelCoursePaymentMethods } from '../../../../shared/api';
import { ApiAttributeInfo } from '../../../../shared/api/base/api-attribute-info';
import { PApiPrimitiveTypes } from '../../../../shared/api/base/generated-types.ag';
import { Currency } from '../../../../shared/api/base/generated-types.ag';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../shared/core/null-type-utils';

export class SchedulingApiBooking<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiBookingBase<ValidationMode> {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	constructor( public override api : SchedulingApiServiceBase | null, idRaw ?: any) {
		super(api, idRaw);
	}

	/**
	 * This Price is independent from the type of booking. So a canceled request can also have a price.
	 */
	public get price() : Currency {
		const MODEL = this.model;
		assumeDefinedToGetStrictNullChecksRunning(MODEL, 'MODEL');

		if (this.overallTariffId !== null) {
			const tariff = MODEL.courseTariffs.get(this.overallTariffId);
			if (!tariff) throw new Error('Could not get tariff');
			return tariff.getTotalFee(this.participantCount);
		}

		let price = 0;
		for (const participant of this.participants.iterable()) {
			if (participant.tariffId !== null) {
				const tariff = MODEL.courseTariffs.get(participant.tariffId);
				if (!tariff) throw new Error('Could not get tariff');
				const firstFee = tariff.fees.get(0);
				if (!firstFee) throw new Error('Could not get firstFee');
				price += firstFee.fee;
			}
		}
		return price;
	}

	/**
	 * shorthand that returns the related model
	 */
	public get model() : SchedulingApiShiftModel {
		// NOTE: This methods exists on multiple classes:
		// TimeStampApiShift
		// SchedulingApiShift
		// SchedulingApiBooking
		// SchedulingApiTodaysShiftDescription
		const SHIFT_MODEL = this.api!.data.shiftModels.get(this.shiftModelId);
		assumeNonNull(SHIFT_MODEL, 'SHIFT_MODEL');

		return SHIFT_MODEL;
	}

	/**
	 * Get the name based on the linked shiftModel
	 */
	public get name() : SchedulingApiShiftModel['name'] {
		// NOTE: This methods exists on multiple classes:
		// SchedulingApiBooking
		return this.model.name;
	}

	/**
	 * @returns All transactions belonging to this booking.
	 */
	public get transactions() : SchedulingApiTransactions {
		return this.api!.data.transactions.filterBy(item => this.id.equals(item.bookingId));
	}

	/**
	 * getter for the status of payment
	 */
	public get paymentStatus() : PPaymentStatusEnum | null {
		return SchedulingApiBookable.paymentStatus(this);
	}

	/**
	 * A bookable is void when it was canceled or declined and is merely held for history purpose.
	 */
	public get isVoidBookable() : boolean {
		return this.state === SchedulingApiBookingState.CANCELED || this.state === SchedulingApiBookingState.INQUIRY_DECLINED;
	}

	public attributeInfoAmountToPay =  new ApiAttributeInfo<SchedulingApiBooking, Currency>({
		apiObjWrapper: this,
		name: 'amountToPay',
		id: 'BOOKING_AMOUNT_TO_PAY',
		primitiveType: PApiPrimitiveTypes.Currency,
		canEdit: () => false,
		readMode: () => true,
	});

	/**
	 * How much needs to be paid for this booking overall. This value is independent of how much has been paid already (i.e. `currentlyPaid`).
	 */
	public get amountToPay() : Currency | null {
		if (
			// eslint-disable-next-line unicorn/prefer-number-properties
			isNaN(this.cancellationFee) ||
			this.cancellationFee < 0
		) return null;
		let amountToPay = this.isVoidBookable ? 0 : this.price;
		amountToPay += this.cancellationFee;
		return amountToPay;
	}

	/**
	 * @see SchedulingApiBookingBase['currentlyPaid']
	 */
	public override get currentlyPaid() : Currency {
		return SchedulingApiBookable.currentlyPaid(this, super.attributeInfoCurrentlyPaid, super.currentlyPaid);
	}

	/**
	 * @see SchedulingApiBookable['getOpenAmount']
	 */
	public getOpenAmount(currentlyPaid ?: Currency | null) : Currency | null {
		return SchedulingApiBookable.getOpenAmount(this, currentlyPaid);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public fitsSearch(term : string) : boolean {
		const termLow = term.toLowerCase();
		const TERMS = termLow.split(' ');

		// const SELECTED_TARIFFS = this.participants.map(item => item.tariffId);
		// const TARIFF_NAMES : string[] = this.model.courseTariffs.map(item => {
		// 	if (SELECTED_TARIFFS.indexOf(item.id)) return item.name;
		// 	return undefined;
		// });

		const searchableContent : string[] = ([
			this.firstName,
			this.lastName,
		]).concat(
			this.participants.map(item => item.firstName),
		).concat(
			this.participants.map(item => item.lastName),
		); // .concat(TARIFF_NAMES);
		if (this.bookingNumber) searchableContent.push(this.bookingNumber.toString());
		if (this.email) searchableContent.push(this.email);

		for (const TERM of TERMS) {
			if (!TERM) continue;
			for (const item of searchableContent) {
				const itemLow = item.toLowerCase();
				if (itemLow.includes(TERM)) return true;
			}
		}
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isFreeBooking() : boolean {
		// There have been bookings in the past where the shopper has paid money, and after this the fee has been set to 0.
		if (!!this.currentlyPaid) return false;
		return !this.price;
	}

	/**
	 * Same as currentlyPaid but more up-to-date if user is about to create a new transaction.
	 * The new amount of the new transaction will be part of this getter.
	 */
	public get newCurrentlyPaid() : Currency | null {
		return SchedulingApiBookable.newCurrentlyPaid(this);
	}

	/**
	 * Get all paymentMethods available for this booking
	 */
	public get coursePaymentMethods() : SchedulingApiShiftModelCoursePaymentMethods | null {
		return this.model.coursePaymentMethods.filterBy(item => {
			assumeDefinedToGetStrictNullChecksRunning(this.paymentMethodId, 'paymentMethodId');
			if (this.paymentMethodId.equals(item.id)) return true;
			if (item.trashed) return false;
			return true;
		});
	}
}


export class SchedulingApiBookings<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiBookingsBase<ValidationMode> {
	constructor(
		public override api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public filterBy(
		fn : (item : SchedulingApiBooking) => boolean,
	) : SchedulingApiBookings {
		const result = new SchedulingApiBookings(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public search(input : Parameters<SchedulingApiBooking['fitsSearch']>[0]) : SchedulingApiBookings {
		if (input === '') return this;
		return this.filterBy(item => item.fitsSearch(input));
	}
}

export class SchedulingApiBookingParticipant<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiBookingParticipantBase<ValidationMode> {
	constructor( public override api : SchedulingApiServiceBase | null ) {
		super(api);
	}
}
