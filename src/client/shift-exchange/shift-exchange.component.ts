import { AfterContentChecked, OnDestroy, OnInit } from '@angular/core';
import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SchedulingApiService, SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiShiftExchange } from '@plano/shared/api';
import { ShiftId } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { assumeNonNull } from '@plano/shared/core/null-type-utils';
import { PRequestWebPushNotificationPermissionContext, PPushNotificationsService } from '@plano/shared/core/p-push-notifications.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '../../shared/core/router.service';
import { BootstrapSize, PBtnThemeEnum } from '../shared/bootstrap-styles.enum';
import { PDetailFormUtilsService } from '../shared/detail-form-utils.service';
import { DropdownTypeEnum } from '../shared/p-forms/p-dropdown/p-dropdown.component';
import { PMomentService } from '../shared/p-moment.service';
import { PageWithDetailFormComponentInterface } from '../shared/page-with-detail-form-component.interface';
import { ShiftExchangesService } from '../shift-exchanges/shift-exchanges.service';

@Component({
	selector: 'p-shift-exchange',
	templateUrl: './shift-exchange.component.html',
	styleUrls: ['./shift-exchange.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class ShiftExchangeComponent
implements AfterContentChecked, OnInit, OnDestroy, PageWithDetailFormComponentInterface<SchedulingApiShiftExchange> {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.flex-column') protected _alwaysTrue = true;

	public item : SchedulingApiShiftExchange | null = null;
	private now ! : number;

	constructor(
		private route : ActivatedRoute,
		public api : SchedulingApiService,
		private activatedRoute : ActivatedRoute,
		private shiftExchangesService : ShiftExchangesService,
		private rightsService : RightsService,
		private pDetailFormUtilsService : PDetailFormUtilsService,
		private meService : MeService,
		private pPushNotificationsService : PPushNotificationsService,
		private console : LogService,
		private localize : LocalizePipe,
		private pMoment : PMomentService,
		public pRouterService : PRouterService,
	) {
		// update shift-exchange warnings on change
		this.api.enableAutomaticWarningsUpdateOnChange(	[
			'isIllness',
			'indisposedMemberId',
			'indisposedMemberPrefersSwapping',
			'memberIdAddressedTo',
			'openShiftExchange',
			'performAction',
			'shiftRefs',
			'swapOffers',
			'dismissCopy', // update warnings when changes are dismissed
		]);
	}

	public DropdownTypeEnum = DropdownTypeEnum;
	public PlanoFaIconPool = PlanoFaIconPool;
	public BootstrapSize = BootstrapSize;
	public PBtnThemeEnum = PBtnThemeEnum;

	public ngAfterContentChecked() : void {
		this.now = +this.pMoment.m();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get deadlineIsInThePast() : boolean {
		if (!this.item) return false;
		if (!this.item.rawData) return false;
		if (!this.item.deadline) return false;

		if (this.item.deadline <= this.now) return true;
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isExpired() : boolean {
		if (!this.item) return false;
		if (this.item.isNewItem()) return false;
		return this.deadlineIsInThePast;
	}

	/**
	 * Check if this component is fully loaded.
	 * Can be used to show skeletons/spinners then false.
	 */
	public get isLoaded() : boolean {
		if (!this.api.isLoaded()) return false;
		// The item will be null if it could not be found
		if (this.item === null) return true;
		if (this.routeHasId && !this.item.rawData) return false;
		if (this.routeShiftId) return false;
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get itemIsValid() : boolean {
		if (!this.item) return false;
		if (!this.item.rawData) return false;
		return true;
	}

	public ngOnInit() : void {
		this.getItem();
	}

	/**
	 * Get the item by the provided id
	 */
	private getByRouteId() : boolean {
		if (!this.routeHasId) return false;
		let item = this.api.data.shiftExchanges.get(this.routeId);
		if (!item) {
			SchedulingApiShiftExchange.loadDetailed(this.api, this.routeId!, {
				success: () => {
					if (this.routeId === null) throw new Error('routeId could not be determined');
					item = this.api.data.shiftExchanges.get(this.routeId);
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

	private get initialIndisposedMember() : Id {
		if (Config.DEBUG && !this.meService.isLoaded()) throw new Error('MeService must be loaded here.');
		return this.meService.data.id;
	}

	/**
 * Create new item which than can be filled with data from the form
 */
	public createNewItem() : void {
		this.console.debug('TODO: Not implemented yet');
	}

	private createNewItemWithSomeDataIfShiftIdProvided(shiftId ?: ShiftId) : SchedulingApiShiftExchange {
		this.api.createDataCopy();
		const item = this.api.data.shiftExchanges.createNewItem();

		if (this.routeMemberId) item.indisposedMemberId = this.routeMemberId;

		if (!item.attributeInfoIndisposedMemberId.value) {
			item.indisposedMemberId = this.initialIndisposedMember;
		}

		/** If manager creates a shift-exchange for someone else it can only be a illness */
		if (!this.rightsService.isMe(item.indisposedMemberId)) item.isIllness = true;

		if (shiftId) item.shiftRefs.createNewItem(shiftId);
		return item;
	}

	/**
	 * Create new item by the provided ShiftId
	 */
	private createByRouteShiftId() : boolean {
		// User navigated from e.g. shift-tooltip to this "Create Shift Exchange" form
		if (!this.routeShiftId) return false;

		SchedulingApiShift.loadDetailed(this.api, this.routeShiftId, {
			success: () => {
				this.item = this.createNewItemWithSomeDataIfShiftIdProvided(this.routeShiftId);
			},
		});

		return true;
	}

	/**
	 * Check if url has id
	 */
	public get routeHasId() : boolean {
		return this.route.snapshot.paramMap.has('id') && !!+this.route.snapshot.paramMap.get('id')!;
	}

	/**
	 * Check if url has shiftId
	 */
	public get routeShiftId() : ShiftId | undefined {
		if (!this.route.snapshot.paramMap.has('shiftId')) return undefined;
		const idAsString = this.route.snapshot.paramMap.get('shiftId');
		if (idAsString === '0') return undefined;
		assumeNonNull(idAsString);
		return ShiftId.fromUrl(idAsString);
	}

	/**
	 * Check if url has memberId
	 */
	public get routeMemberId() : Id | undefined {
		if (!this.route.snapshot.paramMap.has('memberId')) return undefined;
		const idAsString = this.route.snapshot.paramMap.get('memberId');
		if (idAsString === '0') return undefined;
		assumeNonNull(idAsString);
		return Id.create(+idAsString);
	}

	/**
	 * Get Item for this detail page
	 * If id is available load the item
	 * Else create a new item by shift id
	 */
	public getItem() : void {
		if (this.getByRouteId()) return;
		if (this.createByRouteShiftId()) return;

		// Make sure we have some data as basis for this item
		if (!this.api.isLoaded()) {
			this.shiftExchangesService.updateQueryParams();
			assumeNonNull(this.shiftExchangesService.queryParams);
			this.api.load({
				searchParams: this.shiftExchangesService.queryParams,
				success: () => {
					if (this.getByRouteId()) return;
					if (this.createByRouteShiftId()) return;
					this.item = this.createNewItemWithSomeDataIfShiftIdProvided();
				},
			});
		} else {
			this.item = this.createNewItemWithSomeDataIfShiftIdProvided();
		}
	}

	/**
	 * Check if url has id
	 */
	public get routeId() : Id | null {
		if (!this.activatedRoute.snapshot.paramMap.has('id')) return null;
		const ID_AS_STRING = this.activatedRoute.snapshot.paramMap.get('id');
		if (ID_AS_STRING === '0') return null;
		if (ID_AS_STRING === null) return null;
		return Id.create(+ID_AS_STRING);

	}

	public ngOnDestroy() : void {
		this.pDetailFormUtilsService.onDestroy(this.api);

		this.api.disableAutomaticWarningsUpdateOnChange();
	}

	private askForNotificationPermissionIfNecessary() : void {
		this.pPushNotificationsService.requestWebPushNotificationPermission(
			PRequestWebPushNotificationPermissionContext.SHIFT_EXCHANGE_CREATED,
		);
	}

	/**
	 * Save the provided new item to the database
	 */
	public saveNewItem(item : SchedulingApiShiftExchange) : void {
		this.askForNotificationPermissionIfNecessary();
		this.pDetailFormUtilsService.saveNewItem(this.api, item, item.isIllness ? this.localize.transform('Krankmeldung') : this.localize.transform('Ersatzsuche'), undefined, true);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public dismissReOpen() : void {
		// TODO: Obsolete?
		if (this.item && this.item.behavesAsNewItem === true) {
			this.item.behavesAsNewItem = false;
		}

		if (this.api.hasDataCopy()) {
			this.api.dismissDataCopy();

		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public reOpenForm() : void {
		this.api.createDataCopy();
		assumeNonNull(this.item);
		this.item.openShiftExchange = true;
		this.item.deadline = null;
		this.item.behavesAsNewItem = true;
	}

	/**
	 * Handle Click on delete button
	 */
	public onRemoveClick() : void {
		assumeNonNull(this.item);
		this.pDetailFormUtilsService.onRemoveClick({
			modalTitle: this.localize.transform('Sicher?'),
			description: `${this.localize.transform('Willst du diesen Tauschbörse-Eintrag wirklich löschen?')}<br>${this.localize.transform('${others} automatisch benachrichtigt. Du musst weiter nichts tun.', {
				others: this.localize.transform(this.item.isIllness && !this.item.isBasedOnIllness ? 'Deine Personalleitung wird' : 'Deine Mitarbeitenden werden'),
			})}`,
			api: this.api,
			items: this.api.data.shiftExchanges,
			item: this.item,
			removeItemFn: (done) => {
				assumeNonNull(this.item);
				this.item.closeShiftExchange = true;
				done();
			},
		});
	}
}
