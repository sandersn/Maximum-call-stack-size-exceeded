import { UntypedFormControl, FormGroup as AngularFormGroup } from '@angular/forms';
import { PApiPrimitiveTypes } from '../../../shared/api/base/generated-types.ag';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNotUndefined } from '../../../shared/core/null-type-utils';
import { ValidatorsService } from '../../../shared/core/validators.service';
import { PValidatorObject, PPossibleErrorNames } from '../../../shared/core/validators.types';
/** @deprecated use FormGroup<…> instead. It has better types */
export class PFormGroup extends AngularFormGroup {
    /**
     * Retrieves a child control given the control's name or path.
     *
     * @param path A dot-delimited string or array of string/number values that define the path to the
     * control.
     *
     * @usageNotes
     * ### Retrieve a nested control
     *
     * For example, to get a `name` control nested within a `person` sub-group:
     *
     * 	`this.form.get('person.name');`
     *
     * -OR-
     *
     * 	`this.form.get(['person', 'name']);`
     *
     * ### Retrieve a control in a FormArray
     *
     * When accessing an element inside a FormArray, you can use an element index.
     * For example, to get a `price` control from the first element in an `items` array you can use:
     *
     * 	`this.form.get('items.0.price');`
     *
     * -OR-
     *
     * 	`this.form.get(['items', 0, 'price']);`
     */
    get(path) {
        return super.get(path);
    }
}
const turnIntoAngularCompatibleValidatorArray = (input) => {
    if (input === null)
        return null;
    const pValidatorOrOptions = [];
    for (const validator of input) {
        pValidatorOrOptions.push(validator instanceof PValidatorObject ? validator.fn : validator);
    }
    return pValidatorOrOptions.length ? pValidatorOrOptions : null;
};
export class PFormControl extends UntypedFormControl {
    constructor(input) {
        var _a, _b;
        super(input.formState, turnIntoAngularCompatibleValidatorArray((_a = input.validatorOrOpts) !== null && _a !== void 0 ? _a : []), input.asyncValidator);
        this.subscription = null;
        /**
         * Validators that gets set by a custom form component.
         *
         * Example: <p-input> can have it’s own Validators.
         * These can be validators that validate the components value (Not the model or formControl.value!)
         * They can also validate against locale specific syntaxes.
         * The p-input needs to take care that the formControl.componentValidators() gets filled correctly.
         */
        this.componentValidators = () => null;
        /**
         * Here we store Validators that are fix to this FormControl.
         * They can be combined with additional validators from AttributeInfo later.
         *
         * @deprecated provide an attributeInfo. PFormControl will take care of
         * - attributeInfo.validators()
         * - validators for attributeInfo.primitiveType()
         * - validators that get appended to the formControl by the component
        */
        this.fixedValidatorFns = [];
        this.attributeInfo = input.attributeInfo;
        this.labelText = input.labelText;
        this.description = input.description;
        this.isReadMode = input.isReadMode;
        this.fixedValidatorFns = (_b = input.validatorOrOpts) !== null && _b !== void 0 ? _b : [];
        this.updateValidators();
        if (input.subscribe !== undefined) {
            this.subscription = this.valueChanges.subscribe((value) => {
                assumeNotUndefined(input.subscribe);
                input.subscribe(value);
            });
        }
    }
    /**
     * Unsubscribe all possible subscriptions here
     */
    unsubscribe() {
        var _a;
        (_a = this.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
    /**
     * Get all basic validators that should ALWAYS apply to the provided primitiveType
     */
    getValidatorsForPrimitiveType(primitiveType) {
        switch (primitiveType) {
            case PApiPrimitiveTypes.Date:
            case PApiPrimitiveTypes.DateExclusiveEnd:
            case PApiPrimitiveTypes.DateTime:
            case PApiPrimitiveTypes.Enum:
            case PApiPrimitiveTypes.Id:
            case PApiPrimitiveTypes.LocalTime:
            case PApiPrimitiveTypes.ShiftId:
            case PApiPrimitiveTypes.ShiftSelector:
            case PApiPrimitiveTypes.any:
            case PApiPrimitiveTypes.boolean:
            case PApiPrimitiveTypes.string:
            case PApiPrimitiveTypes.Search:
            case PApiPrimitiveTypes.Image:
            case PApiPrimitiveTypes.ApiList:
            case PApiPrimitiveTypes.Duration:
                return [];
            case PApiPrimitiveTypes.number:
                return [new ValidatorsService().number(primitiveType)];
            case PApiPrimitiveTypes.Email:
                return [new ValidatorsService().email()];
            case PApiPrimitiveTypes.Url:
                return [new ValidatorsService().url()];
            case PApiPrimitiveTypes.Iban:
                return [new ValidatorsService().iban()];
            case PApiPrimitiveTypes.Bic:
                return [new ValidatorsService().bic()];
            case PApiPrimitiveTypes.PostalCode:
                return [new ValidatorsService().plz()];
            case PApiPrimitiveTypes.Tel:
                return [new ValidatorsService().phone()];
            case PApiPrimitiveTypes.Password:
                return [new ValidatorsService().password()];
            case PApiPrimitiveTypes.Currency:
                return [
                    new ValidatorsService().currency(),
                ];
            case PApiPrimitiveTypes.Integer:
                return [new ValidatorsService().maxDecimalPlacesCount(0, primitiveType)];
            case PApiPrimitiveTypes.Minutes:
            case PApiPrimitiveTypes.Hours:
            case PApiPrimitiveTypes.Days:
            case PApiPrimitiveTypes.Years:
            case PApiPrimitiveTypes.Months:
                return [
                    new ValidatorsService().min(0, true, primitiveType),
                    new ValidatorsService().maxDecimalPlacesCount(0, primitiveType),
                ];
            case PApiPrimitiveTypes.Percent:
                return [
                    new ValidatorsService().min(0, true, primitiveType),
                ];
        }
    }
    get attributeInfoValidatorObjects() {
        var _a, _b;
        return (_b = (_a = this.attributeInfo) === null || _a === void 0 ? void 0 : _a.validations.map((item) => item()).filter((item) => {
            // Remove "null" items.
            // Sometimes a AttributeInfo.validators item returns a PValidatorObject, sometimes null.
            // Null means that the validator is inactive.
            if (item === null)
                return false;
            return true;
        })) !== null && _b !== void 0 ? _b : [];
    }
    /**
     * Get the validators that can possibly change.
     */
    getAttributeInfoValidators() {
        // Get the validators that can possibly change.
        const result = this.attributeInfoValidatorObjects;
        return result;
    }
    /**
     * Get the validators that will always be the same, as long as this formControl exists.
     * @deprecated
     */
    getFixedValidatorFns() {
        var _a;
        return (_a = this.fixedValidatorFns) !== null && _a !== void 0 ? _a : [];
    }
    /** Basic validators that should ALWAYS apply to the provided primitiveType */
    getPrimitiveTypeValidators() {
        var _a;
        const result = (((_a = this.attributeInfo) === null || _a === void 0 ? void 0 : _a.primitiveType) ? this.getValidatorsForPrimitiveType(this.attributeInfo.primitiveType) : []);
        return result;
    }
    /** @see PFormGroup['componentValidators'] */
    getComponentValidator() {
        var _a;
        const result = (_a = this.componentValidators) !== null && _a !== void 0 ? _a : (() => null);
        return result;
    }
    allValidators() {
        /**
         * Get the validators delivered by the api. They can possibly change.
         */
        const attributeInfoValidators = this.getAttributeInfoValidators();
        /** @deprecated */
        const fixedValidatorFns = this.getFixedValidatorFns();
        /**
         * Basic validators that should ALWAYS apply to the provided primitiveType
         */
        const primitiveTypeValidators = this.getPrimitiveTypeValidators();
        /**
         * Validators that gets set by a custom form component (e.g. p-input).
         * They usually test the frontend value. Like locale specific separator for the entered number.
        */
        const componentValidators = [this.getComponentValidator()];
        // Its important to have the strictest validators at the bottom of the validators array.
        // Reason:
        // 					For [ min(10), min(2) ] and value === 1 you get error { min: 2 … }
        // 					For [ min(10), min(2) ] and value === 2 you get error { min: 10 … }
        // 					For [ min(2), min(10) ] you will get { min: 10 … } in both above cases
        // eslint-disable-next-line sonarjs/prefer-immediate-return
        const sortedValidators = [
            // @ts-expect-error -- TODO: PLANO-151676 Nils… Fix Storybook; then fix error; then test if validators still working.
            ...primitiveTypeValidators,
            ...fixedValidatorFns,
            ...attributeInfoValidators,
            ...componentValidators,
        ];
        return sortedValidators;
    }
    /**
     * Stores the current related ValidatorObjects.
     */
    // eslint-disable-next-line complexity
    updateValidatorObjects() {
        this.validatorObjects = {};
        for (const attributeInfoValidatorObject of this.attributeInfoValidatorObjects) {
            if (!(attributeInfoValidatorObject instanceof PValidatorObject))
                continue;
            switch (attributeInfoValidatorObject.name) {
                case null:
                    // eslint-disable-next-line no-console
                    console.log('Case null is unexpected for attributeInfoValidatorObject.name here.');
                    break;
                case PPossibleErrorNames.MIN:
                case PPossibleErrorNames.MIN_LENGTH:
                case PPossibleErrorNames.GREATER_THAN:
                    // Only the highest min should be stored at the end.
                    const currentStoredValueMin = this.validatorObjects[attributeInfoValidatorObject.name];
                    if (currentStoredValueMin !== undefined &&
                        currentStoredValueMin.comparedConst > attributeInfoValidatorObject.comparedConst)
                        continue;
                    this.validatorObjects[attributeInfoValidatorObject.name] = attributeInfoValidatorObject;
                    break;
                case PPossibleErrorNames.MAX:
                case PPossibleErrorNames.MAX_LENGTH:
                case PPossibleErrorNames.LESS_THAN:
                case PPossibleErrorNames.MAX_DECIMAL_PLACES_COUNT:
                    // Only the lowest max should be stored at the end.
                    const currentStoredValueMax = this.validatorObjects[attributeInfoValidatorObject.name];
                    if (currentStoredValueMax !== undefined &&
                        currentStoredValueMax.comparedConst < attributeInfoValidatorObject.comparedConst)
                        continue;
                    this.validatorObjects[attributeInfoValidatorObject.name] = attributeInfoValidatorObject;
                    break;
                case PPossibleErrorNames.BIC:
                case PPossibleErrorNames.CURRENCY:
                case PPossibleErrorNames.EMAIL:
                case PPossibleErrorNames.EMAIL_INVALID:
                case PPossibleErrorNames.EMAIL_USED:
                case PPossibleErrorNames.EMAIL_WITHOUT_AT:
                case PPossibleErrorNames.ENSURE_NULL:
                case PPossibleErrorNames.FIRST_FEE_PERIOD_START_IS_NULL:
                case PPossibleErrorNames.FLOAT:
                case PPossibleErrorNames.IBAN:
                case PPossibleErrorNames.ID_DEFINED:
                case PPossibleErrorNames.IMAGE_MAX_FILE_SIZE:
                case PPossibleErrorNames.IMAGE_MAX_HEIGHT:
                case PPossibleErrorNames.IMAGE_MAX_WIDTH:
                case PPossibleErrorNames.IMAGE_MIN_HEIGHT:
                case PPossibleErrorNames.IMAGE_MIN_WIDTH:
                case PPossibleErrorNames.IMAGE_RATIO:
                case PPossibleErrorNames.INTEGER:
                case PPossibleErrorNames.LETTERS_REQUIRED:
                case PPossibleErrorNames.NOT_UNDEFINED:
                case PPossibleErrorNames.NUMBERS_REQUIRED:
                case PPossibleErrorNames.NUMBER_NAN:
                case PPossibleErrorNames.OCCUPIED:
                case PPossibleErrorNames.PASSWORD:
                case PPossibleErrorNames.PASSWORD_UNCONFIRMED:
                case PPossibleErrorNames.PATTERN:
                case PPossibleErrorNames.PHONE:
                case PPossibleErrorNames.PLZ:
                case PPossibleErrorNames.REQUIRED:
                case PPossibleErrorNames.TIME:
                case PPossibleErrorNames.UPPERCASE:
                case PPossibleErrorNames.UPPERCASE_REQUIRED:
                case PPossibleErrorNames.URL:
                case PPossibleErrorNames.URL_INCOMPLETE:
                case PPossibleErrorNames.URL_PROTOCOL_MISSING:
                case PPossibleErrorNames.WHITESPACE:
                case PPossibleErrorNames.DOMAIN:
                    this.validatorObjects[attributeInfoValidatorObject.name] = attributeInfoValidatorObject;
            }
        }
        assumeDefinedToGetStrictNullChecksRunning(this.fixedValidatorFns, 'this.fixedValidatorFns');
        for (const validator of this.fixedValidatorFns) {
            if (!(validator instanceof PValidatorObject))
                continue;
            assumeDefinedToGetStrictNullChecksRunning(validator.name, 'validator.name');
            this.validatorObjects[validator.name] = validator;
        }
    }
    // NOTE: This would more or less be the same as .validatorObjects
    // /**
    //  * Api provides information about the limits in its ValidatorObjects.
    //  * This is a method to extract the limits.
    //  */
    // public get limits() : {
    // 	[PPossibleErrorNames.MIN] ?: number,
    // 	[PPossibleErrorNames.MAX] ?: number,
    // }[] {
    // 	const result : PFormControl['limits'] = [];
    // 	for (const validator of this.validatorObjects) {
    // 		// validator kann folgendes sein:
    // 		//      - ein objekt
    // 		if (validator instanceof PValidatorObject) {
    // 			limits[validator.name] = validator.comparedConst;
    // 		}
    // 		//      - eine funktion die ein objekt zurück gibt
    // 		const returnOfValidator = validator({value : this.value});
    // 		if (returnOfValidator instanceof PValidatorObject) {
    // 			result[returnOfValidator.name] = returnOfValidator.comparedConst;
    // 		}
    // 	}
    // 	return result;
    // }
    /**
     * Refresh the set of Validators that should be applied to this FormControl.
     *
     * Background: 	Sometimes the array of validators that should be applied to a attribute change inside AttributeInfo.
     * 							Since we can not subscribe changes on the set of AttributeInfo.validators, we need to call this method
     * 							every time a potential change could happen.
     */
    updateValidators() {
        this.updateValidatorObjects();
        // Turn them into a format Angular understands.
        const allValidators = this.allValidators();
        const angularCompatibleValidatorArray = turnIntoAngularCompatibleValidatorArray(allValidators);
        // Set them to the formControl
        // this.updateValueAndValidity();
        // this.parent?.updateValueAndValidity();
        this.setValidators(angularCompatibleValidatorArray);
    }
}
//# sourceMappingURL=p-form-control.js.map