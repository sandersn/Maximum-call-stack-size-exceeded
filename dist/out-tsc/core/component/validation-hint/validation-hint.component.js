var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Input, Component, ChangeDetectionStrategy, HostBinding, ChangeDetectorRef } from '@angular/core';
import { SLIDE_ON_NGIF_TRIGGER } from '@plano/animations';
import { ValidationHintService } from './validation-hint.service';
import { PThemeEnum } from '../../../../client/shared/bootstrap-styles.enum';
import { LogService } from '../../log.service';
import { LocalizePipe } from '../../pipe/localize.pipe';
import { PPossibleErrorNames } from '../../validators.types';
let ValidationHintComponent = class ValidationHintComponent {
    constructor(localize, console, validationHintService, changeDetectorRef) {
        this.localize = localize;
        this.console = console;
        this.validationHintService = validationHintService;
        this.changeDetectorRef = changeDetectorRef;
        this._alwaysTrue = true;
        /** The Error-Text */
        this._text = null;
        this.errorValue = null;
        // TODO: remove | 'min' | 'max'
        this.validationName = PPossibleErrorNames.REQUIRED;
        this.theme = PThemeEnum.DANGER;
        /**
         * The FormComponent to be validated
         * Alternatively you can set a errorValue
         */
        this.control = null;
        this.isInvalid = false;
        this.checkTouched = true;
        this.touched = null;
        this.subscription = null;
        this.text = null;
    }
    ngOnInit() {
        this.initText();
        this.initFormControlSubscriber();
    }
    initFormControlSubscriber() {
        if (!this.control)
            return;
        this.subscription = this.control.valueChanges.subscribe(() => {
            this.initText();
            this.changeDetectorRef.detectChanges();
        });
        this.changeDetectorRef.detectChanges();
    }
    ngOnDestroy() {
        var _a;
        (_a = this.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
    /**
     * Is this error visible?
     */
    get visible() {
        let invalid = false;
        if (this.control) {
            // NOTE: Angular has lowercase-error-keys. We should stay as close to angular implementation as possible.
            if (this.validationName !== this.validationName.toLowerCase())
                throw new Error(`Keys of form errors must be lowercase. Please fix ${this.validationName}`);
            invalid = this.control.hasError(this.validationName);
        }
        else {
            invalid = this.isInvalid;
        }
        if (!this.checkTouched)
            return invalid;
        let touched = true;
        if (this.touched !== null) {
            touched = this.touched;
        }
        else if (this.control) {
            touched = this.control.touched;
        }
        return invalid && touched;
    }
    /**
     * set default text
     */
    initText() {
        var _a, _b, _c;
        if (this._text !== null) {
            this.console.debug(`TODO: Remove text="${this._text}" and create new dedicated PPossibleErrorNames`);
            this.text = this._text;
            return;
        }
        let errorValue = null;
        if (this.errorValue)
            errorValue = this.errorValue;
        if ((_a = this.control) === null || _a === void 0 ? void 0 : _a.errors)
            errorValue = this.control.errors[this.validationName];
        let label = null;
        if (errorValue === null || errorValue === void 0 ? void 0 : errorValue.comparedAttributeName) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const comparedControl = ((_c = (_b = this.control) === null || _b === void 0 ? void 0 : _b.parent) === null || _c === void 0 ? void 0 : _c.controls)[errorValue.comparedAttributeName];
            label = comparedControl === null || comparedControl === void 0 ? void 0 : comparedControl.labelText;
        }
        // NOTE: Looking for a way to prioritize validation hints? -> Check PFormsService.visibleErrors()
        if (errorValue)
            this.text = this.validationHintService.getErrorText(errorValue, label);
    }
};
__decorate([
    HostBinding('class.form-control-feedback'),
    __metadata("design:type", Object)
], ValidationHintComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input('text'),
    __metadata("design:type", Object)
], ValidationHintComponent.prototype, "_text", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ValidationHintComponent.prototype, "errorValue", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], ValidationHintComponent.prototype, "validationName", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ValidationHintComponent.prototype, "theme", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ValidationHintComponent.prototype, "control", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ValidationHintComponent.prototype, "isInvalid", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ValidationHintComponent.prototype, "checkTouched", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ValidationHintComponent.prototype, "touched", void 0);
ValidationHintComponent = __decorate([
    Component({
        selector: 'p-validation-hint',
        templateUrl: './validation-hint.component.html',
        styleUrls: ['./validation-hint.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
        animations: [SLIDE_ON_NGIF_TRIGGER],
    }),
    __metadata("design:paramtypes", [LocalizePipe,
        LogService,
        ValidationHintService, typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object])
], ValidationHintComponent);
export { ValidationHintComponent };
//# sourceMappingURL=validation-hint.component.js.map