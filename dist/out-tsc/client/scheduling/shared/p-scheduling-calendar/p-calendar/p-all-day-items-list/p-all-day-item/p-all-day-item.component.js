var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
import { __decorate, __metadata } from "tslib";
import { NgxPopperjsContentComponent, NgxPopperjsPlacements, NgxPopperjsTriggers } from 'ngx-popperjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { Router } from '@angular/router';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiAbsence, SchedulingApiHoliday } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiHolidayType } from '@plano/shared/api';
import { Assertions } from '@plano/shared/core/assertions';
import { Config } from '@plano/shared/core/config';
import { Data } from '@plano/shared/core/data/data';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../../../shared/core/null-type-utils';
import { CalendarModes } from '../../../../../calendar-modes';
import { SchedulingApiBirthday } from '../../../../api/scheduling-api-birthday.service';
let PAllDayItemComponent = class PAllDayItemComponent {
    constructor(api, highlightService, schedulingService, router, rightsService, localize, pMoment, datePipe) {
        this.api = api;
        this.highlightService = highlightService;
        this.schedulingService = schedulingService;
        this.router = router;
        this.rightsService = rightsService;
        this.localize = localize;
        this.pMoment = pMoment;
        this.datePipe = datePipe;
        this.readMode = false;
        this.ngUnsubscribe = new Subject();
        this.subscription = null;
        this.NgxPopperjsTriggers = NgxPopperjsTriggers;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.Config = Config;
        this._isFirstItemOfItem = new Data(this.api);
        this._isLastItemOfItem = new Data(this.api);
        this._isStartOfBar = new Data(this.api);
        this._isEndOfBar = new Data(this.api);
        this._start = new Data(this.api);
        this._end = new Data(this.api);
        // update tooltip visibility
        this.subscription = this.highlightService.onChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            // Performance: Explicitly check if this day of this all-day-item is highlighted (by passing this.startOfDay)
            // or otherwise "this.popperContent.show()" will be called for each day of the item.
            const highlighted = this.highlightService.isHighlighted(this.item, this.startOfDay);
            assumeDefinedToGetStrictNullChecksRunning(this.popperContent, 'this.popperContent');
            const tooltipVisible = this.popperContent.displayType !== 'none';
            if (highlighted && !tooltipVisible) {
                this.popperContent.show();
                // window.setTimeout(() => {
                // 	this.changeDetectorRef.detectChanges();
                // }, 0);
            }
            else if (!highlighted && tooltipVisible) {
                this.popperContent.hide();
            }
        });
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isSwitzerland() {
        if (!this.api.isLoaded())
            return undefined;
        return this.api.isSwitzerland;
    }
    ngAfterContentInit() {
        assumeDefinedToGetStrictNullChecksRunning(this.startOfDay, 'startOfDay');
        assumeDefinedToGetStrictNullChecksRunning(this.item, 'item');
        Assertions.ensureIsDayStart(this.startOfDay);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isHoliday() {
        return this.item instanceof SchedulingApiHoliday;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isAbsence() {
        return this.item instanceof SchedulingApiAbsence;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isBirthday() {
        return this.item instanceof SchedulingApiBirthday;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get typeTitle() {
        if (!(this.item instanceof SchedulingApiHoliday))
            return undefined;
        switch (this.item.type) {
            case SchedulingApiHolidayType.SCHOOL_HOLIDAYS:
                return this.localize.transform('Schulferien');
            case SchedulingApiHolidayType.FESTIVE_DAY:
                return this.localize.transform('Ist ein Festtag und kein gesetzlicher Feiertag');
            case SchedulingApiHolidayType.NATIONAL_HOLIDAY:
                return this.localize.transform('Ist ein gesetzlicher Feiertag');
            default:
                return undefined;
        }
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get style() {
        if (this.item instanceof SchedulingApiHoliday)
            return PThemeEnum.LIGHT;
        if (this.item instanceof SchedulingApiAbsence)
            return PThemeEnum.DARK;
        return PThemeEnum.INFO;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get icon() {
        if (this.item instanceof SchedulingApiHoliday)
            return null;
        if (this.item instanceof SchedulingApiAbsence)
            return this.item.typeIconName;
        return PlanoFaIconPool.BIRTHDAY;
    }
    containsString(input) {
        if (this.item instanceof SchedulingApiAbsence)
            return undefined;
        if (this.item instanceof SchedulingApiHoliday) {
            if (this.item.name.includes(input))
                return true;
            return false;
        }
        return this.item.lastName.includes(input) || this.item.firstName.includes(input);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get federalState() {
        return (this.item instanceof SchedulingApiHoliday) ? this.item.federalState : null;
    }
    get titleEmoji() {
        if (this.item instanceof SchedulingApiAbsence)
            return undefined;
        if (this.item instanceof SchedulingApiHoliday) {
            // emoji version 6 is the highest version we support.
            switch (this.item.type) {
                case SchedulingApiHolidayType.FESTIVE_DAY:
                    return this.titleEmojiForFestiveDay;
                case SchedulingApiHolidayType.NATIONAL_HOLIDAY:
                    return this.titleEmojiForNationalHoliday;
                case SchedulingApiHolidayType.SCHOOL_HOLIDAYS:
                    return this.titleEmojiForSchoolHolidays;
                default:
                    return undefined;
            }
        }
        return undefined;
    }
    get titleEmojiForFestiveDay() {
        // TODO: Support other Languages
        if (this.containsString('Silvester'))
            return '🌟';
        if (this.containsString('Palmsonntag'))
            return '🌴';
        if (this.containsString('Vatertag'))
            return '👨';
        if (this.containsString('Valentinstag'))
            return '💚';
        if (this.containsString('Halloween'))
            return '🎃';
        if (this.containsString('Rosenmontag'))
            return '🌹';
        if (this.containsString('Fastnacht'))
            return '🎭';
        if (this.containsString('Advent'))
            return '🎄';
        if (this.containsString('Heiligabend'))
            return '🎄';
        if (this.containsString('Muttertag'))
            return '👩';
        if (this.containsString('Nikolaus'))
            return '🎅';
        if (this.containsString('Gründonnerstag'))
            return '🍵';
        return undefined;
    }
    get titleEmojiForNationalHoliday() {
        // if (this.containsString('Buß- und Bettag')) return '🙏';
        // if (this.containsString('Neujahr')) return '🎆';
        // if (this.containsString('Heilige Drei Könige')) return '👑👑👑';
        // if (this.containsString('Karfreitag')) return '✝';
        if (this.containsString('Ostermontag'))
            return '🐰';
        if (this.containsString('Tag der Arbeit'))
            return '💪';
        if (this.containsString('Christi Himmelfahrt'))
            return '✝ 🚀';
        // if (this.containsString('Pfingstmontag')) return '✝';
        // if (this.containsString('Fronleichnam')) return '✝';
        if (this.containsString('Augsburger Friedensfest'))
            return '☮️';
        // if (this.containsString('Mariä Himmelfahrt')) return '✝';
        // if (this.containsString('Tag der Deutschen Einheit')) return '🇩🇪';
        // if (this.containsString('Reformationstag')) return '✝';
        // if (this.containsString('Allerheiligen')) return '✝';
        if (this.containsString('Weihnacht'))
            return '🎄';
        return undefined;
    }
    get titleEmojiForSchoolHolidays() {
        if (this.containsString('Winterferien'))
            return '⛄️';
        // if (this.containsString('Osterferien')) return '';
        // if (this.containsString('Pfingstferien')) return '';
        if (this.containsString('Sommerferien'))
            return '🌻';
        if (this.containsString('Herbstferien'))
            return '🍂';
        if (this.containsString('Weihnachtsferien'))
            return '⛄️';
        return undefined;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get title() {
        if (this.item instanceof SchedulingApiAbsence) {
            if (this.member) {
                return `${this.member.firstName} ${this.member.lastName}`;
            }
            return undefined;
        }
        if (this.item instanceof SchedulingApiHoliday) {
            let result = '';
            if (this.titleEmoji)
                result += `${this.titleEmoji} `;
            result += this.item.name;
            return result;
        }
        if (this.item instanceof SchedulingApiBirthday) {
            return `${this.item.firstName} ${this.item.lastName}`;
        }
        return undefined;
    }
    ngOnDestroy() {
        var _a;
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        (_a = this.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isFirstItemOfItem() {
        return this._isFirstItemOfItem.get(() => {
            const item = this.item;
            let itemStart;
            if (item instanceof SchedulingApiBirthday) {
                const lastRequestedDate = +this.api.getLastLoadSearchParams().get('start');
                const startOfDayForYear = item.startBasedOnCalendarRequest(lastRequestedDate, this.pMoment);
                // get item interval (start and end of day)
                itemStart = this.getStartOf(startOfDayForYear, 'day');
            }
            else {
                itemStart = item.time.start;
            }
            return itemStart >= this.startOfDay;
        });
    }
    getStartOf(timestamp, unitOfTime) {
        return this.pMoment.m(timestamp).startOf(unitOfTime).valueOf();
    }
    getEndOf(timestamp, unitOfTime) {
        return this.pMoment.m(timestamp).add(1, unitOfTime).startOf(unitOfTime).valueOf();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isLastItemOfItem() {
        return this._isLastItemOfItem.get(() => {
            const item = this.item;
            let itemEnd;
            if (item instanceof SchedulingApiBirthday) {
                const lastRequestedDate = +this.api.getLastLoadSearchParams().get('start');
                const startOfDayForYear = item.startBasedOnCalendarRequest(lastRequestedDate, this.pMoment);
                // get item interval (start and end of day)
                itemEnd = this.getEndOf(startOfDayForYear, 'day');
            }
            else {
                itemEnd = item.time.end;
            }
            return itemEnd <= +this.pMoment.m(this.startOfDay).add(1, 'day');
        });
    }
    /**
     * Is this the start day of a week?
     */
    get isStartOfBar() {
        return this._isStartOfBar.get(() => {
            if (this.schedulingService.urlParam.calendarMode === CalendarModes.DAY)
                return true;
            if (this.schedulingService.urlParam.calendarMode === CalendarModes.MONTH &&
                this.pMoment.m(this.startOfDay).date() === 1)
                return true;
            return this.pMoment.m(this.startOfDay).weekday() === 0;
        });
    }
    /**
     * Is this the end day of a week?
     */
    get isEndOfBar() {
        return this._isEndOfBar.get(() => {
            if (this.schedulingService.urlParam.calendarMode === CalendarModes.DAY)
                return true;
            if (this.schedulingService.urlParam.calendarMode === CalendarModes.MONTH &&
                +this.pMoment.m(this.startOfDay).endOf('day') === +this.pMoment.m(this.startOfDay).add(1, 'months').date(0).endOf('day'))
                return true;
            return this.pMoment.m(this.startOfDay).weekday() === 6;
        });
    }
    formattedTime(timestamp) {
        if (this.item instanceof SchedulingApiHoliday ||
            this.item instanceof SchedulingApiAbsence && this.item.isFullDay) {
            return this.datePipe.transform(timestamp, 'shortDate');
        }
        const start = this.item.time.start;
        const end = this.item.time.end;
        if (this.pMoment.m(start).isSame(end, 'day')) {
            return this.datePipe.transform(timestamp, 'shortTime');
        }
        return `${this.datePipe.transform(timestamp, 'shortDate')} ${this.datePipe.transform(timestamp, 'shortTime')}`;
    }
    /**
     * Start Date/Time
     */
    get start() {
        return this._start.get(() => {
            const start = this.item.time.start;
            return this.formattedTime(start);
        });
    }
    /**
     * End Date/Time
     */
    get end() {
        return this._end.get(() => {
            const end = this.item.time.end;
            if (end === +this.pMoment.m(end).startOf('day')) {
                const timestamp = end - 1;
                return this.datePipe.transform(timestamp, 'shortDate');
            }
            return this.formattedTime(end);
        });
    }
    /**
     * Should bar-info be visible?
     */
    get hasBarInfo() {
        return (this.isFirstItemOfItem ||
            this.isStartOfBar);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get member() {
        if (this.item instanceof SchedulingApiHoliday)
            return null;
        return this.api.data.members.get(this.item.memberId);
    }
    /**
     * Is this part of the absence highlighted?
     */
    get isHighlighted() {
        return this.highlightService.isHighlighted(this.item, this.startOfDay);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isHighlightedItem() {
        return this.highlightService.isHighlighted(this.item);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isHovered() {
        return this.item.isHovered;
    }
    set isHovered(input) {
        this.item.isHovered = input;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get muteItem() {
        return this.highlightService.isMuted(this.item);
    }
    /**
     * Mark item as highlighted
     */
    onClick(event) {
        if (this.isHighlighted) {
            this.highlightService.setHighlighted(null);
        }
        else {
            this.highlightService.setHighlighted(this.item, this.startOfDay);
        }
        // a click on the calendar makes unset the highlightedShift.
        event.stopPropagation();
    }
    /**
     * Nav to detail form of this absence
     */
    navToDetailForm() {
        if (!(this.item instanceof SchedulingApiAbsence) && !(this.item instanceof SchedulingApiHoliday))
            return;
        this.highlightService.setHighlighted(null);
        this.router.navigate([`client/absence/${this.item.id.toString()}`]);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showEditButton() {
        if (this.readMode)
            return false;
        if (this.item instanceof SchedulingApiHoliday)
            return false;
        if (this.item instanceof SchedulingApiAbsence) {
            if (!this.rightsService.userCanWriteAbsences)
                return false;
            return true;
        }
        return false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get tooltipTitle() {
        if (this.item instanceof SchedulingApiHoliday)
            return undefined;
        if (this.item instanceof SchedulingApiAbsence)
            return this.localize.transform(this.item.title);
        return `${this.item.firstName} ${this.item.lastName}`;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PAllDayItemComponent.prototype, "item", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PAllDayItemComponent.prototype, "items", void 0);
__decorate([
    ViewChild('tooltipRef', { static: true }),
    __metadata("design:type", typeof (_k = typeof NgxPopperjsContentComponent !== "undefined" && NgxPopperjsContentComponent) === "function" ? _k : Object)
], PAllDayItemComponent.prototype, "popperContent", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_l = typeof NgxPopperjsPlacements !== "undefined" && NgxPopperjsPlacements) === "function" ? _l : Object)
], PAllDayItemComponent.prototype, "popperPlacement", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], PAllDayItemComponent.prototype, "startOfDay", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PAllDayItemComponent.prototype, "readMode", void 0);
PAllDayItemComponent = __decorate([
    Component({
        selector: 'p-all-day-item[item][items][startOfDay][popperPlacement]',
        templateUrl: './p-all-day-item.component.html',
        styleUrls: ['./p-all-day-item.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, typeof (_b = typeof HighlightService !== "undefined" && HighlightService) === "function" ? _b : Object, SchedulingService, typeof (_c = typeof Router !== "undefined" && Router) === "function" ? _c : Object, typeof (_d = typeof RightsService !== "undefined" && RightsService) === "function" ? _d : Object, typeof (_e = typeof LocalizePipe !== "undefined" && LocalizePipe) === "function" ? _e : Object, typeof (_f = typeof PMomentService !== "undefined" && PMomentService) === "function" ? _f : Object, typeof (_g = typeof PDatePipe !== "undefined" && PDatePipe) === "function" ? _g : Object])
], PAllDayItemComponent);
export { PAllDayItemComponent };
//# sourceMappingURL=p-all-day-item.component.js.map