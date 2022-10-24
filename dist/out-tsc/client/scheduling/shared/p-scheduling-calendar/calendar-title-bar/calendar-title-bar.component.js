var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
import { __decorate, __metadata } from "tslib";
import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Output, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { Router } from '@angular/router';
import { CalendarModes } from '@plano/client/scheduling/calendar-modes';
import { CourseFilterService } from '@plano/client/scheduling/course-filter.service';
import { EarlyBirdService } from '@plano/client/scheduling/early-bird.service';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { PWishesService } from '@plano/client/scheduling/wishes.service';
import { ToastsService } from '@plano/client/service/toasts.service';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { FilterService } from '@plano/client/shared/filter.service';
import { PExportService } from '@plano/client/shared/p-export.service';
import { DropdownTypeEnum } from '@plano/client/shared/p-forms/p-dropdown/p-dropdown.component';
import { PInputDateComponent } from '@plano/client/shared/p-forms/p-input-date/p-input-date.component';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { ExportShiftsExcelApiService } from '@plano/shared/api';
import { SchedulingApiService, SchedulingApiShifts } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PPushNotificationsService, PRequestWebPushNotificationPermissionContext } from '@plano/shared/core/p-push-notifications.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '../../../../../shared/core/router.service';
import { TextToHtmlService } from '../../text-to-html.service';
let CalendarTitleBarComponent = class CalendarTitleBarComponent {
    constructor(api, meService, toastsService, router, filterService, courseService, exportShiftsExcelApi, schedulingService, textToHtmlService, pWishesService, earlyBirdService, modalService, rightsService, pPushNotificationsService, pRouterService, localize, pMoment, pExport) {
        this.api = api;
        this.meService = meService;
        this.toastsService = toastsService;
        this.router = router;
        this.filterService = filterService;
        this.courseService = courseService;
        this.exportShiftsExcelApi = exportShiftsExcelApi;
        this.schedulingService = schedulingService;
        this.textToHtmlService = textToHtmlService;
        this.pWishesService = pWishesService;
        this.earlyBirdService = earlyBirdService;
        this.modalService = modalService;
        this.rightsService = rightsService;
        this.pPushNotificationsService = pPushNotificationsService;
        this.pRouterService = pRouterService;
        this.localize = localize;
        this.pMoment = pMoment;
        this.pExport = pExport;
        this.states = SchedulingApiAssignmentProcessState;
        this.selectedDateChange = new EventEmitter();
        this.calendarMode = CalendarModes.DAY;
        this.config = Config;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.BootstrapSize = BootstrapSize;
        this.PThemeEnum = PThemeEnum;
        this.PBtnThemeEnum = PBtnThemeEnum;
        this.DropdownTypeEnum = DropdownTypeEnum;
        /**
         * Export for people who like microsoft more than us...
         */
        this.exportIsRunning = false;
        this.now = +this.pMoment.m().startOf('day');
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    inputDateClick(event) {
        this.inputDateRef.editDate(event);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showMemoOfTodayBar() {
        return this.calendarMode === CalendarModes.DAY && this.api.isLoaded() && !!this.memoOfToday && !!this.memoOfToday.message;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onStickyNoteClick(modalContent) {
        if (this.calendarMode !== CalendarModes.DAY)
            return;
        this.editMemo(modalContent);
    }
    /**
     * Check if user is allowed to write at least one shiftModel
     */
    get canWriteAnyShiftModel() {
        return this.rightsService.userCanWriteAnyShiftModel;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get userCanManageBookings() {
        return this.rightsService.userCanManageBookings;
    }
    /**
     * Open form with the details of a shift
     */
    showShiftDetails() {
        this.router.navigate([`/client/shift/create/start/${this.selectedDate}`]);
    }
    /**
     * Open form with the details of a absence
     */
    showAbsenceDetails() {
        this.router.navigate(['/client/absence/0']);
    }
    /**
     * Open form with the details of a booking
     */
    showBookingDetails() {
        this.router.navigate(['/client/booking/create/']);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showMemoOfTodayButton() {
        var _a;
        if (this.calendarMode !== CalendarModes.DAY)
            return false;
        if (!this.api.isLoaded())
            return false;
        if (!this.rightsService.isOwner)
            return false;
        // Not enough space on mobile
        // if (Config.IS_MOBILE) return false;
        if ((_a = this.memoOfToday) === null || _a === void 0 ? void 0 : _a.message)
            return false;
        return true;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get memoOfTodayButtonText() {
        var _a;
        if (!this.api.isLoaded())
            return undefined;
        if (!this.rightsService.isOwner)
            return undefined;
        // Not enough space on mobile
        if (Config.IS_MOBILE)
            return undefined;
        if ((_a = this.memoOfToday) === null || _a === void 0 ? void 0 : _a.message)
            return undefined;
        return this.localize.transform('Hinzufügen');
    }
    /**
     * Get memo for this day
     */
    get memoOfToday() {
        return this.api.data.memos.getByDay(this.selectedDate);
    }
    /**
     * Turn the text into html [and crop it if wanted]
     */
    textToHtml(text) {
        return this.textToHtmlService.textToHtml(text, false, 1, false);
    }
    /**
     * Check if given timestamp is today
     */
    dateIsToday(timestamp) {
        return this.pMoment.m(timestamp).isSame(this.now, 'day');
    }
    /**
     * is the api currently loading?
     */
    get isApiLoading() {
        return this.api.isLoadOperationRunning;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    exportShifts() {
        // set shifts to be exported
        this.exportShiftsExcelApi.setEmptyData();
        for (const item of this.api.data.shifts.iterable()) {
            if (this.filterService.isVisible(item)) {
                this.exportShiftsExcelApi.data.shiftIds.createNewItem(item.id);
            }
        }
        // set members to be exported
        for (const member of this.api.data.members.iterable()) {
            if (this.filterService.isVisible(member))
                this.exportShiftsExcelApi.data.memberIds.push(member.id);
        }
        // set shiftModel to be exported
        for (const shiftModel of this.api.data.shiftModels.iterable()) {
            if (this.filterService.isVisible(shiftModel))
                this.exportShiftsExcelApi.data.shiftModelIds.push(shiftModel.id);
        }
        // get query parameters
        const queryParams = new HttpParams()
            .set('start', (this.schedulingService.shiftsStart).toString())
            .set('end', (this.schedulingService.shiftsEnd).toString());
        // cSpell:ignore kalenderexport
        const fileName = this.pExport.getFileName(this.localize.transform('kalenderexport'), this.schedulingService.shiftsStart, this.schedulingService.shiftsEnd - 1);
        // download file
        this.exportIsRunning = true;
        this.exportShiftsExcelApi.downloadFile(fileName, 'xlsx', queryParams, 'PUT', () => {
            this.exportIsRunning = false;
        });
    }
    /**
     * Sends evaluation report to the user.
     */
    evaluateShiftPlan() {
        this.toastsService.addToast({
            content: this.localize.transform('Das Ergebnis der Überprüfung wird dir per Email zugeschickt an: <strong>${email}</strong>', {
                email: this.meService.data.email,
            }),
            theme: PThemeEnum.SUCCESS,
        });
        this.api.data.evaluation.generate = true;
        this.api.save();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    stopMode() {
        if (this.api.isLoaded()) {
            this.api.data.shifts.setSelected(false);
        }
        if (this.config.IS_MOBILE) {
            this.filterService.showOnlyEarlyBirdAssignmentProcesses(false);
        }
        this.schedulingService.earlyBirdMode = false;
        this.askForNotificationPermissionIfNecessary();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    toggleWishPickerMode() {
        if (this.api.isLoaded()) {
            this.api.data.shifts.setSelected(false);
        }
        if (this.config.IS_MOBILE) {
            this.filterService.showOnlyEarlyBirdAssignmentProcesses(false);
            this.filterService.showOnlyWishPickerAssignmentProcesses(!this.schedulingService.wishPickerMode);
        }
        this.schedulingService.wishPickerMode = !this.schedulingService.wishPickerMode;
        const shiftsWithNoPrefs = this.api.data.shifts.filterBy((item) => {
            const process = this.api.data.assignmentProcesses.getByShiftId(item.id);
            if (!process)
                return false;
            if (process.state !== SchedulingApiAssignmentProcessState.ASKING_MEMBER_PREFERENCES)
                return false;
            if (!item.assignableMembers.containsMemberId(this.meService.data.id))
                return false;
            return item.myPref === null;
        });
        const firstSelectedShift = shiftsWithNoPrefs.sortedBy('start', false).first;
        if (firstSelectedShift && !firstSelectedShift.isNewItem())
            this.pRouterService.scrollToSelector(`#scroll-target-id-${firstSelectedShift.id.toPrettyString()}`, undefined, true, true, false);
    }
    askForNotificationPermissionIfNecessary() {
        this.pPushNotificationsService.requestWebPushNotificationPermission(PRequestWebPushNotificationPermissionContext.CLOSED_UI_EARLY_BIRD_MODE);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    toggleEarlyBirdMode() {
        if (this.api.isLoaded()) {
            this.api.data.shifts.setSelected(false);
        }
        if (this.config.IS_MOBILE) {
            this.filterService.showOnlyWishPickerAssignmentProcesses(false);
            this.filterService.showOnlyEarlyBirdAssignmentProcesses(!this.schedulingService.earlyBirdMode);
        }
        this.schedulingService.earlyBirdMode = !this.schedulingService.earlyBirdMode;
        const shifts = this.api.data.shifts.filterBy((item) => this.showAssignMeButton(item));
        const firstSelectedShift = shifts.sortedBy('start', false).first;
        if (firstSelectedShift && !firstSelectedShift.isNewItem())
            this.pRouterService.scrollToSelector(`#scroll-target-id-${firstSelectedShift.id.toPrettyString()}`, undefined, true, true, false);
    }
    /**
     * Is the current user allowed to be assigned? Is the related process an early bird thing etc.
     */
    showAssignMeButton(item) {
        var _a;
        // Is not in assign-me-mode?
        if (!this.schedulingService.earlyBirdMode)
            return false;
        const process = this.api.data.assignmentProcesses.getByShiftId(item.id);
        // backend decides if user can pick wish
        return ((_a = process === null || process === void 0 ? void 0 : process.shiftRefs.get(item.id)) === null || _a === void 0 ? void 0 : _a.requesterCanDoEarlyBird) === true || false;
    }
    /**
     * Get the amount of free wishes of all time and all processes.
     * Returns undefined if there is no process in ASKING_MEMBER_PREFERENCES state.
     */
    get freeWishesCount() {
        return this.pWishesService.freeWishesCount;
    }
    /**
     * Get the amount of available seats for logged in member of all time and all processes.
     * Returns undefined if there is no process in EARLY_BIRD_SCHEDULING state.
     */
    get freeEarlyBirdSeatsCount() {
        return this.earlyBirdService.freeEarlyBirdSeatsCount;
    }
    /**
     * Space in this title-bar is rare if a lot of buttons, sidebars and stuff like this is visible.
     */
    get spaceIsRare() {
        if (this.config.IS_MOBILE)
            return true;
        if (this.courseService.bookingsVisible)
            return true;
        if (this.api.hasSelectedItems)
            return true;
        return false;
    }
    /**
     * Open form for changing the memo content
     */
    editMemo(modalContent) {
        this.api.createDataCopy();
        this.modalService.openModal(modalContent, {
            success: () => {
                this.api.mergeDataCopy();
                if (!this.memoOfToday.message.length)
                    this.removeEditableMemo(this.memoOfToday);
                // HACK: Sometimes there are memos without a message. i don’t know why. ¯\_(ツ)_/¯
                for (const item of this.api.data.memos.iterable()) {
                    if (item.message.length)
                        continue;
                    this.api.data.memos.removeItem(item);
                }
                this.api.save();
            },
            dismiss: () => {
                var _a;
                this.api.dismissDataCopy();
                if ((_a = this.memoOfToday) === null || _a === void 0 ? void 0 : _a.isNewItem()) {
                    this.removeEditableMemo(this.memoOfToday);
                    this.api.save();
                }
            },
        });
    }
    /**
     * Remove a memo
     */
    removeEditableMemo(memo) {
        // HACK: Sometimes there are memos without a message. i don’t know why. ¯\_(ツ)_/¯
        for (const item of this.api.data.memos.iterable()) {
            if (item.message.length)
                continue;
            this.api.data.memos.removeItem(item);
        }
        this.api.data.memos.removeItem(memo);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get memoModalDefaultDate() {
        if (this.calendarMode !== CalendarModes.DAY)
            return undefined;
        return this.selectedDate;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get memoDatepickerMin() {
        return +this.pMoment.m(this.selectedDate).startOf(this.calendarMode);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get memoDatepickerMax() {
        return +this.pMoment.m(this.selectedDate).endOf(this.calendarMode);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftsForCommentsModal() {
        if (!this.memoModalDefaultDate || !this.api.isLoaded())
            return new SchedulingApiShifts(null, false);
        return this.api.data.shifts.filterBy(item => !!item.description);
    }
    /**
     * Navigate to next day|week|month…
     */
    navTo(input) {
        const goal = this.pMoment.m(input);
        this.selectedDateChange.emit(this.cleanUpUrlTimestamp(goal));
    }
    cleanUpUrlTimestamp(input) {
        if (!input.isSame(this.now, this.calendarMode))
            return +input.startOf(this.calendarMode);
        return +this.pMoment.m(this.now).startOf('day');
    }
};
__decorate([
    Input(),
    __metadata("design:type", Number)
], CalendarTitleBarComponent.prototype, "selectedDate", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_p = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _p : Object)
], CalendarTitleBarComponent.prototype, "selectedDateChange", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], CalendarTitleBarComponent.prototype, "calendarMode", void 0);
__decorate([
    ViewChild('inputDateRef', { static: true }),
    __metadata("design:type", typeof (_q = typeof PInputDateComponent !== "undefined" && PInputDateComponent) === "function" ? _q : Object)
], CalendarTitleBarComponent.prototype, "inputDateRef", void 0);
CalendarTitleBarComponent = __decorate([
    Component({
        selector: 'p-calendar-title-bar[selectedDate]',
        templateUrl: './calendar-title-bar.component.html',
        styleUrls: ['./calendar-title-bar.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, typeof (_b = typeof MeService !== "undefined" && MeService) === "function" ? _b : Object, typeof (_c = typeof ToastsService !== "undefined" && ToastsService) === "function" ? _c : Object, typeof (_d = typeof Router !== "undefined" && Router) === "function" ? _d : Object, typeof (_e = typeof FilterService !== "undefined" && FilterService) === "function" ? _e : Object, CourseFilterService, typeof (_f = typeof ExportShiftsExcelApiService !== "undefined" && ExportShiftsExcelApiService) === "function" ? _f : Object, SchedulingService,
        TextToHtmlService,
        PWishesService,
        EarlyBirdService, typeof (_g = typeof ModalService !== "undefined" && ModalService) === "function" ? _g : Object, typeof (_h = typeof RightsService !== "undefined" && RightsService) === "function" ? _h : Object, typeof (_j = typeof PPushNotificationsService !== "undefined" && PPushNotificationsService) === "function" ? _j : Object, typeof (_k = typeof PRouterService !== "undefined" && PRouterService) === "function" ? _k : Object, typeof (_l = typeof LocalizePipe !== "undefined" && LocalizePipe) === "function" ? _l : Object, typeof (_m = typeof PMomentService !== "undefined" && PMomentService) === "function" ? _m : Object, typeof (_o = typeof PExportService !== "undefined" && PExportService) === "function" ? _o : Object])
], CalendarTitleBarComponent);
export { CalendarTitleBarComponent };
//# sourceMappingURL=calendar-title-bar.component.js.map