import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PThemeEnum } from '../../bootstrap-styles.enum';
export var PasswordStrengthEnum;
(function (PasswordStrengthEnum) {
    PasswordStrengthEnum[PasswordStrengthEnum["WEAK"] = 0] = "WEAK";
    PasswordStrengthEnum[PasswordStrengthEnum["FAIR"] = 1] = "FAIR";
    PasswordStrengthEnum[PasswordStrengthEnum["STRONG"] = 2] = "STRONG";
})(PasswordStrengthEnum || (PasswordStrengthEnum = {}));
let PPasswordStrengthMeterComponent = class PPasswordStrengthMeterComponent {
    constructor(localize) {
        this.localize = localize;
        /**
         * Does the password have invalid characters?
         */
        this.inputValidationFailed = false;
        this.MIN_LENGTH = 7;
        this.PasswordStrengthEnum = PasswordStrengthEnum;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.PThemeEnum = PThemeEnum;
        this.variations = {
            digits: false,
            upperCase: false,
            lowerCase: false,
            nonWords: false,
            minLength: false,
        };
        this.score = null;
        this._passwordToCheck = null;
    }
    /**
     * Set the password that has to be evaluated
     */
    set passwordToCheck(passwordToCheck) {
        if (passwordToCheck === undefined)
            return;
        this._passwordToCheck = passwordToCheck;
        this.checkPassword(passwordToCheck);
    }
    /**
     * Evaluate the strength of a password and return a numeric score
     */
    measureStrength(password) {
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
        let score = 0;
        const KEYS = Object.keys(this.variations);
        for (const key of KEYS) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            score += this.variations[key] ? (100 / KEYS.length) : 0;
        }
        return Math.trunc(score);
    }
    /**
    * Returns the quality of a password based on a numeric score
    */
    get passwordStrength() {
        if (!this._passwordToCheck)
            return null;
        if (this.inputValidationFailed)
            return PasswordStrengthEnum.WEAK;
        if (!this.obligatoryRequirementsFulfilled)
            return PasswordStrengthEnum.WEAK;
        if (this.score !== 100)
            return PasswordStrengthEnum.FAIR;
        return PasswordStrengthEnum.STRONG;
    }
    /**
    * Returns the verbalized and localized quality of a password once required minimal length is reached
    */
    get verbalizedPasswordStrength() {
        switch (this.passwordStrength) {
            case null: return '-';
            case PasswordStrengthEnum.WEAK: return this.localize.transform('Schwach');
            case PasswordStrengthEnum.FAIR: return this.localize.transform('Mäßig');
            case PasswordStrengthEnum.STRONG: return this.localize.transform('Stark');
            default:
                const NEVER = this.passwordStrength;
                throw new Error(`could not get state ${NEVER}`);
        }
    }
    /**
     * Have all obligatory password requirements been fulfilled?
     */
    get obligatoryRequirementsFulfilled() {
        if (this.variations.digits && this.variations.upperCase && this.variations.minLength)
            return true;
        return false;
    }
    /**
    * Triggers new evaluation as user types
    */
    checkPassword(passwordToCheck) {
        const NEW_SCORE = this.measureStrength(passwordToCheck);
        this.score = NEW_SCORE;
    }
    /**
     * Text for min-length hint
     */
    get minLengthHintText() {
        return this.localize.transform('min. ${minLength} Zeichen', {
            minLength: this.MIN_LENGTH.toString(),
        });
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [Object])
], PPasswordStrengthMeterComponent.prototype, "passwordToCheck", null);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PPasswordStrengthMeterComponent.prototype, "inputValidationFailed", void 0);
PPasswordStrengthMeterComponent = __decorate([
    Component({
        selector: 'p-password-strength-meter',
        templateUrl: './p-password-strength-meter.component.html',
        styleUrls: ['./p-password-strength-meter.component.scss'],
    }),
    __metadata("design:paramtypes", [LocalizePipe])
], PPasswordStrengthMeterComponent);
export { PPasswordStrengthMeterComponent };
//# sourceMappingURL=p-password-strength-meter.component.js.map