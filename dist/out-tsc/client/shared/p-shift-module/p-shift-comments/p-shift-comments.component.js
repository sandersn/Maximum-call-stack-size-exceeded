var _a, _b, _c;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FilterService } from '@plano/client/shared/filter.service';
import { SchedulingApiTodaysShiftDescriptions, SchedulingApiShifts } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
let PShiftCommentsComponent = class PShiftCommentsComponent {
    constructor(me, api, filterService, rightsService) {
        this.me = me;
        this.api = api;
        this.filterService = filterService;
        this.rightsService = rightsService;
        this.showAllDescriptions = false;
        this.date = null;
        this.shiftsForList = new SchedulingApiShifts(null, false);
        this.PlanoFaIconPool = PlanoFaIconPool;
    }
    ngOnInit() {
        this.showAllDescriptions = !this.isForDesk;
    }
    get isForDesk() {
        return !this.date;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get shiftDescriptionsForList() {
        if (this.date || !this.api.isLoaded())
            return new SchedulingApiTodaysShiftDescriptions(null, false);
        return this.api.data.todaysShiftDescriptions.filterBy((item) => {
            return this.filterService.isVisible(item);
        });
    }
    /**
     * get shifts for this day for current user
     */
    get shiftDescriptionsForMember() {
        if (!this.api.isLoaded())
            return new SchedulingApiTodaysShiftDescriptions(null, false);
        return this.shiftDescriptionsForList.filterBy((item) => {
            return this.shiftIsForMe(item);
        });
    }
    /**
     * get shifts for this day for current user
     */
    get shiftsForMember() {
        if (!this.api.isLoaded())
            return new SchedulingApiShifts(null, false);
        return this.shiftsForList.filterBy((item) => {
            return item.assignedMemberIds.contains(this.me.data.id);
        });
    }
    /**
     * get visible descriptions
     */
    get visibleDescriptions() {
        if (!this.api.isLoaded())
            return new SchedulingApiTodaysShiftDescriptions(null, false);
        if (this.showAllDescriptions)
            return this.shiftDescriptionsForList;
        return this.shiftDescriptionsForMember;
    }
    /**
     * Check if the shift comment of this shift is relevant for me
     * This can also be used in the template to highlight shift comments that are relevant for the user
     */
    shiftIsForMe(input) {
        return input.isRequesterAssigned;
    }
    /**
     * Check if that day has more shift comments than the comments for current user
     * @returns difference
     */
    get hasMoreComments() {
        if (this.isForDesk) {
            return this.shiftDescriptionsForList.length - this.shiftDescriptionsForMember.length;
        }
        return this.shiftsForList.length - this.shiftsForMember.length;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isAdmin() {
        return this.me.data.isOwner;
    }
    /**
     * Should all shift-comments be visible? Is not, only the shift-comments for members shifts are visible.
     */
    onToggleShowAll() {
        this.showAllDescriptions = !this.showAllDescriptions;
    }
    /**
     * Check if user can edit this items comment
     */
    userCanWrite(item) {
        return this.rightsService.userCanWrite(item);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftCommentsComponent.prototype, "date", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_c = typeof SchedulingApiShifts !== "undefined" && SchedulingApiShifts) === "function" ? _c : Object)
], PShiftCommentsComponent.prototype, "shiftsForList", void 0);
PShiftCommentsComponent = __decorate([
    Component({
        selector: 'p-shift-comments',
        templateUrl: './p-shift-comments.component.html',
        styleUrls: ['./p-shift-comments.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [MeService, typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, FilterService, typeof (_b = typeof RightsService !== "undefined" && RightsService) === "function" ? _b : Object])
], PShiftCommentsComponent);
export { PShiftCommentsComponent };
//# sourceMappingURL=p-shift-comments.component.js.map