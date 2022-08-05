/* eslint-disable @typescript-eslint/no-explicit-any */
// cSpell:ignore kolkov
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AfterContentInit, AfterViewInit } from '@angular/core';
import { Component, ElementRef, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import { forwardRef } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { ControlValueAccessor} from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { VisibleErrorsType } from '@plano/client/service/p-forms.service';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PApiPrimitiveTypes } from '../../../../shared/api/base/generated-types.ag';
import { BootstrapSize } from '../../bootstrap-styles.enum';
import { PFormControlComponentBaseDirective } from '../../p-attribute-info/attribute-info-component-base';
import { PFormControl } from '../p-form-control';
import { PFormControlComponentInterface } from '../p-form-control.interface';
import { PInputComponent } from '../p-input/p-input.component';

type ValueType<T = string> = T[];
export type EmittedOutputType = {
	value : ValueType[number],
	event : Event,
};

/**
 * <p-list-input> is like <p-textarea> but for a list of strings
 * @example with PFormControl binding
 * 	<form [formGroup]="myFormGroup">
 * 		<p-list-input
 * 			[formControl]="myFormGroup.controls['tags']"
 * 		></p-list-input>
 * 	</form>
 * @example with model binding
 * 	<p-list-input
 * 		[(ngModel)]="tags"
 * 	></p-list-input>
 */

@Component({
	selector: 'p-multi-value-input',
	templateUrl: './p-multi-value-input.component.html',
	styleUrls: ['./p-multi-value-input.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PMultiValueInputComponent),
			multi: true,
		},
	],
})
export class PMultiValueInputComponent extends PFormControlComponentBaseDirective
	implements ControlValueAccessor, AfterContentInit, AfterViewInit, PFormControlComponentInterface {

	@HostBinding('class.flex-grow-1') protected _alwaysTrue = true;

	@Input() public placeholder : string | null = null;

	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public focusout : EventEmitter<Event> = new EventEmitter<Event>();
	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public focus : EventEmitter<Event> = new EventEmitter<Event>();

	@Input() public valid : boolean | null = null;

	/** Is this valid? [valid]="…" overwrites the valid state if the formControl. */
	public get isValid() : boolean {
		if (this.valid !== null) return this.valid;
		if (this.tempFormControlForInput.invalid) return false;
		return !this.formControl?.invalid;
	}

	@Input() public checkTouched : boolean = false;

	/**
	 * Visual size of this component.
	 * Can be useful if you have few space in a button-bar or want to have large buttons on mobile.
	 */
	@Input() public size ?: PFormControlComponentInterface['size'] = null;

	@Input() public type : PInputComponent['type'] = PApiPrimitiveTypes.string;


	constructor(
		public element : ElementRef<HTMLElement>,
		protected override console : LogService,
		protected override changeDetectorRef : ChangeDetectorRef,
		protected override pFormsService : PFormsService,
	) {
		super(false, changeDetectorRef, pFormsService, console);
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public BootstrapSize = BootstrapSize;
	public Config = Config;

	@ViewChild(PInputComponent) private inputRef ?: PInputComponent;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get valueAsHtml() : string {
		if (!this.value.length) return '';
		// eslint-disable-next-line unicorn/no-array-reduce, sonarjs/prefer-immediate-return
		const result = this.value.reduce((a, b) => `${a}, ${b}`);
		return result;
		// return this.textToHtmlService.textToHtml(this.value, false, false);
	}

	/**
	 * Remove trailing whitespace and line-breaks
	 */
	private removeTrailingWhiteSpaceAndLineBreaks(value : string) : string {
		const regex = new RegExp(/<\/br>|<br>|<\/\sbr>|\s|&nbsp;+$/g);
		if (value.match(regex)) {
			return value.replace(regex, '');
		}
		return value;
	}


	// TODO: Remove this; then remove onSaveStart from pEditable.directive
	// eslint-disable-next-line jsdoc/require-jsdoc
	public saveStart() : void {
	}

	public override ngAfterContentInit() : never {
		this.initOptions();

		if (!!this.cannotEditHint) throw new Error('cannotEditHint not implemented yet in this component.');

		return super.ngAfterContentInit();
	}

	public ngAfterViewInit() : void {
		// 	this.inputRef.inputEl?.nativeElement.classList.add('border-0');
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

	public tempFormControlForInput = new PFormControl({});

	@Input('readMode') private _readMode : PFormControlComponentInterface['readMode'] = null;
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get readMode() : PFormControlComponentInterface['readMode'] {
		if (this._readMode !== null) return this._readMode;
		return this.disabled;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isPending() : boolean {
		if (this.formControl?.pending) return true;
		return false;
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

	private _value : ValueType = [];
	public override _onChange : (value : ValueType) => void = () => {};
	/* eslint-disable-next-line @angular-eslint/no-output-native */
	@Output() public keyup : EventEmitter<Event> = new EventEmitter<Event>();

	// /** Get keyup event from inside this component, and pass it on. */
	// public onKeyUp(event : KeyboardEvent) : void { this._onChange((event.target as HTMLTextAreaElement).value); this.keyup.emit(event); }
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
		// this._onChange((event.target as HTMLTextAreaElement).value);
		this.change.emit(event);
	}

	/** onTouched */
	public onTouched = (_event : any) : void => {};

	/** the value of this control */
	public get value() : ValueType { return this._value; }
	public set value(value : ValueType) {
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
	public registerOnChange(fn : (value : ValueType) => void) : ReturnType<ControlValueAccessor['registerOnChange']> { this._onChange = fn; }

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
	public get visibleErrors() : VisibleErrorsType | null {
		if (!this.formControl) return null;
		return this.pFormsService.visibleErrors(this.formControl);
	}

	@Input() public defaultValue : ValueType[number] = '';

	@Output() public itemAdded : EventEmitter<EmittedOutputType> = new EventEmitter();
	@Output() public itemRemoved : EventEmitter<EmittedOutputType> = new EventEmitter();

	/**
	 * Add the current item to the list of items
	 */
	public addItem(event : Event) : void {
		if (!this.isValid) return;
		let name = '';
		// I could not get a ref via ViewChild, so i had to go another way
		const inputRef = this.element.nativeElement.querySelector('input');
		const inputValue = inputRef?.value;
		if (inputValue?.length) {
			name = inputValue;
		} else if (this.defaultValue) {
			name = this.defaultValue;
		} else {
			return;
		}
		if (inputRef) inputRef.value = '';
		this.value.push(name);
		this.itemAdded.emit({
			value: name,
			event : event,
		});
	}

	/**
	 * Remove one item from the list of items
	 */
	public removeItem(event : Event, input ?: ValueType[number]) : void {
		if (!this.value.length) return;
		const inputRef = this.element.nativeElement.querySelector('input');
		if (inputRef?.value.length) return;
		let removedItem : ValueType[number];
		if (input) {
			this.value = this.value.filter(item => item !== input);
			removedItem = input;
		} else {
			removedItem = this.value.pop()!;
		}
		this.itemRemoved.emit({
			value : removedItem,
			event : event,
		});
	}

	/** User hits enter while focus is in input */
	public onEnter(event : Event) : void {
		this.addItem(event);
	}

	/** User hits enter while focus is in input */
	public onBackspace(event : Event) : void {
		this.removeItem(event);
	}
}

