import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { SchedulingApiTransactions } from '@plano/shared/api';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { PDictionarySourceString } from '../../../../shared/core/pipe/localize.dictionary';
import { BootstrapSize, PThemeEnum } from '../../bootstrap-styles.enum';

@Component({
	selector: 'p-transaction-totals',
	templateUrl: './transaction-totals.component.html',
	styleUrls: ['./transaction-totals.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionTotalsComponent implements PComponentInterface {

	@Input() public isLoading : PComponentInterface['isLoading'] = null;
	@Input() private totalIncomingPayments : SchedulingApiTransactions['totalIncomingPayments'] = null;
	@Input() private totalOutgoingPayments : SchedulingApiTransactions['totalOutgoingPayments'] = null;
	@Input() public onlineRefundableAmount : SchedulingApiTransactions['onlineRefundableAmount'] = null;
	@Input() public onlineRefundableAmountInfoText : PDictionarySourceString | null = null;

	constructor() {
	}

	public PThemeEnum = PThemeEnum;
	public BootstrapSize = BootstrapSize;

	/**
	 * The total incoming payments for this booking
	 */
	public get incomingPayments() : number | null {
		if (this.isLoading) return null;
		return this.totalIncomingPayments;
	}

	/**
	 * The total outgoing payments for this booking
	 */
	public get outgoingPayments() : number | null {
		if (this.isLoading) return null;
		return this.totalOutgoingPayments;
	}

}
