import { AbstractControl, ValidationErrors } from '@angular/forms';
import { PDictionarySourceString } from './pipe/localize.dictionary';
import { ValidatorsService } from './validators.service';
import { PApiPrimitiveTypes } from '../api/base/generated-types.ag';

/**
 * These are all the possible error keys that we have in our app.
 * The values of the enum MUST BE LOWERCASE!
 */
/* cSpell:disable */
export enum PPossibleErrorNames {
	CURRENCY = 'currency',
	REQUIRED = 'required',
	NOT_UNDEFINED = 'notundefined',
	MIN_LENGTH = 'minlength',
	MAX_LENGTH = 'maxlength',
	MAX_DECIMAL_PLACES_COUNT = 'maxdecimalplacescount',

	IMAGE_MAX_FILE_SIZE = 'imagemaxfilesize',
	IMAGE_RATIO = 'imageratio',
	IMAGE_MIN_WIDTH = 'imageminwidth',
	IMAGE_MIN_HEIGHT = 'imageminheight',
	IMAGE_MAX_WIDTH = 'imagemaxwidth',
	IMAGE_MAX_HEIGHT = 'imagemaxheight',

	MAX = 'max',
	MIN = 'min',
	GREATER_THAN = 'greaterthan',
	LESS_THAN = 'lessthan',
	UPPERCASE = 'uppercase',
	UPPERCASE_REQUIRED = 'uppercaserequired',
	FLOAT = 'float',
	TIME = 'time',
	INTEGER = 'integer',
	NUMBER_NAN = 'numbernan',
	PHONE = 'phone',
	PASSWORD = 'password',
	PASSWORD_UNCONFIRMED = 'passwordunconfirmed',
	WHITESPACE = 'whitespace',
	PLZ = 'plz',
	EMAIL = 'email',
	URL = 'url',
	DOMAIN = 'domain',
	URL_INCOMPLETE = 'urlincomplete',
	URL_PROTOCOL_MISSING = 'urlprotocolmissing',
	IBAN = 'iban',
	BIC = 'bic',
	EMAIL_WITHOUT_AT = 'emailwithoutat',
	ID_DEFINED = 'iddefined',
	EMAIL_USED = 'emailused',
	EMAIL_INVALID = 'emailinvalid',
	NUMBERS_REQUIRED = 'numbersrequired',
	LETTERS_REQUIRED = 'lettersrequired',
	PATTERN = 'pattern',
	FIRST_FEE_PERIOD_START_IS_NULL = 'firstfeeperiodstartisnull',
	ENSURE_NULL = 'ensurenull',

	/**
	 * »Is already in use«.
	 * E.g. for shifModel prefix.
	 * For used email address error, see EMAIL_USED.
	 */
	OCCUPIED = 'occupied',
}

/* cSpell:enable */


export interface PValidationErrorValue extends ValidationErrors {
	name : PPossibleErrorNames,
	// TODO: get rid of null and undefined here
	primitiveType : PApiPrimitiveTypes | null | undefined,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	actual ?: any,
	comparedAttributeName ?: string | undefined,
	errorText ?: PDictionarySourceString | (() => PDictionarySourceString) | undefined,
}

export interface PValidationErrors<T extends PValidationErrorValue = PValidationErrorValue> extends ValidationErrors {
	[key : string] : T;
}

export declare type PValidatorFn<T extends PValidationErrors | null = PValidationErrors | null> = (control : Pick<AbstractControl, 'value'>) => T | null;

type ComparedConstValueType = string | number | boolean | null;

export class PValidatorObject<FnPropertyReturnType = PValidatorFn, ComparedConstType = ComparedConstValueType | (() => ComparedConstValueType)> {
	constructor(input : {

		/** Error-Name */
		name : PValidatorObject['name'],
		fn : FnPropertyReturnType,
		comparedConst ?: ComparedConstType,
		comparedAttributeName ?: string | undefined,
	}) {
		this.name = input.name;
		this.fn = input.fn;
		this.comparedConst = input.comparedConst ?? null;
		this.comparedAttributeName = input.comparedAttributeName;
	}

	public name : PPossibleErrorNames | null = null;
	public fn : FnPropertyReturnType;
	public comparedConst ?: ComparedConstType | null;
	public comparedAttributeName ?: string | undefined;
}

type ValidatorNames = Exclude<keyof ValidatorsService, 'nullValidator'>;

type ValidatorsServiceFnReturnTypes<FnName extends ValidatorNames = ValidatorNames> = (
	ReturnType<ValidatorsService[FnName]>['fn']
);

type ValidatorsWithNonDeprecatedReturnType<FnName extends ValidatorNames = ValidatorNames> = Exclude<
	ValidatorsServiceFnReturnTypes<FnName>,
	null | PValidationErrors
>;

export type ValidatorsServiceErrorsType<FnName extends ValidatorNames = ValidatorNames> =
	Exclude<
		ReturnType<ValidatorsWithNonDeprecatedReturnType<FnName>>,
		null
	>;

// TODO: ValidatorsServiceReturnType only works for PValidatorFn, not for PValidatorObject.
export type ValidatorsServiceReturnType<FnName extends ValidatorNames = ValidatorNames> =
	ValidatorsServiceErrorsType<FnName>[PPossibleErrorNames];
