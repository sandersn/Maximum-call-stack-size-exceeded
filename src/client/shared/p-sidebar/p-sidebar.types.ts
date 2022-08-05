import { EventEmitter } from '@angular/core';
import { PSidebarService } from './p-sidebar.service';
import { PComponentInterface } from '../../../shared/core/interfaces/component.interface';
import { RightsService } from '../../accesscontrol/rights.service';

export enum SidebarTab {
	DESK,
	SHIFT_MODELS,
	MEMBERS,
}

export interface SidebarApiListWrapperItemInterface<T> extends PComponentInterface {
	searchIsActive : boolean;
	searchTerm : string | null;
	editFilterModeActive : boolean | null;
	editListItemsMode : boolean | null;
	editButtonTitle : string;
	rightsService : RightsService;
	showAddButton : boolean;
	showDetails : (item : T) => void;

	/**
	 * This checks if all items are hidden because of filter settings.
	 * If this returns true we could show a hint about this to the user.
	 */
	allItemsAreHiddenBecauseOfFilterSettings : boolean;

	/**
	 * Decides if the hint that some probably interesting items are invisible by filter settings, should be shown.
	 */
	showSomeItemsFilteredHint : boolean;

	/**
	 * Decides if the hint that all items are invisible by filter settings, should be shown.
	 */
	showAllItemsFilteredHint : boolean;

	isVisibleItem : (item : T) => boolean;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	isVisibleItems : (item : any) => boolean;
	onSelectRelatedShifts : EventEmitter<T>;
	itemsFilterTitle : string | null;
	filterIsActive : boolean | undefined;
	pSidebarService : PSidebarService;
}

export type PSidebarServiceCookieKeyDataType = {
	// TODO: remove `| null`
	prefix : 'PSidebarService' | null,
	name : (
		'mainSidebarIsCollapsed' |
		'isWorkloadMode' |
		'editMemberListItemsMode' |
		'editShiftModelListItemsMode' |
		'filterMembersModeActive' |
		'filterShiftModelsModeActive' |
		'memberSearchTerm' |
		'shiftModelSearchTerm'
	),
};
