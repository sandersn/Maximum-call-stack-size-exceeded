var PRadiosComponent_1;
var _a, _b;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { ContentChildren, QueryList, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { Config } from '@plano/shared/core/config';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRadiosRadioComponent } from './p-radios-radio/p-radios-radio.component';
import { LogService } from '../../../../shared/core/log.service';
import { LocalizePipe } from '../../../../shared/core/pipe/localize.pipe';
import { BootstrapSize } from '../../bootstrap-styles.enum';
import { PFormControlComponentBaseDirective } from '../../p-attribute-info/attribute-info-component-base';
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
let PRadiosComponent = PRadiosComponent_1 = class PRadiosComponent extends PFormControlComponentBaseDirective {
    constructor(changeDetectorRef, pFormsService, modalService, console, localizePipe) {
        super(false, changeDetectorRef, pFormsService, console);
        this.changeDetectorRef = changeDetectorRef;
        this.pFormsService = pFormsService;
        this.modalService = modalService;
        this.console = console;
        this.localizePipe = localizePipe;
        this.inline = true;
        /**
         * Should the default icons be visible?
         * Useful if you want to define your own icons in <ng-content>
         */
        this.hideRadioCircles = false;
        // These are necessary Inputs and Outputs for pEditable form-element
        this.pEditable = false;
        this.api = null;
        this.valid = null;
        this.onSaveStart = new EventEmitter();
        this.onSaveSuccess = new EventEmitter();
        // NOTE: Its not possible to dismiss changes on a radio-input. But editable.directive can trigger it – e.g. onDestroy.
        this.onDismiss = new EventEmitter();
        this.onLeaveCurrent = new EventEmitter();
        this.editMode = new EventEmitter(undefined);
        this.checkTouched = false;
        /**
         * Visual size of this component.
         * Can be useful if you have few space in a button-bar or want to have large buttons on mobile.
         */
        this.size = null;
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
        this.BootstrapSize = BootstrapSize;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.CONFIG = Config;
        this._disabled = false;
        this.formControl = null;
        this._readMode = null;
        this._required = null;
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        this._value = null;
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        this._onChange = () => { };
        /** onTouched */
        this.onTouched = () => { };
    }
    /** Is this valid? [valid]="…" overwrites the valid state if the formControl. */
    get isValid() {
        var _a;
        if (this.valid !== null)
            return this.valid;
        return !((_a = this.formControl) === null || _a === void 0 ? void 0 : _a.invalid);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    getTooltip(radio, tooltipRef) {
        return radio.popover && this.popoverValueIsString(radio.popover) ? tooltipRef : null;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    getPopover(radio) {
        return radio.popover && !this.popoverValueIsString(radio.popover) ? radio.popover : null;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    getPopoverTriggers(radio) {
        if (!radio.popover)
            return '';
        if (radio.triggers)
            return radio.triggers;
        return 'mouseenter:mouseleave';
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get getActiveRadio() {
        var _a, _b;
        return (_b = (_a = this.radios) === null || _a === void 0 ? void 0 : _a.find((item) => this.isActive(item))) !== null && _b !== void 0 ? _b : null;
    }
    /**
     * This method checks if the given item is in a active state.
     */
    isActive(item) {
        // If set, the item.checked value has a higher priority then the other expression
        if (item.active !== null)
            return item.active;
        if (item.value === undefined)
            return false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (this.value && this.value.equals)
            return this.value.equals(item.value);
        return this.value === item.value;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onClick(input) {
        if (this.disabled)
            return;
        this.value = input.value;
        input.onClick.emit(input.value);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    popoverValueIsString(popover) {
        return typeof popover === 'string';
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
        if (this._required !== null)
            return this._required;
        return this.formControlInitialRequired();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onChange(value) {
        this._onChange(value);
    }
    /** the value of this control */
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    get value() { return this._value; }
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    set value(value) {
        if (value === this._value)
            return;
        this._value = value;
        if (this.group) {
            this.formControl.setValue(value);
        }
        else {
            this.onChange(value);
        }
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
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    registerOnChange(fn) { this._onChange = fn; }
    /** Set the function to be called when the control receives a touch event. */
    registerOnTouched(fn) { this.onTouched = fn; }
    /** setDisabledState */
    setDisabledState(isDisabled) {
        if (this._disabled === isDisabled)
            return;
        // Set internal attribute
        this._disabled = isDisabled;
        // Refresh the formControl. #two-way-binding
        if (this.formControl && this.formControl.disabled !== this.disabled) {
            this.disabled ? this.formControl.disable() : this.formControl.enable();
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    showFontawesomeIcon(icon) {
        if (icon === null)
            return false;
        return icon !== 'early-bird' && icon !== 'dr-plano';
    }
    /** Filter all errors that should be shown in the ui. */
    get visibleErrors() {
        return this.pFormsService.visibleErrors(this.formControl);
    }
    /**
     * Open a Modal like info-circle does it when in IS_MOBILE mode.
     */
    openCannotEditHint(text) {
        this.modalService.openDefaultModal({
            modalTitle: null,
            description: this.localizePipe.transform(text),
        }, {
            size: 'sm',
            centered: true,
        });
    }
};
__decorate([
    ContentChildren(PRadiosRadioComponent),
    __metadata("design:type", typeof (_b = typeof QueryList !== "undefined" && QueryList) === "function" ? _b : Object)
], PRadiosComponent.prototype, "radios", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PRadiosComponent.prototype, "inline", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PRadiosComponent.prototype, "hideRadioCircles", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PRadiosComponent.prototype, "pEditable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PRadiosComponent.prototype, "api", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PRadiosComponent.prototype, "valid", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PRadiosComponent.prototype, "saveChangesHook", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PRadiosComponent.prototype, "onSaveStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PRadiosComponent.prototype, "onSaveSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PRadiosComponent.prototype, "onDismiss", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PRadiosComponent.prototype, "onLeaveCurrent", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PRadiosComponent.prototype, "editMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PRadiosComponent.prototype, "checkTouched", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PRadiosComponent.prototype, "size", void 0);
__decorate([
    Input('disabled'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], PRadiosComponent.prototype, "disabled", null);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PRadiosComponent.prototype, "formControl", void 0);
__decorate([
    Input('readMode'),
    __metadata("design:type", Object)
], PRadiosComponent.prototype, "_readMode", void 0);
__decorate([
    Input('required'),
    __metadata("design:type", Object)
], PRadiosComponent.prototype, "_required", void 0);
PRadiosComponent = PRadiosComponent_1 = __decorate([
    Component({
        selector: 'p-radios',
        templateUrl: './p-radios.component.html',
        styleUrls: ['./p-radios.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PRadiosComponent_1),
                multi: true,
            },
        ],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object, PFormsService,
        ModalService,
        LogService,
        LocalizePipe])
], PRadiosComponent);
export { PRadiosComponent };
//# sourceMappingURL=p-radios.component.js.map