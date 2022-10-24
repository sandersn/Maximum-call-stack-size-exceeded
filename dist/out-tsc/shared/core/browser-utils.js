import { UAParser } from 'ua-parser-js';
/**
 * We block access for some browsers. Usually because they are too old.
 * We don’t block all browser versions that angular does not have in there support list. We only block
 * those that cause too much trouble for our support colleagues.
 */
export const BROWSER_LIMITS = [
    {
        name: 'safari',
        lessThanOrEqual: 11,
    },
    {
        name: 'ie',
        lessThanOrEqual: null,
    },
    {
        name: 'edge',
        lessThanOrEqual: 83,
    },
    {
        name: 'chrome',
        lessThanOrEqual: 48,
    },
];
export const getBrowserInfoByUserAgent = (userAgent) => {
    const parser = new UAParser();
    parser.setUA(userAgent);
    const version = parser.getBrowser().version;
    const name = parser.getBrowser().name;
    const lowercaseName = name === null || name === void 0 ? void 0 : name.toLocaleLowerCase();
    return {
        nameUppercase: name !== null && name !== void 0 ? name : null,
        name: lowercaseName !== null && lowercaseName !== void 0 ? lowercaseName : null,
        version: version ? +version.split('.')[0] : null,
    };
};
//# sourceMappingURL=browser-utils.js.map