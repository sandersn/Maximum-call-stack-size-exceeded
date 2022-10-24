var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, Input, ChangeDetectionStrategy } from '@angular/core';
import { CourseFilterService } from '@plano/client/scheduling/course-filter.service';
import { SchedulingFilterService } from '@plano/client/scheduling/scheduling-filter.service';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { DropdownTypeEnum } from '@plano/client/shared/p-forms/p-dropdown/p-dropdown.component';
import { RightsService, SchedulingApiService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
let CalendarFilterSettingsComponent = class CalendarFilterSettingsComponent {
    constructor(meService, api, course, highlightService, schedulingFilterService, courseService, rightsService) {
        this.meService = meService;
        this.api = api;
        this.course = course;
        this.highlightService = highlightService;
        this.schedulingFilterService = schedulingFilterService;
        this.courseService = courseService;
        this.rightsService = rightsService;
        this.config = Config;
        this._alwaysTrue = true;
        // FIXME: PLANO-9707 get rid of showShiftsFilterBtn and showShowOnlyMemberBtn in calendar-filter-settings
        this.showShiftsFilterBtn = false;
        // FIXME: PLANO--9707 get rid of showShiftsFilterBtn and showShowOnlyMemberBtn in calendar-filter-settings
        this.showShowOnlyMemberBtn = false;
        this.itemsFilterTitle = null;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.BootstrapSize = BootstrapSize;
        this.DropdownTypeEnum = DropdownTypeEnum;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get hasSchulferienData() {
        if (!this.api.isLoaded())
            return false;
        return !this.api.isSwitzerland;
    }
    get hasCoursesInCurrentShifts() {
        return !!this.api.data.shifts.findBy((item) => !!item.isCourse);
    }
    /**
     * Check if member has read permissions for one or more courses
     */
    get memberHasReadPermissionForCourses() {
        if (!this.api.isLoaded())
            return null;
        const COURSES = this.api.data.shiftModels.filterBy((item) => item.isCourse);
        if (this.rightsService.userCanReadAny(COURSES))
            return true;
        // Show Dropdown if there is at least one course.
        if (this.hasCoursesInCurrentShifts)
            return true;
        return false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showCourseViewOptionsDropdown() {
        // On Mobile the bookings area is currently not supported course info is always visible.
        if (Config.IS_MOBILE)
            return false;
        // We had an edge-case here, where a user has set bookings to visible, and then his/her permission to see bookings
        // got removed. "bookingsVisible" was stored in the cookies. The user then had a visible broken sidebar, and was not
        // able to set it to hidden.
        // The next code line should not be necessary because the bookings sidebar should not be visible as soon as user has
        // no permission. But just to be sure, i always give the ability to set a visible bookings sidebar to hidden.
        if (this.courseService.bookingsVisible)
            return true;
        // Has User permission to see this data?
        if (this.memberHasReadPermissionForCourses)
            return true;
        return false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    toggleCourseVisible() {
        this.courseService.courseVisible = !this.courseService.courseVisible;
        this.highlightService.setHighlighted(null);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    hideAllHolidaysAndBirthdays() {
        const toggledValue = !this.schedulingFilterService.hideAllHolidays;
        this.schedulingFilterService.hideAllHolidays = toggledValue;
        this.schedulingFilterService.hideAllBirthdays = toggledValue;
    }
};
__decorate([
    HostBinding('class.d-flex'),
    HostBinding('class.align-items-stretch'),
    HostBinding('class.justify-content-between'),
    __metadata("design:type", Object)
], CalendarFilterSettingsComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarFilterSettingsComponent.prototype, "showShiftsFilterBtn", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], CalendarFilterSettingsComponent.prototype, "showShowOnlyMemberBtn", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarFilterSettingsComponent.prototype, "itemsFilterTitle", void 0);
CalendarFilterSettingsComponent = __decorate([
    Component({
        selector: 'p-calendar-filter-settings',
        templateUrl: './calendar-filter-settings.component.html',
        styleUrls: ['./calendar-filter-settings.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof MeService !== "undefined" && MeService) === "function" ? _a : Object, typeof (_b = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _b : Object, CourseFilterService, typeof (_c = typeof HighlightService !== "undefined" && HighlightService) === "function" ? _c : Object, SchedulingFilterService,
        CourseFilterService, typeof (_d = typeof RightsService !== "undefined" && RightsService) === "function" ? _d : Object])
], CalendarFilterSettingsComponent);
export { CalendarFilterSettingsComponent };
//# sourceMappingURL=calendar-filter-settings.component.js.map