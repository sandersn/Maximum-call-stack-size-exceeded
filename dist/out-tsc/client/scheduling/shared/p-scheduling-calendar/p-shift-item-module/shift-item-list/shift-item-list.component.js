var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
import { __decorate, __metadata } from "tslib";
import { NgxPopperjsContentComponent, NgxPopperjsPlacements, NgxPopperjsTriggers } from 'ngx-popperjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, Input, ViewChild, TemplateRef, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { PWishesService } from '@plano/client/scheduling/wishes.service';
import { NgbFormatsService } from '@plano/client/service/ngbformats.service';
import { BootstrapRounded, BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { AssignmentProcessesService } from '@plano/client/shared/p-sidebar/p-assignment-processes/assignment-processes.service';
import { SchedulingApiService, SchedulingApiMember } from '@plano/shared/api';
import { SchedulingApiShift } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiShiftExchanges } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { ShiftItemViewStyles } from './../shift-item/shift-item-styles';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../../shared/core/null-type-utils';
let ShiftItemListComponent = class ShiftItemListComponent {
    constructor(api, meService, ngbFormats, highlightService, assignmentProcessesService, rightsService, schedulingService, wishesService) {
        this.api = api;
        this.meService = meService;
        this.ngbFormats = ngbFormats;
        this.highlightService = highlightService;
        this.assignmentProcessesService = assignmentProcessesService;
        this.rightsService = rightsService;
        this.schedulingService = schedulingService;
        this.wishesService = wishesService;
        this._isLoading = false;
        this.readMode = false;
        this.states = SchedulingApiAssignmentProcessState;
        this.muteItem = false;
        this.shiftIsSelectable = false;
        this.selectable = false;
        this.selectedChange = new EventEmitter();
        this.process = null;
        this.meIsAssignable = false;
        this.showAssignMeButton = false;
        this.showMultiSelectCheckbox = false;
        this.showProcessStatusIcon = false;
        this.assignedMembers = null;
        this.ShiftItemViewStyles = ShiftItemViewStyles;
        this.viewStyle = ShiftItemViewStyles.SMALL;
        this.onClick = new EventEmitter();
        this.CONFIG = Config;
        this.ngUnsubscribe = new Subject();
        /**
         * Open details of shift
         */
        this.onClickEdit = new EventEmitter();
        this.isInThePast = false;
        this.NgxPopperjsTriggers = NgxPopperjsTriggers;
        this.BootstrapSize = BootstrapSize;
        this.NgxPopperjsPlacements = NgxPopperjsPlacements;
        this.BootstrapRounded = BootstrapRounded;
        this.icons = PlanoFaIconPool;
        this.subscription = null;
        // update tooltip visibility
        this.subscription = this.highlightService.onChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            const highlighted = this.highlightService.isHighlighted(this.shift);
            assumeDefinedToGetStrictNullChecksRunning(this.popperContent, 'popperContent');
            const tooltipVisible = this.popperContent.displayType !== 'none';
            if (highlighted && !tooltipVisible) {
                this.popperContent.show();
            }
            else if (!highlighted && tooltipVisible) {
                this.popperContent.hide();
            }
        });
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isLoading() {
        return this._isLoading;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get name() {
        if (this.isLoading)
            return null;
        return this.shift.model.attributeInfoName.value;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get start() {
        if (this.isLoading)
            return null;
        return this.shift.start;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get end() {
        if (this.isLoading)
            return null;
        return this.shift.end;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get hasIllnessShiftExchanges() {
        if (this.isLoading)
            return undefined;
        return !!this.illnessShiftExchanges.length;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get illnessShiftExchanges() {
        if (this.isLoading)
            return new SchedulingApiShiftExchanges(null, false);
        return this.shiftExchanges.filterBy(item => {
            if (!item.isIllness)
                return false;
            // Only get the items where the illness is confirmed.
            if (this.shift.assignedMemberIds.contains(item.indisposedMemberId))
                return false;
            return true;
        });
    }
    get shiftExchanges() {
        if (this.isLoading)
            return new SchedulingApiShiftExchanges(null, false);
        return this.api.data.shiftExchanges.filterBy(item => item.shiftRefs.contains(this.shift.id));
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    onCloseShiftTooltip(event, popperContent) {
        if (Config.IS_MOBILE)
            return;
        popperContent.hide();
        // a click on the calendar removes the highlightedShift.
        event.stopPropagation();
        if (
        // this.viewStyle !== shiftItemViewStyles.button &&
        this.viewStyle !== ShiftItemViewStyles.MEDIUM) {
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
    ngOnDestroy() {
        var _a;
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        (_a = this.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
    // TODO: needs to be excluded in a own service?
    /**
     * Get a title of the related process
     */
    processTitleForState(process) {
        if (this.isLoading)
            return null;
        const state = process.state !== SchedulingApiAssignmentProcessState.NEEDING_APPROVAL ? process.state : SchedulingApiAssignmentProcessState.APPROVE;
        return this.assignmentProcessesService.getDescription(state, this.rightsService.userCanEditAssignmentProcess(process));
    }
    /**
     * Check if user can edit this shift
     */
    get userCanWrite() {
        if (this.isLoading)
            return undefined;
        return this.rightsService.userCanWrite(this.shift);
    }
    /**
     * Check if user can read this shift
     */
    get userCanRead() {
        if (this.isLoading)
            return null;
        return this.rightsService.userCanRead(this.shift.model);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get memberIsHighlighted() {
        if (!this.highlightService.highlightedItem)
            return false;
        if (!(this.highlightService.highlightedItem instanceof SchedulingApiMember))
            return false;
        return true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showWishesIconForMember() {
        if (this.isLoading)
            return undefined;
        if (!this.meService.isLoaded())
            return false;
        if (!this.memberIsHighlighted)
            return false;
        if (!this.meService.data.isOwner &&
            // me has no right to write this shift
            !this.rightsService.userCanWrite(this.shift) &&
            // me is not highlighted
            !this.meService.data.id.equals(this.highlightService.highlightedItem.id))
            return false;
        if (!this.highlightService.showWishIcon(this.shift))
            return false;
        return true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get multiSelectIsPossible() {
        // Shift-Related rules
        if (!this.selectable)
            return false;
        // if (this.viewStyle === shiftItemViewStyles.button) return false;
        // Environment-Related rules
        return (!Config.IS_MOBILE || !!this.showMultiSelectCheckbox);
    }
};
__decorate([
    Input('isLoading'),
    __metadata("design:type", Object)
], ShiftItemListComponent.prototype, "_isLoading", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftItemListComponent.prototype, "readMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_g = typeof TemplateRef !== "undefined" && TemplateRef) === "function" ? _g : Object)
], ShiftItemListComponent.prototype, "processStatusIconTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_h = typeof TemplateRef !== "undefined" && TemplateRef) === "function" ? _h : Object)
], ShiftItemListComponent.prototype, "memberBadgesTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_j = typeof TemplateRef !== "undefined" && TemplateRef) === "function" ? _j : Object)
], ShiftItemListComponent.prototype, "quickAssignmentTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_k = typeof TemplateRef !== "undefined" && TemplateRef) === "function" ? _k : Object)
], ShiftItemListComponent.prototype, "shiftExchangeIconsTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_l = typeof TemplateRef !== "undefined" && TemplateRef) === "function" ? _l : Object)
], ShiftItemListComponent.prototype, "linkedCourseInfoTemplate", void 0);
__decorate([
    ViewChild('tooltipRef', { static: true }),
    __metadata("design:type", typeof (_m = typeof NgxPopperjsContentComponent !== "undefined" && NgxPopperjsContentComponent) === "function" ? _m : Object)
], ShiftItemListComponent.prototype, "popperContent", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftItemListComponent.prototype, "muteItem", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftItemListComponent.prototype, "shiftIsSelectable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftItemListComponent.prototype, "selectable", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_o = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _o : Object)
], ShiftItemListComponent.prototype, "selectedChange", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftItemListComponent.prototype, "process", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftItemListComponent.prototype, "meIsAssignable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftItemListComponent.prototype, "showAssignMeButton", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftItemListComponent.prototype, "showMultiSelectCheckbox", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftItemListComponent.prototype, "showProcessStatusIcon", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftItemListComponent.prototype, "showCourseInfo", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_q = typeof SchedulingApiShift !== "undefined" && SchedulingApiShift) === "function" ? _q : Object)
], ShiftItemListComponent.prototype, "shift", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftItemListComponent.prototype, "assignedMembers", void 0);
__decorate([
    Input(),
    __metadata("design:type", String)
], ShiftItemListComponent.prototype, "viewStyle", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_s = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _s : Object)
], ShiftItemListComponent.prototype, "onClick", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_t = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _t : Object)
], ShiftItemListComponent.prototype, "onClickEdit", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftItemListComponent.prototype, "isInThePast", void 0);
ShiftItemListComponent = __decorate([
    Component({
        selector: 'p-shift-item-list[shift][showCourseInfo][processStatusIconTemplate][memberBadgesTemplate][quickAssignmentTemplate][shiftExchangeIconsTemplate][linkedCourseInfoTemplate]',
        templateUrl: './shift-item-list.component.html',
        styleUrls: ['./shift-item-list.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, typeof (_b = typeof MeService !== "undefined" && MeService) === "function" ? _b : Object, typeof (_c = typeof NgbFormatsService !== "undefined" && NgbFormatsService) === "function" ? _c : Object, typeof (_d = typeof HighlightService !== "undefined" && HighlightService) === "function" ? _d : Object, typeof (_e = typeof AssignmentProcessesService !== "undefined" && AssignmentProcessesService) === "function" ? _e : Object, typeof (_f = typeof RightsService !== "undefined" && RightsService) === "function" ? _f : Object, SchedulingService,
        PWishesService])
], ShiftItemListComponent);
export { ShiftItemListComponent };
//# sourceMappingURL=shift-item-list.component.js.map