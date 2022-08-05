import { AfterViewInit} from '@angular/core';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, HostBinding, ElementRef } from '@angular/core';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor} from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { VisibleErrorsType } from '@plano/client/service/p-forms.service';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { EditableControlInterface, EditableDirective } from '@plano/client/shared/p-editable/editable/editable.directive';
import { FaIcon } from '@plano/shared/core/component/fa-icon/fa-icon-types';
import { Config } from '@plano/shared/core/config';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { LogService } from '@plano/shared/core/log.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { ModalService } from '../../../../shared/core/p-modal/modal.service';
import { BootstrapSize, PThemeEnum } from '../../bootstrap-styles.enum';
import { PBtnTheme} from '../../bootstrap-styles.enum';
import { PFormControlComponentBaseDirective } from '../../p-attribute-info/attribute-info-component-base';
import { PFormControl } from '../p-form-control';
import { PFormControlComponentInterface } from '../p-form-control.interface';

type ValueType = boolean;

/**
 * <p-checkbox> extends <input type="checkbox"> with all the options for pEditables
 * @example with PFormControl binding
 * 	<form [formGroup]="myFormGroup">
 * 		<p-checkbox
 * 			[formControl]="myFormGroup.get('isAwesome')"
 * 		></p-checkbox>
 * 	</form>
 * @example with model binding
 * 	<p-checkbox
 * 		[(ngModel)]="member.isAwesome"
 * 	></p-checkbox>
 * @example as editable
 * 	<form [formGroup]="myFormGroup">
 * 		<p-checkbox
 * 			[pEditable]="!member.isNewItem()"
 * 			[api]="api"
 *
 * 			[formControl]="myFormGroup.get('isAwesome')"
 * 		></p-checkbox>
 * 	</form>
 */

@Component({
	selector: 'p-checkbox',
	templateUrl: './p-checkbox.component.html',
	styleUrls: ['./p-checkbox.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PCheckboxComponent),
			multi: true,
		},
	],
})
export class PCheckboxComponent extends PFormControlComponentBaseDirective
	implements PComponentInterface, ControlValueAccessor, EditableControlInterface,
AfterViewInit, PFormControlComponentInterface {
	protected override attributeInfoRequired = false;

	/**
	 * The button text that is shown to the user.
	 */
	@Input() public valueText : string | null = null;

	@HostBinding('class.flex-column')
	@HostBinding('class.align-items-stretch')
	@HostBinding('class.btn-group')

	@HostBinding('class.p-0')
	@HostBinding('class.mb-0') protected _alwaysTrue = true;
	@HostBinding('class.required') private get _hasRequiredClass() : boolean {
		return this.required;
	}

	@HostBinding('class.disabled') private get _isDisabled() : boolean {
		return this.disabled && this.hasButtonStyle;
	}

	/**
	 * Should this component have a btn style?
	 */
	@Input() public hasButtonStyle : boolean = true;

	/**
	 * The bootstrap button style for this checkbox
	 */
	@Input() public theme : PBtnTheme | null = PThemeEnum.SECONDARY;

	@Input('size') protected _size : BootstrapSize | null = null;

	/**
	 * Visual size of this component.
	 * Can be useful if you have few space in a button-bar or want to have large buttons on mobile.
	 */
	public get size() : BootstrapSize | null {
		return this._size;
	}

	@Output() public onClick : EventEmitter<Event> = new EventEmitter<Event>();

	@Input('textWhite') private _textWhite : boolean = false;

	/**
	 * Should the checkbox and text be white? Useful for e.g. primary background
	 */
	public get textWhite() : boolean {
		return this._textWhite;
	}
	public set textWhite(input : boolean) {
		this._textWhite = input;
	}

	@Input() public isLoading : PComponentInterface['isLoading'] = false;

	@ViewChild('content') private content ?: ElementRef<HTMLElement>;

	/**	@deprecated */
	@ViewChild('deprecatedTestTemplate') private deprecatedTestTemplate ?: ElementRef<HTMLElement | null>;

	@Input() public icon : FaIcon | null = null;

	@Input() public checkTouched : boolean = false;

	constructor(
		protected override changeDetectorRef : ChangeDetectorRef,
		protected override console : LogService,
		protected override pFormsService : PFormsService,
		private modalService : ModalService,
	) {
		super(true, changeDetectorRef, pFormsService, console);
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public BootstrapSize = BootstrapSize;

	public ngAfterViewInit() : never {
		this.validateValues();
		this.changeDetectorRef.markForCheck();
		return null as never;
	}

	/**
	 * Validate if required attributes are set and
	 * if the set values work together / make sense / have a working implementation.
	 */
	private validateValues() : void {
		if (!Config.DEBUG) return;
		const hasDeprecatedContent = !!this.deprecatedTestTemplate && this.deprecatedTestTemplate.nativeElement && (
			this.deprecatedTestTemplate.nativeElement.children.length > 0 ||
			this.deprecatedTestTemplate.nativeElement.innerHTML.length > 0
		);
		// eslint-disable-next-line literal-blacklist/literal-blacklist
		if (hasDeprecatedContent) this.console.deprecated('<p-checkbox …>Hello World</p-checkbox> is deprecated. Use [valueText]="Hello World".');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onClickCheckbox(event : Event) : void {
		this.value = !this.value;
		this.onClick.emit(event);
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

	/**
	 * This is the minimum code that is required for a custom control in Angular.
	 * Its necessary to make [(ngModel)] and [formControl] work.
	 */
	public _disabled : boolean = false;
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get disabled() : boolean {
		return this._disabled || !this.canEdit;
	}
	@Input('disabled') public set disabled(input : boolean) {
		this._disabled = input;
	}
	@Input() public override formControl : PFormControl | null = null;

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

	@Input('readMode') protected _readMode : PFormControlComponentInterface['readMode'] = null;
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get readMode() : PFormControlComponentInterface['readMode'] {
		if (this._readMode !== null) return this._readMode;
		return this.disabled;
	}

	/**
	 * Should the ng-content be visible?
	 */
	private _showContent : boolean = false;
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showContent() : boolean {
		const hasContent = this.content?.nativeElement && (
			this.content.nativeElement.children.length > 0 ||
			this.content.nativeElement.innerHTML.length > 0
		);
		if (hasContent) this._showContent = hasContent;
		return this._showContent;
	}

	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public keyup : EventEmitter<Event> = new EventEmitter<Event>();

	/** Get keyup event from inside this component, and pass it on. */
	public onKeyUp(event : KeyboardEvent) : void {
		this._onChange((event.target as HTMLInputElement).checked);
		this.keyup.emit(event);
	}
	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public change : EventEmitter<Event> = new EventEmitter<Event>();
	public override _onChange : (value : ValueType | null) => void = () => {};
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onChange(event : Event) : void {
		this._onChange((event.target as HTMLInputElement).checked);
		this.change.emit(event);
	}

	/** onTouched */
	public onTouched = () : void => {};

	/** the value of this control */
	@Input()
	public get value() : ValueType | null { return this._value; }
	public set value(value : ValueType | null) {
		if (this._value === value) return;

		this._value = !!value;
		this.changeDetectorRef.markForCheck();
		this._onChange(!!value);
	}
	private _value : ValueType = false;

	/**
	 * Write a new value to the element.
	 */
	public writeValue(value : ValueType) : void {
		if (this._value === value) return;
		this._value = !!value;
		// FIXME: There have been issues with the change detection on this component.
		//        This will be fixed in 3.0. I’m afraid to fix this in a bugfix release.
		//        Not enough time for testing. At least in 2.2.19.
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
	public registerOnChange(fn : (value : ValueType | null) => void) : ReturnType<ControlValueAccessor['registerOnChange']> { this._onChange = fn; }

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

	/** Filter all errors that should be shown in the ui. */
	public get visibleErrors() : VisibleErrorsType {
		return this.pFormsService.visibleErrors(this.formControl!);
	}

	/**
	 * Open a Modal like info-circle does it when in IS_MOBILE mode.
	 */
	public openCannotEditHint() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.cannotEditHint, 'cannotEditHint');
		this.modalService.openCannotEditHintModal(this.cannotEditHint);
	}

}
