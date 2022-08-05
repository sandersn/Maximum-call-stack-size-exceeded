import { Component, ChangeDetectionStrategy, forwardRef, Input, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SLIDE_ON_NGIF_TRIGGER } from '@plano/animations';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiShifts, SchedulingApiService, SchedulingApiAbsences, SchedulingApiHolidays } from '@plano/shared/api';
import { SchedulingApiShiftExchangeCommunicationSwapOffers } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { SchedulingApiShiftExchangeCommunicationSwapOffer } from '@plano/shared/api';
import { SchedulingApiWarnings } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { PPossibleErrorNames } from '@plano/shared/core/validators.types';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../shared/core/null-type-utils';
import { BirthdayService } from '../../../scheduling/shared/api/birthday.service';
import { SchedulingApiBirthdays } from '../../../scheduling/shared/api/scheduling-api-birthday.service';
import { BootstrapSize, PThemeEnum } from '../../bootstrap-styles.enum';
import { PFormControl } from '../../p-forms/p-form-control';
import { SectionWhitespace } from '../../page/section/section.component';
import { PossibleShiftPickerValueItemType } from '../p-shift-picker/p-shift-picker.component';

type ValueType = Id | null;

@Component({
	selector: 'p-offer-picker[offers]',
	templateUrl: './p-offer-picker.component.html',
	styleUrls: ['./p-offer-picker.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => POfferPickerComponent),
			multi: true,
		},
	],
	animations: [SLIDE_ON_NGIF_TRIGGER],
})
export class POfferPickerComponent implements ControlValueAccessor {
	@Input() public offers ! : SchedulingApiShiftExchangeCommunicationSwapOffers;

	@Input() public shiftTemplate : TemplateRef<unknown> | null = null;

	public readonly CONFIG : typeof Config = Config;

	public showList : boolean = true;

	public selectedDate ! : number;
	public calendarMode : CalendarModes = CalendarModes.MONTH;

	constructor(
		private api : SchedulingApiService,
		private meService : MeService,
		private pMoment : PMomentService,
		private changeDetectorRef : ChangeDetectorRef,
		private birthdayService : BirthdayService,
	) {
		this.initValues();
	}

	public PThemeEnum = PThemeEnum;
	public BootstrapSize = BootstrapSize;
	public CalendarModes = CalendarModes;
	public SectionWhitespace = SectionWhitespace;

	/**
	 * Get the absences that should be available to the calendar component
	 */
	public get absences() : SchedulingApiAbsences {
		if (!this.api.isLoaded()) return new SchedulingApiAbsences(null, false);
		return this.api.data.absences;
	}

	/**
	 * Get the holidays that should be available to the calendar component
	 */
	public get holidays() : SchedulingApiHolidays {
		if (!this.api.isLoaded()) return new SchedulingApiHolidays(null, false);
		return this.api.data.holidays;
	}

	/**
	 * Get the birthdays that should be available to the calendar component
	 */
	public get birthdays() : SchedulingApiBirthdays {
		if (!this.api.isLoaded()) return new SchedulingApiBirthdays(null, null, false);
		return this.birthdayService.birthdays;
	}

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	private initValues() : void {
		this.selectedDate = +this.pMoment.m().startOf('day');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onSelectOffer(offer : SchedulingApiShiftExchangeCommunicationSwapOffer | PossibleShiftPickerValueItemType) : void {
		// We know that it only can be an SchedulingApiShiftExchangeCommunicationSwapOffer here
		const OFFER : SchedulingApiShiftExchangeCommunicationSwapOffer = offer as SchedulingApiShiftExchangeCommunicationSwapOffer;

		if (this.value?.equals(OFFER.id)) {
			this.value = null;
			this.highlightOffer(null);
			return;
		}
		this.value = OFFER.id;
		this.highlightOffer(OFFER);
	}

	private highlightOffer(offer : SchedulingApiShiftExchangeCommunicationSwapOffer | null) : void {
		this.api.deselectAllSelections();
		if (offer === null) return;
		for (const shiftRef of offer.shiftRefs.iterable()) {
			const shift = this.api.data.shifts.get(shiftRef.id);
			assumeNonNull(shift);
			shift.selected = true;
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public setSelectedDateAndLoadData(value : number) : void {
		this.selectedDate = value;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public setCalendarModeAndLoadData(value : CalendarModes) : void {
		this.calendarMode = value;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftsForOfferPicker() : SchedulingApiShifts {
		if (!this.offers.length) return new SchedulingApiShifts(null, false);
		return this.api.data.shifts.filterBy((item) => {
			if (this.offers.containsShiftId(item.id)) return true;
			if (item.assignableMembers.contains(this.meService.data.id)) return true;
			return false;
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get warnings() : SchedulingApiWarnings {
		assumeDefinedToGetStrictNullChecksRunning(this.api.data.warnings, 'api.data.warnings');
		return this.api.data.warnings;
	}

	/**
	 * This is the minimum code that is required for a custom control in Angular.
	 * Its necessary to make [(ngModel)] and [formControl] work.
	 */
	@Input() public disabled : boolean = false;
	@Input() public formControl : PFormControl | null = null;
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isValid() : boolean {
		return !this.formControl || !this.formControl.invalid;
	}

	@Input('required') private _required : boolean | null = null;

	/**
	 * Is this a required field?
	 * This can be set as Input() but if there is a formControl binding,
	 * then it takes the info from the formControl’s validators.
	 * TODO: 	Replace this by:
	 * 				return this.formControlInitialRequired();
	 */
	public get required() : boolean {
		if (this._required) return this._required;
		if (this.formControl) {
			const validator = this.formControl.validator?.(this.formControl);
			if (!validator) return false;
			return !!validator[PPossibleErrorNames.REQUIRED] || !!validator[PPossibleErrorNames.ID_DEFINED] || !!validator[PPossibleErrorNames.NOT_UNDEFINED];
		}
		return false;
	}

	private _value : ValueType | null = null;
	public onChange : (value : ValueType | null) => void = () => {};

	/** onTouched */
	public onTouched = () : void => {};

	/** the value of this control */
	public get value() : ValueType | null { return this._value; }
	public set value(value : ValueType | null) {
		if (value === this._value) return;

		this._value = value;
		this.onChange(value);
	}

	/** Write a new value to the element. */
	public writeValue(value : ValueType) : void {
		if (this._value === value) return;
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
	public registerOnChange(fn : (value : ValueType | null) => void) : ReturnType<ControlValueAccessor['registerOnChange']> { this.onChange = fn; }

	/** Set the function to be called when the control receives a touch event. */
	public registerOnTouched(fn : () => void) : void { this.onTouched = fn; }

	/** setDisabledState */
	public setDisabledState(isDisabled : boolean) : void {
		if (this.disabled === isDisabled) return;
		// Set internal attribute which gets used in the template.
		this.disabled = isDisabled;
		// Refresh the formControl. #two-way-binding
		if (this.formControl && this.formControl.disabled !== this.disabled) {
			this.disabled ? this.formControl.disable() : this.formControl.enable();
		}
	}
}
