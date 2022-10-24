var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { PSidebarService } from '@plano/client/shared/p-sidebar/p-sidebar.service';
import { SchedulingApiBookings } from '@plano/shared/api';
export var BookingsSortedByEmum;
(function (BookingsSortedByEmum) {
    BookingsSortedByEmum["PAYMENT_STATUS"] = "paymentStatus";
    BookingsSortedByEmum["STATE"] = "state";
    BookingsSortedByEmum["DATE_OF_BOOKING"] = "dateOfBooking";
    BookingsSortedByEmum["FIRST_SHIFT_START"] = "firstShiftStart";
    BookingsSortedByEmum["BOOKING_CODE"] = "bookingNumber";
    BookingsSortedByEmum["PRICE"] = "price";
})(BookingsSortedByEmum || (BookingsSortedByEmum = {}));
let BookingListComponent = class BookingListComponent {
    constructor(pSidebarService) {
        this.pSidebarService = pSidebarService;
        this.isLoading = null;
        /**
         * User has clicked a "edit this booking" button.
         */
        this.onEdit = new EventEmitter();
        /**
         * Select related shifts in Calendar
         */
        this.onSelectShifts = new EventEmitter();
        /**
         * Should firstShiftStart be visible?
         * @example Usually [showFirstShiftStart]="!groupByCourses" should be bound here.
         */
        this.showFirstShiftStart = false;
        this._alwaysTrue = true;
    }
    /**
     * Get the bookings that should currently be shown
     */
    get bookingsForList() {
        if (this.maxVisibleItems === undefined)
            return this.bookings.iterable();
        return this.bookings.slice(0, this.maxVisibleItems);
    }
    /**
     * Are there any shifts available that are related to this booking?
     * If not we must disable the button to select those shifts in the calendar-view.
     */
    noRelatedShiftsAvailable(booking) {
        if (booking.allShiftsRemoved)
            return true;
        return booking.courseSelector === null;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], BookingListComponent.prototype, "isLoading", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_b = typeof SchedulingApiBookings !== "undefined" && SchedulingApiBookings) === "function" ? _b : Object)
], BookingListComponent.prototype, "bookings", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], BookingListComponent.prototype, "maxVisibleItems", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], BookingListComponent.prototype, "onEdit", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_d = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _d : Object)
], BookingListComponent.prototype, "onSelectShifts", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], BookingListComponent.prototype, "showFirstShiftStart", void 0);
__decorate([
    HostBinding('class.table-alike-list'),
    __metadata("design:type", Object)
], BookingListComponent.prototype, "_alwaysTrue", void 0);
BookingListComponent = __decorate([
    Component({
        selector: 'p-booking-list[bookings]',
        templateUrl: './booking-list.component.html',
        styleUrls: ['./booking-list.component.scss'],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof PSidebarService !== "undefined" && PSidebarService) === "function" ? _a : Object])
], BookingListComponent);
export { BookingListComponent };
//# sourceMappingURL=booking-list.component.js.map