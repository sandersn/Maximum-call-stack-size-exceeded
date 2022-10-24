import { SchedulingApiBookable } from './scheduling-api-bookable.service';
import { SchedulingApiBookingBase, SchedulingApiBookingState, SchedulingApiBookingsBase, SchedulingApiBookingParticipantBase } from '../../../../shared/api';
import { ApiAttributeInfo } from '../../../../shared/api/base/api-attribute-info';
import { PApiPrimitiveTypes } from '../../../../shared/api/base/generated-types.ag';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../shared/core/null-type-utils';
export class SchedulingApiBooking extends SchedulingApiBookingBase {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(api, idRaw) {
        super(api, idRaw);
        this.api = api;
        this.attributeInfoAmountToPay = new ApiAttributeInfo({
            apiObjWrapper: this,
            name: 'amountToPay',
            id: 'BOOKING_AMOUNT_TO_PAY',
            primitiveType: PApiPrimitiveTypes.Currency,
            canEdit: () => false,
            readMode: () => true,
        });
    }
    /**
     * This Price is independent from the type of booking. So a canceled request can also have a price.
     */
    get price() {
        const MODEL = this.model;
        assumeDefinedToGetStrictNullChecksRunning(MODEL, 'MODEL');
        if (this.overallTariffId !== null) {
            const tariff = MODEL.courseTariffs.get(this.overallTariffId);
            if (!tariff)
                throw new Error('Could not get tariff');
            return tariff.getTotalFee(this.participantCount);
        }
        let price = 0;
        for (const participant of this.participants.iterable()) {
            if (participant.tariffId !== null) {
                const tariff = MODEL.courseTariffs.get(participant.tariffId);
                if (!tariff)
                    throw new Error('Could not get tariff');
                const firstFee = tariff.fees.get(0);
                if (!firstFee)
                    throw new Error('Could not get firstFee');
                price += firstFee.fee;
            }
        }
        return price;
    }
    /**
     * shorthand that returns the related model
     */
    get model() {
        // NOTE: This methods exists on multiple classes:
        // TimeStampApiShift
        // SchedulingApiShift
        // SchedulingApiBooking
        // SchedulingApiTodaysShiftDescription
        const SHIFT_MODEL = this.api.data.shiftModels.get(this.shiftModelId);
        assumeNonNull(SHIFT_MODEL, 'SHIFT_MODEL');
        return SHIFT_MODEL;
    }
    /**
     * Get the name based on the linked shiftModel
     */
    get name() {
        // NOTE: This methods exists on multiple classes:
        // SchedulingApiBooking
        return this.model.name;
    }
    /**
     * @returns All transactions belonging to this booking.
     */
    get transactions() {
        return this.api.data.transactions.filterBy(item => this.id.equals(item.bookingId));
    }
    /**
     * getter for the status of payment
     */
    get paymentStatus() {
        return SchedulingApiBookable.paymentStatus(this);
    }
    /**
     * A bookable is void when it was canceled or declined and is merely held for history purpose.
     */
    get isVoidBookable() {
        return this.state === SchedulingApiBookingState.CANCELED || this.state === SchedulingApiBookingState.INQUIRY_DECLINED;
    }
    /**
     * How much needs to be paid for this booking overall. This value is independent of how much has been paid already (i.e. `currentlyPaid`).
     */
    get amountToPay() {
        if (
        // eslint-disable-next-line unicorn/prefer-number-properties
        isNaN(this.cancellationFee) ||
            this.cancellationFee < 0)
            return null;
        let amountToPay = this.isVoidBookable ? 0 : this.price;
        amountToPay += this.cancellationFee;
        return amountToPay;
    }
    /**
     * @see SchedulingApiBookingBase['currentlyPaid']
     */
    get currentlyPaid() {
        return SchedulingApiBookable.currentlyPaid(this, super.attributeInfoCurrentlyPaid, super.currentlyPaid);
    }
    /**
     * @see SchedulingApiBookable['getOpenAmount']
     */
    getOpenAmount(currentlyPaid) {
        return SchedulingApiBookable.getOpenAmount(this, currentlyPaid);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    fitsSearch(term) {
        const termLow = term.toLowerCase();
        const TERMS = termLow.split(' ');
        // const SELECTED_TARIFFS = this.participants.map(item => item.tariffId);
        // const TARIFF_NAMES : string[] = this.model.courseTariffs.map(item => {
        // 	if (SELECTED_TARIFFS.indexOf(item.id)) return item.name;
        // 	return undefined;
        // });
        const searchableContent = ([
            this.firstName,
            this.lastName,
        ]).concat(this.participants.map(item => item.firstName)).concat(this.participants.map(item => item.lastName)); // .concat(TARIFF_NAMES);
        if (this.bookingNumber)
            searchableContent.push(this.bookingNumber.toString());
        if (this.email)
            searchableContent.push(this.email);
        for (const TERM of TERMS) {
            if (!TERM)
                continue;
            for (const item of searchableContent) {
                const itemLow = item.toLowerCase();
                if (itemLow.includes(TERM))
                    return true;
            }
        }
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isFreeBooking() {
        // There have been bookings in the past where the shopper has paid money, and after this the fee has been set to 0.
        if (!!this.currentlyPaid)
            return false;
        return !this.price;
    }
    /**
     * Same as currentlyPaid but more up-to-date if user is about to create a new transaction.
     * The new amount of the new transaction will be part of this getter.
     */
    get newCurrentlyPaid() {
        return SchedulingApiBookable.newCurrentlyPaid(this);
    }
    /**
     * Get all paymentMethods available for this booking
     */
    get coursePaymentMethods() {
        return this.model.coursePaymentMethods.filterBy(item => {
            assumeDefinedToGetStrictNullChecksRunning(this.paymentMethodId, 'paymentMethodId');
            if (this.paymentMethodId.equals(item.id))
                return true;
            if (item.trashed)
                return false;
            return true;
        });
    }
}
export class SchedulingApiBookings extends SchedulingApiBookingsBase {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems);
        this.api = api;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    filterBy(fn) {
        const result = new SchedulingApiBookings(this.api, false);
        for (const item of this.iterable()) {
            if (!fn(item))
                continue;
            result.push(item);
        }
        return result;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    search(input) {
        if (input === '')
            return this;
        return this.filterBy(item => item.fitsSearch(input));
    }
}
export class SchedulingApiBookingParticipant extends SchedulingApiBookingParticipantBase {
    constructor(api) {
        super(api);
        this.api = api;
    }
}
//# sourceMappingURL=scheduling-api-booking.service.js.map