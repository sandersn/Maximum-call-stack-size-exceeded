var _a, _b, _c, _d, _e, _f;
import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, ChangeDetectionStrategy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { PWishesService } from '@plano/client/scheduling/wishes.service';
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
import { PRouterService } from '@plano/shared/core/router.service';
import { ShiftModalSizes } from './shift-modal-sizes';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../shared/core/null-type-utils';
import { LocalizePipe } from '../../shared/core/pipe/localize.pipe';
import { PScrollToSelectorService } from '../../shared/core/scroll-to-selector.service';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '../shared/bootstrap-styles.enum';
import { PDetailFormUtilsService } from '../shared/detail-form-utils.service';
import { DropdownTypeEnum } from '../shared/p-forms/p-dropdown/p-dropdown.component';
let ShiftComponent = class ShiftComponent {
    constructor(activatedRoute, api, schedulingUrlParams, meService, pWishesService, pRouterService, pDetailFormUtilsService, pPushNotificationsService, pMoment, rightsService, modalService, localize, pScrollToSelectorService) {
        this.activatedRoute = activatedRoute;
        this.api = api;
        this.schedulingUrlParams = schedulingUrlParams;
        this.meService = meService;
        this.pWishesService = pWishesService;
        this.pRouterService = pRouterService;
        this.pDetailFormUtilsService = pDetailFormUtilsService;
        this.pPushNotificationsService = pPushNotificationsService;
        this.pMoment = pMoment;
        this.rightsService = rightsService;
        this.modalService = modalService;
        this.localize = localize;
        this.pScrollToSelectorService = pScrollToSelectorService;
        this._alwaysTrue = true;
        // NOTE: I think this does not need to be an @Input() ^nn
        this.item = null;
        this.DropdownTypeEnum = DropdownTypeEnum;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.BootstrapSize = BootstrapSize;
        this.PBtnThemeEnum = PBtnThemeEnum;
        this.PThemeEnum = PThemeEnum;
        this.routeShiftModelId = null;
        /**
         * get all writable shiftModels for the current user.
         * Needed for the shiftmodel list when creating new shifts.
         */
        this.writableShiftModelsForMember = new SchedulingApiShiftModels(null, false);
        this.selectedShiftModelToCopy = null;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get itemNotFound() {
        return !this.item && !!this.routeId && !this.api.isBackendOperationRunning;
    }
    ngOnInit() {
        this.initComponent();
    }
    /**
     * Load and set everything that is necessary for this component
     */
    initComponent(id = null) {
        this.getRouteShiftModelId(id);
        this.getItem();
        this.api.isLoaded(() => {
            this.getWritableShiftModelsForMember();
        });
        this.initWishes();
    }
    initWishes() {
        var _a;
        this.pWishesService.item = (_a = this.item) !== null && _a !== void 0 ? _a : null;
    }
    ngOnDestroy() {
        this.pDetailFormUtilsService.onDestroy(this.api);
        this.pWishesService.resetToPreviousItem();
    }
    /**
     * Get id from url
     */
    get routeId() {
        if (!this.activatedRoute.snapshot.paramMap.has('id'))
            return null;
        const paramId = this.activatedRoute.snapshot.paramMap.get('id');
        if (paramId === '0')
            return null;
        if (paramId === null)
            throw new Error('Param id is allowed to be `0`, but should never be null');
        return ShiftId.fromUrl(paramId);
    }
    /**
     * Check if url has shiftModelId
     */
    getRouteShiftModelId(id = null) {
        if (id) {
            this.routeShiftModelId = id;
            return;
        }
        const idAsString = this.activatedRoute.snapshot.paramMap.get('shiftmodelid');
        this.routeShiftModelId = idAsString === null ? null : Id.create(+idAsString);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get routeStartTimestamp() {
        if (!this.activatedRoute.snapshot.paramMap.has('start'))
            return null;
        const startParam = this.activatedRoute.snapshot.paramMap.get('start');
        return +startParam;
    }
    get getDefaultTimeForNewShift() {
        const shiftModel = this.api.data.shiftModels.get(this.routeShiftModelId);
        if (!shiftModel)
            return undefined;
        // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
        const timestamp = this.routeStartTimestamp ? this.routeStartTimestamp : undefined;
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        return this.pMoment.m(+this.pMoment.m(timestamp).startOf('day') + shiftModel.time.start);
    }
    /**
     * Create new item which than can be filled with data from the form
     */
    createNewItem() {
        // Usually i would create a new item here. But shift is different. I need a shiftModelId first.
    }
    /**
     * Get the item by the provided id
     */
    getByRouteId() {
        if (!this.routeId)
            return false;
        let item = this.api.data.shifts.get(this.routeId);
        if (!item) {
            assumeDefinedToGetStrictNullChecksRunning(this.routeId, `routeId`, 'Given id is not defined [PLANO-FE-2RA]');
            SchedulingApiShift.loadDetailed(this.api, this.routeId, {
                success: () => {
                    if (this.routeId === null)
                        throw new Error('routeId could not be determined');
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
                if (item === null)
                    throw new Error('Item should have been available after item.loadDetailed');
                this.item = item;
            },
        });
        return true;
    }
    /**
     * Create new item by the provided ShiftId
     */
    createByRouteShiftModelId() {
        // User navigated from e.g. shift-tooltip to this "Create Shift Exchange" form
        if (this.routeShiftModelId === null)
            return false;
        SchedulingApiShiftModel.loadDetailed(this.api, this.routeShiftModelId, {
            success: () => {
                const timeForNewShift = this.getDefaultTimeForNewShift;
                const shiftModel = this.api.data.shiftModels.get(this.routeShiftModelId);
                if (!shiftModel)
                    return;
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
    getItem() {
        // if (Config.DEBUG && !this.routeId && !this.routeShiftModelId && this.showShiftModelInputSection !== null) {
        // 	throw new Error('Missing id or shiftModelId in the url');
        // }
        const getIt = () => {
            if (this.getByRouteId())
                return true;
            if (this.createByRouteShiftModelId())
                return true;
            return false;
        };
        if (getIt())
            return;
        // Make sure we have some data as basis for this item
        if (!this.api.isLoaded()) {
            this.schedulingUrlParams.updateQueryParams();
            this.api.load({
                searchParams: this.schedulingUrlParams.queryParams,
                success: () => {
                    if (getIt())
                        return;
                    this.createNewItem();
                },
            });
        }
        else {
            this.createNewItem();
        }
        this.initWishes();
    }
    /**
     * Create Item after shiftModel has been selected
     */
    onSelectShiftModelId(id = null) {
        if (this.routeShiftModelId && this.routeShiftModelId.equals(id))
            return;
        if (this.item) {
            this.item = null;
            this.api.dismissDataCopy();
        }
        assumeDefinedToGetStrictNullChecksRunning(id, 'id');
        let url = `/client/shift/create/shiftmodel/${id.toString()}`;
        if (this.routeStartTimestamp)
            url += `/start/${this.routeStartTimestamp}`;
        // const opentab : string = this.activatedRoute.snapshot.paramMap.get('opentab');
        // if (opentab) url += `/${opentab}`;
        this.pRouterService.navigate([url], { replaceUrl: true, queryParamsHandling: 'preserve' });
        this.initComponent(id);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    getWritableShiftModelsForMember() {
        this.meService.isLoaded(() => {
            if (this.meService.data.isOwner) {
                this.writableShiftModelsForMember = this.api.data.shiftModels.filterBy(item => !item.trashed);
                return;
            }
            const result = new SchedulingApiShiftModels(this.api, false);
            const member = this.api.data.members.get(this.meService.data.id);
            assumeDefinedToGetStrictNullChecksRunning(member, 'member');
            for (const shiftModel of this.api.data.shiftModels.iterable()) {
                if (shiftModel.trashed)
                    continue;
                if (!member.canWrite(shiftModel))
                    continue;
                result.push(shiftModel);
            }
            this.writableShiftModelsForMember = result;
        });
    }
    askForNotificationPermissionIfNecessary(item) {
        assumeDefinedToGetStrictNullChecksRunning(item.model, 'item.model');
        if (item.model.courseType !== SchedulingApiCourseType.ONLINE_INQUIRY)
            return;
        this.pPushNotificationsService.requestWebPushNotificationPermission(PRequestWebPushNotificationPermissionContext.ONLINE_INQUIRY_SHIFT_CREATED);
    }
    /**
     * Save the provided new shift to the database
     */
    saveNewItem(item) {
        this.askForNotificationPermissionIfNecessary(item);
        this.pDetailFormUtilsService.saveNewItem(this.api, item, `»${item.name}«`);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showShiftModelInputSection() {
        if (!this.api.isLoaded())
            return null;
        if (this.routeId)
            return false;
        if (this.routeShiftModelId)
            return false;
        return true;
    }
    /**
     * Handle Click on delete button
     */
    onRemoveClick(modalContent) {
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
                    success: () => {
                    },
                });
            },
            dismiss: () => {
                this.api.dismissDataCopy();
            },
            size: this.item ? ShiftModalSizes.WITH_TRANSMISSION_PREVIEW : undefined,
        });
    }
    /**
     * get showDeleteButton
     */
    get showDeleteButton() {
        assumeNonNull(this.item);
        return !Config.IS_MOBILE && (!this.item.isNewItem() && this.rightsService.userCanWrite(this.item.model));
    }
    /**
     * Is this a shift that can have bookings and is not canceled?
     */
    get cancellationSettingsIsPossible() {
        assumeNonNull(this.item);
        return !this.item.isNewItem() && !!this.item.isCourse && this.item.isCourseCanceled === false;
    }
    /**
     * When user clicked »Back«
     */
    onNavBack() {
        if (this.routeId !== null)
            this.pScrollToSelectorService.scrollToSelector(`#scroll-target-id-${this.routeId.toPrettyString()}`);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get basissettingsTabLabel() {
        return this.localize.transform('Grundeinstellungen');
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onSelectShiftModel(event) {
        this.onSelectShiftModelId(event);
    }
};
__decorate([
    HostBinding('class.flex-grow-1'),
    HostBinding('class.d-flex'),
    HostBinding('class.flex-column'),
    __metadata("design:type", Object)
], ShiftComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftComponent.prototype, "item", void 0);
ShiftComponent = __decorate([
    Component({
        selector: 'p-shift',
        templateUrl: './shift.component.html',
        styleUrls: ['./shift.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ActivatedRoute !== "undefined" && ActivatedRoute) === "function" ? _a : Object, typeof (_b = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _b : Object, typeof (_c = typeof SchedulingService !== "undefined" && SchedulingService) === "function" ? _c : Object, MeService, typeof (_d = typeof PWishesService !== "undefined" && PWishesService) === "function" ? _d : Object, PRouterService,
        PDetailFormUtilsService,
        PPushNotificationsService,
        PMomentService, typeof (_e = typeof RightsService !== "undefined" && RightsService) === "function" ? _e : Object, ModalService,
        LocalizePipe,
        PScrollToSelectorService])
], ShiftComponent);
export { ShiftComponent };
//# sourceMappingURL=shift.component.js.map