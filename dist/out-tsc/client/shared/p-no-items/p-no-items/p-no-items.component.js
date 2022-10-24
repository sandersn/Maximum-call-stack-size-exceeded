var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectorRef, ChangeDetectionStrategy, EventEmitter, Output, Input, ElementRef, ViewChild } from '@angular/core';
import { ReportFilterService } from '@plano/client/report/report-filter.service';
import { SchedulingFilterService } from '@plano/client/scheduling/scheduling-filter.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
import { PlanoFaIconPool } from '../../../../shared/core/plano-fa-icon-pool.enum';
import { PThemeEnum } from '../../bootstrap-styles.enum';
import { FilterService } from '../../filter.service';
let PNoItemsComponent = class PNoItemsComponent {
    constructor(filterService, changeDetectorRef, schedulingFilterService, reportFilterService) {
        this.filterService = filterService;
        this.changeDetectorRef = changeDetectorRef;
        this.schedulingFilterService = schedulingFilterService;
        this.reportFilterService = reportFilterService;
        /**
         * If specific filters have effect on the list, then provide a boolean if some filter settings are active.
         * If not set, only filterService will be considered.
         */
        this.hasFilterSettings = null;
        /**
         * If user clicks a button to reset all filters, this event will be triggered.
         */
        this.onResetFilter = new EventEmitter();
        this.handleGlobalFilterService = true;
        this.subscription = null;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.PThemeEnum = PThemeEnum;
        this.setObservers();
    }
    /**
     * Has someone set content like in the following code?
     *     <p-no-items …>Hello World!</p-no-items>
     */
    get hasNgContent() {
        assumeDefinedToGetStrictNullChecksRunning(this.ngContent.nativeElement, 'this.ngContent.nativeElement');
        return this.ngContent.nativeElement.childNodes.length > 0;
    }
    ngAfterContentInit() {
        // hasNgContent is initially false, even if there is content. Next line fixes hasNgContent value.
        this.changeDetectorRef.detectChanges();
    }
    setObservers() {
        if (!this.handleGlobalFilterService)
            return;
        this.subscription = this.filterService.onChange.subscribe(() => {
            this.changeDetectorRef.detectChanges();
        });
        this.subscription = this.schedulingFilterService.onChange.subscribe(() => {
            this.changeDetectorRef.detectChanges();
        });
        this.subscription = this.reportFilterService.onChange.subscribe(() => {
            this.changeDetectorRef.detectChanges();
        });
    }
    ngOnDestroy() {
        var _a;
        (_a = this.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
    /**
     * Reset all Filter settings
     */
    resetFilters() {
        if (this.handleGlobalFilterService) {
            this.filterService.unload();
            this.filterService.initValues();
        }
        this.onResetFilter.emit();
        this.changeDetectorRef.detectChanges();
    }
    /**
     * Are there any active filter settings?
     */
    get hasSomeFilterSettings() {
        if (this.hasFilterSettings === true)
            return true;
        if (!this.handleGlobalFilterService)
            return null;
        return !this.filterService.isSetToShowAll;
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PNoItemsComponent.prototype, "hasFilterSettings", void 0);
__decorate([
    Output(),
    __metadata("design:type", Object)
], PNoItemsComponent.prototype, "onResetFilter", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PNoItemsComponent.prototype, "handleGlobalFilterService", void 0);
__decorate([
    ViewChild('ngContent', { static: true }),
    __metadata("design:type", typeof (_d = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _d : Object)
], PNoItemsComponent.prototype, "ngContent", void 0);
PNoItemsComponent = __decorate([
    Component({
        selector: 'p-no-items',
        templateUrl: './p-no-items.component.html',
        styleUrls: ['./p-no-items.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [FilterService, typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object, typeof (_b = typeof SchedulingFilterService !== "undefined" && SchedulingFilterService) === "function" ? _b : Object, typeof (_c = typeof ReportFilterService !== "undefined" && ReportFilterService) === "function" ? _c : Object])
], PNoItemsComponent);
export { PNoItemsComponent };
//# sourceMappingURL=p-no-items.component.js.map