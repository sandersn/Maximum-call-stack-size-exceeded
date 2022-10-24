import { __decorate } from "tslib";
import { Pipe } from '@angular/core';
let LimitToPipe = class LimitToPipe {
    // eslint-disable-next-line jsdoc/require-jsdoc
    transform(value, args) {
        if (value === null) {
            return '';
        }
        // let limit = args.length > 0 ? parseInt(args[0], 10) : 10;
        // let trail = args.length > 1 ? args[1] : '…';
        const limit = args ? Number.parseInt(args, 10) : 10;
        return value.length > limit ? value.substring(0, limit) : value;
    }
};
LimitToPipe = __decorate([
    Pipe({ name: 'pLimitTo' })
], LimitToPipe);
export { LimitToPipe };
//# sourceMappingURL=limit-to.pipe.js.map