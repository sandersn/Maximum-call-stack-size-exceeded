/* eslint-disable @typescript-eslint/no-explicit-any */
// cSpell:ignore kolkov
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AfterContentInit} from '@angular/core';
import { Component, ElementRef, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Input } from '@angular/core';
import { forwardRef } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { ControlValueAccessor} from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TextToHtmlService } from '@plano/client/scheduling/shared/text-to-html.service';
import { VisibleErrorsType } from '@plano/client/service/p-forms.service';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { EditableControlInterface, EditableDirective } from '@plano/client/shared/p-editable/editable/editable.directive';
import { LogService } from '@plano/shared/core/log.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { BootstrapSize } from '../../bootstrap-styles.enum';
import { PFormControlComponentBaseDirective } from '../../p-attribute-info/attribute-info-component-base';
import { PFormControl } from '../p-form-control';
import { PFormControlComponentInterface } from '../p-form-control.interface';

type ValueType = string;

/**
 * <p-textarea> extends <textarea> with all the options for pEditables.
 * This can also be used as an WYSIWYG.
 * @example with PFormControl binding
 * 	<form [formGroup]="myFormGroup">
 * 		<p-textarea
 * 			[formControl]="myFormGroup.get('lastName')"
 * 		></p-textarea>
 * 	</form>
 * @example with model binding
 * 	<p-textarea
 * 		[(ngModel)]="member.lastName"
 * 	></p-textarea>
 * @example As WYSIWYG
 * 	<p-textarea
 * 		[(ngModel)]="member.lastName"
 * 		[wysiwyg]="true"
 * 	></p-textarea>
 * @example as editable
 * 	<form [formGroup]="myFormGroup">
 * 		<p-textarea
 * 			[pEditable]="!member.isNewItem()"
 * 			[api]="api"
 */

@Component({
	selector: 'p-textarea',
	templateUrl: './p-textarea.component.html',
	styleUrls: ['./p-textarea.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PTextareaComponent),
			multi: true,
		},
	],
})
export class PTextareaComponent extends PFormControlComponentBaseDirective
	implements ControlValueAccessor, AfterContentInit, EditableControlInterface, PFormControlComponentInterface {

	@HostBinding('class.flex-grow-1') protected _alwaysTrue = true;

	@Input() public wysiwyg : boolean = false;
	@Input() public isEditWysiwygMode : boolean = false;

	@Input() public placeholder : string | null = null;

	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public focusout : EventEmitter<Event> = new EventEmitter<Event>();
	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public focus : EventEmitter<Event> = new EventEmitter<Event>();

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

	@Input() public checkTouched : boolean = false;

	/**
	 * Visual size of this component.
	 * Can be useful if you have few space in a button-bar or want to have large buttons on mobile.
	 */
	@Input() public size ?: PFormControlComponentInterface['size'] = null;

	constructor(
		public element : ElementRef<HTMLElement>,
		protected override console : LogService,
		private textToHtmlService : TextToHtmlService,
		protected override changeDetectorRef : ChangeDetectorRef,
		protected override pFormsService : PFormsService,
	) {
		super(false, changeDetectorRef, pFormsService, console);
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public BootstrapSize = BootstrapSize;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get valueAsHtml() : string {
		if (!this.value) return '-';
		return this.textToHtmlService.textToHtml(this.value, false, false);
	}

	/**
	 * Remove trailing whitespace and line-breaks
	 */
	private removeTrailingWhiteSpaceAndLineBreaks(value : string) : string {
		const regex = new RegExp(/(?:<\/br>|<br>|<\/\sbr>|\s|&nbsp;)+$/g);
		if (value.match(regex)) {
			return value.replace(regex, '');
		}
		return value;
	}


	// TODO: Remove this; then remove onSaveStart from pEditable.directive
	// eslint-disable-next-line jsdoc/require-jsdoc
	public saveStart() : void {
		if (this.wysiwyg) {
			this.value = (this.removeTrailingWhiteSpaceAndLineBreaks(this._value!));
		}
	}

	public override ngAfterContentInit() : never {
		this.initOptions();

		// TODO: In some p-textareas the [active] property is not set. Need better solution here.
		if (!this.pEditable && !this.disabled) {
			this.isEditWysiwygMode = true;
		}

		if (!!this.cannotEditHint) throw new Error('cannotEditHint not implemented yet in this component.');

		return super.ngAfterContentInit();
	}

	/**
	 * cSpell:ignore tiptap
	 * NOTE: Before you do fancy stuff here, think about creating a component with tiptap
	 * PLANO-36640
	 */
	public editorConfig : AngularEditorConfig = {
		editable: true,
		spellcheck: false,
		height: 'auto',
		minHeight: '0',
		maxHeight: 'auto',
		width: 'auto',
		minWidth: '0',
		translate: 'yes',
		enableToolbar: true,
		showToolbar: true,
		placeholder: '',
		defaultParagraphSeparator: '',
		defaultFontName: '',
		defaultFontSize: '',
		fonts: [
		],
		sanitize: true,
		toolbarPosition: 'top',
		toolbarHiddenButtons: [
			[
				'undo',
				'redo',
				'strikeThrough',
				'subscript',
				'superscript',
				'justifyLeft',
				'justifyCenter',
				'justifyRight',
				'justifyFull',
				'indent',
				'outdent',
				'heading',
				'fontName',
			],
			[
				'fontSize',
				'textColor',
				'backgroundColor',
				'customClasses',

				'insertImage',
				'insertVideo',
				'toggleEditorMode',
			],
		],
	};

	private initOptions() : void {
		this.editorConfig.placeholder = this.placeholder ?? '';
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

	/**
	 * Is this a required field?
	 * This can be set as Input() but if there is a formControl binding,
	 * then it takes the info from the formControl’s validators.
	 */
	public get required() : boolean {
		if (!this.formControl) return false;
		const errors : ValidationErrors | null = this.formControl.validator?.(this.formControl) ?? null;
		return errors?.['required'];
	}

	private _value : ValueType | null = null;
	public override _onChange : (value : ValueType | null) => void = () => {};
	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public keyup : EventEmitter<Event> = new EventEmitter<Event>();

	/** Get keyup event from inside this component, and pass it on. */
	public onKeyUp(event : KeyboardEvent) : void {
		this._onChange((event.target as HTMLTextAreaElement).value);
		this.keyup.emit(event);
	}
	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public blur : EventEmitter<Event> = new EventEmitter<Event>();

	/** Get blur event from inside this component, and pass it on. */
	public onBlur(event : any) : void {
		this.onTouched(event);
		this.blur.emit(event);
	}
	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public change : EventEmitter<Event> = new EventEmitter<Event>();

	/** Get change event from inside this component, and pass it on. */
	public onChange(event : Event) : void {
		this._onChange((event.target as HTMLTextAreaElement).value);
		this.change.emit(event);
	}

	/** onTouched */
	public onTouched = (_event : any) : void => {};

	/** the value of this control */
	public get value() : ValueType | null { return this._value; }
	public set value(value : ValueType | null) {
		if (this._value === value) return;

		this._value = value;
		this.changeDetectorRef.markForCheck();

		// TODO: Still necessary? p-input don’t has this
		if (this.formControl) {
			this.formControl.markAsTouched();
			this.formControl.markAsDirty();
			this.formControl.updateValueAndValidity();
		}

		this._onChange(value);
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
	public registerOnChange(fn : (value : ValueType | null) => void) : ReturnType<ControlValueAccessor['registerOnChange']> { this._onChange = fn; }

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

	/** Filter all errors that should be shown in the ui. */
	public get visibleErrors() : VisibleErrorsType {
		return this.pFormsService.visibleErrors(this.formControl!);
	}
}
