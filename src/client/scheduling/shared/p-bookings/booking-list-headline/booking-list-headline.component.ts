import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { ListSortDirection } from '@plano/client/shared/p-lists/list-headline-item/list-headline-item.component';
import { Config } from '@plano/shared/core/config';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { PlanoFaIconPool } from '../../../../../shared/core/plano-fa-icon-pool.enum';
import { BookingsSortedByEmum } from '../booking-list/booking-list.component';
import { BookingsService } from '../bookings.service';

@Component({
	selector: 'p-booking-list-headline',
	templateUrl: './booking-list-headline.component.html',
	styleUrls: ['./booking-list-headline.component.scss'],
})
export class BookingListHeadlineComponent implements PComponentInterface {
	@Input() public isLoading : PComponentInterface['isLoading'] = null;

	@Input() public sortedBy : BookingsService['sortedBy'] | null = null;
	@Output() public sortedByChange = new EventEmitter<BookingsService['sortedBy']>();
	@Input() public sortedReverse : BookingsService['sortedReverse'] | null = null;
	@Output() public sortedReverseChange = new EventEmitter<BookingsService['sortedReverse']>();

	@Input() public groupByCourses : BookingsService['groupByCourses'] = true;

	constructor(
	) {
	}

	public BookingsSortedByEmum = BookingsSortedByEmum;
	public ListSortDirection = ListSortDirection;
	public Config = Config;
	public PlanoFaIconPool = PlanoFaIconPool;

	@HostBinding('class.rounded')
	@HostBinding('class.d-flex')
	@HostBinding('class.bg-light-cold') private _alwaysTrue = true;

	/**
	 * Set new sortedBy value and update sortedRevers value.
	 */
	public setSorter(input : BookingsService['sortedBy']) : void {
		if (this.sortedBy === input) {
			this.sortedReverse = !this.sortedReverse;
		} else {
			this.sortedReverse = false;
			this.sortedBy = input;
		}
		this.sortedByChange.emit(this.sortedBy);
		this.sortedReverseChange.emit(this.sortedReverse);
	}
}
