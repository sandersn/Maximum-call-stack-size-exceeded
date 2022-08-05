import { OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Component, HostBinding, ChangeDetectionStrategy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { PWishesService } from '@plano/client/scheduling/wishes.service';
import { PMoment } from '@plano/client/shared/p-moment.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { RightsService, SchedulingApiShift, SchedulingApiShiftModel } from '@plano/shared/api';
import { SchedulingApiShiftModels } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { ShiftId } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { SchedulingApiCourseType } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PRequestWebPushNotificationPermissionContext, PPushNotificationsService } from '@plano/shared/core/p-push-notifications.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { ScrollTarget } from '@plano/shared/core/router.service';
import { PRouterService } from '@plano/shared/core/router.service';
import { ShiftModalSizes } from './shift-modal-sizes';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../shared/core/null-type-utils';
import { LocalizePipe } from '../../shared/core/pipe/localize.pipe';
import { PScrollToSelectorService } from '../../shared/core/scroll-to-selector.service';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '../shared/bootstrap-styles.enum';
import { PDetailFormUtilsService } from '../shared/detail-form-utils.service';
import { DropdownTypeEnum } from '../shared/p-forms/p-dropdown/p-dropdown.component';
import { PageWithDetailFormComponentInterface } from '../shared/page-with-detail-form-component.interface';

@Component({
	selector: 'p-shift',
	templateUrl: './shift.component.html',
	styleUrls: ['./shift.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class ShiftComponent implements OnInit, OnDestroy, PageWithDetailFormComponentInterface<SchedulingApiShift> {
	@HostBinding('class.flex-grow-1')
	@HostBinding('class.d-flex')
	@HostBinding('class.flex-column') protected _alwaysTrue = true;

	// NOTE: I think this does not need to be an @Input() ^nn
	@Input() public item : SchedulingApiShift | null = null;

	constructor(
		private activatedRoute : ActivatedRoute,
		public api : SchedulingApiService,
		private schedulingUrlParams : SchedulingService,
		private meService : MeService,
		private pWishesService : PWishesService,
		private pRouterService : PRouterService,
		private pDetailFormUtilsService : PDetailFormUtilsService,
		private pPushNotificationsService : PPushNotificationsService,
		private pMoment : PMomentService,
		private rightsService : RightsService,
		private modalService : ModalService,
		private localize : LocalizePipe,
		private pScrollToSelectorService : PScrollToSelectorService,
	) {
	}

	public DropdownTypeEnum = DropdownTypeEnum;
	public PlanoFaIconPool = PlanoFaIconPool;
	public BootstrapSize = BootstrapSize;
	public PBtnThemeEnum = PBtnThemeEnum;
	public PThemeEnum = PThemeEnum;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get itemNotFound() : boolean {
		return !this.item && !!this.routeId && !this.api.isBackendOperationRunning;
	}

	public ngOnInit() : void {
		this.initComponent();
	}

	/**
	 * Load and set everything that is necessary for this component
	 */
	public initComponent(id : Id | null = null) : void {
		this.getRouteShiftModelId(id);
		this.getItem();
		this.api.isLoaded(() => {
			this.getWritableShiftModelsForMember();
		});
		this.initWishes();
	}

	private initWishes() : void {
		this.pWishesService.item = this.item ?? null;
	}

	public ngOnDestroy() : void {
		this.pDetailFormUtilsService.onDestroy(this.api);
		this.pWishesService.resetToPreviousItem();
	}

	/**
	 * Get id from url
	 */
	private get routeId() : ShiftId | null {
		if (!this.activatedRoute.snapshot.paramMap.has('id')) return null;
		const paramId = this.activatedRoute.snapshot.paramMap.get('id');
		if (paramId === '0') return null;
		if (paramId === null) throw new Error('Param id is allowed to be `0`, but should never be null');
		return ShiftId.fromUrl(paramId);
	}

	public routeShiftModelId : Id | null = null;

	/**
	 * Check if url has shiftModelId
	 */
	public getRouteShiftModelId(id : Id | null = null) : void {
		if (id) {
			this.routeShiftModelId = id;
			return;
		}

		const idAsString = this.activatedRoute.snapshot.paramMap.get('shiftmodelid');
		this.routeShiftModelId = idAsString === null ? null : Id.create(+idAsString);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get routeStartTimestamp() : number | null {
		if (!this.activatedRoute.snapshot.paramMap.has('start')) return null;

		const startParam = this.activatedRoute.snapshot.paramMap.get('start')!;
		return +startParam;
	}

	private get getDefaultTimeForNewShift() : PMoment.Moment | undefined {
		const shiftModel = this.api.data.shiftModels.get(this.routeShiftModelId);
		if (!shiftModel) return undefined;

		// eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
		const timestamp = this.routeStartTimestamp ? this.routeStartTimestamp : undefined;
		// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
		return this.pMoment.m(+this.pMoment.m(timestamp).startOf('day') + shiftModel.time.start);
	}

	/**
	 * Create new item which than can be filled with data from the form
	 */
	public createNewItem() : void {
		// Usually i would create a new item here. But shift is different. I need a shiftModelId first.
	}

	/**
	 * Get the item by the provided id
	 */
	private getByRouteId() : boolean {
		if (!this.routeId) return false;
		let item = this.api.data.shifts.get(this.routeId);
		if (!item) {
			assumeDefinedToGetStrictNullChecksRunning(this.routeId, `routeId`, 'Given id is not defined [PLANO-FE-2RA]');
			SchedulingApiShift.loadDetailed(this.api, this.routeId, {
				success: () => {
					if (this.routeId === null) throw new Error('routeId could not be determined');
					item = this.api.data.shifts.get(this.routeId);
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
	 * Create new item by the provided ShiftId
	 */
	private createByRouteShiftModelId() : boolean {
		// User navigated from e.g. shift-tooltip to this "Create Shift Exchange" form

		if (this.routeShiftModelId === null) return false;

		SchedulingApiShiftModel.loadDetailed(this.api, this.routeShiftModelId, {
			success: () => {
				const timeForNewShift = this.getDefaultTimeForNewShift;

				const shiftModel = this.api.data.shiftModels.get(this.routeShiftModelId);
				if (!shiftModel) return;

				this.api.createDataCopy();
				assumeDefinedToGetStrictNullChecksRunning(timeForNewShift, 'timeForNewShift');
				this.api.data.shifts.createNewShift(shiftModel, timeForNewShift, null, (newShift) => {
					this.item = newShift;
				});
			},
		});

		return true;
	}

	/**
	 * Get Item for this detail page
	 * If id is available load the item
	 * Else create a new item by provided shiftmodel
	 */
	public getItem() : void {

		// if (Config.DEBUG && !this.routeId && !this.routeShiftModelId && this.showShiftModelInputSection !== null) {
		// 	throw new Error('Missing id or shiftModelId in the url');
		// }

		const getIt = () : boolean => {
			if (this.getByRouteId()) return true;
			if (this.createByRouteShiftModelId()) return true;
			return false;
		};

		if (getIt()) return;

		// Make sure we have some data as basis for this item
		if (!this.api.isLoaded()) {
			this.schedulingUrlParams.updateQueryParams();
			this.api.load({
				searchParams: this.schedulingUrlParams.queryParams,
				success: () => {
					if (getIt()) return;
					this.createNewItem();
				},
			});
		} else {
			this.createNewItem();
		}

		this.initWishes();
	}

	/**
	 * Create Item after shiftModel has been selected
	 */
	public onSelectShiftModelId(id : Id | null = null) : void {
		if (this.routeShiftModelId && this.routeShiftModelId.equals(id)) return;

		if (this.item) {
			this.item = null;
			this.api.dismissDataCopy();
		}

		assumeDefinedToGetStrictNullChecksRunning(id, 'id');
		let url = `/client/shift/create/shiftmodel/${id.toString()}`;
		if (this.routeStartTimestamp) url += `/start/${this.routeStartTimestamp}`;
		// const opentab : string = this.activatedRoute.snapshot.paramMap.get('opentab');
		// if (opentab) url += `/${opentab}`;

		this.pRouterService.navigate([url], { replaceUrl: true, queryParamsHandling: 'preserve' });
		this.initComponent(id);
	}

	/**
	 * get all writable shiftModels for the current user.
	 * Needed for the shiftmodel list when creating new shifts.
	 */
	public writableShiftModelsForMember : SchedulingApiShiftModels = new SchedulingApiShiftModels(null, false);
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getWritableShiftModelsForMember() : void {
		this.meService.isLoaded(() => {
			if (this.meService.data.isOwner) {
				this.writableShiftModelsForMember = this.api.data.shiftModels.filterBy(item => !item.trashed);
				return;
			}

			const result : SchedulingApiShiftModels = new SchedulingApiShiftModels(this.api, false);
			const member = this.api.data.members.get(this.meService.data.id);
			assumeDefinedToGetStrictNullChecksRunning(member, 'member');

			for (const shiftModel of this.api.data.shiftModels.iterable()) {
				if (shiftModel.trashed) continue;
				if (!member.canWrite(shiftModel)) continue;
				result.push(shiftModel);
			}
			this.writableShiftModelsForMember = result;
		});
	}

	private askForNotificationPermissionIfNecessary(item : SchedulingApiShift) : void {
		assumeDefinedToGetStrictNullChecksRunning(item.model, 'item.model');
		if (item.model.courseType !== SchedulingApiCourseType.ONLINE_INQUIRY) return;
		this.pPushNotificationsService.requestWebPushNotificationPermission(
			PRequestWebPushNotificationPermissionContext.ONLINE_INQUIRY_SHIFT_CREATED,
		);
	}

	/**
	 * Save the provided new shift to the database
	 */
	public saveNewItem(item : SchedulingApiShift) : void {
		this.askForNotificationPermissionIfNecessary(item);
		this.pDetailFormUtilsService.saveNewItem(this.api, item, `»${item.name}«`);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showShiftModelInputSection() : boolean | null {
		if (!this.api.isLoaded()) return null;
		if (this.routeId) return false;
		if (this.routeShiftModelId) return false;
		return true;
	}

	/**
	 * Handle Click on delete button
	 */
	public onRemoveClick(modalContent : TemplateRef<unknown>) : void {
		this.api.createDataCopy();
		// You would probably expect
		// this.pDetailFormUtilsService.onRemoveClick(…);
		// here, but since we need a change-selectors-modal, things are different.
		this.modalService.openModal(modalContent, {
			success: () => {
				assumeNonNull(this.item);
				this.api.mergeDataCopy();
				this.api.data.shifts.removeItem(this.item);
				this.pRouterService.navBack();
				this.api.save({
					success : () => {
					},
				});
			},
			dismiss: () => {
				this.api.dismissDataCopy();
			},
			size: this.item ? ShiftModalSizes.WITH_TRANSMISSION_PREVIEW : undefined!,
		});
	}

	/**
	 * get showDeleteButton
	 */
	public get showDeleteButton() : boolean | null {
		assumeNonNull(this.item);
		return !Config.IS_MOBILE && (!this.item.isNewItem() && this.rightsService.userCanWrite(this.item.model));
	}

	/**
	 * Is this a shift that can have bookings and is not canceled?
	 */
	public get cancellationSettingsIsPossible() : boolean {
		assumeNonNull(this.item);
		return !this.item.isNewItem() && !!this.item.isCourse && this.item.isCourseCanceled === false;
	}

	/**
	 * When user clicked »Back«
	 */
	public onNavBack() : void {
		if (this.routeId !== null) this.pScrollToSelectorService.scrollToSelector(`#scroll-target-id-${this.routeId.toPrettyString()}` as ScrollTarget);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get basissettingsTabLabel() : string {
		return this.localize.transform('Grundeinstellungen');
	}

	public selectedShiftModelToCopy : SchedulingApiShiftModel | null = null;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onSelectShiftModel(event : Id) : void {
		this.onSelectShiftModelId(event);
	}
}
