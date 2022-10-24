var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
// TODO: Milad: Remove line above and fix lint errors
import { Injectable } from '@angular/core';
import { FilterService } from '@plano/client/shared/filter.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiService } from '@plano/shared/api';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { SchedulingFilterService } from '../../scheduling-filter.service';
import { BirthdayService } from '../api/birthday.service';
import { SchedulingApiBirthday } from '../api/scheduling-api-birthday.service';
export class Layout {
    constructor() {
        this.posIndex = -1;
        this.show = true;
    }
}
/**
 * Internal class to define a layout for a specific section of an item.
 */
class SectionLayout {
    constructor(item) {
        /**
         * Start of the section. It is always start of a day.
         */
        this.start = null;
        /**
         * End of the section. It is always start of a day and exclusive.
         * I.e. if section goes to end of 6. of September then this would be start of 7. of September.
         */
        this.end = null;
        /**
         * The layout of this section.
         */
        this.layout = new Layout();
        this.item = item;
    }
}
let CalenderAllDayItemLayoutService = class CalenderAllDayItemLayoutService {
    constructor(api, filterService, schedulingFilterService, pMoment, birthdayService) {
        this.api = api;
        this.filterService = filterService;
        this.schedulingFilterService = schedulingFilterService;
        this.pMoment = pMoment;
        this.birthdayService = birthdayService;
        /**
         * This maps stores <timestamp/day> -> <occupied_pos_indices>
         */
        this.occupiedPosIndices = new Map();
        this.layoutData = new Map();
        this.recalculateLayout = true;
        this.shiftsStart = null;
        this.shiftsEnd = null;
        this.hiddenLayout = new Layout();
        this.hiddenLayout.show = false;
        // recalculate on api change
        const recalculateOnApiChange = () => {
            const loadParams = this.api.getLastLoadSearchParams();
            if (loadParams && loadParams.get('data') === 'calendar') {
                this.recalculateLayout = true;
                // We explicitly don’t use SchedulingService.shiftsStart/SchedulingService.shiftsEnd
                // because these are not valid in shift-selection component of a booking.
                const start = this.api.getLastLoadSearchParams().get('start');
                assumeDefinedToGetStrictNullChecksRunning(start, 'start');
                this.shiftsStart = +start;
                const end = this.api.getLastLoadSearchParams().get('end');
                assumeDefinedToGetStrictNullChecksRunning(end, 'end');
                this.shiftsEnd = +end;
                // Ensure we are one day start/end. Just to be save…
                // End is exclusive. Subtract 1 or otherwise we might get the next day
                this.shiftsStart = this.getStartOf(this.shiftsStart, 'day');
                this.shiftsEnd = this.getEndOf(this.shiftsEnd - 1, 'day');
            }
        };
        if (this.api.isLoaded()) {
            recalculateOnApiChange();
        }
        this.api.onChange.subscribe(recalculateOnApiChange);
        this.birthdayService.onChange.subscribe(recalculateOnApiChange);
        // recalculate on filter-service change
        this.filterService.onChange.subscribe(() => {
            this.recalculateLayout = true;
        });
        this.schedulingFilterService.onChange.subscribe(() => {
            this.recalculateLayout = true;
        });
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    getLayout(timestamp, item) {
        this.updateLayoutIfNeeded();
        // return layout
        const layout = this.findLayout(timestamp, item);
        // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
        return layout ? layout : this.hiddenLayout;
    }
    findLayout(timestamp, item) {
        const sectionLayouts = this.layoutData.get(item);
        if (sectionLayouts) {
            for (const sectionLayout of sectionLayouts) {
                // timestamp is in given section?
                assumeDefinedToGetStrictNullChecksRunning(sectionLayout.start, 'sectionLayout.start');
                assumeDefinedToGetStrictNullChecksRunning(sectionLayout.end, 'sectionLayout.end');
                if (timestamp >= sectionLayout.start && timestamp < sectionLayout.end) {
                    return sectionLayout.layout;
                }
            }
        }
        return null;
    }
    updateLayoutIfNeeded() {
        if (!this.recalculateLayout)
            return;
        this.calculateLayout();
        this.recalculateLayout = false;
    }
    /**
     * @returns Returns the maximum pos-index for the given day (defined by "timestamp").
     * 		"-1" is returned if that day contains no all-day-items.
     * @param timestamp The day for which the value should be returned.
     */
    getMaxPosIndex(timestamp) {
        this.updateLayoutIfNeeded();
        // get occupied indices for day
        const occupiedPosIndicesForTimestamp = this.occupiedPosIndices.get(+this.pMoment.m(timestamp).startOf('day'));
        if (!occupiedPosIndicesForTimestamp) {
            return -1;
        }
        // find max value
        let maxPosIndex = -1;
        for (const occupiedPosIndex of occupiedPosIndicesForTimestamp) {
            if (occupiedPosIndex > maxPosIndex) {
                maxPosIndex = occupiedPosIndex;
            }
        }
        return maxPosIndex;
    }
    calculateLayout() {
        if (this.shiftsStart === null)
            return;
        // clear old data
        this.occupiedPosIndices.clear();
        this.layoutData.clear();
        // get all sections
        let sections = [];
        for (const item of this.getFilteredItems()) {
            sections = sections.concat(this.calculateSections(item));
        }
        // add sections week-wise
        let weekStart = this.getStartOf(this.shiftsStart, 'week');
        let weekEnd = this.getEndOf(weekStart, 'week');
        assumeDefinedToGetStrictNullChecksRunning(this.shiftsEnd, 'shiftsEnd');
        while (weekStart < this.shiftsEnd) {
            // Find all sections in current week
            // Note that the sections have been week-wise. So, each section will be processed only once.
            const sectionsInThisWeek = [];
            for (const section of sections) {
                assumeDefinedToGetStrictNullChecksRunning(section.start, 'section.start');
                if (section.start >= weekStart && section.start < weekEnd)
                    sectionsInThisWeek.push(section);
            }
            // sort sections
            this.sortSections(sectionsInThisWeek, weekEnd);
            // add them
            for (const section of sectionsInThisWeek)
                this.assignLowestPossiblePosIndexToSection(section);
            // goto next week
            weekStart = weekEnd;
            weekEnd = this.getEndOf(weekStart, 'week');
        }
    }
    getFilteredItems() {
        const result = [];
        for (const item of this.api.data.absences.iterable()) {
            if (this.filterService.isVisible(item))
                result.push(item);
        }
        for (const item of this.api.data.holidays.iterable()) {
            if (this.filterService.isVisible(item))
                result.push(item);
        }
        for (const item of this.birthdayService.birthdays.iterable()) {
            if (this.filterService.isVisible(item))
                result.push(item);
        }
        return result;
    }
    sortSections(sections, weekStart) {
        // The sections should be added in following order:
        // - First all sections are added whose absences also are available in previous week.
        //   Add them in the posIndex order of previous week so their order remain unchanged
        // - Then add seconds which are not available in previous week. Sort these according to their start time
        const getSortValue = (section) => {
            let result;
            // item also is available in previous week?
            const lastDayOfPrevWeek = this.pMoment.m(section.start).subtract(1, 'day').valueOf();
            const layoutLastWeek = this.findLayout(lastDayOfPrevWeek, section.item);
            if (layoutLastWeek) {
                // sort according posIndex of prev week
                result = layoutLastWeek.posIndex;
            }
            else {
                // otherwise we want to sort according section start normalized by week start
                assumeDefinedToGetStrictNullChecksRunning(section.start, 'section.start');
                result = section.start - weekStart;
                // make sure all sections which are not available in prev week come after the once which are available
                result += 8640000000;
            }
            return result;
        };
        sections.sort((a, b) => {
            return getSortValue(a) - getSortValue(b);
        });
    }
    calculateSections(item) {
        const result = [];
        let itemStart;
        let itemEnd;
        if (item instanceof SchedulingApiBirthday) {
            const start = this.api.getLastLoadSearchParams().get('start');
            const lastRequestedDate = start !== null ? +start : 0; // Not sure if this is correct. Just re-implemented pre-null-check-behaviour
            const startOfDayForYear = item.startBasedOnCalendarRequest(lastRequestedDate, this.pMoment);
            itemStart = this.getStartOf(startOfDayForYear, 'day');
            itemEnd = this.getEndOf(startOfDayForYear, 'day');
        }
        else {
            // get item interval (start and end of day)
            itemStart = this.getStartOf(item.time.start, 'day');
            // End is exclusive. Subtract 1 or otherwise we might get the next day
            itemEnd = this.getEndOf(item.time.end - 1, 'day');
        }
        // we are only interested in current view
        itemStart = this.shiftsStart !== null ? Math.max(itemStart, this.shiftsStart) : itemStart;
        itemEnd = this.shiftsEnd !== null ? Math.min(itemEnd, this.shiftsEnd) : itemEnd;
        // calculate sections
        while (itemStart < itemEnd) {
            // get next section splitting week-wise
            const endOfWeek = this.getEndOf(itemStart, 'week');
            const endOfSection = Math.min(itemEnd, endOfWeek);
            const newSection = new SectionLayout(item);
            newSection.start = itemStart;
            newSection.end = endOfSection;
            result.push(newSection);
            // goto next section
            itemStart = endOfSection;
        }
        return result;
    }
    getStartOf(timestamp, unitOfTime) {
        return this.pMoment.m(timestamp).startOf(unitOfTime).valueOf();
    }
    getEndOf(timestamp, unitOfTime) {
        return this.pMoment.m(timestamp).add(1, unitOfTime).startOf(unitOfTime).valueOf();
    }
    assignLowestPossiblePosIndexToSection(section) {
        const timestamps = this.getSectionTimestamps(section);
        for (let posIndex = 0;; ++posIndex) {
            // can we assign the section to this pos-index?
            let canAssignPosIndex = true;
            for (const timestamp of timestamps) {
                const posIndexOccupied = this.ensureOccupiedPosIndices(timestamp).includes(posIndex);
                if (posIndexOccupied) {
                    canAssignPosIndex = false;
                    break;
                }
            }
            // assign to pos-index
            if (canAssignPosIndex) {
                section.layout.posIndex = posIndex;
                // mark pos-index as occupied
                for (const timestamp of timestamps) {
                    const occupiedPosIndex = this.occupiedPosIndices.get(timestamp);
                    assumeDefinedToGetStrictNullChecksRunning(occupiedPosIndex, 'occupiedPosIndex');
                    occupiedPosIndex.push(posIndex);
                }
                // add to layoutMap
                let layoutList = this.layoutData.get(section.item);
                if (!layoutList) {
                    layoutList = [];
                    this.layoutData.set(section.item, layoutList);
                }
                layoutList.push(section);
                // we are done
                return;
            }
        }
    }
    /**
     * @returns Returns a list of all day timestamps in the given section
     */
    getSectionTimestamps(section) {
        const result = [];
        assumeDefinedToGetStrictNullChecksRunning(section.start, 'section.start');
        let currTimestamp = section.start;
        assumeDefinedToGetStrictNullChecksRunning(section.end, 'section.end');
        while (currTimestamp < section.end) {
            result.push(currTimestamp);
            // goto next day
            currTimestamp = this.pMoment.m(currTimestamp).add(1, 'day').valueOf();
        }
        return result;
    }
    ensureOccupiedPosIndices(timestamp) {
        let result = this.occupiedPosIndices.get(timestamp);
        if (!result) {
            result = [];
            this.occupiedPosIndices.set(timestamp, result);
        }
        return result;
    }
};
CalenderAllDayItemLayoutService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, typeof (_b = typeof FilterService !== "undefined" && FilterService) === "function" ? _b : Object, SchedulingFilterService, typeof (_c = typeof PMomentService !== "undefined" && PMomentService) === "function" ? _c : Object, BirthdayService])
], CalenderAllDayItemLayoutService);
export { CalenderAllDayItemLayoutService };
//# sourceMappingURL=calender-all-day-item-layout.service.js.map