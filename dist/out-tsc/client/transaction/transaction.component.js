var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, ChangeDetectionStrategy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PDetailFormUtilsService } from '@plano/client/shared/detail-form-utils.service';
import { DropdownTypeEnum } from '@plano/client/shared/p-forms/p-dropdown/p-dropdown.component';
import { SchedulingApiService, SchedulingApiTransaction, SchedulingApiTransactionPaymentMethodType } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeNonNull } from '../../shared/core/null-type-utils';
import { PRouterService } from '../../shared/core/router.service';
import { TransactionsSortedByEmum } from '../sales/transactions/transactions.component';
import { SectionWhitespace } from '../shared/page/section/section.component';
let TransactionComponent = class TransactionComponent {
    constructor(activatedRoute, api, schedulingUrlParams, pDetailFormUtilsService, localize, pRouterService) {
        this.activatedRoute = activatedRoute;
        this.api = api;
        this.schedulingUrlParams = schedulingUrlParams;
        this.pDetailFormUtilsService = pDetailFormUtilsService;
        this.localize = localize;
        this.pRouterService = pRouterService;
        this._alwaysTrue = true;
        this.item = null;
        this.DropdownTypeEnum = DropdownTypeEnum;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.BootstrapSize = BootstrapSize;
        this.PBtnThemeEnum = PBtnThemeEnum;
        this.SectionWhitespace = SectionWhitespace;
        this.PThemeEnum = PThemeEnum;
        this.TransactionsSortedByEmum = TransactionsSortedByEmum;
        this.SchedulingApiTransactionPaymentMethodType = SchedulingApiTransactionPaymentMethodType;
        this.activatedRouteParamsSubscriber = null;
    }
    ngOnInit() {
        this.initComponent();
        this.activatedRouteParamsSubscriber = this.activatedRoute.params.subscribe(value => {
            this.reInitComponentIfIfChanged(value);
        });
    }
    /**
     * Load and set everything that is necessary for this component
     */
    initComponent() {
        this.getItem();
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
    reInitComponentIfIfChanged(value) {
        if (!this.item)
            return;
        if (!(+value['id']))
            return;
        if (this.item.id.equals(value['id']))
            return;
        // HACK: This is necessary as long as we don’t have a CanDeactivate guard [PLANO-24415]
        if (this.api.hasDataCopy())
            this.api.dismissDataCopy();
        this.item = null;
        this.initComponent();
    }
    /**
     * Get Item for this detail page
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
        this.pDetailFormUtilsService.createNewItem(this.api, this.api.data.transactions, this.schedulingUrlParams, (item) => {
            this.item = item;
        });
    }
    /**
     * Get the item by the provided id
     */
    getByRouteId() {
        if (!this.routeId)
            return false;
        let item = this.api.data.transactions.get(this.routeId);
        if (!item) {
            SchedulingApiTransaction.loadDetailed(this.api, this.routeId, {
                success: () => {
                    if (this.routeId === null)
                        throw new Error('routeId could not be determined');
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
                if (item === null)
                    throw new Error('Item should have been available after item.loadDetailed');
                this.item = item;
            },
        });
        return true;
    }
    ngOnDestroy() {
        var _a;
        this.pDetailFormUtilsService.onDestroy(this.api);
        (_a = this.activatedRouteParamsSubscriber) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
    /**
     * Save the provided new item to the database
     */
    saveNewItem(item) {
        this.pDetailFormUtilsService.saveNewItem(this.api, item, this.localize.transform('Email'));
    }
    /**
     * Handle Click on delete button
     */
    onRemoveClick() {
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
    navToFaq() {
        this.pRouterService.navigate(['client/plugin/faq-online-payment']);
    }
};
__decorate([
    HostBinding('class.flex-grow-1'),
    HostBinding('class.d-flex'),
    HostBinding('class.flex-column'),
    __metadata("design:type", Object)
], TransactionComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], TransactionComponent.prototype, "item", void 0);
TransactionComponent = __decorate([
    Component({
        selector: 'p-transaction',
        templateUrl: './transaction.component.html',
        styleUrls: ['./transaction.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ActivatedRoute !== "undefined" && ActivatedRoute) === "function" ? _a : Object, typeof (_b = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _b : Object, typeof (_c = typeof SchedulingService !== "undefined" && SchedulingService) === "function" ? _c : Object, PDetailFormUtilsService,
        LocalizePipe,
        PRouterService])
], TransactionComponent);
export { TransactionComponent };
//# sourceMappingURL=transaction.component.js.map