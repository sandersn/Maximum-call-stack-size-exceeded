var _a, _b, _c, _d, _e;
import { __decorate, __metadata } from "tslib";
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
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../shared/core/null-type-utils';
let PBookingItemComponent = class PBookingItemComponent {
    constructor(schedulingService, router, bookingsService, activeModal, rightsService, schedulingApiService) {
        this.schedulingService = schedulingService;
        this.router = router;
        this.bookingsService = bookingsService;
        this.activeModal = activeModal;
        this.rightsService = rightsService;
        this.schedulingApiService = schedulingApiService;
        this.hasDropdown = true;
        this.shifts = new SchedulingApiShifts(null, false);
        this._isLoading = false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isLoading() {
        return this._isLoading;
    }
    /**
     * Check if (each) selected shift(s) selected state is true
     */
    get relatedShiftsSelected() {
        assumeDefinedToGetStrictNullChecksRunning(this.booking, 'booking');
        assumeDefinedToGetStrictNullChecksRunning(this.booking.courseSelector, 'booking.courseSelector');
        return this.bookingsService.relatedShiftsSelected(this.booking.courseSelector, this.shifts);
    }
    /**
     * Select the related shift
     */
    onClickSelectShifts(booking, shifts) {
        const relatedShifts = this.bookingsService.relatedShifts(booking.courseSelector, shifts);
        if (relatedShifts instanceof SchedulingApiShifts || (relatedShifts === null || relatedShifts === void 0 ? void 0 : relatedShifts.length)) {
            assumeDefinedToGetStrictNullChecksRunning(booking.courseSelector, 'booking.courseSelector');
            this.bookingsService.toggleRelatedShiftsFn(booking.courseSelector, shifts);
        }
        else {
            const bookingCourseSelector = booking.courseSelector;
            this.schedulingService.afterNavigationCallbacks.push(() => {
                assumeDefinedToGetStrictNullChecksRunning(bookingCourseSelector, 'bookingCourseSelector');
                this.bookingsService.toggleRelatedShiftsFn(bookingCourseSelector, this.schedulingApiService.data.shifts);
            });
            assumeDefinedToGetStrictNullChecksRunning(booking.firstShiftStart, 'booking.firstShiftStart');
            this.router.navigate([`/client/scheduling/${this.schedulingService.urlParam.calendarMode}/${booking.firstShiftStart.toString()}`,
            ]);
        }
    }
    /**
     * open detail view to edit booking
     */
    editBooking() {
        this.activeModal.dismiss();
        assumeDefinedToGetStrictNullChecksRunning(this.booking, 'booking');
        this.bookingsService.onEditBooking(this.booking.id);
    }
    /**
     * Is there enough data to navigate to the details of the related course?
     */
    get navigationToCourseIsPossible() {
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
    editCourse() {
        this.activeModal.dismiss();
        assumeDefinedToGetStrictNullChecksRunning(this.booking, 'booking');
        this.router.navigate([`/client/shift/${this.booking.firstShiftSelector.toUrl()}/${ShiftAndShiftModelFormTabs.bookingsettings}`]);
    }
    /**
     * Check if user can edit this shift or model
     */
    get userEditBookings() {
        assumeDefinedToGetStrictNullChecksRunning(this.booking, 'booking');
        return !!this.rightsService.can(BookingSystemRights.editBookings, this.booking.model);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get selectShiftIsDisabled() {
        assumeDefinedToGetStrictNullChecksRunning(this.booking, 'booking');
        if (this.booking.courseSelector === null)
            return true;
        if (this.booking.allShiftsRemoved)
            return true;
        return false;
    }
};
__decorate([
    Input('showDropDown'),
    __metadata("design:type", Boolean)
], PBookingItemComponent.prototype, "hasDropdown", void 0);
__decorate([
    Input(),
    __metadata("design:type", SchedulingApiBooking)
], PBookingItemComponent.prototype, "booking", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_e = typeof SchedulingApiShifts !== "undefined" && SchedulingApiShifts) === "function" ? _e : Object)
], PBookingItemComponent.prototype, "shifts", void 0);
__decorate([
    Input('isLoading'),
    __metadata("design:type", Object)
], PBookingItemComponent.prototype, "_isLoading", void 0);
PBookingItemComponent = __decorate([
    Component({
        selector: 'p-booking-item[booking]',
        templateUrl: './booking-item.component.html',
        styleUrls: ['./booking-item.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [SchedulingService, typeof (_a = typeof Router !== "undefined" && Router) === "function" ? _a : Object, BookingsService, typeof (_b = typeof NgbActiveModal !== "undefined" && NgbActiveModal) === "function" ? _b : Object, typeof (_c = typeof RightsService !== "undefined" && RightsService) === "function" ? _c : Object, typeof (_d = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _d : Object])
], PBookingItemComponent);
export { PBookingItemComponent };
//# sourceMappingURL=booking-item.component.js.map