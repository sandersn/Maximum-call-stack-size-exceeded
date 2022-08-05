import { OnDestroy, OnInit } from '@angular/core';
import { Component, HostBinding, Input, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportUrlParamsService } from '@plano/client/report/report-url-params.service';
import { SchedulingApiService } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeNonNull } from '../../shared/core/null-type-utils';
import { PRouterService } from '../../shared/core/router.service';
import { ScrollTarget } from '../../shared/core/router.service';
import { SchedulingApiWorkingTime } from '../scheduling/shared/api/scheduling-api-working-time.service';
import { BootstrapSize, PBtnThemeEnum } from '../shared/bootstrap-styles.enum';
import { PDetailFormUtilsService } from '../shared/detail-form-utils.service';
import { DropdownTypeEnum } from '../shared/p-forms/p-dropdown/p-dropdown.component';
import { PageWithDetailFormComponentInterface } from '../shared/page-with-detail-form-component.interface';

@Component({
	selector: 'p-workingtime',
	templateUrl: './workingtime.component.html',
	styleUrls: ['./workingtime.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class WorkingtimeComponent implements OnInit, OnDestroy, PageWithDetailFormComponentInterface<SchedulingApiWorkingTime> {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.flex-column') protected _alwaysTrue = true;

	@Input() public item : SchedulingApiWorkingTime | null = null;

	constructor(
		private route : ActivatedRoute,
		public api : SchedulingApiService,
		private reportUrlParamsService : ReportUrlParamsService,
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
	 * Check if url has id
	 */
	public get routeHasId() : boolean {
		return this.route.snapshot.paramMap.has('id') && !!+this.route.snapshot.paramMap.get('id')!;
	}

	/**
	 * Get id from url
	 */
	public get routeId() : Id | null {
		const ID_AS_STRING = this.route.snapshot.paramMap.get('id');
		if (ID_AS_STRING === '0') return null;
		if (ID_AS_STRING === null) return null;
		return Id.create(+ID_AS_STRING);
	}

	/**
	 * Get the item by the provided id
	 */
	private getByRouteId() : boolean {
		if (!this.routeId) return false;
		let item = this.api.data.workingTimes.get(this.routeId);
		if (!item) {
			SchedulingApiWorkingTime.loadDetailed(this.api, this.routeId, {
				success: () => {
					if (this.routeId === null) throw new Error('routeId could not be determined');
					item = this.api.data.workingTimes.get(this.routeId);
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

	/**
	 * Get Item for this detail page
	 */
	public getItem() : void {
		if (this.getByRouteId()) return;

		// Make sure we have some data as basis for this item
		if (!this.api.isLoaded()) {
			this.reportUrlParamsService.updateQueryParams();
			this.api.load({
				searchParams: this.reportUrlParamsService.queryParams,
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
		this.pDetailFormUtilsService.createNewItem(
			this.api,
			this.api.data.workingTimes,
			this.reportUrlParamsService,
			(item) => this.item = item,
		);
	}

	public ngOnDestroy() : void {
		this.pDetailFormUtilsService.onDestroy(this.api);
	}

	/**
	 * Save the provided new item to the database
	 */
	public saveNewItem(item : SchedulingApiWorkingTime) : void {
		this.pDetailFormUtilsService.saveNewItem(this.api, item, this.localize.transform('Arbeitseinsatz'));
	}

	/**
	 * Handle Click on delete button
	 */
	public onRemoveClick() : void {
		assumeNonNull(this.item);
		this.pDetailFormUtilsService.onRemoveClick({
			modalTitle: this.localize.transform('Sicher?'),
			description: this.localize.transform('Willst du diesen Arbeitseinsatz wirklich löschen?'),
			api: this.api,
			items: this.api.data.workingTimes,
			item: this.item,
		});
	}

	/**
	 * When user clicked »Back«
	 */
	public onNavBack() : void {
		const onDataLoadStartSubscriber = this.api.onDataLoadStart.subscribe(() => {
			// eslint-disable-next-line rxjs/no-nested-subscribe
			const onDataLoadSubscriber = this.api.onDataLoaded.subscribe(() => {
				if (this.routeId !== null) this.pRouterService.scrollToSelector(`#scroll-target-id-${this.routeId.toString()}` as ScrollTarget);
				onDataLoadStartSubscriber.unsubscribe();
				onDataLoadSubscriber.unsubscribe();
			});
		});
	}
}
