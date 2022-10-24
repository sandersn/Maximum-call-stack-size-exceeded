// NOTE: 	All imports are restricted. This file gets imported into our cucumber files.
// 				Having imports here, broke cucumber. https://drplano.atlassian.net/browse/PLANO-143376?focusedCommentId=26375
/* eslint @typescript-eslint/no-restricted-imports: ["error",{"patterns": ["*"]}] */
export const assumeIsTypeDashCase = (value, varOrExpression, reason) => {
    if (value === value.toLocaleLowerCase() &&
        !value.includes('_'))
        return;
    const reasonString = reason ? `Reason: »${reason}«` : '';
    const expressionString = varOrExpression !== null && varOrExpression !== void 0 ? varOrExpression : 'value';
    throw new TypeError(`${expressionString} should be dash-case. ${reasonString}`);
};
//# sourceMappingURL=typescript-utils-types.js.map