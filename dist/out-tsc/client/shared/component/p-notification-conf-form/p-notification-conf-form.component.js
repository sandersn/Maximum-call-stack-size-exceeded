var PNotificationConfFormComponent_1;
var _a, _b, _c, _d, _e;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, forwardRef, EventEmitter, Output, ChangeDetectorRef, ElementRef, NgZone, ApplicationRef } from '@angular/core';
import { Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '../../../../shared/core/plano-fa-icon-pool.enum';
import { ToastsService } from '../../../service/toasts.service';
import { EditableDirective } from '../../p-editable/editable/editable.directive';
/**
 * <p-notification-conf-form> provides form controls to set notification configuration values.
 */
let PNotificationConfFormComponent = PNotificationConfFormComponent_1 = class PNotificationConfFormComponent extends EditableDirective {
    constructor(changeDetectorRef, el, zone, applicationRef, console, toastsService, localize) {
        super(changeDetectorRef, el, zone, applicationRef, console, toastsService, localize);
        this.changeDetectorRef = changeDetectorRef;
        this.el = el;
        this.zone = zone;
        this.applicationRef = applicationRef;
        this.console = console;
        this.toastsService = toastsService;
        this.localize = localize;
        this.shift = null;
        this.valueText = null;
        // These are necessary Inputs and Outputs for pEditable form-element
        this.pEditable = false;
        this.api = null;
        this.valid = null;
        this.saveChangesHook = () => { };
        this.onSaveStart = new EventEmitter();
        this.onSaveSuccess = new EventEmitter();
        this.onDismiss = new EventEmitter();
        this.onLeaveCurrent = new EventEmitter();
        this.editMode = new EventEmitter(undefined);
        this.PlanoFaIconPool = PlanoFaIconPool;
        /**
         * This is the minimum code that is required for a custom control in Angular.
         * Its necessary to make [(ngModel)] and [formControl] work.
         */
        this.disabled = false;
        this.formControl = null;
        this._value = null;
        this.onChange = () => { };
        /** onTouched */
        this.onTouched = () => { };
        if (this.valueText === null)
            this.valueText = this.localize.transform('Eingeteilte User informieren');
    }
    /** Is this valid? [valid]="…" overwrites the valid state if the formControl. */
    get isValid() {
        var _a;
        if (this.valid !== null)
            return this.valid;
        return !((_a = this.formControl) === null || _a === void 0 ? void 0 : _a.invalid);
    }
    ngAfterContentInit() {
    }
    /**
     * Is this control visible or not?
     */
    get visible() {
        if (!this.shift)
            return true;
        if (this.api.data.shiftChangeSelector.isChangingShifts)
            return true;
        if (!this.shift.assignmentProcess)
            return true;
        if (this.shift.assignmentProcess.state === SchedulingApiAssignmentProcessState.EARLY_BIRD_SCHEDULING)
            return true;
        if (this.shift.assignmentProcess.state === SchedulingApiAssignmentProcessState.EARLY_BIRD_FINISHED)
            return true;
        return false;
    }
    /** the value of this control */
    get value() { return this._value; }
    set value(value) {
        if (value === this._value)
            return;
        this._value = !!value;
        this.onChange(value);
    }
    /** Write a new value to the element. */
    writeValue(value) {
        if (this._value === value)
            return;
        this._value = !!value;
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
    __metadata("design:type", Object)
], PNotificationConfFormComponent.prototype, "shift", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PNotificationConfFormComponent.prototype, "valueText", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PNotificationConfFormComponent.prototype, "pEditable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PNotificationConfFormComponent.prototype, "api", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PNotificationConfFormComponent.prototype, "valid", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PNotificationConfFormComponent.prototype, "saveChangesHook", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PNotificationConfFormComponent.prototype, "onSaveStart", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PNotificationConfFormComponent.prototype, "onSaveSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PNotificationConfFormComponent.prototype, "onDismiss", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PNotificationConfFormComponent.prototype, "onLeaveCurrent", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PNotificationConfFormComponent.prototype, "editMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PNotificationConfFormComponent.prototype, "disabled", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PNotificationConfFormComponent.prototype, "formControl", void 0);
PNotificationConfFormComponent = PNotificationConfFormComponent_1 = __decorate([
    Component({
        selector: 'p-notification-conf-form',
        templateUrl: './p-notification-conf-form.component.html',
        styleUrls: ['./p-notification-conf-form.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => PNotificationConfFormComponent_1),
                multi: true,
            },
            EditableDirective,
        ],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object, typeof (_b = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _b : Object, typeof (_c = typeof NgZone !== "undefined" && NgZone) === "function" ? _c : Object, typeof (_d = typeof ApplicationRef !== "undefined" && ApplicationRef) === "function" ? _d : Object, LogService,
        ToastsService,
        LocalizePipe])
], PNotificationConfFormComponent);
export { PNotificationConfFormComponent };
//# sourceMappingURL=p-notification-conf-form.component.js.map