var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Input } from '@angular/core';
import { Config } from '@plano/shared/core/config';
import { PFormControl } from '../p-form-control';
let PFormGroupComponent = class PFormGroupComponent {
    constructor(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
        this._alwaysTrue = true;
        this.readMode = false;
        this.isLoading = false;
        /**
         * Content for the <label> above your input/checkbox/…
         * Note that the label can also be set here: new PFormControl(labelText : string, …)
         */
        this._label = null;
        /**
         * More infos for the user about how this data is used later.
         * Note that the description can also be set here: new PFormControl(…, …, description : string, …)
         */
        this._description = null;
        /**
         * If you want to use HTML in the description, set descriptionHTML instead of description
         */
        this.descriptionHTML = null;
        /**
         * Visual feedback if there is a problem like e.g. a validation error.
         * It is not necessary to provide this, if you have provided a [control].
         */
        this._hasDanger = false;
        this.checkTouched = true;
        /**
         * Some PFormControl.
         * Needed to get info about errors.
         */
        this.control = null;
        this.subscription = null;
    }
    /**
     * Determine if component has danger
     */
    get hasDanger() {
        if (this._hasDanger)
            return true;
        if (this.control && (!this.checkTouched || this.control.touched) && this.control.errors)
            return true;
        return false;
    }
    ngOnInit() {
        this.initFormControlSubscriber();
    }
    initFormControlSubscriber() {
        if (!this.control)
            return;
        this.subscription = this.control.valueChanges.subscribe(() => {
            this.changeDetectorRef.detectChanges();
        });
    }
    ngOnDestroy() {
        var _a;
        (_a = this.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get label() {
        if (!!this._label)
            return this._label;
        if (!(this.control instanceof PFormControl))
            return null;
        if (this.control.labelText === undefined)
            return null;
        return this.control.labelText;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get description() {
        if (!!this._description)
            return this._description;
        if (!(this.control instanceof PFormControl))
            return null;
        if (this.control.description === undefined)
            return null;
        return this.control.description;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isMobile() {
        return Config.IS_MOBILE;
    }
};
__decorate([
    HostBinding('class.form-group'),
    __metadata("design:type", Object)
], PFormGroupComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormGroupComponent.prototype, "readMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormGroupComponent.prototype, "isLoading", void 0);
__decorate([
    HostBinding('class.has-danger'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PFormGroupComponent.prototype, "hasDanger", null);
__decorate([
    Input('label'),
    __metadata("design:type", Object)
], PFormGroupComponent.prototype, "_label", void 0);
__decorate([
    Input('description'),
    __metadata("design:type", Object)
], PFormGroupComponent.prototype, "_description", void 0);
__decorate([
    Input('descriptionHTML'),
    __metadata("design:type", Object)
], PFormGroupComponent.prototype, "descriptionHTML", void 0);
__decorate([
    Input('hasDanger'),
    __metadata("design:type", Boolean)
], PFormGroupComponent.prototype, "_hasDanger", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PFormGroupComponent.prototype, "checkTouched", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PFormGroupComponent.prototype, "control", void 0);
PFormGroupComponent = __decorate([
    Component({
        selector: 'p-form-group',
        templateUrl: './p-form-group.component.html',
        styleUrls: ['./p-form-group.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    })
    /**
     * A wrapper for form-elements like checkbox, input, textarea etc.
     * It adds the Label to the form-element, it highlights the label if
     * the PFormControl is invalid etc.
     * @example
     *   <p-form-group
     *     label="First Name" i18n-label
     *     [control]="formGroup.get('firstName')!"
     *   >
     *     <p-checkbox ...></p-checkbox>
     *   </p-form-group>
     */
    ,
    __metadata("design:paramtypes", [typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object])
], PFormGroupComponent);
export { PFormGroupComponent };
//# sourceMappingURL=p-form-group.component.js.map