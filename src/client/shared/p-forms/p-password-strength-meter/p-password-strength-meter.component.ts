import { Component, Input } from '@angular/core';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PThemeEnum } from '../../bootstrap-styles.enum';

export enum PasswordStrengthEnum {
	WEAK,
	FAIR,
	STRONG,
}

@Component({
	selector: 'p-password-strength-meter',
	templateUrl: './p-password-strength-meter.component.html',
	styleUrls: ['./p-password-strength-meter.component.scss'],
})
export class PPasswordStrengthMeterComponent {

	/**
	 * Set the password that has to be evaluated
	 */
	@Input() public set passwordToCheck(passwordToCheck : string | undefined) {
		if (passwordToCheck === undefined) return;
		this._passwordToCheck = passwordToCheck;
		this.checkPassword(passwordToCheck);
	}

	/**
	 * Does the password have invalid characters?
	 */
	@Input() public inputValidationFailed : boolean = false;

	constructor(
		private localize : LocalizePipe,
	) { }

	private readonly MIN_LENGTH = 7;

	public PasswordStrengthEnum = PasswordStrengthEnum;
	public PlanoFaIconPool = PlanoFaIconPool;
	public PThemeEnum = PThemeEnum;

	public variations = {
		digits: false,
		upperCase: false,
		lowerCase: false,
		nonWords: false,
		minLength: false,
	};

	public score : number | null = null;

	private _passwordToCheck : string | null = null;

	/**
	 * Evaluate the strength of a password and return a numeric score
	 */
	public measureStrength(password : string) : number {
		if (!password) {
			// Reset score and check marks if invalid letters || no password
			this.variations.digits = false;
			this.variations.upperCase = false;
			this.variations.lowerCase = false;
			this.variations.nonWords = false;
			this.variations.minLength = false;
			return 0;
		}

		this.variations.digits = /\d/.test(password);
		this.variations.upperCase = /[A-ZÄÖÜ]/.test(password);
		this.variations.lowerCase = /[a-zäöü]/.test(password);
		this.variations.nonWords = /[^\dA-Za-zÄÖÜäöü]/.test(password);
		this.variations.minLength = password.length >= this.MIN_LENGTH;

		let score : number = 0;
		const KEYS = Object.keys(this.variations);
		for (const key of KEYS) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			score += (this.variations as any)[key] ? (100 / KEYS.length) : 0;
		}
		return Math.trunc(score);
	}


	/**
	* Returns the quality of a password based on a numeric score
	*/
	public get passwordStrength() : PasswordStrengthEnum | null {
		if (!this._passwordToCheck) return null;
		if (this.inputValidationFailed) return PasswordStrengthEnum.WEAK;
		if (!this.obligatoryRequirementsFulfilled) return PasswordStrengthEnum.WEAK;
		if (this.score !== 100) return PasswordStrengthEnum.FAIR;
		return PasswordStrengthEnum.STRONG;
	}

	/**
	* Returns the verbalized and localized quality of a password once required minimal length is reached
	*/
	public get verbalizedPasswordStrength() : string {
		switch (this.passwordStrength) {
			case null: return '-';
			case PasswordStrengthEnum.WEAK: return this.localize.transform('Schwach');
			case PasswordStrengthEnum.FAIR: return this.localize.transform('Mäßig');
			case PasswordStrengthEnum.STRONG: return this.localize.transform('Stark');
			default:
				const NEVER : never = this.passwordStrength;
				throw new Error(`could not get state ${NEVER}`);
		}
	}

	/**
	 * Have all obligatory password requirements been fulfilled?
	 */
	private get	obligatoryRequirementsFulfilled() : boolean {
		if (this.variations.digits && this.variations.upperCase && this.variations.minLength) return true;
		return false;
	}

	/**
	* Triggers new evaluation as user types
	*/
	public checkPassword(passwordToCheck : string) : void {
		const NEW_SCORE = this.measureStrength(passwordToCheck);
		this.score = NEW_SCORE;
	}

	/**
	 * Text for min-length hint
	 */
	public get minLengthHintText() : string {
		return this.localize.transform('min. ${minLength} Zeichen', {
			minLength: this.MIN_LENGTH.toString(),
		});
	}
}
