var PTextareaComponent_1;
var _a, _b, _c, _d, _e, _f, _g, _h;
import { __decorate, __metadata } from "tslib";
import { Component, ElementRef, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Input } from '@angular/core';
import { forwardRef } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { TextToHtmlService } from '@plano/client/scheduling/shared/text-to-html.service';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { LogService } from '@plano/shared/core/log.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { BootstrapSize } from '../../bootstrap-styles.enum';
import { PFormControlComponentBaseDirective } from '../../p-attribute-info/attribute-info-component-base';
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
let PTextareaComponent = PTextareaComponent_1 = class PTextareaComponent extends PFormControlComponentBaseDirective {
    constructor(element, console, textToHtmlService, changeDetectorRef, pFormsService) {
        super(false, changeDetectorRef, pFormsService, console);
        this.element = element;
        this.console = console;
        this.textToHtmlService = textToHtmlService;
        this.changeDetectorRef = changeDetectorRef;
        this.pFormsService = pFormsService;
        this._alwaysTrue = true;
        this.wysiwyg = false;
        this.isEditWysiwygMode = false;
        this.placeholder = null;
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.focusout = new EventEmitter();
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.focus = new EventEmitter();
        // These are necessary Inputs and Outputs for pEditable form-element
        this.pEditable = false;
        this.api = null;
        this.valid = null;
        this.onSaveStart = new EventEmitter();
        this.onSaveSuccess = new EventEmitter();
        this.onDismiss = new EventEmitter();
        this.onLeaveCurrent = new EventEmitter();
        this.editMode = new EventEmitter(undefined);
        this.checkTouched = false;
        /**
         * Visual size of this component.
         * Can be useful if you have few space in a button-bar or want to have large buttons on mobile.
         */
        this.size = null;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.BootstrapSize = BootstrapSize;
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
        this.formControl = null;
        this._readMode = null;
        this._value = null;
        this._onChange = () => { };
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.keyup = new EventEmitter();
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.blur = new EventEmitter();
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.change = new EventEmitter();
        /** onTouched */
        this.onTouched = (_event) => { };
    }
    /** Is this valid? [valid]="…" overwrites the valid state if the formControl. */
    get isValid() {
        var _a;
        if (this.valid !== null)
            return this.valid;
        return !((_a = this.formControl) === null || _a === void 0 ? void 0 : _a.invalid);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get valueAsHtml() {
        if (!this.value)
            return '-';
        return this.textToHtmlService.textToHtml(this.value, false, false);
    }
    /**
     * Remove trailing whitespace and line-breaks
     */
    removeTrailingWhiteSpaceAndLineBreaks(value) {
        const regex = new RegExp(/(?:<\/br>|<br>|<\/\sbr>|\s|&nbsp;)+$/g);
        if (value.match(regex)) {
            return value.replace(regex, '');
        }
        return value;
    }
    // TODO: Remove this; then remove onSaveStart from pEditable.directive
    // eslint-disable-next-line jsdoc/require-jsdoc
    saveStart() {
        if (this.wysiwyg) {
            this.value = (this.removeTrailingWhiteSpaceAndLineBreaks(this._value));
        }
    }
    ngAfterContentInit() {
        this.initOptions();
        // TODO: In some p-textareas the [active] property is not set. Need better solution here.
        if (!this.pEditable && !this.disabled) {
            this.isEditWysiwygMode = true;
        }
        if (!!this.cannotEditHint)
            throw new Error('cannotEditHint not implemented yet in this component.');
        return super.ngAfterContentInit();
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
    /** Get keyup event from inside this component, and pass it on. */
    onKeyUp(event) {
        this._onChange(event.target.value);
        this.keyup.emit(event);
    }
    /** Get blur event from inside this component, and pass it on. */
    onBlur(event) {
        this.onTouched(event);
        this.blur.emit(event);
    }
    /** Get change event from inside this component, and pass it on. */
    onChange(event) {
        this._onChange(event.target.value);
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
        return this.pFormsService.visibleErrors(this.formControl);
    }
};
__decorate([
    HostBinding('class.flex-grow-1'),
    __metadata("design:type", Object)
], PTextareaComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PTextareaComponent.prototype, "wysiwyg", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PTextareaComponent.prototype, "isEditWysiwygMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTextareaComponent.prototype, "placeholder", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_d = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _d : Object)
], PTextareaComponent.prototype, "focusout", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_e = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _e : Object)
], PTextareaComponent.prototype, "focus", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTextareaComponent.prototype, "pEditable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTextareaComponent.prototype, "api", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTextareaComponent.prototype, "valid", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTextareaComponent.prototype, "saveChangesHook", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PTextareaComponent.prototype, "onSaveStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PTextareaComponent.prototype, "onSaveSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PTextareaComponent.prototype, "onDismiss", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PTextareaComponent.prototype, "onLeaveCurrent", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PTextareaComponent.prototype, "editMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PTextareaComponent.prototype, "checkTouched", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTextareaComponent.prototype, "size", void 0);
__decorate([
    Input('disabled'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], PTextareaComponent.prototype, "disabled", null);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTextareaComponent.prototype, "formControl", void 0);
__decorate([
    Input('readMode'),
    __metadata("design:type", Object)
], PTextareaComponent.prototype, "_readMode", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_f = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _f : Object)
], PTextareaComponent.prototype, "keyup", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_g = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _g : Object)
], PTextareaComponent.prototype, "blur", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_h = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _h : Object)
], PTextareaComponent.prototype, "change", void 0);
PTextareaComponent = PTextareaComponent_1 = __decorate([
    Component({
        selector: 'p-textarea',
        templateUrl: './p-textarea.component.html',
        styleUrls: ['./p-textarea.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PTextareaComponent_1),
                multi: true,
            },
        ],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _a : Object, LogService, typeof (_b = typeof TextToHtmlService !== "undefined" && TextToHtmlService) === "function" ? _b : Object, typeof (_c = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _c : Object, PFormsService])
], PTextareaComponent);
export { PTextareaComponent };
//# sourceMappingURL=p-textarea.component.js.map