var _a, _b;
import { __decorate, __metadata, __param } from "tslib";
import * as _ from 'underscore';
import { ChangeDetectorRef, Directive, HostBinding, Inject, Input } from '@angular/core';
import { LogService } from '@plano/shared/core/log.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../shared/core/null-type-utils';
import { PPossibleErrorNames } from '../../../shared/core/validators.types';
import { PFormsService } from '../../service/p-forms.service';
import { PFormGroup } from '../p-forms/p-form-control';
let AttributeInfoComponentBaseDirective = class AttributeInfoComponentBaseDirective {
    constructor(attributeInfoRequired = true, changeDetectorRef, console) {
        this.attributeInfoRequired = attributeInfoRequired;
        this.changeDetectorRef = changeDetectorRef;
        this.console = console;
        /**
         * Should this content be visible?
         * If yes, set it to true
         * If no set it to false
         * If the decision can not be made yet (e.g. because api is not loaded yet), set it to null
         * If the tab component should calculate it, dont set anything.
         */
        this.showInput = null;
        this.canEditInput = null;
        this.prevCanEdit = null;
        this.prevShow = null;
    }
    /**
     * Check if canEdit has changed
     * Info about ngDoCheck: https://indepth.dev/posts/1131/if-you-think-ngdocheck-means-your-component-is-being-checked-read-this-article
     */
    ngDoCheck() {
        var _a, _b;
        if (this.prevCanEdit !== null && this.prevCanEdit !== this.canEdit)
            (_a = this.changeDetectorRef) === null || _a === void 0 ? void 0 : _a.markForCheck();
        if (this.prevShow !== null && this.prevShow !== this.show)
            (_b = this.changeDetectorRef) === null || _b === void 0 ? void 0 : _b.markForCheck();
        return null;
    }
    ngAfterContentChecked() {
        this.prevCanEdit = this.canEdit;
        this.prevShow = this.show;
    }
    ngOnInit() {
        this.validateAI();
        // Make sure lifecycle does not get overwritten in sub-classes.
        // More Info: https://github.com/microsoft/TypeScript/issues/21388#issuecomment-785184392
        return null;
    }
    /**
     * Validate if required attributes are set and
     * if the set values work together / make sense / have a working implementation.
     */
    validateAI() {
        if (!this.attributeInfoRequired)
            return;
        if (this.attributeInfo !== undefined)
            return;
        if (this.show !== null && this.canEdit !== null)
            return;
        if (!!this.console) {
            this.console.error(`attributeInfo (or show & canEdit) is required (${this.constructor.name})`);
        }
        else {
            throw new Error(`attributeInfo (or show & canEdit) is required (${this.constructor.name})`);
        }
    }
    ngAfterContentInit() {
        var _a;
        if (this.attributeInfo !== null)
            return null;
        if (this.show !== null && this.canEdit !== null)
            return null;
        if (this.attributeInfoRequired)
            (_a = this.console) === null || _a === void 0 ? void 0 : _a.deprecated(`${this.constructor.name}: bind either [attributeInfo]="…" or [show]="…" and [canEdit]="…"`);
        // Make sure lifecycle does not get overwritten in sub-classes.
        // More Info: https://github.com/microsoft/TypeScript/issues/21388#issuecomment-785184392
        return null;
    }
    /**
     * Should the content of this Component be visible?
     */
    get show() {
        if (this.showInput !== null)
            return this.showInput;
        if (this.attributeInfo)
            return this.attributeInfo.show;
        if (!this.attributeInfoRequired)
            return true;
        return null;
    }
    /**
     * Should the user get UI elements to edit this components content?
     */
    get canEdit() {
        if (this.canEditInput !== null)
            return this.canEditInput;
        if (this.attributeInfo)
            return this.attributeInfo.canEdit;
        if (!this.attributeInfoRequired)
            return true;
        return null;
    }
    /**
     * A text that describes: »Why is this disabled?«
     */
    get cannotEditHint() {
        if (this._cannotEditHint !== undefined)
            return this._cannotEditHint;
        if (!this.attributeInfo)
            return null;
        if (!this.attributeInfo.vars.cannotEditHint)
            return null;
        return typeof this.attributeInfo.vars.cannotEditHint === 'string' ? this.attributeInfo.vars.cannotEditHint : this.attributeInfo.vars.cannotEditHint();
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], AttributeInfoComponentBaseDirective.prototype, "attributeInfo", void 0);
__decorate([
    Input('show'),
    __metadata("design:type", Object)
], AttributeInfoComponentBaseDirective.prototype, "showInput", void 0);
__decorate([
    Input('canEdit'),
    __metadata("design:type", Object)
], AttributeInfoComponentBaseDirective.prototype, "canEditInput", void 0);
__decorate([
    Input('cannotEditHint'),
    __metadata("design:type", Object)
], AttributeInfoComponentBaseDirective.prototype, "_cannotEditHint", void 0);
AttributeInfoComponentBaseDirective = __decorate([
    Directive({
        // eslint-disable-next-line @angular-eslint/directive-selector
        selector: '[attributeInfo]',
        providers: [{ provide: Boolean, useValue: true }],
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ,
    __param(0, Inject(Boolean)),
    __metadata("design:paramtypes", [Boolean, typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object, LogService])
], AttributeInfoComponentBaseDirective);
export { AttributeInfoComponentBaseDirective };
let PFormControlComponentBaseDirective = class PFormControlComponentBaseDirective extends AttributeInfoComponentBaseDirective {
    constructor(
    /*
     * In an component that extends PFormControlComponentBaseDirective you can set attributeInfoRequired = false
     * This way we can implement attributeInfo step by step into every of our components.
     * NOTE:  Not sure if it is the right way to implement it everywhere. Maybe we should reduce
     *        implementation to PFormControlSwitchComponent
    */
    attributeInfoRequired = true, changeDetectorRef, pFormsService, console) {
        super(attributeInfoRequired, changeDetectorRef, console);
        this.attributeInfoRequired = attributeInfoRequired;
        this.changeDetectorRef = changeDetectorRef;
        this.pFormsService = pFormsService;
        this.console = console;
        /**
         * @deprecated Please use [group]
         */
        this.formControl = null;
        this._prevShow = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this._onChange = () => { };
    }
    get _hasNoFormControl() {
        return !this.formControl;
    }
    ngAfterContentInit() {
        // if (!!this.group && !!this.formControl) throw new Error('Set either formControl or group, not both.')
        if (!!this.attributeInfo && !!this.group) {
            // Does this case currently exist in our code? If not, we can skip PLANO-79682 for now.
            assumeDefinedToGetStrictNullChecksRunning(this.console, 'console');
            this.console.error('Not (fully) implemented yet: PLANO-79682');
            this.updateExistenceOfFormControl();
        }
        return super.ngAfterContentInit();
    }
    ngAfterContentChecked() {
        var _a, _b, _c, _d, _e, _f, _g;
        // Update the Validators.
        // NOTE: This updates the Validators, but it does not re-run the validators.
        (_a = this.formControl) === null || _a === void 0 ? void 0 : _a.updateValidators();
        // We need to re-run the validators. But re-run them here every time, would cause an endless loop of re-runs.
        // So first we check if it is necessary.
        const newErrors = ((_b = this.formControl) === null || _b === void 0 ? void 0 : _b.disabled) ? null : (_d = (_c = this.formControl) === null || _c === void 0 ? void 0 : _c.validator) === null || _d === void 0 ? void 0 : _d.call(_c, this.formControl);
        const oldErrors = {
            ...(_e = this.formControl) === null || _e === void 0 ? void 0 : _e.errors,
        };
        // Don’t care about async validators here.
        delete oldErrors[PPossibleErrorNames.EMAIL_USED];
        delete oldErrors[PPossibleErrorNames.EMAIL_INVALID];
        const ERRORS_STILL_THE_SAME = (!(newErrors && Object.keys(newErrors).length) && !Object.keys(oldErrors).length ||
            _.isEqual(newErrors, oldErrors));
        if (!(ERRORS_STILL_THE_SAME)) {
            (_f = this.formControl) === null || _f === void 0 ? void 0 : _f.updateValueAndValidity();
            (_g = this.formControl) === null || _g === void 0 ? void 0 : _g.markAsTouched();
            // HACK: Seemed like change detection was not updating the parent components.
            // I could not figure out why it happened but i had this issue:
            // I was in a "REFUND" modal on http://127.0.0.1:9000/de/client/booking/2587/participants. Click on a radio
            // button changed validators of anther input. Other input became invalid.
            //
            // PROBLEM:
            // ==> The modal still had the information that it is valid. <==
            //
            // It turned out that the next change detection fixed it.
            // I could not figure out where a change detection was missing.
            requestAnimationFrame(() => this.changeDetectorRef.detectChanges());
        }
        return null;
    }
    /**
     * Imagine: If the component is hidden, and the control is not invalid, the group would be invalid, and the
     * user could not do anything to solve the invalid state. This method should prevent the described case.
     * @returns has changed
     */
    refreshShow() {
        assumeDefinedToGetStrictNullChecksRunning(this.attributeInfo, 'attributeInfo');
        const newShow = this.attributeInfo.show;
        if (newShow === this._prevShow)
            return false;
        assumeDefinedToGetStrictNullChecksRunning(this.formControl, 'formControl');
        if (newShow) {
            if (this.formControl.disabled) {
                this.formControl.updateValueAndValidity();
            }
        }
        else {
            if (this.formControl.enabled) {
                // I added {emitEvent: false} to fix PLANO-74808
                this.formControl.setErrors(null);
            }
        }
        this._prevShow = newShow;
        return true;
    }
    /**
     * @returns has changed
     */
    refreshValue() {
        assumeDefinedToGetStrictNullChecksRunning(this.attributeInfo, 'attributeInfo');
        const newValue = this.attributeInfo.value;
        assumeDefinedToGetStrictNullChecksRunning(this.formControl, 'formControl');
        if (newValue === this.formControl.value)
            return false;
        this.formControl.setValue(newValue, { emitEvent: false });
        return true;
    }
    /**
     * If a formControl should be hidden in UI, it should not leave any errors in the formGroup.
     */
    refreshValueAndShow() {
        if (!this.formControl)
            return;
        if (!this.attributeInfo)
            return;
        // const VALUE_HAS_CHANGED = this.refreshValue();
        const SHOW_HAS_CHANGED = this.refreshShow();
        // if (!VALUE_HAS_CHANGED && !SHOW_HAS_CHANGED) return;
        if (!SHOW_HAS_CHANGED)
            return;
        // this.formControl.updateValueAndValidity();
        this.changeDetectorRef.markForCheck();
    }
    ngDoCheck() {
        this.refreshValueAndShow();
        return super.ngDoCheck();
    }
    ngOnDestroy() {
        this.refreshValueAndShow();
        if (this.attributeInfo && this.group)
            this.removeFormControl();
        return null;
    }
    createFormControl() {
        if (!!this.formControl)
            return;
        assumeDefinedToGetStrictNullChecksRunning(this.group, 'group');
        assumeDefinedToGetStrictNullChecksRunning(this.attributeInfo, 'attributeInfo');
        const NEW_FORM_CONTROL = this.pFormsService.getByAI(this.group, this.attributeInfo);
        NEW_FORM_CONTROL.registerOnChange((newValue) => {
            this._onChange(newValue);
        });
        this.formControl = NEW_FORM_CONTROL;
    }
    removeFormControl() {
        assumeDefinedToGetStrictNullChecksRunning(this.group, 'group');
        assumeDefinedToGetStrictNullChecksRunning(this.attributeInfo, 'attributeInfo');
        const CONTROL = this.group.controls[this.attributeInfo.id];
        if (!CONTROL)
            return;
        CONTROL.unsubscribe();
        this.formControl = null;
        this.group.removeControl(this.attributeInfo.id);
        this.group.updateValueAndValidity();
        this.changeDetectorRef.detectChanges();
        // requestAnimationFrame(() => {
        // 	this.changeDetectorRef.detectChanges();
        // });
    }
    updateExistenceOfFormControl() {
        var _a;
        if ((_a = this.attributeInfo) === null || _a === void 0 ? void 0 : _a.show) {
            this.createFormControl();
        }
        else {
            this.removeFormControl();
        }
    }
    /**
     * Should this be marked as required in ui? E.g. red underline.
     */
    formControlInitialRequired() {
        var _a, _b;
        if (this.formControl) {
            const validator = (_b = (_a = this.formControl).validator) === null || _b === void 0 ? void 0 : _b.call(_a, this.formControl);
            if (!validator)
                return false;
            return !!validator[PPossibleErrorNames.REQUIRED] || !!validator[PPossibleErrorNames.ID_DEFINED] || !!validator[PPossibleErrorNames.NOT_UNDEFINED];
        }
        return false;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormControlComponentBaseDirective.prototype, "formControl", void 0);
__decorate([
    Input(),
    __metadata("design:type", PFormGroup)
], PFormControlComponentBaseDirective.prototype, "group", void 0);
__decorate([
    HostBinding('class.form-control-less'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PFormControlComponentBaseDirective.prototype, "_hasNoFormControl", null);
PFormControlComponentBaseDirective = __decorate([
    Directive({
        // eslint-disable-next-line @angular-eslint/directive-selector
        selector: '[attributeInfo]',
        providers: [{ provide: Boolean, useValue: true }],
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ,
    __param(0, Inject(Boolean)),
    __metadata("design:paramtypes", [Boolean, typeof (_b = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _b : Object, PFormsService,
        LogService])
], PFormControlComponentBaseDirective);
export { PFormControlComponentBaseDirective };
//# sourceMappingURL=attribute-info-component-base.js.map