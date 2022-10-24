var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Component, HostBinding, Input, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReportUrlParamsService } from '@plano/client/report/report-url-params.service';
import { SchedulingApiService } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeNonNull } from '../../shared/core/null-type-utils';
import { PRouterService } from '../../shared/core/router.service';
import { SchedulingApiWorkingTime } from '../scheduling/shared/api/scheduling-api-working-time.service';
import { BootstrapSize, PBtnThemeEnum } from '../shared/bootstrap-styles.enum';
import { PDetailFormUtilsService } from '../shared/detail-form-utils.service';
import { DropdownTypeEnum } from '../shared/p-forms/p-dropdown/p-dropdown.component';
let WorkingtimeComponent = class WorkingtimeComponent {
    constructor(route, api, reportUrlParamsService, pDetailFormUtilsService, localize, pRouterService) {
        this.route = route;
        this.api = api;
        this.reportUrlParamsService = reportUrlParamsService;
        this.pDetailFormUtilsService = pDetailFormUtilsService;
        this.localize = localize;
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
     * Check if url has id
     */
    get routeHasId() {
        return this.route.snapshot.paramMap.has('id') && !!+this.route.snapshot.paramMap.get('id');
    }
    /**
     * Get id from url
     */
    get routeId() {
        const ID_AS_STRING = this.route.snapshot.paramMap.get('id');
        if (ID_AS_STRING === '0')
            return null;
        if (ID_AS_STRING === null)
            return null;
        return Id.create(+ID_AS_STRING);
    }
    /**
     * Get the item by the provided id
     */
    getByRouteId() {
        if (!this.routeId)
            return false;
        let item = this.api.data.workingTimes.get(this.routeId);
        if (!item) {
            SchedulingApiWorkingTime.loadDetailed(this.api, this.routeId, {
                success: () => {
                    if (this.routeId === null)
                        throw new Error('routeId could not be determined');
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
                if (item === null)
                    throw new Error('Item should have been available after item.loadDetailed');
                this.item = item;
            },
        });
        return true;
    }
    /**
     * Get Item for this detail page
     */
    getItem() {
        if (this.getByRouteId())
            return;
        // Make sure we have some data as basis for this item
        if (!this.api.isLoaded()) {
            this.reportUrlParamsService.updateQueryParams();
            this.api.load({
                searchParams: this.reportUrlParamsService.queryParams,
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
        this.pDetailFormUtilsService.createNewItem(this.api, this.api.data.workingTimes, this.reportUrlParamsService, (item) => this.item = item);
    }
    ngOnDestroy() {
        this.pDetailFormUtilsService.onDestroy(this.api);
    }
    /**
     * Save the provided new item to the database
     */
    saveNewItem(item) {
        this.pDetailFormUtilsService.saveNewItem(this.api, item, this.localize.transform('Arbeitseinsatz'));
    }
    /**
     * Handle Click on delete button
     */
    onRemoveClick() {
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
    onNavBack() {
        const onDataLoadStartSubscriber = this.api.onDataLoadStart.subscribe(() => {
            // eslint-disable-next-line rxjs/no-nested-subscribe
            const onDataLoadSubscriber = this.api.onDataLoaded.subscribe(() => {
                if (this.routeId !== null)
                    this.pRouterService.scrollToSelector(`#scroll-target-id-${this.routeId.toString()}`);
                onDataLoadStartSubscriber.unsubscribe();
                onDataLoadSubscriber.unsubscribe();
            });
        });
    }
};
__decorate([
    HostBinding('class.flex-grow-1'),
    HostBinding('class.d-flex'),
    HostBinding('class.flex-column'),
    __metadata("design:type", Object)
], WorkingtimeComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], WorkingtimeComponent.prototype, "item", void 0);
WorkingtimeComponent = __decorate([
    Component({
        selector: 'p-workingtime',
        templateUrl: './workingtime.component.html',
        styleUrls: ['./workingtime.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ActivatedRoute !== "undefined" && ActivatedRoute) === "function" ? _a : Object, typeof (_b = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _b : Object, typeof (_c = typeof ReportUrlParamsService !== "undefined" && ReportUrlParamsService) === "function" ? _c : Object, PDetailFormUtilsService,
        LocalizePipe,
        PRouterService])
], WorkingtimeComponent);
export { WorkingtimeComponent };
//# sourceMappingURL=workingtime.component.js.map