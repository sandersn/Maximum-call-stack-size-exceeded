var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { BookingsService } from '@plano/client/scheduling/shared/p-bookings/bookings.service';
import { PAlertThemeEnum, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PShiftmodelTariffService } from '@plano/client/shared/p-forms/p-shiftmodel-tariff.service';
import { PShiftService } from '@plano/client/shared/p-shift-module/p-shift.service';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiBookings } from '@plano/shared/api';
import { SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiBookingState } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNotUndefined } from '@plano/shared/core/null-type-utils';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { Data } from '../../../../../shared/core/data/data';
import { PCurrencyPipe } from '../../../../../shared/core/pipe/p-currency.pipe';
import { PDatePipe } from '../../../../../shared/core/pipe/p-date.pipe';
import { PBookingFormService } from '../../../../booking/booking-form.service';
import { getPaymentStatusIconStyle, paymentStatusTitle, PPaymentStatusEnum } from '../../../../scheduling/shared/api/scheduling-api.utils';
let PShiftBookingsComponent = class PShiftBookingsComponent {
    constructor(api, pShiftService, bookingsService, console, pShiftmodelTariffService, pBookingFormService, pCurrencyPipe, pDatePipe) {
        this.api = api;
        this.pShiftService = pShiftService;
        this.bookingsService = bookingsService;
        this.console = console;
        this.pShiftmodelTariffService = pShiftmodelTariffService;
        this.pBookingFormService = pBookingFormService;
        this.pCurrencyPipe = pCurrencyPipe;
        this.pDatePipe = pDatePipe;
        this.isLoading = null;
        this.CONFIG = Config;
        this.searchTerm = null;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.PAlertThemeEnum = PAlertThemeEnum;
        this.PThemeEnum = PThemeEnum;
        this.PApiPrimitiveTypes = PApiPrimitiveTypes;
        this.PPaymentStatusEnum = PPaymentStatusEnum;
        this._participantPrintData = new Data(this.api);
        this._tableIndexes = new Data(this.api);
    }
    /** Is this booking canceled? */
    isCanceled(item) {
        return item.state === SchedulingApiBookingState.CANCELED;
    }
    /** Has this booking been declined? */
    isDeclined(item) {
        return item.state === SchedulingApiBookingState.INQUIRY_DECLINED;
    }
    /**
     * @returns Returns the names of the assigned members as a comma separated string.
     */
    get assignedMembersToString() {
        let result = '';
        for (const assignedMember of this.shift.assignedMembers.iterable()) {
            if (result)
                result += ', ';
            result += `${assignedMember.firstName} ${assignedMember.lastName.slice(0, 1)}.`;
        }
        return result;
    }
    /** Get all bookings that should be shown in the list */
    get bookingsForList() {
        if (!(this.api.isLoaded() && this.api.data.bookings.length))
            return new SchedulingApiBookings(null, false);
        return this.api.data.bookings;
    }
    /** Get the necessary participant-related data for the print preview */
    get participantPrintData() {
        // eslint-disable-next-line sonarjs/cognitive-complexity
        return this._participantPrintData.get(() => {
            const result = [];
            if (this.api.isLoaded()) {
                /**
                 * @param booking Booking item.
                 * @param participant Participant item. Can be "null" for "shift.model.onlyWholeCourseBookable === true".
                 */
                const addParticipantPrintData = (booking, participant) => {
                    const tariffId = participant ? participant.tariffId : booking.overallTariffId;
                    assumeDefinedToGetStrictNullChecksRunning(tariffId, 'tariffId');
                    const participantPrintData = {
                        name: participant ? `${participant.firstName} ${participant.lastName}` : `${booking.firstName} ${booking.lastName}`,
                        attended: this.shift.isPacket ? false : (participant ? participant.attended : booking.attended),
                        email: participant ? participant.email : booking.email,
                        dateOfBirth: participant ? participant.dateOfBirth : booking.dateOfBirth,
                        tariff: booking.model.courseTariffs.get(tariffId),
                        participantCount: participant ? 1 : booking.participantCount,
                        paymentStatus: !booking.paymentStatus ? null : paymentStatusTitle(booking.paymentStatus),
                        paymentStatusTheme: !booking.paymentStatus ? null : getPaymentStatusIconStyle(booking.paymentStatus),
                        bookingNumber: booking.bookingNumber,
                        phone: (() => {
                            if (participant)
                                return null;
                            assumeDefinedToGetStrictNullChecksRunning(booking.phoneLandline, 'booking.phoneLandline');
                            return booking.phoneMobile + (!!booking.phoneMobile && !!booking.phoneLandline ? ', ' : '') + booking.phoneLandline;
                        })(),
                    };
                    result.push(participantPrintData);
                };
                for (const booking of this.api.data.bookings.iterable()) {
                    if (booking.state === SchedulingApiBookingState.BOOKED) {
                        if (this.shift.model.onlyWholeCourseBookable) {
                            addParticipantPrintData(booking, null);
                        }
                        else {
                            for (const participant of booking.participants.iterableSortedBy(['firstName', 'lastName'])) {
                                addParticipantPrintData(booking, participant);
                            }
                        }
                    }
                }
            }
            return result;
        });
    }
    /** Is the provided booking related to this shift? */
    isRelatedBooking(booking) {
        return booking.courseSelector !== null && booking.courseSelector.contains(this.shift.id);
    }
    /** Check if there are any related bookings for this shift */
    get hasBookingsForList() {
        if (!this.api.isLoaded())
            return false;
        if (!this.api.data.bookings.length)
            return false;
        for (const booking of this.api.data.bookings.iterable()) {
            if (this.isRelatedBooking(booking))
                return true;
        }
        return false;
    }
    /**
     * Calculate color
     */
    get participantsCountStyle() {
        return this.pShiftService.participantsCountStyle(this.shift, this.shift.model);
    }
    isFreeCourse(booking) {
        if (!booking)
            return undefined;
        return this.pShiftmodelTariffService.isFreeCourse(booking.model.courseTariffs, booking.model.coursePaymentMethods);
    }
    /** Get tariff name by booking & tariffId */
    getTariffName(booking, tariffId = null) {
        var _a, _b, _c, _d;
        if (this.isFreeCourse(booking))
            return (_b = (_a = this.pCurrencyPipe) === null || _a === void 0 ? void 0 : _a.transform(0)) !== null && _b !== void 0 ? _b : null;
        // FIXME: PLANO-47467
        if (tariffId === null)
            return (_d = (_c = this.pCurrencyPipe) === null || _c === void 0 ? void 0 : _c.transform(0)) !== null && _d !== void 0 ? _d : null;
        const tariff = booking.model.courseTariffs.get(tariffId);
        if (!tariff) {
            this.console.error('Tariff could not be found. [PLANO-FE-ED]');
            return 'error';
        }
        return tariff.name;
    }
    /** Get participant fee by booking & tariffId */
    getParticipantFee(booking, tariffId = null) {
        if (this.isFreeCourse(booking))
            return null;
        if (!tariffId)
            return null;
        const tariff = booking.model.courseTariffs.get(tariffId);
        if (!tariff) {
            this.console.error('Tariff could not be found. [PLANO-FE-F7]');
            return null;
        }
        return tariff.fees.get(0).fee;
    }
    /** @see PBookingFormService['getAdditionalFieldLabel'] */
    getAdditionalFieldLabel(booking, tariffId) {
        return this.pBookingFormService.getAdditionalFieldLabel(tariffId, booking);
    }
    /** Calculate the total fee for all participants together */
    getTotalFee(booking, tariffId) {
        return booking.model.courseTariffs.get(tariffId).getTotalFee(booking.participantCount);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    paymentStatusTitle(booking) {
        return paymentStatusTitle(booking.paymentStatus);
    }
    /**
     * Nicely formatted date for print preview
     */
    get printHeadlineDate() {
        if (this.shift.isPacket) {
            const sortedPackets = this.shift.packetShifts.sortedBy('start', false);
            const firstPacket = sortedPackets.first;
            const lastPacket = sortedPackets.last;
            if (!!firstPacket && !!lastPacket) {
                assumeNotUndefined(this.pDatePipe);
                return `${this.pDatePipe.transform(firstPacket.start, 'veryShortDate')} – ${this.pDatePipe.transform(lastPacket.start, 'veryShortDate')}`;
            }
        }
        assumeNotUndefined(this.pDatePipe);
        return `${this.pDatePipe.transform(this.shift.start, 'EE')} ${this.pDatePipe.transform(this.shift.start, 'veryShortDate')}`;
    }
    /**
     * A structure that decides how many tables we need.
     * The furthest out array decides how many tables we need.
     * The inner array contains the ids of the packetShifts that should be visible in the table.
     */
    get tableIndexes() {
        return this._tableIndexes.get(() => {
            // How many items should fit into one table?
            const MAX_SHIFTS_PER_TABLE = this.shift.model.onlyWholeCourseBookable ? 5 : 6;
            const shiftIds = this.shift.packetShifts.length ? this.shift.packetShifts.iterableSortedBy('start') : [this.shift];
            const totalAmountOfItems = shiftIds.length;
            const amountOfTables = Math.ceil(totalAmountOfItems / MAX_SHIFTS_PER_TABLE);
            // Create an array with as much items as tables are needed but with no values.
            const tablesArray = Array.from({ length: amountOfTables }); // => [undefined, undefined, …]
            let itemsAdded = 0;
            // For each array-item…
            return tablesArray.map((_emptyValue1, _index) => {
                const MAX_REACHED = itemsAdded + MAX_SHIFTS_PER_TABLE > totalAmountOfItems;
                const amountOfItemsInThisTable = MAX_REACHED ? totalAmountOfItems - itemsAdded : MAX_SHIFTS_PER_TABLE;
                // Create an array with empty values with as much items as this table should contain
                const emptyShiftIdsArray = Array.from({ length: MAX_SHIFTS_PER_TABLE }); // => [undefined, undefined, …]
                // Fill the inner array with shiftIds
                const shiftIdsArray = emptyShiftIdsArray.map((_emptyValue2, j) => (j + 1 > amountOfItemsInThisTable ? null : shiftIds[itemsAdded + j].id));
                // Update the added items counter
                itemsAdded = itemsAdded + amountOfItemsInThisTable;
                return shiftIdsArray;
            });
        });
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftBookingsComponent.prototype, "isLoading", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_d = typeof SchedulingApiShift !== "undefined" && SchedulingApiShift) === "function" ? _d : Object)
], PShiftBookingsComponent.prototype, "shift", void 0);
PShiftBookingsComponent = __decorate([
    Component({
        selector: 'p-shift-bookings[shift]',
        templateUrl: './p-shift-bookings.component.html',
        styleUrls: ['./p-shift-bookings.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, PShiftService, typeof (_b = typeof BookingsService !== "undefined" && BookingsService) === "function" ? _b : Object, LogService,
        PShiftmodelTariffService, typeof (_c = typeof PBookingFormService !== "undefined" && PBookingFormService) === "function" ? _c : Object, PCurrencyPipe,
        PDatePipe])
], PShiftBookingsComponent);
export { PShiftBookingsComponent };
//# sourceMappingURL=p-shift-bookings.component.js.map