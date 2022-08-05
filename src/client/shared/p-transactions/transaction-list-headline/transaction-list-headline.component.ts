import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { TransactionsSortedByEmum } from '@plano/client/sales/transactions/transactions.component';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { ListSortDirection } from '../../p-lists/list-headline-item/list-headline-item.component';

@Component({
	selector: 'p-transaction-list-headline',
	templateUrl: './transaction-list-headline.component.html',
	styleUrls: ['./transaction-list-headline.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionListHeadlineComponent implements PComponentInterface {

	@Input() public isLoading : PComponentInterface['isLoading'] = false;

	@Input() public sorter : TransactionsSortedByEmum | null = null;
	@Output() public sorterChange = new EventEmitter<TransactionsSortedByEmum>();
	@Input() public sortedReverse : TransactionsSortedByEmum | null = null;
	@Output() public sortedReverseChange = new EventEmitter<TransactionsSortedByEmum>();

	@Input() public excludedColumn : TransactionsSortedByEmum[] = [];

	@Input() public canEditTransactions : boolean = true;

	constructor(
	) { }

	public TransactionsSortedByEmum = TransactionsSortedByEmum;
	public ListSortDirection = ListSortDirection;
}
