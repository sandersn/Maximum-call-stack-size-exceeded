// NOTE: 	All imports are restricted. This file gets imported into our cucumber files.
// 				Having imports here, broke cucumber. https://drplano.atlassian.net/browse/PLANO-143376?focusedCommentId=26375
/* eslint @typescript-eslint/no-restricted-imports: ["error",{"patterns": ["*"]}] */

/**
 * Typescripts Extract<T, U> does not check if T is present inside U.
 * ExtractFromUnion checks that and is therefore more type-save.
 */
export type ExtractFromUnion<T extends U, U> = U extends T ? T : never;

export type AngularWrappedError = { ngOriginalError : Error } & Error;

export type KebabCaseToCamelCase<S extends string> =
	S extends `${infer T}-${infer U}` ?
	`${T}${Capitalize<KebabCaseToCamelCase<U>>}` :
	S;

export type CamelCaseToKebabCase<S extends string> =
	S extends `${infer T}${infer U}` ?
	`${T extends Capitalize<T> ? '-' : ''}${Lowercase<T>}${CamelCaseToKebabCase<U>}` :
	S;

export const assumeIsTypeDashCase : <T extends string>(
	value : T | string,
	varOrExpression ?: string,
	reason ?: string
) => asserts value is CamelCaseToKebabCase<T> = (value, varOrExpression, reason) => {
	if (
		value === value.toLocaleLowerCase() &&
		!value.includes('_')
	) return;
	const reasonString = reason ? `Reason: »${reason}«` : '';
	const expressionString = varOrExpression ?? 'value';
	throw new TypeError(`${expressionString} should be dash-case. ${reasonString}`);
};
