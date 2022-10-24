var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { CalenderTimelineLayoutService } from '@plano/client/scheduling/shared/p-scheduling-calendar/calender-timeline-layout.service';
import { TextToHtmlService } from '@plano/client/scheduling/shared/text-to-html.service';
import { NgbFormatsService } from '@plano/client/service/ngbformats.service';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { BootstrapSize } from '../../bootstrap-styles.enum';
let PShiftItemTooltipComponent = class PShiftItemTooltipComponent {
    constructor(me, api, layout, ngbFormats, rightsService, textToHtmlService, changeDetectorRef) {
        this.me = me;
        this.api = api;
        this.layout = layout;
        this.ngbFormats = ngbFormats;
        this.rightsService = rightsService;
        this.textToHtmlService = textToHtmlService;
        this.changeDetectorRef = changeDetectorRef;
        this.readMode = false;
        this.quickAssignmentTemplate = null;
        this.processInfoTemplate = null;
        this.illnessShiftExchangesListTemplate = null;
        this.linkedCourseInfoTemplate = null;
        this.showProcessStatusIcon = false;
        this.onClickEdit = new EventEmitter();
        /**
         * User closes the tooltip
         */
        this.onClose = new EventEmitter();
        this.states = SchedulingApiAssignmentProcessState;
        this.BootstrapSize = BootstrapSize;
        this.icons = PlanoFaIconPool;
        this.subscription = null;
    }
    ngOnInit() {
        this.subscription = this.api.onChange.subscribe(() => {
            this.changeDetectorRef.markForCheck();
        });
    }
    ngOnDestroy() {
        var _a;
        (_a = this.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get showEditShiftButton() {
        if (this.readMode)
            return false;
        if (!this.rightsService.userCanRead(this.shift.model))
            return false;
        return true;
    }
    /**
     * Check if user can edit this shift
     */
    get userCanWrite() {
        return !!this.rightsService.userCanWrite(this.shift);
    }
    /**
     * Turn the text into html [and crop it if wanted]
     */
    textToHtml(text, maxLength) {
        return this.textToHtmlService.textToHtml(text, maxLength, false);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PShiftItemTooltipComponent.prototype, "readMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftItemTooltipComponent.prototype, "quickAssignmentTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftItemTooltipComponent.prototype, "processInfoTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftItemTooltipComponent.prototype, "illnessShiftExchangesListTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftItemTooltipComponent.prototype, "linkedCourseInfoTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_k = typeof SchedulingApiShift !== "undefined" && SchedulingApiShift) === "function" ? _k : Object)
], PShiftItemTooltipComponent.prototype, "shift", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PShiftItemTooltipComponent.prototype, "showProcessStatusIcon", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_l = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _l : Object)
], PShiftItemTooltipComponent.prototype, "onClickEdit", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_m = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _m : Object)
], PShiftItemTooltipComponent.prototype, "onClose", void 0);
PShiftItemTooltipComponent = __decorate([
    Component({
        selector: 'p-shift-item-tooltip[shift]',
        templateUrl: './p-shift-item-tooltip.component.html',
        styleUrls: ['./p-shift-item-tooltip.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [MeService, typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, typeof (_b = typeof CalenderTimelineLayoutService !== "undefined" && CalenderTimelineLayoutService) === "function" ? _b : Object, NgbFormatsService, typeof (_c = typeof RightsService !== "undefined" && RightsService) === "function" ? _c : Object, typeof (_d = typeof TextToHtmlService !== "undefined" && TextToHtmlService) === "function" ? _d : Object, typeof (_e = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _e : Object])
], PShiftItemTooltipComponent);
export { PShiftItemTooltipComponent };
//# sourceMappingURL=p-shift-item-tooltip.component.js.map