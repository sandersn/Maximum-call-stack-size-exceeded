var PGenerateShiftExchangesOptionsComponent_1;
var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy, forwardRef, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SLIDE_ON_NGIF_TRIGGER } from '@plano/animations';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PInputDateTypes } from '@plano/client/shared/p-forms/p-input-date/p-input-date.component';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { PShiftExchangeService } from '@plano/client/shared/p-shift-exchange/shift-exchange.service';
import { GenerateShiftExchangesMode, SchedulingApiShiftExchange } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '@plano/shared/core/config';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PPossibleErrorNames } from '@plano/shared/core/validators.types';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../shared/core/null-type-utils';
import { SectionWhitespace } from '../../shared/page/section/section.component';
let PGenerateShiftExchangesOptionsComponent = PGenerateShiftExchangesOptionsComponent_1 = class PGenerateShiftExchangesOptionsComponent {
    constructor(api, pFormsService, validators, pShiftExchangeService, pMoment, localize, changeDetectorRef) {
        this.api = api;
        this.pFormsService = pFormsService;
        this.validators = validators;
        this.pShiftExchangeService = pShiftExchangeService;
        this.pMoment = pMoment;
        this.localize = localize;
        this.changeDetectorRef = changeDetectorRef;
        /**
         * This is the minimum code that is required for a custom control in Angular.
         * Its necessary to make [(ngModel)] and [formControl] work.
         */
        this.disabled = false;
        this.formControl = null;
        this._required = null;
        this.PInputDateTypes = PInputDateTypes;
        this.PThemeEnum = PThemeEnum;
        this.SectionWhitespace = SectionWhitespace;
        this.GenerateShiftExchangesMode = GenerateShiftExchangesMode;
        this.daysBefore = null;
        // @Input('formGroup') private _formGroup : PFormGroup;
        this.formGroup = null;
        this.subscription = null;
        this._value = null;
        this.onChange = () => { };
        this.onTouched = () => { };
    }
    ngAfterContentInit() {
        // HACK: this.value is not in the first run here. Therefore i ask for (this._value && !this.formGroup)
        // It is not clear why this.value is not defined. I added a post to StackOverflow for this:
        // https://stackoverflow.com/questions/57918712/why-is-this-value-undefined-null-on-every-lifecycle-hook-when-using-ngmodel-t
        // if (!this.value) throw new Error('generateShiftExchangesOptions must be defined');
        // if (!this.shiftExchange) throw new Error('shiftExchange must be defined');
        // this.initFormGroup();
        // this.setChangesListenerForControlError();
    }
    ngAfterContentChecked() {
        this.initNow();
        this.initAfterValueHack();
    }
    initAfterValueHack() {
        // HACK: this.value is not in the first run here. Therefore i ask for (this._value && !this.formGroup)
        // It is not clear why this.value is not defined. I added a post to StackOverflow for this:
        // https://stackoverflow.com/questions/57918712/why-is-this-value-undefined-null-on-every-lifecycle-hook-when-using-ngmodel-t
        if (!this.value)
            return;
        if (this.formGroup)
            return;
        assumeDefinedToGetStrictNullChecksRunning(this.shiftExchange, 'this.shiftExchange');
        this.initValues();
        this.initFormGroup();
        this.setChangesListenerForControlError();
    }
    /**
     * Set some default values for properties that are not defined yet
     */
    initValues() {
        if (this.value.mode === null)
            this.value.mode = GenerateShiftExchangesMode.ONE_SHIFT_EXCHANGE_FOR_EACH;
    }
    setChangesListenerForControlError() {
        if (!this.formControl)
            return;
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        this.subscription = this.formGroup.valueChanges.subscribe(() => {
            assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
            this.formControl.setErrors(this.formGroup.valid ? null : { invalid: true });
        });
        // window.setInterval(() => {
        // 	this.console.log('!!formGroup.errors', !!this.formGroup.errors);
        // 	this.console.log('formGroup', this.formGroup);
        // },1000)
    }
    initNow() {
        this.now = +this.pMoment.m();
    }
    /**
     * Initialize the formGroup for this component
     */
    initFormGroup() {
        if (this.formGroup) {
            this.formGroup = null;
        }
        const newFormGroup = this.pFormsService.group({});
        this.pFormsService.addControl(newFormGroup, 'mode', {
            value: this.value.mode,
            disabled: false,
        }, [], (value) => {
            this.value.mode = value;
        });
        assumeDefinedToGetStrictNullChecksRunning(this.now, 'now');
        this.pFormsService.addControl(newFormGroup, 'deadline', {
            value: this.shiftExchange.deadline,
            disabled: false,
        }, [
            this.validators.maxDecimalPlacesCount(0, PApiPrimitiveTypes.Integer),
            this.validators.min(this.now, false, PApiPrimitiveTypes.DateTime, PApiPrimitiveTypes.Date),
            this.validators.max(this.deadlineMax, true, this.shiftExchange.attributeInfoDeadline.primitiveType),
        ], () => {
            this.value.daysBefore = this.daysBefore;
            this.value.deadline = null;
        });
        this.pFormsService.addControl(newFormGroup, 'illnessResponderCommentToMembers', {
            value: this.shiftExchange.illnessResponderCommentToMembers,
            disabled: false,
        }, [], (value) => {
            this.shiftExchange.illnessResponderCommentToMembers = value;
        });
        this.formGroup = newFormGroup;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftRefsHasMultipleShiftsOfSamePacket() {
        for (const shiftRef of this.shiftExchange.shiftRefs.iterable()) {
            const relatedShift = this.api.data.shifts.get(shiftRef.id);
            if (!relatedShift)
                throw new Error('Could not find relatedShift');
            // shift is not a package? Then skip to next loop.
            if (!relatedShift.packetShifts.length)
                continue;
            // shift is a package!
            // Iterate all packetShifts and check if one of them is inside this shiftExchange.shiftRefs
            for (const packetShift of relatedShift.packetShifts.iterable()) {
                // Skip equal shift.
                if (packetShift.id.equals(shiftRef.id))
                    continue;
                if (this.shiftExchange.shiftRefs.contains(packetShift.id))
                    return true;
            }
        }
        return false;
    }
    get responder() {
        if (this.shiftExchange.memberIdAddressedTo !== null) {
            const MEMBER_ID_ADDRESSED_TO = this.api.data.members.get(this.shiftExchange.memberIdAddressedTo);
            if (MEMBER_ID_ADDRESSED_TO)
                return `${MEMBER_ID_ADDRESSED_TO.firstName}`;
        }
        else {
            return this.localize.transform('die Mitarbeitenden');
        }
        return '…';
    }
    get sender() {
        // WARNING: This methods exists two times
        if (!this.pShiftExchangeService.iAmTheNewResponsiblePersonForThisIllness(this.shiftExchange)) {
            if (!this.shiftExchange.communications.managerResponseCommunication) {
                return this.localize.transform('der Leitung');
            }
            if (!this.shiftExchange.communications.managerResponseCommunication.communicationPartner)
                throw new Error('communicationPartner undefined');
            return this.shiftExchange.communications.managerResponseCommunication.communicationPartner.firstName;
        }
        return this.localize.transform('dir');
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get illnessResponderCommentToMembersLabel() {
        // WARNING: This methods exists two times
        return this.localize.transform('Kommentar von ${sender} an ${responder}', {
            sender: this.sender,
            responder: this.responder,
        });
    }
    /**
     * Get a number of days, turn it into milliseconds and remove it from the given timestamp
     */
    removeDaysFromTimestamp(timestamp, daysBefore) {
        assumeDefinedToGetStrictNullChecksRunning(daysBefore, 'daysBefore');
        // WARNING: This method is duplicated somewhere
        const daysAsDuration = this.pMoment.duration(+daysBefore, 'days');
        const daysAsTimestamp = +daysAsDuration;
        return +this.pMoment.m(timestamp - daysAsTimestamp).add(1, 'day').startOf('day');
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showModeInput() {
        return this.shiftExchange.shiftRefs.length > 1;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get deadlineMax() {
        /**
         * NOTE: Wenn man eine Frist für einen Fall mit mehrere Schichten setzt (zB 3 Tage vorher), sollte sich das immer
         * auf die zeitlich erste Schicht des Falls beziehen
         */
        return this.endOfEarliestShift;
    }
    get endOfEarliestShift() {
        if (!this.shiftExchange.shiftRefs.earliestEnd)
            return null;
        const pMoment = new PMomentService(Config.LOCALE_ID);
        return +pMoment.m(this.shiftExchange.shiftRefs.earliestEnd).startOf('day');
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get deadlineIsDisabled() {
        if (this.deadlineMax === null)
            return false;
        return this.now > this.deadlineMax;
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
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get sortedShiftRefs() {
        return this.shiftExchange.shiftRefs.iterableSortedBy(item => {
            const shift = this.api.data.shifts.get(item.id);
            if (!shift)
                throw new Error('shift could not be found');
            return shift.start;
        });
    }
    ngOnDestroy() {
        var _a;
        (_a = this.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
};
__decorate([
    Input(),
    __metadata("design:type", typeof (_c = typeof SchedulingApiShiftExchange !== "undefined" && SchedulingApiShiftExchange) === "function" ? _c : Object)
], PGenerateShiftExchangesOptionsComponent.prototype, "shiftExchange", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PGenerateShiftExchangesOptionsComponent.prototype, "disabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PGenerateShiftExchangesOptionsComponent.prototype, "formControl", void 0);
__decorate([
    Input('required'),
    __metadata("design:type", Object)
], PGenerateShiftExchangesOptionsComponent.prototype, "_required", void 0);
PGenerateShiftExchangesOptionsComponent = PGenerateShiftExchangesOptionsComponent_1 = __decorate([
    Component({
        selector: 'p-generate-shift-exchanges-options[shiftExchange]',
        templateUrl: './generate-shift-exchanges-options.component.html',
        styleUrls: ['./generate-shift-exchanges-options.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        animations: [SLIDE_ON_NGIF_TRIGGER],
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PGenerateShiftExchangesOptionsComponent_1),
                multi: true,
            },
        ],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, PFormsService,
        ValidatorsService,
        PShiftExchangeService,
        PMomentService,
        LocalizePipe, typeof (_b = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _b : Object])
], PGenerateShiftExchangesOptionsComponent);
export { PGenerateShiftExchangesOptionsComponent };
//# sourceMappingURL=generate-shift-exchanges-options.component.js.map