/* eslint-disable max-lines */
// cSpell:ignore AUTHORISATION, ECOM, mcsuperpremiumcredit, Disp
/* eslint-disable no-async-promise-executor */

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Currency, Integer} from './generated-types.ag';
import { PSupportedLocaleIds } from './generated-types.ag';
import { Id } from './id';
import { SchedulingApiService, SchedulingApiTransaction, SchedulingApiTransactionType} from '..';
import { SchedulingApiTransactionPaymentMethodType } from '..';
import { PMomentService } from '../../../client/shared/p-moment.service';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNotUndefined } from '../../core/null-type-utils';
import { TestingUtils } from '../../testing/testing-utils';

export class SettlementDetailsReportEntry {
	public originalPsp : string | null = null;
	public merchantReference : string | null = null;
	public paymentProvider : string | null = null;
	public type : string | null = null;
	public modificationPsp : string | null = null;
	public grossDebit ?: Currency;
	public grossCredit ?: Currency;
	public netDebit ?: Currency;
	public netCredit ?: Currency;
	public commission ?: Currency;
	public markup ?: Currency;
	public schemeFees ?: Currency;
	public interchangeFee ?: Currency;
	public batchNumber ?: Integer;
}

export class AdyenTestingUtils {
	private pMoment = new PMomentService(PSupportedLocaleIds.de_DE);
	private testingUtils = new TestingUtils();

	private getRequestOptions() : {
		headers : HttpHeaders,
		params : HttpParams,
		observe : 'response',
		responseType : 'text'
		} {
		// headers
		const headers = new HttpHeaders({
			// eslint-disable-next-line @typescript-eslint/naming-convention
			Authorization: `Basic ${btoa('test:test')}`,
		});

		// query params (bypass the hmac verification as we dont have the certificates to generate the hmac)
		const queryParams = new HttpParams().set('ignoreHMAC', 'true');

		// return result
		return {
			headers: headers,
			params: queryParams,
			observe: 'response',
			responseType: 'text',
		};
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public async createTransaction(
		api : SchedulingApiService,
		bookableId : Id,
		amount : number,
		type : SchedulingApiTransactionType,
		paymentMethodType : SchedulingApiTransactionPaymentMethodType,
	) : Promise<SchedulingApiTransaction> {
		return new Promise(async (resolve, reject) => {
			try {
				const newTransaction = api.data.transactions.createNewItem();
				newTransaction.type = type;
				newTransaction.paymentMethodType = paymentMethodType;
				newTransaction.bookingId = bookableId;
				newTransaction.absAmount = amount;

				if (paymentMethodType === SchedulingApiTransactionPaymentMethodType.MISC)
					newTransaction.miscPaymentMethodName = 'Bezahlung vor Ort';

				await api.save();
				resolve(newTransaction);
			} catch {
				reject();
			}
		});
	}

	/**
	 * Searches the transaction list of a transaction with `type` which was created in the last 5 sec.
	 */
	public findRecentTransaction(api : SchedulingApiService, type : SchedulingApiTransactionType) : SchedulingApiTransaction | null {
		const fiveSecAgo = this.pMoment.m().valueOf() - 5000;

		for (const transaction of api.data.transactions.iterable()) {
			if (transaction.type === type && transaction.dateTime >= fiveSecAgo)
				return transaction;
		}

		return null;
	}

	private async sendGeneralNotification(body : any) : Promise<void> {
		return new Promise(async (resolve) => {
			const response = await this.httpClient.post('http://localhost:8182/adyen_api/general_notifications', body, this.getRequestOptions()).toPromise();
			assumeNotUndefined(response);
			expect(response.body).toBe('[accepted]');

			// Adyen general notifications are processed asynchronously. See (https://drplano.atlassian.net/l/c/1R7NQ7H1)
			// So wait little bit to have updated results
			window.setTimeout(resolve, 500);
		});
	}

	private async sendPlatformNotification(body : any) : Promise<void> {
		return new Promise(async (resolve) => {
			const response = await this.httpClient.post('http://localhost:8182/adyen_api/platform_notifications', body, this.getRequestOptions()).toPromise();
			assumeNotUndefined(response);
			assumeDefinedToGetStrictNullChecksRunning(response.body, 'response.body');
			const responseJson = JSON.parse(response.body);
			expect(responseJson.notificationResponse).toBe('[accepted]');

			// Adyen platform notifications are processed asynchronously. See (https://drplano.atlassian.net/l/c/1R7NQ7H1)
			// So wait little bit to have updated results
			window.setTimeout(resolve, 500);
		});
	}

	private get httpClient() : HttpClient {
		// We cannot inject this at object creation so we do it lazily
		return TestBed.inject(HttpClient);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public async sendTransferFunds(
		transferFundsPsp : string,
		transferFundsAmount : Currency,
		destinationAccountCode : string,
		sourceAccountCode : string,
		merchantReference : string,
		transferCode : string,
		success : boolean,
	) : Promise<void> {
		return this.sendPlatformNotification({
			eventDate: '2022-02-02T12:47:59+01:00',
			eventType: 'TRANSFER_FUNDS',
			executingUserKey: 'Fund Transfer',
			live: false,
			pspReference: transferFundsPsp,
			content: {
				amount: {
					currency: 'EUR',
					value: transferFundsAmount,
				},
				destinationAccountCode: destinationAccountCode,
				merchantReference: merchantReference,
				sourceAccountCode: sourceAccountCode,
				status: {
					statusCode: success ? 'Success' : 'Failed',
				},
				transferCode: transferCode,
			},
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public async sendAuthorizationSuccessFalse(transaction : SchedulingApiTransaction) : Promise<void> {
		assumeDefinedToGetStrictNullChecksRunning(transaction.amount, 'transaction.amount');
		assumeDefinedToGetStrictNullChecksRunning(transaction.api, 'transaction.api');
		return this.sendGeneralNotification({
			live: 'false',
			notificationItems: [
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					NotificationRequestItem:{
						eventCode: 'AUTHORISATION',
						eventDate: '2021-04-13T16:29:06+02:00',
						merchantAccountCode: 'ClimbTimeECOM',
						pspReference: transaction.testingPspReference,
						originalReference: transaction.testingOriginalPspReference,
						amount: {
							currency: 'EUR',
							value: transaction.amount * 100,
						},
						merchantReference: `c:${transaction.api.data.id.rawData}`,
						success: false,
						paymentMethod: 'mc',
						reason: 'something went terribly wrong',
					},
				},
			],
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public async sendAuthorizationSuccessTrue(merchantReference : string, amount : number, psp : string) : Promise<void> {
		return this.sendGeneralNotification({
			live: 'false',
			notificationItems: [
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					NotificationRequestItem:{
						eventCode: 'AUTHORISATION',
						eventDate: '2021-04-13T16:29:06+02:00',
						merchantAccountCode: 'ClimbTimeECOM',
						pspReference: psp,
						originalReference: psp,
						amount: {
							currency: 'EUR',
							value: amount,
						},
						merchantReference: merchantReference,
						success: true,
						paymentMethod: 'mc',
						reason: 'something went terribly wrong',
					},
				},
			],
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public async sendCaptureFailed(transaction : SchedulingApiTransaction) : Promise<void> {
		assumeDefinedToGetStrictNullChecksRunning(transaction.amount, 'transaction.amount');
		assumeDefinedToGetStrictNullChecksRunning(transaction.api, 'transaction.api');
		return this.sendGeneralNotification( {
			live:'false',
			notificationItems:[
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					NotificationRequestItem:{
						amount:{
							currency:'EUR',
							value: transaction.amount * 100,
						},
						eventCode:'CAPTURE_FAILED',
						eventDate:'2018-05-27T15:42:02+02:00',
						merchantAccountCode:'ClimbTimeECOM',
						originalReference: transaction.testingOriginalPspReference,
						paymentMethod:'mc',
						pspReference: transaction.testingPspReference,
						merchantReference: `c:${transaction.api.data.id.rawData}`,
						reason:'Capture Failed',
						success:'true',
					},
				},
			],
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public async sendRefundSuccessFalse(transaction : SchedulingApiTransaction) : Promise<void> {
		assumeDefinedToGetStrictNullChecksRunning(transaction.amount, 'transaction.amount');
		assumeDefinedToGetStrictNullChecksRunning(transaction.api, 'transaction.api');
		return this.sendGeneralNotification({
			live:'false',
			notificationItems:[
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					NotificationRequestItem:{
						amount:{
							currency:'EUR',
							value: transaction.amount * 100,
						},
						eventCode:'REFUND',
						eventDate:'2018-11-01T00:19:34+01:00',
						merchantAccountCode:'YOUR_MERCHANT_ACCOUNT',
						originalReference: transaction.testingOriginalPspReference,
						paymentMethod:'mc',
						pspReference: transaction.testingPspReference,
						reason:"Transaction hasn't been captured, refund not possible",
						merchantReference: `c:${transaction.api.data.id.rawData}`,
						success:'false',
					},
				},
			],
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public async sendRefundFailed(transaction : SchedulingApiTransaction) : Promise<void> {
		assumeDefinedToGetStrictNullChecksRunning(transaction.amount, 'transaction.amount');
		assumeDefinedToGetStrictNullChecksRunning(transaction.api, 'transaction.api');
		return this.sendGeneralNotification({
			live: 'false',
			notificationItems: [
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					NotificationRequestItem: {
						amount: {
							value: transaction.amount * 100,
							currency: 'EUR',
						},
						eventCode: 'REFUND_FAILED',
						eventDate: 1620646361000,
						merchantAccountCode: 'ClimbTimeECOM',
						merchantReference: `c:${transaction.api.data.id.rawData}`,
						originalReference: transaction.testingOriginalPspReference,
						pspReference: transaction.testingPspReference,
						reason: 'Refund Failed',
						success: true,
						paymentMethod: 'mc',
						operations: null,
					},
				},
			],
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public async sendExternalRefund(transaction : SchedulingApiTransaction, bookableNumber : number) : Promise<void> {
		assumeDefinedToGetStrictNullChecksRunning(transaction.amount, 'transaction.amount');
		assumeDefinedToGetStrictNullChecksRunning(transaction.api, 'transaction.api');
		return this.sendGeneralNotification({
			live: 'false',
			notificationItems: [
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					NotificationRequestItem: {
						amount: {
							currency: 'EUR',
							value: transaction.amount * 100,
						},
						eventCode: 'REFUND',
						eventDate: '2021-05-26T13:22:00+02:00',
						merchantAccountCode: 'ClimbTimeECOM',
						merchantReference: `c:${transaction.api.data.id.rawData};b:${bookableNumber}`,
						originalReference: transaction.testingOriginalPspReference,
						paymentMethod: 'mc',
						pspReference: transaction.testingPspReference,
						reason: '',
						success: 'true',
					},
				},
			],
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public async sendCapture(transaction : SchedulingApiTransaction, capturePspRef ?: string) : Promise<void> {
		assumeDefinedToGetStrictNullChecksRunning(transaction.amount, 'transaction.amount');
		assumeDefinedToGetStrictNullChecksRunning(transaction.api, 'transaction.api');
		return this.sendGeneralNotification({
			live: 'false',
			notificationItems: [
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					NotificationRequestItem: {
						amount: {
							currency: 'EUR',
							value: transaction.amount * 100,
						},
						eventCode: 'CAPTURE',
						eventDate: '2021-05-26T13:22:00+02:00',
						merchantAccountCode: 'ClimbTimeECOM',
						merchantReference: `c:${transaction.api.data.id.rawData}`,
						originalReference: transaction.testingOriginalPspReference,
						paymentMethod: 'mc',
						pspReference: capturePspRef ?? this.testingUtils.getRandomString(10),
						reason: '',
						success: 'true',
					},
				},
			],
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public async sendCancellation(transaction : SchedulingApiTransaction, success : boolean) : Promise<void> {
		assumeDefinedToGetStrictNullChecksRunning(transaction.amount, 'transaction.amount');
		assumeDefinedToGetStrictNullChecksRunning(transaction.api, 'transaction.api');
		return this.sendGeneralNotification({
			live:'false',
			notificationItems:[
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					NotificationRequestItem:{
						amount:{
							currency:'EUR',
							value: transaction.amount * 100,
						},
						eventCode:'CANCELLATION',
						eventDate:'2018-03-05T09:08:05+01:00',
						merchantAccountCode:'YOUR_MERCHANT_ACCOUNT',
						merchantReference: `c:${transaction.api.data.id.rawData}`,
						originalReference: transaction.testingOriginalPspReference,
						paymentMethod:'mc',
						pspReference: transaction.testingPspReference,
						reason:'Transaction not found',
						success: success,
					},
				},
			],
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public async sendNotificationOfFraud(transaction : SchedulingApiTransaction) : Promise<void> {
		assumeDefinedToGetStrictNullChecksRunning(transaction.amount, 'transaction.amount');
		assumeDefinedToGetStrictNullChecksRunning(transaction.api, 'transaction.api');
		return this.sendGeneralNotification( {
			live: 'false',
			notificationItems: [
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					NotificationRequestItem: {
						additionalData: {
							modificationMerchantReferences: '',
							nofReasonCode: '6',
							paymentMethodVariant: 'mcsuperpremiumcredit',
							nofSchemeCode: 'mc',
						},
						amount: {
							currency: 'EUR',
							value: transaction.amount * 100,
						},
						eventCode: 'NOTIFICATION_OF_FRAUD',
						eventDate: '2020-07-19T04:01:13+02:00',
						merchantAccountCode: 'ClimbTimeECOM',
						merchantReference: `c:${transaction.api.data.id.rawData}`,
						originalReference: transaction.testingOriginalPspReference,
						paymentMethod: 'mc',
						pspReference: '8926323150775311',
						reason: 'Card Not Present Fraud',
						success: 'true',
					},
				},
			],
		});
	}

	/**
	 * All chargeback-events contain as "pspReference" the dispute psp. We take here a real dispute psp from Adyen.
	 * So, api calls to Adyen will work.
	 */
	public DISPUTE_PSP = '8936323150923182';

	// eslint-disable-next-line jsdoc/require-jsdoc
	public async sendIssuerComments(transaction : SchedulingApiTransaction) : Promise<void> {
		assumeDefinedToGetStrictNullChecksRunning(transaction.amount, 'transaction.amount');
		assumeDefinedToGetStrictNullChecksRunning(transaction.api, 'transaction.api');
		return this.sendGeneralNotification({
			live : 'true',
			notificationItems : [
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					NotificationRequestItem : {
						additionalData : {
							chargebackReasonCode : '13.3',
							chargebackSchemeCode : 'visa',
							'issuerComments.type': 'chargeback', // eslint-disable-line @typescript-eslint/naming-convention
							'issuerComments.disputeAmountChangeReason': 'some_text', // eslint-disable-line @typescript-eslint/naming-convention
							'issuerComments.cancellationMethod': 'some_text', // eslint-disable-line @typescript-eslint/naming-convention
							'issuerComments.orderDetailsNotAsDescribed': 'some_text', // eslint-disable-line @typescript-eslint/naming-convention
							'issuerComments.explanation': 'some_text', // eslint-disable-line @typescript-eslint/naming-convention
							'issuerComments.damagedOrDefectiveOrderInfo': 'some_text', // eslint-disable-line @typescript-eslint/naming-convention
							'issuerComments.howChAttemptReturnAndDispOfMerchandise': 'some_text', // eslint-disable-line @typescript-eslint/naming-convention
							'issuerComments.whatWasNotReceived': 'some_text', // eslint-disable-line @typescript-eslint/naming-convention
							'issuerComments.cancellationDate': 'some_text', // eslint-disable-line @typescript-eslint/naming-convention
						},
						amount : {
							currency : 'EUR',
							value : transaction.amount * 100,
						},
						eventCode : 'ISSUER_COMMENTS',
						eventDate : '2021-05-17T09:35:14+02:00',
						merchantAccountCode : 'ClimbTimeECOM',
						merchantReference: `c:${transaction.api.data.id.rawData}`,
						originalReference: transaction.testingOriginalPspReference,
						paymentMethod : 'visa',
						pspReference : this.DISPUTE_PSP,
						reason : 'Not as Described or Defective Merchandise/Services',
						success : 'true',
					},
				},
			],
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public async sendDisputeDefensePeriodEnded(transaction : SchedulingApiTransaction) : Promise<void> {
		assumeDefinedToGetStrictNullChecksRunning(transaction.amount, 'transaction.amount');
		assumeDefinedToGetStrictNullChecksRunning(transaction.api, 'transaction.api');
		return this.sendGeneralNotification({
			live:'true',
			notificationItems:[
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					NotificationRequestItem:{
						additionalData:{
							chargebackReasonCode:'10.4',
							modificationMerchantReferences:'',
							chargebackSchemeCode:'visa',
							disputeStatus : 'Lost',
						},
						amount:{
							currency:'EUR',
							value:transaction.amount * 100,
						},
						eventCode:'DISPUTE_DEFENSE_PERIOD_ENDED',
						eventDate:'2020-11-11T01:30:57+01:00',
						merchantAccountCode:'ClimbTimeECOM',
						merchantReference: `c:${transaction.api.data.id.rawData}`,
						originalReference: transaction.testingOriginalPspReference,
						paymentMethod:'visa',
						pspReference:this.DISPUTE_PSP,
						reason:'Other Fraud-Card Absent Environment',
						success:'true',
					},
				},
			],
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public async sendPrearbitrationLost(transaction : SchedulingApiTransaction) : Promise<void> {
		assumeDefinedToGetStrictNullChecksRunning(transaction.amount, 'transaction.amount');
		assumeDefinedToGetStrictNullChecksRunning(transaction.api, 'transaction.api');
		return this.sendGeneralNotification({
			live:'true',
			notificationItems:[
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					NotificationRequestItem:{
						additionalData : {
							disputeStatus : 'Lost',
						},
						amount:{
							currency:'EUR',
							value:transaction.amount * 100,
						},
						eventCode:'PREARBITRATION_LOST',
						eventDate:'2020-03-23T13:55:31+01:00',
						merchantAccountCode:'ClimbTimeECOM',
						merchantReference: `c:${transaction.api.data.id.rawData}`,
						originalReference: transaction.testingOriginalPspReference,
						paymentMethod:'visa',
						pspReference:this.DISPUTE_PSP,
						reason:'Other Fraud-Card Absent Environment',
						success:'true',
					},
				},
			],
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public async sendPrearbitrationWon(transaction : SchedulingApiTransaction) : Promise<void> {
		assumeDefinedToGetStrictNullChecksRunning(transaction.amount, 'transaction.amount');
		assumeDefinedToGetStrictNullChecksRunning(transaction.api, 'transaction.api');
		return this.sendGeneralNotification({
			live:'true',
			notificationItems:[
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					NotificationRequestItem:{
						additionalData : {
							disputeStatus : 'Won',
						},
						amount:{
							currency:'EUR',
							value:transaction.amount * 100,
						},
						eventCode:'PREARBITRATION_WON',
						eventDate:'2020-03-23T13:55:31+01:00',
						merchantAccountCode:'ClimbTimeECOM',
						merchantReference: `c:${transaction.api.data.id.rawData}`,
						originalReference: transaction.testingOriginalPspReference,
						paymentMethod:'visa',
						pspReference:this.DISPUTE_PSP,
						reason:'Other Fraud-Card Absent Environment',
						success:'true',
					},
				},
			],
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public async sendChargeback(transaction : SchedulingApiTransaction) : Promise<void> {
		assumeDefinedToGetStrictNullChecksRunning(transaction.amount, 'transaction.amount');
		assumeDefinedToGetStrictNullChecksRunning(transaction.api, 'transaction.api');
		return this.sendGeneralNotification({
			live:'true',
			notificationItems:[
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					NotificationRequestItem:{
						additionalData:{
							chargebackReasonCode:'10.4',
							modificationMerchantReferences:'',
							chargebackSchemeCode:'visa',
							defensePeriodEndsAt:'2021-05-24T22:09:50+02:00',
							defendable : 'true',
							disputeStatus : 'Undefended',
						},
						amount:{
							currency:'EUR',
							value: transaction.amount * 100,
						},
						eventCode:'CHARGEBACK',
						eventDate:'2021-05-06T22:09:50+02:00',
						merchantAccountCode:'ClimbTimeECOM',
						merchantReference: `c:${transaction.api.data.id.rawData}`,
						originalReference: transaction.testingOriginalPspReference,
						paymentMethod:'visa',
						pspReference:this.DISPUTE_PSP,
						reason:'Other Fraud-Card Absent Environment',
						success:'true',
					},
				},
			],
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public async sendChargebackReversed(transaction : SchedulingApiTransaction) : Promise<void> {
		assumeDefinedToGetStrictNullChecksRunning(transaction.amount, 'transaction.amount');
		assumeDefinedToGetStrictNullChecksRunning(transaction.api, 'transaction.api');
		return this.sendGeneralNotification({
			live:'true',
			notificationItems:[
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					NotificationRequestItem:{
						additionalData:{
							disputeStatus : 'Pending',
						},
						amount:{
							currency:'EUR',
							value: transaction.amount * 100,
						},
						eventCode:'CHARGEBACK_REVERSED',
						eventDate:'2021-05-06T22:09:50+02:00',
						merchantAccountCode:'ClimbTimeECOM',
						merchantReference: `c:${transaction.api.data.id.rawData}`,
						originalReference: transaction.testingOriginalPspReference,
						paymentMethod:'visa',
						pspReference:this.DISPUTE_PSP,
						reason:'Other Fraud-Card Absent Environment',
						success:'true',
					},
				},
			],
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public async sendSecondChargeback(transaction : SchedulingApiTransaction) : Promise<void> {
		assumeDefinedToGetStrictNullChecksRunning(transaction.amount, 'transaction.amount');
		assumeDefinedToGetStrictNullChecksRunning(transaction.api, 'transaction.api');
		return this.sendGeneralNotification({
			live:'true',
			notificationItems:[
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					NotificationRequestItem:{
						additionalData:{
							chargebackReasonCode:'10.4',
							modificationMerchantReferences:'',
							chargebackSchemeCode:'visa',
							disputeStatus : 'Lost',
						},
						amount:{
							currency:'EUR',
							value: transaction.amount * 100,
						},
						eventCode:'SECOND_CHARGEBACK',
						eventDate:'2021-05-06T22:09:50+02:00',
						merchantAccountCode:'ClimbTimeECOM',
						merchantReference: `c:${transaction.api.data.id.rawData}`,
						originalReference: transaction.testingOriginalPspReference,
						paymentMethod:'visa',
						pspReference:this.DISPUTE_PSP,
						reason:'Other Fraud-Card Absent Environment',
						success:'true',
					},
				},
			],
		});
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public async sendAutoDebitFailed(autoDebitTransaction : SchedulingApiTransaction) : Promise<void> {
		assumeDefinedToGetStrictNullChecksRunning(autoDebitTransaction.api, 'autoDebitTransaction.api');
		assumeDefinedToGetStrictNullChecksRunning(autoDebitTransaction.amount, 'autoDebitTransaction.amount');
		const clientId = autoDebitTransaction.api.data.id;
		const now = this.pMoment.m().valueOf();

		await this.sendPlatformNotification({
			eventDate: '2021-07-07T16:30:37+02:00',
			eventType: 'DIRECT_DEBIT_INITIATED',
			live: 'false',
			pspReference: autoDebitTransaction.testingPspReference,
			content: {
				accountCode: '8825579787887769',
				amount: {
					currency: 'EUR',
					value: autoDebitTransaction.amount * 100,
				},
				debitInitiationDate: '2021-07-07',
				merchantAccountCode: 'ClimbTimeECOM',
				splits: [
					{
						account: '8535516988037431',
						amount: {
							currency: 'EUR',
							value: autoDebitTransaction.amount * 100,
						},
						reference: `c:${clientId.rawData};${now}`, // The reference must be unique so we attach current milliseconds
						type: 'MarketPlace',
					},
				],
				status: {
					message: {
						code: '10_145',
						text: 'Failed to initiate the direct debit for account holder.',
					},
					statusCode: 'Failed',
				},
			},
		});
	}

	/**
	 * Currently this does not send a UUID in merchantReference-field. This would be required if we want to reference
	 * this in a later payout-failed event.
	 * @param amount The payout amount.
	 * @param accountHolderCode Adyens account holder code. See `schedulingApi.data.adyenAccount.testingAccountHolderCode`.
	 */
	public async sendPayoutSuccess(amount : Currency, accountHolderCode : string) : Promise<void> {
		await this.sendPlatformNotification({
			eventDate: '2021-08-09T11:53:00+02:00',
			eventType: 'ACCOUNT_HOLDER_PAYOUT',
			executingUserKey: 'Payout',
			live: false,
			pspReference: this.testingUtils.getRandomString(10),
			content: {
				accountCode: '',
				accountHolderCode: accountHolderCode,
				amounts: [
					{
						currency: 'EUR',
						value: amount * 100, // Adyen notifications send this in cents
					},
				],
				bankAccountDetail: {
					bankAccountUUID: 'f303c28a-75a5-41fa-8a8a-20b091b2fa44',
					countryCode: 'DE',
					currencyCode: 'EUR',
					iban: 'DE16888888880023456789',
					ownerCity: 'PASSED',
					ownerCountryCode: 'DE',
					ownerName: 'TestData',
					ownerPostalCode: '64295',
					ownerStreet: 'Hilpertstraße',
					primaryAccount: false,
				},
				description: '12345 – Test',
				estimatedArrivalDate: '2021-08-09',
				payoutSpeed: 'STANDARD',
				status: {
					statusCode: 'Confirmed',
				},
			},
		});
	}

	/**
	 * Sends a fake settlement-details-report to our backend.
	 * @param addEntries Pass here a list of entries which should be shown in the report.
	 */
	public async sendReportAvailable(clientId : Id, entries : SettlementDetailsReportEntry[]) : Promise<void> {
		// Batch numbers must be always increasing numbers and also in integer range.
		// We use currentMillis sind beginning of 2021 divided by 3000. So we get unique
		// increasing numbers as long as the test is not executed multiple times in 3000 milliseconds.
		const beginningOf2021 = 1609455600000;
		const now = this.pMoment.m().valueOf();
		const batchNumber = Math.floor((now - beginningOf2021) / 3000);

		// add batch-number to entries
		for (const entry of entries)
			entry.batchNumber = batchNumber;

		// send event
		await this.sendGeneralNotification({
			live: 'false',
			notificationItems: [
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					NotificationRequestItem: {
						additionalData: {
							hmacSignature: 'Y4rvBgOkxZx5MGrHQHhU+iaS92mijly+krrOPhQ5ygQ=',
						},
						amount: {
							currency: 'EUR',
							value: 0,
						},
						eventCode: 'REPORT_AVAILABLE',
						eventDate: '2021-07-29T21:33:26+02:00',
						merchantAccountCode: 'ClimbTimeECOM',
						merchantReference: '',
						pspReference: `settlement_detail_report_batch_${batchNumber}.csv`,
						reason: `http://127.0.0.1:8182/testing/adyen_api/settlement_details.csv?clientId=${clientId.rawData}&batchNumber=${batchNumber}&add=${JSON.stringify(entries)}`,
						success: 'true',
					},
				},
			],
		});

		// the report is processed asynchronously by backend so just wait little bit
		await new Promise(resolve => window.setTimeout(resolve, 2000));
	}
}
