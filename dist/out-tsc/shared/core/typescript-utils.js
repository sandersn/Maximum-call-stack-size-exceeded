import { HttpErrorResponse } from '@angular/common/http';
export class EnumUtils {
    /**
     * Get all values of an Enum as an Array
     * @examples
     * 	enum Food { BANANA = 'banana', APPLE = 'apple' } => ['banana', 'apple']
     * 	enum Food { BANANA, APPLE } => [0, 1]
     * 	enum Food { BANANA = 100, APPLE = 200 } => ['banana', 'apple']
     */
    static getValues(theEnum) {
        const VALUES = Object.values(theEnum);
        const NUMBER_VALUES = VALUES.filter(value => typeof value === 'number');
        if (NUMBER_VALUES.length)
            return NUMBER_VALUES;
        return VALUES.filter(value => typeof value !== 'number');
    }
}
export const errorUtils = {
    isTypeError: (error) => {
        if (error instanceof Error)
            return true;
        if (error['name'] !== undefined && error['message'] !== undefined)
            return true;
        return false;
    },
    isTypeErrorEvent: (error) => {
        if (error instanceof ErrorEvent)
            return true;
        if (error['colno'] !== undefined &&
            error['error'] !== undefined &&
            error['filename'] !== undefined &&
            error['lineno'] !== undefined &&
            error['message'] !== undefined)
            return true;
        return false;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
    isAngularWrappedError: (error) => {
        if (!error)
            return false;
        if (error.ngOriginalError === undefined)
            return false;
        return true;
    },
    isTypeHttpErrorResponse: (error) => {
        if (error instanceof HttpErrorResponse)
            return true;
        if (typeof error.name === 'string' && error.name.includes('HttpErrorResponse'))
            return true;
        return false;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    isTypeSomeObjectWithPromiseAndRejection: (input) => {
        if ((input === null || input === void 0 ? void 0 : input.promise) !== undefined && input.rejection !== undefined)
            return true;
        return false;
    },
};
export const camelCaseToKebabCase = (camelCaseInput) => {
    if (camelCaseInput === camelCaseInput.toLowerCase())
        return camelCaseInput;
    return camelCaseInput
        .split('')
        .map((letter, index) => {
        return letter.toUpperCase() === letter ?
            `${index !== 0 ? '-' : ''}${letter.toLowerCase()}` :
            letter;
    })
        .join('');
};
export const kebabCaseToCamelCase = (kebabCaseInput) => {
    return kebabCaseInput
        .split(/(?=(?<![A-Z])[A-Z]|(?<!\d)\d)|[_-]/)
        .map(([first, ...rest], index) => (index === 0 ?
        first.toLowerCase() :
        first.toUpperCase()) + rest.join('').toLowerCase())
        .join('');
};
//# sourceMappingURL=typescript-utils.js.map