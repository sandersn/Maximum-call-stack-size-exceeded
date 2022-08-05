import { HttpParams } from '@angular/common/http';
import { OnInit, OnDestroy} from '@angular/core';
import { Component, HostBinding, ChangeDetectionStrategy, Input, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PDetailFormUtilsService } from '@plano/client/shared/detail-form-utils.service';
import { DropdownTypeEnum } from '@plano/client/shared/p-forms/p-dropdown/p-dropdown.component';
import { PageWithDetailFormComponentInterface } from '@plano/client/shared/page-with-detail-form-component.interface';
import { SchedulingApiTransaction, SchedulingApiTransactions} from '@plano/shared/api';
import { ExportTransactionsExcelApiService, SchedulingApiBookingState, SchedulingApiService, SchedulingApiVoucher } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { assumeNonNull } from '@plano/shared/core/null-type-utils';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { Config } from '../../shared/core/config';
import { LogService } from '../../shared/core/log.service';
import { ModalContentOptions } from '../../shared/core/p-modal/modal-default-template/modal-default-template.component';
import { ModalService } from '../../shared/core/p-modal/modal.service';
import { BookingTransactionFormComponent } from '../sales/shared/booking-transaction-form/booking-transaction-form.component';
import { TransactionsSortedByEmum } from '../sales/transactions/transactions.component';
import { SchedulingApiBookable } from '../scheduling/shared/api/scheduling-api-bookable.service';
import { PExportService } from '../shared/p-export.service';
import { PFormGroup } from '../shared/p-forms/p-form-control';
import { PTabSizeEnum } from '../shared/p-tabs/p-tabs/p-tab/p-tab.component';
import { PTabsTheme } from '../shared/p-tabs/p-tabs/p-tabs.component';
import { SectionWhitespace } from '../shared/page/section/section.component';

@Component({
	selector: 'p-gift-card',
	templateUrl: './gift-card.component.html',
	styleUrls: ['./gift-card.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class GiftCardComponent implements OnInit, OnDestroy, PageWithDetailFormComponentInterface<SchedulingApiVoucher> {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.flex-column') protected _alwaysTrue = true;

	@Input() public item : SchedulingApiVoucher<'draft' | 'validated'> | null = null;

	/** Remove when type of SchedulingApiVoucher['price'] is fixed */
	public get price() : SchedulingApiVoucher['price'] | null {
		return this.item?.price ?? null;
	}

	public exportIsRunning : boolean = false;

	constructor(
		private activatedRoute : ActivatedRoute,
		public api : SchedulingApiService,
		private schedulingUrlParams : SchedulingService,
		private pDetailFormUtilsService : PDetailFormUtilsService,
		private localize : LocalizePipe,
		public pRouterService : PRouterService,
		public exportTransactionsApi : ExportTransactionsExcelApiService,
		private pExport : PExportService,
		private modalService : ModalService,
		private localizePipe : LocalizePipe,
		private console : LogService,
	) {
	}

	@ViewChild('bookingTransactionFormModal', { static: true }) public bookingTransactionFormModal ! : TemplateRef<unknown>;

	public DropdownTypeEnum = DropdownTypeEnum;
	public PlanoFaIconPool = PlanoFaIconPool;
	public BootstrapSize = BootstrapSize;
	public PBtnThemeEnum = PBtnThemeEnum;
	public SectionWhitespace = SectionWhitespace;
	public PThemeEnum = PThemeEnum;
	public TransactionsSortedByEmum = TransactionsSortedByEmum;
	public SchedulingApiBookingState = SchedulingApiBookingState;
	public PTabSizeEnum = PTabSizeEnum;
	public PTabsTheme = PTabsTheme;
	public Config = Config;

	public transactionFormGroup = new PFormGroup({});

	public ngOnInit() : void {
		this.getItem();
	}

	/**
	 * Get id from route
	 */
	public get routeId() : Id | null {
		const ID_AS_STRING = this.activatedRoute.snapshot.paramMap.get('id');
		if (ID_AS_STRING === '0') return null;
		if (ID_AS_STRING === null) return null;
		return Id.create(+ID_AS_STRING);
	}

	/**
	 * Get Item for this detail page
	 */
	public getItem() : void {
		if (this.getByRouteId()) return;

		// Make sure we have some data as basis for this item
		if (!this.api.isLoaded()) {
			this.schedulingUrlParams.updateQueryParams();
			this.api.load({
				searchParams: this.schedulingUrlParams.queryParams,
				success: () => {
					if (this.getByRouteId()) return;
					this.createNewItem();
				},
			});
		} else {
			this.createNewItem();
		}
	}

	/**
 * Create new item which than can be filled with data from the form
 */
	public createNewItem() : void {
		this.pDetailFormUtilsService.createNewItem(this.api, this.api.data.vouchers, this.schedulingUrlParams,
			(item) => {
				this.item = item;
			},
		);
	}

	/**
	 * Get the item by the provided id
	 */
	private getByRouteId() : boolean {
		if (!this.routeId) return false;
		let item = this.api.data.vouchers.get(this.routeId);
		if (!item) {
			SchedulingApiVoucher.loadDetailed(this.api, this.routeId, {
				success: () => {
					if (this.routeId === null) throw new Error('routeId could not be determined');
					item = this.api.data.vouchers.get(this.routeId);
					if (item === null) {
						this.console.warn(`Could not find item »${this.routeId.toString()}« in ${this.api.data.vouchers.length} (T.loadDetailed)`);
						return;
					}
					this.item = item;
				},
			});
			return true;
		}
		if (item.isNewItem()) {
			this.item = item;
			return true;
		}

		item.loadDetailed({
			success: () => {
				if (item === null) throw new Error('Item should have been available after item.loadDetailed');
				this.item = item;
			},
		});
		return true;
	}

	public ngOnDestroy() : void {
		this.pDetailFormUtilsService.onDestroy(this.api);
	}

	/**
	 * Save the provided new item to the database
	 */
	public saveNewItem(item : SchedulingApiVoucher) : void {
		this.pDetailFormUtilsService.saveNewItem(this.api, item, this.localize.transform('Gutschein'));
	}

	/**
	 * Handle Click on delete button
	 */
	public onRemoveClick() : void {
		assumeNonNull(this.item);
		this.pDetailFormUtilsService.onRemoveClick({
			modalTitle: this.localize.transform('Sicher?'),
			description: this.localize.transform('Willst du diesen Gutschein wirklich löschen?'),
			api: this.api,
			items: this.api.data.vouchers,
			item: this.item,
		});
	}

	/**
	 * The total incoming payments for this booking
	 */
	public get incomingPayments() : number | null {
		return this.api.data.transactions.totalIncomingPayments;
	}

	/**
	 * The total outgoing payments for this booking
	 */
	public get outgoingPayments() : number | null {
		return this.api.data.transactions.totalOutgoingPayments;
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
		// set bookings to be exported
		this.exportTransactionsApi.setEmptyData();

		assumeNonNull(this.item);
		for (const transaction of this.item.transactions.iterable()) {
			this.exportTransactionsApi.data.transactionIds.createNewItem(transaction.id);
		}

		// get query params
		const startMillis = this.item.dateOfBooking;
		const endMillis = Date.now();

		const queryParams = new HttpParams()
			.set('start', (startMillis).toString())
			.set('end', (endMillis).toString())
			.set('bookingNumber', this.item.bookingNumber).set('format', format);

		// cSpell:ignore zahlungsexport_buchung
		const fileName = this.pExport.getFileName(`${this.localize.transform('zahlungsexport_buchung')}${this.item.bookingNumber}`, startMillis, endMillis - 1);

		// download file
		if (format === 'csv') {
			this.modalService.info(
				{
					modalTitle: 'CSV-Export',
					description: `<h4>${this.localize.transform('Microsoft Excel')}</h4>${this.localize.transform('Falls du die CSV-Datei mit <strong>Microsoft Excel</strong> öffnen möchtest, klicke bitte in Excel bei der Registerkarte <mark>Daten</mark> auf den Knopf <mark>Aus Text/CSV</mark> und folge anschließend den Hinweisen, um die Daten zu laden. <br>Wir raten dir davon ab, die CSV-Datei direkt <strong>per Doppelklick</strong> in Excel zu öffnen, da manche Excel-Versionen die Formatierung der CSV-Datei verändern und die Datei unbrauchbar machen könnten.')}`, // description,
				},
				() => {
					// okay pressed
					this.exportIsRunning = true;
					this.exportTransactionsApi.downloadFile(fileName, format, queryParams, 'PUT', () => {
						this.exportIsRunning = false;
					});
				},
			);
		} else {
			this.exportIsRunning = true;
			this.exportTransactionsApi.downloadFile(fileName, format, queryParams, 'PUT', () => {
				this.exportIsRunning = false;
			});
		}
	}

	/**
	 * Navigate to detail-page of given transaction
	 */
	public navToTransaction(id : Id) : void {
		this.pRouterService.navigate([`client/transaction/${id.toString()}`]);
	}

	/**
	 * Navigate to a specific anchor
	 */
	public navToAnchorBeforeTransactionListIntroductionHint() : void {
		assumeNonNull(this.item);
		this.pRouterService.navigate(['/client/gift-card', this.item.id.toString(), 'transactions'], {fragment: 'beforeTransactionListIntroductionHint'});
	}

	/**
	 * Get all transactions that should be visible in the list.
	 */
	public get transactionsForList() : SchedulingApiTransactions {
		assumeNonNull(this.item);
		return this.item.transactions.filterBy(item => !item.isNewItem());
	}

	/**
	 * Get a fitting label, based on params from the form.
	 */
	public get newTransactionFormLabel() : string {
		assumeNonNull(this.item);
		return this.localize.transform(SchedulingApiBookable.newTransactionFormLabel(this.item));
	}

	/**
	 * Get a fitting close button label, based on params from the form.
	 */
	public get newTransactionFormCloseBtnLabel() : string {
		if (!this.item) {
			this.console.error('Can not determine the right text for button');
			return this.localize.transform('Speichern');
		}
		const source = SchedulingApiBookable.newTransactionFormCloseBtnLabel(this.item);
		return this.localize.transform(source);
	}

	private openCancellationFeeFormModal(
		success : () => void,
		dismiss : (transaction : SchedulingApiTransaction) => void,
		closeBtnLabel : ModalContentOptions['closeBtnLabel'] = null,
		modalVersion : BookingTransactionFormComponent['modalVersion'],
	) : void {
		this.modalService.openDefaultModal({
			contentTemplateRef: this.bookingTransactionFormModal,
			contentTemplateContext: { modalVersion: modalVersion },
			dismissBtnLabel: this.localizePipe.transform('Verwerfen'),
			closeBtnLabel: closeBtnLabel,
			closeBtnDisabled: () => !(this.transactionFormGroup.get('transaction') && this.transactionFormGroup.get('transaction')?.valid),
			closeBtnTheme: PThemeEnum.DANGER,
			modalTitle: this.localizePipe.transform('Storno'),
			hideDismissBtn: false,
		}, {
			size: BootstrapSize.LG,
			success: success,
			dismiss: dismiss,
		});
	}


	/**
	 * Open modal for a new transaction.
	 */
	public onTransactionBtnClick() : void {
		this.openCancellationFeeFormModal(
			() => {
				assumeNonNull(this.item);
				if (!this.item.isNewItem()) this.api.save();
			},
			() => {
				assumeNonNull(this.item);
				assumeNonNull(this.item.api, 'this.item.api');
				// We can not
				// remove the transaction inside the form inside the modal, since the form does not know why it gets destroyed (dismiss or close).
				// We can not
				// create the transaction outside the form, since some transaction have to be created, when the modal is already open
				// So we have to remove the latest transaction
				this.item.api.data.transactions.remove(this.item.transactions.length - 1);
			},
			() => this.newTransactionFormCloseBtnLabel,
			'ADD_TRANSACTION',
		);
		this.transactionFormGroup.updateValueAndValidity();
	}

	/**
	 * Navigate to related FAQ pages
	 */
	public navToFaq() : void {
		this.pRouterService.navigate(['client/plugin/faq-online-payment']);
	}

	/** @see SchedulingApiBookable['showFaqBtn'] */
	public get showFaqBtn() : boolean {
		if (!this.api.isLoaded()) return false;
		return SchedulingApiBookable.showFaqBtn(this.item ?? null, this.api.data.isOnlinePaymentAvailable);
	}
}

