/* NOTE: Dont make this file even bigger. Invest some time to cleanup/split into several files */
/* eslint max-lines: ["error", 1300] */
var PInputComponent_1;
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
import { __decorate, __metadata } from "tslib";
import { DecimalPipe, NumberSymbol, getLocaleNumberSymbol, CurrencyPipe } from '@angular/common';
import { Component, HostBinding, ChangeDetectionStrategy, ViewChild, ContentChildren, ElementRef, Input, Output, EventEmitter, forwardRef, ChangeDetectorRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PCurrencyPipe } from '@plano/shared/core/pipe/p-currency.pipe';
import { AngularDatePipeFormat, PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PPossibleErrorNames } from '@plano/shared/core/validators.types';
import { PInputService } from './p-input.service';
import { IdBase } from '../../../../shared/api/base/id-base';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { ModalService } from '../../../../shared/core/p-modal/modal.service';
import { BootstrapRounded, BootstrapSize, PBtnThemeEnum } from '../../bootstrap-styles.enum';
import { PFormControlComponentBaseDirective } from '../../p-attribute-info/attribute-info-component-base';
import { PDropdownItemComponent } from '../p-dropdown/p-dropdown-item/p-dropdown-item.component';
import { PFormControl, PFormGroup } from '../p-form-control';
/**
 * `<p-input>` extends `<input>` with all the options for pEditables
 * @example
 * with PFormControl binding
 * 	<form [formGroup]="myFormGroup">
 * 		<p-input
 * 			[formControl]="myFormGroup.get('lastName')"
 * 		></p-input>
 * 	</form>
 * @example with model binding
 * 	<p-input
 * 		[(ngModel)]="member.lastName"
 * 	></p-input>
 * @example as editable
 * 	<form [formGroup]="myFormGroup">
 * 		<p-input
 * 			[pEditable]="!member.isNewItem()"
 * 			[api]="api"
 *
 * 			[formControl]="myFormGroup.get('lastName')"
 * 			placeholder="Plano" i18n-placeholder
 * 		></p-input>
 * 	</form>
 */
let PInputComponent = PInputComponent_1 = class PInputComponent extends PFormControlComponentBaseDirective {
    constructor(console, decimalPipe, localize, pCurrencyPipe, changeDetectorRef, pInputService, pMoment, pDatePipe, currencyPipe, pFormsService, validators, modalService) {
        super(false, changeDetectorRef, pFormsService, console);
        this.console = console;
        this.decimalPipe = decimalPipe;
        this.localize = localize;
        this.pCurrencyPipe = pCurrencyPipe;
        this.changeDetectorRef = changeDetectorRef;
        this.pInputService = pInputService;
        this.pMoment = pMoment;
        this.pDatePipe = pDatePipe;
        this.currencyPipe = currencyPipe;
        this.pFormsService = pFormsService;
        this.validators = validators;
        this.modalService = modalService;
        this._readMode = null;
        this.formGroup = null;
        this.dropdownItems = null;
        this.dropdownValueChange = new EventEmitter();
        /**
         * See HTML autocomplete
         * https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
         */
        this.autocomplete = 'off';
        /**
         * The text that should be shown if there is no value yet.
         * Usually used for example input.
         */
        this._placeholder = null;
        /**
         * Overwrite the type that is read from apiAttributeInfo.primitiveType.
         * @example <p-input [type]="PApiPrimitiveTypes.Email">
         * @example <p-input [type]="PApiPrimitiveTypes.Currency">
         */
        this.type = PApiPrimitiveTypes.string;
        this._durationUIType = null;
        this.durationUITypeChange = new EventEmitter();
        /**
         * If type is set to 'Currency', you can set the currency for another country here.
         * If undefined, a global currency code based on the locale (Config.CURRENCY_CODE) will be used.
         * @example <p-input [type]="PApiPrimitiveTypes.Currency" currencyCode="CZK">
         */
        this.currencyCode = null;
        /* type date */
        this.min = null;
        this.max = null;
        this.textAlign = null;
        this._inputGroupAppendText = null;
        this.inputGroupAppendIcon = null;
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.focusout = new EventEmitter();
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.focus = new EventEmitter();
        this._locale = null;
        /**
         * An array with suggested values. Suggested values show up when user starts to type.
         */
        this.typeahead = [];
        this.readonly = false;
        /**
         * Write 10.000.000 instead of 10000000 into input when model is 10000000
         * @default true
         */
        this.useSeparatorForThousands = true;
        /**
         * Should the password strength meter be visible?
         * Only use this if type is Password.
         */
        this._showPasswordMeter = null;
        // These are necessary Inputs and Outputs for pEditable form element
        this.pEditable = false;
        this.api = null;
        this.valid = null;
        this.onSaveStart = new EventEmitter();
        this.onSaveSuccess = new EventEmitter();
        this.onDismiss = new EventEmitter();
        this.onLeaveCurrent = new EventEmitter();
        this.editMode = new EventEmitter(undefined);
        this.checkTouched = false;
        this.theme = null;
        /**
         * Set this to true if you want the component to return a `undefined` to the api when user clears the input.
         * This e.g. gets used when the input has a dropdown with a `null` option and the form control has a notUndefined()
         * validator.
         * If the user chose a non-null option in the dropdown but did not set any value in the input, component returns
         * `undefined` and user gets prompted that value is required.
         */
        this.supportsUndefined = null;
        this.BootstrapSize = BootstrapSize;
        this.PApiPrimitiveTypes = PApiPrimitiveTypes;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.PBtnThemeEnum = PBtnThemeEnum;
        this.BootstrapRounded = BootstrapRounded;
        /**
         * How many digits are allowed?
         * This obviously only makes sense on number-inputs.
         */
        this.maxDecimalPlacesCount = null;
        this.valueChangesSubscriber = null;
        this.statusChangesSubscriber = null;
        this._hidePassword = true;
        this.hidePasswordInput = null;
        this._disabled = false;
        this.formControl = null;
        this._required = null;
        /** This always stores the user input, no matter if the type is correct or content is valid */
        this._value = null;
        this._onChange = () => { };
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.keyup = new EventEmitter();
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.blur = new EventEmitter();
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.change = new EventEmitter();
        /** onTouched */
        this.onTouched = () => { };
        /** Filter all errors that should be shown in the ui. */
        this.visibleErrors = null;
        this.hasFocus = null;
    }
    /**
     * Duration would not be a user-friendly type. It’s stored in Milliseconds.
     * If you use this component for a PrimitiveType Duration it is required to set a `durationUIType`.
     * You can set it to a specific unit, or you can set it to null.
     * If you set it to null, a dropdown with some units will be shown.
     */
    get durationUIType() {
        return this._durationUIType;
    }
    set durationUIType(input) {
        if (input === this._durationUIType)
            return;
        this._durationUIType = input;
        if (input === null) {
            this._value = null;
        }
        this._onChange(this.value);
        this.durationUITypeChange.emit(input);
        this.changeDetectorRef.markForCheck();
    }
    /** Is this valid? [valid]="…" overwrites the valid state if the formControl. */
    get isValid() {
        return this.valid !== null ? this.valid : (!this.formControl || !this.formControl.invalid);
    }
    /**
     * Take the internal type from PApiPrimitiveTypes and get a proper html input type
     * See https://developer.mozilla.org/de/docs/Web/HTML/Element/Input#arten_des_%3Cinput%3E-elements
     */
    get inputType() {
        if (this.type === PApiPrimitiveTypes.number)
            return PApiPrimitiveTypes.string;
        if (this.type === PApiPrimitiveTypes.Password || this.type === 'ConfirmPassword') {
            return this.hidePassword ? PApiPrimitiveTypes.Password : PApiPrimitiveTypes.string;
        }
        return this.type;
    }
    get locale() {
        return this._locale !== null ? this._locale : Config.LOCALE_ID;
    }
    /**
     * Run input-type based validations.
     * These validations validate against the value of this input, not the transformed value, that gets returned to the
     * bound model / to the api.
     *
     * Why we need this: A Integer-Validator (no digits allowed) makes no sense on a Duration. Because the duration
     * gets stored as milliseconds. But it can make sense, to validate that the "Minutes" that are visible in the UI do
     * not have digits.
     */
    validate(_control) {
        if (!!this.attributeInfo)
            return null;
        return this.validateInternalValue();
    }
    validateInternalValue() {
        if (!this.value)
            return null;
        const VALUE = typeof this.value === 'string' && this.type !== PApiPrimitiveTypes.Password && this.type !== 'ConfirmPassword' ? this.value.trim() : this.value;
        const CONTROL = { value: VALUE };
        switch (this.type) {
            case PApiPrimitiveTypes.Search:
            case PApiPrimitiveTypes.string:
                return null;
            case PApiPrimitiveTypes.Url:
                // TODO: Obsolete?
                return this.validators.url().fn(CONTROL);
            case 'Domain':
                return this.validators.domain().fn(CONTROL);
            case PApiPrimitiveTypes.Iban:
                // TODO: Obsolete?
                // cSpell:ignore iban
                return this.validators.iban().fn(CONTROL);
            case PApiPrimitiveTypes.Bic:
                // TODO: Obsolete?
                return this.validators.bic().fn(CONTROL);
            case PApiPrimitiveTypes.PostalCode:
                // TODO: Obsolete?
                return this.validators.plz().fn(CONTROL);
            case PApiPrimitiveTypes.LocalTime:
                return this.pInputService.validateLocaleAwareTime(CONTROL);
            case PApiPrimitiveTypes.Minutes:
            case PApiPrimitiveTypes.Hours:
            case PApiPrimitiveTypes.Days:
            case PApiPrimitiveTypes.Months:
            case PApiPrimitiveTypes.Years:
            case PApiPrimitiveTypes.Percent:
                const MIN_ERRORS = this.pInputService.min(0, CONTROL, this.locale);
                if (MIN_ERRORS)
                    return MIN_ERRORS;
                const FLOAT_ERRORS2 = this.pInputService.validateLocaleAwareFloat(CONTROL, this.locale);
                if (FLOAT_ERRORS2)
                    return FLOAT_ERRORS2;
                // TODO: Obsolete?
                return this.pInputService.integer(this.type, this.locale)(CONTROL);
            case PApiPrimitiveTypes.number:
                return this.pInputService.validateLocaleAwareFloat(CONTROL, this.locale);
            case PApiPrimitiveTypes.Currency:
                return this.pInputService.validateLocaleAwareCurrency(CONTROL, this.locale, this.currencyCode);
            case PApiPrimitiveTypes.Tel:
                // TODO: Obsolete?
                return this.validators.phone().fn(CONTROL);
            case PApiPrimitiveTypes.Email:
                // TODO: Obsolete?
                return this.validators.email().fn(CONTROL);
            case 'ConfirmPassword':
                return null;
            case PApiPrimitiveTypes.Password:
                // TODO: Obsolete?
                return this.validators.password().fn(CONTROL);
            case PApiPrimitiveTypes.Duration:
                const FLOAT_ERRORS = this.pInputService.validateLocaleAwareFloat(CONTROL, this.locale);
                if (FLOAT_ERRORS)
                    return FLOAT_ERRORS;
                const DURATION_MIN_ERRORS = this.pInputService.min(0, CONTROL, this.locale);
                if (DURATION_MIN_ERRORS)
                    return DURATION_MIN_ERRORS;
                if (this.maxDecimalPlacesCount !== null) {
                    const DIGITS_ERRORS = this.pInputService.maxDecimalPlacesCount(this.maxDecimalPlacesCount, CONTROL, this.locale);
                    if (DIGITS_ERRORS)
                        return DIGITS_ERRORS;
                }
                return null;
            case PApiPrimitiveTypes.Integer:
                // TODO: Obsolete?
                return this.pInputService.integer(this.type, this.locale)(CONTROL);
            default:
                return this.type;
        }
    }
    addComponentValidatorsToFormControl() {
        if (!this.formControl)
            return;
        this.formControl.componentValidators = () => {
            return this.validateInternalValue();
        };
    }
    ngAfterContentInit() {
        this.initDurationValues();
        if (this.maxDecimalPlacesCount !== null && this.type !== PApiPrimitiveTypes.Duration)
            this.console.error('Not implemented yet');
        this.addComponentValidatorsToFormControl();
        return super.ngAfterContentInit();
    }
    ngOnInit() {
        this.validateValues();
        this.initValues();
        return super.ngOnInit();
    }
    /**
     * Set values that are necessary for this function.
     * These initValues methods are used in many components.
     * They mostly get used for class attributes that would cause performance issues as a getter.
     */
    initValues() {
        this.setValidationErrorsListener();
    }
    refreshVisibleErrors() {
        if (!this.formControl)
            return null;
        const ERRORS = this.pFormsService.visibleErrors(this.formControl);
        // eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
        if (!ERRORS)
            return null;
        this.visibleErrors = ERRORS.filter(error => {
            if (!this._showPasswordMeter)
                return true;
            switch (error.key) {
                case PPossibleErrorNames.MIN_LENGTH:
                case PPossibleErrorNames.LETTERS_REQUIRED:
                case PPossibleErrorNames.NUMBERS_REQUIRED:
                case PPossibleErrorNames.UPPERCASE_REQUIRED:
                case PPossibleErrorNames.PASSWORD:
                    return false;
                default:
                    return true;
            }
        });
    }
    /**
     * Fixes PLANO-79961
     */
    setValidationErrorsListener() {
        if (!this.formControl)
            return;
        this.valueChangesSubscriber = this.formControl.valueChanges.subscribe((_newValue) => {
            this.refreshVisibleErrors();
        });
        this.statusChangesSubscriber = this.formControl.statusChanges.subscribe((_newValue) => {
            this.refreshVisibleErrors();
        });
    }
    ngOnDestroy() {
        var _a, _b;
        (_a = this.valueChangesSubscriber) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        (_b = this.statusChangesSubscriber) === null || _b === void 0 ? void 0 : _b.unsubscribe();
        return super.ngOnDestroy();
    }
    /**
     * Set an initial durationUiType if needed
     */
    initDurationValues() {
        // Nothing to do if this is something else than duration
        if (this.type !== PApiPrimitiveTypes.Duration)
            return;
        // Nothing to do if there is a valid durationUiType already set
        if (this.durationUIType !== null)
            return;
        // TODO: [PLANO-79667] had to re-add the old behaviour but should not be necessary. Read NOTE below
        this._durationUIType = PApiPrimitiveTypes.Minutes;
        // NOTE: Back in the days we set the initial value to Minutes. Now we simply have made durationUIType a required attribute
        // for Duration inputs.
    }
    validateValues() {
        if (this._showPasswordMeter && this.type !== PApiPrimitiveTypes.Password && this.type !== 'ConfirmPassword') {
            throw new Error('showPasswordMeter can only be true if type is password.');
        }
    }
    /**
     * Happens when user selects a typeahead item from the typeahead-dropdown
     */
    typeaheadOnSelect(input, pEditableTriggerFocussableRef) {
        this.value = input.value;
        $(pEditableTriggerFocussableRef).trigger('enter');
    }
    timeToTimestamp(input) {
        if (!input)
            return null;
        if (typeof input === 'number')
            return input;
        const MOMENT = this.pMoment.d(input).asMilliseconds();
        return +MOMENT;
    }
    turnLocaleFormattedNumberToFloat(input) {
        const SEPARATOR = getLocaleNumberSymbol(this.locale, NumberSymbol.Decimal);
        switch (SEPARATOR) {
            case ',':
                const convertedString = input.replace(/\./g, '').replace(/,/g, '.');
                return +convertedString;
            case '.':
                return +input;
            default:
                throw new Error('NumberFormat not supported');
        }
    }
    localeStringToNumber(input) {
        if (!input)
            return undefined;
        if (typeof input === 'number')
            return input;
        if (input instanceof IdBase) {
            this.console.warn('Id in p-input? This must be a mistake, right?');
            return input;
        }
        let regex = null;
        switch (this.type) {
            case PApiPrimitiveTypes.Minutes:
            case PApiPrimitiveTypes.Hours:
            case PApiPrimitiveTypes.Days:
            case PApiPrimitiveTypes.Years:
            case PApiPrimitiveTypes.number:
            case PApiPrimitiveTypes.Integer:
            case PApiPrimitiveTypes.Duration:
            case PApiPrimitiveTypes.Percent:
                regex = this.pInputService.localeAwareFloatRegEx(this.locale);
                break;
            case PApiPrimitiveTypes.Currency:
                regex = PInputService.localeAwareFloatWithTwoDigitsAfterSeparatorRegEx(this.locale);
                break;
            default:
            // throw 'error';
        }
        if (!regex || !input.toString().match(regex))
            return input;
        const result = this.turnLocaleFormattedNumberToFloat(input);
        // eslint-disable-next-line unicorn/prefer-number-properties
        return isNaN(result) ? input : result;
    }
    /**
     * Get a proper placeholder for the provided value type
     */
    get placeholder() {
        if (this.disabled === true)
            return undefined;
        if (this._placeholder !== null)
            return this._placeholder;
        switch (this.type) {
            case PApiPrimitiveTypes.LocalTime:
                return this.localize.transform('z.B. »${example1}«', {
                    example1: this.pDatePipe.transform(86340000, AngularDatePipeFormat.SHORT_TIME),
                });
            case PApiPrimitiveTypes.Search:
                return this.localize.transform('Suche…');
            case PApiPrimitiveTypes.Currency:
                return this.localize.transform('z.B. »${example1}«', {
                    example1: this.currencyPipe.transform(10.5, Config.CURRENCY_CODE, '').trim(),
                });
            case PApiPrimitiveTypes.Hours:
                return this.localize.transform('z.B. »${example1}« oder »${example2}«', {
                    example1: this.decimalPipe.transform(1),
                    example2: this.decimalPipe.transform(2.5),
                });
            case PApiPrimitiveTypes.Minutes:
            case PApiPrimitiveTypes.Percent:
                return this.localize.transform('z.B. »${example1}«', {
                    example1: this.decimalPipe.transform(10),
                });
            case PApiPrimitiveTypes.Days:
                return this.localize.transform('z.B. »${example1}«', {
                    example1: this.decimalPipe.transform(3),
                });
            case PApiPrimitiveTypes.Tel:
                return this.localize.transform('z.B. »+49 123 0000000«');
            case PApiPrimitiveTypes.Url:
                return 'http://';
            default:
                return '';
        }
    }
    /**
     * Get a proper icon for the provided value type
     */
    get inputGroupPrependIcon() {
        var _a;
        if (this.inputGroupAppendIcon !== null)
            return this.inputGroupAppendIcon;
        switch (this.type) {
            case PApiPrimitiveTypes.Currency:
                return this.pCurrencyPipe.getCurrencyIcon(this.currencyCode);
            case PApiPrimitiveTypes.LocalTime:
                return PlanoFaIconPool.CLOCK;
            case PApiPrimitiveTypes.Minutes:
            case PApiPrimitiveTypes.Hours:
            case PApiPrimitiveTypes.Duration:
                return 'stopwatch';
            case PApiPrimitiveTypes.Months:
                return 'calendar';
            case PApiPrimitiveTypes.Days:
                return PlanoFaIconPool.CALENDAR_DAY;
            case PApiPrimitiveTypes.Years:
                return 'calendar';
            case PApiPrimitiveTypes.Percent:
                return 'percent';
            case PApiPrimitiveTypes.Search:
                return PlanoFaIconPool.SEARCH;
            case PApiPrimitiveTypes.Url:
            case 'Domain':
                return PlanoFaIconPool.BRAND_INTERNET_EXPLORER;
            case PApiPrimitiveTypes.Email:
                if ((_a = this.formControl) === null || _a === void 0 ? void 0 : _a.pending) {
                    return PlanoFaIconPool.SYNCING;
                }
                return 'at';
            case PApiPrimitiveTypes.Tel:
                return 'phone';
            case PApiPrimitiveTypes.Password:
            case 'ConfirmPassword':
                return 'key';
            case PApiPrimitiveTypes.PostalCode:
            case PApiPrimitiveTypes.number:
            case PApiPrimitiveTypes.string:
            case PApiPrimitiveTypes.Integer:
            case PApiPrimitiveTypes.Iban:
            case PApiPrimitiveTypes.Bic:
                return null;
            default:
                return this.type;
        }
    }
    set setHidePasswordInput(input) {
        this.hidePasswordInput = input;
    }
    /**
     * Passwords are hidden by default. Prevent that some other person in the room sees the user’s password.
     */
    get hidePassword() {
        if (this.hidePasswordInput !== null)
            return this.hidePasswordInput;
        return this._hidePassword;
    }
    set hidePassword(input) {
        this._hidePassword = input;
    }
    /**
     * A Text that will be appended to the input
     * Can be used to write the name of the unit.
     * Gets set automatically if this is some kind of Duration input.
     */
    get inputGroupAppendText() {
        var _a;
        // TODO: 	Milad and Nils think that this should be something like `if (this._inputGroupAppendText === undefined) …`
        // 				It should be possible to set it to `null` to remove the append text from UI.
        if (!!this._inputGroupAppendText)
            return this._inputGroupAppendText;
        if (!!((_a = this.dropdownItems) === null || _a === void 0 ? void 0 : _a.length))
            return null;
        const getText = (type) => {
            switch (type) {
                case PApiPrimitiveTypes.Minutes:
                    return this.localize.transform('Minuten');
                case PApiPrimitiveTypes.Hours:
                    return this.localize.transform('Stunden');
                case PApiPrimitiveTypes.Days:
                    return this.localize.transform('Tage');
                case PApiPrimitiveTypes.Months:
                    return this.localize.transform('Monate');
                case PApiPrimitiveTypes.Years:
                    return this.localize.transform('Jahre');
                case null:
                default:
                    return null;
            }
        };
        const UI_TYPE = this.type !== PApiPrimitiveTypes.Duration ? this.type : this.durationUIType;
        return getText(UI_TYPE);
    }
    ngAfterViewInit() {
    }
    // eslint-disable-next-line sonarjs/cognitive-complexity
    transformUiValueIntoModelValue(value) {
        const VALUE = typeof value === 'string' ? value.trim() : value;
        const valueAsFloat = this.localeStringToNumber(VALUE);
        // Check the description of `supportsUndefined`
        // If supportsUndefined is true, we want to return undefined in order to trigger the 'notUndefined()' validator.
        if (this.supportsUndefined &&
            (VALUE === '' || Number.isNaN(valueAsFloat)))
            return null;
        switch (this.type) {
            case PApiPrimitiveTypes.LocalTime:
                if (VALUE === '')
                    return null;
                return this.timeToTimestamp(value);
            case PApiPrimitiveTypes.number:
            case PApiPrimitiveTypes.Currency:
            case PApiPrimitiveTypes.Integer:
                if (VALUE === '')
                    return null;
                // We check isNaN(valueAsFloat) instead of Number.isNaN(+value), because value can be '1,5'.
                // ..so it can have a german comma-separator.
                // eslint-disable-next-line unicorn/prefer-number-properties
                if (isNaN(valueAsFloat))
                    return value;
                // eslint-disable-next-line sonarjs/no-collapsible-if
                if (!(this.formControl instanceof PFormControl)) {
                    // not necessary anymore. attributeInfo should include the necessary validators.
                    // I will leave this here in order to have the least possible change in ui.
                    if (valueAsFloat < 0)
                        return null;
                }
                return valueAsFloat;
            case PApiPrimitiveTypes.Minutes:
            case PApiPrimitiveTypes.Hours:
            case PApiPrimitiveTypes.Days:
            case PApiPrimitiveTypes.Years:
            case PApiPrimitiveTypes.Months:
                if (VALUE === '')
                    return null;
                // Api does not allow values other than nullish value or number
                // eslint-disable-next-line unicorn/prefer-number-properties
                if (isNaN(valueAsFloat))
                    return null;
                // A Days is expected to be greater equal nullish value.
                if (valueAsFloat < 0)
                    return null;
                return valueAsFloat;
            case PApiPrimitiveTypes.Percent:
                // eslint-disable-next-line unicorn/prefer-number-properties
                if (VALUE === '' || isNaN(valueAsFloat) || valueAsFloat < 0)
                    return null;
                // Api saves percent in range [0, 1] but we visualize it as [0, 100].
                return valueAsFloat / 100;
            case PApiPrimitiveTypes.Duration:
                if (VALUE === '')
                    return null;
                // Api does not allow values other than nullish value or number
                // eslint-disable-next-line unicorn/prefer-number-properties
                if (isNaN(valueAsFloat))
                    return null;
                if (valueAsFloat < 0)
                    return null;
                return this.toDuration(valueAsFloat);
            case PApiPrimitiveTypes.string:
            case PApiPrimitiveTypes.Tel:
            case PApiPrimitiveTypes.Email:
            case PApiPrimitiveTypes.Password:
            case 'ConfirmPassword':
            case PApiPrimitiveTypes.PostalCode:
            case PApiPrimitiveTypes.Search:
            case PApiPrimitiveTypes.Url:
            case PApiPrimitiveTypes.Iban:
            case PApiPrimitiveTypes.Bic:
                return value;
            default:
                return this.type;
        }
    }
    // eslint-disable-next-line sonarjs/cognitive-complexity
    transformModelValueIntoUiValue(valueInput) {
        var _a;
        let value;
        switch (this.type) {
            case PApiPrimitiveTypes.Minutes:
            case PApiPrimitiveTypes.Hours:
            case PApiPrimitiveTypes.Days:
            case PApiPrimitiveTypes.Months:
            case PApiPrimitiveTypes.Years:
                // eslint-disable-next-line sonarjs/no-nested-switch, sonarjs/no-small-switch
                switch (valueInput) {
                    case null:
                        value = null;
                        break;
                    default:
                        value = this.pInputService.turnNumberIntoLocaleNumber(this.locale, valueInput);
                        break;
                }
                break;
            case PApiPrimitiveTypes.Percent:
                // eslint-disable-next-line sonarjs/no-nested-switch, sonarjs/no-small-switch
                switch (valueInput) {
                    case null:
                        value = null;
                        break;
                    default:
                        value = this.pInputService.turnNumberIntoLocaleNumber(this.locale, valueInput * 100);
                        break;
                }
                break;
            case PApiPrimitiveTypes.LocalTime:
                // eslint-disable-next-line sonarjs/no-nested-switch, sonarjs/no-small-switch
                switch (valueInput) {
                    case null:
                        value = null;
                        break;
                    default:
                        // FIXME: PLANO-33048
                        // NOTE: Wenn ich das hier auf pDatePipe umschalte, schlägt die interne Validierung fehl weil die
                        // noch auf HH:mm prüft.
                        // value = this.pDatePipe.transform(valueInput, DateFormat.shortTime);
                        value = this.pMoment.d(valueInput).format('HH:mm');
                }
                break;
            case PApiPrimitiveTypes.Duration:
                // eslint-disable-next-line sonarjs/no-nested-switch
                switch (this.durationUIType) {
                    case PApiPrimitiveTypes.Minutes:
                    case null:
                        value = this.timestampToMinutes(valueInput);
                        value = this.decimalPipe.transform(value, undefined, this.locale);
                        break;
                    case PApiPrimitiveTypes.Hours:
                        value = this.timestampToHours(valueInput);
                        value = this.decimalPipe.transform(value, undefined, this.locale);
                        break;
                    case PApiPrimitiveTypes.Days:
                        value = this.timestampToDays(valueInput);
                        value = this.decimalPipe.transform(value, undefined, this.locale);
                        break;
                    default:
                        throw new Error('If type of p-input is Duration, then [durationUIType] is required.');
                }
                break;
            case PApiPrimitiveTypes.Currency:
                let result = null;
                if (!!valueInput && Number.isNaN(+valueInput)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    value = valueInput;
                    break;
                }
                /* BUG: fix shadowed value param */
                // eslint-disable-next-line @typescript-eslint/no-shadow
                const countDecimals = (value) => {
                    if (Math.floor(value) !== value) {
                        const charsAfterSeparator = value.toString().split('.')[1];
                        if (!charsAfterSeparator)
                            return 0;
                        return charsAfterSeparator.length || 0;
                    }
                    return 0;
                };
                if (countDecimals(valueInput !== null ? +valueInput : 0) > 2) {
                    assumeDefinedToGetStrictNullChecksRunning(this.locale, 'this.locale');
                    result = this.decimalPipe.transform(valueInput, (_a = this.currencyCode) !== null && _a !== void 0 ? _a : undefined, this.locale);
                }
                else {
                    result = this.pCurrencyPipe.transform(valueInput, this.currencyCode, '', undefined, this.locale, true);
                }
                if (result)
                    result = result.trim();
                value = result !== null && result !== void 0 ? result : null;
                break;
            case PApiPrimitiveTypes.Integer:
            case PApiPrimitiveTypes.number:
                if (this.useSeparatorForThousands) {
                    value = this.decimalPipe.transform(valueInput, undefined, this.locale);
                }
                else {
                    value = valueInput;
                }
                break;
            default:
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                value = valueInput;
        }
        return value;
    }
    toDuration(value) {
        switch (this.durationUIType) {
            case PApiPrimitiveTypes.Minutes:
                return this.minutesToDuration(value);
            case PApiPrimitiveTypes.Hours:
                return this.hoursToDuration(value);
            case PApiPrimitiveTypes.Days:
                return this.daysToDuration(value);
            default:
                this.console.error(`type »${this.durationUIType}« unexpected`);
                return value;
        }
    }
    timestampToMinutes(timestamp = null) {
        // TODO: Can probably be replaced by return PMomentService.d(timestamp).asMinutes();
        if (timestamp === null)
            return null;
        return Math.round((timestamp / 60 / 1000) * 100) / 100;
    }
    timestampToHours(timestamp = null) {
        // TODO: Can probably be replaced by return PMomentService.d(timestamp).asHours();
        if (timestamp === null)
            return null;
        return Math.round((timestamp / 60 / 60 / 1000) * 100) / 100;
    }
    timestampToDays(timestamp = null) {
        // TODO: Can probably be replaced by return PMomentService.d(timestamp).asDays();
        if (timestamp === null)
            return null;
        return Math.round((timestamp / 24 / 60 / 60 / 1000) * 100) / 100;
    }
    timestampToDuration(timestamp = null) {
        if (timestamp === null)
            return null;
        return timestamp;
    }
    minutesToDuration(input = null) {
        if (input === null)
            return null;
        return input * 1000 * 60;
    }
    hoursToDuration(input = null) {
        if (input === null)
            return null;
        return input * 1000 * 60 * 60;
    }
    daysToDuration(input = null) {
        if (input === null)
            return null;
        return input * 1000 * 60 * 60 * 24;
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
    /**
     * Is the input in only read mode or is editable (default)?
     */
    get readMode() {
        if (this._readMode !== null)
            return this._readMode;
        if (this.formControl instanceof PFormControl && this.formControl.isReadMode !== undefined)
            return this.formControl.isReadMode;
        return this.disabled;
    }
    /**
     * Is this a required field?
     * This can be set as Input() but if there is a formControl binding,
     * then it takes the info from the formControl’s validators.
     */
    get required() {
        if (this._required !== null)
            return this._required;
        return this.formControlInitialRequired();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onKeyDown(_event) {
        // if ((this.type === PApiPrimitiveTypes.Password || this.type === 'ConfirmPassword') && this.hidePassword && event.keyCode === 8) this.value = '';
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onKeyUp(event) {
        var _a;
        // eslint-disable-next-line sonarjs/no-small-switch
        switch (event.key) {
            case 'Escape':
                if (this.type === PApiPrimitiveTypes.Search) {
                    event.stopPropagation();
                    this.clearValue();
                    event.target.value = '';
                    (_a = this.inputEl) === null || _a === void 0 ? void 0 : _a.nativeElement.blur();
                }
                break;
            default:
                break;
        }
        const newValue = event.target.value;
        if (this._value !== newValue)
            this._onChange(newValue);
        this.keyup.emit(event);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onBlur() {
        this.onTouched();
        this.blur.emit();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/no-explicit-any */
    onChange(event) {
        const newValue = event.target.value;
        if (this._value === newValue)
            return;
        this._onChange(event.target.value);
        this.change.emit(event);
    }
    /** the value of this control that is visible to the user */
    get value() { return this._value; }
    /** the value of this control that is visible to the user */
    set value(value) {
        if (this._value === value)
            return;
        this._value = value;
        this.changeDetectorRef.markForCheck();
        this._onChange(value);
    }
    /**
     * Write a new value to the element.
     * This happens when the model that is bound to this component changes.
     */
    writeValue(valueInput) {
        const newValue = this.transformModelValueIntoUiValue(valueInput);
        if (newValue === null && this.supportsUndefined)
            return;
        if (this._value === newValue)
            return;
        this._value = newValue;
        this.changeDetectorRef.detectChanges();
    }
    /**
     * Set the function to be called when the control receives a change event.
     * registerOnChange() only gets called if a formControl is bound
     */
    registerOnChange(fn) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this._onChange = (value) => {
            const newValue = this.transformUiValueIntoModelValue(value);
            fn(newValue);
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
    get successBtnIcon() {
        if (this.isPending)
            return PlanoFaIconPool.SYNCING;
        return PlanoFaIconPool.SUCCESS;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get successBtnIconSpin() {
        if (this.successBtnIcon === PlanoFaIconPool.SYNCING)
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get inputGroupPrependIconSpin() {
        if (this.inputGroupPrependIcon === PlanoFaIconPool.SYNCING)
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isPending() {
        var _a;
        if ((_a = this.formControl) === null || _a === void 0 ? void 0 : _a.pending)
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get hasDanger() {
        return (!this.formControl || this.formControl.touched) && !this.isValid && !this.isPending;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get hasWarning() {
        return !!this.formControl && this.isPending;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showPasswordMeter() {
        if (!this._showPasswordMeter)
            return false;
        if (this.formControl) {
            if (this.hasFocus)
                return true;
            return this.formControl.touched && this.formControl.invalid;
        }
        return true;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get readModeValue() {
        if (!this.value)
            return ' ';
        if (this.type === PApiPrimitiveTypes.Password || this.type === 'ConfirmPassword') {
            let result = '';
            for (const _ITEM of this.value.toString())
                result += '•';
            return result;
        }
        return this.value;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showPasswordVisibilityToggleButton() {
        if (this.type !== PApiPrimitiveTypes.Password && this.type !== 'ConfirmPassword')
            return false;
        if (this.hidePasswordInput !== null)
            return false;
        if (this.readMode || this.disabled)
            return false;
        return true;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onFocusOut(event) {
        this.hasFocus = false;
        this.focusout.emit(event);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onFocus(event) {
        this.hasFocus = true;
        this.focus.emit(event);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    clearValue() {
        this.value = '';
    }
    /**
     * Set focus in input when prepend icon is clicked
     */
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents, jsdoc/require-jsdoc */
    onClickPrependIcon(input) {
        if (this.disabled)
            return;
        input === null || input === void 0 ? void 0 : input.nativeElement.focus();
    }
    /**
     * Open a Modal like info-circle does it when in IS_MOBILE mode.
     */
    openCannotEditHint() {
        assumeDefinedToGetStrictNullChecksRunning(this.cannotEditHint, 'this.cannotEditHint');
        this.modalService.openCannotEditHintModal(this.cannotEditHint);
    }
    /**
     * Handle dropdown click
     */
    onDropdownClick(dropdownItem, event) {
        dropdownItem.onClick.emit(event);
    }
};
__decorate([
    Input('readMode'),
    __metadata("design:type", Object)
], PInputComponent.prototype, "_readMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputComponent.prototype, "formGroup", void 0);
__decorate([
    ViewChild('inputEl', { static: false }),
    __metadata("design:type", typeof (_d = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _d : Object)
], PInputComponent.prototype, "inputEl", void 0);
__decorate([
    ContentChildren(PDropdownItemComponent),
    __metadata("design:type", Object)
], PInputComponent.prototype, "dropdownItems", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputComponent.prototype, "dropdownValue", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputComponent.prototype, "dropdownValueChange", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], PInputComponent.prototype, "autocomplete", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputComponent.prototype, "size", void 0);
__decorate([
    Input('placeholder'),
    __metadata("design:type", Object)
], PInputComponent.prototype, "_placeholder", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], PInputComponent.prototype, "type", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], PInputComponent.prototype, "durationUIType", null);
__decorate([
    Output(),
    __metadata("design:type", typeof (_f = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _f : Object)
], PInputComponent.prototype, "durationUITypeChange", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputComponent.prototype, "currencyCode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputComponent.prototype, "min", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputComponent.prototype, "max", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputComponent.prototype, "textAlign", void 0);
__decorate([
    Input('inputGroupAppendText'),
    __metadata("design:type", Object)
], PInputComponent.prototype, "_inputGroupAppendText", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputComponent.prototype, "inputGroupAppendIcon", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_g = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _g : Object)
], PInputComponent.prototype, "focusout", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_h = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _h : Object)
], PInputComponent.prototype, "focus", void 0);
__decorate([
    Input('locale'),
    __metadata("design:type", Object)
], PInputComponent.prototype, "_locale", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], PInputComponent.prototype, "typeahead", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PInputComponent.prototype, "readonly", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputComponent.prototype, "useSeparatorForThousands", void 0);
__decorate([
    Input('showPasswordMeter'),
    __metadata("design:type", Object)
], PInputComponent.prototype, "_showPasswordMeter", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputComponent.prototype, "pEditable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputComponent.prototype, "api", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputComponent.prototype, "valid", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputComponent.prototype, "saveChangesHook", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputComponent.prototype, "onSaveStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputComponent.prototype, "onSaveSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputComponent.prototype, "onDismiss", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputComponent.prototype, "onLeaveCurrent", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PInputComponent.prototype, "editMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PInputComponent.prototype, "checkTouched", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputComponent.prototype, "theme", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputComponent.prototype, "supportsUndefined", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputComponent.prototype, "maxDecimalPlacesCount", void 0);
__decorate([
    Input('hidePassword'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], PInputComponent.prototype, "setHidePasswordInput", null);
__decorate([
    Input('disabled'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], PInputComponent.prototype, "disabled", null);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputComponent.prototype, "formControl", void 0);
__decorate([
    Input(),
    __metadata("design:type", PFormGroup)
], PInputComponent.prototype, "group", void 0);
__decorate([
    Input('required'),
    __metadata("design:type", Object)
], PInputComponent.prototype, "_required", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_j = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _j : Object)
], PInputComponent.prototype, "keyup", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_k = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _k : Object)
], PInputComponent.prototype, "blur", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_l = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _l : Object)
], PInputComponent.prototype, "change", void 0);
PInputComponent = PInputComponent_1 = __decorate([
    Component({
        selector: 'p-input',
        templateUrl: './p-input.component.html',
        styleUrls: ['./p-input.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PInputComponent_1),
                multi: true,
            },
            {
                provide: NG_VALIDATORS,
                useExisting: PInputComponent_1,
                multi: true,
            },
        ],
    }),
    __metadata("design:paramtypes", [LogService, typeof (_a = typeof DecimalPipe !== "undefined" && DecimalPipe) === "function" ? _a : Object, LocalizePipe,
        PCurrencyPipe, typeof (_b = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _b : Object, PInputService,
        PMomentService,
        PDatePipe, typeof (_c = typeof CurrencyPipe !== "undefined" && CurrencyPipe) === "function" ? _c : Object, PFormsService,
        ValidatorsService,
        ModalService])
], PInputComponent);
export { PInputComponent };
let PInputPrependComponent = class PInputPrependComponent {
    constructor() {
        this._alwaysTrue = true;
    }
};
__decorate([
    HostBinding('class.input-group-prepend'),
    __metadata("design:type", Object)
], PInputPrependComponent.prototype, "_alwaysTrue", void 0);
PInputPrependComponent = __decorate([
    Component({
        selector: 'p-input-prepend',
        template: '<ng-content></ng-content>',
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], PInputPrependComponent);
export { PInputPrependComponent };
let PInputAppendComponent = class PInputAppendComponent {
    constructor() {
        this._alwaysTrue = true;
    }
};
__decorate([
    HostBinding('class.input-group-append'),
    __metadata("design:type", Object)
], PInputAppendComponent.prototype, "_alwaysTrue", void 0);
PInputAppendComponent = __decorate([
    Component({
        selector: 'p-input-append',
        template: '<ng-content></ng-content>',
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [])
], PInputAppendComponent);
export { PInputAppendComponent };
//# sourceMappingURL=p-input.component.js.map