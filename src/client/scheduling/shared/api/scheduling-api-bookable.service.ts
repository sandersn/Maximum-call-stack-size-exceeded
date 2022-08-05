import { SchedulingApiBooking } from './scheduling-api-booking.service';
import { SchedulingApiVoucher } from './scheduling-api.service';
import { PPaymentStatusEnum } from './scheduling-api.utils';
import { SchedulingApiBookingState, SchedulingApiTransactionPaymentMethodType, SchedulingApiTransactionType } from '../../../../shared/api';
import { SchedulingApiTransaction} from '../../../../shared/api';
import { ApiAttributeInfo } from '../../../../shared/api/base/api-attribute-info';
import { Currency } from '../../../../shared/api/base/generated-types.ag';
import { Config } from '../../../../shared/core/config';
import { PMath } from '../../../../shared/core/math-utils';
import { assumeNonNull } from '../../../../shared/core/null-type-utils';
import { PDictionarySourceString } from '../../../../shared/core/pipe/localize.dictionary';

type SchedulingApiBookableType = SchedulingApiBooking | SchedulingApiVoucher;

/**
 * The backend has the concept of 'bookable'. A bookable can be a SchedulingApiBooking or SchedulingApiVoucher.
 * Frontend should implement this too. Implementing this will cause huge changes.
 * Until then, we gather their logic here.
 * Inside SchedulingApiBooking and SchedulingApiVoucher we can than pick static methods from SchedulingApiBookable
 * in order to not have to write duplicate code.
 */
export class SchedulingApiBookable {
	constructor() {}

	private static isLatestNewItem(bookable : SchedulingApiBookableType, item : SchedulingApiTransaction) : boolean {
		// Check if this is the latest created item.
		const latestCreatedItem = bookable.transactions.get(bookable.transactions.length - 1);
		if (!latestCreatedItem) throw new Error('Could not get latestCreatedItem');
		if (item.newItemId === latestCreatedItem.newItemId) return true;
		return false;
	}

	/**
	 * Same as currentlyPaid but more up-to-date if user is about to create a new transaction.
	 * The new amount of the new transaction will be part of this getter.
	 */
	public static newCurrentlyPaid(bookable : SchedulingApiBookableType) : Currency | null {
		const newTransactions = bookable.transactions.filterBy((item) => item.isNewItem());
		let amountOfAllNewTransactions : Currency = 0;
		for (const newTransaction of newTransactions.filterBy(item => {
			return this.isLatestNewItem(bookable, item);
		}).iterable()) {
			// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
			if (!newTransaction) return bookable.currentlyPaid;
			const amount = newTransaction.amount;
			if (amount === null) return null;
			amountOfAllNewTransactions = amountOfAllNewTransactions + amount;
		}
		return bookable.currentlyPaid + amountOfAllNewTransactions;
	}

	/**
	 * Get a fitting label, based on params from the form.
	 */
	public static newTransactionFormLabel(bookable : SchedulingApiBookableType) : PDictionarySourceString {
		const transaction = bookable.transactions.findBy(item => item.isNewItem());
		if (!transaction?.rawData) return 'Neue Zahlung';
		if (transaction.type === SchedulingApiTransactionType.REFUND) return 'Neue Rückerstattung';
		if (transaction.type === SchedulingApiTransactionType.PAYMENT) return 'Neue Einzahlung';
		return 'Neue Zahlung';
	}

	/**
	 * Status of payment
	 */
	public static paymentStatus(bookable : SchedulingApiBookableType) : PPaymentStatusEnum | null {

		const currentlyPaid = bookable.attributeInfoCurrentlyPaid.value;
		if (currentlyPaid === null) return null;

		const amountToPay = bookable.amountToPay;
		if (amountToPay === null) return null;

		if (currentlyPaid > amountToPay) {
			return PPaymentStatusEnum.CASHBACK;
		} else if (currentlyPaid === amountToPay) {
			if (bookable.price === 0) {
				return PPaymentStatusEnum.FREE;
			} else if (amountToPay > 0) {
				if (bookable.state === SchedulingApiBookingState.CANCELED) return PPaymentStatusEnum.NO_CASHBACK;
				return PPaymentStatusEnum.PAID;
			} else {
				// eslint-disable-next-line no-console
				if (bookable.state !== SchedulingApiBookingState.CANCELED && Config.DEBUG) console.error('Unexpected case. Change doc or fix code.');
				// Booking must be canceled here
				return PPaymentStatusEnum.NO_CASHBACK;
			}
		} else { // otherwise currentlyPay < amountToPay
			return currentlyPaid === 0 ? PPaymentStatusEnum.UNPAID : PPaymentStatusEnum.INSTALMENT;
		}
	}

	/**
	 * Should the faq-button be visible?
	 */
	public static showFaqBtn(bookable : SchedulingApiBookableType | null, isOnlinePaymentAvailable : boolean) : boolean {
		if (bookable === null) return false;
		if (isOnlinePaymentAvailable === true) return true;
		return bookable.transactions.some(item => item.paymentMethodType === SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
	}

	/**
	 * Get a fitting close button label, based on params from the form.
	 */
	public static newTransactionFormCloseBtnLabel(bookable : SchedulingApiBookableType) : PDictionarySourceString {
		const transaction = bookable.transactions.findBy(item => item.isNewItem());
		if (!transaction) return 'Speichern';
		if (transaction.rawData && transaction.type === SchedulingApiTransactionType.REFUND) {
			if (transaction.paymentMethodType === SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT) return 'Rückerstattung veranlassen';
			return 'Rückerstattung erfassen';
		}
		return 'Einzahlung erfassen';
	}

	/**
	 * @see SchedulingApiBookingBase['currentlyPaid']
	 */
	public static currentlyPaid<T extends SchedulingApiBooking | SchedulingApiVoucher>(
		bookable : T,
		superAttributeInfoCurrentlyPaid : ApiAttributeInfo<T, number>,
		superCurrentlyPaid : Currency,
	) : Currency {
		if (bookable.isNewItem() && superAttributeInfoCurrentlyPaid.value === null) {
			// A new item can have multiple transaction
			let currentlyPaid = 0;
			for (const transaction of bookable.transactions.filterBy(item => {
				// Check if this is the latest created item.
				// The latest one is the item, that the user is currently editing. It should not be counted.
				const latestCreatedItem = bookable.transactions.get(bookable.transactions.length - 1);
				if (!latestCreatedItem) throw new Error('Could not get Transaction');
				if (item.newItemId === latestCreatedItem.newItemId) return false;
				return true;
			}).iterable()) {
				assumeNonNull(transaction.amount);
				currentlyPaid = currentlyPaid + transaction.amount;
			}
			return currentlyPaid;
		}
		return superCurrentlyPaid;
	}

	/**
	 * @param currentlyPaid Pass here an alternative `currentlyPaid` value. If nothing is passed here the current `currentlyPaid` value of the bookable will be used.
	 * @returns Whats the current open amount for this bookable? Positive means the booking person has to pay something. Negative means the booking person
	 * needs to get money back.
	 */
	public static getOpenAmount<T extends SchedulingApiBooking | SchedulingApiVoucher>(bookable : T, currentlyPaid ?: Currency | null) : Currency | null {
		if (bookable.amountToPay === null) return null;

		// Someone wanted to get an open amount for a custom currentlyPaid value,
		// but the currentlyPaid could not be calculated.
		if (currentlyPaid === null) return null;

		if (currentlyPaid === undefined)
			currentlyPaid = bookable.currentlyPaid;

		return PMath.subtractCurrency(bookable.amountToPay, currentlyPaid);
	}
}
