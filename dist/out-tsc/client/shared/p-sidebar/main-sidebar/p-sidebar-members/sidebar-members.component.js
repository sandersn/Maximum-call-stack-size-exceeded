var _a, _b, _c, _d, _e, _f;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { SLIDE_HORIZONTAL_ON_NGIF_TRIGGER } from '@plano/animations';
import { RightsService } from '@plano/client/accesscontrol/rights.service';
import { SchedulingApiMembers, SchedulingApiAccountingPeriods } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { PWishesService } from '@plano/client/scheduling/wishes.service';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { FilterService } from '@plano/client/shared/filter.service';
import { FormattedDateTimePipe } from '@plano/client/shared/formatted-date-time.pipe';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { PExportService } from '@plano/client/shared/p-export.service';
import { ExportMembersExcelApiService } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { MeService } from '@plano/shared/core/me/me.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PCurrencyPipe } from '@plano/shared/core/pipe/p-currency.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../shared/core/null-type-utils';
import { PCookieService } from '../../../../../shared/core/p-cookie.service';
import { PButtonType } from '../../../p-forms/p-button/p-button.component';
import { PSidebarService } from '../../p-sidebar.service';
let PSidebarMembersComponent = class PSidebarMembersComponent {
    constructor(rightsService, localize, me, router, filterService, pCurrencyPipe, pSidebarService, pWishesService, formattedDateTimePipe, highlightService, exportMembersApiService, pExportService, pCookieService) {
        this.rightsService = rightsService;
        this.localize = localize;
        this.me = me;
        this.router = router;
        this.filterService = filterService;
        this.pCurrencyPipe = pCurrencyPipe;
        this.pSidebarService = pSidebarService;
        this.pWishesService = pWishesService;
        this.formattedDateTimePipe = formattedDateTimePipe;
        this.highlightService = highlightService;
        this.exportMembersApiService = exportMembersApiService;
        this.pExportService = pExportService;
        this.pCookieService = pCookieService;
        this.isLoading = false;
        this.onSelectRelatedShifts = new EventEmitter();
        this._alwaysTrue = true;
        this.hideMultiSelectBtn = true;
        this.searchPopoverIsOpen = false;
        this.searchIsActive = true;
        this.BootstrapSize = BootstrapSize;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.PBtnThemeEnum = PBtnThemeEnum;
        this.PThemeEnum = PThemeEnum;
        this.PApiPrimitiveTypes = PApiPrimitiveTypes;
        this.PButtonType = PButtonType;
        this.membersForList = { trashed: null, untrashed: null };
        this.exportIsRunning = false;
    }
    /** @see PSidebarService['editMemberListItemsMode'] */
    get editListItemsMode() {
        return this.pSidebarService.editMemberListItemsMode;
    }
    set editListItemsMode(input) {
        this.pSidebarService.editMemberListItemsMode = input;
    }
    /** @see PSidebarService['filterMembersModeActive'] */
    get editFilterModeActive() {
        return this.pSidebarService.filterMembersModeActive;
    }
    set editFilterModeActive(input) {
        this.pSidebarService.filterMembersModeActive = input;
    }
    /** @see PSidebarService['memberSearchTerm'] */
    get searchTerm() {
        return this.pSidebarService.memberSearchTerm;
    }
    set searchTerm(input) {
        this.pSidebarService.memberSearchTerm = input;
    }
    /**
     * Get a translated text for the edit button
     */
    get editButtonTitle() {
        return this.localize.transform('Bearbeiten');
    }
    /**
     * Should the edit button be visible?
     */
    get showAddButton() {
        return !!this.rightsService.isOwner;
    }
    /**
     * Show details for specific member
     */
    showDetails(item) {
        if (item) {
            this.router.navigate([`/client/member/${item.id.toString()}`]);
        }
        else {
            this.router.navigate(['/client/member/']);
        }
    }
    /**
     * Returns all searched items. If search is not active, returns all given items.
     */
    get searchedMembers() {
        return this.members.search(this.searchTerm);
    }
    ngAfterContentChecked() {
        /** TODO: this is probably a performance issue */
        this.membersForList.untrashed = this.searchedMembers.filterBy(item => !item.trashed);
        /** TODO: this is probably a performance issue */
        this.membersForList.trashed = this.searchedMembers.filterBy(item => item.trashed);
    }
    /**
     * Array if sort fns for members
     */
    get sortByFns() {
        return [
            item => item.lastName,
            item => item.firstName,
        ];
    }
    /** @see SidebarApiListWrapperItemInterface['allItemsAreHiddenBecauseOfFilterSettings'] */
    get allItemsAreHiddenBecauseOfFilterSettings() {
        const ITEMS = this.members;
        if (!ITEMS.length)
            return false;
        if (!this.filterService.isHideAllMembers(ITEMS))
            return false;
        return true;
    }
    /**
     * Filter items by current ui settings and start a export download for them.
     */
    exportMembers() {
        // set members to be exported
        this.exportMembersApiService.setEmptyData();
        for (const member of this.members.iterable()) {
            if (this.filterService.isVisible(member)) {
                this.exportMembersApiService.data.memberIds.push(member.id);
            }
        }
        // download file
        this.exportIsRunning = true;
        const fileName = this.pExportService.getFileName(this.localize.transform('user_export'));
        this.exportMembersApiService.downloadFile(fileName, 'xlsx', null, 'PUT', () => {
            this.exportIsRunning = false;
        });
    }
    /**
     * Check if this item should be visible in ui or not.
     */
    isVisible(input) {
        return this.filterService.isVisible(input);
    }
    /**
     * Check if this member should be visible in ui or not.
     */
    isVisibleItem(input) {
        return this.isVisible(input);
    }
    /**
     * Check if these members should be visible in ui or not.
     */
    isVisibleItems(input) {
        return this.isVisible(input);
    }
    /**
     * Should this item be visible in the list?
     * Beware: this does not only mean, it is visible by filter
     */
    showThisMemberInList(member) {
        return !!member && (this.editFilterModeActive || this.isVisibleItem(member));
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get currencyIcon() {
        return this.pCurrencyPipe.getCurrencyIcon();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    allMembersIsAffected(members) {
        const someMembersAreVisible = !this.filterService.isHideAllMembers(members);
        const notAllMembersAreVisible = !this.filterService.isVisible(members);
        return someMembersAreVisible && notAllMembersAreVisible;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get filterIsActive() {
        if (this.isLoading)
            return false;
        if (this.filterService.isVisible(this.members))
            return false;
        return true;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get itemsFilterTitle() {
        if (this.isLoading)
            return null;
        if (this.members.length &&
            this.filterService.isHideAllMembers(this.members))
            return this.localize.transform('Alles per Filter ausgeblendet');
        let counter = 0;
        for (const member of this.members.iterable()) {
            if (!this.filterService.isVisible(member))
                counter++;
        }
        const text = this.localize.transform('Ausgeblendet: ${counter} von ${amount}', { counter: counter.toString(), amount: this.members.length.toString() });
        return `<span>${text}</span>`;
    }
    /** @see SidebarApiListWrapperItemInterface['showAllItemsFilteredHint'] */
    get showAllItemsFilteredHint() {
        return !this.editFilterModeActive && this.allItemsAreHiddenBecauseOfFilterSettings;
    }
    /** @see SidebarApiListWrapperItemInterface['showSomeItemsFilteredHint'] */
    get showSomeItemsFilteredHint() {
        if (this.showAllItemsFilteredHint)
            return false;
        return !!this.searchTerm && !this.editFilterModeActive && !!this.filterService.hiddenItemsCount(this.searchedMembers);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    showHeadline(members) {
        if (!members.length)
            return false;
        if (this.editFilterModeActive)
            return true;
        if (this.filterService.isVisible(members))
            return true;
        if (this.filterService.someMembersAreVisible(members))
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    translatedListHeadlineText(shiftModels) {
        const member = shiftModels.get(0);
        assumeDefinedToGetStrictNullChecksRunning(member, 'member');
        if (!member.trashed)
            return this.localize.transform('Aktive User');
        return this.localize.transform('Gelöschte User');
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    toggleList(type) {
        const cookieKeyData = {
            prefix: 'SidebarMemberComponent',
            name: type,
        };
        if (this.isCollapsed(type)) {
            return this.pCookieService.showSection(cookieKeyData);
        }
        return this.pCookieService.hideSection(cookieKeyData);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    isCollapsed(type) {
        // If there are no headlines to click, then there is nothing that can be collapsed.
        const userCanCollapseSections = this.showHeadline(this.membersForList.untrashed) && this.showHeadline(this.membersForList.trashed);
        if (!userCanCollapseSections)
            return false;
        const cookieKeyData = {
            prefix: 'SidebarMemberComponent',
            name: type,
        };
        return !this.pCookieService.sectionIsVisible(cookieKeyData, type === 'untrashed');
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PSidebarMembersComponent.prototype, "isLoading", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_d = typeof SchedulingApiMembers !== "undefined" && SchedulingApiMembers) === "function" ? _d : Object)
], PSidebarMembersComponent.prototype, "members", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_e = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _e : Object)
], PSidebarMembersComponent.prototype, "onSelectRelatedShifts", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_f = typeof SchedulingApiAccountingPeriods !== "undefined" && SchedulingApiAccountingPeriods) === "function" ? _f : Object)
], PSidebarMembersComponent.prototype, "accountingPeriods", void 0);
__decorate([
    HostBinding('class.d-flex'),
    HostBinding('class.flex-column'),
    __metadata("design:type", Object)
], PSidebarMembersComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PSidebarMembersComponent.prototype, "hideMultiSelectBtn", void 0);
PSidebarMembersComponent = __decorate([
    Component({
        selector: 'p-sidebar-members[members][accountingPeriods]',
        templateUrl: './sidebar-members.component.html',
        styleUrls: ['./sidebar-members.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        animations: [SLIDE_HORIZONTAL_ON_NGIF_TRIGGER],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof RightsService !== "undefined" && RightsService) === "function" ? _a : Object, LocalizePipe,
        MeService, typeof (_b = typeof Router !== "undefined" && Router) === "function" ? _b : Object, FilterService,
        PCurrencyPipe,
        PSidebarService, typeof (_c = typeof PWishesService !== "undefined" && PWishesService) === "function" ? _c : Object, FormattedDateTimePipe,
        HighlightService,
        ExportMembersExcelApiService,
        PExportService,
        PCookieService])
], PSidebarMembersComponent);
export { PSidebarMembersComponent };
//# sourceMappingURL=sidebar-members.component.js.map