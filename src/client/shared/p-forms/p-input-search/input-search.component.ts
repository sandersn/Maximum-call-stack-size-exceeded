import { Component, Input, forwardRef, ChangeDetectorRef, EventEmitter, Output, HostBinding, ViewChild, HostListener, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SLIDE_HORIZONTAL_ON_NGIF_TRIGGER, SLIDE_WIDTH_100_ON_BOOLEAN_TRIGGER, FLEX_GROW_ON_NGIF_TRIGGER } from '@plano/animations';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { BootstrapRounded, BootstrapSize, PBtnTheme, PBtnThemeEnum, PThemeEnum } from '../../bootstrap-styles.enum';
import { PFormControl } from '../p-form-control';
import { PFormControlComponentInterface } from '../p-form-control.interface';

type ValueType = string | null;

/**
 * <p-input-search> is much like <p-input> but specifically made for searches
 */

@Component({
	selector: 'p-input-search',
	templateUrl: './input-search.component.html',
	styleUrls: ['./input-search.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PInputSearchComponent),
			multi: true,
		},
	],
	animations: [ SLIDE_HORIZONTAL_ON_NGIF_TRIGGER, SLIDE_WIDTH_100_ON_BOOLEAN_TRIGGER, FLEX_GROW_ON_NGIF_TRIGGER ],
})
export class PInputSearchComponent implements ControlValueAccessor, PFormControlComponentInterface {
	@Input() public readMode : PFormControlComponentInterface['readMode'] = false;
	@Input() public size ?: PFormControlComponentInterface['size'] = null;

	/**
	 * Is the user currently searching something?
	 * This can e.g. uncollapse a collapsed magnifier-icon-button to a input with a close button.
	 */
	@Input() public isActive : boolean = false;

	@Input() public darkMode : boolean = false;
	@Input() public theme : PBtnTheme | null = null;

	@Output() public isActiveChange : EventEmitter<boolean> = new EventEmitter<boolean>();

	@Input() public checkTouched : PFormControlComponentInterface['checkTouched'] = false;

	constructor(
		private changeDetectorRef : ChangeDetectorRef,
		private localize : LocalizePipe,
	) {}

	public PlanoFaIconPool = PlanoFaIconPool;
	public BootstrapRounded = BootstrapRounded;
	public BootstrapSize = BootstrapSize;

	@HostBinding('class.input-group')
	private _alwaysTrue : boolean = true;

	@HostBinding('class.flex-grow-1') private get _isActive() : boolean {
		return this.isActive;
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	@HostBinding('class.input-group-sm') public get isSizeSm() : boolean {
		return this.size === 'sm';
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	@HostBinding('class.input-group-lg') public get isSizeLg() : boolean {
		return this.size === 'lg';
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	@HostListener('document:keydown.escape', ['$event']) public onKeydownHandler(_event : KeyboardEvent) : void {
		if (this.inputHasFocus) {
			this.setIsActive(false);
		}
	}

	@ViewChild('input', { static: false }) private inputEl ?: ElementRef<HTMLInputElement>;

	public inputHasFocus = false;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public onClickSearchIcon() : void {
		this.setIsActive(!this.isActive);
	}

	private setIsActive(active : boolean) : void {
		this.isActive = active;
		if (!this.isActive) {
			this.value = null;
		} else {
			const INTERVAL = window.setInterval(() => {
				assumeDefinedToGetStrictNullChecksRunning(this.inputEl!.nativeElement); // eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
				if (!this.inputEl || !this.inputEl.nativeElement) {
					return;
				}
				this.inputEl.nativeElement.focus();
				window.clearInterval(INTERVAL);
			}, 10);
		}
		this.isActiveChange.emit(this.isActive);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get btnStyle() : PBtnTheme {
		if (this.isActive) return PThemeEnum.PRIMARY;

		if (!this.theme) return PBtnThemeEnum.OUTLINE_SECONDARY;
		return this.theme;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get triggerButtonPopoverText() : string {
		if (!this.isActive) return this.localize.transform('Suche');
		return this.localize.transform('Suche verlassen (Esc)');
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

		this._value = value;
		this.onChange(value);
	}

	/** Write a new value to the element. */
	public writeValue(value : ValueType) : void {
		if (this._value === value) return;
		this._value = value;
		this.changeDetectorRef.markForCheck();
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
