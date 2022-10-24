var _a, _b, _c, _d, _e;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { SLIDE_HORIZONTAL_ON_NGIF_TRIGGER } from '@plano/animations';
import { RightsService } from '@plano/client/accesscontrol/rights.service';
import { SchedulingApiShiftModels, SchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { FilterService } from '@plano/client/shared/filter.service';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { Data } from '@plano/shared/core/data/data';
import { PrimitiveDataInput } from '@plano/shared/core/data/primitive-data-input';
import { MeService } from '@plano/shared/core/me/me.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../shared/core/null-type-utils';
import { PButtonType } from '../../../p-forms/p-button/p-button.component';
import { PSidebarService } from '../../p-sidebar.service';
import { CollapsedShiftmodelsService } from '../collapsed-shiftmodel-parents.service';
let PSidebarShiftModelsComponent = class PSidebarShiftModelsComponent {
    constructor(rightsService, localize, me, router, filterService, highlightService, collapsedShiftmodelsService, api, pSidebarService) {
        this.rightsService = rightsService;
        this.localize = localize;
        this.me = me;
        this.router = router;
        this.filterService = filterService;
        this.highlightService = highlightService;
        this.collapsedShiftmodelsService = collapsedShiftmodelsService;
        this.api = api;
        this.pSidebarService = pSidebarService;
        this.isLoading = false;
        this.onSelectRelatedShifts = new EventEmitter();
        this._alwaysTrue = true;
        this.hideMultiSelectBtn = true;
        this.searchIsActive = true;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.BootstrapSize = BootstrapSize;
        this.PThemeEnum = PThemeEnum;
        this.PBtnThemeEnum = PBtnThemeEnum;
        this.PApiPrimitiveTypes = PApiPrimitiveTypes;
        this.PButtonType = PButtonType;
        this._groupedShiftModelsForList = new Data(this.api, this.filterService, new PrimitiveDataInput(() => this.searchTerm));
        this._groupedSearchedShiftModelsForList = [];
    }
    /** @see PSidebarService['editShiftModelListItemsMode'] */
    get editListItemsMode() {
        return this.pSidebarService.editShiftModelListItemsMode;
    }
    set editListItemsMode(input) {
        this.pSidebarService.editShiftModelListItemsMode = input;
    }
    /** @see PSidebarService['filterShiftModelsModeActive'] */
    get editFilterModeActive() {
        return this.pSidebarService.filterShiftModelsModeActive;
    }
    set editFilterModeActive(input) {
        this.pSidebarService.filterShiftModelsModeActive = input;
    }
    /** @see PSidebarService['shiftModelSearchTerm'] */
    get searchTerm() {
        return this.pSidebarService.shiftModelSearchTerm;
    }
    set searchTerm(input) {
        this.pSidebarService.shiftModelSearchTerm = input;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get editButtonTitle() {
        if (this.rightsService.userCanWriteAnyShiftModel)
            return this.localize.transform('Bearbeiten');
        return this.localize.transform('Tätigkeitsdetails');
    }
    /**
     * Should the edit button be visible?
     */
    get showAddButton() {
        return !!this.rightsService.isOwner;
    }
    /**
     * Open Modal for specific shiftModel
     */
    showDetails(item) {
        if (item) {
            this.router.navigate([`/client/shiftmodel/${item.id.toString()}`]);
        }
        else {
            this.router.navigate(['/client/shiftmodel/']);
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get filterIsActive() {
        if (this.isLoading)
            return undefined;
        if (this.filterService.isVisible(this.shiftModels))
            return false;
        return true;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get itemsFilterTitle() {
        if (this.isLoading)
            return null;
        if (this.shiftModels.length &&
            this.filterService.isHideShiftModels(this.shiftModels))
            return this.localize.transform('Alles per Filter ausgeblendet');
        const unTrashedItems = this.shiftModels.filterBy(item => !item.trashed);
        let counter = 0;
        for (const shiftModel of unTrashedItems.iterable()) {
            if (!this.filterService.isVisible(shiftModel))
                counter++;
        }
        const text = this.localize.transform('Ausgeblendet: ${counter} von ${amount}', { counter: counter.toString(), amount: unTrashedItems.length.toString() });
        return `<span>${text}</span>`;
    }
    /** @see SidebarApiListWrapperItemInterface['allItemsAreHiddenBecauseOfFilterSettings'] */
    get allItemsAreHiddenBecauseOfFilterSettings() {
        const ITEMS = this.shiftModels.filterBy(item => !item.trashed);
        if (!ITEMS.length)
            return false;
        if (!this.filterService.isHideShiftModels(ITEMS))
            return false;
        return true;
    }
    /**
     * Returns all searched items. If search is not active, returns all given items.
     */
    get searchedShiftModels() {
        return this.shiftModels.search(this.searchTerm);
    }
    // NOTE: PLANO-9873 direct binding of groupByParentName would cause problems
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get groupedShiftModelsForList() {
        if (!!this.searchTerm) {
            if (this.previousSearchTerm !== this.searchTerm) {
                this.previousSearchTerm = this.searchTerm;
                this._groupedSearchedShiftModelsForList = this.searchedShiftModels.filterBy(shiftModel => !shiftModel.trashed).groupByParentName;
            }
            return this._groupedSearchedShiftModelsForList;
        }
        this.previousSearchTerm = undefined;
        return this._groupedShiftModelsForList.get(() => {
            return this.shiftModels.filterBy(shiftModel => !shiftModel.trashed).groupByParentName;
        });
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    showHeadline(shiftModels) {
        if (this.editFilterModeActive)
            return true;
        if (!shiftModels.hasUntrashedItem)
            return false;
        if (this.filterService.isVisible(shiftModels))
            return true;
        if (this.filterService.someShiftModelsAreVisible(shiftModels))
            return true;
        return false;
    }
    /**
     * Check if this item should be visible in ui or not.
     */
    isVisible(input) {
        return this.filterService.isVisible(input);
    }
    /**
     * Check if this shiftmodel should be visible in ui or not.
     */
    isVisibleItem(input) {
        return this.isVisible(input);
    }
    /**
     * Check if these shiftmodels should be visible in ui or not.
     */
    isVisibleItems(input) {
        return this.isVisible(input);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    isCollapsed(parentName) {
        return !this.collapsedShiftmodelsService.isVisible(parentName);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    toggleList(parentName) {
        this.collapsedShiftmodelsService.toggleItem(parentName);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onClickFilterParent(event, shiftModels) {
        event.stopPropagation();
        this.filterService.toggleShiftModels(shiftModels);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    translatedListHeadlineText(shiftModels) {
        const shiftModel = shiftModels.get(0);
        assumeDefinedToGetStrictNullChecksRunning(shiftModel, 'shiftModel');
        if (!shiftModel.parentName)
            return this.localize.transform('Sonstige');
        return shiftModel.parentName;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get noItemsAvailable() {
        return !this.shiftModels.hasUntrashedItem;
    }
    /** @see SidebarApiListWrapperItemInterface['showAllItemsFilteredHint'] */
    get showAllItemsFilteredHint() {
        return !this.editFilterModeActive && this.allItemsAreHiddenBecauseOfFilterSettings;
    }
    /** @see SidebarApiListWrapperItemInterface['showSomeItemsFilteredHint'] */
    get showSomeItemsFilteredHint() {
        if (this.showAllItemsFilteredHint)
            return false;
        return !!this.searchTerm && !this.editFilterModeActive && !!this.filterService.hiddenItemsCount(this.searchedShiftModels);
    }
    /**
     * Sort shiftmodels.
     */
    getShiftModelsSorted(input) {
        return input.iterableSortedBy('name');
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PSidebarShiftModelsComponent.prototype, "isLoading", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_d = typeof SchedulingApiShiftModels !== "undefined" && SchedulingApiShiftModels) === "function" ? _d : Object)
], PSidebarShiftModelsComponent.prototype, "shiftModels", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_e = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _e : Object)
], PSidebarShiftModelsComponent.prototype, "onSelectRelatedShifts", void 0);
__decorate([
    HostBinding('class.d-flex'),
    HostBinding('class.flex-column'),
    __metadata("design:type", Object)
], PSidebarShiftModelsComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PSidebarShiftModelsComponent.prototype, "hideMultiSelectBtn", void 0);
PSidebarShiftModelsComponent = __decorate([
    Component({
        selector: 'p-sidebar-shiftmodels[shiftModels]',
        templateUrl: './sidebar-shiftmodels.component.html',
        styleUrls: ['./sidebar-shiftmodels.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        animations: [SLIDE_HORIZONTAL_ON_NGIF_TRIGGER],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof RightsService !== "undefined" && RightsService) === "function" ? _a : Object, LocalizePipe,
        MeService, typeof (_b = typeof Router !== "undefined" && Router) === "function" ? _b : Object, FilterService,
        HighlightService,
        CollapsedShiftmodelsService, typeof (_c = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _c : Object, PSidebarService])
], PSidebarShiftModelsComponent);
export { PSidebarShiftModelsComponent };
//# sourceMappingURL=sidebar-shiftmodels.component.js.map