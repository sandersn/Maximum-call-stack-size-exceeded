import { AfterContentChecked} from '@angular/core';
import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output, HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { SLIDE_HORIZONTAL_ON_NGIF_TRIGGER } from '@plano/animations';
import { RightsService } from '@plano/client/accesscontrol/rights.service';
import { SchedulingApiMember} from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { SchedulingApiMembers, SchedulingApiAccountingPeriods } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { PWishesService } from '@plano/client/scheduling/wishes.service';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { FilterItem } from '@plano/client/shared/filter.service';
import { FilterService } from '@plano/client/shared/filter.service';
import { FormattedDateTimePipe } from '@plano/client/shared/formatted-date-time.pipe';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { PExportService } from '@plano/client/shared/p-export.service';
import { ExportMembersExcelApiService } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { PFaIcon } from '@plano/shared/core/component/fa-icon/fa-icon-types';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { MeService } from '@plano/shared/core/me/me.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PCurrencyPipe } from '@plano/shared/core/pipe/p-currency.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../shared/core/null-type-utils';
import { PCookieService } from '../../../../../shared/core/p-cookie.service';
import { PButtonType } from '../../../p-forms/p-button/p-button.component';
import { PSidebarService } from '../../p-sidebar.service';
import { SidebarApiListWrapperItemInterface } from '../../p-sidebar.types';

@Component({
	selector: 'p-sidebar-members[members][accountingPeriods]',
	templateUrl: './sidebar-members.component.html',
	styleUrls: ['./sidebar-members.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	animations: [ SLIDE_HORIZONTAL_ON_NGIF_TRIGGER ],
})

export class PSidebarMembersComponent implements PComponentInterface, SidebarApiListWrapperItemInterface<SchedulingApiMember>, AfterContentChecked {

	@Input() public isLoading : PComponentInterface['isLoading'] = false;
	@Input() public members ! : SchedulingApiMembers;
	@Output() public onSelectRelatedShifts : EventEmitter<SchedulingApiMember> = new EventEmitter<SchedulingApiMember>();
	@Input() public accountingPeriods ! : SchedulingApiAccountingPeriods;

	@HostBinding('class.d-flex')
	@HostBinding('class.flex-column') private _alwaysTrue = true;

	@Input() public hideMultiSelectBtn : boolean = true;

	public searchPopoverIsOpen : boolean = false;
	public searchIsActive = true;

	constructor(
		public rightsService : RightsService,
		private localize : LocalizePipe,
		public me : MeService,
		private router : Router,
		public filterService : FilterService,
		private pCurrencyPipe : PCurrencyPipe,
		public pSidebarService : PSidebarService,
		public pWishesService : PWishesService,
		public formattedDateTimePipe : FormattedDateTimePipe,
		public highlightService : HighlightService,
		public exportMembersApiService : ExportMembersExcelApiService,
		private pExportService : PExportService,
		private pCookieService : PCookieService,
	) {
	}

	public BootstrapSize = BootstrapSize;
	public PlanoFaIconPool = PlanoFaIconPool;
	public PBtnThemeEnum = PBtnThemeEnum;
	public PThemeEnum = PThemeEnum;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;
	public PButtonType = PButtonType;

	/** @see PSidebarService['editMemberListItemsMode'] */
	public get editListItemsMode() : PSidebarService['editMemberListItemsMode'] {
		return this.pSidebarService.editMemberListItemsMode;
	}
	public set editListItemsMode(input : PSidebarService['editMemberListItemsMode']) {
		this.pSidebarService.editMemberListItemsMode = input;
	}

	/** @see PSidebarService['filterMembersModeActive'] */
	public get editFilterModeActive() : PSidebarService['filterMembersModeActive'] {
		return this.pSidebarService.filterMembersModeActive;
	}
	public set editFilterModeActive(input : PSidebarService['filterMembersModeActive']) {
		this.pSidebarService.filterMembersModeActive = input;
	}

	/** @see PSidebarService['memberSearchTerm'] */
	public get searchTerm() : PSidebarService['memberSearchTerm'] {
		return this.pSidebarService.memberSearchTerm;
	}
	public set searchTerm(input : PSidebarService['memberSearchTerm']) {
		this.pSidebarService.memberSearchTerm = input;
	}

	/**
	 * Get a translated text for the edit button
	 */
	public get editButtonTitle() : string {
		return this.localize.transform('Bearbeiten');
	}

	/**
	 * Should the edit button be visible?
	 */
	public get showAddButton() : boolean {
		return !!this.rightsService.isOwner;
	}

	/**
	 * Show details for specific member
	 */
	public showDetails(item : SchedulingApiMember | null) : void {
		if (item) {
			this.router.navigate([`/client/member/${item.id.toString()}`]);
		} else {
			this.router.navigate(['/client/member/']);
		}
	}

	/**
	 * Returns all searched items. If search is not active, returns all given items.
	 */
	public get searchedMembers() : SchedulingApiMembers {
		return this.members.search(this.searchTerm);
	}

	public membersForList : {
		trashed : SchedulingApiMembers,
		untrashed : SchedulingApiMembers,
	} = { trashed: null!, untrashed: null! };

	public ngAfterContentChecked() : void {

		/** TODO: this is probably a performance issue */
		this.membersForList.untrashed = this.searchedMembers.filterBy(item => !item.trashed);

		/** TODO: this is probably a performance issue */
		this.membersForList.trashed = this.searchedMembers.filterBy(item => item.trashed);
	}

	/**
	 * Array if sort fns for members
	 */
	public get sortByFns() : Parameters<SchedulingApiMembers['sortedBy']>[0] {
		return [
			item => item.lastName,
			item => item.firstName,
		];
	}

	/** @see SidebarApiListWrapperItemInterface['allItemsAreHiddenBecauseOfFilterSettings'] */
	public get allItemsAreHiddenBecauseOfFilterSettings() : boolean {
		const ITEMS = this.members;
		if (!ITEMS.length) return false;
		if (!this.filterService.isHideAllMembers(ITEMS)) return false;
		return true;
	}

	public exportIsRunning = false;

	/**
	 * Filter items by current ui settings and start a export download for them.
	 */
	public exportMembers() : void {
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
	private isVisible(input : FilterItem) : boolean {
		return this.filterService.isVisible(input);
	}

	/**
	 * Check if this member should be visible in ui or not.
	 */
	public isVisibleItem(input : SchedulingApiMember) : boolean {
		return this.isVisible(input);
	}

	/**
	 * Check if these members should be visible in ui or not.
	 */
	public isVisibleItems(input : SchedulingApiMembers) : boolean {
		return this.isVisible(input);
	}

	/**
	 * Should this item be visible in the list?
	 * Beware: this does not only mean, it is visible by filter
	 */
	public showThisMemberInList(member : SchedulingApiMember | null) : boolean {
		return !!member && (this.editFilterModeActive || this.isVisibleItem(member));
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get currencyIcon() : PFaIcon {
		return this.pCurrencyPipe.getCurrencyIcon();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public allMembersIsAffected(members : SchedulingApiMembers) : boolean {
		const someMembersAreVisible = !this.filterService.isHideAllMembers(members);
		const notAllMembersAreVisible = !this.filterService.isVisible(members);
		return someMembersAreVisible && notAllMembersAreVisible;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get filterIsActive() : boolean {
		if (this.isLoading) return false;

		if (this.filterService.isVisible(this.members)) return false;
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get itemsFilterTitle() : string | null {
		if (this.isLoading) return null;

		if (
			this.members.length &&
			this.filterService.isHideAllMembers(this.members)
		) return this.localize.transform('Alles per Filter ausgeblendet');

		let counter = 0;
		for (const member of this.members.iterable()) {
			if (!this.filterService.isVisible(member)) counter++;
		}
		const text : string = this.localize.transform('Ausgeblendet: ${counter} von ${amount}', { counter: counter.toString(), amount: this.members.length.toString() });
		return `<span>${text}</span>`;
	}

	/** @see SidebarApiListWrapperItemInterface['showAllItemsFilteredHint'] */
	public get showAllItemsFilteredHint() : boolean {
		return !this.editFilterModeActive && this.allItemsAreHiddenBecauseOfFilterSettings;
	}

	/** @see SidebarApiListWrapperItemInterface['showSomeItemsFilteredHint'] */
	public get showSomeItemsFilteredHint() : boolean {
		if (this.showAllItemsFilteredHint) return false;
		return !!this.searchTerm && !this.editFilterModeActive && !!this.filterService.hiddenItemsCount(this.searchedMembers);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public showHeadline(members : SchedulingApiMembers) : boolean {
		if (!members.length) return false;
		if (this.editFilterModeActive) return true;
		if (this.filterService.isVisible(members)) return true;
		if (this.filterService.someMembersAreVisible(members)) return true;

		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public translatedListHeadlineText(shiftModels : SchedulingApiMembers) : string {
		const member = shiftModels.get(0);
		assumeDefinedToGetStrictNullChecksRunning(member, 'member');
		if (!member.trashed) return this.localize.transform('Aktive User');
		return this.localize.transform('Gelöschte User');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public toggleList(type : 'untrashed' | 'trashed') : void {
		const cookieKeyData = {
			prefix : 'SidebarMemberComponent' as const,
			name : type,
		};
		if (this.isCollapsed(type)) {
			return this.pCookieService.showSection(cookieKeyData);
		}
		return this.pCookieService.hideSection(cookieKeyData);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public isCollapsed(type : 'untrashed' | 'trashed') : boolean {
		// If there are no headlines to click, then there is nothing that can be collapsed.
		const userCanCollapseSections = this.showHeadline(this.membersForList.untrashed) && this.showHeadline(this.membersForList.trashed);
		if (!userCanCollapseSections) return false;
		const cookieKeyData = {
			prefix : 'SidebarMemberComponent' as const,
			name : type,
		};
		return !this.pCookieService.sectionIsVisible(cookieKeyData, type === 'untrashed');
	}
}
