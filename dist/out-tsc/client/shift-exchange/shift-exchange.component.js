var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
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
import { ShiftExchangesService } from '../shift-exchanges/shift-exchanges.service';
let ShiftExchangeComponent = class ShiftExchangeComponent {
    constructor(route, api, activatedRoute, shiftExchangesService, rightsService, pDetailFormUtilsService, meService, pPushNotificationsService, console, localize, pMoment, pRouterService) {
        this.route = route;
        this.api = api;
        this.activatedRoute = activatedRoute;
        this.shiftExchangesService = shiftExchangesService;
        this.rightsService = rightsService;
        this.pDetailFormUtilsService = pDetailFormUtilsService;
        this.meService = meService;
        this.pPushNotificationsService = pPushNotificationsService;
        this.console = console;
        this.localize = localize;
        this.pMoment = pMoment;
        this.pRouterService = pRouterService;
        this._alwaysTrue = true;
        this.item = null;
        this.DropdownTypeEnum = DropdownTypeEnum;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.BootstrapSize = BootstrapSize;
        this.PBtnThemeEnum = PBtnThemeEnum;
        // update shift-exchange warnings on change
        this.api.enableAutomaticWarningsUpdateOnChange([
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
    ngAfterContentChecked() {
        this.now = +this.pMoment.m();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get deadlineIsInThePast() {
        if (!this.item)
            return false;
        if (!this.item.rawData)
            return false;
        if (!this.item.deadline)
            return false;
        if (this.item.deadline <= this.now)
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isExpired() {
        if (!this.item)
            return false;
        if (this.item.isNewItem())
            return false;
        return this.deadlineIsInThePast;
    }
    /**
     * Check if this component is fully loaded.
     * Can be used to show skeletons/spinners then false.
     */
    get isLoaded() {
        if (!this.api.isLoaded())
            return false;
        // The item will be null if it could not be found
        if (this.item === null)
            return true;
        if (this.routeHasId && !this.item.rawData)
            return false;
        if (this.routeShiftId)
            return false;
        return true;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get itemIsValid() {
        if (!this.item)
            return false;
        if (!this.item.rawData)
            return false;
        return true;
    }
    ngOnInit() {
        this.getItem();
    }
    /**
     * Get the item by the provided id
     */
    getByRouteId() {
        if (!this.routeHasId)
            return false;
        let item = this.api.data.shiftExchanges.get(this.routeId);
        if (!item) {
            SchedulingApiShiftExchange.loadDetailed(this.api, this.routeId, {
                success: () => {
                    if (this.routeId === null)
                        throw new Error('routeId could not be determined');
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
                if (item === null)
                    throw new Error('Item should have been available after item.loadDetailed');
                this.item = item;
            },
        });
        return true;
    }
    get initialIndisposedMember() {
        if (Config.DEBUG && !this.meService.isLoaded())
            throw new Error('MeService must be loaded here.');
        return this.meService.data.id;
    }
    /**
 * Create new item which than can be filled with data from the form
 */
    createNewItem() {
        this.console.debug('TODO: Not implemented yet');
    }
    createNewItemWithSomeDataIfShiftIdProvided(shiftId) {
        this.api.createDataCopy();
        const item = this.api.data.shiftExchanges.createNewItem();
        if (this.routeMemberId)
            item.indisposedMemberId = this.routeMemberId;
        if (!item.attributeInfoIndisposedMemberId.value) {
            item.indisposedMemberId = this.initialIndisposedMember;
        }
        /** If manager creates a shift-exchange for someone else it can only be a illness */
        if (!this.rightsService.isMe(item.indisposedMemberId))
            item.isIllness = true;
        if (shiftId)
            item.shiftRefs.createNewItem(shiftId);
        return item;
    }
    /**
     * Create new item by the provided ShiftId
     */
    createByRouteShiftId() {
        // User navigated from e.g. shift-tooltip to this "Create Shift Exchange" form
        if (!this.routeShiftId)
            return false;
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
    get routeHasId() {
        return this.route.snapshot.paramMap.has('id') && !!+this.route.snapshot.paramMap.get('id');
    }
    /**
     * Check if url has shiftId
     */
    get routeShiftId() {
        if (!this.route.snapshot.paramMap.has('shiftId'))
            return undefined;
        const idAsString = this.route.snapshot.paramMap.get('shiftId');
        if (idAsString === '0')
            return undefined;
        assumeNonNull(idAsString);
        return ShiftId.fromUrl(idAsString);
    }
    /**
     * Check if url has memberId
     */
    get routeMemberId() {
        if (!this.route.snapshot.paramMap.has('memberId'))
            return undefined;
        const idAsString = this.route.snapshot.paramMap.get('memberId');
        if (idAsString === '0')
            return undefined;
        assumeNonNull(idAsString);
        return Id.create(+idAsString);
    }
    /**
     * Get Item for this detail page
     * If id is available load the item
     * Else create a new item by shift id
     */
    getItem() {
        if (this.getByRouteId())
            return;
        if (this.createByRouteShiftId())
            return;
        // Make sure we have some data as basis for this item
        if (!this.api.isLoaded()) {
            this.shiftExchangesService.updateQueryParams();
            assumeNonNull(this.shiftExchangesService.queryParams);
            this.api.load({
                searchParams: this.shiftExchangesService.queryParams,
                success: () => {
                    if (this.getByRouteId())
                        return;
                    if (this.createByRouteShiftId())
                        return;
                    this.item = this.createNewItemWithSomeDataIfShiftIdProvided();
                },
            });
        }
        else {
            this.item = this.createNewItemWithSomeDataIfShiftIdProvided();
        }
    }
    /**
     * Check if url has id
     */
    get routeId() {
        if (!this.activatedRoute.snapshot.paramMap.has('id'))
            return null;
        const ID_AS_STRING = this.activatedRoute.snapshot.paramMap.get('id');
        if (ID_AS_STRING === '0')
            return null;
        if (ID_AS_STRING === null)
            return null;
        return Id.create(+ID_AS_STRING);
    }
    ngOnDestroy() {
        this.pDetailFormUtilsService.onDestroy(this.api);
        this.api.disableAutomaticWarningsUpdateOnChange();
    }
    askForNotificationPermissionIfNecessary() {
        this.pPushNotificationsService.requestWebPushNotificationPermission(PRequestWebPushNotificationPermissionContext.SHIFT_EXCHANGE_CREATED);
    }
    /**
     * Save the provided new item to the database
     */
    saveNewItem(item) {
        this.askForNotificationPermissionIfNecessary();
        this.pDetailFormUtilsService.saveNewItem(this.api, item, item.isIllness ? this.localize.transform('Krankmeldung') : this.localize.transform('Ersatzsuche'), undefined, true);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    dismissReOpen() {
        // TODO: Obsolete?
        if (this.item && this.item.behavesAsNewItem === true) {
            this.item.behavesAsNewItem = false;
        }
        if (this.api.hasDataCopy()) {
            this.api.dismissDataCopy();
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    reOpenForm() {
        this.api.createDataCopy();
        assumeNonNull(this.item);
        this.item.openShiftExchange = true;
        this.item.deadline = null;
        this.item.behavesAsNewItem = true;
    }
    /**
     * Handle Click on delete button
     */
    onRemoveClick() {
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
};
__decorate([
    HostBinding('class.flex-grow-1'),
    HostBinding('class.d-flex'),
    HostBinding('class.flex-column'),
    __metadata("design:type", Object)
], ShiftExchangeComponent.prototype, "_alwaysTrue", void 0);
ShiftExchangeComponent = __decorate([
    Component({
        selector: 'p-shift-exchange',
        templateUrl: './shift-exchange.component.html',
        styleUrls: ['./shift-exchange.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ActivatedRoute !== "undefined" && ActivatedRoute) === "function" ? _a : Object, typeof (_b = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _b : Object, typeof (_c = typeof ActivatedRoute !== "undefined" && ActivatedRoute) === "function" ? _c : Object, ShiftExchangesService, typeof (_d = typeof RightsService !== "undefined" && RightsService) === "function" ? _d : Object, PDetailFormUtilsService,
        MeService,
        PPushNotificationsService,
        LogService,
        LocalizePipe,
        PMomentService,
        PRouterService])
], ShiftExchangeComponent);
export { ShiftExchangeComponent };
//# sourceMappingURL=shift-exchange.component.js.map