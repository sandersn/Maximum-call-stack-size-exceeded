import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { NgbFormatsService } from '@plano/client/service/ngbformats.service';
import { PMomentService } from '../../p-moment.service';
let PInputDateService = class PInputDateService {
    constructor(ngbFormatsService) {
        this.ngbFormatsService = ngbFormatsService;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    convertNgbDateAndNgbTimeToTimestamp(locale, date, time, showTimeInput = null) {
        if (!date)
            return 0;
        if (date === '-')
            return 0;
        let result = null;
        result = this.ngbFormatsService.dateTimeObjectToTimestamp(date, locale);
        result = +(new PMomentService(locale).m(result).startOf('day'));
        if (!showTimeInput)
            return result;
        // NOTE: ['time'].value can be -1 if input is of type 'time'
        if (time !== -1) {
            const ngbDateTime = date;
            ngbDateTime.second = +(new PMomentService(locale)).duration(time).get('seconds');
            ngbDateTime.minute = +(new PMomentService(locale)).duration(time).get('minutes');
            ngbDateTime.hour = +(new PMomentService(locale)).duration(time).get('hours');
            return this.ngbFormatsService.dateTimeObjectToTimestamp(ngbDateTime, locale);
        }
        return result;
    }
};
PInputDateService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [NgbFormatsService])
], PInputDateService);
export { PInputDateService };
//# sourceMappingURL=p-input-date.service.js.map