var PRadioComponent_1;
var _a, _b;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Input } from '@angular/core';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
let PRadioComponent = PRadioComponent_1 = class PRadioComponent {
    constructor(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
        this.btn = true;
        this.checkedChange = new EventEmitter();
        this.checked = false;
        this.card = false;
        this.icon = null;
        // These are necessary Inputs and Outputs for pEditable form-element
        this.pEditable = false;
        this.api = null;
        this.valid = null;
        this.onSaveStart = new EventEmitter();
        this.onSaveSuccess = new EventEmitter();
        this.onDismiss = new EventEmitter();
        this.onLeaveCurrent = new EventEmitter();
        this.editMode = new EventEmitter(undefined);
        this.hover = false;
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
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get radioIcon() {
        if (!!this.icon)
            return this.icon;
        if (this.checked || (this.hover && !this.disabled))
            return PlanoFaIconPool.RADIO_SELECTED;
        return PlanoFaIconPool.RADIO_UNSELECTED;
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
        this._value = value;
        this.onChange(value);
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
], PRadioComponent.prototype, "btn", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_b = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _b : Object)
], PRadioComponent.prototype, "checkedChange", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PRadioComponent.prototype, "checked", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PRadioComponent.prototype, "card", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PRadioComponent.prototype, "icon", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PRadioComponent.prototype, "pEditable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PRadioComponent.prototype, "api", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PRadioComponent.prototype, "valid", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PRadioComponent.prototype, "saveChangesHook", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PRadioComponent.prototype, "onSaveStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PRadioComponent.prototype, "onSaveSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PRadioComponent.prototype, "onDismiss", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PRadioComponent.prototype, "onLeaveCurrent", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PRadioComponent.prototype, "editMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PRadioComponent.prototype, "disabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PRadioComponent.prototype, "required", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PRadioComponent.prototype, "formControl", void 0);
PRadioComponent = PRadioComponent_1 = __decorate([
    Component({
        selector: 'p-radio',
        templateUrl: './p-radio.component.html',
        styleUrls: ['./p-radio.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PRadioComponent_1),
                multi: true,
            },
        ],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object])
], PRadioComponent);
export { PRadioComponent };
//# sourceMappingURL=p-radio.component.js.map