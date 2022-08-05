/* eslint-disable unicorn/no-empty-file */

// TODO: PLANO-118564
/* describe('#SchedulingApiService #needsapi', () =>
 {
 	const testingUtils = new TestingUtils();
 	const pMoment = new PMomentService(PSupportedLocaleIds.de_DE);
 	const apiTestingUtils = new ApiTestingUtils();
 	const adyenTestingUtils = new AdyenTestingUtils();

 	const getApiQueryParams = (dataType : string) : HttpParams => {
 		// start/end
 		// Hack: data.shifts currently returns shifts of the whole day. workingTimes/absences not. So, to be consistent, start/end should be start/end of day
 		let start = pMoment.m().subtract(1, 'week').startOf('day').valueOf().toString();
 		let end = pMoment.m().add(1, 'week').startOf('day').valueOf().toString();

 		const queryParams = new HttpParams()
 			.set('data', dataType)
 			.set('start', start)
 			.set('end', end)
 			.set('bookingsStart', start)
 			.set('bookingsEnd', end)
 			.set('bookingsByShiftTime', 'true');

 		return queryParams;
 	}

	it('auto-debit', async () =>
	{
		// load api
		await testingUtils.login();
 		const api = await testingUtils.unloadAndLoadApi(SchedulingApiService, null, getApiQueryParams('vouchers'));

		// create a new voucher with a big payment which we can refund later (partially) to trigger auto-debit
		const voucher = api.data.vouchers.createNewItem();
		voucher.firstName = 'Hans';
		voucher.lastName = 'Müller';
		voucher.email = 'hans@mueller.de';
		voucher.price = 20;

		const newTransaction = await adyenTestingUtils.createTransaction(api, voucher.id, 50000, SchedulingApiTransactionType.PAYMENT, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);
		const voucherId = voucher.id;

		// Make a payout to reach deposit amount.
		// Note, that a payout will have extra fees of 0,6€ (including VAT)
		await testingUtils.unloadAndLoadApi(SchedulingApiService, null, getApiQueryParams('transactions'));

		const desiredDeposit = api.data.adyenAccount.testingDesiredDeposit;
		const payoutAmount = PMath.roundToDecimalPlaces(api.data.adyenAccount.balance - desiredDeposit - 0.6, 2);

		await adyenTestingUtils.sendPayoutSuccess(payoutAmount, api.data.adyenAccount.testingAccountHolderCode);

		// Balance should now be desired deposit
		await api.reload();
		expect(api.data.adyenAccount.balance).toBe(desiredDeposit);

		// TODO: PLANO-117173 Make a refund to trigger the auto-debit "soon" email and test that the email was send

		// Make a second refund to be below 50% of desired deposit and check that auto-debit transaction was created
		// TODO: PLANO-117173 Also check that auto-debit adyen api was called
		const refundAmount = PMath.roundToDecimalPlaces(desiredDeposit * 0.51, 2);
		await adyenTestingUtils.createTransaction(api, voucherId, refundAmount, SchedulingApiTransactionType.REFUND, SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT);

		const autoDebitTransaction = adyenTestingUtils.findRecentTransaction(api, SchedulingApiTransactionType.AUTO_DEBIT);
		expect(autoDebitTransaction).toBeDefined();
		expect(autoDebitTransaction.amount > 0).toBeTrue();
		expect(autoDebitTransaction.drPlanoFee).toBe(0.6);
		expect(autoDebitTransaction.testingTransferFundsAmount).toBe(null);

		// TODO: PLANO-117173 Check Auto-Debit email

		// Send auto-debit failed event and check that transaction was created
		await adyenTestingUtils.sendAutoDebitFailed(autoDebitTransaction);
		await api.reload();

		const autoDebitFailedTransaction = api.data.transactions.get(autoDebitTransaction.failedChildId);
		expect(autoDebitFailedTransaction).toBeDefined();
		expect(autoDebitFailedTransaction.amount).toBe(-autoDebitTransaction.amount);
		expect(autoDebitFailedTransaction.drPlanoFee).toBe(11.9);
		expect(autoDebitFailedTransaction.testingTransferFundsAmount).toBe(autoDebitFailedTransaction.drPlanoFee+autoDebitTransaction.drPlanoFee);

		// Auto-debit should be automatically disabled after a failed event
		await testingUtils.login({role: LoginRole.SUPER_ADMIN});
		const clientsApi = await testingUtils.loadApi(ClientsApiService, null, null);
		const clientId = api.data.id;
		const client = clientsApi.data.get(clientId);

		expect(client.adyenAccount.autoDebitEnabled).toBeFalse();

		// to restore initial state enable auto-debit again
		client.adyenAccount.autoDebitEnabled = true;
		clientsApi.save();

		expect(client.adyenAccount.autoDebitEnabled).toBeTrue();
	});
 });*/
