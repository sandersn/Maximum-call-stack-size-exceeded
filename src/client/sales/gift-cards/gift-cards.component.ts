import { SubscriptionLike as ISubscription } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { AfterContentInit, OnDestroy} from '@angular/core';
import { Component, HostBinding, Input, Renderer2 } from '@angular/core';
import { PTextColor} from '@plano/client/shared/bootstrap-styles.enum';
import { BootstrapSize, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PExportService } from '@plano/client/shared/p-export.service';
import { DropdownTypeEnum } from '@plano/client/shared/p-forms/p-dropdown/p-dropdown.component';
import { ListSortDirection } from '@plano/client/shared/p-lists/list-headline-item/list-headline-item.component';
import { PSidebarService } from '@plano/client/shared/p-sidebar/p-sidebar.service';
import { ApiListWrapper, SchedulingApiVoucher} from '@plano/shared/api';
import { ExportVouchersBoulderadoCsvApiService, ExportVouchersExcelApiService, MeService, SchedulingApiService, SchedulingApiVouchers } from '@plano/shared/api';
import { SchedulingApiPosSystem } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { LocalizePipe, LocalizePipeParamsType } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPoolValues } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { PGiftCardsService } from './gift-cards.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../shared/core/null-type-utils';
import { PDictionarySourceString } from '../../../shared/core/pipe/localize.dictionary';
import { PCurrencyPipe } from '../../../shared/core/pipe/p-currency.pipe';
import { getPaymentStatusIcon, getPaymentStatusIconStyle, getPaymentStatusTooltipBgClass, paymentStatusTitle, PPaymentStatusEnum } from '../../scheduling/shared/api/scheduling-api.utils';
import { PMoreBtnService } from '../../scheduling/shared/p-bookings/legacy-booking-list/more-btn.service';
import { SalesSubPage } from '../sales.component';

enum GiftCardsSortedByEmum {
	DATE_OF_BOOKING = 'dateOfBooking',
	CODE = 'code',
	BOOKING_NUMBER = 'bookingNumber',
	PAYMENT_STATUS = 'paymentStatus',
}

@Component({
	selector: 'p-gift-cards[vouchers]',
	templateUrl: './gift-cards.component.html',
	styleUrls: ['./gift-cards.component.scss'],
})
export class GiftCardsComponent implements PComponentInterface, AfterContentInit, OnDestroy, SalesSubPage {
	@Input() public vouchers ! : SchedulingApiVouchers;

	@Input() public initialStart : number | null = null;
	@Input() public initialEnd : number | null = null;

	public sortedBy : GiftCardsSortedByEmum = GiftCardsSortedByEmum.DATE_OF_BOOKING;
	public sortedReverse : boolean = true;
	public exportIsRunning : boolean = false;

	constructor(
		public api : SchedulingApiService,
		public exportVouchersBoulderadoCsvApiService : ExportVouchersBoulderadoCsvApiService,
		public exportVouchersExcelApiService : ExportVouchersExcelApiService,
		private pExport : PExportService,
		private localizePipe : LocalizePipe,
		private pRouterService : PRouterService,
		public pGiftCardsService : PGiftCardsService,
		private meService : MeService,
		private pSidebarService : PSidebarService,
		private renderer : Renderer2,
		public pCurrencyPipe : PCurrencyPipe,
		public pMoreBtnService : PMoreBtnService,
	) {
	}

	public GiftCardsSortedByEmum = GiftCardsSortedByEmum;
	public ListSortDirection = ListSortDirection;
	public BootstrapSize = BootstrapSize;
	public DropdownTypeEnum = DropdownTypeEnum;
	public Config = Config;
	public PlanoFaIconPool = PlanoFaIconPool;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;
	public PThemeEnum = PThemeEnum;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isLoading() : PComponentInterface['isLoading'] {
		if (!this.api.isLoaded()) return true;
		if (this.api.isBackendOperationRunning) return true;
		if (this.preparingNewSearchRequest) return true;

		return false;
	}

	private subscriptionApi : ISubscription | null = null;

	public ngAfterContentInit() : void {
		this.initValues();

		this.subscriptionApi = this.api.onChange.subscribe(() => {
			this.pMoreBtnService.initValues(this.vouchersForList.length);
		});

		this.meService.isLoaded(() => {
			this.loadNewData();
			this.api.isLoaded(() => {
				this.pMoreBtnService.initValues(this.vouchersForList.length);
			});
		});
	}

	public ngOnDestroy() : void {
		this.subscriptionApi?.unsubscribe();
	}

	/**
	 * Is Boulderado pos system connected to this account?
	 */
	public get isBoulderadoActive() : boolean {
		return this.api.data.posSystem === SchedulingApiPosSystem.BOULDERADO;
	}


	/**
	 * Export all currently visible gift cards
	 */
	public exportVouchersBoulderadoCsv() : void {
		this.exportIsRunning = true;

		// set vouchers to be exported
		this.exportVouchersBoulderadoCsvApiService.setEmptyData();

		for (const voucher of this.vouchers.iterable()) {
			this.exportVouchersBoulderadoCsvApiService.data.voucherIds.createNewItem(voucher.id);
		}

		assumeDefinedToGetStrictNullChecksRunning(this.pGiftCardsService.start, 'pGiftCardsService.start');
		assumeDefinedToGetStrictNullChecksRunning(this.pGiftCardsService.end, 'pGiftCardsService.end');

		// get file name
		const startMillis = this.pGiftCardsService.start;
		const endMillis = this.pGiftCardsService.end;

		const fileName = this.pExport.getFileName(this.localizePipe.transform('gutscheine'), startMillis, endMillis - 1);

		// download file
		this.exportVouchersBoulderadoCsvApiService.downloadFile(fileName, 'csv', null, 'PUT', () => {
			this.exportIsRunning = false;
		});
	}

	/**
	 * Export all currently visible gift cards
	 */
	public exportVouchersXLS() : void {
		this.exportIsRunning = true;

		// set vouchers to be exported
		this.exportVouchersExcelApiService.setEmptyData();

		for (const voucher of this.vouchers.iterable()) {
			this.exportVouchersExcelApiService.data.voucherIds.createNewItem(voucher.id);
		}

		assumeDefinedToGetStrictNullChecksRunning(this.pGiftCardsService.start, 'pGiftCardsService.start');
		assumeDefinedToGetStrictNullChecksRunning(this.pGiftCardsService.end, 'pGiftCardsService.end');

		// get file name
		const startMillis = this.pGiftCardsService.start;
		const endMillis = this.pGiftCardsService.end;

		const fileName = this.pExport.getFileName(this.localizePipe.transform('gutscheine'), startMillis, endMillis - 1);

		assumeDefinedToGetStrictNullChecksRunning(startMillis, 'startMillis');
		assumeDefinedToGetStrictNullChecksRunning(endMillis, 'endMillis');
		// download file
		let queryParams = new HttpParams()
			.set('start', startMillis.toString())
			.set('end', endMillis.toString());
		if (this.searchString) {
			queryParams = queryParams
				.set('searchString', (this.searchString));
		}

		this.exportVouchersExcelApiService.downloadFile(fileName, 'xlsx', queryParams, 'PUT', () => {
			this.exportIsRunning = false;
		});
	}

	/**
	 * Navigate to detail-page of given gift card
	 */
	public navToItem(id : Id) : void {
		this.pRouterService.navigate([`client/gift-card/${id.toString()}`]);
	}

	/**
	 * Load new Data
	 */
	public loadNewData() : void {
		if (!this.pGiftCardsService.start) throw new Error('Start date must be defined for gift-cards.');
		if (!this.pGiftCardsService.end) throw new Error('End date must be defined for gift-cards.');

		let queryParams = new HttpParams()
			.set('data', 'vouchers');

		if (!this.searchAll || !this.searchString) {
			queryParams = queryParams
				.set('start', (this.pGiftCardsService.start.toString()))
				.set('end', (this.pGiftCardsService.end.toString()));
		}

		if (this.searchString) {
			queryParams = queryParams
				.set('searchString', (this.searchString));
		}

		this.api.load({
			searchParams: queryParams,
			success: () => {
				this.previousRequest = this.searchString;
			},
		});
	}

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	public initValues() : void {
		if (!this.pGiftCardsService.start) this.pGiftCardsService.start = this.initialStart !== null ? +this.initialStart : 0;
		if (!this.pGiftCardsService.end) this.pGiftCardsService.end = this.initialEnd !== null ? +this.initialEnd : 0;
	}


	/**
	 * Get a sorted list
	 */
	public get vouchersForList() : SchedulingApiVouchers {
		return this.vouchers;
	}

	/**
	 * Get a sorted list
	 */
	public get vouchersForListSorted() : ApiListWrapper<SchedulingApiVoucher> {
		return this.vouchersForList.sortedBy(this.sortedBy, false, !this.sortedReverse);
	}

	/**
	 * Set new sortedBy value and update sortedRevers value.
	 */
	public setSorter(input : GiftCardsSortedByEmum) : void {
		if (this.sortedBy === input) {
			this.sortedReverse = !this.sortedReverse;
		} else {
			this.sortedReverse = false;
			this.sortedBy = input;
		}
	}

	/**
	 * The string which should be searched for
	 * This will get used for api requests
	 * Changing it triggers a api load
	 */
	private previousRequest : string | null = null;

	/**
	 * Should all bookings be searched, or only the bookings within the defined time range?
	 */
	public get searchAll() : PGiftCardsService['searchAll'] {
		return this.pGiftCardsService.searchAll;
	}
	public set searchAll(input : PGiftCardsService['searchAll']) {
		this.pGiftCardsService.searchAll = input;
		if (this.searchString) this.loadNewData();
	}

	private timeout : number | null = null;

	/**
	 * We don‘t want the api to load on every change immediately.
	 */
	public onSearchKeyUp(event : KeyboardEvent) : void {
		if (event.key !== 'Enter') return;
		window.clearTimeout(this.timeout ?? undefined);
		event.stopPropagation();
		this.runSearch();
	}

	private runSearch() : void {
		if (this.previousRequest === this.searchString) return;
		this.previousRequest = this.searchString;
		this.loadNewData();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get preparingNewSearchRequest() : SalesSubPage['preparingNewSearchRequest'] {
		// This happens if e.g. previousRequest is an empty string and searchString is `undefined`
		if (!this.previousRequest && !this.searchString) return false;
		return this.previousRequest !== this.searchString;
	}

	/**
	 * The string the gift-cards should be searched for
	 */
	public get searchString() : PGiftCardsService['searchString'] {
		return this.pGiftCardsService.searchString;
	}

	public set searchString(input : PGiftCardsService['searchString']) {
		this.pGiftCardsService.searchString = input;
		window.clearTimeout(this.timeout ?? undefined);
		this.timeout = window.setTimeout(() => {
			this.runSearch();
		}, 700);
	}

	/**
	 * Start timestamp. Used for the api request and date picker.
	 */
	public get start() : PGiftCardsService['start'] {
		return this.pGiftCardsService.start;
	}
	public set start(input : PGiftCardsService['start']) {
		this.pGiftCardsService.start = input;
		this.loadNewData();
	}

	/**
	 * End timestamp. Used for the api request and date picker.
	 */
	public get end() : PGiftCardsService['end'] {
		return this.pGiftCardsService.end;
	}
	public set end(input : PGiftCardsService['end']) {
		this.pGiftCardsService.end = input;
		this.loadNewData();
	}

	/**
	 * Is sidebar visible? then there is less space for list content.
	 */
	@HostBinding('class.sidebar-is-visible')
	private get _sidebarIsVisible() : boolean {
		return !this.pSidebarService.mainSidebarIsCollapsed;
	}

	public focusOnSearch : boolean = false;
	public focusOnSearchSettings : boolean = false;
	private searchFocusTimeout : number | null = null;

	/**
	 * Shows additional options in UI when user is about to search something
	 */
	public onFocusSearch() : void {
		window.clearTimeout(this.searchFocusTimeout ?? undefined);
		this.focusOnSearch = true;
		this.focusOnSearchSettings = false;
	}

	/**
	 * Hides additional options in UI
	 */
	public onBlurSearch() : void {
		this.searchFocusTimeout = window.setTimeout(() => {
			this.focusOnSearch = false;
		}, 100);
	}

	/**
	 * Keeps the options from disappearing
	 */
	public onFocusSearchSettings() : void {
		window.clearTimeout(this.searchFocusTimeout ?? undefined);
		this.focusOnSearchSettings = true;
		this.focusOnSearch = false;
	}

	/**
	 * Hides additional options in UI
	 */
	public onBlurSearchSettings() : void {
		this.searchFocusTimeout = window.setTimeout(() => {
			this.focusOnSearchSettings = false;
		}, 100);
	}

	/**
	 * Set focus back to input when user changed option
	 */
	public onSelectSearchSetting() : void {
		this.renderer.selectRootElement('#search-input input').focus();
	}

	/**
	 * Are there any related filters set?
	 * Can be filters specific to this component.
	 * Can be filters from the sidebar.
	 * If returns `null` there will be no "reset filter" button - ignoring internal logic of p-no-items
	 */
	public get hasFilterSettings() : SalesSubPage['hasFilterSettings'] {
		return false;
	}

	/**
	 * Unload all filters related to this component
	 */
	public unloadFilters() : void {
	}

	/**
	 * getter for the Status-Icon of this voucher
	 */

	/**
	 * Get a icon for paymentStatus
	 */
	public paymentStatusIcon(paymentStatus : PPaymentStatusEnum) : PlanoFaIconPoolValues {
		return getPaymentStatusIcon(paymentStatus);
	}

	/**
	 * Get a theme / color for paymentStatus icon
	 */
	public paymentStatusIconStyle(paymentStatus : PPaymentStatusEnum) : PTextColor | null {
		return getPaymentStatusIconStyle(paymentStatus);
	}

	/**
	 * Get a class for color for background inside the paymentstatus tooltip
	 */
	public paymentStatusTooltipBgClass(paymentStatus : PPaymentStatusEnum) : 'bg-light' | 'bg-success' | 'bg-danger' | 'bg-warning' | '' {
		return getPaymentStatusTooltipBgClass(paymentStatus);
	}

	/**
	 * Get a class for color for text inside the paymentstatus tooltip
	 */
	public paymentStatusTooltipTextClass(paymentStatus : PPaymentStatusEnum) : 'text-white' | '' {
		switch (paymentStatus) {
			case PPaymentStatusEnum.UNPAID :
			case PPaymentStatusEnum.CASHBACK :
				return 'text-white';
			default :
				return '';
		}
	}

	/**
	 * getter for the title of the status of payment
	 */
	public paymentStatusTitle(paymentStatus : PPaymentStatusEnum) : PDictionarySourceString {
		if (this.isLoading) return 'Lädt…';
		return paymentStatusTitle(paymentStatus);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get maxVisibleItems() : PMoreBtnService['visibleItemsAmount'] {
		return this.pMoreBtnService.visibleItemsAmount;
	}

	/**
	 * Text for a "show more items" button
	 */
	public get moreBtnText() : string {
		const btnTextObj = this.pMoreBtnService.btnTextObj;
		btnTextObj['label'] = this.localizePipe.transform('Gutscheine');
		const TEXT = 'Lade ${label} ${index1} – ${index2} von ${index3}';
		return this.localizePipe.transform(TEXT, btnTextObj as LocalizePipeParamsType);
	}

}
