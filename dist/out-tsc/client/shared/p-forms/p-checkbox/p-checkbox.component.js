var PCheckboxComponent_1;
var _a, _b, _c, _d, _e, _f;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, HostBinding, ElementRef } from '@angular/core';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ViewChild, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { ModalService } from '../../../../shared/core/p-modal/modal.service';
import { BootstrapSize, PThemeEnum } from '../../bootstrap-styles.enum';
import { PFormControlComponentBaseDirective } from '../../p-attribute-info/attribute-info-component-base';
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
let PCheckboxComponent = PCheckboxComponent_1 = class PCheckboxComponent extends PFormControlComponentBaseDirective {
    constructor(changeDetectorRef, console, pFormsService, modalService) {
        super(true, changeDetectorRef, pFormsService, console);
        this.changeDetectorRef = changeDetectorRef;
        this.console = console;
        this.pFormsService = pFormsService;
        this.modalService = modalService;
        this.attributeInfoRequired = false;
        /**
         * The button text that is shown to the user.
         */
        this.valueText = null;
        this._alwaysTrue = true;
        /**
         * Should this component have a btn style?
         */
        this.hasButtonStyle = true;
        /**
         * The bootstrap button style for this checkbox
         */
        this.theme = PThemeEnum.SECONDARY;
        this._size = null;
        this.onClick = new EventEmitter();
        this._textWhite = false;
        this.isLoading = false;
        this.icon = null;
        this.checkTouched = false;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.BootstrapSize = BootstrapSize;
        // These are necessary Inputs and Outputs for pEditable form-element
        this.pEditable = false;
        this.api = null;
        this.valid = null;
        this.onSaveStart = new EventEmitter();
        this.onSaveSuccess = new EventEmitter();
        this.onDismiss = new EventEmitter();
        this.onLeaveCurrent = new EventEmitter();
        this.editMode = new EventEmitter(undefined);
        /**
         * This is the minimum code that is required for a custom control in Angular.
         * Its necessary to make [(ngModel)] and [formControl] work.
         */
        this._disabled = false;
        this.formControl = null;
        this._required = false;
        this._readMode = null;
        /**
         * Should the ng-content be visible?
         */
        this._showContent = false;
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.keyup = new EventEmitter();
        /* eslint-disable-next-line @angular-eslint/no-output-native */
        this.change = new EventEmitter();
        this._onChange = () => { };
        /** onTouched */
        this.onTouched = () => { };
        this._value = false;
    }
    get _hasRequiredClass() {
        return this.required;
    }
    get _isDisabled() {
        return this.disabled && this.hasButtonStyle;
    }
    /**
     * Visual size of this component.
     * Can be useful if you have few space in a button-bar or want to have large buttons on mobile.
     */
    get size() {
        return this._size;
    }
    /**
     * Should the checkbox and text be white? Useful for e.g. primary background
     */
    get textWhite() {
        return this._textWhite;
    }
    set textWhite(input) {
        this._textWhite = input;
    }
    ngAfterViewInit() {
        this.validateValues();
        this.changeDetectorRef.markForCheck();
        return null;
    }
    /**
     * Validate if required attributes are set and
     * if the set values work together / make sense / have a working implementation.
     */
    validateValues() {
        if (!Config.DEBUG)
            return;
        const hasDeprecatedContent = !!this.deprecatedTestTemplate && this.deprecatedTestTemplate.nativeElement && (this.deprecatedTestTemplate.nativeElement.children.length > 0 ||
            this.deprecatedTestTemplate.nativeElement.innerHTML.length > 0);
        // eslint-disable-next-line literal-blacklist/literal-blacklist
        if (hasDeprecatedContent)
            this.console.deprecated('<p-checkbox …>Hello World</p-checkbox> is deprecated. Use [valueText]="Hello World".');
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onClickCheckbox(event) {
        this.value = !this.value;
        this.onClick.emit(event);
    }
    /** Is this valid? [valid]="…" overwrites the valid state if the formControl. */
    get isValid() {
        return this.valid !== null ? this.valid : (!this.formControl || !this.formControl.invalid);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get disabled() {
        return this._disabled || !this.canEdit;
    }
    set disabled(input) {
        this._disabled = input;
    }
    /**
     * Is this a required field?
     * This can be set as Input() but if there is a formControl binding,
     * then it takes the info from the formControl’s validators.
     */
    get required() {
        if (this._required)
            return this._required;
        return this.formControlInitialRequired();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get readMode() {
        if (this._readMode !== null)
            return this._readMode;
        return this.disabled;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showContent() {
        var _a;
        const hasContent = ((_a = this.content) === null || _a === void 0 ? void 0 : _a.nativeElement) && (this.content.nativeElement.children.length > 0 ||
            this.content.nativeElement.innerHTML.length > 0);
        if (hasContent)
            this._showContent = hasContent;
        return this._showContent;
    }
    /** Get keyup event from inside this component, and pass it on. */
    onKeyUp(event) {
        this._onChange(event.target.checked);
        this.keyup.emit(event);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onChange(event) {
        this._onChange(event.target.checked);
        this.change.emit(event);
    }
    /** the value of this control */
    get value() { return this._value; }
    set value(value) {
        if (this._value === value)
            return;
        this._value = !!value;
        this.changeDetectorRef.markForCheck();
        this._onChange(!!value);
    }
    /**
     * Write a new value to the element.
     */
    writeValue(value) {
        if (this._value === value)
            return;
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
    registerOnChange(fn) { this._onChange = fn; }
    /** Set the function to be called when the control receives a touch event. */
    registerOnTouched(fn) { this.onTouched = fn; }
    /** setDisabledState */
    setDisabledState(isDisabled) {
        if (this.disabled === isDisabled)
            return;
        // Set internal attribute which gets used in the template.
        this.disabled = isDisabled;
        // Refresh the formControl. #two-way-binding
        if (this.formControl && this.formControl.disabled !== this.disabled) {
            this.disabled ? this.formControl.disable() : this.formControl.enable();
        }
    }
    /** Filter all errors that should be shown in the ui. */
    get visibleErrors() {
        return this.pFormsService.visibleErrors(this.formControl);
    }
    /**
     * Open a Modal like info-circle does it when in IS_MOBILE mode.
     */
    openCannotEditHint() {
        assumeDefinedToGetStrictNullChecksRunning(this.cannotEditHint, 'cannotEditHint');
        this.modalService.openCannotEditHintModal(this.cannotEditHint);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PCheckboxComponent.prototype, "valueText", void 0);
__decorate([
    HostBinding('class.flex-column'),
    HostBinding('class.align-items-stretch'),
    HostBinding('class.btn-group'),
    HostBinding('class.p-0'),
    HostBinding('class.mb-0'),
    __metadata("design:type", Object)
], PCheckboxComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    HostBinding('class.required'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PCheckboxComponent.prototype, "_hasRequiredClass", null);
__decorate([
    HostBinding('class.disabled'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PCheckboxComponent.prototype, "_isDisabled", null);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PCheckboxComponent.prototype, "hasButtonStyle", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PCheckboxComponent.prototype, "theme", void 0);
__decorate([
    Input('size'),
    __metadata("design:type", Object)
], PCheckboxComponent.prototype, "_size", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_b = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _b : Object)
], PCheckboxComponent.prototype, "onClick", void 0);
__decorate([
    Input('textWhite'),
    __metadata("design:type", Boolean)
], PCheckboxComponent.prototype, "_textWhite", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PCheckboxComponent.prototype, "isLoading", void 0);
__decorate([
    ViewChild('content'),
    __metadata("design:type", typeof (_c = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _c : Object)
], PCheckboxComponent.prototype, "content", void 0);
__decorate([
    ViewChild('deprecatedTestTemplate'),
    __metadata("design:type", typeof (_d = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _d : Object)
], PCheckboxComponent.prototype, "deprecatedTestTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PCheckboxComponent.prototype, "icon", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PCheckboxComponent.prototype, "checkTouched", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PCheckboxComponent.prototype, "pEditable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PCheckboxComponent.prototype, "api", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PCheckboxComponent.prototype, "valid", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PCheckboxComponent.prototype, "saveChangesHook", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PCheckboxComponent.prototype, "onSaveStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PCheckboxComponent.prototype, "onSaveSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PCheckboxComponent.prototype, "onDismiss", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PCheckboxComponent.prototype, "onLeaveCurrent", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PCheckboxComponent.prototype, "editMode", void 0);
__decorate([
    Input('disabled'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], PCheckboxComponent.prototype, "disabled", null);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PCheckboxComponent.prototype, "formControl", void 0);
__decorate([
    Input('required'),
    __metadata("design:type", Boolean)
], PCheckboxComponent.prototype, "_required", void 0);
__decorate([
    Input('readMode'),
    __metadata("design:type", Object)
], PCheckboxComponent.prototype, "_readMode", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_e = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _e : Object)
], PCheckboxComponent.prototype, "keyup", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_f = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _f : Object)
], PCheckboxComponent.prototype, "change", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], PCheckboxComponent.prototype, "value", null);
PCheckboxComponent = PCheckboxComponent_1 = __decorate([
    Component({
        selector: 'p-checkbox',
        templateUrl: './p-checkbox.component.html',
        styleUrls: ['./p-checkbox.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PCheckboxComponent_1),
                multi: true,
            },
        ],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object, LogService,
        PFormsService,
        ModalService])
], PCheckboxComponent);
export { PCheckboxComponent };
//# sourceMappingURL=p-checkbox.component.js.map