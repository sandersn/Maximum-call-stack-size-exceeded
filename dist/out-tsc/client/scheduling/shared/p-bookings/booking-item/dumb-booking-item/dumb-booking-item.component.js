var _a, _b, _c, _d, _e, _f;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Input, HostBinding, HostListener, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { SchedulingApiBookingState } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { getPaymentStatusIcon, getPaymentStatusIconStyle, getPaymentStatusTooltipBgClass, paymentStatusTitle, PPaymentStatusEnum } from '../../../api/scheduling-api.utils';
let DumbBookingItemComponent = class DumbBookingItemComponent {
    constructor(localize, changeDetectorRef, console) {
        this.localize = localize;
        this.changeDetectorRef = changeDetectorRef;
        this.console = console;
        this.isLoading = false;
        this.hasDropdown = null;
        this.dropdownMenuAlignment = 'fullWidth';
        this.model = null;
        this.state = null;
        this.paymentStatus = null;
        this._bookingNumber = null;
        this.dateOfBooking = null;
        this.noRelatedShiftsAvailable = null;
        /**
         * If this component is shown inside a 'table' thing, then there need to be min-widths for each column.
         */
        this.isInsideList = false;
        /**
         * Set this to true if user has the rights to edit this booking
         */
        this.userCanWrite = false;
        this.firstName = null;
        this.lastName = null;
        this.ownerComment = null;
        this.bookingComment = null;
        this.participantCount = null;
        this.price = null;
        this.firstShiftStart = null;
        /**
         * User has clicked a "edit this booking" button.
         */
        this.onEdit = new EventEmitter();
        /**
         * Has this course a courseSelector? E.g. false if its an unfulfilled inquiry.
         */
        this.showEditCourseBtn = false;
        /**
         * User has clicked a "edit this course" button.
         */
        this.onEditCourse = new EventEmitter();
        this.relatedShiftsSelected = false;
        /**
         * User has clicked a "edit this booking" button.
         */
        this.onSelectShifts = new EventEmitter();
        this.selectShiftIsDisabled = false;
        /**
         * Should firstShiftStart be visible?
         * @example Usually [showFirstShiftStart]="!groupByCourses" should be bound here.
         */
        this.showFirstShiftStart = true;
        this._alwaysTrue = true;
        this.dropdownMenuIsUncollapsed = false;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.Config = Config;
        this.timeout = null;
    }
    get hasId() {
        var _a;
        return `scroll-target-id-${(_a = this.id) === null || _a === void 0 ? void 0 : _a.toString()}`;
    }
    _onMouseLeave() {
        this.timeout = window.setTimeout(() => {
            // Does 'this' dropdown still exist?
            if (!this)
                return;
            this.dropdownMenuIsUncollapsed = false;
            if (this.changeDetectorRef)
                this.changeDetectorRef.detectChanges();
        }, 500);
    }
    _onMouseEnter() {
        var _a;
        window.clearTimeout((_a = this.timeout) !== null && _a !== void 0 ? _a : undefined);
    }
    /**
     * Get the bookingNumber or some placeholder chars
     */
    get bookingNumber() {
        if (this.isLoading)
            return '███ █████';
        if (this._bookingNumber === null)
            throw new Error(`[state]="…" must be defined`);
        return this._bookingNumber;
    }
    /**
     * Get the color
     */
    get modelColor() {
        if (!this.model.color)
            return null;
        return `#${this.model.color}`;
    }
    /**
     * Name of the related shiftModel
     */
    get modelName() {
        return this.model.name;
    }
    /**
     * getter for the Status-Icon of this booking
     */
    get statusIcon() {
        if (this.isLoading)
            return null;
        switch (this.state) {
            case null:
            case undefined:
                throw new Error(`[state]="…" must be defined`);
            case SchedulingApiBookingState.BOOKED:
                return PlanoFaIconPool.BOOKING_BOOKED;
            case SchedulingApiBookingState.CANCELED:
                return PlanoFaIconPool.BOOKING_CANCELED;
            case SchedulingApiBookingState.INQUIRY:
                return PlanoFaIconPool.BOOKING_INQUIRY;
            case SchedulingApiBookingState.INQUIRY_DECLINED:
                return PlanoFaIconPool.BOOKING_DECLINED;
            default:
                const NEVER = this.state;
                throw new Error(`could not get state ${NEVER}`);
        }
    }
    /**
     * getter for the Status-Icon of this booking
     */
    get statusLabel() {
        switch (this.state) {
            case SchedulingApiBookingState.BOOKED:
                return this.localize.transform('Gebucht');
            case SchedulingApiBookingState.CANCELED:
                return this.localize.transform('Storniert');
            case SchedulingApiBookingState.INQUIRY:
                return this.localize.transform('Anfrage');
            case SchedulingApiBookingState.INQUIRY_DECLINED:
                return this.localize.transform('Anfrage abgelehnt');
            case null:
                return undefined;
        }
    }
    /**
     * getter for the title of the status of payment
     */
    get paymentStatusTitle() {
        if (this.isLoading)
            return 'Lädt…';
        return paymentStatusTitle(this.paymentStatus);
    }
    /**
     * Get a icon for paymentStatus
     */
    get paymentStatusIcon() {
        return getPaymentStatusIcon(this.paymentStatus);
    }
    /**
     * Get a theme / color for paymentStatus icon
     */
    get paymentStatusIconStyle() {
        return getPaymentStatusIconStyle(this.paymentStatus);
    }
    /**
     * Get a class for color for background inside the paymentstatus tooltip
     */
    get paymentStatusTooltipBgClass() {
        return getPaymentStatusTooltipBgClass(this.paymentStatus);
    }
    /**
     * Get a class for color for text inside the paymentstatus tooltip
     */
    get paymentStatusTooltipTextClass() {
        switch (this.paymentStatus) {
            case PPaymentStatusEnum.UNPAID:
            case PPaymentStatusEnum.CASHBACK:
                return 'text-white';
            default:
                return '';
        }
    }
    ngOnDestroy() {
        var _a;
        window.clearTimeout((_a = this.timeout) !== null && _a !== void 0 ? _a : undefined);
    }
    /**
     * Check if buttons should be shown
     */
    hasControls() {
        if (this.hasDropdown)
            return true;
        return !!this.onSelectShifts.observers.length || !!this.onEdit.observers.length;
    }
};
__decorate([
    HostBinding('id'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], DumbBookingItemComponent.prototype, "hasId", null);
__decorate([
    Input(),
    __metadata("design:type", Object)
], DumbBookingItemComponent.prototype, "isLoading", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], DumbBookingItemComponent.prototype, "hasDropdown", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], DumbBookingItemComponent.prototype, "dropdownMenuAlignment", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], DumbBookingItemComponent.prototype, "model", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], DumbBookingItemComponent.prototype, "state", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], DumbBookingItemComponent.prototype, "paymentStatus", void 0);
__decorate([
    Input('bookingNumber'),
    __metadata("design:type", Object)
], DumbBookingItemComponent.prototype, "_bookingNumber", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], DumbBookingItemComponent.prototype, "dateOfBooking", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], DumbBookingItemComponent.prototype, "noRelatedShiftsAvailable", void 0);
__decorate([
    Input('careAboutAlignment'),
    __metadata("design:type", Boolean)
], DumbBookingItemComponent.prototype, "isInsideList", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], DumbBookingItemComponent.prototype, "userCanWrite", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], DumbBookingItemComponent.prototype, "id", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], DumbBookingItemComponent.prototype, "firstName", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], DumbBookingItemComponent.prototype, "lastName", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], DumbBookingItemComponent.prototype, "ownerComment", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], DumbBookingItemComponent.prototype, "bookingComment", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], DumbBookingItemComponent.prototype, "participantCount", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], DumbBookingItemComponent.prototype, "price", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], DumbBookingItemComponent.prototype, "firstShiftStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_d = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _d : Object)
], DumbBookingItemComponent.prototype, "onEdit", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], DumbBookingItemComponent.prototype, "showEditCourseBtn", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_e = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _e : Object)
], DumbBookingItemComponent.prototype, "onEditCourse", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], DumbBookingItemComponent.prototype, "relatedShiftsSelected", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_f = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _f : Object)
], DumbBookingItemComponent.prototype, "onSelectShifts", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], DumbBookingItemComponent.prototype, "selectShiftIsDisabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], DumbBookingItemComponent.prototype, "showFirstShiftStart", void 0);
__decorate([
    HostBinding('class.position-relative'),
    __metadata("design:type", Object)
], DumbBookingItemComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    HostListener('mouseleave'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DumbBookingItemComponent.prototype, "_onMouseLeave", null);
__decorate([
    HostListener('mouseenter'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DumbBookingItemComponent.prototype, "_onMouseEnter", null);
DumbBookingItemComponent = __decorate([
    Component({
        selector: 'p-dumb-booking-item',
        templateUrl: './dumb-booking-item.component.html',
        styleUrls: ['./dumb-booking-item.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof LocalizePipe !== "undefined" && LocalizePipe) === "function" ? _a : Object, typeof (_b = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _b : Object, typeof (_c = typeof LogService !== "undefined" && LogService) === "function" ? _c : Object])
], DumbBookingItemComponent);
export { DumbBookingItemComponent };
//# sourceMappingURL=dumb-booking-item.component.js.map