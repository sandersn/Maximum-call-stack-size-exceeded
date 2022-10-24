var PTariffInputComponent_1;
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
import { __decorate, __metadata } from "tslib";
import { Component, Input, forwardRef, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, UntypedFormArray } from '@angular/forms';
import { SLIDE_ON_NGIF_TRIGGER } from '@plano/animations';
import { BookingSystemRights } from '@plano/client/accesscontrol/rights-enums';
import { PParticipantsService } from '@plano/client/booking/detail-form/p-participants/p-participants.service';
import { BootstrapSize, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PShiftmodelTariffService } from '@plano/client/shared/p-forms/p-shiftmodel-tariff.service';
import { SchedulingApiBooking } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PPossibleErrorNames } from '../../../../../../../shared/core/validators.types';
/**
 * A component for selecting one of the available tariffs for a course-booking.
 */
export class FormArrayWithFormGroups extends UntypedFormArray {
    constructor() {
        super(...arguments);
        this.controls = [];
    }
}
let PTariffInputComponent = PTariffInputComponent_1 = class PTariffInputComponent {
    constructor(changeDetectorRef, pParticipantsService, pShiftmodelTariffService, rightsService, modalService, localize) {
        this.changeDetectorRef = changeDetectorRef;
        this.pParticipantsService = pParticipantsService;
        this.pShiftmodelTariffService = pShiftmodelTariffService;
        this.rightsService = rightsService;
        this.modalService = modalService;
        this.localize = localize;
        this.CONFIG = Config;
        /**
         * Form array for all the tariffs
         */
        this.formArray = null;
        /**
         * The participant the tariff should be applied to
         */
        this.participant = null;
        // These are necessary Inputs and Outputs for pEditable form-element
        this.pEditable = false;
        this.api = null;
        this.valid = null;
        this.onSaveStart = new EventEmitter();
        this.onSaveSuccess = new EventEmitter();
        this.onDismiss = new EventEmitter();
        this.onLeaveCurrent = new EventEmitter();
        this.editMode = new EventEmitter(undefined);
        this.participantCount = 1;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.PThemeEnum = PThemeEnum;
        /**
         * This is the minimum code that is required for a custom control in Angular.
         * Its necessary to make [(ngModel)] and [formControl] work.
         */
        this.disabled = false;
        this.formControl = null;
        this._required = false;
        this._value = null;
        this.onChange = () => { };
        this.onTouched = () => { };
        /**
         * A place to temporary store all uncollapsed courseTariff forms.
         */
        this.visibleTariffIds = [];
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get tariffsAreCustomizable() {
        return this.formArray !== null;
    }
    /** Is this valid? [valid]="…" overwrites the valid state if the formControl. */
    get isValid() {
        var _a;
        if (this.valid !== null)
            return this.valid;
        return !((_a = this.formControl) === null || _a === void 0 ? void 0 : _a.invalid);
    }
    /**
     * Is this the currently selected tariff?
     */
    isSelectedTariff(tariffId) {
        return tariffId.equals(this.value);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    tariffRadioIsDisabled(courseTariff) {
        if (this.disabled)
            return true;
        if (this.pShiftmodelTariffService.tariffRadioIsDisabled(courseTariff, this.value))
            return true;
        return false;
    }
    /**
     * get all tariffs for the list.
     * Only show trashed items if they are selected.
     */
    get courseTariffsForList() {
        return this.pParticipantsService.courseTariffsForList(this.booking, this.value);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    onClick(input) {
        this.value = input;
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
    /**
     * Show courseTariff details/form.
     */
    toggleTariff(courseTariff) {
        if (this.isUncollapsedTariff(courseTariff)) {
            const index = this.visibleTariffIds.indexOf(courseTariff.id.rawData);
            this.visibleTariffIds.splice(index, 1);
        }
        else {
            this.visibleTariffIds.push(courseTariff.id.rawData);
        }
    }
    /**
     * Is this tariff uncollapsed?
     */
    isUncollapsedTariff(courseTariff) {
        if (this.editTariffBtnIsDisabled(courseTariff.id))
            return false;
        return this.visibleTariffIds.includes(courseTariff.id.rawData);
    }
    /**
     * Is the edit button disabled?
     * Only the selected tariff is enabled
     */
    editTariffBtnIsDisabled(tariffId) {
        return !this.isSelectedTariff(tariffId) || this.itsNotPossibleToCreateCustomTariff;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showEditTariffBtn() {
        if (this.rightsService.can(BookingSystemRights.createCustomTariffs, this.booking.model))
            return true;
        return false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get itsNotPossibleToCreateCustomTariff() {
        /**
         * TODO: [PLANO-10646]
         * HACK: Caused by PLANO-10644
         */
        if (this.booking.isNewItem() && !this.booking.model.onlyWholeCourseBookable)
            return true;
        return false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    tariffNotAvailableThatTime(tariff) {
        let start = this.booking.firstShiftStart;
        if (!start && this.booking.courseSelector)
            start = this.booking.courseSelector.start;
        return this.pShiftmodelTariffService.tariffIsAvailableAtDate(tariff, start) === false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    onClickTariffRadio(tariff = null) {
        const SUCCESS_CALLBACK = () => {
            const NEW_VALUE = !tariff ? undefined : tariff.id;
            this.value = NEW_VALUE;
        };
        if (this.tariffNotAvailableThatTime(tariff)) {
            this.modalService.confirm({
                modalTitle: this.localize.transform('Bist du sicher?'),
                description: this.localize.transform('Dieser Tarif gilt nicht zum gewählten Angebotsdatum.'),
            }, {
                success: () => {
                    SUCCESS_CALLBACK();
                },
                dismiss: () => { },
                size: BootstrapSize.SM,
                theme: PThemeEnum.WARNING,
            });
        }
        else {
            SUCCESS_CALLBACK();
        }
    }
    // TODO: Obsolete?
    // eslint-disable-next-line jsdoc/require-jsdoc
    hasCourseDatesData(courseTariff) {
        return this.pShiftmodelTariffService.hasCourseDatesData(courseTariff.negateForCourseDatesInterval, courseTariff.forCourseDatesFrom, courseTariff.forCourseDatesUntil);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    forCourseDatesPlaceholder(time) {
        return !time ? this.localize.transform('Unbegrenzt') : null;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTariffInputComponent.prototype, "formArray", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTariffInputComponent.prototype, "participant", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTariffInputComponent.prototype, "pEditable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTariffInputComponent.prototype, "api", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTariffInputComponent.prototype, "valid", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTariffInputComponent.prototype, "saveChangesHook", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PTariffInputComponent.prototype, "onSaveStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PTariffInputComponent.prototype, "onSaveSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PTariffInputComponent.prototype, "onDismiss", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PTariffInputComponent.prototype, "onLeaveCurrent", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PTariffInputComponent.prototype, "editMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], PTariffInputComponent.prototype, "participantCount", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_h = typeof SchedulingApiBooking !== "undefined" && SchedulingApiBooking) === "function" ? _h : Object)
], PTariffInputComponent.prototype, "booking", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PTariffInputComponent.prototype, "disabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTariffInputComponent.prototype, "formControl", void 0);
__decorate([
    Input('required'),
    __metadata("design:type", Boolean)
], PTariffInputComponent.prototype, "_required", void 0);
PTariffInputComponent = PTariffInputComponent_1 = __decorate([
    Component({
        selector: 'p-tariff-input[booking]',
        templateUrl: './p-tariff-input.component.html',
        styleUrls: ['./p-tariff-input.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PTariffInputComponent_1),
                multi: true,
            },
        ],
        animations: [
            SLIDE_ON_NGIF_TRIGGER,
        ],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object, typeof (_b = typeof PParticipantsService !== "undefined" && PParticipantsService) === "function" ? _b : Object, typeof (_c = typeof PShiftmodelTariffService !== "undefined" && PShiftmodelTariffService) === "function" ? _c : Object, typeof (_d = typeof RightsService !== "undefined" && RightsService) === "function" ? _d : Object, typeof (_e = typeof ModalService !== "undefined" && ModalService) === "function" ? _e : Object, typeof (_f = typeof LocalizePipe !== "undefined" && LocalizePipe) === "function" ? _f : Object])
], PTariffInputComponent);
export { PTariffInputComponent };
//# sourceMappingURL=p-tariff-input.component.js.map