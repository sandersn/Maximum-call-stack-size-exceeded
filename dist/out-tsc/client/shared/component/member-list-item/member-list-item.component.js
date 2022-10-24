var _a, _b, _c, _d, _e, _f, _g;
import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { MeService, RightsService } from '@plano/shared/api';
import { SchedulingApiService, SchedulingApiShift } from '@plano/shared/api';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { FilterService } from '../../filter.service';
import { HighlightService } from '../../highlight.service';
import { PMomentService } from '../../p-moment.service';
import { PSidebarService } from '../../p-sidebar/p-sidebar.service';
let MemberListItemComponent = class MemberListItemComponent {
    constructor(api, me, pSidebarService, schedulingService, highlightService, filterService, router, rightsService, pMoment) {
        this.api = api;
        this.me = me;
        this.pSidebarService = pSidebarService;
        this.schedulingService = schedulingService;
        this.highlightService = highlightService;
        this.filterService = filterService;
        this.router = router;
        this.rightsService = rightsService;
        this.pMoment = pMoment;
        this._alwaysTrue = true;
        this.editFilterModeActive = false;
        this.editListItemsMode = false;
        this.hover = false;
        this.member = null;
        this.onItemClick = new EventEmitter();
        this.hideMultiSelectBtn = true;
        this.showExpectedEarnings = false;
        this.showExpectedEarningsDetails = false;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.onSelectInCalendarClick = new EventEmitter();
        this.now = +this.pMoment.m();
    }
    get hasId() {
        var _a;
        return `scroll-target-id-${(_a = this.member) === null || _a === void 0 ? void 0 : _a.id.toString()}`;
    }
    get _muteItem() {
        if (!this.member)
            return false;
        if (this.highlightService.isMuted(this.member))
            return true;
        return false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isMe() {
        var _a;
        return (_a = this.rightsService.isMe(this.member.id)) !== null && _a !== void 0 ? _a : null;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isOwner() {
        return this.rightsService.isOwner;
    }
    /**
     * Decide if the multi-select-checkbox should be visible or not
     */
    get showMultiSelectCheckbox() {
        if (this.hideMultiSelectBtn)
            return false;
        if (this.hover)
            return true;
        if (this.highlightService.isHighlighted(this.member))
            return true;
        if (this.member.selected)
            return true;
        if (this.api.data.members.hasSelectedItem)
            return true;
        // if (this.api.hasSelectedItems) return true;
        return false;
    }
    /**
     * Show details for specific member
     */
    showDetails() {
        if (this.member) {
            this.router.navigate([`/client/member/${this.member.id.toString()}`]);
        }
        else {
            this.router.navigate(['/client/member/']);
        }
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    selectInCalendar(event) {
        event.stopPropagation();
        this.onSelectInCalendarClick.emit(this.member.id);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showWishesIconForMember() {
        if (!this.me.isLoaded())
            return false;
        if (!(this.highlightService.highlightedItem instanceof SchedulingApiShift))
            return false;
        if (!this.isOwner &&
            // me has no right to write the highlighted shiftmodel
            !this.rightsService.userCanWrite(this.highlightService.highlightedItem) &&
            // this is me
            !this.isMe)
            return false;
        if (!this.highlightService.showWishIcon(this.member))
            return false;
        return true;
    }
    expectedMemberData(accountingPeriod) {
        return accountingPeriod.expectedMemberData.getByMember(this.member);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get expectedMemberData1() {
        return this.expectedMemberData(this.period1);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get expectedMemberData2() {
        return this.expectedMemberData(this.period2);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get period2() {
        if (this.api.data.accountingPeriods.length >= 2) {
            return this.api.data.accountingPeriods.get(1);
        }
        return this.api.data.accountingPeriods.get(0);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get period1() {
        return this.api.data.accountingPeriods.get(0);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showExpectedMemberData1() {
        if (!this.showExpectedEarnings)
            return false;
        if (!this.pSidebarService.isWorkloadMode)
            return false;
        if (!this.pSidebarService.showWorkload[0])
            return false;
        if (this.api.data.accountingPeriods.length <= 1)
            return false;
        if (!this.expectedMemberData1)
            return false;
        return true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showExpectedMemberData2() {
        if (!this.showExpectedEarnings)
            return false;
        if (!this.pSidebarService.isWorkloadMode)
            return false;
        if (!this.pSidebarService.showWorkload[1])
            return false;
        if (this.api.data.accountingPeriods.length < 1)
            return false;
        if (!this.expectedMemberData2)
            return false;
        return true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get affected() {
        var _a;
        return !!((_a = this.member) === null || _a === void 0 ? void 0 : _a.affected);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get selected() {
        var _a;
        return !!((_a = this.member) === null || _a === void 0 ? void 0 : _a.selected);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get hasOnItemClickBinding() {
        return this.onItemClick.observers.length > 0;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isVisible() {
        assumeDefinedToGetStrictNullChecksRunning(this.member, 'member');
        return this.filterService.isVisible(this.member);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    toggleItem() {
        this.filterService.toggleItem(this.member);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get bubbleDirection() {
        if (this.editFilterModeActive && this.editListItemsMode)
            return 'left';
        if (this.editFilterModeActive !== this.editListItemsMode)
            return 'center';
        if (!this.editFilterModeActive && !this.editListItemsMode)
            return 'right';
        return undefined;
    }
};
__decorate([
    HostBinding('id'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], MemberListItemComponent.prototype, "hasId", null);
__decorate([
    HostBinding('class.rounded'),
    __metadata("design:type", Object)
], MemberListItemComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    HostBinding('class.muted-item'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], MemberListItemComponent.prototype, "_muteItem", null);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], MemberListItemComponent.prototype, "editFilterModeActive", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], MemberListItemComponent.prototype, "editListItemsMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], MemberListItemComponent.prototype, "member", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_f = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _f : Object)
], MemberListItemComponent.prototype, "onItemClick", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], MemberListItemComponent.prototype, "hideMultiSelectBtn", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], MemberListItemComponent.prototype, "showExpectedEarnings", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_g = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _g : Object)
], MemberListItemComponent.prototype, "onSelectInCalendarClick", void 0);
MemberListItemComponent = __decorate([
    Component({
        selector: 'p-member-list-item',
        templateUrl: './member-list-item.component.html',
        styleUrls: ['./member-list-item.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, MeService,
        PSidebarService, typeof (_b = typeof SchedulingService !== "undefined" && SchedulingService) === "function" ? _b : Object, HighlightService,
        FilterService, typeof (_c = typeof Router !== "undefined" && Router) === "function" ? _c : Object, typeof (_d = typeof RightsService !== "undefined" && RightsService) === "function" ? _d : Object, PMomentService])
], MemberListItemComponent);
export { MemberListItemComponent };
//# sourceMappingURL=member-list-item.component.js.map