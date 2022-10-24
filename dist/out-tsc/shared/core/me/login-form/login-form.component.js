var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { firstValueFrom } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ElementRef } from '@angular/core';
import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PFormControl } from '@plano/client/shared/p-forms/p-form-control';
import { ForgotPasswordApiService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { Config } from '../../config';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNotUndefined } from '../../null-type-utils';
import { PlanoFaIconPool } from '../../plano-fa-icon-pool.enum';
var View;
(function (View) {
    View[View["LOGIN"] = 0] = "LOGIN";
    View[View["FORGOT_PASSWORD"] = 1] = "FORGOT_PASSWORD";
    View[View["FORGOT_PASSWORD_NEW_PASSWORD_SEND"] = 2] = "FORGOT_PASSWORD_NEW_PASSWORD_SEND";
})(View || (View = {}));
let LoginFormComponent = class LoginFormComponent {
    constructor(router, pFormsService, forgotPasswordApi, validators, meService, recaptchaV3Service) {
        this.router = router;
        this.pFormsService = pFormsService;
        this.forgotPasswordApi = forgotPasswordApi;
        this.validators = validators;
        this.meService = meService;
        this.recaptchaV3Service = recaptchaV3Service;
        this.hideForgotPassword = false;
        this.CONFIG = Config;
        this.email = '';
        this.password = '';
        this.VIEW = View;
        this.forgotPasswordEmail = '';
        this.config = Config;
        this._view = null;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.PThemeEnum = PThemeEnum;
        this.hidePassword = true;
        this.view = View.LOGIN;
        // create form group
        this.forgotPasswordFormGroup = this.pFormsService.group({
            email: new PFormControl({
                formState: {
                    value: this.email,
                    disabled: false,
                },
                validatorOrOpts: [
                    this.validators.required(PApiPrimitiveTypes.Email),
                ],
            }),
        });
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isLoading() {
        return this.meService.isBackendOperationRunning;
    }
    getPathAfterLogin() {
        var _a;
        return (_a = this.meService.pathWhenLoginFailed) !== null && _a !== void 0 ? _a : this.defaultPathAfterLogin;
    }
    /**
     * Whe using AutoFill (e.g. by Bitwarden, 1Password etc.) the password binding does not get triggered. This fixes it.
     * Related: PLANO-120859
     */
    fixAutoFillIssue() {
        assumeNotUndefined(this.passwordInputRef);
        this.password = this.passwordInputRef.nativeElement.value;
    }
    /**
     * Login into the app
     */
    onLoginSubmit() {
        var _a, _b;
        if (!this.password) {
            if ((_a = this.emailInputRef) === null || _a === void 0 ? void 0 : _a.nativeElement.contains(document.activeElement)) {
                (_b = this.passwordInputRef) === null || _b === void 0 ? void 0 : _b.nativeElement.focus();
            }
            return;
        }
        // When forwarding we intentionally use navigateByUrl() to prevent encoding
        // of query parameters. See https://drplano.atlassian.net/browse/PLANO-35829
        this.meService.login(this.meService.calcBasisAuthValue(this.email, this.password), true, true, () => {
            // redirect to new page if login was successful
            this.router.navigateByUrl(this.getPathAfterLogin());
        }, (error) => {
            if (error === 'not_ascii')
                alert('Deine Eingabe enthält ungültige Zeichen.');
            else
                throw error;
        });
    }
    set view(view) {
        if (view === View.FORGOT_PASSWORD)
            this.forgotPasswordEmail = '';
        this._view = view;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get view() {
        assumeDefinedToGetStrictNullChecksRunning(this._view, 'this._view');
        return this._view;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    openLoginView() {
        this.view = View.LOGIN;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    async onForgotPasswordSubmit() {
        if (!this.forgotPasswordFormGroup.invalid) {
            // get reCaptcha token
            const token = await firstValueFrom(this.recaptchaV3Service.execute('FORGOT_PASSWORD'));
            // reset password
            await this.forgotPasswordApi.load({
                searchParams: new HttpParams()
                    .set('email', this.forgotPasswordEmail)
                    .set('token', token),
            });
            this.view = View.FORGOT_PASSWORD_NEW_PASSWORD_SEND;
        }
        else {
            // Now all errors should be shown
            for (const control of Object.values(this.forgotPasswordFormGroup.controls)) {
                control.markAsTouched();
            }
        }
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get passwordFieldType() {
        if (this.hidePassword)
            return PApiPrimitiveTypes.Password;
        return PApiPrimitiveTypes.string;
    }
};
__decorate([
    Input(),
    __metadata("design:type", String)
], LoginFormComponent.prototype, "defaultPathAfterLogin", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], LoginFormComponent.prototype, "hideForgotPassword", void 0);
__decorate([
    ViewChild('emailInputRef'),
    __metadata("design:type", typeof (_c = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _c : Object)
], LoginFormComponent.prototype, "emailInputRef", void 0);
__decorate([
    ViewChild('passwordInputRef'),
    __metadata("design:type", typeof (_d = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _d : Object)
], LoginFormComponent.prototype, "passwordInputRef", void 0);
LoginFormComponent = __decorate([
    Component({
        selector: 'p-login-form[defaultPathAfterLogin]',
        templateUrl: './login-form.component.html',
        styleUrls: ['./login-form.component.scss'],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof Router !== "undefined" && Router) === "function" ? _a : Object, PFormsService,
        ForgotPasswordApiService,
        ValidatorsService,
        MeService, typeof (_b = typeof ReCaptchaV3Service !== "undefined" && ReCaptchaV3Service) === "function" ? _b : Object])
], LoginFormComponent);
export { LoginFormComponent };
//# sourceMappingURL=login-form.component.js.map