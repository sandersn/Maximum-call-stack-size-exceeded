/* eslint-disable @typescript-eslint/no-explicit-any */
import { SubscriptionLike as ISubscription } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { AfterContentInit, OnDestroy} from '@angular/core';
import { Component, HostBinding, Input, Renderer2 } from '@angular/core';
import { PluginComponentTabs } from '@plano/client/plugin/plugin.component';
import { PMoreBtnService } from '@plano/client/scheduling/shared/p-bookings/legacy-booking-list/more-btn.service';
import { BootstrapSize, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { FilterService } from '@plano/client/shared/filter.service';
import { DropdownTypeEnum } from '@plano/client/shared/p-forms/p-dropdown/p-dropdown.component';
import { ListSortDirection } from '@plano/client/shared/p-lists/list-headline-item/list-headline-item.component';
import { PSidebarService } from '@plano/client/shared/p-sidebar/p-sidebar.service';
import { ApiListWrapper, SchedulingApiTransaction} from '@plano/shared/api';
import { SchedulingApiAccountHolderProcessingState, SchedulingApiAccountHolderState, ExportTransactionsExcelApiService, MeService, RightsService, SchedulingApiService, SchedulingApiTransactionPaymentMethodType, SchedulingApiTransactions, SchedulingApiTransactionType, SchedulingApiAccountHolderPayoutState } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { ModalServiceOptions } from '@plano/shared/core/p-modal/modal.service.options';
import { LocalizePipe, LocalizePipeParamsType } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { PTransactionsService } from './transactions.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../shared/core/null-type-utils';
import { ModalService } from '../../../shared/core/p-modal/modal.service';
import { PCurrencyPipe } from '../../../shared/core/pipe/p-currency.pipe';
import { PExportService } from '../../shared/p-export.service';
import { PButtonType } from '../../shared/p-forms/p-button/p-button.component';
import { SalesSubPage } from '../sales.component';

export enum TransactionsSortedByEmum {
	DATE_TIME = 'dateTime',
	BOOKING_NUMBER = 'bookingNumber',
	AMOUNT = 'amount',
	TYPE = 'type',
	PAYMENT_METHOD_TYPE = 'paymentMethodType',
	OFFER_NAME = 'offerName',
	REFERENCED_PERSON = 'referencedPerson',
}

@Component({
	selector: 'p-transactions',
	templateUrl: './transactions.component.html',
	styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements PComponentInterface, AfterContentInit, SalesSubPage, OnDestroy {
	@Input() public transactions : SchedulingApiTransactions | null = null;

	@Input() public initialStart : number | null = null;
	@Input() public initialEnd : number | null = null;

	public sortedBy : TransactionsSortedByEmum = TransactionsSortedByEmum.DATE_TIME;
	public sortedReverse : boolean = true;
	public exportIsRunning : boolean = false;

	constructor(
		public api : SchedulingApiService,
		private pRouterService : PRouterService,
		private meService : MeService,
		public pTransactionsService : PTransactionsService,
		private localizePipe : LocalizePipe,
		private pSidebarService : PSidebarService,
		public pMoreBtnService : PMoreBtnService,
		private filterService : FilterService,
		public rightsService : RightsService,
		public exportTransactionsApi : ExportTransactionsExcelApiService,
		private renderer : Renderer2,
		private pExport : PExportService,
		private localize : LocalizePipe,
		private modalService : ModalService,
		private pCurrencyPipe : PCurrencyPipe,
	) {
	}

	public BootstrapSize = BootstrapSize;
	public Config = Config;
	public DropdownTypeEnum = DropdownTypeEnum;
	public PlanoFaIconPool = PlanoFaIconPool;
	public TransactionsSortedByEmum = TransactionsSortedByEmum;
	public ListSortDirection = ListSortDirection;
	public PThemeEnum = PThemeEnum;
	public SchedulingApiTransactionType = SchedulingApiTransactionType;
	public SchedulingApiTransactionPaymentMethodType = SchedulingApiTransactionPaymentMethodType;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;
	public PButtonType = PButtonType;

	/**
	 * Set new sortedBy value and update sortedRevers value.
	 */
	public setSorter(input : TransactionsSortedByEmum) : void {
		if (this.sortedBy === input) {
			this.sortedReverse = !this.sortedReverse;
		} else {
			this.sortedReverse = true;
			this.sortedBy = input;
		}
		// this.sortedByChange.emit(this.sortedBy);
		// this.sortedReverseChange.emit(this.sortedReverse);
	}

	/**
	 * Get a filtered list of transactions
	 */
	public get transactionsForList() : SchedulingApiTransactions {
		return this.transactions!.filterBy((item) => {
			if (!this.pTransactionsService.isVisible(item)) return false;
			const relatedShiftModel = this.api.data.shiftModels.get(item.shiftModelId);
			if (!relatedShiftModel) throw new Error('Could not find relatedShiftModel');
			if (!this.filterService.isVisible(relatedShiftModel)) return false;
			return true;
		});
	}

	/**
	 * Get a sorted list
	 */
	public get transactionsForListSorted() : ApiListWrapper<SchedulingApiTransaction> {
		return this.transactionsForList.sortedBy([
			(item) => {
				switch (this.sortedBy) {
					case TransactionsSortedByEmum.PAYMENT_METHOD_TYPE:
						return item.paymentMethodName;
					case TransactionsSortedByEmum.TYPE:
						return item.typeTitle;
					case TransactionsSortedByEmum.AMOUNT:
					case TransactionsSortedByEmum.BOOKING_NUMBER:
					case TransactionsSortedByEmum.DATE_TIME:
					case TransactionsSortedByEmum.OFFER_NAME:
					case TransactionsSortedByEmum.REFERENCED_PERSON:
						return item[this.sortedBy];
				}
			},
		], false, this.sortedReverse);
	}

	private subscriptionApi : ISubscription | null = null;
	private subscriptionFilter : ISubscription | null = null;

	public ngAfterContentInit() : void {
		this.initValues();

		this.subscriptionApi = this.api.onChange.subscribe(() => {
			this.pMoreBtnService.initValues(this.transactionsForList.length);
		});
		this.subscriptionFilter = this.filterService.onChange.subscribe(() => {
			this.pMoreBtnService.initValues(this.transactionsForList.length);
		});

		this.meService.isLoaded(() => {
			this.loadNewData();
			this.api.isLoaded(() => {
				this.pMoreBtnService.initValues(this.transactionsForList.length);
			});
		});
	}

	public ngOnDestroy() : void {
		this.subscriptionApi?.unsubscribe();
		this.subscriptionFilter?.unsubscribe();
		this.timeoutAfterPayPalTurnedOffIsRunning = false;
	}

	/**
	 * Load new Data
	 */
	public loadNewData() : void {
		if (!this.pTransactionsService.start) throw new Error('Start date must be defined for transactions.');
		if (!this.pTransactionsService.end) throw new Error('End date must be defined for transactions.');

		let queryParams = new HttpParams()
			.set('data', 'transactions');

		if (!this.searchAll || !this.searchString) {
			queryParams = queryParams
				.set('start', (this.pTransactionsService.start.toString()))
				.set('end', (this.pTransactionsService.end.toString()));
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
		if (!this.pTransactionsService.start) this.pTransactionsService.start = +this.initialStart!;
		if (!this.pTransactionsService.end) this.pTransactionsService.end = +this.initialEnd!;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get preparingNewSearchRequest() : SalesSubPage['preparingNewSearchRequest'] {
		// This happens if e.g. previousRequest is an empty string and searchString is `undefined`
		if (!this.previousRequest && !this.searchString) return false;
		return this.previousRequest !== this.searchString;
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

	/**
	 * The string the transactions should be searched for
	 */
	public get searchString() : PTransactionsService['searchString'] {
		return this.pTransactionsService.searchString;
	}

	public set searchString(input : PTransactionsService['searchString']) {
		this.pTransactionsService.searchString = input;
		window.clearTimeout(this.timeout ?? undefined);
		this.timeout = window.setTimeout(() => {
			this.runSearch();
		}, 700);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isLoading() : PComponentInterface['isLoading'] {
		if (!this.api.isLoaded()) return true;
		if (this.api.isBackendOperationRunning) return true;

		return false;
	}

	/**
	 * Navigate to detail-page of given transaction
	 */
	public navToItem(id : Id) : void {
		this.pRouterService.navigate([`client/transaction/${id.toString()}`]);
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
	public get searchAll() : PTransactionsService['searchAll'] {
		return this.pTransactionsService.searchAll;
	}
	public set searchAll(input : PTransactionsService['searchAll']) {
		this.pTransactionsService.searchAll = input;
		if (this.searchString) this.loadNewData();
	}

	/**
	 * Start timestamp. Used for the api request and date picker.
	 */
	public get start() : PTransactionsService['start'] {
		return this.pTransactionsService.start;
	}
	public set start(input : PTransactionsService['start']) {
		this.pTransactionsService.start = input;
		this.loadNewData();
	}

	/**
	 * End timestamp. Used for the api request and date picker.
	 */
	public get end() : PTransactionsService['end'] {
		return this.pTransactionsService.end;
	}
	public set end(input : PTransactionsService['end']) {
		this.pTransactionsService.end = input;
		this.loadNewData();
	}

	public modalServiceOptions : ModalServiceOptions = {
		size: 'lg',
	};

	/**
	 * Get a label for a enum
	 */
	public getTransactionTypeLabel(input : SchedulingApiTransactionType) : string | null {
		// NOTE: These translations should match the ones for the backend in TransactionsToExcel.getTransactionTypeLabel()
		switch (input) {
			case SchedulingApiTransactionType.CHARGEBACK:
			case SchedulingApiTransactionType.CHARGEBACK_REVERSED:
			case SchedulingApiTransactionType.SECOND_CHARGEBACK:
				return this.localizePipe.transform('Rückbuchungen (Chargebacks)');
			case SchedulingApiTransactionType.PAYMENT:
			case SchedulingApiTransactionType.PAYMENT_FAILED:
				return this.localizePipe.transform('Eingegangene Zahlungen');
			case SchedulingApiTransactionType.PAYOUT:
			case SchedulingApiTransactionType.PAYOUT_FAILED:
				return this.localizePipe.transform('Auszahlungen des Guthabens');
			case SchedulingApiTransactionType.REFUND:
			case SchedulingApiTransactionType.REFUND_FAILED:
				return this.localizePipe.transform('Rückerstattungen');
			case SchedulingApiTransactionType.AUTO_DEBIT:
			case SchedulingApiTransactionType.AUTO_DEBIT_FAILED:
				return this.localizePipe.transform('Aufladungen des Guthabens');
			case SchedulingApiTransactionType.DR_PLANO_FEE_VAT:
				return this.api.localizePipe.transform('USt. auf die Online-Zahlungsgebühr');
		}
	}

	/**
	 * Get a label for a enum
	 */
	public getPaymentMethodTypeLabel(input : SchedulingApiTransactionPaymentMethodType) : string {
		// NOTE: These translations should match the ones for the backend in TransactionsToExcel.getPaymentMethodTypeLabel()
		switch (input) {
			case SchedulingApiTransactionPaymentMethodType.MISC:
				return this.localizePipe.transform('Sonstige Zahlungsarten');
			case SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT:
				return this.localizePipe.transform('Online-Zahlung');
			case SchedulingApiTransactionPaymentMethodType.PAYPAL:
				return this.localizePipe.transform('PayPal (eingestellte Zahlungsart)');
			case SchedulingApiTransactionPaymentMethodType.POS:
				return this.localizePipe.transform('Kasse per Schnittstelle');
		}
	}

	/**
	 * Is sidebar visible? then there is less space for list content.
	 */
	@HostBinding('class.sidebar-is-visible')
	public get sidebarIsVisible() : boolean {
		if (Config.IS_MOBILE) return false;
		return !this.pSidebarService.mainSidebarIsCollapsed;
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
		btnTextObj['label'] = this.localizePipe.transform('Zahlungen');
		const TEXT = 'Lade ${label} ${index1} – ${index2} von ${index3}';
		return this.localizePipe.transform(TEXT, btnTextObj as LocalizePipeParamsType);
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
	 * Is Adyen payout allowed?
	 * This boolean can be used to show a warning if necessary.
	 */
	public get isPayoutEnabled() : boolean | undefined {
		if (!this.api.isLoaded()) return undefined;
		return this.api.data.adyenAccount.accountHolderPayoutState === SchedulingApiAccountHolderPayoutState.PAYOUT_ALLOWED;
	}

	/**
	 * Is Adyen processing allowed?
	 * This boolean can be used to show a warning if necessary.
	 */
	public get isProcessingEnabled() : boolean | undefined {
		if (!this.api.isLoaded()) return undefined;
		return this.api.data.adyenAccount.accountHolderProcessingState === SchedulingApiAccountHolderProcessingState.PROCESSING_ALLOWED;
	}

	/**
	 * Set focus back to input when user changed option
	 */
	public onSelectSearchSetting() : void {
		this.renderer.selectRootElement('#search-input input').focus();
	}

	/**
	 * Is there an active connection to an Adyen account?
	 */
	public get adyenIsActive() : boolean | null {
		if (!this.api.isLoaded()) return null;
		return this.api.data.adyenAccount.accountHolderState === SchedulingApiAccountHolderState.ACTIVE;

		// if (
		// 	this.api.data.adyenAccount.accountHolderPayoutState === AccountHolderPayoutState.PAYOUT_ALLOWED &&
		// 	this.api.data.adyenAccount.accountHolderProcessingState === AccountHolderProcessingState.PROCESSING_ALLOWED
		// ) return !true;



		// return !false;
	}

	/**
	 * Navigate to onboarding page
	 */
	public navToOnboarding() : void {
		this.pRouterService.navigate([`client/plugin/${PluginComponentTabs.PAYMENTS}`]);
	}

	/**
	 * Are there any related filters set?
	 * Can be filters specific to this component.
	 * Can be filters from the sidebar.
	 * If returns `null` there will be no "reset filter" button - ignoring internal logic of p-no-items
	 */
	public get hasFilterSettings() : SalesSubPage['hasFilterSettings'] {
		if (!!this.filterService.hiddenItems['shiftModels'].length) return true;
		if (this.pTransactionsService.hasFilterSettings) return true;
		return false;
	}

	/**
	 * Unload all filters related to this component
	 */
	public unloadFilters() : void {
		this.pTransactionsService.unloadFilters();
		this.filterService.unloadShiftModels();
		this.filterService.initValues();
	}

	private schedulingApiTransactionPaymentMethodTypeArrayToValueArray(array : SchedulingApiTransactionPaymentMethodType[] ) : any[] {
		const next : any[] = [];
		for (const methodType of array) {
			next.push(SchedulingApiTransactionPaymentMethodType[methodType]);
		}
		return next;
	}
	private schedulingApiTransactionTypeArrayToValueArray(array : SchedulingApiTransactionType[] ) : any[] {
		const next : any[] = [];
		for (const methodType of array) {
			next.push(SchedulingApiTransactionType[methodType]);
		}
		return next;
	}

	/**
	 * is the api currently loading?
	 */
	public get isApiLoading() : boolean {
		return this.api.isLoadOperationRunning;
	}

	/**
	 * Export all visible transactions
	 */
	public exportTransactions(format : string) : void {
		// set transactions to be exported
		this.exportTransactionsApi.setEmptyData();

		for (const transaction of this.transactionsForList.iterable()) {
			this.exportTransactionsApi.data.transactionIds.createNewItem(transaction.id);
		}

		const filterSettings = this.checkFilterSettings();

		filterSettings.queryParams = filterSettings.queryParams.set('format', format);

		// set shiftModel to be exported
		for (const shiftModel of this.api.data.shiftModels.iterable()) {
			if (this.filterService.isVisible(shiftModel))
				this.exportTransactionsApi.data.shiftModelIds.push(shiftModel.id);
		}
		const fileName = this.pExport.getFileName(this.localize.transform('Zahlungsexport'), Number(filterSettings.queryParams.get('start')), Number(filterSettings.queryParams.get('end')) - 1);

		// download file
		if (format === 'csv') {
			this.modalService.info(
				{
					modalTitle: 'CSV-Export',
					description: `${filterSettings.modalText}<h4><span class="fa-fw fas fa-file-excel"></span> ${this.localize.transform('Microsoft Excel')}</h4>${this.localize.transform('Falls du die CSV-Datei mit <strong>Microsoft Excel</strong> öffnen möchtest, klicke bitte in Excel bei der Registerkarte <mark>Daten</mark> auf den Knopf <mark>Aus Text/CSV</mark> und folge anschließend den Hinweisen, um die Daten zu laden. <br>Wir raten dir davon ab, die CSV-Datei direkt <strong>per Doppelklick</strong> in Excel zu öffnen, da manche Excel-Versionen die Formatierung der CSV-Datei verändern und die Datei unbrauchbar machen könnten.')}`, // description,
				},
				() => {
					// okay pressed
					this.exportIsRunning = true;
					this.exportTransactionsApi.downloadFile(fileName, format, filterSettings.queryParams, 'PUT', () => {
						this.exportIsRunning = false;
					});
				},
			);
		} else {
			this.exportIsRunning = true;
			this.exportTransactionsApi.downloadFile(fileName, format, filterSettings.queryParams, 'PUT', () => {
				this.exportIsRunning = false;
			});
		}

	}

	/**
	 * @returns Object containing queryParams for the set filters and a modalText describing the filters
	 */
	// eslint-disable-next-line max-statements, sonarjs/cognitive-complexity
	public checkFilterSettings() : {modalText : string, queryParams : HttpParams} {
		assumeDefinedToGetStrictNullChecksRunning(this.pTransactionsService.start, 'pTransactionsService.start');
		assumeDefinedToGetStrictNullChecksRunning(this.pTransactionsService.end, 'pTransactionsService.end');
		// get query params
		const startMillis = this.pTransactionsService.start  > Date.now() ? Date.now() : this.pTransactionsService.start;
		// the maximum end for exporting is now.
		const endMillis = (this.pTransactionsService.end > Date.now() ? Date.now() : this.pTransactionsService.end);
		let queryParams = new HttpParams()
			.set('start', (startMillis).toString())
			.set('end', (endMillis).toString());

		let hasFilter = false;
		let modalText = `<h4><span class="fa-fw fas fa-filter"></span> ${this.localize.transform('Filter Aktiv')}</h4>${this.localize.transform('Es sind Filter aktiv, die möglicherweise Einfluss auf deinen Export haben.')}</br></br><ul>`;

		if (this.filterService.hiddenItems['shiftModels'].length > 0) {
			if (this.filterService.hiddenItems['shiftModels'].length === 1) {
				modalText += `<li>${this.localize.transform('<mark>eine</mark> Tätigkeit ist ausgeblendet')}</li>`;
			} else {
				modalText += `<li>${this.localize.transform('<mark>${excludedShiftModels}</mark> Tätigkeiten sind ausgeblendet', {excludedShiftModels: this.filterService.hiddenItems['shiftModels'].length.toString()})}</li>`;
			}
			hasFilter = true;
		}

		if (
			this.pTransactionsService.filteredTransactionType as unknown &&
			this.pTransactionsService.filteredTransactionType.length > 0
		) {
			queryParams = queryParams.set('filteredTransactionType', `[${this.schedulingApiTransactionTypeArrayToValueArray(this.pTransactionsService.filteredTransactionType)}]`);
			modalText += `<li>${this.localize.transform('Zahlungstypen ausgeblendet:')} `;
			const array : string[] = [];
			for (const type of this.pTransactionsService.filteredTransactionType) {
				// the failed type has the same translation, so we need to check if the string's already in
				const translation = this.getTransactionTypeLabel(type);
				if (translation !== null && !array.includes(translation)) {
					array.push(translation);
					modalText += `<mark>${translation}</mark>, `;
				}
			}
			modalText = `${modalText.slice(0, -2)}</li>`;
			hasFilter = true;
		}
		if (this.pTransactionsService.showOnlyFailedTransactions) {
			queryParams = queryParams.set('showOnlyFailedTransactions', this.pTransactionsService.showOnlyFailedTransactions);
			modalText += `<li>${this.localize.transform('nur fehlgeschlagene Zahlungen anzeigen')} `;
			hasFilter = true;
		}
		if (this.pTransactionsService.searchAll) {
			queryParams = queryParams.set('searchAll', this.pTransactionsService.searchAll);
			hasFilter = true;
		}
		if (
			this.pTransactionsService.filteredTransactionPaymentMethodType as unknown &&
			this.pTransactionsService.filteredTransactionPaymentMethodType.length > 0
		) {
			queryParams = queryParams.set('filteredTransactionPaymentMethodType', `[${this.schedulingApiTransactionPaymentMethodTypeArrayToValueArray(this.pTransactionsService.filteredTransactionPaymentMethodType)}]`);
			modalText += `<li>${this.localize.transform('Zahlungsarten ausgeblendet:')} `;
			for (const type of this.pTransactionsService.filteredTransactionPaymentMethodType) {
				modalText += `<mark>${this.getPaymentMethodTypeLabel(type)}</mark>, `;
			}
			modalText = `${modalText.slice(0, -2)}</li>`;
			hasFilter = true;
		}
		if (this.pTransactionsService.amountStart!.value) {
			queryParams = queryParams.set('amountStart', this.pTransactionsService.amountStart!.value);
			hasFilter = true;
		}
		if (this.pTransactionsService.amountEnd!.value) {
			queryParams = queryParams.set('amountEnd', this.pTransactionsService.amountEnd!.value);
			hasFilter = true;
		}

		if (this.pTransactionsService.amountStart!.value !== undefined && this.pTransactionsService.amountEnd!.value === undefined) {
			modalText += `<li>${this.localize.transform('nur Beträge größer als <mark>${amountStart}</mark> anzeigen', {amountStart: this.pCurrencyPipe.transform(this.pTransactionsService.amountStart!.value)})}</li>`;
		}
		if (this.pTransactionsService.amountStart!.value === undefined && this.pTransactionsService.amountEnd!.value !== undefined) {
			modalText += `<li>${this.localize.transform('nur Beträge kleiner als <mark>${amountEnd}</mark> anzeigen', {amountEnd: this.pCurrencyPipe.transform(this.pTransactionsService.amountEnd!.value)})}</li>`;
		}
		if (this.pTransactionsService.amountStart!.value !== undefined && this.pTransactionsService.amountEnd!.value !== undefined) {
			modalText += `<li>${this.localize.transform('nur Beträge zwischen <mark>${amountStart}</mark> und <mark>${amountEnd}</mark> anzeigen', {amountStart: this.pCurrencyPipe.transform(this.pTransactionsService.amountStart!.value), amountEnd: this.pCurrencyPipe.transform(this.pTransactionsService.amountEnd!.value)})}</li>`;
		}
		if (this.pTransactionsService.searchString) {
			queryParams = queryParams.set('searchString', this.pTransactionsService.searchString);
			modalText += `<li>${this.localize.transform('nur Zahlungen für die Suche nach <mark>${searchText}</mark> anzeigen', {searchText:this.pTransactionsService.searchString})} `;
			hasFilter = true;
		}
		if (hasFilter) {
			modalText += '</ul>';
		} else {
			modalText = '';
		}
		return {modalText:modalText, queryParams:queryParams};
	}

	private get payPalFilterOptionIsActive() : boolean {
		return this.pTransactionsService.filteredTransactionPaymentMethodType.includes(SchedulingApiTransactionPaymentMethodType.PAYPAL);
	}

	/**
	 * Should the PayPal filter be visible?
	 */
	public get showPayPalFilterOption() : boolean {
		if (this.api.data.isPaypalAvailable) return true;
		// Filter-Button is Active
		if (
			this.payPalFilterOptionIsActive ||
			this.timeoutAfterPayPalTurnedOffIsRunning
		) return true;
		return this.api.data.transactions.some(item => item.paymentMethodType === SchedulingApiTransactionPaymentMethodType.PAYPAL);
	}

	private timeoutAfterPayPalTurnedOffIsRunning : boolean = false;
	private timeoutAfterPayPalTurnedOffTimeout : number | null = null;

	/**
	 * Toggle filter option
	 */
	public toggleFilteredTransactionPaymentMethodType(value : SchedulingApiTransactionPaymentMethodType) : void {
		if (
			value === SchedulingApiTransactionPaymentMethodType.PAYPAL
		) {
			if (this.payPalFilterOptionIsActive) {
				this.timeoutAfterPayPalTurnedOffIsRunning = true;
				this.timeoutAfterPayPalTurnedOffTimeout = window.setTimeout(() => {
					this.timeoutAfterPayPalTurnedOffIsRunning = false;
				}, 60000);
			} else {
				this.timeoutAfterPayPalTurnedOffIsRunning = false;
				window.clearTimeout(this.timeoutAfterPayPalTurnedOffTimeout!);
			}
		}
		this.pTransactionsService.toggleFilteredTransactionPaymentMethodType(value);
	}
}

