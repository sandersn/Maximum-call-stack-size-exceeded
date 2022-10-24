import { __decorate, __metadata, __param } from "tslib";
import { Pipe, Inject, LOCALE_ID } from '@angular/core';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { PDatePipe, AngularDatePipeFormat } from '@plano/shared/core/pipe/p-date.pipe';
import { PSupportedTimeZoneOffset } from '@plano/shared/core/time-zones.enums';
let PDurationPipe = class PDurationPipe {
    constructor(locale, datePipe) {
        this.locale = locale;
        this.datePipe = datePipe;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    transform(duration, format) {
        if (!format)
            format = AngularDatePipeFormat.SHORT_TIME;
        return this.datePipe.transform(duration, format, PSupportedTimeZoneOffset.NO_ZONE, this.locale);
    }
};
PDurationPipe = __decorate([
    Pipe({ name: 'pDuration' }),
    __param(0, Inject(LOCALE_ID)),
    __metadata("design:paramtypes", [String, PDatePipe])
], PDurationPipe);
export { PDurationPipe };
//# sourceMappingURL=p-duration.pipe.js.map