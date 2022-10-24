var _a, _b, _c, _d, _e;
import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, ChangeDetectionStrategy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { RightsService, SchedulingApiShiftModel } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeNonNull } from '../../shared/core/null-type-utils';
import { PRouterService } from '../../shared/core/router.service';
import { ToastsService } from '../service/toasts.service';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '../shared/bootstrap-styles.enum';
import { PShiftAndShiftmodelFormService } from '../shared/component/p-shift-and-shiftmodel-form/p-shift-and-shiftmodel-form.service';
import { PDetailFormUtilsService } from '../shared/detail-form-utils.service';
import { DropdownTypeEnum } from '../shared/p-forms/p-dropdown/p-dropdown.component';
let ShiftModelComponent = class ShiftModelComponent {
    constructor(activatedRoute, api, schedulingUrlParams, pDetailFormUtilsService, toastsService, localize, pShiftAndShiftmodelFormService, rightsService, pRouterService) {
        this.activatedRoute = activatedRoute;
        this.api = api;
        this.schedulingUrlParams = schedulingUrlParams;
        this.pDetailFormUtilsService = pDetailFormUtilsService;
        this.toastsService = toastsService;
        this.localize = localize;
        this.pShiftAndShiftmodelFormService = pShiftAndShiftmodelFormService;
        this.rightsService = rightsService;
        this.pRouterService = pRouterService;
        this._alwaysTrue = true;
        this.item = null;
        this.DropdownTypeEnum = DropdownTypeEnum;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.BootstrapSize = BootstrapSize;
        this.PBtnThemeEnum = PBtnThemeEnum;
    }
    ngOnInit() {
        this.getItem();
    }
    /**
     * Get Item for this detail page
     * If id is available load the item
     * Else create a new item by provided shiftmodel
     */
    getItem() {
        if (this.getByRouteId())
            return;
        // Make sure we have some data as basis for this item
        if (!this.api.isLoaded()) {
            this.schedulingUrlParams.updateQueryParams();
            this.api.load({
                searchParams: this.schedulingUrlParams.queryParams,
                success: () => {
                    if (this.getByRouteId())
                        return;
                    this.createNewItem();
                },
            });
        }
        else {
            this.createNewItem();
        }
    }
    /**
 * Create new item which than can be filled with data from the form
 */
    createNewItem() {
        this.pDetailFormUtilsService.createNewItem(this.api, this.api.data.shiftModels, this.schedulingUrlParams, item => {
            this.item = item;
        });
    }
    /**
     * Get id from route
     */
    get routeId() {
        const ID_AS_STRING = this.activatedRoute.snapshot.paramMap.get('id');
        if (ID_AS_STRING === '0')
            return null;
        if (ID_AS_STRING === null)
            return null;
        return Id.create(+ID_AS_STRING);
    }
    makeCopy(items, item) {
        this.api.createDataCopy();
        const COPIED_ITEM = item.copy();
        // Its important to get the new DefaultPrefix before removing the name, because the generated
        // prefix is based on the name
        COPIED_ITEM.courseCodePrefix = this.pShiftAndShiftmodelFormService.getDefaultPrefix(COPIED_ITEM, items);
        COPIED_ITEM.name = undefined;
        // COPIED_ITEM.arrivalTimeBeforeCourse = 3;
        items.push(COPIED_ITEM);
        return COPIED_ITEM;
    }
    /**
     * Get the item by the provided id
     */
    getByRouteId() {
        if (!this.routeId)
            return false;
        let item = this.api.data.shiftModels.get(this.routeId);
        const MAKE_COPY = this.pRouterService.url.includes('copy/');
        if (!item) {
            SchedulingApiShiftModel.loadDetailed(this.api, this.routeId, {
                success: () => {
                    if (this.routeId === null)
                        throw new Error('routeId could not be determined');
                    item = this.api.data.shiftModels.get(this.routeId);
                    this.item = MAKE_COPY && item ? this.makeCopy(this.api.data.shiftModels, item) : item;
                },
            });
            return true;
        }
        if (item.isNewItem()) {
            this.item = MAKE_COPY ? this.makeCopy(this.api.data.shiftModels, item) : item;
            return true;
        }
        item.loadDetailed({
            success: () => {
                if (item === null)
                    throw new Error('Item should have been available after item.loadDetailed');
                this.item = MAKE_COPY ? this.makeCopy(this.api.data.shiftModels, item) : item;
            },
        });
        return true;
    }
    ngOnDestroy() {
        this.pDetailFormUtilsService.onDestroy(this.api);
    }
    /**
     * Save the provided new shiftModel to the database
     */
    saveNewItem(item) {
        // Store name into const, before item reference gets lost.
        const NAME = item.name;
        this.pDetailFormUtilsService.saveNewItem(this.api, item, this.localize.transform('Die Tätigkeit »${name}«', { name: NAME }), () => {
            this.toastsService.addToast({
                content: this.localize.transform('Nutze nun den Button »Neuer Eintrag«, um für »${name}« Schichten im Kalender zu erstellen.', { name: NAME }),
                theme: PThemeEnum.INFO,
                icon: PlanoFaIconPool.AREA_TUTORIALS,
                visibilityDuration: 'long',
            });
        });
    }
    /**
     * Handle Click on delete button
     */
    onRemoveClick() {
        assumeNonNull(this.item);
        this.pDetailFormUtilsService.onRemoveClick({
            modalTitle: this.localize.transform('Sicher?'),
            description: `${this.localize.transform('Bist du dir sicher, dass du die Schicht-Vorlage »${shiftModelName}« löschen willst?', {
                shiftModelName: this.item.name,
                parentName: this.item.parentName,
            })}<br>${this.localize.transform('Keine Sorge! Die mit dieser Vorlage bereits erstellten Schichten gehen nicht verloren.')}`,
            api: this.api,
            items: this.api.data.shiftModels,
            item: this.item,
            removeItemFn: (done) => {
                assumeNonNull(this.item);
                this.item.trashed = true;
                done();
            },
        });
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showDeleteSection() {
        if (!this.item)
            return undefined;
        if (this.item.isNewItem())
            return false;
        if (!this.rightsService.isOwner)
            return false;
        return true;
    }
};
__decorate([
    HostBinding('class.flex-grow-1'),
    HostBinding('class.d-flex'),
    HostBinding('class.flex-column'),
    __metadata("design:type", Object)
], ShiftModelComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftModelComponent.prototype, "item", void 0);
ShiftModelComponent = __decorate([
    Component({
        selector: 'p-shiftmodel',
        templateUrl: './shiftmodel.component.html',
        styleUrls: ['./shiftmodel.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ActivatedRoute !== "undefined" && ActivatedRoute) === "function" ? _a : Object, typeof (_b = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _b : Object, typeof (_c = typeof SchedulingService !== "undefined" && SchedulingService) === "function" ? _c : Object, PDetailFormUtilsService,
        ToastsService,
        LocalizePipe,
        PShiftAndShiftmodelFormService, typeof (_d = typeof RightsService !== "undefined" && RightsService) === "function" ? _d : Object, PRouterService])
], ShiftModelComponent);
export { ShiftModelComponent };
//# sourceMappingURL=shiftmodel.component.js.map