var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { NgxPopperjsPlacements } from 'ngx-popperjs';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { FilterService } from '@plano/client/shared/filter.service';
import { SchedulingApiHolidays } from '@plano/shared/api';
import { SchedulingApiAbsences } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { SchedulingApiBirthdays } from '../../../api/scheduling-api-birthday.service';
import { CalenderAllDayItemLayoutService } from '../../calender-all-day-item-layout.service';
let PAllDayItemsListComponent = class PAllDayItemsListComponent {
    constructor(layoutService, filterService) {
        this.layoutService = layoutService;
        this.filterService = filterService;
        this.config = Config;
        this.holidays = new SchedulingApiHolidays(null, false);
        this.absences = new SchedulingApiAbsences(null, false);
        this.birthdays = new SchedulingApiBirthdays(null, null, false);
        this.popperPlacement = NgxPopperjsPlacements.BOTTOM;
        /**
         * Height of one line
         * @return height in px
         */
        this.heightOfLine = 24;
        this.readMode = false;
    }
    /**
     * Height of this list in px
     * @return height in px
     */
    get height() {
        return (this.layoutService.getMaxPosIndex(this.startOfDay) + 1) * this.heightOfLine;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    distanceAboveItem(item) {
        return this.layoutService.getLayout(this.startOfDay, item).posIndex * this.heightOfLine;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    showItem(item) {
        return this.layoutService.getLayout(this.startOfDay, item).show;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showList() {
        if (this.filterService.schedulingFilterService.hideAllAbsences &&
            this.filterService.schedulingFilterService.hideAllHolidays &&
            this.filterService.schedulingFilterService.hideAllBirthdays)
            return false;
        if (!this.absences.length && !this.holidays.length && !this.birthdays.length)
            return false;
        return true;
    }
};
__decorate([
    Input(),
    __metadata("design:type", typeof (_b = typeof SchedulingApiHolidays !== "undefined" && SchedulingApiHolidays) === "function" ? _b : Object)
], PAllDayItemsListComponent.prototype, "holidays", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_c = typeof SchedulingApiAbsences !== "undefined" && SchedulingApiAbsences) === "function" ? _c : Object)
], PAllDayItemsListComponent.prototype, "absences", void 0);
__decorate([
    Input(),
    __metadata("design:type", SchedulingApiBirthdays)
], PAllDayItemsListComponent.prototype, "birthdays", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_d = typeof NgxPopperjsPlacements !== "undefined" && NgxPopperjsPlacements) === "function" ? _d : Object)
], PAllDayItemsListComponent.prototype, "popperPlacement", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], PAllDayItemsListComponent.prototype, "heightOfLine", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], PAllDayItemsListComponent.prototype, "startOfDay", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PAllDayItemsListComponent.prototype, "readMode", void 0);
PAllDayItemsListComponent = __decorate([
    Component({
        selector: 'p-all-day-items-list[startOfDay]',
        templateUrl: './p-all-day-items-list.component.html',
        styleUrls: ['./p-all-day-items-list.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [CalenderAllDayItemLayoutService, typeof (_a = typeof FilterService !== "undefined" && FilterService) === "function" ? _a : Object])
], PAllDayItemsListComponent);
export { PAllDayItemsListComponent };
//# sourceMappingURL=p-all-day-items-list.component.js.map