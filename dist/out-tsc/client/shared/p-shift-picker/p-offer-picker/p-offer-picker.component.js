var POfferPickerComponent_1;
var _a, _b, _c, _d, _e;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, forwardRef, Input, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SLIDE_ON_NGIF_TRIGGER } from '@plano/animations';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiShifts, SchedulingApiService, SchedulingApiAbsences, SchedulingApiHolidays } from '@plano/shared/api';
import { SchedulingApiShiftExchangeCommunicationSwapOffers } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { PPossibleErrorNames } from '@plano/shared/core/validators.types';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../shared/core/null-type-utils';
import { BirthdayService } from '../../../scheduling/shared/api/birthday.service';
import { SchedulingApiBirthdays } from '../../../scheduling/shared/api/scheduling-api-birthday.service';
import { BootstrapSize, PThemeEnum } from '../../bootstrap-styles.enum';
import { SectionWhitespace } from '../../page/section/section.component';
let POfferPickerComponent = POfferPickerComponent_1 = class POfferPickerComponent {
    constructor(api, meService, pMoment, changeDetectorRef, birthdayService) {
        this.api = api;
        this.meService = meService;
        this.pMoment = pMoment;
        this.changeDetectorRef = changeDetectorRef;
        this.birthdayService = birthdayService;
        this.shiftTemplate = null;
        this.CONFIG = Config;
        this.showList = true;
        this.calendarMode = CalendarModes.MONTH;
        this.PThemeEnum = PThemeEnum;
        this.BootstrapSize = BootstrapSize;
        this.CalendarModes = CalendarModes;
        this.SectionWhitespace = SectionWhitespace;
        /**
         * This is the minimum code that is required for a custom control in Angular.
         * Its necessary to make [(ngModel)] and [formControl] work.
         */
        this.disabled = false;
        this.formControl = null;
        this._required = null;
        this._value = null;
        this.onChange = () => { };
        /** onTouched */
        this.onTouched = () => { };
        this.initValues();
    }
    /**
     * Get the absences that should be available to the calendar component
     */
    get absences() {
        if (!this.api.isLoaded())
            return new SchedulingApiAbsences(null, false);
        return this.api.data.absences;
    }
    /**
     * Get the holidays that should be available to the calendar component
     */
    get holidays() {
        if (!this.api.isLoaded())
            return new SchedulingApiHolidays(null, false);
        return this.api.data.holidays;
    }
    /**
     * Get the birthdays that should be available to the calendar component
     */
    get birthdays() {
        if (!this.api.isLoaded())
            return new SchedulingApiBirthdays(null, null, false);
        return this.birthdayService.birthdays;
    }
    /**
     * Set values that are necessary for this function.
     * These initValues methods are used in many components.
     * They mostly get used for class attributes that would cause performance issues as a getter.
     */
    initValues() {
        this.selectedDate = +this.pMoment.m().startOf('day');
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onSelectOffer(offer) {
        var _a;
        // We know that it only can be an SchedulingApiShiftExchangeCommunicationSwapOffer here
        const OFFER = offer;
        if ((_a = this.value) === null || _a === void 0 ? void 0 : _a.equals(OFFER.id)) {
            this.value = null;
            this.highlightOffer(null);
            return;
        }
        this.value = OFFER.id;
        this.highlightOffer(OFFER);
    }
    highlightOffer(offer) {
        this.api.deselectAllSelections();
        if (offer === null)
            return;
        for (const shiftRef of offer.shiftRefs.iterable()) {
            const shift = this.api.data.shifts.get(shiftRef.id);
            assumeNonNull(shift);
            shift.selected = true;
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    setSelectedDateAndLoadData(value) {
        this.selectedDate = value;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    setCalendarModeAndLoadData(value) {
        this.calendarMode = value;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftsForOfferPicker() {
        if (!this.offers.length)
            return new SchedulingApiShifts(null, false);
        return this.api.data.shifts.filterBy((item) => {
            if (this.offers.containsShiftId(item.id))
                return true;
            if (item.assignableMembers.contains(this.meService.data.id))
                return true;
            return false;
        });
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get warnings() {
        assumeDefinedToGetStrictNullChecksRunning(this.api.data.warnings, 'api.data.warnings');
        return this.api.data.warnings;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isValid() {
        return !this.formControl || !this.formControl.invalid;
    }
    /**
     * Is this a required field?
     * This can be set as Input() but if there is a formControl binding,
     * then it takes the info from the formControl’s validators.
     * TODO: 	Replace this by:
     * 				return this.formControlInitialRequired();
     */
    get required() {
        var _a, _b;
        if (this._required)
            return this._required;
        if (this.formControl) {
            const validator = (_b = (_a = this.formControl).validator) === null || _b === void 0 ? void 0 : _b.call(_a, this.formControl);
            if (!validator)
                return false;
            return !!validator[PPossibleErrorNames.REQUIRED] || !!validator[PPossibleErrorNames.ID_DEFINED] || !!validator[PPossibleErrorNames.NOT_UNDEFINED];
        }
        return false;
    }
    /** the value of this control */
    get value() { return this._value; }
    set value(value) {
        if (value === this._value)
            return;
        this._value = value;
        this.onChange(value);
    }
    /** Write a new value to the element. */
    writeValue(value) {
        if (this._value === value)
            return;
        this._value = value;
        this.changeDetectorRef.detectChanges();
    }
    /**
     * @see ControlValueAccessor['registerOnChange']
     *
     * Note that registerOnChange() only gets called if a formControl is bound.
     * @param fn Accepts a callback function which you can call when changes happen so that you can notify the outside world that
     * the data model has changed.
     * Note that you call it with the changed data model value.
     */
    registerOnChange(fn) { this.onChange = fn; }
    /** Set the function to be called when the control receives a touch event. */
    registerOnTouched(fn) { this.onTouched = fn; }
    /** setDisabledState */
    setDisabledState(isDisabled) {
        if (this.disabled === isDisabled)
            return;
        // Set internal attribute which gets used in the template.
        this.disabled = isDisabled;
        // Refresh the formControl. #two-way-binding
        if (this.formControl && this.formControl.disabled !== this.disabled) {
            this.disabled ? this.formControl.disable() : this.formControl.enable();
        }
    }
};
__decorate([
    Input(),
    __metadata("design:type", typeof (_d = typeof SchedulingApiShiftExchangeCommunicationSwapOffers !== "undefined" && SchedulingApiShiftExchangeCommunicationSwapOffers) === "function" ? _d : Object)
], POfferPickerComponent.prototype, "offers", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], POfferPickerComponent.prototype, "shiftTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], POfferPickerComponent.prototype, "disabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], POfferPickerComponent.prototype, "formControl", void 0);
__decorate([
    Input('required'),
    __metadata("design:type", Object)
], POfferPickerComponent.prototype, "_required", void 0);
POfferPickerComponent = POfferPickerComponent_1 = __decorate([
    Component({
        selector: 'p-offer-picker[offers]',
        templateUrl: './p-offer-picker.component.html',
        styleUrls: ['./p-offer-picker.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => POfferPickerComponent_1),
                multi: true,
            },
        ],
        animations: [SLIDE_ON_NGIF_TRIGGER],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, MeService,
        PMomentService, typeof (_b = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _b : Object, typeof (_c = typeof BirthdayService !== "undefined" && BirthdayService) === "function" ? _c : Object])
], POfferPickerComponent);
export { POfferPickerComponent };
//# sourceMappingURL=p-offer-picker.component.js.map