import { HttpResponse, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Integer } from './generated-types.ag';

export type ApiSaveSuccessHandler = (response : HttpResponse<unknown> | null, noChanges : boolean) => void;
export type ApiLoadSuccessHandler = (response : HttpResponse<unknown>) => void;
export type ApiPostSuccessHandler = (response : HttpResponse<unknown>) => void;
export type ApiErrorHandler = (response : HttpErrorResponse) => void;

export class ApiLoadArgs {

	/**
	 * Success handler.
	 */
	public success ?: ApiLoadSuccessHandler | null;

	/**
	 * Error handler.
	 */
	public error ?: ApiErrorHandler | null;

	/**
	 * Parameters to be passed to the api. These api request will be
	 * "<api_name>?<search_param_1>=<search_param_1_value>&<search_param_2>=<search_param_2_value>&...".
	 */
	public searchParams ?: HttpParams | null;
}

export class ApiSaveArgs {

	/**
	 * Success handler. Note that when no save was done because no changes were found, this
	 * method is still called but "response" will be "null" and "noChanges" "true".
	 */
	public success ?: ApiSaveSuccessHandler | null;

	/**
	 * Error handler.
	 */
	public error ?: ApiErrorHandler | null;

	/**
	 * Here you can pass additional query-params for the save() call which will be added to the query-params of last load() call.
	 * These params will only be used for this save() call and then discarded.
	 */
	public additionalSearchParams ?: HttpParams | null;

	/**
	 * Executes save even if the data to save is empty.
	 */
	public saveEmptyData ?: boolean | null;

	/**
	 * Only relevant when saveEmptyData === true. When no data is send set this to true to still send root meta.
	 */
	public sendRootMetaOnEmptyData ?: boolean | null;

	/**
	 * Save data in sync mode?
	 */
	public sync ?: boolean | null;

	/**
	 * Optionally defines a data path which should be saved.
	 * This is an array of indices from the data array.
	 */
	public onlySavePath ?: Array<number> | null;
}

export class ApiPostArgs {

	/**
	 * Success handler.
	 */
	public success ?: ApiPostSuccessHandler | null;

	/**
	 * Error handler.
	 */
	public error ?: ApiErrorHandler | null;

	/**
	 * Here you can pass query-params to be passed during the POST call.
	 */
	public searchParams ?: HttpParams | null;
}

/**
 * Enum indicating whether an Online-Cancellation is possible or not.
 * NOTE: Be careful! This enum also exists in backend/java (booking.java).
 */
export enum OnlineCancellationPossible {
	NO = 'NO',
	CAN_WITHDRAW = 'CAN_WITHDRAW',
	CAN_CANCEL = 'CAN_CANCEL',
}

export type PaymentDetailsRequestType = {
	details : {
		payload ?: string;
		redirectResult ?: string;
		// eslint-disable-next-line @typescript-eslint/naming-convention
		MD ?: string;
		// eslint-disable-next-line @typescript-eslint/naming-convention
		PaRes ?: string;
	};
} | null;

export interface BookableJson {
	clientId : Integer,
	type : string,
	paymentMethodId ?: any,
	paymentsDetailsRequest ?: PaymentDetailsRequestType,
	id ?: any,
	bookingPluginUrl ?: any,
	participantCount ?: any,
	participants ?: any,
	overallTariffId ?: any,
	value ?: any,
	currentlyPaid ?: any,
	firstName : any,
	lastName : any,
	shiftModelId ?: any,
	paymentsRequestJson ?: any,
	cardBin ?: any,
	email : string,
	dateOfBirth ?: any,
	ageMin ?: Integer,
	ageMax ?: Integer,
	paypalPayerId ?: any,
	paypalPaymentId ?: any,

	/**
	 * Returns info weather the withdrawal is still possible or the cancellation is possible on none of them.
	 */
	onlineCancellationPossible ?: OnlineCancellationPossible,

	/**
	 * Returns deadline or courseStart depending which one is first.
	 * 0 will be returned if the no cancellation is possible (when it was never possible or when the deadline has passed).
	 * NOTE: Related thread https://drplano.slack.com/archives/C6NAFGQSF/p1634205349002100
	 */
	onlineCancellationPossibleUntil ?: number,

	cancellationFeePeriodFeeFix ?: number,
	cancellationFeePeriodFeePercentage ?: number,
	city ?: string,
	postalCode ?: string,
	streetAndHouseNumber ?: any,
	phoneMobile ?: string,
	phoneLandline ?: string,
	state ?: string,
	bookingNumber ?: number,
	cancellationFee ?: number,
}
