var PMultiValueInputComponent_1;
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
import { __decorate, __metadata } from "tslib";
import { Component, ElementRef, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import { forwardRef } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PApiPrimitiveTypes } from '../../../../shared/api/base/generated-types.ag';
import { BootstrapSize } from '../../bootstrap-styles.enum';
import { PFormControlComponentBaseDirective } from '../../p-attribute-info/attribute-info-component-base';
import { PFormControl } from '../p-form-control';
import { PInputComponent } from '../p-input/p-input.component';
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
let PMultiValueInputComponent = PMultiValueInputComponent_1 = class PMultiValueInputComponent extends PFormControlComponentBaseDirective {
    constructor(element, console, changeDetectorRef, pFormsService) {
        super(false, changeDetectorRef, pFormsService, console);
        this.element = element;
        this.console = console;
        this.changeDetectorRef = changeDetectorRef;
        this.pFormsService = pFormsService;
        this._alwaysTrue = true;
        this.placeholder = null;
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.focusout = new EventEmitter();
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.focus = new EventEmitter();
        this.valid = null;
        this.checkTouched = false;
        /**
         * Visual size of this component.
         * Can be useful if you have few space in a button-bar or want to have large buttons on mobile.
         */
        this.size = null;
        this.type = PApiPrimitiveTypes.string;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.BootstrapSize = BootstrapSize;
        this.Config = Config;
        /**
         * cSpell:ignore tiptap
         * NOTE: Before you do fancy stuff here, think about creating a component with tiptap
         * PLANO-36640
         */
        this.editorConfig = {
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
            fonts: [],
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
        this._disabled = false;
        this.tempFormControlForInput = new PFormControl({});
        this._readMode = null;
        this._value = [];
        this._onChange = () => { };
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.keyup = new EventEmitter();
        // /** Get keyup event from inside this component, and pass it on. */
        // public onKeyUp(event : KeyboardEvent) : void { this._onChange((event.target as HTMLTextAreaElement).value); this.keyup.emit(event); }
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.blur = new EventEmitter();
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.change = new EventEmitter();
        /** onTouched */
        this.onTouched = (_event) => { };
        this.defaultValue = '';
        this.itemAdded = new EventEmitter();
        this.itemRemoved = new EventEmitter();
    }
    /** Is this valid? [valid]="…" overwrites the valid state if the formControl. */
    get isValid() {
        var _a;
        if (this.valid !== null)
            return this.valid;
        if (this.tempFormControlForInput.invalid)
            return false;
        return !((_a = this.formControl) === null || _a === void 0 ? void 0 : _a.invalid);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get valueAsHtml() {
        if (!this.value.length)
            return '';
        // eslint-disable-next-line unicorn/no-array-reduce, sonarjs/prefer-immediate-return
        const result = this.value.reduce((a, b) => `${a}, ${b}`);
        return result;
        // return this.textToHtmlService.textToHtml(this.value, false, false);
    }
    /**
     * Remove trailing whitespace and line-breaks
     */
    removeTrailingWhiteSpaceAndLineBreaks(value) {
        const regex = new RegExp(/<\/br>|<br>|<\/\sbr>|\s|&nbsp;+$/g);
        if (value.match(regex)) {
            return value.replace(regex, '');
        }
        return value;
    }
    // TODO: Remove this; then remove onSaveStart from pEditable.directive
    // eslint-disable-next-line jsdoc/require-jsdoc
    saveStart() {
    }
    ngAfterContentInit() {
        this.initOptions();
        if (!!this.cannotEditHint)
            throw new Error('cannotEditHint not implemented yet in this component.');
        return super.ngAfterContentInit();
    }
    ngAfterViewInit() {
        // 	this.inputRef.inputEl?.nativeElement.classList.add('border-0');
    }
    initOptions() {
        var _a;
        this.editorConfig.placeholder = (_a = this.placeholder) !== null && _a !== void 0 ? _a : '';
    }
    /**
     * This is the minimum code that is required for a custom control in Angular.
     * Its necessary to set this if you want to use [(ngModel)] AND [formControl] together.
     */
    get disabled() {
        return this._disabled || !this.canEdit;
    }
    set disabled(input) {
        this.setDisabledState(input);
        this._disabled = input;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get readMode() {
        if (this._readMode !== null)
            return this._readMode;
        return this.disabled;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isPending() {
        var _a;
        if ((_a = this.formControl) === null || _a === void 0 ? void 0 : _a.pending)
            return true;
        return false;
    }
    /**
     * Is this a required field?
     * This can be set as Input() but if there is a formControl binding,
     * then it takes the info from the formControl’s validators.
     */
    get required() {
        var _a, _b, _c;
        if (!this.formControl)
            return false;
        const errors = (_c = (_b = (_a = this.formControl).validator) === null || _b === void 0 ? void 0 : _b.call(_a, this.formControl)) !== null && _c !== void 0 ? _c : null;
        return errors === null || errors === void 0 ? void 0 : errors['required'];
    }
    /** Get blur event from inside this component, and pass it on. */
    onBlur(event) {
        this.onTouched(event);
        this.blur.emit(event);
    }
    /** Get change event from inside this component, and pass it on. */
    onChange(event) {
        // this._onChange((event.target as HTMLTextAreaElement).value);
        this.change.emit(event);
    }
    /** the value of this control */
    get value() { return this._value; }
    set value(value) {
        if (this._value === value)
            return;
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
    writeValue(value) {
        if (this._value === value)
            return;
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
    registerOnChange(fn) { this._onChange = fn; }
    /** Set the function to be called when the control receives a touch event. */
    registerOnTouched(fn) { this.onTouched = fn; }
    /** setDisabledState */
    setDisabledState(isDisabled) {
        if (this._disabled === isDisabled)
            return;
        // Set internal attribute which gets used in the template.
        this._disabled = isDisabled;
        // Refresh the formControl. #two-way-binding
        if (this.formControl && this.formControl.disabled !== this.disabled) {
            this.disabled ? this.formControl.disable() : this.formControl.enable();
        }
    }
    /** Filter all errors that should be shown in the ui. */
    get visibleErrors() {
        if (!this.formControl)
            return null;
        return this.pFormsService.visibleErrors(this.formControl);
    }
    /**
     * Add the current item to the list of items
     */
    addItem(event) {
        if (!this.isValid)
            return;
        let name = '';
        // I could not get a ref via ViewChild, so i had to go another way
        const inputRef = this.element.nativeElement.querySelector('input');
        const inputValue = inputRef === null || inputRef === void 0 ? void 0 : inputRef.value;
        if (inputValue === null || inputValue === void 0 ? void 0 : inputValue.length) {
            name = inputValue;
        }
        else if (this.defaultValue) {
            name = this.defaultValue;
        }
        else {
            return;
        }
        if (inputRef)
            inputRef.value = '';
        this.value.push(name);
        this.itemAdded.emit({
            value: name,
            event: event,
        });
    }
    /**
     * Remove one item from the list of items
     */
    removeItem(event, input) {
        if (!this.value.length)
            return;
        const inputRef = this.element.nativeElement.querySelector('input');
        if (inputRef === null || inputRef === void 0 ? void 0 : inputRef.value.length)
            return;
        let removedItem;
        if (input) {
            this.value = this.value.filter(item => item !== input);
            removedItem = input;
        }
        else {
            removedItem = this.value.pop();
        }
        this.itemRemoved.emit({
            value: removedItem,
            event: event,
        });
    }
    /** User hits enter while focus is in input */
    onEnter(event) {
        this.addItem(event);
    }
    /** User hits enter while focus is in input */
    onBackspace(event) {
        this.removeItem(event);
    }
};
__decorate([
    HostBinding('class.flex-grow-1'),
    __metadata("design:type", Object)
], PMultiValueInputComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PMultiValueInputComponent.prototype, "placeholder", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_c = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _c : Object)
], PMultiValueInputComponent.prototype, "focusout", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_d = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _d : Object)
], PMultiValueInputComponent.prototype, "focus", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PMultiValueInputComponent.prototype, "valid", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PMultiValueInputComponent.prototype, "checkTouched", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PMultiValueInputComponent.prototype, "size", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PMultiValueInputComponent.prototype, "type", void 0);
__decorate([
    ViewChild(PInputComponent),
    __metadata("design:type", PInputComponent)
], PMultiValueInputComponent.prototype, "inputRef", void 0);
__decorate([
    Input('disabled'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], PMultiValueInputComponent.prototype, "disabled", null);
__decorate([
    Input('readMode'),
    __metadata("design:type", Object)
], PMultiValueInputComponent.prototype, "_readMode", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_e = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _e : Object)
], PMultiValueInputComponent.prototype, "keyup", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_f = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _f : Object)
], PMultiValueInputComponent.prototype, "blur", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_g = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _g : Object)
], PMultiValueInputComponent.prototype, "change", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PMultiValueInputComponent.prototype, "defaultValue", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_h = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _h : Object)
], PMultiValueInputComponent.prototype, "itemAdded", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_j = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _j : Object)
], PMultiValueInputComponent.prototype, "itemRemoved", void 0);
PMultiValueInputComponent = PMultiValueInputComponent_1 = __decorate([
    Component({
        selector: 'p-multi-value-input',
        templateUrl: './p-multi-value-input.component.html',
        styleUrls: ['./p-multi-value-input.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PMultiValueInputComponent_1),
                multi: true,
            },
        ],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _a : Object, LogService, typeof (_b = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _b : Object, PFormsService])
], PMultiValueInputComponent);
export { PMultiValueInputComponent };
//# sourceMappingURL=p-multi-value-input.component.js.map