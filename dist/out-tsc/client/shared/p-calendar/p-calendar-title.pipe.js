import { __decorate, __metadata } from "tslib";
import { Pipe } from '@angular/core';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
let PCalendarTitlePipe = class PCalendarTitlePipe {
    constructor(pDatePipe, localize) {
        this.pDatePipe = pDatePipe;
        this.localize = localize;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    transform(selectedDate, calendarMode, 
    /**
     * Short text – usually used for mobile
     */
    shortMode) {
        if (!selectedDate || !calendarMode)
            return '█:█:██';
        switch (calendarMode) {
            case CalendarModes.DAY:
                if (shortMode)
                    return `${this.pDatePipe.transform(selectedDate, 'veryShortDate')} · ${this.pDatePipe.transform(selectedDate, 'EEEE').slice(0, 2)}`;
                return `${this.pDatePipe.transform(selectedDate, 'longDate')} · ${this.pDatePipe.transform(selectedDate, 'EEEE')}`;
            case CalendarModes.WEEK:
                return `${this.localize.transform('KW')} ${this.pDatePipe.transform(selectedDate, 'ww')}`;
            case CalendarModes.MONTH:
                if (shortMode)
                    return this.pDatePipe.transform(selectedDate, 'MMM yyyy');
                return this.pDatePipe.transform(selectedDate, 'MMMM yyyy');
            default:
                const RESULT = calendarMode;
                throw new Error(RESULT);
        }
    }
};
PCalendarTitlePipe = __decorate([
    Pipe({ name: 'calendarTitle' }),
    __metadata("design:paramtypes", [PDatePipe,
        LocalizePipe])
], PCalendarTitlePipe);
export { PCalendarTitlePipe };
//# sourceMappingURL=p-calendar-title.pipe.js.map