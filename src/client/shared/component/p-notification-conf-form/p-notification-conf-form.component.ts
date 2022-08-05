/* eslint-disable unicorn/prevent-abbreviations */
import { AfterContentInit, AfterContentChecked, AfterViewInit} from '@angular/core';
import { Component, ChangeDetectionStrategy, forwardRef, EventEmitter, Output, ChangeDetectorRef, ElementRef, NgZone, ApplicationRef } from '@angular/core';
import { Input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PFormControl } from '@plano/client/shared/p-forms/p-form-control';
import { SchedulingApiShift, SchedulingApiShiftChangeSelector } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '../../../../shared/core/plano-fa-icon-pool.enum';
import { ToastsService } from '../../../service/toasts.service';
import { EditableDirective } from '../../p-editable/editable/editable.directive';
import { EditableControlInterface } from '../../p-editable/editable/editable.directive';

type ValueType = boolean;

/**
 * <p-notification-conf-form> provides form controls to set notification configuration values.
 */

@Component({
	selector: 'p-notification-conf-form',
	templateUrl: './p-notification-conf-form.component.html',
	styleUrls: ['./p-notification-conf-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PNotificationConfFormComponent),
			multi: true,
		},
		EditableDirective,
	],
})
export class PNotificationConfFormComponent extends EditableDirective
	implements ControlValueAccessor, EditableControlInterface, AfterContentInit, AfterContentChecked, AfterViewInit {
	@Input() private shift : SchedulingApiShift | null = null;
	@Input() public valueText : string | null = null;

	// These are necessary Inputs and Outputs for pEditable form-element
	@Input() public override pEditable : EditableControlInterface['pEditable'] = false;
	@Input() public override api : EditableControlInterface['api'] = null;
	@Input() public override valid : EditableControlInterface['valid'] = null;
	@Input() public override saveChangesHook : Exclude<EditableControlInterface['saveChangesHook'], undefined> = () => {};
	@Output() public override onSaveStart : EditableControlInterface['onSaveStart'] = new EventEmitter();
	@Output() public override onSaveSuccess : EditableControlInterface['onSaveSuccess'] = new EventEmitter();
	@Output() public override onDismiss : EditableDirective['onDismiss'] = new EventEmitter();
	@Output() public override onLeaveCurrent : EditableControlInterface['onLeaveCurrent'] = new EventEmitter();
	@Output() public override editMode : EditableControlInterface['editMode'] = new EventEmitter<boolean>(undefined);

	/** Is this valid? [valid]="…" overwrites the valid state if the formControl. */
	public get isValid() : boolean {
		if (this.valid !== null) return this.valid;
		return !this.formControl?.invalid;
	}

	constructor(
		protected override readonly changeDetectorRef : ChangeDetectorRef,
		public override el : ElementRef<HTMLElement>,
		protected override readonly zone : NgZone,
		public override applicationRef : ApplicationRef,
		protected override console : LogService,
		protected override toastsService : ToastsService,
		protected override localize : LocalizePipe,
	) {
		super(changeDetectorRef, el, zone, applicationRef, console, toastsService, localize);
		if (this.valueText === null) this.valueText = this.localize.transform('Eingeteilte User informieren');
	}

	public PlanoFaIconPool = PlanoFaIconPool;

	public override ngAfterContentInit() : void {
	}

	/**
	 * Is this control visible or not?
	 */
	public get visible() : boolean {
		if (!this.shift) return true;
		if ((this.api!.data.shiftChangeSelector as SchedulingApiShiftChangeSelector).isChangingShifts) return true;
		if (!this.shift.assignmentProcess) return true;
		if (this.shift.assignmentProcess.state === SchedulingApiAssignmentProcessState.EARLY_BIRD_SCHEDULING) return true;
		if (this.shift.assignmentProcess.state === SchedulingApiAssignmentProcessState.EARLY_BIRD_FINISHED) return true;
		return 	false;
	}

	/**
	 * This is the minimum code that is required for a custom control in Angular.
	 * Its necessary to make [(ngModel)] and [formControl] work.
	 */
	@Input() public disabled : boolean = false;
	@Input() public formControl : PFormControl | null = null;
	private _value : ValueType | null = null;
	public onChange : (value : ValueType | null) => void = () => {};

	/** onTouched */
	public onTouched = () : void => {};

	/** the value of this control */
	public get value() : ValueType | null { return this._value; }
	public set value(value : ValueType | null) {
		if (value === this._value) return;

		this._value = !!value;
		this.onChange(value);
	}

	/** Write a new value to the element. */
	public writeValue(value : ValueType) : void {
		if (this._value === value) return;
		this._value = !!value;
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
