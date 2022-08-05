
import { Subscription } from 'rxjs';
import { OnInit, OnDestroy } from '@angular/core';
import { Component, HostBinding, ChangeDetectionStrategy, Input } from '@angular/core';
import { Params } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { PWishesService } from '@plano/client/scheduling/wishes.service';
import { SchedulingApiMembers} from '@plano/shared/api';
import { RightsService, SchedulingApiMember, SchedulingApiRightGroupRole } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { PComponentInterface } from '@plano/shared/core/interfaces/component.interface';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../shared/core/null-type-utils';
import { PRouterService } from '../../shared/core/router.service';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '../shared/bootstrap-styles.enum';
import { PDetailFormUtilsService } from '../shared/detail-form-utils.service';
import { DropdownTypeEnum } from '../shared/p-forms/p-dropdown/p-dropdown.component';
import { PageWithDetailFormComponentInterface } from '../shared/page-with-detail-form-component.interface';

@Component({
	selector: 'p-member',
	templateUrl: './member.component.html',
	styleUrls: ['./member.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class MemberComponent implements OnInit, OnDestroy, PageWithDetailFormComponentInterface<SchedulingApiMember>, PComponentInterface {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.flex-column') protected _alwaysTrue = true;

	@Input() public item : SchedulingApiMember | null = null;

	constructor(
		private api : SchedulingApiService,
		private schedulingUrlParams : SchedulingService,
		private pWishesService : PWishesService,
		private pDetailFormUtilsService : PDetailFormUtilsService,
		private activatedRoute : ActivatedRoute,
		private localize : LocalizePipe,
		private rightsService : RightsService,
		private modalService : ModalService,
		public pRouterService : PRouterService,
	) {
	}

	public DropdownTypeEnum = DropdownTypeEnum;
	public PlanoFaIconPool = PlanoFaIconPool;
	public BootstrapSize = BootstrapSize;
	public PBtnThemeEnum = PBtnThemeEnum;

	private activatedRouteSubscription : Subscription | null = null;

	public ngOnInit() : void {
		this.initComponent();
		this.activatedRouteSubscription = this.activatedRoute.params.subscribe(value => {
			this.reInitComponentIfIfChanged(value);
		});
	}

	private reInitComponentIfIfChanged(params : Params) : void {
		if (!this.item) return;
		assumeDefinedToGetStrictNullChecksRunning(params, 'params');
		if (!(+params['id'])) return;
		if (this.item.id.equals(params['id'])) return;

		// HACK: This is necessary as long as we don’t have a CanDeactivate guard [PLANO-24415]
		if (this.api.hasDataCopy()) this.api.dismissDataCopy();

		this.item = null;
		this.initComponent();
	}

	/**
	 * Load and set everything that is necessary for this component
	 */
	public initComponent() : void {
		this.getItem();
		this.initWishes();
	}

	private initWishes() : void {
		this.pWishesService.item = this.item;
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
	 * If id is available load the item
	 * Else create a new item by provided shiftmodel
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
	 * Create a new item for a member, which then can be filled with data from the detail-form
	 */
	/**
 * Create new item which than can be filled with data from the form
 */
	public createNewItem() : void {
		this.pDetailFormUtilsService.createNewItem(this.api, this.api.data.members, this.schedulingUrlParams, item => {
			this.item = item;
		});
	}

	/**
	 * Get the item by the provided id
	 */
	private getByRouteId() : boolean {
		if (!this.routeId) return false;
		let item = this.api.data.members.get(this.routeId);
		if (!item) {
			SchedulingApiMember.loadDetailed(this.api, this.routeId, {
				success: () => {
					if (this.routeId === null) throw new Error('routeId could not be determined');
					item = this.api.data.members.get(this.routeId);
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
		this.pWishesService.resetToPreviousItem();
		this.activatedRouteSubscription?.unsubscribe();
	}

	/**
	 * Save the provided new item to the database
	 */
	public saveNewItem(item : SchedulingApiMember) : void {
		this.pDetailFormUtilsService.saveNewItem(this.api, item, `${this.localize.transform('Der User-Account')}`);
	}

	/**
	 * Shorthand to make it possible to make api private.
	 */
	public get isBackendOperationRunning() : boolean {
		return this.api.isBackendOperationRunning;
	}

	/**
	 * Handle Click on delete button
	 */
	public onRemoveClick() : void {
		if (this.deletingIsDisabled) {
			this.modalService.openDefaultModal({
				modalTitle: this.localize.transform('Vorgang nicht möglich'),
				description: this.localize.transform('Dieser User kann aktuell nicht gelöscht werden, da es keinen weiteren User mit Admin-Rechten gibt. Es muss immer mindestens ein Admin vorhanden sein.'),
			}, {
				size: 'sm',
				theme: PThemeEnum.WARNING,
				centered: true,
			});
			return;
		}

		assumeNonNull(this.item);
		this.pDetailFormUtilsService.onRemoveClick({
			modalTitle: this.localize.transform('Sicher?'),
			description: `${this.localize.transform('Willst du den Account von ${firstName} ${lastName} wirklich löschen?', {
				firstName: this.item.firstName,
				lastName: this.item.lastName,
			})}<br>${this.localize.transform('Keine Sorge! Gelöschte User werden nicht aus den vergangenen Schichten entfernt. Außerdem kannst du weiterhin auf ihre Auswertungsdaten zugreifen.')}`,
			api: this.api,
			items: this.api.data.members,
			item: this.item,
			removeItemFn: (done) => {
				assumeNonNull(this.item);
				this.item.trashed = true;
				done();
			},
		});
	}

	/**
	 * It causes a lot of trouble if the last admin deletes his own account.
	 * So ... prevent that.
	 */
	public get deletingIsDisabled() : boolean {
		if (!this.item) return true;
		if (this.item.role !== SchedulingApiRightGroupRole.CLIENT_OWNER) return false;
		if (this.allAdmins.length !== 1) return false;

		return true;
	}

	/**
	 * Get a list of all current Admins
	 */
	public get allAdmins() : SchedulingApiMembers {
		return this.api.data.members.filterBy(item => {
			if (item.role !== SchedulingApiRightGroupRole.CLIENT_OWNER) return false;
			if (item.trashed) return false;
			return true;
		});
	}

	/** isLoading */
	public get isLoading() : PComponentInterface['isLoading'] {
		if (!this.api.isLoaded()) return true;
		if (!this.item) return true;
		return false;
	}

	/**
	 * Not everyone can delete Members
	 */
	public get showDeleteSection() : boolean {
		if (this.isLoading) return false;
		if (!this.rightsService.isOwner) return false;
		assumeNonNull(this.item);
		if (this.item.isNewItem()) return false;
		if (Config.IS_MOBILE) return false;
		if (this.item.trashed) return false;
		return true;
	}

}
