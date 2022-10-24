var _a, _b;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { ApiListWrapper } from '@plano/shared/api';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../../../shared/core/null-type-utils';
import { BookingsService } from '../../bookings.service';
let BookingRelatedCourseComponent = class BookingRelatedCourseComponent {
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
        this.onClick = new EventEmitter();
        this.isCollapsed = false;
        this.isLoading = false;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.BootstrapSize = BootstrapSize;
    }
    /**
     * Is there a (onClick)="…" on this component?
     */
    get hasOnClickBinding() {
        return this.onClick.observers.length > 0;
    }
    get booking() {
        return this.bookings.get(0);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get label() {
        if (this.isLoading)
            return '████ ████';
        assumeNonNull(this.booking);
        return this.booking.model.name;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get date() {
        if (this.isLoading)
            return 1;
        assumeNonNull(this.booking);
        return this.booking.firstShiftStart;
    }
    /**
     * Check if this component is fully loaded.
     * Can be used to show skeletons/spinners then false.
     */
    get isLoaded() {
        if (this.isLoading)
            return false;
        return !!this.booking && !!this.booking.firstShiftStart;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get courseCode() {
        var _a, _b;
        assumeDefinedToGetStrictNullChecksRunning(this.booking, 'this.booking');
        return (_b = (_a = this.booking.courseSelector) === null || _a === void 0 ? void 0 : _a.courseCode) !== null && _b !== void 0 ? _b : null;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get hasClassShiftsRemoved() {
        assumeDefinedToGetStrictNullChecksRunning(this.booking, 'this.booking');
        return this.booking.allShiftsRemoved;
    }
};
__decorate([
    Input(),
    __metadata("design:type", typeof (_a = typeof ApiListWrapper !== "undefined" && ApiListWrapper) === "function" ? _a : Object)
], BookingRelatedCourseComponent.prototype, "bookings", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_b = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _b : Object)
], BookingRelatedCourseComponent.prototype, "onClick", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], BookingRelatedCourseComponent.prototype, "isCollapsed", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], BookingRelatedCourseComponent.prototype, "isLoading", void 0);
BookingRelatedCourseComponent = __decorate([
    Component({
        selector: 'p-booking-related-course[bookings]',
        templateUrl: './booking-related-course.component.html',
        styleUrls: ['./booking-related-course.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [BookingsService])
], BookingRelatedCourseComponent);
export { BookingRelatedCourseComponent };
//# sourceMappingURL=booking-related-course.component.js.map