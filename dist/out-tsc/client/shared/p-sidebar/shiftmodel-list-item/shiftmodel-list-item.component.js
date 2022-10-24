var _a, _b, _c, _d, _e, _f, _g;
import { __decorate, __metadata } from "tslib";
import { Component, Input, EventEmitter, Output, HostBinding, ChangeDetectionStrategy, HostListener, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FilterService } from '@plano/client/shared/filter.service';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { LogService } from '@plano/shared/core/log.service';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../shared/core/null-type-utils';
/** @deprecated */
let ShiftmodelListItemComponent = class ShiftmodelListItemComponent {
    constructor(api, highlightService, filterService, router, rightsService, console, changeDetectorRef) {
        this.api = api;
        this.highlightService = highlightService;
        this.filterService = filterService;
        this.router = router;
        this.rightsService = rightsService;
        this.console = console;
        this.changeDetectorRef = changeDetectorRef;
        this._alwaysTrue = true;
        this.editFilterModeActive = false;
        this.editListItemsMode = false;
        this.shiftModel = null;
        this.onItemClick = new EventEmitter();
        this.hideMultiSelectBtn = true;
        this.onSelectInCalendarClick = new EventEmitter();
        this.hover = false;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.subscription = null;
        this.console.deprecated('shiftmodel-list-item is deprecated. Use p-shiftmodel-list-item instead.');
    }
    get hasId() {
        var _a;
        return `scroll-target-id-${(_a = this.shiftModel) === null || _a === void 0 ? void 0 : _a.id.toString()}`;
    }
    get _muteItem() {
        if (!this.shiftModel)
            return false;
        if (this.highlightService.isMuted(this.shiftModel))
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onHover() {
        if (this.hover === true)
            return;
        this.hover = true;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onHoverLeave() {
        if (this.hover === false)
            return;
        this.hover = false;
    }
    ngOnInit() {
        this.subscription = this.filterService.onChange.subscribe(() => {
            this.changeDetectorRef.detectChanges();
        });
    }
    /**
     * Decide if the multi-select-checkbox should be visible or not
     */
    get showMultiSelectCheckbox() {
        if (this.hideMultiSelectBtn)
            return false;
        assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
        if (this.hover)
            return true;
        if (this.highlightService.isHighlighted(this.shiftModel))
            return true;
        if (this.shiftModel.selected)
            return true;
        if (this.api.data.shiftModels.hasSelectedItem)
            return true;
        // if (this.api.hasSelectedItems) return true;
        return false;
    }
    /**
     * Open Modal for specific shiftModel
     */
    showDetails() {
        if (this.shiftModel) {
            this.router.navigate([`/client/shiftmodel/${this.shiftModel.id.toString()}`]);
        }
        else {
            this.router.navigate(['/client/shiftmodel/']);
        }
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    selectInCalendar(event) {
        event.stopPropagation();
        assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
        this.onSelectInCalendarClick.emit(this.shiftModel.id);
    }
    /**
     * Check if user can write given shiftModel
     */
    get userCanWrite() {
        assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
        return this.rightsService.userCanWrite(this.shiftModel);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get affected() {
        var _a;
        return !!((_a = this.shiftModel) === null || _a === void 0 ? void 0 : _a.affected);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get selected() {
        var _a;
        return !!((_a = this.shiftModel) === null || _a === void 0 ? void 0 : _a.selected);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get hasOnItemClickBinding() {
        return this.onItemClick.observers.length > 0;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showDetailsBtn() {
        if (!this.editListItemsMode)
            return false;
        if (this.userCanWrite)
            return true;
        assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
        if (this.rightsService.userCanRead(this.shiftModel))
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get color() {
        if (!this.shiftModel)
            this.console.error('[PLANO-17835]');
        assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
        return `#${this.shiftModel.color}`;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isVisible() {
        assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
        return this.filterService.isVisible(this.shiftModel);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    toggleItem() {
        assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
        this.filterService.toggleItem(this.shiftModel);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftModelName() {
        assumeDefinedToGetStrictNullChecksRunning(this.shiftModel, 'shiftModel');
        if (!this.shiftModel.name)
            return '████ █████████';
        return this.shiftModel.name;
    }
    ngOnDestroy() {
        var _a;
        (_a = this.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
    /** Get the color of this shiftModel as hexadecimal string */
    get shiftModelColor() {
        if (!this.shiftModel)
            return null;
        if (!this.shiftModel.rawData) {
            this.console.warn('ShiftModel is gone PLANO-FE-2M4');
            return null;
        }
        if (!this.shiftModel.color)
            return null;
        return `#${this.shiftModel.color}`;
    }
};
__decorate([
    HostBinding('id'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], ShiftmodelListItemComponent.prototype, "hasId", null);
__decorate([
    HostBinding('class.rounded'),
    __metadata("design:type", Object)
], ShiftmodelListItemComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    HostBinding('class.muted-item'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], ShiftmodelListItemComponent.prototype, "_muteItem", null);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftmodelListItemComponent.prototype, "editFilterModeActive", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftmodelListItemComponent.prototype, "editListItemsMode", void 0);
__decorate([
    HostListener('mouseover'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShiftmodelListItemComponent.prototype, "onHover", null);
__decorate([
    HostListener('mouseleave'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShiftmodelListItemComponent.prototype, "onHoverLeave", null);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftmodelListItemComponent.prototype, "shiftModel", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_f = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _f : Object)
], ShiftmodelListItemComponent.prototype, "onItemClick", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftmodelListItemComponent.prototype, "hideMultiSelectBtn", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_g = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _g : Object)
], ShiftmodelListItemComponent.prototype, "onSelectInCalendarClick", void 0);
ShiftmodelListItemComponent = __decorate([
    Component({
        /** @deprecated */
        // eslint-disable-next-line @angular-eslint/component-selector
        selector: 'shiftmodel-list-item[shiftModel]',
        templateUrl: './shiftmodel-list-item.component.html',
        styleUrls: ['./shiftmodel-list-item.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    })
    /** @deprecated */
    ,
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, HighlightService,
        FilterService, typeof (_b = typeof Router !== "undefined" && Router) === "function" ? _b : Object, typeof (_c = typeof RightsService !== "undefined" && RightsService) === "function" ? _c : Object, LogService, typeof (_d = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _d : Object])
], ShiftmodelListItemComponent);
export { ShiftmodelListItemComponent };
//# sourceMappingURL=shiftmodel-list-item.component.js.map