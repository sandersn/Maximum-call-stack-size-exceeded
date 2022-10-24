import { SchedulingApiTransactionBase, SchedulingApiTransactionPaymentMethodType, SchedulingApiTransactionsBase, SchedulingApiTransactionType } from '@plano/shared/api';
import { ApiAttributeInfo } from '../../../../shared/api/base/api-attribute-info';
import { PApiPrimitiveTypes } from '../../../../shared/api/base/generated-types.ag';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../shared/core/null-type-utils';
export class SchedulingApiTransactions extends SchedulingApiTransactionsBase {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems);
        this.api = api;
    }
    /**
     * Filters a list of ShiftModels by a function that returns a boolean.
     * Returns a new list of ShiftModels.
     */
    filterBy(fn) {
        const result = new SchedulingApiTransactions(this.api, false);
        for (const item of this.iterable()) {
            if (!fn(item))
                continue;
            result.push(item);
        }
        return result;
    }
    /**
     * @param objAttribute The attribute for which the sum should be calculated.
     * @returns Calculates for all transactions in the list the sum of all `objAttribute` attribute.
     */
    getTotal(objAttribute) {
        if (!this.length)
            return 0;
        const ARRAY = this.iterable();
        const LIST_OF_AMOUNTS = ARRAY.map((a) => a[objAttribute]);
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        return LIST_OF_AMOUNTS.reduce((a, b) => a + b);
    }
    /**
     * The total incoming payments for this booking
     */
    get totalIncomingPayments() {
        if (!this.api)
            throw new Error('Api must be defined here');
        if (!this.api.isLoaded())
            return null;
        // This can happen when user changes filter settings that triggers a new api-call, so the list changes.
        // Note that this can be confusing when api-call was triggered by something else and does not change the result.
        if (this.api.isBackendOperationRunning)
            return null;
        const TRANSACTIONS = this.filterBy(item => {
            return item.amount > 0;
        });
        return TRANSACTIONS.getTotal('amount');
    }
    /**
     * The total outgoing payments for this booking
     */
    get totalOutgoingPayments() {
        if (!this.api)
            throw new Error('Api must be defined here');
        if (!this.api.isLoaded())
            return null;
        // This can happen when user changes filter settings that triggers a new api-call, so the list changes.
        // Note that this can be confusing when api-call was triggered by something else and does not change the result.
        if (this.api.isBackendOperationRunning)
            return null;
        const TRANSACTIONS = this.filterBy(item => {
            return item.amount < 0;
        });
        return TRANSACTIONS.getTotal('amount');
    }
    /**
     * The `amount` resulting from all transactions (i.e. the sum of all `amount` values).
     */
    get amount() {
        if (!this.api)
            throw new Error('Api must be defined here');
        if (!this.api.isLoaded())
            return undefined;
        return this.getTotal('amount');
    }
    /**
     * @returns The maximum amount which is refundable by online-payment. `undefined` means data is not loaded yet.
     * `null` means no online refund can be done at all because online-payment is not activated for this client.
     */
    get onlineRefundableAmount() {
        assumeNonNull(this.api);
        if (!this.api.data.isOnlinePaymentAvailable)
            return null;
        const onlinePaymentTransactions = this.filterBy(item => item.paymentMethodType === SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
        return onlinePaymentTransactions.getTotal('amount');
    }
}
export class SchedulingApiTransaction extends SchedulingApiTransactionBase {
    constructor() {
        super(...arguments);
        this.attributeInfoPaymentMethodName = new ApiAttributeInfo({
            apiObjWrapper: this,
            name: 'paymentMethodName',
            id: 'TRANSACTION_PAYMENT_METHOD_NAME',
            primitiveType: PApiPrimitiveTypes.string,
        });
        this.attributeInfoAmount = new ApiAttributeInfo({
            apiObjWrapper: this,
            name: 'amount',
            id: 'TRANSACTION_AMOUNT',
            primitiveType: PApiPrimitiveTypes.Currency,
            canEdit: () => false,
            readMode: () => true,
        });
    }
    /**
     * @returns A human readable text describing the transaction type.
     * The type is visualized by `typeTitle` and `typeSubTitle`.
     */
    get typeTitle() {
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
                return this.api.localizePipe.transform('${vatPercent} USt. auf die Online-Zahlungsgebühr', { vatPercent: vatPercent });
            case undefined:
            case null:
                return null;
        }
    }
    /**
     * @returns A localized string describing the payment-method.
     */
    get paymentMethodName() {
        if (!this.api)
            throw new Error('Api must be defined here');
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
    get hasChildOfTypeChargeback() {
        return this.childChargebackId !== null ||
            this.childChargebackReversedId !== null ||
            this.childSecondChargebackId !== null;
    }
    /**
     * @returns The bookable associated with this transaction item.
     */
    get bookable() {
        if (!this.api)
            throw new Error('Api must be defined here');
        if (this.bookingId !== null) {
            return this.api.data.bookings.get(this.bookingId);
        }
        else if (this.voucherId !== null) {
            return this.api.data.vouchers.get(this.voucherId);
        }
        else {
            return null;
        }
    }
    /**
     * @returns A human readable text describing the transaction type.
     * The type is visualized by `typeTitle` and `typeSubTitle`.
     */
    get typeSubTitle() {
        assumeNonNull(this.api);
        switch (this.type) {
            case SchedulingApiTransactionType.CHARGEBACK:
            case SchedulingApiTransactionType.SECOND_CHARGEBACK:
            case SchedulingApiTransactionType.REFUND:
                return this.api.localizePipe.transform('an ${referencedPerson}', { referencedPerson: this.referencedPerson });
            case SchedulingApiTransactionType.PAYMENT:
                return this.api.localizePipe.transform('von ${referencedPerson}', { referencedPerson: this.referencedPerson });
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
                return this.api.localizePipe.transform('für ${month}', { month: month });
            case undefined:
            case null:
                return null;
        }
    }
    /**
     * The amount of the transaction. In contrast to `absAmount` this value will be negative
     * when money has been deduced from the account.
     */
    get amount() {
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
//# sourceMappingURL=scheduling-api-transactions.service.js.map