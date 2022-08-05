import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { TransactionsSortedByEmum } from '@plano/client/sales/transactions/transactions.component';
import { SchedulingApiTransaction } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { FaIcon } from '../../../../shared/core/component/fa-icon/fa-icon-types';
import { PCurrencyPipe } from '../../../../shared/core/pipe/p-currency.pipe';
import { PMomentService } from '../../p-moment.service';

@Component({
	selector: 'p-transaction-list',
	templateUrl: './transaction-list.component.html',
	styleUrls: ['./transaction-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionListComponent implements PComponentInterface {

	@Input() public isLoading : PComponentInterface['isLoading'] = null;
	@Input() public transactions : SchedulingApiTransaction[] = [];

	@Output() public onEditItem : EventEmitter<Id> = new EventEmitter();

	@Input() public excludedColumn : TransactionsSortedByEmum[] = [];

	constructor(
		private pCurrencyPipe : PCurrencyPipe,
		private pMomentService : PMomentService,
	) {
		this.now = +this.pMomentService.m().startOf('minute').add('minute');
	}

	public now ! : number;

	public TransactionsSortedByEmum = TransactionsSortedByEmum;
	public PlanoFaIconPool = PlanoFaIconPool;

	/**
	 * Label of type
	 */
	public getTypeIcon(transaction : SchedulingApiTransaction) : FaIcon | null {
		return this.pCurrencyPipe.getPaymentMethodIcon(transaction.paymentMethodType, transaction.paymentMethodName);
	}

	/** Remove when type of SchedulingApiVoucher['price'] is fixed */
	public time(transaction : SchedulingApiTransaction) : SchedulingApiTransaction['dateTime'] | null {
		return transaction.attributeInfoDateTime.value ?? this.now;
	}
}
