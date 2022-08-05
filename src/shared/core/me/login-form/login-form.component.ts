import { ReCaptchaV3Service } from 'ng-recaptcha';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse} from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import { ElementRef} from '@angular/core';
import { Component, Input, ViewChild } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PFormGroup } from '@plano/client/shared/p-forms/p-form-control';
import { PFormControl } from '@plano/client/shared/p-forms/p-form-control';
import { ForgotPasswordApiService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { Config } from '../../config';
import { PComponentInterface } from '../../interfaces/component.interface';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNotUndefined } from '../../null-type-utils';
import { PlanoFaIconPool } from '../../plano-fa-icon-pool.enum';

enum View {
	LOGIN,
	FORGOT_PASSWORD,
	FORGOT_PASSWORD_NEW_PASSWORD_SEND,
}

@Component({
	selector: 'p-login-form[defaultPathAfterLogin]',
	templateUrl: './login-form.component.html',
	styleUrls: ['./login-form.component.scss'],
})
export class LoginFormComponent implements PComponentInterface {
	@Input() private defaultPathAfterLogin ! : string;
	@Input() public hideForgotPassword = false;

	public readonly CONFIG : typeof Config = Config;

	public email : string = '';
	public password : string = '';

	public readonly VIEW : typeof View = View;

	public forgotPasswordFormGroup : PFormGroup;
	public forgotPasswordEmail : string = '';

	public config : typeof Config = Config;

	private _view : View | null = null;

	@ViewChild('emailInputRef') public emailInputRef ?: ElementRef<HTMLInputElement>;
	@ViewChild('passwordInputRef') public passwordInputRef ?: ElementRef<HTMLInputElement>;

	constructor(
		private router : Router,
		private pFormsService : PFormsService,
		public forgotPasswordApi : ForgotPasswordApiService,
		private validators : ValidatorsService,
		public meService : MeService,
		private recaptchaV3Service : ReCaptchaV3Service,
	) {
		this.view = View.LOGIN;

		// create form group
		this.forgotPasswordFormGroup = this.pFormsService.group(
			{
				email : new PFormControl({
					formState: {
						value : this.email,
						disabled: false,
					},
					validatorOrOpts: [
						this.validators.required(PApiPrimitiveTypes.Email),
					],
				}),
			});
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public PThemeEnum = PThemeEnum;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get isLoading() : PComponentInterface['isLoading'] {
		return this.meService.isBackendOperationRunning;
	}

	private getPathAfterLogin() : string {
		return this.meService.pathWhenLoginFailed ?? this.defaultPathAfterLogin;
	}

	/**
	 * Whe using AutoFill (e.g. by Bitwarden, 1Password etc.) the password binding does not get triggered. This fixes it.
	 * Related: PLANO-120859
	 */
	public fixAutoFillIssue() : void {
		assumeNotUndefined(this.passwordInputRef);
		this.password = this.passwordInputRef.nativeElement.value;
	}

	/**
	 * Login into the app
	 */
	public onLoginSubmit() : void {
		if (!this.password) {
			if (this.emailInputRef?.nativeElement.contains(document.activeElement)) {
				this.passwordInputRef?.nativeElement.focus();
			}
			return;
		}

		// When forwarding we intentionally use navigateByUrl() to prevent encoding
		// of query parameters. See https://drplano.atlassian.net/browse/PLANO-35829
		this.meService.login(
			this.meService.calcBasisAuthValue(this.email, this.password), true, true,
			() => {
				// redirect to new page if login was successful
				this.router.navigateByUrl(this.getPathAfterLogin());
			},
			(error : 'not_ascii' | HttpErrorResponse) => {
				if (error === 'not_ascii')
					alert('Deine Eingabe enthält ungültige Zeichen.');
				else
					throw error;
			},
		);
	}

	public set view(view : View) {
		if (view === View.FORGOT_PASSWORD)
			this.forgotPasswordEmail = '';

		this._view = view;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get view() : View {
		assumeDefinedToGetStrictNullChecksRunning(this._view, 'this._view');
		return this._view;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public openLoginView() : void {
		this.view = View.LOGIN;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public async onForgotPasswordSubmit() : Promise<void> {
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
		} else {
			// Now all errors should be shown
			for (const control of Object.values(this.forgotPasswordFormGroup.controls)) {
				(control as AbstractControl).markAsTouched();
			}
		}
	}

	public hidePassword : boolean = true;

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get passwordFieldType() : PApiPrimitiveTypes.Password | PApiPrimitiveTypes.string {
		if (this.hidePassword) return PApiPrimitiveTypes.Password;
		return PApiPrimitiveTypes.string;
	}
}
