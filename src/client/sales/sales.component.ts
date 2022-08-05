import { AfterContentInit} from '@angular/core';
import { Component, HostBinding } from '@angular/core';
import { SalesTabNames } from '@plano/client/sales/sales-tab-names.enum';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { MeService } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { SchedulingApiService } from '../scheduling/shared/api/scheduling-api.service';
import { BookingsService } from '../scheduling/shared/p-bookings/bookings.service';
import { PMomentService } from '../shared/p-moment.service';
import { PTabSizeEnum } from '../shared/p-tabs/p-tabs/p-tab/p-tab.component';
import { PTabsTheme } from '../shared/p-tabs/p-tabs/p-tabs.component';

@Component({
	selector: 'p-sales',
	templateUrl: './sales.component.html',
	styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements AfterContentInit {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex') protected _alwaysTrue = true;

	public CONFIG : typeof Config = Config;
	public PTabsTheme = PTabsTheme;

	constructor(
		public api : SchedulingApiService,
		public meService : MeService,
		public bookingsService : BookingsService,
		private pMomentService : PMomentService,
	) { }

	public SalesTabNames = SalesTabNames;
	public PThemeEnum = PThemeEnum;
	public PTabSizeEnum = PTabSizeEnum;

	public ngAfterContentInit() : void {

		this.initValues();
	}

	public defaultStart : number | null = null;
	public defaultEnd : number | null = null;

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	public initValues() : void {
		if (!this.defaultStart) {
			this.defaultStart = +this.pMomentService.m().startOf('month');
		}
		if (!this.defaultEnd) {
			this.defaultEnd = +this.pMomentService.m().endOf('month') + 1;
		}
	}

	/**
	 * Should the tab be visible to the user?
	 * NOTE: 	The tab contained component does the related api call.
	 * 				We can not rely on something like api.data.someItems.attributeInfoThis.show here since at a page reload the api
	 * 				will not be loaded.
	 */
	public get showBookingsTab() : boolean | null {
		if (!this.api.isLoaded()) return false;
		return this.api.data.bookings.attributeInfoThis.show;
	}

	/**
	 * Should the tab be visible to the user?
	 * NOTE: 	The tab contained component does the related api call.
	 * 				We can not rely on something like api.data.someItems.attributeInfoThis.show here since at a page reload the api
	 * 				will not be loaded.
	 */
	public get showGiftCardsTab() : boolean | null {
		if (!this.api.isLoaded()) return null;
		return this.api.data.vouchers.attributeInfoThis.show;
	}

	/**
	 * Should the tab be visible to the user?
	 * NOTE: 	The tab contained component does the related api call.
	 * 				We can not rely on something like api.data.someItems.attributeInfoThis.show here since at a page reload the api
	 * 				will not be loaded.
	 */
	public get showTransactionsTab() : boolean | null {
		if (!this.api.isLoaded()) return null;
		return this.api.data.transactions.attributeInfoThis.show;
	}
}

export interface SalesSubPage {
	ngAfterContentInit : () => void,
	initValues : () => void,
	loadNewData : () => void,

	/**
	 * This should be true if the user is typing in a search input, but the results are not requested or shown yet.
	 */
	preparingNewSearchRequest : boolean,

	/**
	 * The string that should be searched for.
	 */
	searchString : BookingsService['searchString'];

	/**
	 * Navigate to detail page of one item of a list.
	 */
	navToItem : (item : Id) => void;

	/**
	 * Are there any related filters set?
	 * Can be filters specific to this component.
	 * Can be filters from the sidebar.
	 */
	hasFilterSettings : boolean;

	/**
	 * Unload all filters related to this component
	 */
	unloadFilters : () => void;

}
