
type OptionalIntoNull<T> = T extends undefined ? Exclude<T, undefined> | null : T;

/**
 * Turn all optional params into `| null` instead of `| undefined`
 */
export type OptionalParamsIntoNull<T> = {
	[P in keyof T] : OptionalIntoNull<T[P]>;
};

/**
 * @deprecated
 * Assume a variable to be defined.
 * We added this to a lot of lines in our app via the TABULA RASA strategy 😎
 * To understand why, you have to know that we had strictNullChecks turned off in the beginning of Dr. Plano.
 * We had a lot of locations where we assumed something to exists, which would cause errors
 * with strictNullChecks turned on. We could not fix each of these cases, so we invented this function
 * to 'hack' it. We then could turn strictNullChecks on and now we have to get rid of the use of this method
 * step by step.
 *
 * If you have a case where you are sure, that your assumption is legit, use the function assumeNotUndefined or assumeNotNull instead.
 */
/*
 * TODO: [PLANO-151410]
 * 		When was the last time this has crashed?
 * 		Check: https://sentry.io/organizations/dr-plano/issues/?groupStatsPeriod=auto&project=5187494&query=Pre-StrictNullCheck-Code&sort=freq&statsPeriod=90d
 *    We did the big null check refactoring (https://drplano.atlassian.net/browse/PLANO-18170) one year ago.
 *    If there was no error in the last 90 days, we can remove this method.
 */
export const assumeDefinedToGetStrictNullChecksRunning : <T>(
	value : T | null | undefined,
	varOrExpression ?: string,
	reason ?: string
) => asserts value is NonUndefined<NonNullAndNonUndefined<T>> =
(value, varOrExpression, reason) => {
	if (value !== null && value !== undefined) return;
	let reasonString = reason ? `Reason: »${reason}«` : '';
	if (!reasonString) reasonString = value === null ? 'value is null.' : 'value is undefined.';
	const expressionString = varOrExpression ?? 'value';
	throw new TypeError(`Pre-StrictNullCheck-Code: ${expressionString} must be defined here. ${reasonString}`);
};

type IsNullable<T> = null extends T ? T : never;
// cSpell:ignore Undefinedable
type IsUndefinedable<T> = undefined extends T ? T : never;
type StrictNonNullable<T> = T extends null ? never : T;
type StrictNonUndefinable<T> = T extends undefined ? never : T;
// eslint-disable-next-line @typescript-eslint/ban-types
export type NonNullAndNonUndefined<T> = NonNullable<T>;

/**
 * Throws if the value is nullish.
 * Manipulates the type during compile time (control flow analysis).
 */
export const assumeNonNull : <T>(
	value : NonUndefined<IsNullable<T>>,
	varOrExpression ?: string,
	reason ?: string
) => asserts value is StrictNonNullable<NonUndefined<IsNullable<T>>> = (value, varOrExpression, reason) => {
	// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
	if (value !== null) {
		// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
		if (value === undefined) throw new TypeError(`assumeNonNull() should never be applied to a \`undefined\` value. Use assumeNotUndefined() instead.`);
		return;
	}
	const reasonString = reason ? `Reason: »${reason}«` : '';
	const expressionString = varOrExpression ?? 'value';
	throw new TypeError(`${expressionString} should not be null here. ${reasonString}`);
};

type NonUndefined<T> = T extends undefined ? never : T;

/**
 * Throws if the value is undefined. Null is ok.
 * Manipulates the type during compile time (control flow analysis).
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const assumeNotUndefined : <T extends NonNullAndNonUndefined<{}> | undefined>(
	value : StrictNonNullable<IsUndefinedable<T>>,
	varOrExpression ?: string,
	reason ?: string
) => asserts value is StrictNonNullable<NonNullAndNonUndefined<IsUndefinedable<T>>> = (value, varOrExpression, reason) => {
	const expressionString = varOrExpression ?? 'value';
	if (value !== undefined) {
		// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition, no-console
		if (value === null) console.error(`Seems like »${expressionString}« is already null-ready. assumeNotUndefined() can probably be removed.`);
		return value;
	}
	const reasonString = reason ? `Reason: »${reason}«` : '';
	throw new TypeError(`${expressionString} should not be undefined here. ${reasonString}`);
};

/**
 * Throws if the value is undefined. Null is ok.
 * In contrast to `assumeNotUndefined`, this method does not manipulate the type during compile time (control flow analysis).
 * Instead it returns the value without the `undefined` type.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const notUndefined = function<T extends NonNullAndNonUndefined<{}> | undefined>(
	value : StrictNonNullable<IsUndefinedable<T>>,
	varOrExpression ?: string,
	reason ?: string,
) : NonNullAndNonUndefined<T> {
	if (value === undefined) {
		const expressionString = varOrExpression ?? 'value';
		const reasonString = reason ? `Reason: »${reason}«` : '';
		throw new TypeError(`${expressionString} should not be undefined here. ${reasonString}`);
	}

	// Typescript seems to get confused because of the generic types and thinks value could be undefined. So we use "!".
	return value!;
};

/**
 * Throws if the value is `null`. `undefined` is ok.
 * In contrast to `assumeNotNull`, this method does not manipulate the type during compile time (control flow analysis).
 * Instead it returns the value without the `null` type.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export const notNull = function<T extends NonNullAndNonUndefined<{}> | null>(
	value : StrictNonUndefinable<IsNullable<T>>,
	varOrExpression ?: string,
	reason ?: string,
) : NonNullAndNonUndefined<T> {
	if (value === null) {
		const expressionString = varOrExpression ?? 'value';
		const reasonString = reason ? `Reason: »${reason}«` : '';
		throw new TypeError(`${expressionString} should not be null here. ${reasonString}`);
	}

	// Typescript seems to get confused because of the generic types and thinks value could be null. So we use "!".
	return value!;
};

/**
 * Throws if the condition is not true.
 * Manipulates the type during compile time (control flow analysis).
 */
export const assume : <T>(
	condition : T | true,
	varOrExpression ?: string,
	reason ?: string
) => asserts condition = (value, varOrExpression, reason) => {
	if (value === true) return;
	const reasonString = reason ? `Reason: »${reason}«` : '';
	const expressionString = varOrExpression ?? 'value';
	throw new TypeError(`${expressionString} must be true here. ${reasonString}`);
};

type NonEmptyArray<T> = [T, ...T[]];

/**
 * Throws if the value is an empty array.
 * Manipulates the type during compile time (control flow analysis).
 */
export const assumeNotEmpty : <T>(
	value : T[],
	varOrExpression ?: string,
	reason ?: string
) => asserts value is NonEmptyArray<T> = (value, varOrExpression, reason) => {
	if (value.length === 0) return;
	const reasonString = reason ? `Reason: »${reason}«` : '';
	const expressionString = varOrExpression ?? 'value';
	throw new TypeError(`${expressionString} must be true here. ${reasonString}`);
};

