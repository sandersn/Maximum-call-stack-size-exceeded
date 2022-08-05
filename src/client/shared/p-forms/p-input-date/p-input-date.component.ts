/* NOTE: Dont make this file even bigger. Invest some time to cleanup/split into several files */
/* eslint max-lines: ["error", 1100] */

import { NgbModalRef, NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';
import { AfterContentInit, AfterViewInit, OnDestroy} from '@angular/core';
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, NgZone, forwardRef, HostBinding, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { ControlValueAccessor} from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { NgbFormatsService } from '@plano/client/service/ngbformats.service';
import { VisibleErrorsType } from '@plano/client/service/p-forms.service';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PFormGroup } from '@plano/client/shared/p-forms/p-form-control';
import { PFormControl } from '@plano/client/shared/p-forms/p-form-control';
import { PMoment } from '@plano/client/shared/p-moment.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { DateTime} from '@plano/shared/api/base/generated-types.ag';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '@plano/shared/core/config';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { DateFormats} from '@plano/shared/core/pipe/p-date.pipe';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { PlanoFaIconPoolValues } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PInputDateService } from './p-input-date.service';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../shared/core/null-type-utils';
import { PValidatorObject, PPossibleErrorNames } from '../../../../shared/core/validators.types';
import { PFormControlComponentBaseDirective } from '../../p-attribute-info/attribute-info-component-base';
import { EditableControlInterface, EditableDirective } from '../../p-editable/editable/editable.directive';
import { PFormControlComponentInterface } from '../p-form-control.interface';

type ValueType = DateTime;
export enum PInputDateTypes {

	/**
	 * @deprecated Do not set this from outside anymore. It is obsolete, since we check min and max from validators of attributeInfo.
	 */
	// eslint-disable-next-line @typescript-eslint/naming-convention
	birth = 'birth',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	deadline = 'deadline',
}

@Component({
	selector: 'p-input-date',
	templateUrl: './p-input-date.component.html',
	styleUrls: ['./p-input-date.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PInputDateComponent),
			multi: true,
		},
	],
})

/**
 * A component like datepicker, but a timestamp (type is DateTime) can be bound to it instead of any ngb formats
 */
export class PInputDateComponent extends PFormControlComponentBaseDirective
	implements PComponentInterface, AfterContentInit, AfterViewInit, OnDestroy /* , EditableControlInterface */,
	ControlValueAccessor, PFormControlComponentInterface {

	@Input() public isLoading : PComponentInterface['isLoading'] | null = null;

	@Input() public showDaysBeforeInput : boolean | null = null;

	@Input('class') private _class : string = '';
	@HostBinding('class') private get _classes() : string {
		if (!this.btnStyles) return this._class;

		return this._class.replace(this.btnStyles, '');
	}

	/**
	 * Days before as number
	 * This is NOT a timestamp
	 */
	@Input() private daysBefore : number | null = null;
	@Output() private daysBeforeChange : EventEmitter<number | null> = new EventEmitter<number | null>();

	@ViewChild('modalContent', { static: true }) public modalContent ! : ElementRef<HTMLElement>;

	@Input() public size ?: PFormControlComponentInterface['size'];

	/**
	 * Minimum date and time of this input in timestamp format.
	 */
	@Input('min') private _min ?: PInputDateComponent['min'];

	/** @see PInputDateComponent['_min'] */
	public get min() : number | null {
		if (this._min !== undefined) return this._min;

		const MIN_COMPARED_CONST = this.formControl?.validatorObjects.min?.comparedConst as number | (() => number) | undefined ?? null;
		if (MIN_COMPARED_CONST !== null) {
			if (typeof MIN_COMPARED_CONST === 'function') return MIN_COMPARED_CONST();
			return MIN_COMPARED_CONST;
		}

		// TODO: Remove this, when all datepickers are bound to attributeInfo
		if (this.type === PInputDateTypes.birth as PInputDateTypes.deadline) { // HACK: PLANO-151942 We dont want developers to set PInputDateTypes.birth from outside anymore.
			return +(new PMomentService(this.locale).m()).subtract(120, 'years');
		}

		return null;
	}

	private _max : PInputDateComponent['max'] = null;

	/**
	 * maximum date and time of this input in timestamp format
	 * 0 means no limit
	 */
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	@Input('max') public set max(input : 0 | number | null) {
		if (this._max !== input && this.formGroup && this.daysBefore) {
			this._max = input;
			// date is calculated by 'daysBefore' and 'max'. If one of them change, the calculated must be repeated.
			this.formGroup.get('daysBefore')!.updateValueAndValidity();
		} else {
			this._max = input;
		}
	}

	/**
	 * maximum date and time of this input in timestamp format
	 * 0 means no limit
	 */
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	public get max() : 0 | number | null {
		if (this._max !== null) {
			if (this.isExclusiveEnd) return this._max - 1;
			return this._max;
		}

		const MAX_COMPARED_CONST = this.formControl?.validatorObjects.max?.comparedConst as number | (() => number) | undefined ?? null;
		if (MAX_COMPARED_CONST !== null) {
			if (typeof MAX_COMPARED_CONST === 'function') return MAX_COMPARED_CONST();
			return MAX_COMPARED_CONST;
		}

		return null;
	}

	@Input() public type : PInputDateTypes.deadline | null = null;

	public readonly CONFIG : typeof Config = Config;

	/** @see PInputDateComponent['_ngbMinDate'] */
	public get ngbMinDate() : NgbDateStruct | '-' {
		if (this.min !== null) return this.ngbFormatsService.timestampToDateStruct(this.min, this.locale);
		return '-';
	}

	/** @see PInputDateComponent['_ngbMaxDate'] */
	public get ngbMaxDate() : NgbDateStruct | '-' {
		if (this.max !== null) return this.ngbFormatsService.timestampToDateStruct(this.max, this.locale);
		return '-';
	}

	@Input('showEraseValueBtn') private _showEraseValueBtn : boolean = true;
	@Input() public supportsUndefined : boolean = false;
	@Input() public showNowButton : boolean | null = null;

	/**
	 * Should the timestamp include the exact time? If not it will only represent a date.
	 */
	@Input() public showTimeInput : boolean | null = null;

	/**
	 * The modal with the datepicker includes a input for time. This will get a own validator. Should the time be required?
	 */
	@Input() public timeIsRequired : boolean = false;

	/**
	 * Should the selected date be handled as exclusive end?
	 * Example: User decides a Vacation-Entry should go till 29.12.2020. The stored end date will be the millisecond 0
	 * of the date 30.12.2020
	 * Note that this boolean has no effect if showTimeInput is true.
	 */
	@Input() private isExclusiveEnd : boolean | null = null;

	@Input('placeholder') private _placeholder : string | null = null;

	/**
	 * A label for the input-area or button.
	 * It will be shown instead of the formatted date, if label is set.
	 */
	@Input() public label : string | null = null;

	// NOTE: Use class="btn-*" instead of [theme]="'"
	// @Input() private theme : PThemeEnum;

	/**
	 * A range like 'week' can be set. If its set, the user can only select a whole week, and not a single date.
	 */
	@Input() public range : CalendarModes | null = CalendarModes.DAY;

	/**
	 * Get the locale. Either from [locale]="…" when this component gets used, or from the global config.
	 */
	private get locale() : PSupportedLocaleIds {
		return this._locale ?? Config.LOCALE_ID;
	}

	/**
	 * Highlight some days based on e.g. the defined range.
	 */
	public isHighlighted(input : NgbDate) : boolean {
		const timestamp = this.ngbFormatsService.dateTimeObjectToTimestamp(input, this.locale);
		const selectedTimestamp = this.selectedDateTime;
		return new PMomentService(this.locale).m(timestamp).isSame(selectedTimestamp, this.range);
	}

	private now ! : number;

	private ngbDate : NgbDateStruct | '-' | null = null;
	public formGroup : PFormGroup | null = null;
	private modalRef : NgbModalRef | null = null;
	public startDate : NgbDateStruct | '-' | null = null;

	@Input() public checkTouched : boolean = false;

	/**
	 * You can suggest a time. Like the planned time of a shift for the date-input of the time-stamp
	 */
	@Input() public suggestionTimestamp : number | null = null;

	/**
	 * Label of the button that is shown if a suggested timestamp is provided
	 */
	@Input() public suggestionLabel : string | null = null;

	constructor(
		public modalService : ModalService,
		private zone : NgZone,
		protected override pFormsService : PFormsService,
		private validators : ValidatorsService,
		private ngbFormatsService : NgbFormatsService,
		private localize : LocalizePipe,
		private datePipe : PDatePipe,
		protected override changeDetectorRef : ChangeDetectorRef,
		private pInputDateService : PInputDateService,
		protected override console : LogService,
	) {
		super(false, changeDetectorRef, pFormsService, console);
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;

	/**
	 * Should the suggestion button be clickable?
	 */
	public get suggestionBtnIsDisabled() : boolean {
		if (this.suggestionTimestamp === null) return true;
		if (this.min && this.suggestionTimestamp < this.min) return true;
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get btnStyles() : string | undefined {
		if (!this._class) return undefined;
		const stylesArray = this._class.match(/btn-(?:outline-\w+|\w+)/g);
		if (!stylesArray) return undefined;
		return stylesArray.join(' ');
	}

	@Input('locale') private _locale : PSupportedLocaleIds | null = null;

	/**
	 * Should the erase button be visible?
	 */
	public get showEraseValueBtn() : boolean {
		if (!this._showEraseValueBtn) return false;
		if (this.supportsUndefined && this.value !== 0) return true;
		if (!this.value) return false;
		return true;
	}

	/**
	 * Calculates the difference between the maximum date and the given value in days.
	 */
	private timestampToDaysBefore(timestamp : number | null) : number | null {
		if (!this.max) return null;
		if (!timestamp || +timestamp <= 0) return null;
		const N = this.isExclusiveEnd ? this.max + 1 : this.max;
		const DURATION = N - +timestamp;
		let days : number = (new PMomentService(this.locale)).duration(DURATION).asDays();
		days = this.isExclusiveEnd ? days + 1 : days;
		return Math.floor(days);
	}

	/**
	 * Turn a given "days before" value into a timestamp
	 */
	private daysBeforeToTimestamp(value : number | string | undefined) : DateTime | null {
		if (!this.max) return null;
		if (value === undefined || value === '' || Number.isNaN(+value)) return null;
		// if (value === 0) return this.max;
		let days : number = +value;
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
	private initFormGroup() : void {
		if (this.formGroup) { this.formGroup = null; }

		const tempFormGroup = this.pFormsService.group({});

		const INITIAL_DAYS_BEFORE_VALUE = this.timestampToDaysBefore(this.value);

		this.pFormsService.addControl(tempFormGroup, 'daysBefore',
			{
				value: INITIAL_DAYS_BEFORE_VALUE,
				disabled: false,
			},
			[
				new PValidatorObject({name: PPossibleErrorNames.MAX_DECIMAL_PLACES_COUNT, fn: (control) => {
					if (!this.showDaysBeforeInput) return null;
					if (!control.value) return null;
					if (Number.isNaN(+control.value)) return null;
					return this.validators.maxDecimalPlacesCount(0, PApiPrimitiveTypes.Integer).fn({value : +control.value});
				}}),
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					if (!this.showDaysBeforeInput) return null;
					if (!this.required) return null;
					return this.validators.required(PApiPrimitiveTypes.number).fn(control);
				}}),
				new PValidatorObject({name: PPossibleErrorNames.MIN, fn: (control) => {
					if (!this.showDaysBeforeInput) return null;
					if (!control.value) return null;
					if (!this.min) return null;

					// The daysBefore value combined with the max value results to a deadline
					const CALCULATED_DEADLINE = this.daysBeforeToTimestamp(control.value);

					// NOTE: Seems hacky. Not sure if necessary.
					const MIN_TOLERANCE = 1000 * 60;

					assumeDefinedToGetStrictNullChecksRunning(CALCULATED_DEADLINE, 'CALCULATED_DEADLINE');
					if (CALCULATED_DEADLINE >= (this.min + MIN_TOLERANCE)) return null;
					return { [PPossibleErrorNames.MIN] : {
						name: PPossibleErrorNames.MIN,
						primitiveType: PApiPrimitiveTypes.Days,
						actual: control.value,
					} };
				}}),
				new PValidatorObject({name: PPossibleErrorNames.MAX, fn: (control) => {
					if (!this.showDaysBeforeInput) return null;
					if (!control.value) return null;
					if (!this.max) return null;

					// The daysBefore value combined with the max value results to a deadline
					const CALCULATED_DEADLINE = this.daysBeforeToTimestamp(control.value);
					assumeDefinedToGetStrictNullChecksRunning(CALCULATED_DEADLINE, 'CALCULATED_DEADLINE');
					if (CALCULATED_DEADLINE <= (this.max + (this.isExclusiveEnd ? 1 : 0))) return null;
					return { [PPossibleErrorNames.MAX]: {
						name: PPossibleErrorNames.MAX,
						primitiveType: PApiPrimitiveTypes.Days,
						actual: control.value,
					} };
				}}),
			],
			(value : number | string) => {
				if (this.type !== PInputDateTypes.deadline) return;
				this.setDateBeforeModel(value);
			},
		);

		const refreshDaysBefore = (value : DateTime | null) : void => {
			const result = this.timestampToDaysBefore(value);
			const control = tempFormGroup.get('daysBefore');
			assumeDefinedToGetStrictNullChecksRunning(control, 'control');
			if (`${control.value}` !== `${result}`) {
				control.setValue(result);
			}
		};

		this.pFormsService.addControl(tempFormGroup, 'date',
			{
				value : this.ngbDate,
				disabled: false,
			},
			[
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					if (control.value !== '-') return null;

					// If the outer control (the one that is bound to this component) is not required,
					// then there is one case left, where we want to mark the internal 'date' control as required:
					// If the user has provided some 'time' data, but has not yet selected a date.
					if (!this.required) {
						const userHasTypedInATime = this.showTimeInput && tempFormGroup.get('time')?.value;
						if (!userHasTypedInATime) return null;
					}

					const emptyControl = new PFormControl({
						formState: {
							value : undefined,
							disabled: false,
						},
					});
					return this.validators.required(PApiPrimitiveTypes.string).fn(emptyControl);
				}}),
			],
			(value : NgbDateStruct | null) => {
				const timeControl = tempFormGroup.get('time');
				assumeNonNull(timeControl);
				timeControl.updateValueAndValidity();
				if (!this.showTimeInput) {
					if (!(this.type === PInputDateTypes.deadline && this.showDaysBeforeInput)) {
						this.modalRef!.close();
					}
					this.setControlValue();
				}

				if (value === null) return;

				const TIMESTAMP = this.ngbFormatsService.dateTimeObjectToTimestamp(value, this.locale);
				refreshDaysBefore(TIMESTAMP);
			},
		);

		this.pFormsService.addControl(tempFormGroup, 'time',
			{
				value : this.selectedTime,
				disabled: false,
			},
			[
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					if (!this.showTimeInput) return null;
					return this.validators.required(PApiPrimitiveTypes.LocalTime).fn(control);
				}}),
				new PValidatorObject({name: PPossibleErrorNames.MIN, fn: () => {
					if (!this.showTimeInput) return null;
					if (!this.selectedDateTime) return null;
					if (!this.min) return null;
					if (this.selectedDateTime >= (this.min + (1000 * 60))) return null;
					return { [PPossibleErrorNames.MIN] : {
						name: PPossibleErrorNames.MIN,
						primitiveType: PApiPrimitiveTypes.DateTime,
						errorText: 'Wähle bitte eine Zeit später als »${min}«.',
						min: this.min,
					} };
				}}),
				new PValidatorObject({name: PPossibleErrorNames.MAX, fn: () => {
					if (!this.showTimeInput) return null;
					if (!this.selectedDateTime) return null;
					if (!this.max) return null;
					if (this.selectedDateTime <= (this.max - (1000 * 60))) return null;
					return { [PPossibleErrorNames.MAX] : {
						name: PPossibleErrorNames.MAX,
						primitiveType: PApiPrimitiveTypes.DateTime,
						errorText: 'Die Zeit muss vor »${max}« liegen',
						max: this.max,
					} };
				}}),
			],
		);

		// this.setDateBeforeModel(INITIAL_DAYS_BEFORE_VALUE);

		this.formGroup = tempFormGroup;
	}

	/**
	 * Sets a new value to the 'daysBefore' property.
	 */
	private setDaysBeforeModel(input : number | null) : void {
		this.daysBefore = input;
		this.daysBeforeChange.emit(input);
	}

	/**
	 * Sets a new value to the internal control which gets used for binding to the date-picker.
	 */
	private setDateControlValue(input : NgbDateStruct | '-') : void {
		if (!this.formGroup) return;
		const dateControl = this.formGroup.get('date');
		if (!dateControl) return;
		// NOTE: Do Nothing if date has not changed
		if (this.deepEqualDateStruct(dateControl.value, input)) return;
		dateControl.setValue(input);
	}

	private setDateBeforeModel(value : number | string | null) : void {
		let newDaysBeforeValue : number | null = null;
		let newDateValue : NgbDateStruct | '-' | null;
		if (value === null || value === '' || Number.isNaN(+value)) {
			newDaysBeforeValue = null;
			newDateValue = null;
		} else {
			assumeDefinedToGetStrictNullChecksRunning(this.daysBefore, 'daysBefore');
			if (+this.daysBefore === +value) return;

			newDaysBeforeValue = +value;
			const newDeadline = this.daysBeforeToTimestamp(newDaysBeforeValue);
			assumeDefinedToGetStrictNullChecksRunning(newDeadline, 'newDeadline');
			newDateValue = this.ngbFormatsService.timestampToDateStruct(newDeadline, this.locale);
		}

		this.setDaysBeforeModel(newDaysBeforeValue);
		this.setDateControlValue(newDateValue ?? '-');
		this.setControlValue();
	}

	/**
	 * Check if these dates are the same
	 */
	private deepEqualDateStruct(input1 : NgbDateStruct | '-' | null, input2 : NgbDateStruct | '-' | null) : boolean {
		if (!input1 || input1 === '-' || !input2 || input2 === '-') return input1 === input2;
		if (
			input1.day === input2.day &&
			input1.month === input2.month &&
			input1.year === input2.year
		) return true;
		return false;
	}

	public override ngAfterContentInit() : never {
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
	private validateValues() : void {
		if (Config.DEBUG && this.showDaysBeforeInput && this.pEditable) {
			throw new Error('PLANO-14566: input-date does not work with active pEditable yet.');
		}
		// TODO: (PLANO-53380)
		if (!!this.cannotEditHint) throw new Error('cannotEditHint not implemented yet in this component. See PLANO-53380');
		if (this.suggestionTimestamp !== null && !this.suggestionLabel) throw new Error('suggestionLabel must be defined if suggestionTimestamp is provided');
	}

	public showEraseValueBtnIcon : boolean = false;

	private determineType() : void {
		if (this.type !== null) throw new Error('No need to determine type when it is already set');
		if (this.icon === PlanoFaIconPool.BIRTHDAY) {
			this.type = PInputDateTypes.birth as PInputDateTypes.deadline; // HACK: PLANO-151942 We dont want developers to set PInputDateTypes.birth from outside anymore.
		}
		if (this.min !== null && +(new PMomentService(this.locale).m().subtract(80, 'years')) > this.min) {
			this.type = PInputDateTypes.birth as PInputDateTypes.deadline; // HACK: PLANO-151942 We dont want developers to set PInputDateTypes.birth from outside anymore.
		}
	}

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	private initValues() : void {
		this.now = +(new PMomentService(this.locale).m());
		this.initValuesByControlValue();
		if (this.type === null) this.determineType();
		switch (this.type) {
		// TODO: Remove this, when all datepickers are bound to attributeInfo
			case PInputDateTypes.birth as PInputDateTypes.deadline : // HACK: PLANO-151942 We dont want developers to set PInputDateTypes.birth from outside anymore.
				if (!this.max) this.max = +(new PMomentService(this.locale).m());
				if (this.showNowButton === null) this.showNowButton = false;

				// HACK: Don’t know why but sometimes startDate was 1.1.1970
				// We had this again. We checkt requests and we proofed that new cse does not has anything to do with a
				// birth day in 1970.
				// Conclusion:
				//   - It’s completely a frontend thing
				//   - It does not lead to wrong api-requests
				//   - it has NOTHING TO DO with people that where born on 1.1.1970.
				const VALUE_YEAR = new PMomentService(this.locale).m(this.value).get('year');
				const SOMETHING_IS_BROKEN = (
					this.startDate && this.startDate !== '-' && this.startDate.year === 1970 && VALUE_YEAR !== 1970
				);
				if (SOMETHING_IS_BROKEN && !Config.DEBUG) {
					// this never happened in at last a year
					this.console.error('startDate is defined but 1970. Not sure if this is intended');
				}

				if (this.startDate === null || SOMETHING_IS_BROKEN) {
					if (this.ngbDate !== null && this.ngbDate !== '-') {
						this.startDate = this.ngbDate;
					} else {
						const EIGHTEEN_YEARS_AGO = +(new PMomentService(this.locale).m().subtract(18, 'years'));
						const INITIAL_START_DATE = this.ngbFormatsService.timestampToDateStruct(EIGHTEEN_YEARS_AGO, this.locale);
						this.startDate = INITIAL_START_DATE;
					}
				}
				break;
			case PInputDateTypes.deadline :
				this.isExclusiveEnd = true;
				break;
			default :
				if (this.showNowButton === null) this.showNowButton = true;
				this.startDate = this.ngbDate;
		}
		if (this.isExclusiveEnd === null) this.isExclusiveEnd = false;
		if (this.showTimeInput === null) this.showTimeInput = false;
		if (this.daysBefore === null) this.setDaysBeforeModel(this.timestampToDaysBefore(this.value));
		this.initFormGroup();
	}

	private initValuesByControlValue() : void {
		if (this.showDaysBeforeInput === null) this.showDaysBeforeInput = this.type === PInputDateTypes.deadline && !this.value;
		if (this.isExclusiveEnd && !this.showTimeInput) {
			this.ngbDate = this.value ? this.ngbFormatsService.timestampToDateStruct(this.value - 1, this.locale) : '-';
		} else {
			this.ngbDate = this.value ? this.ngbFormatsService.timestampToDateStruct(this.value, this.locale) : '-';
		}
	}

	/**
	 * Timestamp to 'DD.MM.YYYY[ | HH:mm]'
	 */
	public get formattedDateTime() : string | null {
		if (!this.value) return '';
		let resultTimestamp : number = this.value;
		if (this.isExclusiveEnd && !this.showTimeInput) resultTimestamp = resultTimestamp - 1;

		// eslint-disable-next-line @typescript-eslint/naming-convention
		let DATE_FORMAT : DateFormats;
		if (this.range === CalendarModes.MONTH) {
			DATE_FORMAT = 'MM.YY';
		} else {
			DATE_FORMAT = Config.IS_MOBILE ? 'veryShortDate' : 'shortDate';
		}

		let result : string | null = this.datePipe.transform(resultTimestamp, DATE_FORMAT, undefined, this.locale);
		if (this.showTimeInput) result += ` | ${this.datePipe.transform(resultTimestamp, 'shortTime', undefined, this.locale)}`;
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get placeholder() : string {
		// TODO: Get rid of `this._placeholder !== undefined` here
		if (this._placeholder !== null) return this._placeholder;
		let result = this.localize.transform('--.--.----');
		if (this.showTimeInput) {
			result += ' | ';
			result += this.localize.transform('--:--');
		}
		return result;
	}

	private addExclusiveMillisecondIfNecessary(input : number) : number {
		if (this.type === PInputDateTypes.deadline) return input;
		if (!this.isExclusiveEnd) return input;
		if (this.showTimeInput) return input;
		return +(new PMomentService(this.locale)).m(input).add(1, 'day').startOf('day');
	}

	/**
	 * Set startTime and endTime values and validators and update them.
	 */
	public setControlValue() : void {
		if (!this.selectedDateTime) {
			if (this.attributeInfo) {
				this.value = null;
			} else {
				// In DateTime 0 means null
				this.value = 0;
			}
			return;
		}

		this.value = this.addExclusiveMillisecondIfNecessary(this.selectedDateTime);
		if (this.formControl) this.formControl.markAsTouched();

		/** No footer that can be clicked. So selecting a day should trigger the save pEditable. */
		if (!this.showTimeInput && this.pEditable && this.isValid) {
			this.api!.save();
			this.animateSuccessButton();
		}
	}

	/**
	 * Get a timestamp of the selected time only (without the milliseconds of the selected date)
	 */
	public get selectedTime() : number | null {
		return this.valueToTimeTimestamp(this.value);
	}

	/**
	 * Remove the date milliseconds from a timestamp and leave the time-related milliseconds
	 */
	private valueToTimeTimestamp(input : number | null) : number | null {
		if (input === null) return null;
		const TIME_AS_STRING = (new PMomentService(this.locale)).m(input).format('HH:mm');
		return (new PMomentService(this.locale)).d(TIME_AS_STRING).asMilliseconds();
	}

	/**
	 * Get a timestamp that involves both date and time combined
	 */
	public get selectedDateTime() : DateTime | null {
		if (!this.formGroup) return 0;
		// if (this.supportsUndefined && this.formGroup.get('date'].value === undefined && this.formGroup.controls['time').value === undefined) {
		// 	return undefined;
		// }
		return this.pInputDateService.convertNgbDateAndNgbTimeToTimestamp(
			this.locale,
			this.formGroup.get('date')!.value,
			this.formGroup.get('time')!.value,
			this.showTimeInput,
		);
	}

	/**
	 * Set date [and time] to now
	 */
	public onClickNow() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		this.formGroup.get('date')!.setValue( this.ngbFormatsService.timestampToDateStruct(this.now, this.locale) );
		this.formGroup.get('time')!.setValue( this.valueToTimeTimestamp(this.now) );
	}

	/**
	 * Set date [and time] to now
	 */
	public onClickSuggestion() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		if (this.suggestionTimestamp === null) throw new Error('button should not have been visible, if suggestionTimestamp is not provided');
		if (this.min && this.suggestionTimestamp < this.min) throw new Error('suggestion is before min. Button should not have been clickable');
		this.formGroup.get('date')!.setValue( this.ngbFormatsService.timestampToDateStruct(this.suggestionTimestamp, this.locale) );
		this.formGroup.get('time')!.setValue( this.valueToTimeTimestamp(this.suggestionTimestamp) );
	}

	/**
	 * Remove all input data and remove data from PFormControl
	 */
	public unsetData() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		this.formGroup.get('time')!.setValue(undefined);
		this.formGroup.get('date')!.setValue(undefined);
		this.ngbDate = null;
		this.value = 0;
		this.animateSuccessButton();
	}

	/**
	 * Check if user input is the current time (plus/minus a tolerance)
	 */
	public get isCurrentDateTime() : boolean {
		let result : boolean = false;

		// Tolerance in minutes
		const TOLERANCE : number = 10;

		const formattedDateTime : PMoment.Moment = (new PMomentService(this.locale)).m(this.selectedDateTime);
		if (this.showTimeInput) {
			result = formattedDateTime.isBetween(
				(new PMomentService(this.locale)).m().subtract(TOLERANCE, 'minutes'),
				(new PMomentService(this.locale)).m().add(TOLERANCE, 'minutes'),
			);
		} else {
			result = formattedDateTime.isSame((new PMomentService(this.locale)).m(this.locale), 'day');
		}
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get nowButtonIsDisabled() : boolean {
		let now : number | null = null;
		if (!this.showTimeInput) {
			now = +(new PMomentService(this.locale)).m(this.now).startOf('day');
		} else {
			now = this.now;
		}
		const underMin = !!this.min && now < this.min;
		const overMax = !!this.max && now > this.max;
		return underMin || overMax;
	}

	/**
	 * Wait for animation
	 */
	private waitForAnimation(callback : () => void) : void {
		this.zone.runOutsideAngular(() => {
			window.setTimeout(() => {
				this.zone.run(() => {
					callback();
				});
			}, 600);
		});
	}

	public clicked : boolean = false;
	private animateSuccessButton() : void {
		this.clicked = true;
		this.waitForAnimation(() => {
			this.clicked = false;
		});
	}

	/**
	 * Open a modal with datepicker or other input to edit the value
	 */
	public editDate(event : Event) : void {
		this.startDate = null;
		this.initValues();

		this.modalRef = this.modalService.openModal(this.modalContent, {
			size: this.showTimeInput ? null : 'sm',
			centered: false,
			success: () => {
				(event.target as HTMLElement).blur();
				if ($('.modal.show').length) {
					$('.modal.show').trigger('focus');
				}
			},

			/* BUG: fix shadowed value param */
			// eslint-disable-next-line @typescript-eslint/no-shadow
			dismiss: (event : Event | 0 | 1 | undefined) => {
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
							const target = event.target as HTMLElement | undefined;
							target?.blur();
						} else {
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

	// These are necessary Inputs and Outputs for pEditable form-element
	@Input() public pEditable : EditableControlInterface['pEditable'] = false;
	@Input() public api : EditableControlInterface['api'] = null;
	@Input() public valid : EditableControlInterface['valid'] = null;
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

	@Input('readMode') private _readMode : PFormControlComponentInterface['readMode'] = null;
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get readMode() : PFormControlComponentInterface['readMode'] {
		if (this._readMode !== null) return this._readMode;
		return this.disabled;
	}

	public ngAfterViewInit() : void {
	}

	@Input('required') private _required : boolean = false;

	/**
	 * Is this a required field?
	 * This can be set as Input() but if there is a formControl binding,
	 * then it takes the info from the formControl’s validators.
	 */
	public get required() : boolean {
		if (this._required) return this._required;
		return this.formControlInitialRequired();
	}

	private _value : ValueType | null = null;
	public override _onChange : (value : ValueType | null) => void = () => {};
	// @Output() public change : EventEmitter<Event> = new EventEmitter<Event>();
	/** onTouched */
	public onTouched = () : void => {};

	/** the value of this control */
	public get value() : ValueType | null { return this._value; }
	public set value(value : ValueType | null) {
		if (value === this._value) return;

		this._value = value;
		this.changeDetectorRef.markForCheck();
		this._onChange(value);
	}

	/** Write a new value to the element. */
	public writeValue(value : ValueType) : void {
		if (this._value === value) return;
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
	public registerOnChange(fn : (value : ValueType | null) => void) : ReturnType<ControlValueAccessor['registerOnChange']> {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this._onChange = (value : any) => {
			fn(value);
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

	@Input() private daysBeforeLabel : string | null = null;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get daysBeforeDropdownLabel() : string {
		if (this.daysBeforeLabel !== null) return this.daysBeforeLabel;
		if (!this.showDaysBeforeInput) return this.localize.transform('Datum');
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		const dayText = +this.formGroup.get('daysBefore')!.value === 1 ? this.localize.transform('Tag') : this.localize.transform('Tage');
		return this.localize.transform('${dayText} vor Schicht', { dayText: dayText });
	}

	public override ngOnDestroy() : never {
		if (this.modalRef) this.modalRef.dismiss();
		return super.ngOnDestroy();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get successButtonIsHighlighted() : boolean {
		return this.value !== this.selectedDateTime;
	}

	@Input() public eraseValueBtnLabel : string | null = null;

	/** Filter all errors that should be shown in the ui. */
	public get visibleErrors() : VisibleErrorsType {
		return this.pFormsService.visibleErrors(this.formControl!);
	}

	@Input('icon') private icon : PlanoFaIconPoolValues | null = null;

	/** Icon to le left of the input */
	public get prependIcon() : PlanoFaIconPoolValues {
		if (!!this.icon) return this.icon;
		// TODO: Remove this, when all datepickers are bound to attributeInfo
		if (this.type === (PInputDateTypes.birth as PInputDateTypes.deadline)) return PlanoFaIconPool.BIRTHDAY; // HACK: PLANO-151942 We dont want developers to set PInputDateTypes.birth from outside anymore.
		return !!this.value ? PlanoFaIconPool.STATE_DATE_PICKED : PlanoFaIconPool.STATE_DATE_EMPTY;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get hasDanger() : boolean {
		if (!!this.formControl && !this.formControl.touched) return false;
		if (!this.isValid) return true;
		const daysBeforeControl = this.formGroup?.get('daysBefore');
		if (daysBeforeControl) return daysBeforeControl.invalid;
		return false;
	}
}
