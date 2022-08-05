import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ContentChildren, QueryList, forwardRef } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { ControlValueAccessor} from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { VisibleErrorsType } from '@plano/client/service/p-forms.service';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { EditableControlInterface, EditableDirective } from '@plano/client/shared/p-editable/editable/editable.directive';
import { Config } from '@plano/shared/core/config';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRadiosRadioComponent } from './p-radios-radio/p-radios-radio.component';
import { LogService } from '../../../../shared/core/log.service';
import { PDictionarySourceString } from '../../../../shared/core/pipe/localize.dictionary';
import { LocalizePipe } from '../../../../shared/core/pipe/localize.pipe';
import { BootstrapSize } from '../../bootstrap-styles.enum';
import { PFormControlComponentBaseDirective } from '../../p-attribute-info/attribute-info-component-base';
import { PAssignmentProcessIcon } from '../../p-sidebar/p-assignment-processes/assignment-process-icon';
import { PFormControl } from '../p-form-control';
import { PFormControlComponentInterface } from '../p-form-control.interface';

type ValueType = unknown;

/**
 * <p-radios> is like <radios> with all the options for pEditables
 * @example with PFormControl binding
 * 	<form [formGroup]="myFormGroup">
 * 		<p-radios
 * 			[formControl]="myFormGroup.get('favoriteFood')"
 * 		>
 * 			<p-radios-radio
 * 				value="unhealthy"
 * 				label="Pizza" i18n-label
 * 			></p-radios-radio>
 * 			<p-radios-radio
 * 				value="healthy"
 * 				label="Salat" i18n-label
 * 			></p-radios-radio>
 * 		</p-radios>
 * 	</form>
 * @example with model binding
 * 	<p-radios
 * 		[(ngModel)]="member.favoriteFood"
 * 	>
 * 		<p-radios-radio
 * 			value="unhealthy"
 * 			label="Pizza" i18n-label
 * 		></p-radios-radio>
 * 		<p-radios-radio
 * 			value="healthy"
 * 			label="Salat" i18n-label
 * 		></p-radios-radio>
 * 	</p-radios>
 * @example as editable
 * 	<form [formGroup]="myFormGroup">
 * 		<p-radios
 * 			[pEditable]="!member.isNewItem()"
 * 			[api]="api"
 *
 * 			[formControl]="myFormGroup.get('favoriteFood')"
 * 			placeholder="Plano" i18n-placeholder
 * 		>
 * 			<p-radios-radio
 * 				value="unhealthy"
 * 				label="Pizza" i18n-label
 * 			></p-radios-radio>
 * 			<p-radios-radio
 * 				value="healthy"
 * 				label="Salat" i18n-label
 * 			></p-radios-radio>
 * 		</p-radios>
 * 	</form>
 */

@Component({
	selector: 'p-radios',
	templateUrl: './p-radios.component.html',
	styleUrls: ['./p-radios.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PRadiosComponent),
			multi: true,
		},
	],
})
export class PRadiosComponent extends PFormControlComponentBaseDirective
	implements ControlValueAccessor, EditableControlInterface, PFormControlComponentInterface, AfterContentInit {
	@ContentChildren(PRadiosRadioComponent) public radios ?: QueryList<PRadiosRadioComponent>;

	@Input() public inline : boolean = true;

	/**
	 * Should the default icons be visible?
	 * Useful if you want to define your own icons in <ng-content>
	 */
	@Input() public hideRadioCircles : boolean = false;

	// These are necessary Inputs and Outputs for pEditable form-element
	@Input() public pEditable : EditableControlInterface['pEditable'] = false;
	@Input() public api : EditableControlInterface['api'] = null;
	@Input() public valid : EditableControlInterface['valid'] = null;
	@Input() public saveChangesHook ?: EditableControlInterface['saveChangesHook'];
	@Output() public onSaveStart : EditableControlInterface['onSaveStart'] = new EventEmitter();
	@Output() public onSaveSuccess : EditableControlInterface['onSaveSuccess'] = new EventEmitter();
	// NOTE: Its not possible to dismiss changes on a radio-input. But editable.directive can trigger it – e.g. onDestroy.
	@Output() public onDismiss : EditableDirective['onDismiss'] = new EventEmitter();
	@Output() public onLeaveCurrent : EditableControlInterface['onLeaveCurrent'] = new EventEmitter();
	@Output() public editMode : EditableControlInterface['editMode'] = new EventEmitter<boolean>(undefined);

	/** Is this valid? [valid]="…" overwrites the valid state if the formControl. */
	public get isValid() : boolean {
		if (this.valid !== null) return this.valid;
		return !this.formControl?.invalid;
	}

	@Input() public checkTouched : boolean = false;

	/**
	 * Visual size of this component.
	 * Can be useful if you have few space in a button-bar or want to have large buttons on mobile.
	 */
	@Input() public size ?: PFormControlComponentInterface['size'] = null;

	constructor(
		protected override changeDetectorRef : ChangeDetectorRef,
		protected override pFormsService : PFormsService,
		private modalService : ModalService,
		protected override console : LogService,
		private localizePipe : LocalizePipe,
	) {
		super(false, changeDetectorRef, pFormsService, console);
	}

	/**
	 * HACK: Since we try to handle the lifecycle inside the component
	 * (see PFormControlComponentBaseDirective['group'])
	 * We dont have all the Angular functionality available anymore.
	 *
	 * This is a hack to re-invent what Angular already invented.
	 * This should be removed when we found a good way to handle the lifecycles of formControl’s
	 */
	// @HostBinding('class.ng-p-invalid') private get _classNgInvalid() : boolean {
	// 	return !this.isValid;
	// }
	// @HostBinding('class.ng-p-invalid') private get _classNgValid() : boolean {
	// 	return !!this.isValid;
	// }

	public BootstrapSize = BootstrapSize;
	public PlanoFaIconPool = PlanoFaIconPool;

	public readonly CONFIG : typeof Config = Config;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getTooltip(
		radio : PRadiosRadioComponent, tooltipRef : TemplateRef<unknown>,
	) : string | TemplateRef<unknown> | null {
		return radio.popover && this.popoverValueIsString(radio.popover) ? tooltipRef : null;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getPopover(radio : PRadiosRadioComponent) : string | TemplateRef<unknown> | null {
		return radio.popover && !this.popoverValueIsString(radio.popover) ? radio.popover : null;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getPopoverTriggers(radio : PRadiosRadioComponent) : string {
		if (!radio.popover) return '';
		if (radio.triggers) return radio.triggers;
		return 'mouseenter:mouseleave';
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get getActiveRadio() : PRadiosRadioComponent | null {
		return this.radios?.find((item) => this.isActive(item)) ?? null;
	}

	/**
	 * This method checks if the given item is in a active state.
	 */
	public isActive(item : PRadiosRadioComponent) : boolean {

		// If set, the item.checked value has a higher priority then the other expression
		if (item.active !== null) return item.active;

		if (item.value === undefined) return false;

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		if (this.value && (this.value as any).equals) return (this.value as any).equals(item.value);

		return this.value === item.value;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onClick(input : PRadiosRadioComponent) : void {
		if (this.disabled) return;
		this.value = input.value;
		input.onClick.emit(input.value);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public popoverValueIsString(popover : string | TemplateRef<unknown>) : boolean {
		return typeof popover === 'string';
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

	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	private _value : ValueType | null = null;
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	public override _onChange : (value : ValueType | null) => void = () => {};

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onChange(value : ValueType) : void {
		this._onChange(value);
	}

	/** onTouched */
	public onTouched = () : void => {};

	/** the value of this control */
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	public get value() : ValueType | null { return this._value; }
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	public set value(value : ValueType | null) {
		if (value === this._value) return;

		this._value = value;

		if (this.group) {
			this.formControl!.setValue(value);
		} else {
			this.onChange(value);
		}
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
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	public registerOnChange(fn : (value : ValueType | null) => void) : ReturnType<ControlValueAccessor['registerOnChange']> { this._onChange = fn; }

	/** Set the function to be called when the control receives a touch event. */
	public registerOnTouched(fn : () => void) : void { this.onTouched = fn; }

	/** setDisabledState */
	public setDisabledState(isDisabled : boolean) : void {
		if (this._disabled === isDisabled) return;
		// Set internal attribute
		this._disabled = isDisabled;

		// Refresh the formControl. #two-way-binding

		if (this.formControl && this.formControl.disabled !== this.disabled) {
			this.disabled ? this.formControl.disable() : this.formControl.enable();
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public showFontawesomeIcon(icon : PAssignmentProcessIcon | null) : boolean {
		if (icon === null) return false;
		return icon !== 'early-bird' && icon !== 'dr-plano';
	}

	/** Filter all errors that should be shown in the ui. */
	public get visibleErrors() : VisibleErrorsType {
		return this.pFormsService.visibleErrors(this.formControl!);
	}

	/**
	 * Open a Modal like info-circle does it when in IS_MOBILE mode.
	 */
	public openCannotEditHint(text : PDictionarySourceString) : void {
		this.modalService.openDefaultModal({
			modalTitle: null,
			description: this.localizePipe.transform(text),
		}, {
			size: 'sm',
			centered: true,
		});
	}
}
