var _a, _b, _c, _d, _e;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { SchedulingApiBooking } from '@plano/shared/api';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../../../shared/core/null-type-utils';
import { PParticipantsService } from '../../../../../../booking/detail-form/p-participants/p-participants.service';
import { PThemeEnum } from '../../../../../../shared/bootstrap-styles.enum';
let PBookingPersonCardComponent = class PBookingPersonCardComponent {
    constructor(pParticipantsService) {
        this.pParticipantsService = pParticipantsService;
        this.participant = null;
        this.card = true;
        this.onClickRemove = new EventEmitter();
        this.onClickEdit = new EventEmitter();
        this.PThemeEnum = PThemeEnum;
    }
    /**
     * Check if main data like fistName and lastName are set
     */
    get hasHeadlineData() {
        return !!this.firstName || !!this.lastName;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get firstName() {
        if (!this.participant)
            return this.booking.firstName;
        if (this.participant.isBookingPerson && !this.participant.firstName) {
            return this.booking.firstName;
        }
        return this.participant.firstName;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get lastName() {
        if (!this.participant)
            return this.booking.lastName;
        if (this.participant.isBookingPerson && !this.participant.lastName) {
            return this.booking.lastName;
        }
        return this.participant.lastName;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get email() {
        if (!this.participant)
            return this.booking.email;
        if (this.participant.isBookingPerson && !this.participant.email)
            return this.booking.email;
        return this.participant.email;
    }
    /**
     * Check if main data like birth date, email etc. is set
     */
    hasAdvancedData(person) {
        if (this.email)
            return true;
        if (person instanceof SchedulingApiBooking) {
            if (person.company)
                return true;
            if (person.phoneMobile)
                return true;
            if (person.phoneLandline)
                return true;
            if (person.email)
                return true;
        }
        return false;
    }
    /**
     * Name of the tariff.
     */
    get tariffName() {
        if (this.participant && this.participant.tariffId !== null) {
            assumeDefinedToGetStrictNullChecksRunning(this.participant.tariffId, 'participant.tariffId');
            return this.booking.model.courseTariffs.get(this.participant.tariffId).name;
        }
        for (const item of this.booking.participants.iterable()) {
            assumeDefinedToGetStrictNullChecksRunning(item.tariffId, 'item.tariffId');
            if (item.isBookingPerson && this.booking.model.courseTariffs.get(item.tariffId)) {
                return this.booking.model.courseTariffs.get(item.tariffId).name;
            }
        }
        return null;
    }
    /**
     * Fee of the tariff.
     */
    get tariffFee() {
        var _a;
        if ((_a = this.participant) === null || _a === void 0 ? void 0 : _a.tariffId) {
            assumeDefinedToGetStrictNullChecksRunning(this.participant.tariffId, 'participant!.tariffId');
            return this.booking.model.courseTariffs.get(this.participant.tariffId).fees.get(0).fee;
        }
        for (const item of this.booking.participants.iterable()) {
            if (item.isBookingPerson) {
                assumeDefinedToGetStrictNullChecksRunning(item.tariffId, 'item.tariffId');
                return this.booking.model.courseTariffs.get(item.tariffId).fees.get(0).fee;
            }
        }
        return null;
    }
    /** Should the booking person min warning be visible? */
    get bookingPersonAgeLimitWarning() {
        return this.pParticipantsService.bookingPersonAgeLimitWarning(this.booking);
    }
};
__decorate([
    Input(),
    __metadata("design:type", typeof (_b = typeof SchedulingApiBooking !== "undefined" && SchedulingApiBooking) === "function" ? _b : Object)
], PBookingPersonCardComponent.prototype, "booking", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PBookingPersonCardComponent.prototype, "participant", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PBookingPersonCardComponent.prototype, "card", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_d = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _d : Object)
], PBookingPersonCardComponent.prototype, "onClickRemove", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_e = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _e : Object)
], PBookingPersonCardComponent.prototype, "onClickEdit", void 0);
PBookingPersonCardComponent = __decorate([
    Component({
        selector: 'p-booking-person-card[booking]',
        templateUrl: './booking-person-card.component.html',
        styleUrls: ['./booking-person-card.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof PParticipantsService !== "undefined" && PParticipantsService) === "function" ? _a : Object])
], PBookingPersonCardComponent);
export { PBookingPersonCardComponent };
//# sourceMappingURL=booking-person-card.component.js.map