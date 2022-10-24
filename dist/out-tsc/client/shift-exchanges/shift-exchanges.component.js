var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, HostBinding, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { PExportService } from '@plano/client/shared/p-export.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { MeService } from '@plano/shared/api';
import { ExportShiftExchangeStatisticsExcelApiService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { ShiftExchangesService } from './shift-exchanges.service';
import { assumeNonNull } from '../../shared/core/null-type-utils';
import { SchedulingApiShiftExchanges } from '../scheduling/shared/api/scheduling-api-shift-exchange.service';
import { SchedulingApiService } from '../scheduling/shared/api/scheduling-api.service';
import { BootstrapSize, PThemeEnum } from '../shared/bootstrap-styles.enum';
import { FilterService } from '../shared/filter.service';
import { HighlightService } from '../shared/highlight.service';
import { PShiftExchangeService } from '../shared/p-shift-exchange/shift-exchange.service';
let ShiftExchangesComponent = class ShiftExchangesComponent {
    // private now ! : number;
    constructor(api, localize, shiftExchangesService, highlightService, location, changeDetectorRef, meService, route, console, pShiftExchangeService, pRouterService, pMoment, filterService, exportShiftExchangeStatisticsExcelApi, pExport) {
        this.api = api;
        this.localize = localize;
        this.shiftExchangesService = shiftExchangesService;
        this.highlightService = highlightService;
        this.location = location;
        this.changeDetectorRef = changeDetectorRef;
        this.meService = meService;
        this.route = route;
        this.console = console;
        this.pShiftExchangeService = pShiftExchangeService;
        this.pRouterService = pRouterService;
        this.pMoment = pMoment;
        this.filterService = filterService;
        this.exportShiftExchangeStatisticsExcelApi = exportShiftExchangeStatisticsExcelApi;
        this.pExport = pExport;
        this._alwaysTrue = true;
        this.BootstrapSize = BootstrapSize;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.PThemeEnum = PThemeEnum;
        this.config = Config;
        /**
         * Cache start and end to use them if they toggle defineCustomDateRange
         */
        this._start = null;
        this._end = null;
        this.subscription = null;
        this.ngUnsubscribe = new Subject();
        /**
         * Export for people who like microsoft more than us…
         */
        this.exportIsRunning = false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get start() {
        return this.shiftExchangesService.start;
    }
    set start(input) {
        this._start = input;
        // NOTE: backend does not support -1 (yet)
        // this.shiftExchangesService.start = input !== 0 ? input : -1;
        this.shiftExchangesService.start = input;
        this.navToNewRange();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get end() {
        return this.shiftExchangesService.end;
    }
    set end(input) {
        this._end = input;
        // NOTE: backend does not support -1 (yet)
        // this.shiftExchangesService.end = input !== 0 ? input : -1;
        this.shiftExchangesService.end = input;
        this.navToNewRange();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get defineCustomDateRange() {
        return this.shiftExchangesService.defineCustomDateRange;
    }
    set defineCustomDateRange(input) {
        this.shiftExchangesService.defineCustomDateRange = input;
        if (!this.shiftExchangesService.defineCustomDateRange) {
            this.shiftExchangesService.start = null;
            this.shiftExchangesService.end = null;
        }
        else {
            if (this._start)
                this.shiftExchangesService.start = this._start;
            if (this._end)
                this.shiftExchangesService.end = this._end;
        }
        this.navToNewRange();
    }
    /**
     * Check if url has start
     */
    get routeStart() {
        const cookie = this.route.snapshot.paramMap.get('start');
        if (!cookie)
            return null;
        return +cookie;
    }
    /**
     * Check if url has end
     */
    get routeEnd() {
        const cookie = this.route.snapshot.paramMap.get('end');
        if (!cookie)
            return null;
        return +cookie;
    }
    /**
     * Set values that are necessary for this function.
     * These initValues methods are used in many components.
     * They mostly get used for class attributes that would cause performance issues as a getter.
     */
    initValues() {
        if (this.routeStart || this.routeEnd) {
            if (this.routeStart)
                this.shiftExchangesService.start = this.routeStart;
            if (this.routeEnd)
                this.shiftExchangesService.end = this.routeEnd;
            this.shiftExchangesService.defineCustomDateRange = true;
        }
        else {
            this.shiftExchangesService.start = null;
            this.shiftExchangesService.end = null;
            this.shiftExchangesService.defineCustomDateRange = false;
        }
        this.meService.isLoaded(() => {
            this.loadNewData();
        });
    }
    ngAfterContentChecked() {
    }
    ngAfterContentInit() {
        this.initValues();
        this.setRouterListener();
    }
    /**
     * Listen to NavigationEnd to navigate somewhere if no url params are provided or load data if params are provided.
     */
    setRouterListener() {
        this.subscription = this.pRouterService.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe(event => {
            if (!(event instanceof NavigationEnd))
                return;
            this.highlightService.setHighlighted(null);
            this.loadNewData();
        }, (error) => {
            this.console.error(error);
        });
    }
    ngOnDestroy() {
        var _a;
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        this.changeDetectorRef.detach();
        (_a = this.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
    /**
     * Load new absences and workingTimes
     */
    loadNewData(success) {
        this.shiftExchangesService.updateQueryParams();
        assumeNonNull(this.shiftExchangesService.queryParams);
        this.api.load({
            searchParams: this.shiftExchangesService.queryParams,
            success: success !== null && success !== void 0 ? success : null,
        });
    }
    // private relatedShifts(shiftExchange : SchedulingApiShiftExchange) : SchedulingApiShifts {
    // 	const shifts = new SchedulingApiShifts(null, false);
    // 	if (!this.api.isLoaded()) return shifts;
    // 	for (const item of shiftExchange.shifts.iterable()) {
    // 		const shift = this.api.data.shifts.get(item.id);
    // 		if (shift) shifts.push(shift);
    // 	}
    // 	return shifts;
    // }
    /**
     * Navigate to start and end from the service
     * Use this after service values have changes
     */
    navToNewRange() {
        const newStart = this.shiftExchangesService.start;
        const end = this.shiftExchangesService.end;
        this.navTo({ start: newStart, end: end });
    }
    /**
     * Navigate to a given start and end
     */
    navTo(input) {
        let newUrl = '/client/shift-exchanges';
        if (input.start)
            newUrl += `/${input.start}`;
        if (input.end) {
            if (!input.start)
                newUrl += '/0';
            newUrl += `/${input.end}`;
        }
        this.pRouterService.navigate([newUrl]);
        this.location.replaceState(newUrl);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    navBack() {
        this.pRouterService.navBack();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftExchangesForList() {
        if (!this.api.isLoaded())
            return new SchedulingApiShiftExchanges(null, false);
        return this.api.data.shiftExchanges.filterBy(item => {
            if (!item.showInList)
                return false;
            if (!this.filterService.isVisible(item.indisposedMember))
                return false;
            if (item.shiftModel && !this.filterService.isVisible(item.shiftModel))
                return false;
            return true;
        });
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    exportShiftExchangeStatistics() {
        this.exportShiftExchangeStatisticsExcelApi.setEmptyData();
        // set shifts to be exported
        for (const item of this.shiftExchangesForList.iterable()) {
            this.exportShiftExchangeStatisticsExcelApi.data.shiftExchangeIds.push(item.id);
        }
        // set members to be exported
        for (const member of this.api.data.members.iterable()) {
            if (this.filterService.isVisible(member))
                this.exportShiftExchangeStatisticsExcelApi.data.memberIds.push(member.id);
        }
        // set shiftModel to be exported
        for (const shiftModel of this.api.data.shiftModels.iterable()) {
            if (this.filterService.isVisible(shiftModel))
                this.exportShiftExchangeStatisticsExcelApi.data.shiftModelIds.push(shiftModel.id);
        }
        assumeNonNull(this.shiftExchangesService.start);
        assumeNonNull(this.shiftExchangesService.end);
        // get query parameters
        const queryParams = new HttpParams()
            .set('start', (this.shiftExchangesService.start).toString())
            .set('end', (this.shiftExchangesService.end).toString());
        const fileName = this.pExport.getFileName(this.localize.transform('Tauschbörsen Statistik'), this.shiftExchangesService.start, this.shiftExchangesService.end - 1);
        // download file
        this.exportIsRunning = true;
        this.exportShiftExchangeStatisticsExcelApi.downloadFile(fileName, 'xlsx', queryParams, 'PUT', () => {
            this.exportIsRunning = false;
        });
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    createNewShiftExchange() {
        this.pRouterService.navigate(['/client/shift-exchange/create']);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get exportPopOverContent() {
        if (!this.defineCustomDateRange ||
            this.start === null ||
            this.end === null) {
            this.console.error('unexpected type');
            return this.localize.transform('Bitte erst oben bei »Zeitraum der Schichten« auf »benutzerdefiniert« umstellen und ein Start- sowie Enddatum festlegen.');
        }
        return this.localize.transform('Statistik exportieren');
    }
};
__decorate([
    HostBinding('class.flex-grow-1'),
    HostBinding('class.d-flex'),
    HostBinding('class.position-relative'),
    __metadata("design:type", Object)
], ShiftExchangesComponent.prototype, "_alwaysTrue", void 0);
ShiftExchangesComponent = __decorate([
    Component({
        selector: 'p-shift-exchanges',
        templateUrl: './shift-exchanges.component.html',
        styleUrls: ['./shift-exchanges.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, LocalizePipe,
        ShiftExchangesService,
        HighlightService, typeof (_b = typeof Location !== "undefined" && Location) === "function" ? _b : Object, typeof (_c = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _c : Object, MeService, typeof (_d = typeof ActivatedRoute !== "undefined" && ActivatedRoute) === "function" ? _d : Object, LogService,
        PShiftExchangeService,
        PRouterService,
        PMomentService,
        FilterService,
        ExportShiftExchangeStatisticsExcelApiService,
        PExportService])
], ShiftExchangesComponent);
export { ShiftExchangesComponent };
//# sourceMappingURL=shift-exchanges.component.js.map