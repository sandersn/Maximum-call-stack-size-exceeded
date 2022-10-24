/* NOTE: Dont make this file even bigger. Invest some time to cleanup/split into several files */
/* eslint max-lines: ["error", 1100] */
var PInputDateComponent_1;
var _a, _b, _c, _d, _e;
import { __decorate, __metadata } from "tslib";
import * as $ from 'jquery';
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, NgZone, forwardRef, HostBinding, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { NgbFormatsService } from '@plano/client/service/ngbformats.service';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PFormControl } from '@plano/client/shared/p-forms/p-form-control';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PInputDateService } from './p-input-date.service';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../shared/core/null-type-utils';
import { PValidatorObject, PPossibleErrorNames } from '../../../../shared/core/validators.types';
import { PFormControlComponentBaseDirective } from '../../p-attribute-info/attribute-info-component-base';
export var PInputDateTypes;
(function (PInputDateTypes) {
    /**
     * @deprecated Do not set this from outside anymore. It is obsolete, since we check min and max from validators of attributeInfo.
     */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PInputDateTypes["birth"] = "birth";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    PInputDateTypes["deadline"] = "deadline";
})(PInputDateTypes || (PInputDateTypes = {}));
let PInputDateComponent = PInputDateComponent_1 = class PInputDateComponent extends PFormControlComponentBaseDirective {
    constructor(modalService, zone, pFormsService, validators, ngbFormatsService, localize, datePipe, changeDetectorRef, pInputDateService, console) {
        super(false, changeDetectorRef, pFormsService, console);
        this.modalService = modalService;
        this.zone = zone;
        this.pFormsService = pFormsService;
        this.validators = validators;
        this.ngbFormatsService = ngbFormatsService;
        this.localize = localize;
        this.datePipe = datePipe;
        this.changeDetectorRef = changeDetectorRef;
        this.pInputDateService = pInputDateService;
        this.console = console;
        this.isLoading = null;
        this.showDaysBeforeInput = null;
        this._class = '';
        /**
         * Days before as number
         * This is NOT a timestamp
         */
        this.daysBefore = null;
        this.daysBeforeChange = new EventEmitter();
        this._max = null;
        this.type = null;
        this.CONFIG = Config;
        this._showEraseValueBtn = true;
        this.supportsUndefined = false;
        this.showNowButton = null;
        /**
         * Should the timestamp include the exact time? If not it will only represent a date.
         */
        this.showTimeInput = null;
        /**
         * The modal with the datepicker includes a input for time. This will get a own validator. Should the time be required?
         */
        this.timeIsRequired = false;
        /**
         * Should the selected date be handled as exclusive end?
         * Example: User decides a Vacation-Entry should go till 29.12.2020. The stored end date will be the millisecond 0
         * of the date 30.12.2020
         * Note that this boolean has no effect if showTimeInput is true.
         */
        this.isExclusiveEnd = null;
        this._placeholder = null;
        /**
         * A label for the input-area or button.
         * It will be shown instead of the formatted date, if label is set.
         */
        this.label = null;
        // NOTE: Use class="btn-*" instead of [theme]="'"
        // @Input() private theme : PThemeEnum;
        /**
         * A range like 'week' can be set. If its set, the user can only select a whole week, and not a single date.
         */
        this.range = CalendarModes.DAY;
        this.ngbDate = null;
        this.formGroup = null;
        this.modalRef = null;
        this.startDate = null;
        this.checkTouched = false;
        /**
         * You can suggest a time. Like the planned time of a shift for the date-input of the time-stamp
         */
        this.suggestionTimestamp = null;
        /**
         * Label of the button that is shown if a suggested timestamp is provided
         */
        this.suggestionLabel = null;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.PApiPrimitiveTypes = PApiPrimitiveTypes;
        this._locale = null;
        this.showEraseValueBtnIcon = false;
        this.clicked = false;
        // These are necessary Inputs and Outputs for pEditable form-element
        this.pEditable = false;
        this.api = null;
        this.valid = null;
        this.onSaveStart = new EventEmitter();
        this.onSaveSuccess = new EventEmitter();
        this.onDismiss = new EventEmitter();
        this.onLeaveCurrent = new EventEmitter();
        this.editMode = new EventEmitter(undefined);
        this._disabled = false;
        this.formControl = null;
        this._readMode = null;
        this._required = false;
        this._value = null;
        this._onChange = () => { };
        // @Output() public change : EventEmitter<Event> = new EventEmitter<Event>();
        /** onTouched */
        this.onTouched = () => { };
        this.daysBeforeLabel = null;
        this.eraseValueBtnLabel = null;
        this.icon = null;
    }
    get _classes() {
        if (!this.btnStyles)
            return this._class;
        return this._class.replace(this.btnStyles, '');
    }
    /** @see PInputDateComponent['_min'] */
    get min() {
        var _a, _b, _c;
        if (this._min !== undefined)
            return this._min;
        const MIN_COMPARED_CONST = (_c = (_b = (_a = this.formControl) === null || _a === void 0 ? void 0 : _a.validatorObjects.min) === null || _b === void 0 ? void 0 : _b.comparedConst) !== null && _c !== void 0 ? _c : null;
        if (MIN_COMPARED_CONST !== null) {
            if (typeof MIN_COMPARED_CONST === 'function')
                return MIN_COMPARED_CONST();
            return MIN_COMPARED_CONST;
        }
        // TODO: Remove this, when all datepickers are bound to attributeInfo
        if (this.type === PInputDateTypes.birth) { // HACK: PLANO-151942 We dont want developers to set PInputDateTypes.birth from outside anymore.
            return +(new PMomentService(this.locale).m()).subtract(120, 'years');
        }
        return null;
    }
    /**
     * maximum date and time of this input in timestamp format
     * 0 means no limit
     */
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    set max(input) {
        if (this._max !== input && this.formGroup && this.daysBefore) {
            this._max = input;
            // date is calculated by 'daysBefore' and 'max'. If one of them change, the calculated must be repeated.
            this.formGroup.get('daysBefore').updateValueAndValidity();
        }
        else {
            this._max = input;
        }
    }
    /**
     * maximum date and time of this input in timestamp format
     * 0 means no limit
     */
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    get max() {
        var _a, _b, _c;
        if (this._max !== null) {
            if (this.isExclusiveEnd)
                return this._max - 1;
            return this._max;
        }
        const MAX_COMPARED_CONST = (_c = (_b = (_a = this.formControl) === null || _a === void 0 ? void 0 : _a.validatorObjects.max) === null || _b === void 0 ? void 0 : _b.comparedConst) !== null && _c !== void 0 ? _c : null;
        if (MAX_COMPARED_CONST !== null) {
            if (typeof MAX_COMPARED_CONST === 'function')
                return MAX_COMPARED_CONST();
            return MAX_COMPARED_CONST;
        }
        return null;
    }
    /** @see PInputDateComponent['_ngbMinDate'] */
    get ngbMinDate() {
        if (this.min !== null)
            return this.ngbFormatsService.timestampToDateStruct(this.min, this.locale);
        return '-';
    }
    /** @see PInputDateComponent['_ngbMaxDate'] */
    get ngbMaxDate() {
        if (this.max !== null)
            return this.ngbFormatsService.timestampToDateStruct(this.max, this.locale);
        return '-';
    }
    /**
     * Get the locale. Either from [locale]="…" when this component gets used, or from the global config.
     */
    get locale() {
        var _a;
        return (_a = this._locale) !== null && _a !== void 0 ? _a : Config.LOCALE_ID;
    }
    /**
     * Highlight some days based on e.g. the defined range.
     */
    isHighlighted(input) {
        const timestamp = this.ngbFormatsService.dateTimeObjectToTimestamp(input, this.locale);
        const selectedTimestamp = this.selectedDateTime;
        return new PMomentService(this.locale).m(timestamp).isSame(selectedTimestamp, this.range);
    }
    /**
     * Should the suggestion button be clickable?
     */
    get suggestionBtnIsDisabled() {
        if (this.suggestionTimestamp === null)
            return true;
        if (this.min && this.suggestionTimestamp < this.min)
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get btnStyles() {
        if (!this._class)
            return undefined;
        const stylesArray = this._class.match(/btn-(?:outline-\w+|\w+)/g);
        if (!stylesArray)
            return undefined;
        return stylesArray.join(' ');
    }
    /**
     * Should the erase button be visible?
     */
    get showEraseValueBtn() {
        if (!this._showEraseValueBtn)
            return false;
        if (this.supportsUndefined && this.value !== 0)
            return true;
        if (!this.value)
            return false;
        return true;
    }
    /**
     * Calculates the difference between the maximum date and the given value in days.
     */
    timestampToDaysBefore(timestamp) {
        if (!this.max)
            return null;
        if (!timestamp || +timestamp <= 0)
            return null;
        const N = this.isExclusiveEnd ? this.max + 1 : this.max;
        const DURATION = N - +timestamp;
        let days = (new PMomentService(this.locale)).duration(DURATION).asDays();
        days = this.isExclusiveEnd ? days + 1 : days;
        return Math.floor(days);
    }
    /**
     * Turn a given "days before" value into a timestamp
     */
    daysBeforeToTimestamp(value) {
        if (!this.max)
            return null;
        if (value === undefined || value === '' || Number.isNaN(+value))
            return null;
        // if (value === 0) return this.max;
        let days = +value;
        days = this.isExclusiveEnd ? days - 1 : days;
        const daysAsTimestamp = +(new PMomentService(this.locale)).duration(days, 'days');
        const N = this.isExclusiveEnd ? this.max + 1 : this.max;
        let result = N - daysAsTimestamp;
        result = +(new PMomentService(this.locale)).m(result).startOf('day');
        return result;
    }
    /**
     * Initialize the form group for this component.
     * This form group gets used for internal bindings and holding internal values of this component.
     * This formGroup and its controls are not directly related to the bound [formControl]="…".
     */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    initFormGroup() {
        if (this.formGroup) {
            this.formGroup = null;
        }
        const tempFormGroup = this.pFormsService.group({});
        const INITIAL_DAYS_BEFORE_VALUE = this.timestampToDaysBefore(this.value);
        this.pFormsService.addControl(tempFormGroup, 'daysBefore', {
            value: INITIAL_DAYS_BEFORE_VALUE,
            disabled: false,
        }, [
            new PValidatorObject({ name: PPossibleErrorNames.MAX_DECIMAL_PLACES_COUNT, fn: (control) => {
                    if (!this.showDaysBeforeInput)
                        return null;
                    if (!control.value)
                        return null;
                    if (Number.isNaN(+control.value))
                        return null;
                    return this.validators.maxDecimalPlacesCount(0, PApiPrimitiveTypes.Integer).fn({ value: +control.value });
                } }),
            new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => {
                    if (!this.showDaysBeforeInput)
                        return null;
                    if (!this.required)
                        return null;
                    return this.validators.required(PApiPrimitiveTypes.number).fn(control);
                } }),
            new PValidatorObject({ name: PPossibleErrorNames.MIN, fn: (control) => {
                    if (!this.showDaysBeforeInput)
                        return null;
                    if (!control.value)
                        return null;
                    if (!this.min)
                        return null;
                    // The daysBefore value combined with the max value results to a deadline
                    const CALCULATED_DEADLINE = this.daysBeforeToTimestamp(control.value);
                    // NOTE: Seems hacky. Not sure if necessary.
                    const MIN_TOLERANCE = 1000 * 60;
                    assumeDefinedToGetStrictNullChecksRunning(CALCULATED_DEADLINE, 'CALCULATED_DEADLINE');
                    if (CALCULATED_DEADLINE >= (this.min + MIN_TOLERANCE))
                        return null;
                    return { [PPossibleErrorNames.MIN]: {
                            name: PPossibleErrorNames.MIN,
                            primitiveType: PApiPrimitiveTypes.Days,
                            actual: control.value,
                        } };
                } }),
            new PValidatorObject({ name: PPossibleErrorNames.MAX, fn: (control) => {
                    if (!this.showDaysBeforeInput)
                        return null;
                    if (!control.value)
                        return null;
                    if (!this.max)
                        return null;
                    // The daysBefore value combined with the max value results to a deadline
                    const CALCULATED_DEADLINE = this.daysBeforeToTimestamp(control.value);
                    assumeDefinedToGetStrictNullChecksRunning(CALCULATED_DEADLINE, 'CALCULATED_DEADLINE');
                    if (CALCULATED_DEADLINE <= (this.max + (this.isExclusiveEnd ? 1 : 0)))
                        return null;
                    return { [PPossibleErrorNames.MAX]: {
                            name: PPossibleErrorNames.MAX,
                            primitiveType: PApiPrimitiveTypes.Days,
                            actual: control.value,
                        } };
                } }),
        ], (value) => {
            if (this.type !== PInputDateTypes.deadline)
                return;
            this.setDateBeforeModel(value);
        });
        const refreshDaysBefore = (value) => {
            const result = this.timestampToDaysBefore(value);
            const control = tempFormGroup.get('daysBefore');
            assumeDefinedToGetStrictNullChecksRunning(control, 'control');
            if (`${control.value}` !== `${result}`) {
                control.setValue(result);
            }
        };
        this.pFormsService.addControl(tempFormGroup, 'date', {
            value: this.ngbDate,
            disabled: false,
        }, [
            new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => {
                    var _a;
                    if (control.value !== '-')
                        return null;
                    // If the outer control (the one that is bound to this component) is not required,
                    // then there is one case left, where we want to mark the internal 'date' control as required:
                    // If the user has provided some 'time' data, but has not yet selected a date.
                    if (!this.required) {
                        const userHasTypedInATime = this.showTimeInput && ((_a = tempFormGroup.get('time')) === null || _a === void 0 ? void 0 : _a.value);
                        if (!userHasTypedInATime)
                            return null;
                    }
                    const emptyControl = new PFormControl({
                        formState: {
                            value: undefined,
                            disabled: false,
                        },
                    });
                    return this.validators.required(PApiPrimitiveTypes.string).fn(emptyControl);
                } }),
        ], (value) => {
            const timeControl = tempFormGroup.get('time');
            assumeNonNull(timeControl);
            timeControl.updateValueAndValidity();
            if (!this.showTimeInput) {
                if (!(this.type === PInputDateTypes.deadline && this.showDaysBeforeInput)) {
                    this.modalRef.close();
                }
                this.setControlValue();
            }
            if (value === null)
                return;
            const TIMESTAMP = this.ngbFormatsService.dateTimeObjectToTimestamp(value, this.locale);
            refreshDaysBefore(TIMESTAMP);
        });
        this.pFormsService.addControl(tempFormGroup, 'time', {
            value: this.selectedTime,
            disabled: false,
        }, [
            new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => {
                    if (!this.showTimeInput)
                        return null;
                    return this.validators.required(PApiPrimitiveTypes.LocalTime).fn(control);
                } }),
            new PValidatorObject({ name: PPossibleErrorNames.MIN, fn: () => {
                    if (!this.showTimeInput)
                        return null;
                    if (!this.selectedDateTime)
                        return null;
                    if (!this.min)
                        return null;
                    if (this.selectedDateTime >= (this.min + (1000 * 60)))
                        return null;
                    return { [PPossibleErrorNames.MIN]: {
                            name: PPossibleErrorNames.MIN,
                            primitiveType: PApiPrimitiveTypes.DateTime,
                            errorText: 'Wähle bitte eine Zeit später als »${min}«.',
                            min: this.min,
                        } };
                } }),
            new PValidatorObject({ name: PPossibleErrorNames.MAX, fn: () => {
                    if (!this.showTimeInput)
                        return null;
                    if (!this.selectedDateTime)
                        return null;
                    if (!this.max)
                        return null;
                    if (this.selectedDateTime <= (this.max - (1000 * 60)))
                        return null;
                    return { [PPossibleErrorNames.MAX]: {
                            name: PPossibleErrorNames.MAX,
                            primitiveType: PApiPrimitiveTypes.DateTime,
                            errorText: 'Die Zeit muss vor »${max}« liegen',
                            max: this.max,
                        } };
                } }),
        ]);
        // this.setDateBeforeModel(INITIAL_DAYS_BEFORE_VALUE);
        this.formGroup = tempFormGroup;
    }
    /**
     * Sets a new value to the 'daysBefore' property.
     */
    setDaysBeforeModel(input) {
        this.daysBefore = input;
        this.daysBeforeChange.emit(input);
    }
    /**
     * Sets a new value to the internal control which gets used for binding to the date-picker.
     */
    setDateControlValue(input) {
        if (!this.formGroup)
            return;
        const dateControl = this.formGroup.get('date');
        if (!dateControl)
            return;
        // NOTE: Do Nothing if date has not changed
        if (this.deepEqualDateStruct(dateControl.value, input))
            return;
        dateControl.setValue(input);
    }
    setDateBeforeModel(value) {
        let newDaysBeforeValue = null;
        let newDateValue;
        if (value === null || value === '' || Number.isNaN(+value)) {
            newDaysBeforeValue = null;
            newDateValue = null;
        }
        else {
            assumeDefinedToGetStrictNullChecksRunning(this.daysBefore, 'daysBefore');
            if (+this.daysBefore === +value)
                return;
            newDaysBeforeValue = +value;
            const newDeadline = this.daysBeforeToTimestamp(newDaysBeforeValue);
            assumeDefinedToGetStrictNullChecksRunning(newDeadline, 'newDeadline');
            newDateValue = this.ngbFormatsService.timestampToDateStruct(newDeadline, this.locale);
        }
        this.setDaysBeforeModel(newDaysBeforeValue);
        this.setDateControlValue(newDateValue !== null && newDateValue !== void 0 ? newDateValue : '-');
        this.setControlValue();
    }
    /**
     * Check if these dates are the same
     */
    deepEqualDateStruct(input1, input2) {
        if (!input1 || input1 === '-' || !input2 || input2 === '-')
            return input1 === input2;
        if (input1.day === input2.day &&
            input1.month === input2.month &&
            input1.year === input2.year)
            return true;
        return false;
    }
    ngAfterContentInit() {
        this.validateValues();
        this.initValues();
        if (this.eraseValueBtnLabel === null) {
            this.showEraseValueBtnIcon = true;
            this.eraseValueBtnLabel = this.localize.transform('Eingabe löschen');
        }
        return super.ngAfterContentInit();
    }
    /**
     * Validate if required attributes are set and
     * if the set values work together / make sense / have a working implementation.
     */
    validateValues() {
        if (Config.DEBUG && this.showDaysBeforeInput && this.pEditable) {
            throw new Error('PLANO-14566: input-date does not work with active pEditable yet.');
        }
        // TODO: (PLANO-53380)
        if (!!this.cannotEditHint)
            throw new Error('cannotEditHint not implemented yet in this component. See PLANO-53380');
        if (this.suggestionTimestamp !== null && !this.suggestionLabel)
            throw new Error('suggestionLabel must be defined if suggestionTimestamp is provided');
    }
    determineType() {
        if (this.type !== null)
            throw new Error('No need to determine type when it is already set');
        if (this.icon === PlanoFaIconPool.BIRTHDAY) {
            this.type = PInputDateTypes.birth; // HACK: PLANO-151942 We dont want developers to set PInputDateTypes.birth from outside anymore.
        }
        if (this.min !== null && +(new PMomentService(this.locale).m().subtract(80, 'years')) > this.min) {
            this.type = PInputDateTypes.birth; // HACK: PLANO-151942 We dont want developers to set PInputDateTypes.birth from outside anymore.
        }
    }
    /**
     * Set values that are necessary for this function.
     * These initValues methods are used in many components.
     * They mostly get used for class attributes that would cause performance issues as a getter.
     */
    initValues() {
        this.now = +(new PMomentService(this.locale).m());
        this.initValuesByControlValue();
        if (this.type === null)
            this.determineType();
        switch (this.type) {
            // TODO: Remove this, when all datepickers are bound to attributeInfo
            case PInputDateTypes.birth: // HACK: PLANO-151942 We dont want developers to set PInputDateTypes.birth from outside anymore.
                if (!this.max)
                    this.max = +(new PMomentService(this.locale).m());
                if (this.showNowButton === null)
                    this.showNowButton = false;
                // HACK: Don’t know why but sometimes startDate was 1.1.1970
                // We had this again. We checkt requests and we proofed that new cse does not has anything to do with a
                // birth day in 1970.
                // Conclusion:
                //   - It’s completely a frontend thing
                //   - It does not lead to wrong api-requests
                //   - it has NOTHING TO DO with people that where born on 1.1.1970.
                const VALUE_YEAR = new PMomentService(this.locale).m(this.value).get('year');
                const SOMETHING_IS_BROKEN = (this.startDate && this.startDate !== '-' && this.startDate.year === 1970 && VALUE_YEAR !== 1970);
                if (SOMETHING_IS_BROKEN && !Config.DEBUG) {
                    // this never happened in at last a year
                    this.console.error('startDate is defined but 1970. Not sure if this is intended');
                }
                if (this.startDate === null || SOMETHING_IS_BROKEN) {
                    if (this.ngbDate !== null && this.ngbDate !== '-') {
                        this.startDate = this.ngbDate;
                    }
                    else {
                        const EIGHTEEN_YEARS_AGO = +(new PMomentService(this.locale).m().subtract(18, 'years'));
                        const INITIAL_START_DATE = this.ngbFormatsService.timestampToDateStruct(EIGHTEEN_YEARS_AGO, this.locale);
                        this.startDate = INITIAL_START_DATE;
                    }
                }
                break;
            case PInputDateTypes.deadline:
                this.isExclusiveEnd = true;
                break;
            default:
                if (this.showNowButton === null)
                    this.showNowButton = true;
                this.startDate = this.ngbDate;
        }
        if (this.isExclusiveEnd === null)
            this.isExclusiveEnd = false;
        if (this.showTimeInput === null)
            this.showTimeInput = false;
        if (this.daysBefore === null)
            this.setDaysBeforeModel(this.timestampToDaysBefore(this.value));
        this.initFormGroup();
    }
    initValuesByControlValue() {
        if (this.showDaysBeforeInput === null)
            this.showDaysBeforeInput = this.type === PInputDateTypes.deadline && !this.value;
        if (this.isExclusiveEnd && !this.showTimeInput) {
            this.ngbDate = this.value ? this.ngbFormatsService.timestampToDateStruct(this.value - 1, this.locale) : '-';
        }
        else {
            this.ngbDate = this.value ? this.ngbFormatsService.timestampToDateStruct(this.value, this.locale) : '-';
        }
    }
    /**
     * Timestamp to 'DD.MM.YYYY[ | HH:mm]'
     */
    get formattedDateTime() {
        if (!this.value)
            return '';
        let resultTimestamp = this.value;
        if (this.isExclusiveEnd && !this.showTimeInput)
            resultTimestamp = resultTimestamp - 1;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        let DATE_FORMAT;
        if (this.range === CalendarModes.MONTH) {
            DATE_FORMAT = 'MM.YY';
        }
        else {
            DATE_FORMAT = Config.IS_MOBILE ? 'veryShortDate' : 'shortDate';
        }
        let result = this.datePipe.transform(resultTimestamp, DATE_FORMAT, undefined, this.locale);
        if (this.showTimeInput)
            result += ` | ${this.datePipe.transform(resultTimestamp, 'shortTime', undefined, this.locale)}`;
        return result;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get placeholder() {
        // TODO: Get rid of `this._placeholder !== undefined` here
        if (this._placeholder !== null)
            return this._placeholder;
        let result = this.localize.transform('--.--.----');
        if (this.showTimeInput) {
            result += ' | ';
            result += this.localize.transform('--:--');
        }
        return result;
    }
    addExclusiveMillisecondIfNecessary(input) {
        if (this.type === PInputDateTypes.deadline)
            return input;
        if (!this.isExclusiveEnd)
            return input;
        if (this.showTimeInput)
            return input;
        return +(new PMomentService(this.locale)).m(input).add(1, 'day').startOf('day');
    }
    /**
     * Set startTime and endTime values and validators and update them.
     */
    setControlValue() {
        if (!this.selectedDateTime) {
            if (this.attributeInfo) {
                this.value = null;
            }
            else {
                // In DateTime 0 means null
                this.value = 0;
            }
            return;
        }
        this.value = this.addExclusiveMillisecondIfNecessary(this.selectedDateTime);
        if (this.formControl)
            this.formControl.markAsTouched();
        /** No footer that can be clicked. So selecting a day should trigger the save pEditable. */
        if (!this.showTimeInput && this.pEditable && this.isValid) {
            this.api.save();
            this.animateSuccessButton();
        }
    }
    /**
     * Get a timestamp of the selected time only (without the milliseconds of the selected date)
     */
    get selectedTime() {
        return this.valueToTimeTimestamp(this.value);
    }
    /**
     * Remove the date milliseconds from a timestamp and leave the time-related milliseconds
     */
    valueToTimeTimestamp(input) {
        if (input === null)
            return null;
        const TIME_AS_STRING = (new PMomentService(this.locale)).m(input).format('HH:mm');
        return (new PMomentService(this.locale)).d(TIME_AS_STRING).asMilliseconds();
    }
    /**
     * Get a timestamp that involves both date and time combined
     */
    get selectedDateTime() {
        if (!this.formGroup)
            return 0;
        // if (this.supportsUndefined && this.formGroup.get('date'].value === undefined && this.formGroup.controls['time').value === undefined) {
        // 	return undefined;
        // }
        return this.pInputDateService.convertNgbDateAndNgbTimeToTimestamp(this.locale, this.formGroup.get('date').value, this.formGroup.get('time').value, this.showTimeInput);
    }
    /**
     * Set date [and time] to now
     */
    onClickNow() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        this.formGroup.get('date').setValue(this.ngbFormatsService.timestampToDateStruct(this.now, this.locale));
        this.formGroup.get('time').setValue(this.valueToTimeTimestamp(this.now));
    }
    /**
     * Set date [and time] to now
     */
    onClickSuggestion() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        if (this.suggestionTimestamp === null)
            throw new Error('button should not have been visible, if suggestionTimestamp is not provided');
        if (this.min && this.suggestionTimestamp < this.min)
            throw new Error('suggestion is before min. Button should not have been clickable');
        this.formGroup.get('date').setValue(this.ngbFormatsService.timestampToDateStruct(this.suggestionTimestamp, this.locale));
        this.formGroup.get('time').setValue(this.valueToTimeTimestamp(this.suggestionTimestamp));
    }
    /**
     * Remove all input data and remove data from PFormControl
     */
    unsetData() {
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        this.formGroup.get('time').setValue(undefined);
        this.formGroup.get('date').setValue(undefined);
        this.ngbDate = null;
        this.value = 0;
        this.animateSuccessButton();
    }
    /**
     * Check if user input is the current time (plus/minus a tolerance)
     */
    get isCurrentDateTime() {
        let result = false;
        // Tolerance in minutes
        const TOLERANCE = 10;
        const formattedDateTime = (new PMomentService(this.locale)).m(this.selectedDateTime);
        if (this.showTimeInput) {
            result = formattedDateTime.isBetween((new PMomentService(this.locale)).m().subtract(TOLERANCE, 'minutes'), (new PMomentService(this.locale)).m().add(TOLERANCE, 'minutes'));
        }
        else {
            result = formattedDateTime.isSame((new PMomentService(this.locale)).m(this.locale), 'day');
        }
        return result;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get nowButtonIsDisabled() {
        let now = null;
        if (!this.showTimeInput) {
            now = +(new PMomentService(this.locale)).m(this.now).startOf('day');
        }
        else {
            now = this.now;
        }
        const underMin = !!this.min && now < this.min;
        const overMax = !!this.max && now > this.max;
        return underMin || overMax;
    }
    /**
     * Wait for animation
     */
    waitForAnimation(callback) {
        this.zone.runOutsideAngular(() => {
            window.setTimeout(() => {
                this.zone.run(() => {
                    callback();
                });
            }, 600);
        });
    }
    animateSuccessButton() {
        this.clicked = true;
        this.waitForAnimation(() => {
            this.clicked = false;
        });
    }
    /**
     * Open a modal with datepicker or other input to edit the value
     */
    editDate(event) {
        this.startDate = null;
        this.initValues();
        this.modalRef = this.modalService.openModal(this.modalContent, {
            size: this.showTimeInput ? null : 'sm',
            centered: false,
            success: () => {
                event.target.blur();
                if ($('.modal.show').length) {
                    $('.modal.show').trigger('focus');
                }
            },
            /* BUG: fix shadowed value param */
            // eslint-disable-next-line @typescript-eslint/no-shadow
            dismiss: (event) => {
                switch (event) {
                    case 0:
                        // This happens then user clicks outside to close the modal.
                        break;
                    case 1:
                        // This happens when user hits escape key to close the modal.
                        break;
                    case undefined:
                        // This happens when user has modal open, and navigates via browser-nav-buttons
                        break;
                    default:
                        if (!!event.target) {
                            const target = event.target;
                            target === null || target === void 0 ? void 0 : target.blur();
                        }
                        else {
                            this.console.error(`Value »${event}« of event is unexpected.`);
                        }
                        break;
                }
                if ($('.modal.show').length) {
                    $('.modal.show').trigger('focus');
                }
            },
        });
    }
    /** Is this valid? [valid]="…" overwrites the valid state if the formControl. */
    get isValid() {
        return this.valid !== null ? this.valid : (!this.formControl || !this.formControl.invalid);
    }
    /**
     * This is the minimum code that is required for a custom control in Angular.
     * Its necessary to set this if you want to use [(ngModel)] AND [formControl] together.
     */
    get disabled() {
        return this._disabled || !this.canEdit;
    }
    set disabled(input) {
        this.setDisabledState(input);
        this._disabled = input;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get readMode() {
        if (this._readMode !== null)
            return this._readMode;
        return this.disabled;
    }
    ngAfterViewInit() {
    }
    /**
     * Is this a required field?
     * This can be set as Input() but if there is a formControl binding,
     * then it takes the info from the formControl’s validators.
     */
    get required() {
        if (this._required)
            return this._required;
        return this.formControlInitialRequired();
    }
    /** the value of this control */
    get value() { return this._value; }
    set value(value) {
        if (value === this._value)
            return;
        this._value = value;
        this.changeDetectorRef.markForCheck();
        this._onChange(value);
    }
    /** Write a new value to the element. */
    writeValue(value) {
        if (this._value === value)
            return;
        this._value = value;
        this.initValues();
        this.changeDetectorRef.detectChanges();
    }
    /**
     * Set the function to be called
     * when the control receives a change event.
     */
    /**
     * @see ControlValueAccessor['registerOnChange']
     *
     * Note that registerOnChange() only gets called if a formControl is bound.
     * @param fn Accepts a callback function which you can call when changes happen so that you can notify the outside world that
     * the data model has changed.
     * Note that you call it with the changed data model value.
     */
    registerOnChange(fn) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this._onChange = (value) => {
            fn(value);
        };
    }
    /** Set the function to be called when the control receives a touch event. */
    registerOnTouched(fn) { this.onTouched = fn; }
    /** setDisabledState */
    setDisabledState(isDisabled) {
        if (this._disabled === isDisabled)
            return;
        // Set internal attribute which gets used in the template.
        this._disabled = isDisabled;
        // Refresh the formControl. #two-way-binding
        if (this.formControl && this.formControl.disabled !== this.disabled) {
            this.disabled ? this.formControl.disable() : this.formControl.enable();
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get daysBeforeDropdownLabel() {
        if (this.daysBeforeLabel !== null)
            return this.daysBeforeLabel;
        if (!this.showDaysBeforeInput)
            return this.localize.transform('Datum');
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        const dayText = +this.formGroup.get('daysBefore').value === 1 ? this.localize.transform('Tag') : this.localize.transform('Tage');
        return this.localize.transform('${dayText} vor Schicht', { dayText: dayText });
    }
    ngOnDestroy() {
        if (this.modalRef)
            this.modalRef.dismiss();
        return super.ngOnDestroy();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get successButtonIsHighlighted() {
        return this.value !== this.selectedDateTime;
    }
    /** Filter all errors that should be shown in the ui. */
    get visibleErrors() {
        return this.pFormsService.visibleErrors(this.formControl);
    }
    /** Icon to le left of the input */
    get prependIcon() {
        if (!!this.icon)
            return this.icon;
        // TODO: Remove this, when all datepickers are bound to attributeInfo
        if (this.type === PInputDateTypes.birth)
            return PlanoFaIconPool.BIRTHDAY; // HACK: PLANO-151942 We dont want developers to set PInputDateTypes.birth from outside anymore.
        return !!this.value ? PlanoFaIconPool.STATE_DATE_PICKED : PlanoFaIconPool.STATE_DATE_EMPTY;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get hasDanger() {
        var _a;
        if (!!this.formControl && !this.formControl.touched)
            return false;
        if (!this.isValid)
            return true;
        const daysBeforeControl = (_a = this.formGroup) === null || _a === void 0 ? void 0 : _a.get('daysBefore');
        if (daysBeforeControl)
            return daysBeforeControl.invalid;
        return false;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "isLoading", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "showDaysBeforeInput", void 0);
__decorate([
    Input('class'),
    __metadata("design:type", String)
], PInputDateComponent.prototype, "_class", void 0);
__decorate([
    HostBinding('class'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], PInputDateComponent.prototype, "_classes", null);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "daysBefore", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], PInputDateComponent.prototype, "daysBeforeChange", void 0);
__decorate([
    ViewChild('modalContent', { static: true }),
    __metadata("design:type", typeof (_d = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _d : Object)
], PInputDateComponent.prototype, "modalContent", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "size", void 0);
__decorate([
    Input('min'),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "_min", void 0);
__decorate([
    Input('max'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], PInputDateComponent.prototype, "max", null);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "type", void 0);
__decorate([
    Input('showEraseValueBtn'),
    __metadata("design:type", Boolean)
], PInputDateComponent.prototype, "_showEraseValueBtn", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PInputDateComponent.prototype, "supportsUndefined", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "showNowButton", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "showTimeInput", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PInputDateComponent.prototype, "timeIsRequired", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "isExclusiveEnd", void 0);
__decorate([
    Input('placeholder'),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "_placeholder", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "label", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "range", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PInputDateComponent.prototype, "checkTouched", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "suggestionTimestamp", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "suggestionLabel", void 0);
__decorate([
    Input('locale'),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "_locale", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "pEditable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "api", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "valid", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "saveChangesHook", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "onSaveStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "onSaveSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "onDismiss", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "onLeaveCurrent", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "editMode", void 0);
__decorate([
    Input('disabled'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], PInputDateComponent.prototype, "disabled", null);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "formControl", void 0);
__decorate([
    Input('readMode'),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "_readMode", void 0);
__decorate([
    Input('required'),
    __metadata("design:type", Boolean)
], PInputDateComponent.prototype, "_required", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "daysBeforeLabel", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "eraseValueBtnLabel", void 0);
__decorate([
    Input('icon'),
    __metadata("design:type", Object)
], PInputDateComponent.prototype, "icon", void 0);
PInputDateComponent = PInputDateComponent_1 = __decorate([
    Component({
        selector: 'p-input-date',
        templateUrl: './p-input-date.component.html',
        styleUrls: ['./p-input-date.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PInputDateComponent_1),
                multi: true,
            },
        ],
    })
    /**
     * A component like datepicker, but a timestamp (type is DateTime) can be bound to it instead of any ngb formats
     */
    ,
    __metadata("design:paramtypes", [ModalService, typeof (_a = typeof NgZone !== "undefined" && NgZone) === "function" ? _a : Object, PFormsService,
        ValidatorsService,
        NgbFormatsService,
        LocalizePipe,
        PDatePipe, typeof (_b = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _b : Object, PInputDateService,
        LogService])
], PInputDateComponent);
export { PInputDateComponent };
//# sourceMappingURL=p-input-date.component.js.map