import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { forwardRef } from '@angular/core';
import { ControlValueAccessor} from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { EditableControlInterface, EditableDirective } from '@plano/client/shared/p-editable/editable/editable.directive';
import { FaIconComponent } from '@plano/shared/core/component/fa-icon/fa-icon.component';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PFormControl } from '../../p-form-control';

type ValueType = string;

@Component({
	selector: 'p-radio',
	templateUrl: './p-radio.component.html',
	styleUrls: ['./p-radio.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PRadioComponent),
			multi: true,
		},
	],
})
export class PRadioComponent implements ControlValueAccessor, EditableControlInterface {
	@Input() public btn : boolean = true;
	@Output() public checkedChange : EventEmitter<Event> = new EventEmitter<Event>();
	@Input() public checked : boolean = false;
	@Input() public card : boolean = false;
	@Input() public icon : FaIconComponent['icon'] | null = null;

	constructor(
		private changeDetectorRef : ChangeDetectorRef,
	) {}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get radioIcon() : FaIconComponent['icon'] | null {
		if (!!this.icon) return this.icon;
		if (this.checked || (this.hover && !this.disabled)) return PlanoFaIconPool.RADIO_SELECTED;
		return PlanoFaIconPool.RADIO_UNSELECTED;
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
		if (this.valid !== null) return this.valid;
		return !this.formControl?.invalid;
	}

	public hover : boolean = false;

	/**
	 * This is the minimum code that is required for a custom control in Angular.
	 * Its necessary to make [(ngModel)] and [formControl] work.
	 */
	@Input() public disabled : boolean = false;
	@Input() public required : boolean = false;
	@Input() public formControl : PFormControl | null = null;

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
