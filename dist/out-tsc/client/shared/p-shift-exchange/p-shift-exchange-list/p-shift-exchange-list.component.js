var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { SchedulingApiShiftExchanges } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { LogService } from '@plano/shared/core/log.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PShiftExchangeListService } from './p-shift-exchange-list.service';
import { BootstrapSize } from '../../../shared/bootstrap-styles.enum';
import { FilterService } from '../../filter.service';
import { HighlightService } from '../../highlight.service';
import { ListSortDirection } from '../../p-lists/list-headline-item/list-headline-item.component';
import { PShiftExchangeConceptService } from '../p-shift-exchange-concept.service';
let PShiftExchangeListComponent = class PShiftExchangeListComponent {
    constructor(api, router, highlightService, filterService, console, pShiftExchangeConceptService, pShiftExchangeListService) {
        this.api = api;
        this.router = router;
        this.highlightService = highlightService;
        this.filterService = filterService;
        this.console = console;
        this.pShiftExchangeConceptService = pShiftExchangeConceptService;
        this.pShiftExchangeListService = pShiftExchangeListService;
        this.addItemIds = null;
        this.calendarBtnClick = new EventEmitter();
        /**
         * Should this component show all items or only those that are marked as »for desk«?
         */
        this.showOnlyItemsForDesk = false;
        this.showDetails = false;
        this.hideAddBtn = false;
        this.ListSortDirection = ListSortDirection;
        this.BootstrapSize = BootstrapSize;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.ngUnsubscribe = new Subject();
        this.setRouterListener();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    isMuted(shiftExchange) {
        // if (shiftExchange.isClosed) return true;
        if (!shiftExchange.indisposedMember)
            return undefined;
        if (!shiftExchange.shiftModel)
            return undefined;
        if (this.highlightService.isMuted(shiftExchange.indisposedMember))
            return true;
        if (this.highlightService.isMuted(shiftExchange.shiftModel))
            return true;
        return false;
    }
    /**
     * Listen to NavigationEnd to navigate somewhere if no url params are provided or load data if params are provided.
     */
    setRouterListener() {
        // eslint-disable-next-line rxjs/no-ignored-subscription -- Remove this before you work here.
        this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe((event) => {
            if (!(event instanceof NavigationEnd))
                return;
            this.highlightService.setHighlighted(null);
        }, (error) => {
            this.console.error(error);
        });
    }
    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
    /**
     * All shiftExchanges that should be visible in this list.
     */
    get shiftExchangesForList() {
        var _a;
        if (!this.shiftExchanges.length)
            return new SchedulingApiShiftExchanges(null, false);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let sortFn;
        switch (this.pShiftExchangeListService.key) {
            case 'shiftRefs':
                sortFn = (item) => {
                    return item.shiftRefs.earliestStart;
                };
                break;
            case 'lastUpdate':
                sortFn = (item) => item.lastUpdate;
                break;
            case 'state':
                sortFn = [
                    (item) => {
                        return this.pShiftExchangeConceptService.getStateText(item);
                    },
                    (item) => {
                        return this.pShiftExchangeConceptService.getStateStyle(item);
                    },
                ];
                break;
            default:
                sortFn = () => true;
        }
        return this.shiftExchanges.filterBy((shiftExchange) => {
            if (this.showOnlyItemsForDesk && !shiftExchange.showOnDesk)
                return false;
            return true;
        }).sortedBy(sortFn, true, (_a = this.pShiftExchangeListService.reverse) !== null && _a !== void 0 ? _a : undefined);
    }
    /**
     * Show the related shift(s) in a calendar
     */
    onCalendarBtnClick(item) {
        this.calendarBtnClick.emit(item);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get hasCalendarBtn() {
        return this.calendarBtnClick.observers.length > 0;
    }
    // /**
    //  * Navigate to the page with the list of shift-exchanges
    //  */
    //
    // public navToShiftExchanges() : void {
    // 	this.api.deselectAllSelections();
    // 	this.api.deselectAllSelections();
    // 	this.router.navigate(['client/shift-exchanges']);
    // }
    /**
     * Open Modal with for for a new assignment process
     */
    createNewShiftExchange() {
        this.router.navigate(['/client/shift-exchange/create']);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftExchangeListComponent.prototype, "addItemIds", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_c = typeof SchedulingApiShiftExchanges !== "undefined" && SchedulingApiShiftExchanges) === "function" ? _c : Object)
], PShiftExchangeListComponent.prototype, "shiftExchanges", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_d = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _d : Object)
], PShiftExchangeListComponent.prototype, "calendarBtnClick", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PShiftExchangeListComponent.prototype, "showOnlyItemsForDesk", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PShiftExchangeListComponent.prototype, "showDetails", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PShiftExchangeListComponent.prototype, "hideAddBtn", void 0);
PShiftExchangeListComponent = __decorate([
    Component({
        selector: 'p-shift-exchange-list[shiftExchanges]',
        templateUrl: './p-shift-exchange-list.component.html',
        styleUrls: ['./p-shift-exchange-list.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        // animations: [SLIDE_ON_NGIF_TRIGGER]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, typeof (_b = typeof Router !== "undefined" && Router) === "function" ? _b : Object, HighlightService,
        FilterService,
        LogService,
        PShiftExchangeConceptService,
        PShiftExchangeListService])
], PShiftExchangeListComponent);
export { PShiftExchangeListComponent };
//# sourceMappingURL=p-shift-exchange-list.component.js.map