var PInputShiftModelIdModalComponent_1;
var _a, _b;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy, forwardRef, ChangeDetectorRef, HostBinding } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SchedulingApiShiftModels } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PPossibleErrorNames } from '@plano/shared/core/validators.types';
import { PApiPrimitiveTypes } from '../../../../shared/api/base/generated-types.ag';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { PThemeEnum } from '../../bootstrap-styles.enum';
let PInputShiftModelIdModalComponent = PInputShiftModelIdModalComponent_1 = class PInputShiftModelIdModalComponent {
    constructor(changeDetectorRef, localizePipe) {
        this.changeDetectorRef = changeDetectorRef;
        this.localizePipe = localizePipe;
        this._label = null;
        this._alwaysTrue = true;
        this.searchTerm = null;
        this.PThemeEnum = PThemeEnum;
        this.PApiPrimitiveTypes = PApiPrimitiveTypes;
        this.selectedItemId = null;
        /*
         * This is the minimum code that is required for a custom control in Angular.
         * Its necessary to make [(ngModel)] and [formControl] work.
         */
        this.disabled = false;
        this.formControl = null;
        this._required = false;
        this._value = null;
        this.onChange = () => { };
        /** onTouched */
        this.onTouched = () => { };
    }
    ngAfterContentInit() {
        this.initValues();
        this.selectedItemId = this.value;
    }
    /**
     * Set values that are necessary for this function.
     * These initValues methods are used in many components.
     * They mostly get used for class attributes that would cause performance issues as a getter.
     */
    initValues() {
        if (this._label === null)
            this._label = this.localizePipe.transform('Tätigkeit wählen …');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get valueItem() {
        if (!this.value)
            return null;
        return this.shiftModels.get(this.value);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get label() {
        // if (this.value !== null) return this.shiftModelsForList.get(this.value).name;
        if (this.value !== null)
            return null;
        return this._label;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    onItemClick(item) {
        if (item === null) {
            this.selectedItemId = null;
            return;
        }
        this.selectedItemId = item.id;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    onModalClosed() {
        this.searchTerm = null;
        this.value = this.selectedItemId;
        this.selectedItemId = null;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    isSelected(item) {
        assumeDefinedToGetStrictNullChecksRunning(this.selectedItemId, 'selectedItemId');
        return this.selectedItemId.equals(item.id);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get shiftModelsForList() {
        return this.shiftModels.search(this.searchTerm);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isValid() {
        return !this.formControl || !this.formControl.invalid;
    }
    /**
     * Is this a required field?
     * This can be set as Input() but if there is a formControl binding,
     * then it takes the info from the formControl’s validators.
     * TODO: 	Replace this by:
     * 				return this.formControlInitialRequired();
     */
    get required() {
        var _a, _b;
        if (this._required)
            return this._required;
        if (this.formControl) {
            const validator = (_b = (_a = this.formControl).validator) === null || _b === void 0 ? void 0 : _b.call(_a, this.formControl);
            if (!validator)
                return false;
            return !!validator[PPossibleErrorNames.REQUIRED] || !!validator[PPossibleErrorNames.ID_DEFINED] || !!validator[PPossibleErrorNames.NOT_UNDEFINED];
        }
        return false;
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
    Input('label'),
    __metadata("design:type", Object)
], PInputShiftModelIdModalComponent.prototype, "_label", void 0);
__decorate([
    HostBinding('class.d-flex'),
    HostBinding('class.btn-group'),
    __metadata("design:type", Object)
], PInputShiftModelIdModalComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_b = typeof SchedulingApiShiftModels !== "undefined" && SchedulingApiShiftModels) === "function" ? _b : Object)
], PInputShiftModelIdModalComponent.prototype, "shiftModels", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputShiftModelIdModalComponent.prototype, "searchTerm", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PInputShiftModelIdModalComponent.prototype, "disabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PInputShiftModelIdModalComponent.prototype, "formControl", void 0);
__decorate([
    Input('required'),
    __metadata("design:type", Boolean)
], PInputShiftModelIdModalComponent.prototype, "_required", void 0);
PInputShiftModelIdModalComponent = PInputShiftModelIdModalComponent_1 = __decorate([
    Component({
        selector: 'p-input-shiftmodel-id-modal[shiftModels]',
        templateUrl: './input-shiftmodel-id-modal.component.html',
        styleUrls: ['./input-shiftmodel-id-modal.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PInputShiftModelIdModalComponent_1),
                multi: true,
            },
        ],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object, LocalizePipe])
], PInputShiftModelIdModalComponent);
export { PInputShiftModelIdModalComponent };
//# sourceMappingURL=input-shiftmodel-id-modal.component.js.map