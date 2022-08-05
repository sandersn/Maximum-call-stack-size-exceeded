
import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { PSidebarService } from '@plano/client/shared/p-sidebar/p-sidebar.service';
import { SchedulingApiBooking} from '@plano/shared/api';
import { SchedulingApiBookings } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { DumbBookingItemComponent } from '../booking-item/dumb-booking-item/dumb-booking-item.component';

export enum BookingsSortedByEmum {
	PAYMENT_STATUS = 'paymentStatus',
	STATE = 'state',
	DATE_OF_BOOKING = 'dateOfBooking',
	FIRST_SHIFT_START = 'firstShiftStart',
	BOOKING_CODE = 'bookingNumber',
	PRICE = 'price',
}

@Component({
	selector: 'p-booking-list[bookings]',
	templateUrl: './booking-list.component.html',
	styleUrls: ['./booking-list.component.scss'],
})
export class BookingListComponent implements PComponentInterface {
	@Input() public isLoading : PComponentInterface['isLoading'] = null;
	@Input() private bookings ! : SchedulingApiBookings;
	// @Input() public searchString ! : string;
	@Input() public maxVisibleItems ?: number;

	/**
	 * User has clicked a "edit this booking" button.
	 */
	@Output() public onEdit : EventEmitter<Id> = new EventEmitter<Id>();

	/**
	 * Select related shifts in Calendar
	 */
	@Output() public onSelectShifts : EventEmitter<SchedulingApiBooking> = new EventEmitter<SchedulingApiBooking>();

	/**
	 * Should firstShiftStart be visible?
	 * @example Usually [showFirstShiftStart]="!groupByCourses" should be bound here.
	 */
	@Input() public showFirstShiftStart : DumbBookingItemComponent['showFirstShiftStart'] = false;

	@HostBinding('class.table-alike-list') protected _alwaysTrue = true;

	constructor(
		public pSidebarService : PSidebarService,
	) {
	}

	/**
	 * Get the bookings that should currently be shown
	 */
	public get bookingsForList() : SchedulingApiBooking[] {
		if (this.maxVisibleItems === undefined) return this.bookings.iterable();
		return this.bookings.slice(0, this.maxVisibleItems);
	}

	/**
	 * Are there any shifts available that are related to this booking?
	 * If not we must disable the button to select those shifts in the calendar-view.
	 */
	public noRelatedShiftsAvailable(booking : SchedulingApiBooking) : DumbBookingItemComponent['noRelatedShiftsAvailable'] {
		if (booking.allShiftsRemoved) return true;
		return booking.courseSelector === null;
	}
}
