import { HttpErrorResponse } from '@angular/common/http';
import { AngularWrappedError, CamelCaseToKebabCase, KebabCaseToCamelCase } from './typescript-utils-types';

export class EnumUtils {

	/**
	 * Get all values of an Enum as an Array
	 * @examples
	 * 	enum Food { BANANA = 'banana', APPLE = 'apple' } => ['banana', 'apple']
	 * 	enum Food { BANANA, APPLE } => [0, 1]
	 * 	enum Food { BANANA = 100, APPLE = 200 } => ['banana', 'apple']
	 */
	public static getValues<T = unknown>(theEnum : { [s : string] : T }) : T[] {
		const VALUES = (Object.values(theEnum) as unknown as T[]);
		const NUMBER_VALUES = VALUES.filter(value => typeof value === 'number');
		if (NUMBER_VALUES.length) return NUMBER_VALUES;
		return VALUES.filter(value => typeof value !== 'number');
	}
}

/** I found such a object in the real world out there. Dont know whats the real type. */
// NOTE: If you want to move this to typescript-utils-types.ts, make sure cucumber is still working. https://drplano.atlassian.net/browse/PLANO-143376?focusedCommentId=26375
export type SomeObjectWithPromiseAndRejection = { promise : unknown, rejection : HttpErrorResponse };

export const errorUtils = {
	isTypeError: (error : Error | Record<string, unknown>) : error is Error => {
		if (error instanceof Error) return true;
		if (error['name'] !== undefined && error['message'] !== undefined) return true;
		return false;
	},

	isTypeErrorEvent: (error : ErrorEvent | Record<string, unknown>) : error is ErrorEvent => {
		if (error instanceof ErrorEvent) return true;
		if (
			error['colno'] !== undefined &&
			error['error'] !== undefined &&
			error['filename'] !== undefined &&
			error['lineno'] !== undefined &&
			error['message'] !== undefined
		) return true;
		return false;
	},

	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
	isAngularWrappedError: (error : AngularWrappedError | any) : error is AngularWrappedError => {
		if (!error) return false;
		if (error.ngOriginalError === undefined) return false;
		return true;
	},

	isTypeHttpErrorResponse: (error : HttpErrorResponse | Error | Record<string, unknown>) : error is HttpErrorResponse => {
		if (error instanceof HttpErrorResponse) return true;
		if (typeof error.name === 'string' && error.name.includes('HttpErrorResponse')) return true;
		return false;
	},

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	isTypeSomeObjectWithPromiseAndRejection: (input : any) : input is SomeObjectWithPromiseAndRejection => {
		if (input?.promise !== undefined && input.rejection !== undefined) return true;
		return false;
	},
};

export const camelCaseToKebabCase : <CamelCaseType extends string>(input : CamelCaseType) => CamelCaseToKebabCase<CamelCaseType> =
	(camelCaseInput) => {
		if (camelCaseInput === camelCaseInput.toLowerCase()) return camelCaseInput as CamelCaseToKebabCase<typeof camelCaseInput>;
		return camelCaseInput
			.split('')
			.map((letter, index) => {
				return letter.toUpperCase() === letter ?
					`${index !== 0 ? '-' : ''}${letter.toLowerCase()}` :
					letter;
			})
			.join('') as CamelCaseToKebabCase<typeof camelCaseInput>;
	};

export const kebabCaseToCamelCase : <KebabCaseType extends string>(input : KebabCaseType) => KebabCaseToCamelCase<KebabCaseType> =
	(kebabCaseInput) => {
		return kebabCaseInput
			.split(/(?=(?<![A-Z])[A-Z]|(?<!\d)\d)|[_-]/)
			.map(
				([first, ...rest] : string, index) =>
					(index === 0 ?
						first.toLowerCase() :
						first.toUpperCase()) + rest.join('').toLowerCase(),
			)
			.join('') as KebabCaseToCamelCase<typeof kebabCaseInput>;
	};

export type NonZeroInteger<T extends number> =
	`${T}` extends `${0}` | `${number}.${number}`
			? never : T;

export type NegativeInteger<T extends number> =
`${T}` extends `${number}` | `${number}.${number}`
		? never : T;

export type PartialNull<T> = {
	[P in keyof T] : T[P] | null
};
export type RequiredNonNull<T> = {
	[P in keyof T] : T[P] extends null | infer R ? R : T[P]
};
