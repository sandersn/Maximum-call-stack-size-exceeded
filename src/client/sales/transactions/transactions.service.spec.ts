import { SchedulingApiTransactionPaymentMethodType, SchedulingApiTransactionType } from '@plano/shared/api';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PTransactionsService } from './transactions.service';
import { Id } from '../../../shared/api/base/id';

describe('#PTransactionsService', () => {
	let service : PTransactionsService;

	beforeAll(() => {
		const validatorsService = new ValidatorsService();
		service = new PTransactionsService(validatorsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('PLANO-51066', () => {
		describe('showOnlyFailedTransactions = false', () => {
			beforeAll(() => {
				service.showOnlyFailedTransactions = false;
			});

			it('should show successful transactions with type PAYMENT', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.PAYMENT,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: null,
					amount: null,
				})).toBeTrue();
			});

			it('should show successful transactions with type PAYOUT', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.PAYOUT,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: null,
					amount: null,
				})).toBeTrue();
			});

			it('should show successful transactions with type REFUND', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.REFUND,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: null,
					amount: null,
				})).toBeTrue();
			});

			it('should show successful transactions with type CHARGEBACK', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.CHARGEBACK,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: null,
					amount: null,
				})).toBeTrue();
			});

			it('should show failed transactions with type PAYMENT', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.PAYMENT,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: Id.create(1),
					amount: null,
				})).toBeTrue();
			});

			it('should show failed transactions with type PAYOUT', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.PAYOUT,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: Id.create(1),
					amount: null,
				})).toBeTrue();
			});

			it('should show failed transactions with type REFUND', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.REFUND,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: Id.create(1),
					amount: null,
				})).toBeTrue();
			});

			it('should show transactions with type PAYMENT_FAILED', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.PAYMENT_FAILED,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: null,
					amount: null,
				})).toBeTrue();
			});

			it('should show transactions with type PAYOUT_FAILED', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.PAYOUT_FAILED,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: null,
					amount: null,
				})).toBeTrue();
			});

			it('should show transactions with type REFUND_FAILED', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.REFUND_FAILED,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: null,
					amount: null,
				})).toBeTrue();
			});
		});

		describe('showOnlyFailedTransactions = true', () => {
			beforeAll(() => {
				service.showOnlyFailedTransactions = true;
			});

			it('should hide successful transactions with type PAYMENT', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.PAYMENT,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: null,
					amount: null,
				})).toBeFalse();
			});

			it('should hide successful transactions with type PAYOUT', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.PAYOUT,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: null,
					amount: null,
				})).toBeFalse();
			});

			it('should hide successful transactions with type REFUND', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.REFUND,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: null,
					amount: null,
				})).toBeFalse();
			});

			it('should hide successful transactions with type CHARGEBACK', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.CHARGEBACK,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: null,
					amount: null,
				})).toBeFalse();
			});

			it('should show failed transactions with type PAYMENT', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.PAYMENT,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: Id.create(1),
					amount: null,
				})).toBeTrue();
			});

			it('should show failed transactions with type PAYOUT', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.PAYOUT,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: Id.create(1),
					amount: null,
				})).toBeTrue();
			});

			it('should show failed transactions with type REFUND', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.REFUND,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: Id.create(1),
					amount: null,
				})).toBeTrue();
			});

			it('should hide successful transactions with type PAYMENT_FAILED', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.PAYMENT_FAILED,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: null,
					amount: null,
				})).toBeFalse();
			});

			it('should hide successful transactions with type PAYOUT_FAILED', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.PAYOUT_FAILED,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: null,
					amount: null,
				})).toBeFalse();
			});

			it('should hide successful transactions with type REFUND_FAILED', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.REFUND_FAILED,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: null,
					amount: null,
				})).toBeFalse();
			});
		});

		describe('hide refund, and then showOnlyFailedTransactions = true', () => {
			beforeAll(() => {
				service.showOnlyFailedTransactions = false;
				service.toggleFilteredTransactionType(SchedulingApiTransactionType.REFUND);
				service.showOnlyFailedTransactions = true;
			});

			it('should hide successful transactions with type PAYMENT', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.PAYMENT,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: null,
					amount: null,
				})).toBeFalse();
			});

			it('should show failed transactions with type PAYMENT', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.PAYMENT,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: Id.create(1),
					amount: null,
				})).toBeTrue();
			});

			it('should hide transactions with type PAYMENT_FAILED', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.PAYMENT_FAILED,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: null,
					amount: null,
				})).toBeFalse();
			});

			it('should hide successful transactions with type CHARGEBACK', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.CHARGEBACK,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: null,
					amount: null,
				})).toBeFalse();
			});

			it('should hide successful transactions with type REFUND', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.REFUND,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: null,
					amount: null,
				})).toBeFalse();
			});

			it('should hide failed transactions with type REFUND', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.REFUND,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: Id.create(1),
					amount: null,
				})).toBeFalse();
			});

			it('should hide transactions with type REFUND_FAILED', () => {
				expect(service.isVisible({
					type: SchedulingApiTransactionType.REFUND_FAILED,
					paymentMethodType: SchedulingApiTransactionPaymentMethodType.MISC,
					failedChildId: null,
					amount: null,
				})).toBeFalse();
			});
		});

	});
});
