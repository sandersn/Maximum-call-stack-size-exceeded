/* eslint-disable max-len */ // TODO: Remove this. Implement Auto-Fix?
/* eslint-disable max-lines */
import { HttpParams } from '@angular/common/http';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiVoucher, SchedulingApiTransaction} from '@plano/shared/api';
import { SchedulingApiService, SchedulingApiTransactionType, SchedulingApiTransactionPaymentMethodType, SchedulingApiBookingState, SchedulingApiTransactionTransferFundsState, ClientsApiClient, ClientsApiService} from '@plano/shared/api';
import { Currency} from '@plano/shared/api/base/generated-types.ag';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { LoginRole, TestingUtils } from '@plano/shared/testing/testing-utils';
import { SchedulingApiBooking } from '../../../../../client/scheduling/shared/api/scheduling-api-booking.service';
import { SchedulingApiShiftModel } from '../../../../../client/scheduling/shared/api/scheduling-api.service';
import { CallByRef } from '../../../../core/call-by-ref';
import { PMath } from '../../../../core/math-utils';
import { assumeNonNull } from '../../../../core/null-type-utils';
import { AdyenTestingUtils } from '../../../base/adyen-testing-utils';
import { SettlementDetailsReportEntry } from '../../../base/adyen-testing-utils';

describe('#SchedulingApiService #needsapi', () => {
	let api : SchedulingApiService;
	const testingUtils = new TestingUtils();
	const pMoment = new PMomentService(PSupportedLocaleIds.de_DE);
	const adyenTestingUtils = new AdyenTestingUtils();

	const getApiQueryParams = (dataType : string) : HttpParams => {
		// start/end
		// Hack: data.shifts currently returns shifts of the whole day. workingTimes/absences not. So, to be consistent, start/end should be start/end of day
		const start = pMoment.m().subtract(1, 'week').startOf('day').valueOf().toString();
		const end = pMoment.m().add(1, 'week').startOf('day').valueOf().toString();

		return new HttpParams()
			.set('data', dataType)
			.set('start', start)
			.set('end', end)
			.set('bookingsStart', start)
			.set('bookingsEnd', end)
			.set('bookingsByShiftTime', 'true');
	};

	/**
	 * Searches the transactions list of the bookable for an Transaction that matches thr originalPsp, type and optional an amount
	 */
	const findTransaction = (bookable : CallByRef<SchedulingApiBooking | SchedulingApiVoucher>,
			originalPsp : string | null,
			type : SchedulingApiTransactionType,
			amount : Currency | null = null) : SchedulingApiTransaction | null => {
		assumeNonNull(bookable.val);
		const transactionList = bookable.val.transactions.filterBy((item) => {
			if ((amount === null || item.absAmount === amount) && item.testingOriginalPspReference === originalPsp && item.type === type) {
				return true;
			}
			return false;
		});

		return transactionList.length ? transactionList.get(0) : null;
	};

	/**
	 * Executes transaction tests assuming that `bookable` is fresh and has no previous transactions.
	 * @param bookable The bookable on which the transaction tests should be performed.
	 */
	const doTransactionTests = (bookable : CallByRef<SchedulingApiBooking | SchedulingApiVoucher>) : void => {
		describe('MISC', () => {
			it('partially-pay', async () => {
				assumeNonNull(bookable.val);
				const transactionAmount = testingUtils.getRandomNumber(0, bookable.val.price - 0.01, 2);
				const newCurrentlyPaid = PMath.roundToDecimalPlaces(bookable.val.currentlyPaid + transactionAmount, 2); // round to avoid floating number inaccuracy error

				await adyenTestingUtils.createTransaction(api, bookable.val.id,
					transactionAmount,
					SchedulingApiTransactionType.PAYMENT,
					SchedulingApiTransactionPaymentMethodType.MISC);

				expect(bookable.val.currentlyPaid).toBe(newCurrentlyPaid);
			});

			it('completely-pay', async () => {
				assumeNonNull(bookable.val);
				const transactionAmount = PMath.roundToDecimalPlaces(bookable.val.price - bookable.val.currentlyPaid, 2);
				await adyenTestingUtils.createTransaction(api, bookable.val.id,
					transactionAmount,
					SchedulingApiTransactionType.PAYMENT,
					SchedulingApiTransactionPaymentMethodType.MISC);
				expect(bookable.val.currentlyPaid).toBe(bookable.val.price);
			});

			it('cannot-online-refund-because-no-online-balance', async () => {
				assumeNonNull(bookable.val);
				const prevCurrentlyPaid = bookable.val.currentlyPaid;
				const prevTransactionCount = bookable.val.transactions.length;

				// we assume that at this point the bookables online balance is 0. So refunding 1 Euro should fail
				try {
					await adyenTestingUtils.createTransaction(api,
						bookable.val.id,
						1,
						SchedulingApiTransactionType.REFUND,
						SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
					fail();
				} catch {
					// check nothing has changed
					await api.reload();
					expect(bookable.val.transactions.length).toBe(prevTransactionCount);
					expect(bookable.val.currentlyPaid).toBe(prevCurrentlyPaid);
				}
			});

			it('completely-refund', async () => {
				assumeNonNull(bookable.val);
				await adyenTestingUtils.createTransaction(api,
					bookable.val.id,
					bookable.val.currentlyPaid,
					SchedulingApiTransactionType.REFUND,
					SchedulingApiTransactionPaymentMethodType.MISC);
				expect(bookable.val.currentlyPaid).toBe(0);
			});
		});

		describe('ONLINE_PAYMENT', () => {
			it('test-AUTHORIZATION-success-false', async () => {
				// create payment
				assumeNonNull(bookable.val);
				const newTransaction = await adyenTestingUtils.createTransaction(api,
					bookable.val.id,
					10,
					SchedulingApiTransactionType.PAYMENT,
					SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
				expect(bookable.val.currentlyPaid).toBe(10);
				expect(newTransaction.testingTransferFundsAmount ).toBe(null);
				expect(newTransaction.testingIsSettled).toBe(false);

				// Send Authorization success false
				await adyenTestingUtils.sendAuthorizationSuccessFalse(newTransaction);
				await api.reload();

				expect(newTransaction.failedChildId).toBeDefined();
				expect(bookable.val.currentlyPaid).toBe(0);
				expect(newTransaction.testingIsSettled).toBe(true);

				const failedTransaction = findTransaction(bookable, newTransaction.testingOriginalPspReference, SchedulingApiTransactionType.PAYMENT_FAILED)!;
				expect(failedTransaction).toBeDefined();
				expect(failedTransaction.testingTransferFundsAmount).toBe(newTransaction.drPlanoFeeNet);
				expect(failedTransaction.testingIsSettled).toBe(true);
			});

			it('test-CAPTURE_FAILED', async () => {
				assumeNonNull(bookable.val);
				// create payment
				const newTransaction = await adyenTestingUtils.createTransaction(api,
					bookable.val.id,
					10,
					SchedulingApiTransactionType.PAYMENT,
					SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
				expect(bookable.val.currentlyPaid).toBe(10);
				expect(newTransaction.testingTransferFundsAmount ).toBe(null);
				expect(newTransaction.testingIsSettled).toBe(false);

				// test CAPTURE_FAILED
				await adyenTestingUtils.sendCaptureFailed(newTransaction);
				await api.reload();
				expect(newTransaction.testingIsSettled).toBe(true);

				expect(newTransaction.failedChildId).toBeDefined();
				expect(bookable.val.currentlyPaid).toBe(0);

				const failedTransaction = findTransaction(bookable, newTransaction.testingOriginalPspReference, SchedulingApiTransactionType.PAYMENT_FAILED)!;
				expect(failedTransaction).toBeDefined();
				expect(failedTransaction.testingTransferFundsAmount).toBe(newTransaction.drPlanoFeeNet);
				expect(failedTransaction.testingIsSettled).toBe(true);
			});

			it('test-duplicate-event-handling', async () => {
				assumeNonNull(bookable.val);
				// create payment
				const newTransaction = await adyenTestingUtils.createTransaction(api,
					bookable.val.id,
					10,
					SchedulingApiTransactionType.PAYMENT,
					SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
				expect(bookable.val.currentlyPaid).toBe(10);
				expect(newTransaction.testingTransferFundsAmount ).toBe(null);
				expect(newTransaction.testingIsSettled).toBe(false);

				// send CAPTURE_FAILED
				await adyenTestingUtils.sendCaptureFailed(newTransaction);
				await api.reload();
				expect(bookable.val.currentlyPaid).toBe(0);
				expect(newTransaction.testingIsSettled).toBe(true);

				// resend CAPTURE_FAILED event (it should have no effect)
				await adyenTestingUtils.sendCaptureFailed(newTransaction);
				await api.reload();
				expect(bookable.val.currentlyPaid).toBe(0);

				const failedTransaction = findTransaction(bookable, newTransaction.testingOriginalPspReference, SchedulingApiTransactionType.PAYMENT_FAILED)!;
				expect(failedTransaction).toBeDefined();
				expect(failedTransaction.testingTransferFundsAmount).toBe(newTransaction.drPlanoFeeNet);
				expect(failedTransaction.testingIsSettled).toBe(true);
			});

			it('cannot-refund-more-than-bookables-online-balance', async () => {
				assumeNonNull(bookable.val);
				// create two payments (split of ONLINE and MISC)
				const onlinePaymentTransaction = await adyenTestingUtils.createTransaction(api,
					bookable.val.id,
					10,
					SchedulingApiTransactionType.PAYMENT,
					SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
				expect(bookable.val.currentlyPaid).toBe(10);
				expect(onlinePaymentTransaction.testingTransferFundsAmount ).toBe(null);
				expect(onlinePaymentTransaction.testingIsSettled).toBe(false);

				await adyenTestingUtils.createTransaction(api, bookable.val.id,
					10,
					SchedulingApiTransactionType.PAYMENT,
					SchedulingApiTransactionPaymentMethodType.MISC);
				expect(bookable.val.currentlyPaid).toBe(20);

				// try to refund more than available bookables online balance which should fail
				const prevTransactionCount = bookable.val.transactions.length;

				try {
					await adyenTestingUtils.createTransaction(api,
						bookable.val.id,
						15,
						SchedulingApiTransactionType.REFUND,
						SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
					fail();
				} catch {
					// check nothing has changed
					await api.reload();
					expect(bookable.val.transactions.length).toBe(prevTransactionCount);
					expect(bookable.val.currentlyPaid).toBe(20);

					// clean up transactions
					await adyenTestingUtils.createTransaction(api,
						bookable.val.id,
						10,
						SchedulingApiTransactionType.REFUND,
						SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
					await adyenTestingUtils.createTransaction(api,
						bookable.val.id,
						10,
						SchedulingApiTransactionType.REFUND,
						SchedulingApiTransactionPaymentMethodType.MISC);
					expect(bookable.val.currentlyPaid).toBe(0);
				}

			});

			it('external-refund', async () => {
				assumeNonNull(bookable.val);
				// create transaction
				const newPayment = await adyenTestingUtils.createTransaction(api, bookable.val.id, 10, SchedulingApiTransactionType.PAYMENT, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
				expect(newPayment.testingTransferFundsAmount ).toBe(null);
				expect(newPayment.testingIsSettled).toBe(false);

				// externally refund it (this happens for example when an account is suspended and adyen automatically refunds all outstanding payments)
				await adyenTestingUtils.sendExternalRefund(newPayment, bookable.val.bookingNumber);
				await api.reload();

				expect(bookable.val.currentlyPaid).toBe(0);
				const refundTransaction = findTransaction(bookable, newPayment.testingOriginalPspReference, SchedulingApiTransactionType.REFUND)!;
				expect(refundTransaction).toBeDefined();
				expect(refundTransaction.testingTransferFundsAmount).toBe(refundTransaction.drPlanoFeeNet + newPayment.drPlanoFeeNet);
				expect(refundTransaction.testingIsSettled).toBe(false);	// not acknowledged, therefore not settled
			});

			const doRefundTests = (captured : boolean, partial : boolean) : void => {
				let testName = 'test-REFUND-';
				testName += captured ? 'captured' : 'notCaptured';
				testName += '-';
				testName += partial ? 'partial' : 'complete';

				it(testName, async () => {
					assumeNonNull(bookable.val);
					// create payment
					const newPayment = await adyenTestingUtils.createTransaction(api, bookable.val.id, 10, SchedulingApiTransactionType.PAYMENT, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
					expect(bookable.val.currentlyPaid).toBe(10);
					expect(newPayment.testingTransferFundsAmount ).toBe(null);
					expect(newPayment.testingIsSettled).toBe(false);

					// capture payment
					if (captured) {
						await adyenTestingUtils.sendCapture(newPayment);
					}

					// Refund it
					const refundAmount = partial ? 5 : 10;
					const currentlyPaidBeforeRefund = bookable.val.currentlyPaid;

					const newRefund = await adyenTestingUtils.createTransaction(api, bookable.val.id, refundAmount, SchedulingApiTransactionType.REFUND, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
					expect(bookable.val.currentlyPaid).toBe(currentlyPaidBeforeRefund - refundAmount);

					// if captured or partial (waiting for capture) we get the fees for the original payment by adjusting the split.
					// otherwise, we need to deduct them too using transferFunds
					expect(newRefund.testingTransferFundsAmount).toBe(newRefund.drPlanoFeeNet + (captured || partial ? 0 : newPayment.drPlanoFeeNet));
					expect(newRefund.testingIsSettled).toBe(false); // not settled yet

					// fail refund
					// We cannot do this when not captured and partial because in this case the refund was internally only queued but not executed yet.
					if (captured || !partial) {
						// fail refund
						const refundIsExecutedAsCancellation = !captured && !partial;

						if (refundIsExecutedAsCancellation)
							await adyenTestingUtils.sendCancellation(newRefund, false);
						else
							await adyenTestingUtils.sendRefundSuccessFalse(newRefund);

						// do tests
						await api.reload();
						// should be settled now as we just failed the transaction
						expect(newRefund.testingIsSettled).toBe(true);

						expect(newRefund.failedChildId).toBeDefined();
						expect(bookable.val.currentlyPaid).toBe(10);

						const refundFailedTransaction = findTransaction(bookable, newRefund.testingOriginalPspReference, SchedulingApiTransactionType.REFUND_FAILED)!;
						expect(refundFailedTransaction).toBeDefined();
						if (refundIsExecutedAsCancellation) {
							expect(refundFailedTransaction.testingTransferFundsAmount).toBe(-newPayment.drPlanoFeeNet);
						} else {
							expect(refundFailedTransaction.testingTransferFundsAmount ).toBe(null);
						}
					}

					// reset state
					await adyenTestingUtils.createTransaction(api, bookable.val.id, bookable.val.currentlyPaid, SchedulingApiTransactionType.REFUND, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
					expect(bookable.val.currentlyPaid).toBe(0);
				});
			};

			doRefundTests(false, false);
			doRefundTests(false, true);
			doRefundTests(true, false);
			doRefundTests(true, true);

			/**
				 * doRefundTests() uses sendRefundSuccessFalse() to fail refunds. This test should test
				 * failing a refund using REFUND_FAILED event.
				 */
			it('test-REFUND_FAILED', async () => {
				assumeNonNull(bookable.val);
				// create payment
				const newTransaction = await adyenTestingUtils.createTransaction(api, bookable.val.id, 10, SchedulingApiTransactionType.PAYMENT, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
				expect(bookable.val.currentlyPaid).toBe(10);
				await adyenTestingUtils.sendCapture(newTransaction);
				expect(newTransaction.testingTransferFundsAmount ).toBe(null);
				expect(newTransaction.testingIsSettled).toBe(false);

				// test REFUND_FAILED
				const newRefund = await adyenTestingUtils.createTransaction(api, bookable.val.id, 10, SchedulingApiTransactionType.REFUND, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
				await adyenTestingUtils.sendRefundFailed(newRefund);
				await api.reload();

				expect(newRefund.failedChildId).toBeDefined();
				expect(bookable.val.currentlyPaid).toBe(10);
				expect(newRefund.testingTransferFundsAmount).toBe(newRefund.drPlanoFeeNet);

				const refundFailedTransaction = findTransaction(bookable, newTransaction.testingOriginalPspReference, SchedulingApiTransactionType.REFUND_FAILED)!;
				expect(refundFailedTransaction).toBeDefined();
				expect(refundFailedTransaction.testingTransferFundsAmount ).toBe(null);

				// should be settled as it failed
				expect(newRefund.testingIsSettled).toBe(true);
				expect(refundFailedTransaction.testingIsSettled).toBe(true);

				// reset state
				const finalRefund = await adyenTestingUtils.createTransaction(api, bookable.val.id, 10, SchedulingApiTransactionType.REFUND, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
				expect(bookable.val.currentlyPaid).toBe(0);
				expect(finalRefund.testingTransferFundsAmount).toBe(finalRefund.drPlanoFeeNet);
			});

			it('refund-multiple-payments', async () => {
				assumeNonNull(bookable.val);
				// create two payments
				const payment1 = await adyenTestingUtils.createTransaction(api, bookable.val.id, 5, SchedulingApiTransactionType.PAYMENT, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
				const payment2 = await adyenTestingUtils.createTransaction(api, bookable.val.id, 5, SchedulingApiTransactionType.PAYMENT, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);

				expect(payment1.testingTransferFundsAmount ).toBe(null);
				expect(payment2.testingTransferFundsAmount ).toBe(null);
				expect(payment1.testingIsSettled).toBe(false);
				expect(payment2.testingIsSettled).toBe(false);


				// refund amount greater than a single payment so two refund transactions should be created
				const transactionCountBeforeRefund = bookable.val.transactions.length;
				await adyenTestingUtils.createTransaction(api, bookable.val.id, 7, SchedulingApiTransactionType.REFUND, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
				expect(bookable.val.transactions.length).toBe(transactionCountBeforeRefund + 2);
				expect(bookable.val.currentlyPaid).toBe(3);

				// payment 2 is cancelled
				const refundOfPayment2 = findTransaction(bookable, payment2.testingOriginalPspReference, SchedulingApiTransactionType.REFUND, 5)!;
				expect(refundOfPayment2).toBeDefined();
				expect(refundOfPayment2.testingTransferFundsAmount).toBe(refundOfPayment2.drPlanoFeeNet + payment2.drPlanoFeeNet);

				// acknowledge the cancellation and check the settlement-state
				expect(refundOfPayment2.testingIsSettled).toBe(false);
				await adyenTestingUtils.sendCancellation(refundOfPayment2, true);
				await api.reload();
				expect(refundOfPayment2.testingIsSettled).toBe(true);

				// payment 1 is a pending refunded
				const refundOfPayment1 = findTransaction(bookable, payment1.testingOriginalPspReference, SchedulingApiTransactionType.REFUND, 2)!;
				expect(refundOfPayment1).toBeDefined();
				expect(refundOfPayment1.testingTransferFundsAmount).toBe(refundOfPayment1.drPlanoFeeNet);
				expect(refundOfPayment1.testingIsSettled).toBe(false);

				// reset state
				const refundTransaction = await adyenTestingUtils.createTransaction(api, bookable.val.id, 3, SchedulingApiTransactionType.REFUND, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
				expect(bookable.val.currentlyPaid).toBe(0);
				expect(refundTransaction.testingTransferFundsAmount).toBe(refundTransaction.drPlanoFeeNet);
			});

			it('automatically-fail-queued-partial-refunds', async () => {
				assumeNonNull(bookable.val);
				// create payment
				const newPayment = await adyenTestingUtils.createTransaction(api, bookable.val.id, 10, SchedulingApiTransactionType.PAYMENT, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
				expect(newPayment.testingTransferFundsAmount ).toBe(null);
				expect(newPayment.testingIsSettled).toBe(false);

				// create two partial refunds before first payment was captured. This will queue them
				// as no partial refund is possible before capture
				const newRefund1 = await adyenTestingUtils.createTransaction(api, bookable.val.id, 2, SchedulingApiTransactionType.REFUND, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
				const newRefund2 = await adyenTestingUtils.createTransaction(api, bookable.val.id, 4, SchedulingApiTransactionType.REFUND, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
				expect(bookable.val.currentlyPaid).toBe(4);
				expect(newRefund1.testingTransferFundsAmount).toBe(newRefund1.drPlanoFeeNet);
				expect(newRefund2.testingTransferFundsAmount).toBe(newRefund2.drPlanoFeeNet);

				// Fail payment -> This should automatically also fail both queued refunds
				await adyenTestingUtils.sendCaptureFailed(newPayment);
				await api.reload();

				assumeNonNull(newPayment.failedChildId);
				const paymentFailedTransaction = api.data.transactions.get(newPayment.failedChildId)!;
				expect(paymentFailedTransaction.testingTransferFundsAmount).toBe(newPayment.drPlanoFeeNet);

				assumeNonNull(newRefund1.failedChildId);
				const refund1FailedTransaction = api.data.transactions.get(newRefund1.failedChildId)!;
				expect(refund1FailedTransaction.testingTransferFundsAmount ).toBe(null);

				assumeNonNull(newRefund2.failedChildId);
				const refund2FailedTransaction = api.data.transactions.get(newRefund2.failedChildId)!;
				expect(refund2FailedTransaction.testingTransferFundsAmount ).toBe(null);
				expect(bookable.val.currentlyPaid).toBe(0);

				// all original transactions should be settled now
				expect(newPayment.testingIsSettled).toBe(true);
				expect(newRefund1.testingIsSettled).toBe(true);
				expect(newRefund2.testingIsSettled).toBe(true);
				// and all failed transaction too
				expect(paymentFailedTransaction.testingIsSettled).toBe(true);
				expect(refund1FailedTransaction.testingIsSettled).toBe(true);
				expect(refund2FailedTransaction.testingIsSettled).toBe(true);

			});

			const doTransferFundsTests = (success : boolean) : void => {
				it(`transferFunds-${  success ? 'success' : 'failed'}`, async () => {
					assumeNonNull(bookable.val);
					// create payment
					const newPayment = await adyenTestingUtils.createTransaction(api, bookable.val.id, 500, SchedulingApiTransactionType.PAYMENT, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
					expect(newPayment.testingTransferFundsAmount ).toBe(null);
					expect(newPayment.testingIsSettled).toBe(false);
					await adyenTestingUtils.sendCapture(newPayment);

					// create a partial refund before first payment was captured. This will require a transfer-funds.
					const newRefund1 = await adyenTestingUtils.createTransaction(api, bookable.val.id, 400, SchedulingApiTransactionType.REFUND, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
					expect(newRefund1.testingTransferFundsState).toBe(SchedulingApiTransactionTransferFundsState.OUTSTANDING);
					expect(newRefund1.testingTransferFundsAmount).toBe(newRefund1.drPlanoFeeNet);

					await api.save();

					// login as super admin to trigger payout process. This will first do a transfer-funds.
					const clientId = api.data.id;

					await testingUtils.login({role:LoginRole.SUPER_ADMIN});
					const clientsApi : ClientsApiService = testingUtils.getService(ClientsApiService);
					await ClientsApiClient.loadDetailed(clientsApi, clientId, {success:() => {}});
					const client = clientsApi.data.get(0)!;
					client.adyenAccount.triggerPayoutProcess = true;

					await clientsApi.save();

					// re-login as normal user
					await testingUtils.login();

					// reload api
					await api.reload();

					// since the payout process was triggered, the transferFundsState should be PENDING now
					expect(newRefund1.testingTransferFundsState).toBe(SchedulingApiTransactionTransferFundsState.PENDING);
					// acknowledge the transfer funds
					await adyenTestingUtils.sendTransferFunds(newRefund1.testingTransferFundsPSP!,
						0,
						api.data.adyenAccount.testingLiablePaymentAccount,
						api.data.adyenAccount.testingAccountHolderPaymentAccount!,
						`c:${clientId};`,
						'DEBIT_AGGREGATED_FEES',
						success);
					// test duplicate event handling. no explicit expect() needed as this fails the backend exceptionally if its not working correctly
					await adyenTestingUtils.sendTransferFunds(newRefund1.testingTransferFundsPSP!,
						0,
						api.data.adyenAccount.testingLiablePaymentAccount,
						api.data.adyenAccount.testingAccountHolderPaymentAccount!,
						`c:${clientId};`,
						'DEBIT_AGGREGATED_FEES',
						success);

					// reload api to see the effect
					await api.reload();
					// transferFundsState should be SUCCESSFUL/OUTSTANDING depending on the success value
					expect(newRefund1.testingTransferFundsState).toBe(success ? SchedulingApiTransactionTransferFundsState.SUCCESSFUL : SchedulingApiTransactionTransferFundsState.OUTSTANDING);
				});

			};
			// TODO: PLANO-118564 doTransferFundsTests(true);
			doTransferFundsTests(false);


			it('balanceChange', () => {
				assumeNonNull(bookable.val);
				// check balanceChange of all transactions
				for (const transaction of bookable.val.transactions.iterable()) {
					let expectedBalanceChange = 0;

					if (transaction.paymentMethodType === SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT) {
						expectedBalanceChange = transaction.amount!;

						// add Dr. Plano fee
						if (transaction.type === SchedulingApiTransactionType.PAYMENT ||
								transaction.type === SchedulingApiTransactionType.REFUND) {
							const drPlanoFee = 0.0239 * Math.abs(transaction.amount!) + 0.35;
							expectedBalanceChange -= drPlanoFee;
						}

						// remove rounding errors
						expectedBalanceChange = PMath.roundToDecimalPlaces(expectedBalanceChange, 2);
					}

					expect(transaction.balanceChange).toBe(expectedBalanceChange);
				}
			});

			describe('chargeback', () => {
				it('chargeback-transactions', async () => {
					assumeNonNull(bookable.val);
					// create payment
					const newTransaction = await adyenTestingUtils.createTransaction(api, bookable.val.id, 10, SchedulingApiTransactionType.PAYMENT, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
					expect(newTransaction.testingIsSettled).toBe(false);

					// capture payment
					const capturePspRef = testingUtils.getRandomString(10);
					await adyenTestingUtils.sendCapture(newTransaction, capturePspRef);
					expect(newTransaction.testingTransferFundsAmount ).toBe(null);

					// send chargeback webhook events
					await adyenTestingUtils.sendChargeback(newTransaction);
					await adyenTestingUtils.sendChargebackReversed(newTransaction);
					await adyenTestingUtils.sendSecondChargeback(newTransaction);

					// settlement-details-report available.
					// The modification psp is sometimes the dispute psp but sometimes the capture psp. See https://docs.adyen.com/reporting/settlement-detail-report#standard-columns.
					// We simulate this in the tests.
					const clientId = api.data.id;

					// fees are either set in the commission or in combination of markup, scheme and interchange.
					// See: https://docs.adyen.com/reporting/settlement-detail-report > Commission
					// We want to test both cases.
					assumeNonNull(newTransaction.testingOriginalPspReference);

					const entries : SettlementDetailsReportEntry[] =
						[
							{
								originalPsp: newTransaction.testingOriginalPspReference,
								merchantReference: `c:${clientId.rawData};b:${bookable.val.id.rawData}`,
								paymentProvider: 'VISA',
								type: 'CHARGEBACK',
								modificationPsp: capturePspRef,
								grossDebit: 10,
								netDebit: 10,
								markup: 1,
								schemeFees: 3, // additional fees
								interchangeFee: 2, // additional fees
							},
							{
								originalPsp: newTransaction.testingOriginalPspReference,
								merchantReference: `c:${clientId.rawData};b:${bookable.val.id.rawData}`,
								paymentProvider: 'VISA',
								type: 'CHARGEBACK_REVERSED',
								modificationPsp: adyenTestingUtils.DISPUTE_PSP,
								grossCredit: 10,
								markup: 15,
								schemeFees: 20, // additional fees
								interchangeFee: 30, // additional fees
							},
							{
								originalPsp: newTransaction.testingOriginalPspReference,
								merchantReference: `c:${clientId.rawData};b:${bookable.val.id.rawData}`,
								paymentProvider: 'VISA',
								type: 'SECOND_CHARGEBACK',
								modificationPsp: adyenTestingUtils.DISPUTE_PSP,
								grossDebit: 10,
								netDebit: 10,
								commission: 35, // additional fees
							},
						];

					await adyenTestingUtils.sendReportAvailable(clientId, entries);

					// check that three chargeback transactions were created
					await api.reload();

					// the payment transaction should be settled now
					expect(newTransaction.testingIsSettled).toBe(true);

					const chargebackTransaction = api.data.transactions.get(newTransaction.childChargebackId)!;
					expect(chargebackTransaction).toBeDefined();
					expect(chargebackTransaction.testingIsSettled).toBe(true);
					expect(chargebackTransaction.amount).toBe(-10);
					expect(testingUtils.safeEquals(chargebackTransaction.bookingId, newTransaction.bookingId)).toBeTrue();
					expect(testingUtils.safeEquals(chargebackTransaction.voucherId, newTransaction.voucherId)).toBeTrue();
					expect(chargebackTransaction.drPlanoFeeNet).toBe(10);
					expect(chargebackTransaction.testingTransferFundsAmount).toBe(-chargebackTransaction.amount! + chargebackTransaction.drPlanoFeeNet);

					const chargebackReversedTransaction = api.data.transactions.get(newTransaction.childChargebackReversedId)!;
					expect(chargebackReversedTransaction).toBeDefined();
					expect(chargebackReversedTransaction.testingIsSettled).toBe(true);
					expect(chargebackReversedTransaction.amount).toBe(10);
					expect(testingUtils.safeEquals(chargebackReversedTransaction.bookingId, newTransaction.bookingId)).toBeTrue();
					expect(testingUtils.safeEquals(chargebackReversedTransaction.voucherId, newTransaction.voucherId)).toBeTrue();
					expect(chargebackReversedTransaction.drPlanoFeeNet).toBe(65);
					expect(chargebackReversedTransaction.testingTransferFundsAmount).toBe(-chargebackReversedTransaction.amount! + chargebackReversedTransaction.drPlanoFeeNet);

					const secondChargebackTransaction = api.data.transactions.get(newTransaction.childSecondChargebackId)!;
					expect(secondChargebackTransaction).toBeDefined();
					expect(secondChargebackTransaction.testingIsSettled).toBe(true);
					expect(secondChargebackTransaction.amount).toBe(-10);
					expect(testingUtils.safeEquals(secondChargebackTransaction.bookingId, newTransaction.bookingId)).toBeTrue();
					expect(testingUtils.safeEquals(secondChargebackTransaction.voucherId, newTransaction.voucherId)).toBeTrue();
					expect(secondChargebackTransaction.drPlanoFeeNet).toBe(37.5);
					expect(secondChargebackTransaction.testingTransferFundsAmount).toBe(-secondChargebackTransaction.amount! + secondChargebackTransaction.drPlanoFeeNet);
				});

				// See https://www.adyen.help/hc/en-us/articles/360002067270-Why-did-I-receive-a-chargeback-on-a-refunded-transaction-
				describe('chargeback-of-a-refunded-payment', () => {
					it('refund-before-chargeback-should-succeed', async () => {
						assumeNonNull(bookable.val);
						// create payment
						const newTransaction = await adyenTestingUtils.createTransaction(api, bookable.val.id, 10, SchedulingApiTransactionType.PAYMENT, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
						expect(newTransaction.testingIsSettled).toBe(false);

						// capture payment
						const capturePspRef = testingUtils.getRandomString(10);
						await adyenTestingUtils.sendCapture(newTransaction, capturePspRef);

						// refund payment
						await adyenTestingUtils.createTransaction(api, bookable.val.id, bookable.val.currentlyPaid, SchedulingApiTransactionType.REFUND, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);

						// send chargeback webhook events
						await adyenTestingUtils.sendChargeback(newTransaction);

						// settlement-details-report available with chargeback.
						const clientId = api.data.id;
						assumeNonNull(newTransaction.testingOriginalPspReference);

						const entries : SettlementDetailsReportEntry[] =
						[
							{
								originalPsp: newTransaction.testingOriginalPspReference,
								merchantReference: `c:${clientId.rawData};b:${bookable.val.id.rawData}`,
								paymentProvider: 'VISA',
								type: 'CHARGEBACK',
								modificationPsp: capturePspRef,
								grossDebit: 10,
								netDebit: 10,
								markup: 1,
								schemeFees: 3, // additional fees
								interchangeFee: 2, // additional fees
							},
						];

						await adyenTestingUtils.sendReportAvailable(clientId, entries);

						// a chargeback transaction should have been created
						await api.reload();

						const chargebackTransaction = api.data.transactions.get(newTransaction.childChargebackId)!;
						expect(chargebackTransaction).toBeDefined();
						expect(chargebackTransaction.testingIsSettled).toBe(true);
						expect(chargebackTransaction.amount).toBe(-10);
						expect(testingUtils.safeEquals(chargebackTransaction.bookingId, newTransaction.bookingId)).toBeTrue();
						expect(testingUtils.safeEquals(chargebackTransaction.voucherId, newTransaction.voucherId)).toBeTrue();
						expect(chargebackTransaction.drPlanoFeeNet).toBe(10);
						expect(chargebackTransaction.testingTransferFundsAmount).toBe(-chargebackTransaction.amount! + chargebackTransaction.drPlanoFeeNet);

						// check that refund and chargeback have been both subtracted from balance
						expect(bookable.val.currentlyPaid).toBe(-10);
					});

					it('refund-after-chargeback-should-fail', async () => {
						assumeNonNull(bookable.val);
						const originalCurrentlyPaid = bookable.val.currentlyPaid;

						// create payment
						const newTransaction = await adyenTestingUtils.createTransaction(api, bookable.val.id, 10, SchedulingApiTransactionType.PAYMENT, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
						expect(newTransaction.testingIsSettled).toBe(false);

						// capture payment
						const capturePspRef = testingUtils.getRandomString(10);
						await adyenTestingUtils.sendCapture(newTransaction, capturePspRef);

						// send chargeback webhook events
						await adyenTestingUtils.sendChargeback(newTransaction);

						// settlement-details-report available with chargeback.
						const clientId = api.data.id;
						assumeNonNull(newTransaction.testingOriginalPspReference);

						const entries : SettlementDetailsReportEntry[] =
						[
							{
								originalPsp: newTransaction.testingOriginalPspReference,
								merchantReference: `c:${clientId.rawData};b:${bookable.val.id.rawData}`,
								paymentProvider: 'VISA',
								type: 'CHARGEBACK',
								modificationPsp: capturePspRef,
								grossDebit: 10,
								netDebit: 10,
								markup: 1,
								schemeFees: 3, // additional fees
								interchangeFee: 2, // additional fees
							},
						];

						await adyenTestingUtils.sendReportAvailable(clientId, entries);

						// refunding payment should fail now
						try {
							await adyenTestingUtils.createTransaction(api, bookable.val.id, 10, SchedulingApiTransactionType.REFUND, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
							fail();
						} catch {
							// check that only chargeback has been executed
							await api.reload();
							expect(bookable.val.currentlyPaid).toBe(originalCurrentlyPaid);
						}
					});
				});

				// It can happen that a settlement-detail-report is processed twice
				// (e.g. when there was an error during first time of processing). Make sure that chargeback transactions are not created
				// multiple times.
				it('duplicate-settlement-reports-only-create-one-chargeback', async () => {
					assumeNonNull(bookable.val);
					// create payment
					const newTransaction = await adyenTestingUtils.createTransaction(api, bookable.val.id, 10, SchedulingApiTransactionType.PAYMENT, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
					expect(newTransaction.testingIsSettled).toBe(false);

					// capture payment
					const capturePspRef = testingUtils.getRandomString(10);
					await adyenTestingUtils.sendCapture(newTransaction, capturePspRef);

					// send chargeback webhook events
					await adyenTestingUtils.sendChargeback(newTransaction);
					await adyenTestingUtils.sendChargebackReversed(newTransaction);
					await adyenTestingUtils.sendSecondChargeback(newTransaction);

					// send settlement-details-report with chargebacks twice
					const expectedCurrentlyPaid = bookable.val.currentlyPaid - 10;
					const expectedTransactionsCount = bookable.val.transactions.length + 3;

					const sendSettlementDetailsReport = async () : Promise<void> => {
						assumeNonNull(bookable.val);
						const clientId = api.data.id;
						assumeNonNull(newTransaction.testingOriginalPspReference);

						const entries : SettlementDetailsReportEntry[] =
						[
							{
								originalPsp: newTransaction.testingOriginalPspReference,
								merchantReference: `c:${clientId.rawData};b:${bookable.val.id.rawData}`,
								paymentProvider: 'VISA',
								type: 'CHARGEBACK',
								modificationPsp: capturePspRef,
								grossDebit: 10,
								netDebit: 10,
								markup: 1,
								schemeFees: 3, // additional fees
								interchangeFee: 2, // additional fees
							},
							{
								originalPsp: newTransaction.testingOriginalPspReference,
								merchantReference: `c:${clientId.rawData};b:${bookable.val.id.rawData}`,
								paymentProvider: 'VISA',
								type: 'CHARGEBACK_REVERSED',
								modificationPsp: capturePspRef,
								grossCredit: 10,
								markup: 15,
								schemeFees: 20, // additional fees
								interchangeFee: 30, // additional fees
							},
							{
								originalPsp: newTransaction.testingOriginalPspReference,
								merchantReference: `c:${clientId.rawData};b:${bookable.val.id.rawData}`,
								paymentProvider: 'VISA',
								type: 'SECOND_CHARGEBACK',
								modificationPsp: capturePspRef,
								grossDebit: 10,
								netDebit: 10,
								commission: 35, // additional fees
							},
						];

						await adyenTestingUtils.sendReportAvailable(clientId, entries);
					};

					await sendSettlementDetailsReport();
					await sendSettlementDetailsReport();

					// chargeback transactions should have been only created once
					await api.reload();

					expect(bookable.val.currentlyPaid).toBe(expectedCurrentlyPaid);
					expect(bookable.val.transactions.length).toBe(expectedTransactionsCount);
				});

				it('NOTIFICATION_OF_FRAUD', async () => {
					assumeNonNull(bookable.val);
					const newTransaction = await adyenTestingUtils.createTransaction(api, bookable.val.id, 10, SchedulingApiTransactionType.PAYMENT, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
					await adyenTestingUtils.sendNotificationOfFraud(newTransaction);
					expect().nothing();
				});

				it('PREARBITRATION_LOST', async () => {
					assumeNonNull(bookable.val);
					const newTransaction = await adyenTestingUtils.createTransaction(api, bookable.val.id, 10, SchedulingApiTransactionType.PAYMENT, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
					await adyenTestingUtils.sendPrearbitrationLost(newTransaction);
					expect().nothing();
				});

				it('PREARBITRATION_WON', async () => {
					assumeNonNull(bookable.val);
					const newTransaction = await adyenTestingUtils.createTransaction(api, bookable.val.id, 10, SchedulingApiTransactionType.PAYMENT, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
					await adyenTestingUtils.sendPrearbitrationWon(newTransaction);
					expect().nothing();
				});

				it('ISSUER_COMMENTS', async () => {
					assumeNonNull(bookable.val);
					const newTransaction = await adyenTestingUtils.createTransaction(api, bookable.val.id, 10, SchedulingApiTransactionType.PAYMENT, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
					await adyenTestingUtils.sendIssuerComments(newTransaction);
					expect().nothing();
				});

				it('DISPUTE_DEFENSE_PERIOD_ENDED', async () => {
					assumeNonNull(bookable.val);
					const newTransaction = await adyenTestingUtils.createTransaction(api, bookable.val.id, 10, SchedulingApiTransactionType.PAYMENT, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
					await adyenTestingUtils.sendDisputeDefensePeriodEnded(newTransaction);
					expect().nothing();
				});
			});
		});
	};

	describe('booking', () => {
		const booking = new CallByRef<SchedulingApiBooking>();
		beforeAll(async () => {
			await testingUtils.login();
			api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, getApiQueryParams('bookings'));

			// find "Personal Training" shift-model so we can create a booking-inquiry
			let shiftModel : SchedulingApiShiftModel | null = null;

			for (const currShiftModel of api.data.shiftModels.iterable()) {
				if (currShiftModel.name.includes('Personal Training')) {
					shiftModel = currShiftModel;
					break;
				}
			}

			if (!shiftModel)
				// eslint-disable-next-line literal-blacklist/literal-blacklist
				throw new Error('"Personal Training" shift-model could not be found.');

			// create a new booking inquiry
			booking.val = api.data.bookings.createNewItem();
			booking.val.shiftModelId = shiftModel.id;
			booking.val.firstName = 'Hans';
			booking.val.lastName = 'Müller';
			// cSpell:words hans
			booking.val.email = 'hans@dr-plano.de';
			booking.val.streetAndHouseNumber = 'Straße 10';
			booking.val.city = 'Frankfurt';
			booking.val.postalCode = '60385';
			booking.val.phoneMobile = '1111111';
			booking.val.participantCount = 1;
			booking.val.overallTariffId = shiftModel.courseTariffs.get(0)!.id;
			booking.val.ageMin = 10;
			booking.val.ageMax = 10;
			booking.val.dateOfBirth = +pMoment.m().startOf('day').subtract(1, 'year');
			booking.val.state = SchedulingApiBookingState.INQUIRY;
			booking.val.wantsNewsletter = false;
			booking.val.cancellationFee = 0;

			await api.save();
			await booking.val.loadDetailed();
		});

		doTransactionTests(booking);
	});

	describe('voucher', () => {
		const voucher = new CallByRef<SchedulingApiVoucher>();
		beforeAll(async () => {
			await testingUtils.login();
			api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, getApiQueryParams('vouchers'));

			// create a new voucher without transactions
			voucher.val = api.data.vouchers.createNewItem();
			voucher.val.firstName = 'Hans';
			voucher.val.lastName = 'Müller';
			voucher.val.email = 'hans@mueller.de';
			voucher.val.price = 20;
			voucher.val.currentValue = 20;

			await api.save();
			await voucher.val.loadDetailed();
		});

		doTransactionTests(voucher);
	});

	// We already got the chargeback fees from the AUTO_DEBIT_FAILED transaction
	it('chargeback-of-an-auto-debit-should-be-ignored', async() => {
		await testingUtils.login();
		api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, getApiQueryParams('transactions'));

		// Find our fake auto-debit transaction
		let autoDebitTransaction : SchedulingApiTransaction | null = null;

		for (const transaction of api.data.transactions.iterable()) {
			if (transaction.type === SchedulingApiTransactionType.AUTO_DEBIT) {
				autoDebitTransaction = transaction;
				break;
			}
		}

		if (!autoDebitTransaction)
			throw new Error('No auto-debit transaction could be found.');

		// fake a chargeback for the auto-debit transaction
		const prevOnlineBalance = api.data.adyenAccount.balance;
		const clientId = api.data.id;
		assumeNonNull(autoDebitTransaction.testingOriginalPspReference);

		const entries : SettlementDetailsReportEntry[] =
			[
				{
					originalPsp: autoDebitTransaction.testingOriginalPspReference,
					merchantReference: `c:${clientId.rawData}`,
					paymentProvider: 'VISA',
					type: 'CHARGEBACK',
					modificationPsp: adyenTestingUtils.DISPUTE_PSP,
					grossDebit: -autoDebitTransaction.amount!,
					netDebit: -autoDebitTransaction.amount!,
				},
			];

		await adyenTestingUtils.sendReportAvailable(clientId, entries);

		// check that no chargeback transaction was created (by checking that the online-balance has not changed)
		await api.reload();

		expect(api.data.adyenAccount.balance).toBe(prevOnlineBalance);
	});
});
