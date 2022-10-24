var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy, HostBinding, HostListener, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CourseFilterService } from '@plano/client/scheduling/course-filter.service';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { PWishesService } from '@plano/client/scheduling/wishes.service';
import { AbsenceService } from '@plano/client/shared/absence.service';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { ShiftAndShiftModelFormTabs } from '@plano/client/shared/component/p-shift-and-shiftmodel-form/p-shift-and-shiftmodel-form.component';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { PShiftExchangeService } from '@plano/client/shared/p-shift-exchange/shift-exchange.service';
import { SchedulingApiService } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { Data } from '@plano/shared/core/data/data';
import { ShiftItemViewStyles } from './shift-item-styles';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../../shared/core/null-type-utils';
import { CalendarModes } from '../../../../calendar-modes';
import { CalenderTimelineLayoutService } from '../../calender-timeline-layout.service';
let ShiftItemComponent = class ShiftItemComponent {
    constructor(api, router, meService, layout, highlightService, schedulingService, absenceService, rightsService, wishesService, courseService, pShiftExchangeService, pMoment) {
        this.api = api;
        this.router = router;
        this.meService = meService;
        this.layout = layout;
        this.highlightService = highlightService;
        this.schedulingService = schedulingService;
        this.absenceService = absenceService;
        this.rightsService = rightsService;
        this.wishesService = wishesService;
        this.courseService = courseService;
        this.pShiftExchangeService = pShiftExchangeService;
        this.pMoment = pMoment;
        this._isLoading = false;
        this.readMode = false;
        this._alwaysTrue = true;
        /**
         * FIXME: Quick n dirty for 1.7.0
         */
        this._showAsList = true;
        this.emptyMemberSlots = 0;
        this.viewStyle = ShiftItemViewStyles.SMALL;
        /**
         * With this boolean the multi-select checkboxes can be turned off for this shift
         */
        this.selectable = false;
        this.selectedChange = new EventEmitter();
        /**
         * A property to overwrite any internal logic that decides if course-info is visible or not.
         */
        this._showCourseInfo = null;
        this.onClick = new EventEmitter();
        this.BootstrapSize = BootstrapSize;
        this.ShiftAndShiftModelFormTabs = ShiftAndShiftModelFormTabs;
        this._isInThePast = false;
        this._process = new Data(this.api);
        this.states = SchedulingApiAssignmentProcessState;
        this._assignedMembers = new Data(this.api);
    }
    get hasId() {
        return `scroll-target-id-${this.shift.id.toPrettyString()}`;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isLoading() {
        if (this._isLoading)
            return true;
        return !this.api.isLoaded() || !this.meService.isLoaded() || !this.shift;
    }
    get _hasShowAsListClass() {
        return this.showAsList;
    }
    get _hasShowAsTimelineClass() {
        return !this.showAsList;
    }
    get _hasSomeBottomSpaceClass() {
        return this.hasSomeSpaceAround;
    }
    get _hasShadowClass() {
        assumeDefinedToGetStrictNullChecksRunning(this.shift, 'this.shift');
        return !Config.IS_MOBILE && this.highlightService.isHighlighted(this.shift);
    }
    get _isMobile() {
        return Config.IS_MOBILE;
    }
    get _hasHighlightedClass() {
        assumeDefinedToGetStrictNullChecksRunning(this.shift, 'this.shift');
        return this.highlightService.isHighlighted(this.shift);
    }
    get _styleZIndex() {
        if (!this.showAsList) {
            return this.layout.getLayout(this.shift).z.toString();
        }
        assumeDefinedToGetStrictNullChecksRunning(this.shift, 'this.shift');
        if (!this.highlightService.isHighlighted(this.shift))
            return '0';
        return '1020';
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isInThePast() {
        return this._isInThePast;
    }
    get _styleLeft() {
        if (this.showAsList)
            return undefined;
        return this.layout.getLayout(this.shift).x;
    }
    get _styleTop() {
        if (this.showAsList)
            return undefined;
        return this.layout.getLayout(this.shift).y;
    }
    get _styleWidth() {
        if (this.showAsList)
            return undefined;
        return this.layout.getLayout(this.shift).width;
    }
    get _styleHeight() {
        if (this.showAsList)
            return undefined;
        return this.layout.getLayout(this.shift).height;
    }
    get _hasClassMaxWidth600() {
        return this.classMaxWidth600;
    }
    get _hasClassM0() {
        return !this.classMaxWidth600;
    }
    get _borderColor() {
        assumeDefinedToGetStrictNullChecksRunning(this.shift, 'this.shift');
        return this.highlightService.isHighlighted(this.shift) ? `#${this.shift.model.color}` : '';
    }
    get _hasWiggleClass() {
        if (!this.showAsList)
            return false;
        if (Config.IS_MOBILE)
            return false;
        return this.shift.wiggle;
    }
    /**
     * Mark shift as highlighted
     */
    _onClickShift(event) {
        // a click on the calendar removes the highlighted shift.
        event.stopPropagation();
        if (!Config.IS_MOBILE &&
            this.viewStyle !== ShiftItemViewStyles.BUTTON &&
            this.viewStyle !== ShiftItemViewStyles.MEDIUM) {
            assumeDefinedToGetStrictNullChecksRunning(this.shift, 'this.shift');
            if (this.highlightService.isHighlighted(this.shift)) {
                this.highlightService.setHighlighted(null);
                this.wishesService.item = null;
            }
            else {
                this.highlightService.setHighlighted(this.shift);
                this.wishesService.item = this.shift;
            }
        }
        this.onClick.emit({
            shift: this.shift,
            event: event,
        });
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showCourseInfo() {
        if (Config.IS_MOBILE)
            return false;
        if (this._showCourseInfo !== null)
            return this._showCourseInfo;
        if (this.courseService.courseVisible !== null)
            return this.courseService.courseVisible;
        return false;
    }
    ngOnInit() {
        this.now = +this.pMoment.m();
        this._isInThePast = this.pMoment.m(this.shift.end).isBefore(this.now);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showAsList() {
        if (this.schedulingService.urlParam.calendarMode === CalendarModes.MONTH)
            return true;
        return this._showAsList;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showProcessStatusIcon() {
        // Status icon is not relevant while user is in earlyBirdMode
        if (this.showAssignMeButton)
            return false;
        // Is not part of a process?
        if (!this.process)
            return false;
        // Owners and bereichsleitende can see all status icons
        if (this.rightsService.userCanEditAssignmentProcess(this.process)) {
            return true;
        }
        // Members can see the state if it is not APPROVE or EARLY_BIRD_FINISHED
        if (this.process.state === this.states.APPROVE)
            return false;
        if (this.process.state === this.states.EARLY_BIRD_FINISHED)
            return false;
        return true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get shiftIsSelectable() {
        if (!this.schedulingService.wishPickerMode)
            return true;
        if (this.allowedToPickWish)
            return true;
        return false;
    }
    /**
     * Close tooltip if any and open details of shift
     */
    openShiftItem(input) {
        var _a;
        input.event.stopPropagation();
        this.highlightService.setHighlighted(null);
        const openTabAsString = (_a = input.openTab) !== null && _a !== void 0 ? _a : ShiftAndShiftModelFormTabs.basissettings;
        this.router.navigate([`/client/shift/${input.shift.id.toUrl()}/${openTabAsString}`]);
    }
    /**
     * Get the the process where this shift-item is included
     */
    get process() {
        return this._process.get(() => {
            if (!this.api.data.assignmentProcesses.length)
                return null;
            return this.api.data.assignmentProcesses.getByShiftId(this.shift.id);
        });
    }
    /**
     * Check if logged in user is assignable to this shift.
     */
    get meIsAssignable() {
        if (!this.meService.isLoaded())
            return false;
        return this.shift.assignableMembers.containsMemberId(this.meService.data.id);
    }
    get allowedToPickWish() {
        // backend decides if user can pick wish
        if (!this.process)
            return false;
        const SHIFT_REFS = this.process.shiftRefs;
        const RELATED_SHIFT_REF = SHIFT_REFS.get(this.shift.id);
        if (!RELATED_SHIFT_REF)
            throw new Error('No related shiftRef');
        return RELATED_SHIFT_REF.requesterCanSetPref === true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get muteItem() {
        assumeDefinedToGetStrictNullChecksRunning(this.shift, 'this.shift');
        if (this.shift.selected)
            return false;
        // eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition -- TODO: PLANO-18170 nils: needs to be tested in ui
        if (this.highlightService.isMuted(this.shift) !== null)
            return this.highlightService.isMuted(this.shift);
        if (!this.shiftIsSelectable)
            return true;
        // App is in assign-me-mode but user is not assignable
        if (this.schedulingService.earlyBirdMode && !this.showAssignMeButton)
            return true;
        if (Config.IS_MOBILE &&
            this.schedulingService.wishPickerMode &&
            !(this.selectable && this.allowedToPickWish))
            return true;
        return false;
    }
    /**
     * Is the current user allowed to be assigned? Is the related process an early bird thing etc.
     */
    get showAssignMeButton() {
        var _a, _b;
        // Is not in assign-me-mode?
        if (!this.schedulingService.earlyBirdMode)
            return false;
        // backend decides if user can pick wish
        return ((_b = (_a = this.process) === null || _a === void 0 ? void 0 : _a.shiftRefs.get(this.shift.id)) === null || _b === void 0 ? void 0 : _b.requesterCanDoEarlyBird) === true || false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showMultiSelectCheckbox() {
        // Should never be visible in combination with earlyBirdMode
        if (this.schedulingService.earlyBirdMode)
            return false;
        // If is mobile device only allow checkbox on items in wishMode
        if (Config.IS_MOBILE)
            return this.schedulingService.wishPickerMode;
        if (this.api.isLoaded() && this.api.hasSelectedItems)
            return true;
        assumeDefinedToGetStrictNullChecksRunning(this.shift, 'this.shift');
        if (this.highlightService.isHighlighted(this.shift))
            return true;
        if (this.schedulingService.wishPickerMode)
            return true;
        return false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get assignedMembers() {
        return this._assignedMembers.get(() => {
            return this.shift.assignedMembers.sortedBy([
                // Sort them by name
                (item) => item.lastName,
                (item) => item.firstName,
                // Prio 3: All other members
                // Prio 2: Current user
                (item) => !item.id.equals(this.meService.data.id),
                // Prio 1: Absent members
                (item) => {
                    assumeDefinedToGetStrictNullChecksRunning(this.shift, 'this.shift');
                    !this.absenceService.overlappingAbsences(item.id, this.shift).length;
                },
            ], false);
        });
    }
    /**
     * Check if this component is fully loaded.
     * Can be used to show skeletons/spinners then false.
     */
    get isLoaded() {
        if (!this.api.isLoaded())
            return false;
        // NOTE: The item will be null if it could not be found
        if (this.shift === null)
            return true;
        if (!this.meService.isLoaded())
            return false;
        if (!this.shift)
            return false;
        return true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get hasSomeBottomSpace() {
        if (this.viewStyle === ShiftItemViewStyles.DETAILED)
            return false;
        if (!this.hasSomeSpaceAround)
            return false;
        return true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get hasSomeSpaceAround() {
        if (Config.IS_MOBILE)
            return false;
        if (this.viewStyle === ShiftItemViewStyles.MULTI_SELECT)
            return true;
        if (this.viewStyle === ShiftItemViewStyles.MEDIUM)
            return true;
        if (this.viewStyle === ShiftItemViewStyles.MEDIUM_MULTI_SELECT)
            return true;
        return false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get classMaxWidth600() {
        if (!this.showAsList)
            return false;
        if (this.viewStyle === ShiftItemViewStyles.MEDIUM)
            return true;
        if (this.viewStyle === ShiftItemViewStyles.MEDIUM_MULTI_SELECT)
            return true;
        if (this.viewStyle === ShiftItemViewStyles.DETAILED)
            return true;
        return false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showShiftExchangeIcon() {
        assumeDefinedToGetStrictNullChecksRunning(this.shift, 'this.shift');
        return this.pShiftExchangeService.shiftHasActiveShiftExchangeSearch(this.shift);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showIllnessIcon() {
        assumeDefinedToGetStrictNullChecksRunning(this.shift, 'this.shift');
        return this.pShiftExchangeService.shiftHasActiveIllness(this.shift);
    }
};
__decorate([
    HostBinding('id'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], ShiftItemComponent.prototype, "hasId", null);
__decorate([
    Input('isLoading'),
    __metadata("design:type", Object)
], ShiftItemComponent.prototype, "_isLoading", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftItemComponent.prototype, "readMode", void 0);
__decorate([
    HostBinding('class.clickable'),
    HostBinding('class.card'),
    __metadata("design:type", Boolean)
], ShiftItemComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    HostBinding('class.showAsList'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], ShiftItemComponent.prototype, "_hasShowAsListClass", null);
__decorate([
    HostBinding('class.showAsTimeline'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], ShiftItemComponent.prototype, "_hasShowAsTimelineClass", null);
__decorate([
    HostBinding('class.mr-1'),
    HostBinding('class.ml-1'),
    HostBinding('class.mb-2'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], ShiftItemComponent.prototype, "_hasSomeBottomSpaceClass", null);
__decorate([
    HostBinding('class.shadow'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], ShiftItemComponent.prototype, "_hasShadowClass", null);
__decorate([
    HostBinding('class.btn-outline-secondary'),
    HostBinding('class.border-left-0'),
    HostBinding('class.border-right-0'),
    HostBinding('class.o-hidden'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], ShiftItemComponent.prototype, "_isMobile", null);
__decorate([
    HostBinding('class.highlighted'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], ShiftItemComponent.prototype, "_hasHighlightedClass", null);
__decorate([
    HostBinding('style.z-index'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], ShiftItemComponent.prototype, "_styleZIndex", null);
__decorate([
    HostBinding('class.is-in-the-past-bg'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], ShiftItemComponent.prototype, "isInThePast", null);
__decorate([
    HostBinding('style.left.px'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ShiftItemComponent.prototype, "_styleLeft", null);
__decorate([
    HostBinding('style.top.px'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ShiftItemComponent.prototype, "_styleTop", null);
__decorate([
    HostBinding('style.width.px'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ShiftItemComponent.prototype, "_styleWidth", null);
__decorate([
    HostBinding('style.height.px'),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], ShiftItemComponent.prototype, "_styleHeight", null);
__decorate([
    HostBinding('class.max-width-600'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], ShiftItemComponent.prototype, "_hasClassMaxWidth600", null);
__decorate([
    HostBinding('class.m-0'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], ShiftItemComponent.prototype, "_hasClassM0", null);
__decorate([
    HostBinding('style.border-color'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], ShiftItemComponent.prototype, "_borderColor", null);
__decorate([
    HostBinding('class.wiggle'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], ShiftItemComponent.prototype, "_hasWiggleClass", null);
__decorate([
    HostListener('click', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MouseEvent]),
    __metadata("design:returntype", void 0)
], ShiftItemComponent.prototype, "_onClickShift", null);
__decorate([
    Input('showAsList'),
    __metadata("design:type", Boolean)
], ShiftItemComponent.prototype, "_showAsList", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftItemComponent.prototype, "shift", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftItemComponent.prototype, "emptyMemberSlots", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], ShiftItemComponent.prototype, "viewStyle", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftItemComponent.prototype, "selectable", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_k = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _k : Object)
], ShiftItemComponent.prototype, "selectedChange", void 0);
__decorate([
    Input('showCourseInfo'),
    __metadata("design:type", Object)
], ShiftItemComponent.prototype, "_showCourseInfo", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_l = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _l : Object)
], ShiftItemComponent.prototype, "onClick", void 0);
ShiftItemComponent = __decorate([
    Component({
        selector: 'p-shift-item[shift]',
        templateUrl: './shift-item.component.html',
        styleUrls: ['./shift-item.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, typeof (_b = typeof Router !== "undefined" && Router) === "function" ? _b : Object, typeof (_c = typeof MeService !== "undefined" && MeService) === "function" ? _c : Object, CalenderTimelineLayoutService, typeof (_d = typeof HighlightService !== "undefined" && HighlightService) === "function" ? _d : Object, SchedulingService, typeof (_e = typeof AbsenceService !== "undefined" && AbsenceService) === "function" ? _e : Object, typeof (_f = typeof RightsService !== "undefined" && RightsService) === "function" ? _f : Object, PWishesService,
        CourseFilterService, typeof (_g = typeof PShiftExchangeService !== "undefined" && PShiftExchangeService) === "function" ? _g : Object, typeof (_h = typeof PMomentService !== "undefined" && PMomentService) === "function" ? _h : Object])
], ShiftItemComponent);
export { ShiftItemComponent };
//# sourceMappingURL=shift-item.component.js.map