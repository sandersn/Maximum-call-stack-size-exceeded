var _a, _b, _c, _d, _e;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SLIDE_HORIZONTAL_ON_NGIF_TRIGGER } from '@plano/animations';
import { PCalendarService } from '@plano/client/scheduling/shared/p-scheduling-calendar/p-calendar.service';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiShiftExchanges } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { BootstrapSize, PThemeEnum } from '../../bootstrap-styles.enum';
import { FilterService } from '../../filter.service';
import { PShiftExchangeConceptService } from '../../p-shift-exchange/p-shift-exchange-concept.service';
import { PTabSizeEnum } from '../../p-tabs/p-tabs/p-tab/p-tab.component';
import { ClientRoutingService } from '../../routing.service';
import { PSidebarService } from '../p-sidebar.service';
import { SidebarTab } from '../p-sidebar.types';
let MainSidebarComponent = class MainSidebarComponent {
    constructor(api, filterService, pSidebarService, me, router, pCalendarService, pShiftExchangeConceptService, clientRoutingService, console) {
        this.api = api;
        this.filterService = filterService;
        this.pSidebarService = pSidebarService;
        this.me = me;
        this.router = router;
        this.pCalendarService = pCalendarService;
        this.pShiftExchangeConceptService = pShiftExchangeConceptService;
        this.clientRoutingService = clientRoutingService;
        this.console = console;
        this.shifts = null;
        this.onSelectRelatedShifts = new EventEmitter();
        this.BootstrapSize = BootstrapSize;
        this.PThemeEnum = PThemeEnum;
        this.PTabSizeEnum = PTabSizeEnum;
        this.SidebarTab = SidebarTab;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.config = Config;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onSelectShiftsRelatedToMember(id) {
        const member = this.api.data.members.get(id);
        this.onSelectRelatedShifts.emit(member);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onSelectShiftsRelatedToShiftModel(id) {
        const shiftModel = this.api.data.shiftModels.get(id);
        this.onSelectRelatedShifts.emit(shiftModel);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get hideMultiSelectBtn() {
        return this.clientRoutingService.currentPage !== 0 /* CurrentPageEnum.SCHEDULING */;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftExchanges() {
        if (!this.api.isLoaded())
            return new SchedulingApiShiftExchanges(null, false);
        return this.api.data.shiftExchanges;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftModelsForList() {
        return this.api.data.shiftModels;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get membersForList() {
        return this.api.data.members;
    }
    ngAfterContentChecked() {
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get hasImportantNoteForToday() {
        return !!this.pCalendarService.hasImportantNoteForDay();
    }
    /**
     * Navigate to the page with the list of shift-exchanges
     */
    navToShiftExchanges() {
        this.api.deselectAllSelections();
        this.api.deselectAllSelections();
        this.router.navigate(['client/shift-exchanges']);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftExchangesForList() {
        return this.shiftExchanges.filterBy(item => {
            // FIXME: PLANO-1389
            if (!this.api.data.members.length) {
                this.console.error('Members list is empty. (Probably PLANO-1389)');
                return false;
            }
            assumeDefinedToGetStrictNullChecksRunning(item.indisposedMember, 'item.indisposedMember');
            if (!this.filterService.isVisible(item.indisposedMember))
                return false;
            if (item.shiftModel && !this.filterService.isVisible(item.shiftModel))
                return false;
            return true;
        });
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get badgeContent() {
        let result = 0;
        for (const shiftExchange of this.shiftExchangesForList.iterable()) {
            if (!shiftExchange.showOnDesk)
                continue;
            if (shiftExchange.todoCount) {
                result += shiftExchange.todoCount;
            }
            else if (this.pShiftExchangeConceptService.getBadgeIcon(shiftExchange)) {
                result += 1;
            }
        }
        return result;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get hasTodaysShiftDescriptionsForMember() {
        return !!this.pCalendarService.shiftsOfDayHaveDescriptions(undefined, { onlyForUser: true });
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], MainSidebarComponent.prototype, "shifts", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_e = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _e : Object)
], MainSidebarComponent.prototype, "onSelectRelatedShifts", void 0);
MainSidebarComponent = __decorate([
    Component({
        selector: 'p-main-sidebar',
        templateUrl: './main-sidebar.component.html',
        styleUrls: ['./main-sidebar.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        animations: [SLIDE_HORIZONTAL_ON_NGIF_TRIGGER],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, FilterService,
        PSidebarService,
        MeService, typeof (_b = typeof Router !== "undefined" && Router) === "function" ? _b : Object, typeof (_c = typeof PCalendarService !== "undefined" && PCalendarService) === "function" ? _c : Object, PShiftExchangeConceptService,
        ClientRoutingService,
        LogService])
], MainSidebarComponent);
export { MainSidebarComponent };
//# sourceMappingURL=main-sidebar.component.js.map