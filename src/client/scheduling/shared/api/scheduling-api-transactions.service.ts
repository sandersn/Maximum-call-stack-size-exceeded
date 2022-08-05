import { SchedulingApiBooking, SchedulingApiServiceBase, SchedulingApiVoucher } from '@plano/shared/api';
import { SchedulingApiTransactionBase, SchedulingApiTransactionPaymentMethodType, SchedulingApiTransactionsBase, SchedulingApiTransactionType } from '@plano/shared/api';
import { ApiAttributeInfo } from '../../../../shared/api/base/api-attribute-info';
import { PApiPrimitiveTypes } from '../../../../shared/api/base/generated-types.ag';
import { Currency} from '../../../../shared/api/base/generated-types.ag';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../shared/core/null-type-utils';

export class SchedulingApiTransactions<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiTransactionsBase<ValidationMode> {
	constructor(
		public override api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}

	/**
	 * Filters a list of ShiftModels by a function that returns a boolean.
	 * Returns a new list of ShiftModels.
	 */
	public filterBy( fn : (item : SchedulingApiTransaction) => boolean ) : SchedulingApiTransactions {
		const result = new SchedulingApiTransactions(this.api, false);
		for (const item of this.iterable()) {
			if (!fn(item)) continue;
			result.push(item);
		}
		return result;
	}

	/**
	 * @param objAttribute The attribute for which the sum should be calculated.
	 * @returns Calculates for all transactions in the list the sum of all `objAttribute` attribute.
	 */
	public getTotal(objAttribute : keyof SchedulingApiTransaction) : number {
		if (!this.length) return 0;
		const ARRAY = this.iterable();
		const LIST_OF_AMOUNTS = ARRAY.map((a) => a[objAttribute]);
		// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
		return LIST_OF_AMOUNTS.reduce((a, b) => a + b);
	}

	/**
	 * The total incoming payments for this booking
	 */
	public get totalIncomingPayments() : number | null {
		if (!this.api) throw new Error('Api must be defined here');

		if (!this.api.isLoaded()) return null;

		// This can happen when user changes filter settings that triggers a new api-call, so the list changes.
		// Note that this can be confusing when api-call was triggered by something else and does not change the result.
		if (this.api.isBackendOperationRunning) return null;

		const TRANSACTIONS = this.filterBy(item => {
			return item.amount! > 0;
		});
		return TRANSACTIONS.getTotal('amount');
	}

	/**
	 * The total outgoing payments for this booking
	 */
	public get totalOutgoingPayments() : number | null {
		if (!this.api) throw new Error('Api must be defined here');

		if (!this.api.isLoaded()) return null;

		// This can happen when user changes filter settings that triggers a new api-call, so the list changes.
		// Note that this can be confusing when api-call was triggered by something else and does not change the result.
		if (this.api.isBackendOperationRunning) return null;

		const TRANSACTIONS = this.filterBy(item => {
			return item.amount! < 0;
		});
		return TRANSACTIONS.getTotal('amount');
	}

	/**
	 * The `amount` resulting from all transactions (i.e. the sum of all `amount` values).
	 */
	public get amount() : Currency | undefined {
		if (!this.api) throw new Error('Api must be defined here');

		if (!this.api.isLoaded()) return undefined;
		return this.getTotal('amount');
	}

	/**
	 * @returns The maximum amount which is refundable by online-payment. `undefined` means data is not loaded yet.
	 * `null` means no online refund can be done at all because online-payment is not activated for this client.
	 */
	public get onlineRefundableAmount() : Currency | null {
		assumeNonNull(this.api);
		if (!this.api.data.isOnlinePaymentAvailable) return null;

		const onlinePaymentTransactions = this.filterBy(item => item.paymentMethodType === SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
		return onlinePaymentTransactions.getTotal('amount');
	}
}

export class SchedulingApiTransaction<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiTransactionBase<ValidationMode> {

	/**
	 * @returns A human readable text describing the transaction type.
	 * The type is visualized by `typeTitle` and `typeSubTitle`.
	 */
	public get typeTitle() : string | null {
		assumeNonNull(this.api);
		switch (this.type) {
			case SchedulingApiTransactionType.CHARGEBACK:
			case SchedulingApiTransactionType.CHARGEBACK_REVERSED:
			case SchedulingApiTransactionType.SECOND_CHARGEBACK:
				return this.api.localizePipe.transform('Rückbuchung (Chargeback)');
			case SchedulingApiTransactionType.PAYMENT:
				return this.api.localizePipe.transform('Eingegangene Zahlung');
			case SchedulingApiTransactionType.PAYOUT:
				return this.api.localizePipe.transform('Auszahlung des Guthabens');
			case SchedulingApiTransactionType.REFUND:
				return this.api.localizePipe.transform('Rückerstattung');
			case SchedulingApiTransactionType.AUTO_DEBIT:
				return this.api.localizePipe.transform('Aufladung des Guthabens');
			case SchedulingApiTransactionType.PAYMENT_FAILED:
			case SchedulingApiTransactionType.PAYOUT_FAILED:
			case SchedulingApiTransactionType.REFUND_FAILED:
			case SchedulingApiTransactionType.AUTO_DEBIT_FAILED:
				return this.api.localizePipe.transform('Korrektur');
			case SchedulingApiTransactionType.DR_PLANO_FEE_VAT:
				const vatPercent = this.api.percentPipe.transform(this.vatPercent, '0.0-1');
				assumeNonNull(vatPercent);
				return this.api.localizePipe.transform('${vatPercent} USt. auf die Online-Zahlungsgebühr', {vatPercent: vatPercent});
			case undefined:
			case null:
				return null;
		}
	}

	/**
	 * @returns A localized string describing the payment-method.
	 */
	public get paymentMethodName() : string | null {
		if (!this.api) throw new Error('Api must be defined here');

		switch (this.paymentMethodType) {
			case SchedulingApiTransactionPaymentMethodType.MISC:
				assumeDefinedToGetStrictNullChecksRunning(this.miscPaymentMethodName, 'miscPaymentMethodName');
				return this.miscPaymentMethodName;

			case SchedulingApiTransactionPaymentMethodType.POS:
				return this.api.localizePipe.transform('Kasse per Schnittstelle');

			case SchedulingApiTransactionPaymentMethodType.PAYPAL:
				return this.api.localizePipe.transform('PayPal');

			case SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT:
				let result = this.api.localizePipe.transform('Online-Zahlung');

				if (this.bankAccountHint)
					result += ` (${this.api.localizePipe.transform('Konto / Karte:')} ${this.bankAccountHint})`;

				return result;
		}
	}

	/**
	 * @returns Does this transaction has a child of type `CHARGEBACK`, `CHARGEBACK_REVERSED` or `SECOND_CHARGEBACK`?
	 */
	public get hasChildOfTypeChargeback() : boolean {
		return this.childChargebackId !== null ||
			this.childChargebackReversedId !== null ||
			this.childSecondChargebackId !== null;
	}

	public attributeInfoPaymentMethodName =  new ApiAttributeInfo<SchedulingApiTransaction, string>({
		apiObjWrapper: this,
		name: 'paymentMethodName',
		id: 'TRANSACTION_PAYMENT_METHOD_NAME',
		primitiveType: PApiPrimitiveTypes.string,
	});

	/**
	 * @returns The bookable associated with this transaction item.
	 */
	public get bookable() : SchedulingApiBooking | SchedulingApiVoucher | null {
		if (!this.api) throw new Error('Api must be defined here');

		if (this.bookingId !== null) {
			return this.api.data.bookings.get(this.bookingId);
		} else if (this.voucherId !== null) {
			return this.api.data.vouchers.get(this.voucherId);
		} else {
			return null;
		}
	}

	/**
	 * @returns A human readable text describing the transaction type.
	 * The type is visualized by `typeTitle` and `typeSubTitle`.
	 */
	public get typeSubTitle() : string | null {
		assumeNonNull(this.api);
		switch (this.type) {
			case SchedulingApiTransactionType.CHARGEBACK:
			case SchedulingApiTransactionType.SECOND_CHARGEBACK:
			case SchedulingApiTransactionType.REFUND:
				return this.api.localizePipe.transform('an ${referencedPerson}', {referencedPerson: this.referencedPerson});
			case SchedulingApiTransactionType.PAYMENT:
				return this.api.localizePipe.transform('von ${referencedPerson}', {referencedPerson: this.referencedPerson});
			case SchedulingApiTransactionType.PAYOUT:
			case SchedulingApiTransactionType.AUTO_DEBIT:
				return this.api.localizePipe.transform('automatisch durch Dr.&nbsp;Plano');
			case SchedulingApiTransactionType.PAYMENT_FAILED:
				return this.api.localizePipe.transform('einer fehlgeschlagenen Einzahlung');
			case SchedulingApiTransactionType.PAYOUT_FAILED:
				return this.api.localizePipe.transform('einer fehlgeschlagenen Guthabenauszahlung');
			case SchedulingApiTransactionType.REFUND_FAILED:
				return this.api.localizePipe.transform('einer fehlgeschlagenen Rückerstattung');
			case SchedulingApiTransactionType.AUTO_DEBIT_FAILED:
				return this.api.localizePipe.transform('einer fehlgeschlagenen Guthaben-Aufladung');
			case SchedulingApiTransactionType.CHARGEBACK_REVERSED:
				return this.api.localizePipe.transform('einer angefochtenen Rückbuchung');
			case SchedulingApiTransactionType.DR_PLANO_FEE_VAT:
				const month = this.api.datePipe.transform(this.dateTime, 'MMMM yyyy');
				return this.api.localizePipe.transform('für ${month}', {month: month});
			case undefined:
			case null:
				return null;
		}
	}

	public attributeInfoAmount =  new ApiAttributeInfo<SchedulingApiTransaction, Currency>({
		apiObjWrapper: this,
		name: 'amount',
		id: 'TRANSACTION_AMOUNT',
		primitiveType: PApiPrimitiveTypes.Currency,
		canEdit: () => false,
		readMode: () => true,
	});

	/**
	 * The amount of the transaction. In contrast to `absAmount` this value will be negative
	 * when money has been deduced from the account.
	 */
	public get amount() : Currency | null {
		if (this.attributeInfoAbsAmount.value === null) {
			return null;
		}
		switch (this.type) {
			case SchedulingApiTransactionType.PAYMENT:
			case SchedulingApiTransactionType.REFUND_FAILED:
			case SchedulingApiTransactionType.PAYOUT_FAILED:
			case SchedulingApiTransactionType.AUTO_DEBIT:
			case SchedulingApiTransactionType.CHARGEBACK_REVERSED:
				return this.absAmount;

			case SchedulingApiTransactionType.PAYMENT_FAILED:
			case SchedulingApiTransactionType.REFUND:
			case SchedulingApiTransactionType.PAYOUT:
			case SchedulingApiTransactionType.CHARGEBACK:
			case SchedulingApiTransactionType.SECOND_CHARGEBACK:
			case SchedulingApiTransactionType.AUTO_DEBIT_FAILED:
			case SchedulingApiTransactionType.DR_PLANO_FEE_VAT:
				return -this.absAmount;

			case undefined:
				return null;
			case null:
				return null;
		}
	}
}
