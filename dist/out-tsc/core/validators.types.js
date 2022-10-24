/**
 * These are all the possible error keys that we have in our app.
 * The values of the enum MUST BE LOWERCASE!
 */
/* cSpell:disable */
export var PPossibleErrorNames;
(function (PPossibleErrorNames) {
    PPossibleErrorNames["CURRENCY"] = "currency";
    PPossibleErrorNames["REQUIRED"] = "required";
    PPossibleErrorNames["NOT_UNDEFINED"] = "notundefined";
    PPossibleErrorNames["MIN_LENGTH"] = "minlength";
    PPossibleErrorNames["MAX_LENGTH"] = "maxlength";
    PPossibleErrorNames["MAX_DECIMAL_PLACES_COUNT"] = "maxdecimalplacescount";
    PPossibleErrorNames["IMAGE_MAX_FILE_SIZE"] = "imagemaxfilesize";
    PPossibleErrorNames["IMAGE_RATIO"] = "imageratio";
    PPossibleErrorNames["IMAGE_MIN_WIDTH"] = "imageminwidth";
    PPossibleErrorNames["IMAGE_MIN_HEIGHT"] = "imageminheight";
    PPossibleErrorNames["IMAGE_MAX_WIDTH"] = "imagemaxwidth";
    PPossibleErrorNames["IMAGE_MAX_HEIGHT"] = "imagemaxheight";
    PPossibleErrorNames["MAX"] = "max";
    PPossibleErrorNames["MIN"] = "min";
    PPossibleErrorNames["GREATER_THAN"] = "greaterthan";
    PPossibleErrorNames["LESS_THAN"] = "lessthan";
    PPossibleErrorNames["UPPERCASE"] = "uppercase";
    PPossibleErrorNames["UPPERCASE_REQUIRED"] = "uppercaserequired";
    PPossibleErrorNames["FLOAT"] = "float";
    PPossibleErrorNames["TIME"] = "time";
    PPossibleErrorNames["INTEGER"] = "integer";
    PPossibleErrorNames["NUMBER_NAN"] = "numbernan";
    PPossibleErrorNames["PHONE"] = "phone";
    PPossibleErrorNames["PASSWORD"] = "password";
    PPossibleErrorNames["PASSWORD_UNCONFIRMED"] = "passwordunconfirmed";
    PPossibleErrorNames["WHITESPACE"] = "whitespace";
    PPossibleErrorNames["PLZ"] = "plz";
    PPossibleErrorNames["EMAIL"] = "email";
    PPossibleErrorNames["URL"] = "url";
    PPossibleErrorNames["DOMAIN"] = "domain";
    PPossibleErrorNames["URL_INCOMPLETE"] = "urlincomplete";
    PPossibleErrorNames["URL_PROTOCOL_MISSING"] = "urlprotocolmissing";
    PPossibleErrorNames["IBAN"] = "iban";
    PPossibleErrorNames["BIC"] = "bic";
    PPossibleErrorNames["EMAIL_WITHOUT_AT"] = "emailwithoutat";
    PPossibleErrorNames["ID_DEFINED"] = "iddefined";
    PPossibleErrorNames["EMAIL_USED"] = "emailused";
    PPossibleErrorNames["EMAIL_INVALID"] = "emailinvalid";
    PPossibleErrorNames["NUMBERS_REQUIRED"] = "numbersrequired";
    PPossibleErrorNames["LETTERS_REQUIRED"] = "lettersrequired";
    PPossibleErrorNames["PATTERN"] = "pattern";
    PPossibleErrorNames["FIRST_FEE_PERIOD_START_IS_NULL"] = "firstfeeperiodstartisnull";
    PPossibleErrorNames["ENSURE_NULL"] = "ensurenull";
    /**
     * »Is already in use«.
     * E.g. for shifModel prefix.
     * For used email address error, see EMAIL_USED.
     */
    PPossibleErrorNames["OCCUPIED"] = "occupied";
})(PPossibleErrorNames || (PPossibleErrorNames = {}));
export class PValidatorObject {
    constructor(input) {
        var _a;
        this.name = null;
        this.name = input.name;
        this.fn = input.fn;
        this.comparedConst = (_a = input.comparedConst) !== null && _a !== void 0 ? _a : null;
        this.comparedAttributeName = input.comparedAttributeName;
    }
}
//# sourceMappingURL=validators.types.js.map