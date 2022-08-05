/* NOTE: Dont make this file even bigger. Invest some time to cleanup/split into several files */
/* eslint max-lines: ["error", 1300] */

import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Subscription } from 'rxjs';
import { DecimalPipe, NumberSymbol, getLocaleNumberSymbol, CurrencyPipe } from '@angular/common';
import { AfterViewInit, AfterContentInit, OnInit, OnDestroy } from '@angular/core';
import { Component, HostBinding, ChangeDetectionStrategy, ViewChild, ContentChildren, ElementRef, Input, Output, EventEmitter, forwardRef, ChangeDetectorRef, QueryList } from '@angular/core';
import { ControlValueAccessor, AbstractControl } from '@angular/forms';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { VisibleErrorsType } from '@plano/client/service/p-forms.service';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { EditableControlInterface, EditableDirective } from '@plano/client/shared/p-editable/editable/editable.directive';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { Duration } from '@plano/shared/api/base/generated-types.ag';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { PSupportedCurrencyCodes, PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { Id } from '@plano/shared/api/base/id';
import { PFaIcon } from '@plano/shared/core/component/fa-icon/fa-icon-types';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PCurrencyPipe } from '@plano/shared/core/pipe/p-currency.pipe';
import { AngularDatePipeFormat, PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { PlanoFaIconPoolValues } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PValidationErrors } from '@plano/shared/core/validators.types';
import { PPossibleErrorNames } from '@plano/shared/core/validators.types';
import { PInputService } from './p-input.service';
import { PTextAlignType } from './p-input.types';
import { DurationUIType} from './p-input.types';
import { IdBase } from '../../../../shared/api/base/id-base';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { ModalService } from '../../../../shared/core/p-modal/modal.service';
import { BootstrapRounded, BootstrapSize, PBtnThemeEnum } from '../../bootstrap-styles.enum';
import { PFormControlComponentBaseDirective } from '../../p-attribute-info/attribute-info-component-base';
import { PDropdownItemComponent } from '../p-dropdown/p-dropdown-item/p-dropdown-item.component';
import { PFormControl, PFormGroup } from '../p-form-control';
import { PFormControlComponentInterface } from '../p-form-control.interface';

type ValueType = string | number | null;

type HTMLInputAutocompleteValue = 'off' | 'on' | 'postal-code';

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

@Component({
	selector: 'p-input',
	templateUrl: './p-input.component.html',
	styleUrls: ['./p-input.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PInputComponent),
			multi: true,
		},
		{
			provide: NG_VALIDATORS,
			useExisting: PInputComponent,
			multi: true,
		},
	],
})
export class PInputComponent extends PFormControlComponentBaseDirective
	implements ControlValueAccessor, AfterViewInit, EditableControlInterface, AfterContentInit, OnInit,
PFormControlComponentInterface, OnDestroy {

	@Input('readMode') private _readMode : PFormControlComponentInterface['readMode'] = null;

	@Input() public formGroup : PFormGroup | null = null;

	@ViewChild('inputEl', { static: false }) public inputEl ?: ElementRef<HTMLInputElement>;

	@ContentChildren(PDropdownItemComponent) public dropdownItems ?: QueryList<PDropdownItemComponent> | null = null;

	@Input() public dropdownValue : unknown;
	@Output() public dropdownValueChange = new EventEmitter<unknown>();

	/**
	 * See HTML autocomplete
	 * https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete
	 */
	@Input() public autocomplete : HTMLInputAutocompleteValue = 'off';

	@Input() public size ?: PFormControlComponentInterface['size'];

	/**
	 * The text that should be shown if there is no value yet.
	 * Usually used for example input.
	 */
	@Input('placeholder') private _placeholder : string | null = null;

	/**
	 * Overwrite the type that is read from apiAttributeInfo.primitiveType.
	 * @example <p-input [type]="PApiPrimitiveTypes.Email">
	 * @example <p-input [type]="PApiPrimitiveTypes.Currency">
	 */
	@Input() public type : (
		PApiPrimitiveTypes.Iban |
		PApiPrimitiveTypes.Bic |
		PApiPrimitiveTypes.Url |
		'Domain' |
		PApiPrimitiveTypes.Search |
		PApiPrimitiveTypes.Minutes |
		PApiPrimitiveTypes.Hours |
		PApiPrimitiveTypes.Integer |
		PApiPrimitiveTypes.LocalTime |
		PApiPrimitiveTypes.Days |
		PApiPrimitiveTypes.Months |
		PApiPrimitiveTypes.Percent |
		PApiPrimitiveTypes.Password |
		PApiPrimitiveTypes.PostalCode |
		PApiPrimitiveTypes.Tel |
		PApiPrimitiveTypes.Years |
		PApiPrimitiveTypes.number |
		PApiPrimitiveTypes.string |
		PApiPrimitiveTypes.Email |
		PApiPrimitiveTypes.Duration |
		PApiPrimitiveTypes.Currency |
		'ConfirmPassword'
	) = PApiPrimitiveTypes.string;

	public _durationUIType : DurationUIType | null = null;

	/**
	 * Duration would not be a user-friendly type. It’s stored in Milliseconds.
	 * If you use this component for a PrimitiveType Duration it is required to set a `durationUIType`.
	 * You can set it to a specific unit, or you can set it to null.
	 * If you set it to null, a dropdown with some units will be shown.
	 */
	public get durationUIType() : PInputComponent['_durationUIType'] {
		return this._durationUIType;
	}
	@Input() public set durationUIType(input : PInputComponent['_durationUIType']) {
		if (input === this._durationUIType) return;
		this._durationUIType = input;
		if (input === null) {
			this._value = null;
		}
		this._onChange(this.value);
		this.durationUITypeChange.emit(input);
		this.changeDetectorRef.markForCheck();
	}

	@Output() public durationUITypeChange : EventEmitter<PInputComponent['_durationUIType']> = new EventEmitter();

	/**
	 * If type is set to 'Currency', you can set the currency for another country here.
	 * If undefined, a global currency code based on the locale (Config.CURRENCY_CODE) will be used.
	 * @example <p-input [type]="PApiPrimitiveTypes.Currency" currencyCode="CZK">
	 */
	@Input() public currencyCode : PSupportedCurrencyCodes | null = null;

	/* type date */
	@Input() public min : string | null = null;
	@Input() public max : string | null = null;

	@Input() public textAlign : PTextAlignType | null = null;

	@Input('inputGroupAppendText') private _inputGroupAppendText : PInputComponent['inputGroupAppendText'] = null;
	@Input() private inputGroupAppendIcon : PFaIcon | null = null;

	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public focusout : EventEmitter<Event> = new EventEmitter<Event>();
	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public focus : EventEmitter<Event> = new EventEmitter<Event>();

	@Input('locale') public _locale : PSupportedLocaleIds | null = null;

	/**
	 * An array with suggested values. Suggested values show up when user starts to type.
	 */
	@Input() public typeahead : string[] = [];

	@Input() public readonly : boolean = false;

	/**
	 * Write 10.000.000 instead of 10000000 into input when model is 10000000
	 * @default true
	 */
	@Input() public useSeparatorForThousands = true;

	/**
	 * Should the password strength meter be visible?
	 * Only use this if type is Password.
	 */
	@Input('showPasswordMeter') public _showPasswordMeter : boolean | null = null;

	// These are necessary Inputs and Outputs for pEditable form element
	@Input() public pEditable : EditableControlInterface['pEditable'] = false;
	@Input() public api : EditableControlInterface['api'] = null;
	@Input() public valid : EditableControlInterface['valid'] = null;

	/**
	 * This is a relict. don’t set it.
	 */
	@Input() public saveChangesHook ?: EditableControlInterface['saveChangesHook'];
	@Output() public onSaveStart : EditableControlInterface['onSaveStart'] = new EventEmitter();
	@Output() public onSaveSuccess : EditableControlInterface['onSaveSuccess'] = new EventEmitter();
	@Output() public onDismiss : EditableDirective['onDismiss'] = new EventEmitter();
	@Output() public onLeaveCurrent : EditableControlInterface['onLeaveCurrent'] = new EventEmitter();
	@Output() public editMode : EditableControlInterface['editMode'] = new EventEmitter<boolean>(undefined);

	/** Is this valid? [valid]="…" overwrites the valid state if the formControl. */
	public get isValid() : boolean {
		return this.valid !== null ? this.valid : (!this.formControl || !this.formControl.invalid);
	}

	@Input() public checkTouched : boolean = false;

	@Input() public theme : PBtnThemeEnum.OUTLINE_DARK | null = null;

	/**
	 * Set this to true if you want the component to return a `undefined` to the api when user clears the input.
	 * This e.g. gets used when the input has a dropdown with a `null` option and the form control has a notUndefined()
	 * validator.
	 * If the user chose a non-null option in the dropdown but did not set any value in the input, component returns
	 * `undefined` and user gets prompted that value is required.
	 */
	@Input() public supportsUndefined : boolean | null = null;

	constructor(
		protected override console : LogService,
		private decimalPipe : DecimalPipe,
		private localize : LocalizePipe,
		private pCurrencyPipe : PCurrencyPipe,
		protected override changeDetectorRef : ChangeDetectorRef,
		private pInputService : PInputService,
		private pMoment : PMomentService,
		private pDatePipe : PDatePipe,
		private currencyPipe : CurrencyPipe,
		protected override pFormsService : PFormsService,
		private validators : ValidatorsService,
		private modalService : ModalService,
	) {
		super(false, changeDetectorRef, pFormsService, console);
	}

	public BootstrapSize = BootstrapSize;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;
	public PlanoFaIconPool = PlanoFaIconPool;
	public PBtnThemeEnum = PBtnThemeEnum;
	public BootstrapRounded = BootstrapRounded;

	/**
	 * Take the internal type from PApiPrimitiveTypes and get a proper html input type
	 * See https://developer.mozilla.org/de/docs/Web/HTML/Element/Input#arten_des_%3Cinput%3E-elements
	 */
	public get inputType() : PInputComponent['type'] {
		if (this.type === PApiPrimitiveTypes.number) return PApiPrimitiveTypes.string;
		if (this.type === PApiPrimitiveTypes.Password || this.type === 'ConfirmPassword') {
			return this.hidePassword ? PApiPrimitiveTypes.Password : PApiPrimitiveTypes.string;
		}
		return this.type;
	}

	private get locale() : PSupportedLocaleIds {
		return this._locale !== null ? this._locale : Config.LOCALE_ID;
	}

	/**
	 * How many digits are allowed?
	 * This obviously only makes sense on number-inputs.
	 */
	@Input() private maxDecimalPlacesCount : number | null = null;

	/**
	 * Run input-type based validations.
	 * These validations validate against the value of this input, not the transformed value, that gets returned to the
	 * bound model / to the api.
	 *
	 * Why we need this: A Integer-Validator (no digits allowed) makes no sense on a Duration. Because the duration
	 * gets stored as milliseconds. But it can make sense, to validate that the "Minutes" that are visible in the UI do
	 * not have digits.
	 */
	public validate(_control : PFormControl) : PValidationErrors | null {
		if (!!this.attributeInfo) return null;
		return this.validateInternalValue();
	}

	private validateInternalValue() : PValidationErrors | null {
		if (!this.value) return null;
		const VALUE = typeof this.value === 'string' && this.type !== PApiPrimitiveTypes.Password && this.type !== 'ConfirmPassword' ? this.value.trim() : this.value;
		const CONTROL = { value : VALUE } as unknown as AbstractControl;
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
			case PApiPrimitiveTypes.LocalTime :
				return this.pInputService.validateLocaleAwareTime(CONTROL);
			case PApiPrimitiveTypes.Minutes :
			case PApiPrimitiveTypes.Hours :
			case PApiPrimitiveTypes.Days :
			case PApiPrimitiveTypes.Months :
			case PApiPrimitiveTypes.Years :
			case PApiPrimitiveTypes.Percent:
				const MIN_ERRORS = this.pInputService.min(0, CONTROL, this.locale);
				if (MIN_ERRORS) return MIN_ERRORS;
				const FLOAT_ERRORS2 = this.pInputService.validateLocaleAwareFloat(CONTROL, this.locale);
				if (FLOAT_ERRORS2) return FLOAT_ERRORS2;
				// TODO: Obsolete?
				return this.pInputService.integer(this.type, this.locale)(CONTROL);
			case PApiPrimitiveTypes.number :
				return this.pInputService.validateLocaleAwareFloat(CONTROL, this.locale);
			case PApiPrimitiveTypes.Currency :
				return this.pInputService.validateLocaleAwareCurrency(CONTROL, this.locale, this.currencyCode);
			case PApiPrimitiveTypes.Tel :
				// TODO: Obsolete?
				return this.validators.phone().fn(CONTROL);
			case PApiPrimitiveTypes.Email :
				// TODO: Obsolete?
				return this.validators.email().fn(CONTROL);
			case 'ConfirmPassword' :
				return null;
			case PApiPrimitiveTypes.Password :
				// TODO: Obsolete?
				return this.validators.password().fn(CONTROL);
			case PApiPrimitiveTypes.Duration :
				const FLOAT_ERRORS = this.pInputService.validateLocaleAwareFloat(CONTROL, this.locale);
				if (FLOAT_ERRORS) return FLOAT_ERRORS;
				const DURATION_MIN_ERRORS = this.pInputService.min(0, CONTROL, this.locale);
				if (DURATION_MIN_ERRORS) return DURATION_MIN_ERRORS;
				if (this.maxDecimalPlacesCount !== null) {
					const DIGITS_ERRORS = this.pInputService.maxDecimalPlacesCount(this.maxDecimalPlacesCount, CONTROL, this.locale);
					if (DIGITS_ERRORS) return DIGITS_ERRORS;
				}
				return null;
			case PApiPrimitiveTypes.Integer :
				// TODO: Obsolete?
				return this.pInputService.integer(this.type, this.locale)(CONTROL);
			default :
				return this.type;
		}
	}

	private addComponentValidatorsToFormControl() : void {
		if (!this.formControl) return;
		this.formControl.componentValidators = () => {
			return this.validateInternalValue();
		};
	}

	public override ngAfterContentInit() : never {
		this.initDurationValues();
		if (this.maxDecimalPlacesCount !== null && this.type !== PApiPrimitiveTypes.Duration) this.console.error('Not implemented yet');

		this.addComponentValidatorsToFormControl();
		return super.ngAfterContentInit();
	}

	public override ngOnInit() : never {
		this.validateValues();
		this.initValues();
		return super.ngOnInit();
	}

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	private initValues() : void {
		this.setValidationErrorsListener();
	}


	private valueChangesSubscriber : Subscription | null = null;
	private statusChangesSubscriber : Subscription | null = null;

	private refreshVisibleErrors() : void | null {
		if (!this.formControl) return null;
		const ERRORS = this.pFormsService.visibleErrors(this.formControl);
		// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
		if (!ERRORS) return null;
		this.visibleErrors = ERRORS.filter(error => {
			if (!this._showPasswordMeter) return true;
			switch (error.key) {
				case PPossibleErrorNames.MIN_LENGTH :
				case PPossibleErrorNames.LETTERS_REQUIRED :
				case PPossibleErrorNames.NUMBERS_REQUIRED :
				case PPossibleErrorNames.UPPERCASE_REQUIRED :
				case PPossibleErrorNames.PASSWORD :
					return false;
				default :
					return true;
			}
		});
	}

	/**
	 * Fixes PLANO-79961
	 */
	private setValidationErrorsListener() : void {
		if (!this.formControl) return;
		this.valueChangesSubscriber = this.formControl.valueChanges.subscribe((_newValue : ValueType) => {
			this.refreshVisibleErrors();
		});
		this.statusChangesSubscriber = this.formControl.statusChanges.subscribe((_newValue) => {
			this.refreshVisibleErrors();
		});
	}

	public override ngOnDestroy() : never {

		this.valueChangesSubscriber?.unsubscribe();

		this.statusChangesSubscriber?.unsubscribe();

		return super.ngOnDestroy();
	}

	/**
	 * Set an initial durationUiType if needed
	 */
	private initDurationValues() : void {
		// Nothing to do if this is something else than duration
		if (this.type !== PApiPrimitiveTypes.Duration) return;
		// Nothing to do if there is a valid durationUiType already set
		if (this.durationUIType !== null) return;

		// TODO: [PLANO-79667] had to re-add the old behaviour but should not be necessary. Read NOTE below
		this._durationUIType = PApiPrimitiveTypes.Minutes;
		// NOTE: Back in the days we set the initial value to Minutes. Now we simply have made durationUIType a required attribute
		// for Duration inputs.
	}

	private validateValues() : void {
		if (this._showPasswordMeter && this.type !== PApiPrimitiveTypes.Password && this.type !== 'ConfirmPassword') {
			throw new Error('showPasswordMeter can only be true if type is password.');
		}
	}

	/**
	 * Happens when user selects a typeahead item from the typeahead-dropdown
	 */
	public typeaheadOnSelect(
		input : TypeaheadMatch,
		pEditableTriggerFocussableRef : HTMLInputElement,
	) : void {
		this.value = input.value;
		$(pEditableTriggerFocussableRef).trigger('enter');
	}

	private timeToTimestamp(input : string) : number | null {
		if (!input) return null;
		if (typeof input === 'number') return input;
		const MOMENT = this.pMoment.d(input).asMilliseconds();
		return +MOMENT;
	}

	private turnLocaleFormattedNumberToFloat(input : string) : number {
		const SEPARATOR : ',' | '.' = getLocaleNumberSymbol(this.locale, NumberSymbol.Decimal) as ',' | '.';
		switch (SEPARATOR) {
			case ',' :
				const convertedString = input.replace(/\./g, '').replace(/,/g, '.');
				return +convertedString;
			case '.' :
				return +input;
			default :
				throw new Error('NumberFormat not supported');
		}
	}

	private localeStringToNumber(input : number | string | Id) : number | string | Id | undefined {
		if (!input) return undefined;
		if (typeof input === 'number') return input;
		if (input instanceof IdBase) {
			this.console.warn('Id in p-input? This must be a mistake, right?');
			return input;
		}

		let regex : RegExp | null = null;
		switch (this.type) {
			case PApiPrimitiveTypes.Minutes :
			case PApiPrimitiveTypes.Hours :
			case PApiPrimitiveTypes.Days :
			case PApiPrimitiveTypes.Years :
			case PApiPrimitiveTypes.number :
			case PApiPrimitiveTypes.Integer :
			case PApiPrimitiveTypes.Duration :
			case PApiPrimitiveTypes.Percent:
				regex = this.pInputService.localeAwareFloatRegEx(this.locale);
				break;
			case PApiPrimitiveTypes.Currency :
				regex = PInputService.localeAwareFloatWithTwoDigitsAfterSeparatorRegEx(this.locale);
				break;
			default :
				// throw 'error';
		}

		if (!regex || !input.toString().match(regex)) return input;

		const result = this.turnLocaleFormattedNumberToFloat(input);
		// eslint-disable-next-line unicorn/prefer-number-properties
		return isNaN(result) ? input : result;
	}

	/**
	 * Get a proper placeholder for the provided value type
	 */
	public get placeholder() : string | undefined {
		if (this.disabled === true) return undefined;
		if (this._placeholder !== null) return this._placeholder;

		switch (this.type) {
			case PApiPrimitiveTypes.LocalTime :
				return this.localize.transform('z.B. »${example1}«', {
					example1: this.pDatePipe.transform(86340000, AngularDatePipeFormat.SHORT_TIME),
				});
			case PApiPrimitiveTypes.Search :
				return this.localize.transform('Suche…');
			case PApiPrimitiveTypes.Currency :
				return this.localize.transform('z.B. »${example1}«', {
					example1: this.currencyPipe.transform(10.5, Config.CURRENCY_CODE!, '')!.trim(),
				});
			case PApiPrimitiveTypes.Hours :
				return this.localize.transform('z.B. »${example1}« oder »${example2}«', {
					example1: this.decimalPipe.transform(1)!,
					example2: this.decimalPipe.transform(2.5)!,
				});
			case PApiPrimitiveTypes.Minutes :
			case PApiPrimitiveTypes.Percent :
				return this.localize.transform('z.B. »${example1}«', {
					example1: this.decimalPipe.transform(10)!,
				});
			case PApiPrimitiveTypes.Days :
				return this.localize.transform('z.B. »${example1}«', {
					example1: this.decimalPipe.transform(3)!,
				});
			case PApiPrimitiveTypes.Tel :
				return this.localize.transform('z.B. »+49 123 0000000«');
			case PApiPrimitiveTypes.Url :
				return 'http://';
			default:
				return '';
		}
	}

	/**
	 * Get a proper icon for the provided value type
	 */
	public get inputGroupPrependIcon() : PFaIcon | null {
		if (this.inputGroupAppendIcon !== null) return this.inputGroupAppendIcon;
		switch (this.type) {
			case PApiPrimitiveTypes.Currency :
				return this.pCurrencyPipe.getCurrencyIcon(this.currencyCode);
			case PApiPrimitiveTypes.LocalTime :
				return PlanoFaIconPool.CLOCK;
			case PApiPrimitiveTypes.Minutes :
			case PApiPrimitiveTypes.Hours :
			case PApiPrimitiveTypes.Duration :
				return 'stopwatch';
			case PApiPrimitiveTypes.Months :
				return 'calendar';
			case PApiPrimitiveTypes.Days :
				return PlanoFaIconPool.CALENDAR_DAY;
			case PApiPrimitiveTypes.Years :
				return 'calendar';
			case PApiPrimitiveTypes.Percent:
				return 'percent';
			case PApiPrimitiveTypes.Search :
				return PlanoFaIconPool.SEARCH;
			case PApiPrimitiveTypes.Url :
			case 'Domain' :
				return PlanoFaIconPool.BRAND_INTERNET_EXPLORER;
			case PApiPrimitiveTypes.Email :
				if (this.formControl?.pending) {
					return PlanoFaIconPool.SYNCING;
				}
				return 'at';
			case PApiPrimitiveTypes.Tel :
				return 'phone';
			case PApiPrimitiveTypes.Password :
			case 'ConfirmPassword' :
				return 'key';
			case PApiPrimitiveTypes.PostalCode :
			case PApiPrimitiveTypes.number :
			case PApiPrimitiveTypes.string :
			case PApiPrimitiveTypes.Integer :
			case PApiPrimitiveTypes.Iban :
			case PApiPrimitiveTypes.Bic :
				return null;
			default :
				return this.type;
		}
	}

	public _hidePassword : boolean = true;
	public hidePasswordInput : boolean | null = null;
	@Input('hidePassword') private set setHidePasswordInput(input : boolean) {
		this.hidePasswordInput = input;
	}

	/**
	 * Passwords are hidden by default. Prevent that some other person in the room sees the user’s password.
	 */
	public get hidePassword() : boolean {
		if (this.hidePasswordInput !== null) return this.hidePasswordInput;
		return this._hidePassword;
	}
	public set hidePassword(input : boolean) {
		this._hidePassword = input;
	}

	/**
	 * A Text that will be appended to the input
	 * Can be used to write the name of the unit.
	 * Gets set automatically if this is some kind of Duration input.
	 */
	public get inputGroupAppendText() : string | null {
		// TODO: 	Milad and Nils think that this should be something like `if (this._inputGroupAppendText === undefined) …`
		// 				It should be possible to set it to `null` to remove the append text from UI.
		if (!!this._inputGroupAppendText) return this._inputGroupAppendText;
		if (!!this.dropdownItems?.length) return null;
		const getText = (type : PInputComponent['type'] | null) : string | null => {
			switch (type) {
				case PApiPrimitiveTypes.Minutes :
					return this.localize.transform('Minuten');
				case PApiPrimitiveTypes.Hours :
					return this.localize.transform('Stunden');
				case PApiPrimitiveTypes.Days :
					return this.localize.transform('Tage');
				case PApiPrimitiveTypes.Months :
					return this.localize.transform('Monate');
				case PApiPrimitiveTypes.Years :
					return this.localize.transform('Jahre');
				case null :
				default :
					return null;
			}
		};
		const UI_TYPE = this.type !== PApiPrimitiveTypes.Duration ? this.type : this.durationUIType;
		return getText(UI_TYPE);
	}

	public ngAfterViewInit() : void {
	}

	// eslint-disable-next-line sonarjs/cognitive-complexity
	private transformUiValueIntoModelValue(value : string) : ValueType | Duration | null {
		const VALUE = typeof value === 'string' ? value.trim() : value;
		const valueAsFloat = this.localeStringToNumber(VALUE) as number;

		// Check the description of `supportsUndefined`
		// If supportsUndefined is true, we want to return undefined in order to trigger the 'notUndefined()' validator.
		if (
			this.supportsUndefined &&
			(VALUE === '' || Number.isNaN(valueAsFloat))
		) return null;

		switch (this.type) {
			case PApiPrimitiveTypes.LocalTime:
				if (VALUE === '') return null;
				return this.timeToTimestamp(value);
			case PApiPrimitiveTypes.number :
			case PApiPrimitiveTypes.Currency :
			case PApiPrimitiveTypes.Integer :
				if (VALUE === '') return null;
				// We check isNaN(valueAsFloat) instead of Number.isNaN(+value), because value can be '1,5'.
				// ..so it can have a german comma-separator.
				// eslint-disable-next-line unicorn/prefer-number-properties
				if (isNaN(valueAsFloat)) return value;
				// eslint-disable-next-line sonarjs/no-collapsible-if
				if (!(this.formControl instanceof PFormControl)) {
					// not necessary anymore. attributeInfo should include the necessary validators.
					// I will leave this here in order to have the least possible change in ui.
					if (valueAsFloat < 0) return null;
				}
				return valueAsFloat;
			case PApiPrimitiveTypes.Minutes :
			case PApiPrimitiveTypes.Hours :
			case PApiPrimitiveTypes.Days :
			case PApiPrimitiveTypes.Years :
			case PApiPrimitiveTypes.Months :
				if (VALUE === '') return null;
				// Api does not allow values other than nullish value or number
				// eslint-disable-next-line unicorn/prefer-number-properties
				if (isNaN(valueAsFloat)) return null;
				// A Days is expected to be greater equal nullish value.
				if (valueAsFloat < 0) return null;
				return valueAsFloat;
			case PApiPrimitiveTypes.Percent:
				// eslint-disable-next-line unicorn/prefer-number-properties
				if (VALUE === '' || isNaN(valueAsFloat) || valueAsFloat < 0) return null;

				// Api saves percent in range [0, 1] but we visualize it as [0, 100].
				return valueAsFloat / 100;
			case PApiPrimitiveTypes.Duration :
				if (VALUE === '') return null;
				// Api does not allow values other than nullish value or number
				// eslint-disable-next-line unicorn/prefer-number-properties
				if (isNaN(valueAsFloat)) return null;
				if (valueAsFloat < 0) return null;

				return this.toDuration(valueAsFloat);
			case PApiPrimitiveTypes.string :
			case PApiPrimitiveTypes.Tel :
			case PApiPrimitiveTypes.Email :
			case PApiPrimitiveTypes.Password :
			case 'ConfirmPassword' :
			case PApiPrimitiveTypes.PostalCode :
			case PApiPrimitiveTypes.Search :
			case PApiPrimitiveTypes.Url :
			case PApiPrimitiveTypes.Iban :
			case PApiPrimitiveTypes.Bic :
				return value;
			default :
				return this.type;
		}
	}

	// eslint-disable-next-line sonarjs/cognitive-complexity
	private transformModelValueIntoUiValue(valueInput : string | Duration | null) : PInputComponent['_value'] {
		let value : PInputComponent['_value'];

		switch (this.type) {
			case PApiPrimitiveTypes.Minutes :
			case PApiPrimitiveTypes.Hours :
			case PApiPrimitiveTypes.Days :
			case PApiPrimitiveTypes.Months :
			case PApiPrimitiveTypes.Years :
				// eslint-disable-next-line sonarjs/no-nested-switch, sonarjs/no-small-switch
				switch (valueInput) {
					case null :
						value = null;
						break;
					default:
						value = this.pInputService.turnNumberIntoLocaleNumber(this.locale, valueInput as number | null | undefined);
						break;
				}
				break;
			case PApiPrimitiveTypes.Percent:
				// eslint-disable-next-line sonarjs/no-nested-switch, sonarjs/no-small-switch
				switch (valueInput) {
					case null :
						value = null;
						break;
					default:
						value = this.pInputService.turnNumberIntoLocaleNumber(this.locale, (valueInput as number) * 100);
						break;
				}
				break;
			case PApiPrimitiveTypes.LocalTime :
				// eslint-disable-next-line sonarjs/no-nested-switch, sonarjs/no-small-switch
				switch (valueInput) {
					case null :
						value = null;
						break;
					default :
						// FIXME: PLANO-33048
						// NOTE: Wenn ich das hier auf pDatePipe umschalte, schlägt die interne Validierung fehl weil die
						// noch auf HH:mm prüft.
						// value = this.pDatePipe.transform(valueInput, DateFormat.shortTime);
						value = this.pMoment.d(valueInput as string | number | undefined).format('HH:mm');
				}
				break;
			case PApiPrimitiveTypes.Duration :
				// eslint-disable-next-line sonarjs/no-nested-switch
				switch (this.durationUIType) {
					case PApiPrimitiveTypes.Minutes :
					case null :
						value = this.timestampToMinutes(valueInput as Duration);
						value = this.decimalPipe.transform(value, undefined, this.locale);
						break;
					case PApiPrimitiveTypes.Hours :
						value = this.timestampToHours(valueInput as Duration);
						value = this.decimalPipe.transform(value, undefined, this.locale);
						break;
					case PApiPrimitiveTypes.Days :
						value = this.timestampToDays(valueInput as Duration);
						value = this.decimalPipe.transform(value, undefined, this.locale);
						break;
					default:
						throw new Error('If type of p-input is Duration, then [durationUIType] is required.');
				}
				break;
			case PApiPrimitiveTypes.Currency :
				let result : string | null = null;
				if (!!valueInput && Number.isNaN(+valueInput)) {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					value = valueInput as any;
					break;
				}

				/* BUG: fix shadowed value param */
				// eslint-disable-next-line @typescript-eslint/no-shadow
				const countDecimals = (value : number) : number => {
					if (Math.floor(value) !== value) {
						const charsAfterSeparator = value.toString().split('.')[1];
						if (!charsAfterSeparator) return 0;
						return charsAfterSeparator.length || 0;
					}
					return 0;
				};

				if (countDecimals(valueInput !== null ? +valueInput : 0) > 2) {
					assumeDefinedToGetStrictNullChecksRunning(this.locale, 'this.locale');
					result = this.decimalPipe.transform(valueInput, this.currencyCode ?? undefined, this.locale);
				} else {
					result = this.pCurrencyPipe.transform(valueInput as number, this.currencyCode, '', undefined, this.locale, true);
				}
				if (result) result = result.trim();
				value = result ?? null;
				break;
			case PApiPrimitiveTypes.Integer :
			case PApiPrimitiveTypes.number :
				if (this.useSeparatorForThousands) {
					value = this.decimalPipe.transform(valueInput as number | null | undefined, undefined, this.locale);
				} else {
					value = valueInput as number | null;
				}
				break;
			default :
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				value = valueInput as any;
		}
		return value;
	}

	private toDuration(
		value : number,
	) : Duration | null {
		switch (this.durationUIType) {
			case PApiPrimitiveTypes.Minutes :
				return this.minutesToDuration(value);
			case PApiPrimitiveTypes.Hours :
				return this.hoursToDuration(value);
			case PApiPrimitiveTypes.Days :
				return this.daysToDuration(value);
			default :
				this.console.error(`type »${this.durationUIType}« unexpected`);
				return value;
		}
	}
	private timestampToMinutes(timestamp : Duration | null = null) : number | null {
		// TODO: Can probably be replaced by return PMomentService.d(timestamp).asMinutes();
		if (timestamp === null) return null;
		return Math.round((timestamp / 60 / 1000) * 100) / 100;
	}
	private timestampToHours(timestamp : Duration | null = null) : number | null {
		// TODO: Can probably be replaced by return PMomentService.d(timestamp).asHours();
		if (timestamp === null) return null;
		return Math.round((timestamp / 60 / 60 / 1000) * 100) / 100;
	}
	private timestampToDays(timestamp : Duration | null = null) : number | null {
		// TODO: Can probably be replaced by return PMomentService.d(timestamp).asDays();
		if (timestamp === null) return null;
		return Math.round((timestamp / 24 / 60 / 60 / 1000) * 100) / 100;
	}
	private timestampToDuration(timestamp : Duration | null = null) : number | null {
		if (timestamp === null) return null;
		return timestamp;
	}

	private minutesToDuration(input : number | null = null) : Duration | null {
		if (input === null) return null;
		return input * 1000 * 60;
	}
	private hoursToDuration(input : number | null = null) : Duration | null {
		if (input === null) return null;
		return input * 1000 * 60 * 60;
	}
	private daysToDuration(input : number | null = null) : Duration | null {
		if (input === null) return null;
		return input * 1000 * 60 * 60 * 24;
	}

	public _disabled : boolean = false;

	/**
	 * This is the minimum code that is required for a custom control in Angular.
	 * Its necessary to set this if you want to use [(ngModel)] AND [formControl] together.
	 */
	public get disabled() : boolean {
		return this._disabled || !this.canEdit;
	}
	@Input('disabled') public set disabled(input : boolean) {
		this.setDisabledState(input);
		this._disabled = input;
	}

	@Input() public override formControl : PFormControl | null = null;
	@Input() public override group ?: PFormGroup;

	/**
	 * Is the input in only read mode or is editable (default)?
	 */
	public get readMode() : PFormControlComponentInterface['readMode'] {
		if (this._readMode !== null) return this._readMode;
		if (this.formControl instanceof PFormControl && this.formControl.isReadMode !== undefined) return this.formControl.isReadMode;
		return this.disabled;
	}

	@Input('required') private _required : boolean | null = null;

	/**
	 * Is this a required field?
	 * This can be set as Input() but if there is a formControl binding,
	 * then it takes the info from the formControl’s validators.
	 */
	public get required() : boolean {
		if (this._required !== null) return this._required;
		return this.formControlInitialRequired();
	}

	/** This always stores the user input, no matter if the type is correct or content is valid */
	private _value : ValueType | null = null;
	public override _onChange : (value : ValueType | null) => void = () => {};
	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public keyup : EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onKeyDown(_event : KeyboardEvent) : void {
		// if ((this.type === PApiPrimitiveTypes.Password || this.type === 'ConfirmPassword') && this.hidePassword && event.keyCode === 8) this.value = '';
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onKeyUp(event : KeyboardEvent) : void {
		// eslint-disable-next-line sonarjs/no-small-switch
		switch (event.key) {
			case 'Escape':
				if (this.type === PApiPrimitiveTypes.Search) {
					event.stopPropagation();
					this.clearValue();
					(event.target as HTMLInputElement).value = '';
					this.inputEl?.nativeElement.blur();
				}
				break;
			default:
				break;
		}

		const newValue = (event.target as HTMLInputElement).value;
		if (this._value !== newValue) this._onChange(newValue);
		this.keyup.emit(event);
	}
	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public blur : EventEmitter<Event> = new EventEmitter<Event>();
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onBlur() : void {
		this.onTouched();
		this.blur.emit();
	}
	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public change : EventEmitter<KeyboardEvent> = new EventEmitter<KeyboardEvent>();
	/* eslint-disable-next-line jsdoc/require-jsdoc, @typescript-eslint/no-explicit-any */
	public onChange(event : any) : void {
		const newValue = (event.target as HTMLInputElement).value;
		if (this._value === newValue) return;
		this._onChange(event.target.value);
		this.change.emit(event);
	}

	/** onTouched */
	public onTouched = () : void => {};

	/** the value of this control that is visible to the user */
	public get value() : ValueType | null { return this._value; }

	/** the value of this control that is visible to the user */
	public set value(value : ValueType | null) {
		if (this._value === value) return;

		this._value = value;
		this.changeDetectorRef.markForCheck();
		this._onChange(value);
	}

	/**
	 * Write a new value to the element.
	 * This happens when the model that is bound to this component changes.
	 */
	public writeValue(valueInput : ValueType) : void {
		const newValue = this.transformModelValueIntoUiValue(valueInput);

		if (newValue === null && this.supportsUndefined) return;

		if (this._value === newValue) return;
		this._value = newValue;
		this.changeDetectorRef.detectChanges();
	}

	/**
	 * Set the function to be called when the control receives a change event.
	 * registerOnChange() only gets called if a formControl is bound
	 */
	public registerOnChange(fn : (value : ValueType | null) => void) : void {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this._onChange = (value : any) => {
			const newValue = this.transformUiValueIntoModelValue(value);
			fn(newValue);
		};
	}

	/** Set the function to be called when the control receives a touch event. */
	public registerOnTouched(fn : () => void) : void { this.onTouched = fn; }

	/** setDisabledState */
	public setDisabledState(isDisabled : boolean) : void {
		if (this._disabled === isDisabled) return;
		// Set internal attribute which gets used in the template.
		this._disabled = isDisabled;

		// Refresh the formControl. #two-way-binding
		if (this.formControl && this.formControl.disabled !== this.disabled) {
			this.disabled ? this.formControl.disable() : this.formControl.enable();
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get successBtnIcon() : PlanoFaIconPoolValues {
		if (this.isPending) return PlanoFaIconPool.SYNCING;
		return PlanoFaIconPool.SUCCESS;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get successBtnIconSpin() : boolean {
		if (this.successBtnIcon === PlanoFaIconPool.SYNCING) return true;
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get inputGroupPrependIconSpin() : boolean {
		if (this.inputGroupPrependIcon === PlanoFaIconPool.SYNCING) return true;
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isPending() : boolean {
		if (this.formControl?.pending) return true;
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get hasDanger() : boolean {
		return (!this.formControl || this.formControl.touched) && !this.isValid && !this.isPending;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get hasWarning() : boolean {
		return !!this.formControl && this.isPending;
	}

	/** Filter all errors that should be shown in the ui. */
	public visibleErrors : VisibleErrorsType | null = null;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showPasswordMeter() : boolean {
		if (!this._showPasswordMeter) return false;
		if (this.formControl) {
			if (this.hasFocus) return true;
			return this.formControl.touched && this.formControl.invalid;
		}
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get readModeValue() : ValueType {
		if (!this.value) return ' ';
		if (this.type === PApiPrimitiveTypes.Password || this.type === 'ConfirmPassword') {
			let result = '';
			for (const _ITEM of this.value.toString()) result += '•';
			return result;
		}
		return this.value;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showPasswordVisibilityToggleButton() : boolean {
		if (this.type !== PApiPrimitiveTypes.Password && this.type !== 'ConfirmPassword') return false;
		if (this.hidePasswordInput !== null) return false;
		if (this.readMode || this.disabled) return false;
		return true;
	}

	public hasFocus : boolean | null = null;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onFocusOut(event : Event) : void {
		this.hasFocus = false;
		this.focusout.emit(event);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onFocus(event : Event) : void {
		this.hasFocus = true;
		this.focus.emit(event);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public clearValue() : void {
		this.value = '';
	}

	/**
	 * Set focus in input when prepend icon is clicked
	 */
	/* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents, jsdoc/require-jsdoc */
	public onClickPrependIcon(input : ElementRef<HTMLInputElement> | any) : void {
		if (this.disabled) return;
		input?.nativeElement.focus();
	}

	/**
	 * Open a Modal like info-circle does it when in IS_MOBILE mode.
	 */
	public openCannotEditHint() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.cannotEditHint, 'this.cannotEditHint');
		this.modalService.openCannotEditHintModal(this.cannotEditHint);
	}

	/**
	 * Handle dropdown click
	 */
	public onDropdownClick(dropdownItem : PDropdownItemComponent, event : unknown) : void {
		dropdownItem.onClick.emit(event);
	}
}

@Component({
	selector: 'p-input-prepend',
	template: '<ng-content></ng-content>',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PInputPrependComponent {
	@HostBinding('class.input-group-prepend') private _alwaysTrue = true;

	constructor() {}
}

@Component({
	selector: 'p-input-append',
	template: '<ng-content></ng-content>',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PInputAppendComponent {
	@HostBinding('class.input-group-append') private _alwaysTrue = true;

	constructor() {}
}
