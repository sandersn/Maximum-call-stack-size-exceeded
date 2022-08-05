import { AfterContentInit } from '@angular/core';
import { Component, Input, ChangeDetectionStrategy, forwardRef, ChangeDetectorRef, HostBinding } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SchedulingApiShiftModel } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { SchedulingApiShiftModels } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { PFormControl } from '@plano/client/shared/p-forms/p-form-control';
import { Id } from '@plano/shared/api/base/id';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PPossibleErrorNames } from '@plano/shared/core/validators.types';
import { PApiPrimitiveTypes } from '../../../../shared/api/base/generated-types.ag';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { PThemeEnum } from '../../bootstrap-styles.enum';

type ValueType = Id | null;

@Component({
	selector: 'p-input-shiftmodel-id-modal[shiftModels]',
	templateUrl: './input-shiftmodel-id-modal.component.html',
	styleUrls: ['./input-shiftmodel-id-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PInputShiftModelIdModalComponent),
			multi: true,
		},
	],
})
export class PInputShiftModelIdModalComponent implements AfterContentInit, ControlValueAccessor {
	@Input('label') private _label : string | null = null;
	@HostBinding('class.d-flex')
	@HostBinding('class.btn-group') private _alwaysTrue = true;
	@Input() private shiftModels ! : SchedulingApiShiftModels;
	@Input() public searchTerm : string | null = null;

	constructor(
		private changeDetectorRef : ChangeDetectorRef,
		private localizePipe : LocalizePipe,
	) {
	}

	public PThemeEnum = PThemeEnum;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;

	public ngAfterContentInit() : void {
		this.initValues();
		this.selectedItemId = this.value;
	}

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	private initValues() : void {
		if (this._label === null) this._label = this.localizePipe.transform('Tätigkeit wählen …');
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get valueItem() : SchedulingApiShiftModel | null {
		if (!this.value) return null;
		return this.shiftModels.get(this.value);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get label() : string | null {
		// if (this.value !== null) return this.shiftModelsForList.get(this.value).name;
		if (this.value !== null) return null;
		return this._label;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public onItemClick(item : SchedulingApiShiftModel | null) : void {
		if (item === null) {
			this.selectedItemId = null;
			return;
		}
		this.selectedItemId = item.id;
	}

	private selectedItemId : Id | null = null;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public onModalClosed() : void {
		this.searchTerm = null;
		this.value = this.selectedItemId;
		this.selectedItemId = null;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public isSelected(item : SchedulingApiShiftModel) : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.selectedItemId, 'selectedItemId');
		return this.selectedItemId.equals(item.id);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get shiftModelsForList() : SchedulingApiShiftModels {
		return this.shiftModels.search(this.searchTerm);
	}

	/*
	 * This is the minimum code that is required for a custom control in Angular.
	 * Its necessary to make [(ngModel)] and [formControl] work.
	 */
	@Input() public disabled : boolean = false;
	@Input() public formControl : PFormControl | null = null;
	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isValid() : boolean {
		return !this.formControl || !this.formControl.invalid;
	}

	@Input('required') private _required : boolean = false;

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
