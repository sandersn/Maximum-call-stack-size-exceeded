import { Injectable } from '@angular/core';
import { FilterServiceInterface } from '@plano/client/shared/filter.service';
import { PFormControl } from '@plano/client/shared/p-forms/p-form-control';
import { SchedulingApiTransaction, SchedulingApiTransactionPaymentMethodType} from '@plano/shared/api';
import { SchedulingApiTransactionType } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';import { ValidatorsService } from '@plano/shared/core/validators.service';

@Injectable({ providedIn: 'root' })
export class PTransactionsService implements FilterServiceInterface {
	public start : number | null = null;
	public end : number | null = null;

	/**
	 * The string which should be searched for
	 * This will get used for api requests
	 * Changing it should trigger a api load
	 */
	public searchString : string | null = null;

	/**
	 * Should all items be searched or only the visible ones?
	 * Changing it should trigger a api load
	 */
	public searchAll : boolean | null = null;

	constructor(
		private validatorsService : ValidatorsService,
	) {
		this.initValues();
	}

	private _amountStart : number | null = null;
	private _amountEnd : number | null = null;

	/**
	 * Set some default values for properties that are not defined yet
	 */
	public initValues() : void {
		if (this.searchAll === null) this.searchAll = false;
		if (!this.amountStart) this.amountStart = new PFormControl({
			formState: {
				value: this._amountStart,
				disabled: false,
			},
			validatorOrOpts: [
				this.validatorsService.max(() => this._amountEnd!, true, PApiPrimitiveTypes.Currency),
			],
			subscribe: (input : number) => {
				this._amountStart = input;
			},
		});
		if (!this.amountEnd) this.amountEnd = new PFormControl({
			formState: {
				value: this._amountEnd,
				disabled: false,
			},
			validatorOrOpts: [
				this.validatorsService.min(() => this._amountStart!, true, PApiPrimitiveTypes.Currency),
			],
			subscribe: (input : number) => {
				this._amountEnd = input;
			},
		});

	}

	public amountStart : PFormControl | null = null;
	public amountEnd : PFormControl | null = null;

	public filteredTransactionType : SchedulingApiTransactionType[] = [];
	public filteredTransactionPaymentMethodType : SchedulingApiTransactionPaymentMethodType[] = [];

	// /**
	//  * Is this enum part of the filtered items?
	//  */
	// public isFiltered(input : SchedulingApiTransactionType) : boolean {
	// 	return this.filteredTypes.includes(input);
	// }

	/**
	 * Is there any active Filter setting?
	 */
	public get hasFilterSettings() : boolean {
		if (this._showOnlyFailedTransactions) return true;
		if (!!this.amountStart!.value) return true;
		if (!!this.amountEnd!.value) return true;
		if (!!this.filteredTransactionPaymentMethodType.length) return true;
		if (!!this.filteredTransactionType.length) return true;
		return false;
	}


	private _showOnlyFailedTransactions : boolean = false;

	/**
	 * Should only failed Transactions be visible?
	 */
	public get showOnlyFailedTransactions() : boolean {
		return this._showOnlyFailedTransactions;
	}
	public set showOnlyFailedTransactions(input : boolean) {
		this._showOnlyFailedTransactions = input;
	}

	/**
	 * Toggle the given item in array
	 */
	public toggleFilteredTransactionType(input : SchedulingApiTransactionType) : void {
		switch (input) {
			case SchedulingApiTransactionType.PAYMENT_FAILED:
				this.toggleTransactionType(input);
				this.toggleTransactionType(SchedulingApiTransactionType.PAYMENT);
				break;

			case SchedulingApiTransactionType.REFUND_FAILED:
				this.toggleTransactionType(input);
				this.toggleTransactionType(SchedulingApiTransactionType.REFUND);
				break;

			case SchedulingApiTransactionType.PAYOUT_FAILED:
				this.toggleTransactionType(input);
				this.toggleTransactionType(SchedulingApiTransactionType.PAYOUT);
				break;

			case SchedulingApiTransactionType.AUTO_DEBIT_FAILED:
				this.toggleTransactionType(input);
				this.toggleTransactionType(SchedulingApiTransactionType.AUTO_DEBIT);
				break;

			case SchedulingApiTransactionType.PAYMENT:
			case SchedulingApiTransactionType.REFUND:
			case SchedulingApiTransactionType.PAYOUT:
			case SchedulingApiTransactionType.AUTO_DEBIT:
			case SchedulingApiTransactionType.CHARGEBACK:
			case SchedulingApiTransactionType.CHARGEBACK_REVERSED:
			case SchedulingApiTransactionType.SECOND_CHARGEBACK:
			case SchedulingApiTransactionType.DR_PLANO_FEE_VAT:
				this.toggleTransactionType(input);
				break;

			default:
				const RESULT : never = input;
				throw new Error(RESULT);
		}
	}

	/**
	 * Toggle the given item in array
	 */
	private toggleTransactionType(input : SchedulingApiTransactionType) : void {
		const included = this.filteredTransactionType.includes(input);
		if (included) {
			this.filteredTransactionType = this.filteredTransactionType.filter(item => item !== input);
		} else {
			this.filteredTransactionType.push(input);
		}
	}

	/**
	 * Toggle the given item in array
	 */
	public toggleFilteredTransactionPaymentMethodType(input : SchedulingApiTransactionPaymentMethodType) : void {
		const INCLUDED = this.filteredTransactionPaymentMethodType.includes(input);
		if (INCLUDED) {
			this.filteredTransactionPaymentMethodType = this.filteredTransactionPaymentMethodType.filter(item => item !== input);
		} else {
			this.filteredTransactionPaymentMethodType.push(input);
		}
	}

	/**
	 * Reset all filters to default
	 */
	public unload() : void {
		this.unloadFilters();
	}

	/**
	 * Reset all filters to default
	 */
	public unloadFilters() : void {
		this._showOnlyFailedTransactions = false;
		this.filteredTransactionPaymentMethodType = [];
		this.filteredTransactionType = [];
		this.amountStart!.setValue(undefined);
		this.amountEnd!.setValue(undefined);
	}

	private isVisibleByType(item : Pick<SchedulingApiTransaction, 'type' | 'failedChildId'>) : boolean {
		if (this._showOnlyFailedTransactions && item.failedChildId === null)
			return false;

		switch (item.type) {
			case SchedulingApiTransactionType.PAYMENT_FAILED:
				return !this.filteredTransactionType.includes(SchedulingApiTransactionType.PAYMENT);
			case SchedulingApiTransactionType.PAYOUT_FAILED:
				return !this.filteredTransactionType.includes(SchedulingApiTransactionType.PAYOUT);
			case SchedulingApiTransactionType.REFUND_FAILED:
				return !this.filteredTransactionType.includes(SchedulingApiTransactionType.REFUND);
			case SchedulingApiTransactionType.AUTO_DEBIT_FAILED:
				return !this.filteredTransactionType.includes(SchedulingApiTransactionType.AUTO_DEBIT);
			case SchedulingApiTransactionType.CHARGEBACK_REVERSED:
			case SchedulingApiTransactionType.SECOND_CHARGEBACK:
				return !this.filteredTransactionType.includes(SchedulingApiTransactionType.CHARGEBACK);
			case SchedulingApiTransactionType.CHARGEBACK:
			case SchedulingApiTransactionType.PAYMENT:
			case SchedulingApiTransactionType.PAYOUT:
			case SchedulingApiTransactionType.REFUND:
			case SchedulingApiTransactionType.AUTO_DEBIT:
			case SchedulingApiTransactionType.DR_PLANO_FEE_VAT:
				return !this.filteredTransactionType.includes(item.type);
		}
	}

	/**
	 * Checks if given item or items is visible.
	 */
	public isVisible(item : Pick<SchedulingApiTransaction, 'amount' | 'type' | 'paymentMethodType' | 'failedChildId'>) : boolean {
		if (this.filteredTransactionPaymentMethodType.includes(item.paymentMethodType)) return false;
		if (!this.isVisibleByType(item)) return false;
		if (this.amountStart!.value !== undefined && item.amount! < this.amountStart!.value) return false;
		if (this.amountEnd!.value !== undefined && item.amount! > this.amountEnd!.value) return false;
		return true;
	}
}
