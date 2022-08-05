import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { BookingSystemRights } from '@plano/client/accesscontrol/rights-enums';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { SchedulingApiBooking } from '@plano/client/scheduling/shared/api/scheduling-api-booking.service';
import { BookingsService } from '@plano/client/scheduling/shared/p-bookings/bookings.service';
import { ShiftAndShiftModelFormTabs } from '@plano/client/shared/component/p-shift-and-shiftmodel-form/p-shift-and-shiftmodel-form.component';
import { RightsService, SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiShifts } from '@plano/shared/api';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { DumbBookingItemComponent } from './dumb-booking-item/dumb-booking-item.component';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../shared/core/null-type-utils';

@Component({
	selector: 'p-booking-item[booking]',
	templateUrl: './booking-item.component.html',
	styleUrls: ['./booking-item.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PBookingItemComponent implements PComponentInterface {
	@Input('showDropDown') public hasDropdown : boolean = true;
	@Input() public booking ! : SchedulingApiBooking;
	@Input() public shifts : SchedulingApiShifts = new SchedulingApiShifts(null, false);
	@Input('isLoading') private _isLoading : PComponentInterface['isLoading'] = false;

	constructor(
		private schedulingService : SchedulingService,
		private router : Router,
		private bookingsService : BookingsService,
		private activeModal : NgbActiveModal,
		private rightsService : RightsService,
		private schedulingApiService : SchedulingApiService,
	) {
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isLoading() : PComponentInterface['isLoading'] {
		return this._isLoading;
	}

	/**
	 * Check if (each) selected shift(s) selected state is true
	 */
	public get relatedShiftsSelected() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.booking, 'booking');
		assumeDefinedToGetStrictNullChecksRunning(this.booking.courseSelector, 'booking.courseSelector');
		return this.bookingsService.relatedShiftsSelected(this.booking.courseSelector, this.shifts);
	}

	/**
	 * Select the related shift
	 */
	public onClickSelectShifts(booking : SchedulingApiBooking, shifts : SchedulingApiShifts) : void {
		const relatedShifts = this.bookingsService.relatedShifts(booking.courseSelector, shifts);
		if (relatedShifts instanceof SchedulingApiShifts || relatedShifts?.length) {
			assumeDefinedToGetStrictNullChecksRunning(booking.courseSelector, 'booking.courseSelector');
			this.bookingsService.toggleRelatedShiftsFn(booking.courseSelector, shifts);
		} else {
			const bookingCourseSelector = booking.courseSelector;
			this.schedulingService.afterNavigationCallbacks.push(() => {
				assumeDefinedToGetStrictNullChecksRunning(bookingCourseSelector, 'bookingCourseSelector');
				this.bookingsService.toggleRelatedShiftsFn(bookingCourseSelector, this.schedulingApiService.data.shifts);
			});
			assumeDefinedToGetStrictNullChecksRunning(booking.firstShiftStart, 'booking.firstShiftStart');
			this.router.navigate([`/client/scheduling/${this.schedulingService.urlParam!.calendarMode}/${booking.firstShiftStart.toString()}`,
			]);
		}
	}

	/**
	 * open detail view to edit booking
	 */
	public editBooking() : void {
		this.activeModal.dismiss();
		assumeDefinedToGetStrictNullChecksRunning(this.booking, 'booking');
		this.bookingsService.onEditBooking(this.booking.id);
	}

	/**
	 * Is there enough data to navigate to the details of the related course?
	 */
	public get navigationToCourseIsPossible() : DumbBookingItemComponent['showEditCourseBtn'] {
		return false; // TODO: [PLANO-36372]

		// assumeDefinedToGetStrictNullChecksRunning(this.booking, 'booking');
		// if (this.booking.courseSelector === null) return false;
		// if (this.booking.allShiftsRemoved) return false;

		// // If there is no packetIndex then this.booking.courseSelector does not represent a specific shift.
		// //       We could navigate to packetIndex === 1, but it is not secure because it is possible that shift one of
		// //       this packet has been trashed.
		// //       So it is not possible to navigate if this is a packet.

		// // It is not even possible to determine if a courseSelector belongs to a packet or not...
		// // if (!!this.booking.courseSelector.packetIndex) return false;

		// return true;
	}

	/**
	 * open detail view to edit the related course
	 */
	public editCourse() : void {
		this.activeModal.dismiss();
		assumeDefinedToGetStrictNullChecksRunning(this.booking, 'booking');
		this.router.navigate([`/client/shift/${this.booking.firstShiftSelector!.toUrl()}/${ShiftAndShiftModelFormTabs.bookingsettings}`]);
	}

	/**
	 * Check if user can edit this shift or model
	 */
	public get userEditBookings() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.booking, 'booking');
		return !!this.rightsService.can(BookingSystemRights.editBookings, this.booking.model);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get selectShiftIsDisabled() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.booking, 'booking');
		if (this.booking.courseSelector === null) return true;
		if (this.booking.allShiftsRemoved) return true;
		return false;
	}
}
