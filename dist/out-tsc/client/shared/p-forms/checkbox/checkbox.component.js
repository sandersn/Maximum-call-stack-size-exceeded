var CheckboxComponent_1;
var _a, _b;
import { __decorate, __metadata } from "tslib";
/* eslint-disable @angular-eslint/component-selector */
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { LogService } from '@plano/shared/core/log.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
/**
 * @deprecated Use p-checkbox instead
 * It still appears on some places but should be replaced with <p-checkbox> everywhere.
 */
let CheckboxComponent = CheckboxComponent_1 = class CheckboxComponent {
    constructor(console, changeDetectorRef) {
        this.console = console;
        this.changeDetectorRef = changeDetectorRef;
        this.checked = false;
        this.checkedChange = new EventEmitter();
        this.card = false;
        this.btn = true;
        this.hover = false;
        this.PlanoFaIconPool = PlanoFaIconPool;
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
        this.disabled = false;
        this.required = false;
        this.formControl = null;
        this._value = null;
        this.onChange = () => { };
        /** onTouched */
        this.onTouched = () => { };
        this.console.warn('CheckboxComponent is deprecated! Use PCheckboxComponent instead.');
    }
    /** Is this valid? [valid]="…" overwrites the valid state if the formControl. */
    get isValid() {
        var _a;
        if (this.valid !== null)
            return this.valid;
        return !((_a = this.formControl) === null || _a === void 0 ? void 0 : _a.invalid);
    }
    /** the value of this control */
    get value() { return this._value; }
    set value(value) {
        if (value === this._value)
            return;
        this._value = !!value;
        this.onChange(!!value);
    }
    /** Write a new value to the element. */
    writeValue(value) {
        if (this._value === value)
            return;
        this._value = !!value;
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
    registerOnChange(fn) { this.onChange = fn; }
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
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CheckboxComponent.prototype, "checked", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_b = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _b : Object)
], CheckboxComponent.prototype, "checkedChange", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CheckboxComponent.prototype, "card", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CheckboxComponent.prototype, "btn", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CheckboxComponent.prototype, "pEditable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CheckboxComponent.prototype, "api", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CheckboxComponent.prototype, "valid", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CheckboxComponent.prototype, "saveChangesHook", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CheckboxComponent.prototype, "onSaveStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CheckboxComponent.prototype, "onSaveSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CheckboxComponent.prototype, "onDismiss", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CheckboxComponent.prototype, "onLeaveCurrent", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], CheckboxComponent.prototype, "editMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CheckboxComponent.prototype, "disabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CheckboxComponent.prototype, "required", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CheckboxComponent.prototype, "formControl", void 0);
CheckboxComponent = CheckboxComponent_1 = __decorate([
    Component({
        selector: 'checkbox',
        templateUrl: './checkbox.component.html',
        styleUrls: ['./checkbox.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => CheckboxComponent_1),
                multi: true,
            },
        ],
    }),
    __metadata("design:paramtypes", [LogService, typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object])
], CheckboxComponent);
export { CheckboxComponent };
//# sourceMappingURL=checkbox.component.js.map