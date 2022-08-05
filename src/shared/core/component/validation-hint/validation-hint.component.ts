import { SubscriptionLike as ISubscription } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import { Input, Component, ChangeDetectionStrategy, HostBinding, ChangeDetectorRef } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { SLIDE_ON_NGIF_TRIGGER } from '@plano/animations';
import { ValidationHintService } from './validation-hint.service';
import { PThemeEnum } from '../../../../client/shared/bootstrap-styles.enum';
import { LogService } from '../../log.service';
import { LocalizePipe } from '../../pipe/localize.pipe';
import { PPossibleErrorNames, PValidationErrorValue } from '../../validators.types';

@Component({
	selector: 'p-validation-hint',
	templateUrl: './validation-hint.component.html',
	styleUrls: ['./validation-hint.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	animations: [SLIDE_ON_NGIF_TRIGGER],
})
export class ValidationHintComponent implements OnInit, OnDestroy {
	@HostBinding('class.form-control-feedback') protected _alwaysTrue = true;

	/** The Error-Text */
	@Input('text') private _text : string | null = null;
	@Input() public errorValue : PValidationErrorValue | null = null;
	// TODO: remove | 'min' | 'max'
	@Input() private validationName : PPossibleErrorNames | 'pattern' | 'noRecipient' | 'occupied' | 'time' | 'noshiftrefs' | 'number' | 'min' | 'max' = PPossibleErrorNames.REQUIRED;

	@Input() public theme : PThemeEnum.DANGER | PThemeEnum.WARNING | PThemeEnum.INFO | PThemeEnum.SECONDARY = PThemeEnum.DANGER;

	/**
	 * The FormComponent to be validated
	 * Alternatively you can set a errorValue
	 */
	@Input() private control : AbstractControl | null = null;
	@Input() private isInvalid : boolean = false;
	@Input() private checkTouched : boolean = true;
	@Input() private touched : boolean | null = null;

	constructor(
		private localize : LocalizePipe,
		private console : LogService,
		private validationHintService : ValidationHintService,
		private changeDetectorRef : ChangeDetectorRef,
	) {
	}

	private subscription : ISubscription | null = null;

	public ngOnInit() : void {
		this.initText();
		this.initFormControlSubscriber();
	}

	private initFormControlSubscriber() : void {
		if (!this.control) return;
		this.subscription = this.control.valueChanges.subscribe(() => {
			this.initText();
			this.changeDetectorRef.detectChanges();
		});
		this.changeDetectorRef.detectChanges();
	}

	public ngOnDestroy() : void {
		this.subscription?.unsubscribe();
	}

	/**
	 * Is this error visible?
	 */
	public get visible() : boolean {
		let invalid = false;
		if (this.control) {
			// NOTE: Angular has lowercase-error-keys. We should stay as close to angular implementation as possible.
			if (this.validationName !== this.validationName.toLowerCase()) throw new Error(`Keys of form errors must be lowercase. Please fix ${this.validationName}`);
			invalid = this.control.hasError(this.validationName);
		} else {
			invalid = this.isInvalid;
		}
		if (!this.checkTouched) return invalid;

		let touched = true;
		if (this.touched !== null) {
			touched = this.touched;
		} else if (this.control) {
			touched = this.control.touched;
		}
		return invalid && touched;
	}

	public text : string | null = null;

	/**
	 * set default text
	 */
	private initText() : void {
		if (this._text !== null) {
			this.console.debug(`TODO: Remove text="${this._text}" and create new dedicated PPossibleErrorNames`);
			this.text = this._text;
			return;
		}

		let errorValue : PValidationErrorValue | null = null;

		if (this.errorValue) errorValue = this.errorValue;

		if (this.control?.errors) errorValue = this.control.errors[this.validationName];

		let label : string | null = null;
		if (errorValue?.comparedAttributeName) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const comparedControl = (this.control?.parent?.controls as any)[errorValue.comparedAttributeName];
			label = comparedControl?.labelText;
		}

		// NOTE: Looking for a way to prioritize validation hints? -> Check PFormsService.visibleErrors()
		if (errorValue) this.text = this.validationHintService.getErrorText(errorValue, label);
	}
}
