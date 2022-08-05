import { OnInit, OnDestroy } from '@angular/core';
import { Component, HostBinding, ChangeDetectionStrategy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiCustomBookableMail } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeNonNull } from '../../shared/core/null-type-utils';
import { PRouterService } from '../../shared/core/router.service';
import { BootstrapSize, PBtnThemeEnum } from '../shared/bootstrap-styles.enum';
import { PDetailFormUtilsService } from '../shared/detail-form-utils.service';
import { DropdownTypeEnum } from '../shared/p-forms/p-dropdown/p-dropdown.component';
import { PageWithDetailFormComponentInterface } from '../shared/page-with-detail-form-component.interface';

@Component({
	selector: 'p-email',
	templateUrl: './email.component.html',
	styleUrls: ['./email.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class EmailComponent implements OnInit, OnDestroy, PageWithDetailFormComponentInterface<SchedulingApiCustomBookableMail> {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.flex-column') protected _alwaysTrue = true;

	@Input() public item : SchedulingApiCustomBookableMail | null = null;

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
		this.pDetailFormUtilsService.createNewItem(this.api, this.api.data.customBookableMails, this.schedulingUrlParams,
			(item) => {
				this.item = item;
			},
		);
	}

	/**
	 * Get the item by the provided id
	 */
	private getByRouteId() : boolean {
		if (this.routeId === null) return false;
		let item = this.api.data.customBookableMails.get(this.routeId);
		if (!item) {
			SchedulingApiCustomBookableMail.loadDetailed(this.api, this.routeId, {
				success: () => {
					if (this.routeId === null) throw new Error('routeId could not be determined');
					item = this.api.data.customBookableMails.get(this.routeId);
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
	public saveNewItem(item : SchedulingApiCustomBookableMail) : void {
		this.pDetailFormUtilsService.saveNewItem(this.api, item, this.localize.transform('Email'));
	}

	/**
	 * Handle Click on delete button
	 */
	public onRemoveClick() : void {
		assumeNonNull(this.item);
		this.pDetailFormUtilsService.onRemoveClick({
			modalTitle: this.localize.transform('Sicher?'),
			description: this.localize.transform('Willst du die ${itemName} wirklich löschen?', {
				itemName: this.item.name && !!this.item.name.length ? this.localize.transform('Email-Vorlage »${name}«', {name: this.item.name}) : this.localize.transform('neue Email-Vorlage'),
			}),
			api: this.api,
			items: this.api.data.customBookableMails,
			item: this.item,
		});
	}

}
