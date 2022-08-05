import { Subscription } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import { Component, HostBinding, ChangeDetectionStrategy, Input } from '@angular/core';
import { Params } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PDetailFormUtilsService } from '@plano/client/shared/detail-form-utils.service';
import { DropdownTypeEnum } from '@plano/client/shared/p-forms/p-dropdown/p-dropdown.component';
import { PageWithDetailFormComponentInterface } from '@plano/client/shared/page-with-detail-form-component.interface';
import { SchedulingApiService, SchedulingApiTransaction, SchedulingApiTransactionPaymentMethodType } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeNonNull } from '../../shared/core/null-type-utils';
import { PRouterService } from '../../shared/core/router.service';
import { TransactionsSortedByEmum } from '../sales/transactions/transactions.component';
import { SectionWhitespace } from '../shared/page/section/section.component';

@Component({
	selector: 'p-transaction',
	templateUrl: './transaction.component.html',
	styleUrls: ['./transaction.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class TransactionComponent implements OnInit, OnDestroy, PageWithDetailFormComponentInterface<SchedulingApiTransaction> {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.flex-column') protected _alwaysTrue = true;

	@Input() public item : SchedulingApiTransaction | null = null;

	constructor(
		private activatedRoute : ActivatedRoute,
		public api : SchedulingApiService,
		private schedulingUrlParams : SchedulingService,
		private pDetailFormUtilsService : PDetailFormUtilsService,
		private localize : LocalizePipe,
		public pRouterService : PRouterService,
	) {
	}

	public DropdownTypeEnum = DropdownTypeEnum;
	public PlanoFaIconPool = PlanoFaIconPool;
	public BootstrapSize = BootstrapSize;
	public PBtnThemeEnum = PBtnThemeEnum;
	public SectionWhitespace = SectionWhitespace;
	public PThemeEnum = PThemeEnum;
	public TransactionsSortedByEmum = TransactionsSortedByEmum;
	public SchedulingApiTransactionPaymentMethodType = SchedulingApiTransactionPaymentMethodType;

	public ngOnInit() : void {
		this.initComponent();
		this.activatedRouteParamsSubscriber = this.activatedRoute.params.subscribe(value => {
			this.reInitComponentIfIfChanged(value);
		});
	}

	private activatedRouteParamsSubscriber : Subscription | null = null;

	/**
	 * Load and set everything that is necessary for this component
	 */
	public initComponent() : void {
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

	private reInitComponentIfIfChanged(value : Params) : void {
		if (!this.item) return;
		if (!(+value['id'])) return;
		if (this.item.id.equals(value['id'])) return;

		// HACK: This is necessary as long as we don’t have a CanDeactivate guard [PLANO-24415]
		if (this.api.hasDataCopy()) this.api.dismissDataCopy();

		this.item = null;
		this.initComponent();
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
		this.pDetailFormUtilsService.createNewItem(this.api, this.api.data.transactions, this.schedulingUrlParams,
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
		let item = this.api.data.transactions.get(this.routeId);
		if (!item) {
			SchedulingApiTransaction.loadDetailed(this.api, this.routeId, {
				success: () => {
					if (this.routeId === null) throw new Error('routeId could not be determined');
					item = this.api.data.transactions.get(this.routeId);
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
		this.activatedRouteParamsSubscriber?.unsubscribe();
	}

	/**
	 * Save the provided new item to the database
	 */
	public saveNewItem(item : SchedulingApiTransaction) : void {
		this.pDetailFormUtilsService.saveNewItem(this.api, item, this.localize.transform('Email'));
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
	 * Navigate to related FAQ pages
	 */
	public navToFaq() : void {
		this.pRouterService.navigate(['client/plugin/faq-online-payment']);
	}
}
