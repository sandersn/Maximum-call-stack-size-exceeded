var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
import { __decorate, __metadata } from "tslib";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, HostBinding, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, ActivatedRoute } from '@angular/router';
import { CourseFilterService } from '@plano/client/scheduling/course-filter.service';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { Data } from '@plano/shared/core/data/data';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { CalendarModes } from './calendar-modes';
import { SchedulingFilterService } from './scheduling-filter.service';
import { BirthdayService } from './shared/api/birthday.service';
import { sortShiftsForListViewFns } from './shared/api/scheduling-api.utils';
import { PSchedulingCalendarComponent } from './shared/p-scheduling-calendar/p-calendar/p-calendar.component';
import { PAppStartupService } from '../../app-startup.service';
import { assumeNonNull } from '../../shared/core/null-type-utils';
import { CurrentModalsService } from '../../shared/core/p-modal/current-modals.service';
import { RightsService } from '../accesscontrol/rights.service';
import { BootstrapSize } from '../shared/bootstrap-styles.enum';
import { FilterService } from '../shared/filter.service';
import { HighlightService } from '../shared/highlight.service';
import { PSidebarService } from '../shared/p-sidebar/p-sidebar.service';
let SchedulingComponent = class SchedulingComponent {
    constructor(api, meService, pRouterService, route, filterService, schedulingService, courseFilterService, highlightService, rightsService, console, pSidebarService, currentModalsService, schedulingFilterService, pMomentService, birthdayService, localize, pAppStartupService, changeDetectorRef) {
        this.api = api;
        this.meService = meService;
        this.pRouterService = pRouterService;
        this.route = route;
        this.filterService = filterService;
        this.schedulingService = schedulingService;
        this.courseFilterService = courseFilterService;
        this.highlightService = highlightService;
        this.rightsService = rightsService;
        this.console = console;
        this.pSidebarService = pSidebarService;
        this.currentModalsService = currentModalsService;
        this.schedulingFilterService = schedulingFilterService;
        this.pMomentService = pMomentService;
        this.birthdayService = birthdayService;
        this.localize = localize;
        this.pAppStartupService = pAppStartupService;
        this.changeDetectorRef = changeDetectorRef;
        this._alwaysTrue = true;
        this.calendar = null;
        this.modalRef = null;
        this.config = Config;
        this.searchVisible = false;
        this.ICONS = PlanoFaIconPool;
        this.BootstrapSize = BootstrapSize;
        this.CalendarModes = CalendarModes;
        this.ngUnsubscribe = new Subject();
        this._shiftsForCalendar = new Data(this.api, this.filterService, this.schedulingFilterService);
        this._absencesForCalendar = new Data(this.api, this.filterService, this.schedulingFilterService);
        this._holidaysForCalendar = new Data(this.api, this.filterService, this.schedulingFilterService);
        this.now = +this.pMomentService.m();
    }
    ngAfterContentChecked() {
        this.handleIncompleteUrl();
    }
    /**
     * If this url has no defined date, navigate to a default-value.
     */
    handleIncompleteUrl() {
        var _a, _b;
        if (this.route.snapshot.params['date'] !== '0')
            return;
        const date = (_a = (this.schedulingService.urlParam.date)) !== null && _a !== void 0 ? _a : +this.pMomentService.m().startOf('day');
        const calendarMode = (_b = this.schedulingService.urlParam.calendarMode) !== null && _b !== void 0 ? _b : this.initialCalendarMode();
        this.pRouterService.navigate([`/client/scheduling/${calendarMode}/${date}`], { replaceUrl: true });
        if (this.isToday(date))
            this.scrollToToday();
    }
    isToday(date) {
        return this.pMomentService.m(date).isSame(this.now, 'date');
    }
    /**
     * initial calendar mode
     */
    initialCalendarMode() {
        return CalendarModes.DAY;
    }
    /**
     * Should the sidebar be fullscreen or part of screen.
     */
    get hasFullscreenSideBar() {
        return Config.IS_MOBILE && !this.pSidebarService.mainSidebarIsCollapsed;
    }
    /**
     * This makes it possible to have meService private.
     */
    get showContent() {
        return this.meService.isLoaded();
    }
    /** AfterContentInit */
    ngAfterContentInit() {
        this.loadInitialData();
        this.setRouterListener();
    }
    loadInitialData() {
        this.pAppStartupService.isReady(() => {
            this.schedulingService.writeUrlParamsToService(this.route.snapshot.params);
            this.meService.isLoaded(() => {
                this.loadNewData(() => {
                    this.runAllCallbacks();
                    this.scrollToCurrentDate();
                });
            });
        });
    }
    /**
     * Update values if url changed
     */
    loadNewData(success) {
        this.schedulingService.updateQueryParams(!this.courseFilterService.bookingsVisible);
        // TODO: Move the following code to p-calendar.component as well as the html:
        // <p-spinner [size]="BootstrapSize.LG" *ngIf="api.isLoadOperationRunning" class="area-blocking-spinner"></p-spinner>
        // Maybe i can rewrite it in p-calendar.component to something like
        // this.api.onChange.subscribe(() => {
        // 	if (this.api.isLoadOperationRunning) {
        // 	this.changeDetectorRef.detach();
        // 	this.api.isLoaded(() => { this.changeDetectorRef.reattach() });
        // }
        // })
        // When starting loading of a view we disable whole change-detection for calendar to:
        // 1. prevent calendar from showing intermediate data (e.g. api has still data of old view but the SchedulingService
        // contains the queryParams for next view)
        // 2. Improve performance as the calendar does not destroy/recreate views during loading process
        if (this.calendar) {
            this.console.log('CalenderComponent > changeDetectorRef.detach()');
            this.calendar.changeDetectorRef.detach();
            window.setTimeout(() => {
                this.changeDetectorRef.detach();
            }, 1);
        }
        // Load data
        this.api.load({
            searchParams: this.schedulingService.queryParams,
            success: () => {
                if (!this.filterService.cookiesHaveBeenRead) {
                    this.filterService.readCookies();
                    this.filterService.initValues();
                }
                if (this.filterService.isHideAll(this.api.data.members, this.api.data.shiftModels)) {
                    this.filterService.unload();
                    this.filterService.initValues();
                }
                this.showDetailView(this.schedulingService.urlParam.detailObject, this.schedulingService.urlParam.detailObjectId);
                if (success)
                    success();
                this.schedulingService.schedulingApiHasBeenLoadedOnSchedulingComponent.next();
                if (this.calendar) {
                    this.calendar.resetDelayIsActiveStore();
                    this.calendar.scrollToTop();
                    window.setTimeout(() => {
                        assumeNonNull(this.calendar);
                        this.calendar.changeDetectorRef.reattach();
                        this.changeDetectorRef.reattach();
                    }, 1);
                    // this.console.log('CalenderComponent > changeDetectorRef.reattach()');
                }
            },
        });
    }
    /**
     * check if date has been switched within visible range
     */
    newDateIsInVisibleRange(oldCalendarMode, oldDate) {
        if (oldCalendarMode !== this.schedulingService.urlParam.calendarMode)
            return false;
        if (oldDate === this.schedulingService.urlParam.date)
            return true;
        return this.pMomentService.m(oldDate).isSame(this.schedulingService.urlParam.date, oldCalendarMode);
    }
    /**
     * Set listeners for router changes
     */
    setRouterListener() {
        // eslint-disable-next-line rxjs/no-ignored-subscription -- Remove this before you work here.
        this.pRouterService.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe((event) => {
            // don’t listen to any other events then NavigationEnd
            if (!(event instanceof NavigationEnd))
                return;
            this.highlightService.setHighlighted(null);
            const prevCalendarMode = this.schedulingService.urlParam.calendarMode;
            const prevDate = this.schedulingService.urlParam.date;
            this.schedulingService.writeUrlParamsToService(this.route.snapshot.params);
            if (prevCalendarMode === null)
                return;
            if (this.newDateIsInVisibleRange(prevCalendarMode, prevDate))
                return;
            this.loadNewData(() => {
                this.runAllCallbacks();
                this.scrollToCurrentDate();
            });
        }, (error) => { this.console.error(error); });
    }
    scrollToCurrentDate() {
        if (this.dateIsInsideRange(this.route.snapshot.paramMap.get('calendarMode'), +this.route.snapshot.paramMap.get('date'))) {
            this.scrollToToday(false, false);
        }
    }
    get timelineViewIsActive() {
        return (this.schedulingService.urlParam.calendarMode === CalendarModes.DAY && !this.schedulingService.showDayAsList ||
            this.schedulingService.urlParam.calendarMode === CalendarModes.WEEK && !this.schedulingService.showWeekAsList);
    }
    /**
     * Scroll to today
     */
    scrollToToday(ignoreScrollPosition = true, waitForApiLoaded = false) {
        var _a;
        const date = (_a = (this.schedulingService.urlParam.date)) !== null && _a !== void 0 ? _a : +this.pMomentService.m().startOf('day');
        if ((this.schedulingService.urlParam.calendarMode === CalendarModes.MONTH && !Config.IS_MOBILE) || !this.isToday(date)) {
            this.pRouterService.scrollToSelector('.cal-today', { behavior: 'smooth', block: 'start' }, false, ignoreScrollPosition, waitForApiLoaded);
            return;
        }
        this.pRouterService.scrollToSelector('.scroll-target-id-now-line', Config.IS_MOBILE ? { block: 'start' } : undefined, false, ignoreScrollPosition, waitForApiLoaded);
    }
    /**
     * Check if given timestamp is inside the current range
     */
    dateIsInsideRange(calendarMode, timestamp) {
        return this.pMomentService.m(timestamp).isSame(this.now, calendarMode);
    }
    runAllCallbacks() {
        for (const callback of this.schedulingService.afterNavigationCallbacks) {
            callback();
        }
        this.schedulingService.afterNavigationCallbacks = [];
    }
    /**
     * If there is a detailObject in the url, show the related details
     */
    showDetailView(object, objectId) {
        if (objectId === null)
            return;
        const id = Id.create(objectId);
        switch (object) {
            case 'shiftModel':
                const shiftModel = this.api.data.shiftModels.get(id);
                if (shiftModel) {
                    this.showShiftModelDetails(shiftModel);
                }
                break;
            case 'member':
                const member = this.api.data.members.get(id);
                if (member) {
                    this.showMemberDetails(member);
                }
                break;
            default:
        }
    }
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    /**
     * Open shiftModel form
     */
    showShiftModelDetails(shiftModel) {
        this.pRouterService.navigate([`/client/shiftmodel/${shiftModel.id.toString()}`]);
    }
    /**
     * Show details for specific member
     */
    showMemberDetails(member) {
        this.pRouterService.navigate([`/client/member/${member.id.toString()}`]);
    }
    /**
     * Determine if this shift is selectable
     */
    shiftIsSelectable(shift) {
        if (!this.schedulingService.wishPickerMode) {
            return true;
        }
        const process = this.api.data.assignmentProcesses.getByShiftId(shift.id);
        if (process &&
            process.state === SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES) {
            return shift.assignableMembers.containsMemberId(this.meService.data.id);
        }
        return false;
    }
    /**
     * Get all shifts for calendar that are visible by the current filter settings.
     */
    get shiftsForCalendar() {
        return this._shiftsForCalendar.get(() => {
            const filteredItems = this.api.data.shifts.filterBy((shift) => {
                return this.filterService.isVisible(shift);
            });
            const result = filteredItems.sort(sortShiftsForListViewFns, false);
            return result;
        });
    }
    /**
     * Get all absences for calendar
     */
    get absencesForCalendar() {
        return this._absencesForCalendar.get(() => {
            return this.api.data.absences.filterBy((absence) => {
                return this.filterService.isVisible(absence);
            });
        }).sortedBy([
            (item) => {
                try {
                    return item.time.end;
                }
                catch (error) {
                    // PLANO-FE-4N4
                    this.console.error(error);
                    return null;
                }
            },
            (item) => item.time.start,
        ], false);
    }
    /**
     * Get all holidays for calendar
     */
    get holidaysForCalendar() {
        return this._holidaysForCalendar.get(() => {
            const result = this.api.data.holidays.filterBy((holiday) => {
                return this.filterService.isVisible(holiday);
            });
            return result.sortedBy([
                (item) => {
                    try {
                        return item.time.end;
                    }
                    catch (error) {
                        // PLANO-FE-4N4
                        this.console.error(error);
                        return null;
                    }
                },
                (item) => item.time.start,
            ], false);
        });
    }
    /**
     * Get list of birthdays of members in a p-calendar consumable way.
     */
    get birthdaysForCalendar() {
        return this.birthdayService.birthdays;
    }
    /**
     * handle dayClick of calendar
     */
    onDayClick(timestamp) {
        this.pRouterService.navigate([`/client/scheduling/${this.schedulingService.urlParam.calendarMode}/${timestamp}`]);
    }
    /**
     * handle shiftClick of calendar
     */
    onShiftSelect(input) {
        input.event.stopPropagation();
        if (Config.IS_MOBILE) {
            this.openShiftItem(input);
        }
    }
    /**
     * Close tooltip if any and open details of shift
     */
    openShiftItem(input) {
        var _a;
        input.event.stopPropagation();
        this.highlightService.setHighlighted(null);
        let url = `/client/shift/${input.shift.id.toUrl()}`;
        const openTab = (_a = input.openTab) !== null && _a !== void 0 ? _a : undefined;
        if (openTab)
            url += `/${openTab}`;
        this.pRouterService.navigate([url]);
    }
    /**
     * Select all shifts that have the same weekday as the given timestamp
     */
    selectAllShiftsOfThisWeekday(timestamp) {
        const shifts = this.shiftsForCalendar.filterBy((shift) => {
            if (this.pMomentService.m(shift.start).isoWeekday() === this.pMomentService.m(timestamp).isoWeekday())
                return true;
            return false;
        }).filterBy((shift) => {
            return this.shiftIsSelectable(shift);
        });
        if (shifts.length === shifts.selectedItems.length) {
            shifts.setSelected(false);
        }
        else {
            shifts.setSelected();
        }
    }
    /**
     * Navigate to a new date
     */
    onChangeDate(input) {
        this.api.deselectAllSelections();
        this.pRouterService.navigate([`/client/scheduling/${this.schedulingService.urlParam.calendarMode}/${input}`]);
    }
    /**
     * Navigate to a new calendarMode
     */
    onChangeMode(mode) {
        this.api.deselectAllSelections();
        this.highlightService.setHighlighted(null);
        this.pRouterService.navigate([`/client/scheduling/${mode}/${this.schedulingService.urlParam.date}`]);
    }
    /**
     * Toggle show as List
     */
    onChangeShowDayAsList(newValue) {
        this.schedulingService.showDayAsList = newValue;
        this.api.data.shifts.setSelected(false);
    }
    /**
     * Toggle show as List
     */
    onChangeShowWeekAsList(newValue) {
        this.schedulingService.showWeekAsList = newValue;
        this.api.data.shifts.setSelected(false);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    selectRelatedShifts(triggerItem) {
        var _a;
        let shifts;
        if (this.schedulingService.wishPickerMode) {
            shifts = this.shiftsForCalendar.filterBy(shift => {
                if (!this.filterService.isVisible(shift))
                    return false;
                // only select items that are selectable
                if (!shift.assignableMembers.contains(this.meService.data.id))
                    return false;
                const process = this.api.data.assignmentProcesses.getByShiftId(shift.id);
                if (process && process.state === SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES) {
                    if (!process.onlyAskPrefsForUnassignedShifts)
                        return true;
                    if (shift.emptyMemberSlots)
                        return true;
                    return false;
                }
                return false;
            }).filterBy(shift => {
                return this.shiftIsSelectable(shift);
            });
        }
        else {
            shifts = this.shiftsForCalendar.filterBy(shift => {
                return this.filterService.isVisible(shift);
            }).filterBy(shift => {
                return this.shiftIsSelectable(shift);
            });
        }
        shifts.toggleSelectionByItem(triggerItem);
        const firstSelectedShift = shifts.sortedBy('start', false).find(item => item.selected);
        if (firstSelectedShift && !firstSelectedShift.isNewItem())
            this.pRouterService.scrollToSelector(`#scroll-target-id-${firstSelectedShift.id.toPrettyString()}`, undefined, true, true, false);
        (_a = shifts.first) === null || _a === void 0 ? void 0 : _a.id.toPrettyString();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get itemsFilterTitle() {
        return this.localize.transform('Ausgeblendete Schichten: ${counter} von ${amount}', {
            counter: (this.api.data.shifts.length - this.shiftsForCalendar.length).toString(),
            amount: this.api.data.shifts.length.toString(),
        });
    }
};
__decorate([
    HostBinding('class.o-hidden'),
    HostBinding('class.flex-grow-1'),
    HostBinding('class.d-flex'),
    __metadata("design:type", Object)
], SchedulingComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    ViewChild(PSchedulingCalendarComponent),
    __metadata("design:type", Object)
], SchedulingComponent.prototype, "calendar", void 0);
SchedulingComponent = __decorate([
    Component({
        selector: 'p-scheduling',
        templateUrl: './scheduling.component.html',
        styleUrls: ['./scheduling.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, typeof (_b = typeof MeService !== "undefined" && MeService) === "function" ? _b : Object, typeof (_c = typeof PRouterService !== "undefined" && PRouterService) === "function" ? _c : Object, typeof (_d = typeof ActivatedRoute !== "undefined" && ActivatedRoute) === "function" ? _d : Object, typeof (_e = typeof FilterService !== "undefined" && FilterService) === "function" ? _e : Object, SchedulingService, typeof (_f = typeof CourseFilterService !== "undefined" && CourseFilterService) === "function" ? _f : Object, typeof (_g = typeof HighlightService !== "undefined" && HighlightService) === "function" ? _g : Object, typeof (_h = typeof RightsService !== "undefined" && RightsService) === "function" ? _h : Object, typeof (_j = typeof LogService !== "undefined" && LogService) === "function" ? _j : Object, typeof (_k = typeof PSidebarService !== "undefined" && PSidebarService) === "function" ? _k : Object, typeof (_l = typeof CurrentModalsService !== "undefined" && CurrentModalsService) === "function" ? _l : Object, SchedulingFilterService, typeof (_m = typeof PMomentService !== "undefined" && PMomentService) === "function" ? _m : Object, typeof (_o = typeof BirthdayService !== "undefined" && BirthdayService) === "function" ? _o : Object, typeof (_p = typeof LocalizePipe !== "undefined" && LocalizePipe) === "function" ? _p : Object, typeof (_q = typeof PAppStartupService !== "undefined" && PAppStartupService) === "function" ? _q : Object, typeof (_r = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _r : Object])
], SchedulingComponent);
export { SchedulingComponent };
//# sourceMappingURL=scheduling.component.js.map