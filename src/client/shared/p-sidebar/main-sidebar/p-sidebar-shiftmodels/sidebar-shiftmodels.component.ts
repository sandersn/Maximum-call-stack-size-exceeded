import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { SLIDE_HORIZONTAL_ON_NGIF_TRIGGER } from '@plano/animations';
import { RightsService } from '@plano/client/accesscontrol/rights.service';
import { SchedulingApiShiftModel} from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { SchedulingApiShiftModels, SchedulingApiService } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { FilterItem } from '@plano/client/shared/filter.service';
import { FilterService } from '@plano/client/shared/filter.service';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { Data } from '@plano/shared/core/data/data';
import { PrimitiveDataInput } from '@plano/shared/core/data/primitive-data-input';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { MeService } from '@plano/shared/core/me/me.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../shared/core/null-type-utils';
import { PButtonType } from '../../../p-forms/p-button/p-button.component';
import { PSidebarService } from '../../p-sidebar.service';
import { SidebarApiListWrapperItemInterface } from '../../p-sidebar.types';
import { CollapsedShiftmodelsService } from '../collapsed-shiftmodel-parents.service';

@Component({
	selector: 'p-sidebar-shiftmodels[shiftModels]',
	templateUrl: './sidebar-shiftmodels.component.html',
	styleUrls: ['./sidebar-shiftmodels.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	animations: [ SLIDE_HORIZONTAL_ON_NGIF_TRIGGER ],
})

export class PSidebarShiftModelsComponent implements SidebarApiListWrapperItemInterface<SchedulingApiShiftModel> {
	@Input() public isLoading : PComponentInterface['isLoading'] = false;
	@Input() public shiftModels ! : SchedulingApiShiftModels;
	@Output() public onSelectRelatedShifts : EventEmitter<SchedulingApiShiftModel> = new EventEmitter<SchedulingApiShiftModel>();

	@HostBinding('class.d-flex')
	@HostBinding('class.flex-column') private _alwaysTrue = true;

	@Input() public hideMultiSelectBtn : boolean = true;

	public searchIsActive = true;

	constructor(
		public rightsService : RightsService,
		private localize : LocalizePipe,
		public me : MeService,
		private router : Router,
		public filterService : FilterService,
		public highlightService : HighlightService,
		private collapsedShiftmodelsService : CollapsedShiftmodelsService,
		private api : SchedulingApiService,
		public pSidebarService : PSidebarService,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;
	public BootstrapSize = BootstrapSize;
	public PThemeEnum = PThemeEnum;
	public PBtnThemeEnum = PBtnThemeEnum;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;
	public PButtonType = PButtonType;

	/** @see PSidebarService['editShiftModelListItemsMode'] */
	public get editListItemsMode() : boolean | null {
		return this.pSidebarService.editShiftModelListItemsMode;
	}
	public set editListItemsMode(input : boolean | null) {
		this.pSidebarService.editShiftModelListItemsMode = input;
	}

	/** @see PSidebarService['filterShiftModelsModeActive'] */
	public get editFilterModeActive() : boolean | null {
		return this.pSidebarService.filterShiftModelsModeActive;
	}
	public set editFilterModeActive(input : boolean | null) {
		this.pSidebarService.filterShiftModelsModeActive = input;
	}

	/** @see PSidebarService['shiftModelSearchTerm'] */
	public get searchTerm() : string | null {
		return this.pSidebarService.shiftModelSearchTerm;
	}
	public set searchTerm(input : string | null) {
		this.pSidebarService.shiftModelSearchTerm = input;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get editButtonTitle() : string {
		if (this.rightsService.userCanWriteAnyShiftModel) return this.localize.transform('Bearbeiten');
		return this.localize.transform('Tätigkeitsdetails');
	}

	/**
	 * Should the edit button be visible?
	 */
	public get showAddButton() : boolean {
		return !!this.rightsService.isOwner;
	}

	/**
	 * Open Modal for specific shiftModel
	 */
	public showDetails(item : SchedulingApiShiftModel | null) : void {
		if (item) {
			this.router.navigate([`/client/shiftmodel/${item.id.toString()}`]);
		} else {
			this.router.navigate(['/client/shiftmodel/']);
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get filterIsActive() : SidebarApiListWrapperItemInterface<unknown>['filterIsActive'] {
		if (this.isLoading) return undefined;

		if (this.filterService.isVisible(this.shiftModels)) return false;
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get itemsFilterTitle() : SidebarApiListWrapperItemInterface<unknown>['itemsFilterTitle'] {
		if (this.isLoading) return null;

		if (
			this.shiftModels.length &&
			this.filterService.isHideShiftModels(this.shiftModels)
		) return this.localize.transform('Alles per Filter ausgeblendet');
		const unTrashedItems = this.shiftModels.filterBy(item => !item.trashed);

		let counter = 0;
		for (const shiftModel of unTrashedItems.iterable()) {
			if (!this.filterService.isVisible(shiftModel)) counter++;
		}
		const text : string = this.localize.transform('Ausgeblendet: ${counter} von ${amount}', { counter: counter.toString(), amount: unTrashedItems.length.toString() });
		return `<span>${text}</span>`;
	}

	/** @see SidebarApiListWrapperItemInterface['allItemsAreHiddenBecauseOfFilterSettings'] */
	public get allItemsAreHiddenBecauseOfFilterSettings() : boolean {
		const ITEMS = this.shiftModels.filterBy(item => !item.trashed);
		if (!ITEMS.length) return false;
		if (!this.filterService.isHideShiftModels(ITEMS)) return false;
		return true;
	}

	/**
	 * Returns all searched items. If search is not active, returns all given items.
	 */
	public get searchedShiftModels() : SchedulingApiShiftModels {
		return this.shiftModels.search(this.searchTerm);
	}

	private previousSearchTerm : string | undefined;

	private _groupedShiftModelsForList : Data<SchedulingApiShiftModels[]> = new Data<SchedulingApiShiftModels[]>(
		this.api,
		this.filterService,
		new PrimitiveDataInput<string>(() => this.searchTerm!),
	);

	private _groupedSearchedShiftModelsForList : SchedulingApiShiftModels[] = [];

	// NOTE: PLANO-9873 direct binding of groupByParentName would cause problems
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get groupedShiftModelsForList() : SchedulingApiShiftModels[] {
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
	public showHeadline(shiftModels : SchedulingApiShiftModels) : boolean {
		if (this.editFilterModeActive) return true;
		if (!shiftModels.hasUntrashedItem) return false;
		if (this.filterService.isVisible(shiftModels)) return true;
		if (this.filterService.someShiftModelsAreVisible(shiftModels)) return true;

		return false;
	}

	/**
	 * Check if this item should be visible in ui or not.
	 */
	private isVisible(input : FilterItem) : boolean {
		return this.filterService.isVisible(input);
	}

	/**
	 * Check if this shiftmodel should be visible in ui or not.
	 */
	public isVisibleItem(input : SchedulingApiShiftModel) : boolean {
		return this.isVisible(input);
	}

	/**
	 * Check if these shiftmodels should be visible in ui or not.
	 */
	public isVisibleItems(input : SchedulingApiShiftModels) : boolean {
		return this.isVisible(input);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public isCollapsed(parentName : string) : boolean {
		return !this.collapsedShiftmodelsService.isVisible(parentName);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public toggleList(parentName : string) : void {
		this.collapsedShiftmodelsService.toggleItem(parentName);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onClickFilterParent(event : Event, shiftModels : SchedulingApiShiftModels) : void {
		event.stopPropagation();
		this.filterService.toggleShiftModels(shiftModels);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public translatedListHeadlineText(shiftModels : SchedulingApiShiftModels) : string {
		const shiftModel = shiftModels.get(0);
		assumeDefinedToGetStrictNullChecksRunning(shiftModel, 'shiftModel');
		if (!shiftModel.parentName) return this.localize.transform('Sonstige');
		return shiftModel.parentName;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get noItemsAvailable() : boolean {
		return !this.shiftModels.hasUntrashedItem;
	}

	/** @see SidebarApiListWrapperItemInterface['showAllItemsFilteredHint'] */
	public get showAllItemsFilteredHint() : boolean {
		return !this.editFilterModeActive && this.allItemsAreHiddenBecauseOfFilterSettings;
	}

	/** @see SidebarApiListWrapperItemInterface['showSomeItemsFilteredHint'] */
	public get showSomeItemsFilteredHint() : boolean {
		if (this.showAllItemsFilteredHint) return false;
		return !!this.searchTerm && !this.editFilterModeActive && !!this.filterService.hiddenItemsCount(this.searchedShiftModels);
	}

	/**
	 * Sort shiftmodels.
	 */
	public getShiftModelsSorted(input : SchedulingApiShiftModels) : SchedulingApiShiftModel[] {
		return input.iterableSortedBy('name');
	}
}
