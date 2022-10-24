var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
import { __decorate, __metadata } from "tslib";
import { NgxPopperjsContentComponent, NgxPopperjsPlacements, NgxPopperjsTriggers } from 'ngx-popperjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Component, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { TextToHtmlService } from '@plano/client/scheduling/shared/text-to-html.service';
import { BootstrapRounded } from '@plano/client/shared/bootstrap-styles.enum';
import { HighlightService } from '@plano/client/shared/highlight.service';
import { SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
let ShiftItemTimelineComponent = class ShiftItemTimelineComponent {
    constructor(highlightService, textToHtmlService, schedulingService) {
        this.highlightService = highlightService;
        this.textToHtmlService = textToHtmlService;
        this.schedulingService = schedulingService;
        this.isLoading = false;
        this.readMode = false;
        this.shiftExchangeIconsTemplate = null;
        this.linkedCourseInfoTemplate = null;
        this.states = SchedulingApiAssignmentProcessState;
        this.muteItem = false;
        this.shiftIsSelectable = false;
        /**
         * With this boolean the multi-select checkboxes can be turned off for this shift
         */
        this.selectable = false;
        this.selectedChange = new EventEmitter();
        this.process = null;
        this.meIsAssignable = false;
        this.showAssignMeButton = false;
        this.showMultiSelectCheckbox = false;
        this.showProcessStatusIcon = false;
        this.assignedMembers = null;
        this.CONFIG = Config;
        this.ngUnsubscribe = new Subject();
        this.isInThePast = false;
        this.NgxPopperjsTriggers = NgxPopperjsTriggers;
        this.NgxPopperjsPlacements = NgxPopperjsPlacements;
        this.BootstrapRounded = BootstrapRounded;
        this.subscription = null;
        /**
         * Close tooltip if any and open details of shift
         */
        this.onClickEdit = new EventEmitter();
        // update tooltip visibility
        this.subscription = this.highlightService.onChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(() => {
            const highlighted = this.highlightService.isHighlighted(this.shift);
            const tooltipVisible = this.popperContent.displayType !== 'none';
            if (highlighted && !tooltipVisible) {
                this.popperContent.show();
                window.setTimeout(() => {
                    this.popperContent.update();
                });
            }
            else if (!highlighted && tooltipVisible) {
                this.popperContent.hide();
            }
        });
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onCloseShiftTooltip(_event, popperContent) {
        popperContent.hide();
        this.highlightService.isHighlighted(null);
    }
    ngOnDestroy() {
        var _a;
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
        (_a = this.subscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get hexColor() {
        return this.shift.model.color;
    }
    /**
     * Turn the text into html [and crop it if wanted]
     */
    textToHtml(text) {
        return this.textToHtmlService.textToHtml(text, false, false);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get multiSelectIsPossible() {
        // Shift-Related rules
        if (!this.selectable)
            return false;
        // Environment-Related rules
        return (!Config.IS_MOBILE || this.showMultiSelectCheckbox);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftItemTimelineComponent.prototype, "isLoading", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftItemTimelineComponent.prototype, "readMode", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_b = typeof TemplateRef !== "undefined" && TemplateRef) === "function" ? _b : Object)
], ShiftItemTimelineComponent.prototype, "processStatusIconTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_c = typeof TemplateRef !== "undefined" && TemplateRef) === "function" ? _c : Object)
], ShiftItemTimelineComponent.prototype, "quickAssignmentTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftItemTimelineComponent.prototype, "shiftExchangeIconsTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftItemTimelineComponent.prototype, "linkedCourseInfoTemplate", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_f = typeof TemplateRef !== "undefined" && TemplateRef) === "function" ? _f : Object)
], ShiftItemTimelineComponent.prototype, "memberBadgesTemplate", void 0);
__decorate([
    ViewChild('tooltipRef', { static: true }),
    __metadata("design:type", typeof (_g = typeof NgxPopperjsContentComponent !== "undefined" && NgxPopperjsContentComponent) === "function" ? _g : Object)
], ShiftItemTimelineComponent.prototype, "popperContent", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftItemTimelineComponent.prototype, "muteItem", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftItemTimelineComponent.prototype, "shiftIsSelectable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftItemTimelineComponent.prototype, "selectable", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_h = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _h : Object)
], ShiftItemTimelineComponent.prototype, "selectedChange", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftItemTimelineComponent.prototype, "process", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftItemTimelineComponent.prototype, "meIsAssignable", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftItemTimelineComponent.prototype, "showAssignMeButton", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftItemTimelineComponent.prototype, "showMultiSelectCheckbox", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftItemTimelineComponent.prototype, "showProcessStatusIcon", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftItemTimelineComponent.prototype, "showCourseInfo", void 0);
__decorate([
    Input(),
    __metadata("design:type", typeof (_k = typeof SchedulingApiShift !== "undefined" && SchedulingApiShift) === "function" ? _k : Object)
], ShiftItemTimelineComponent.prototype, "shift", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], ShiftItemTimelineComponent.prototype, "assignedMembers", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], ShiftItemTimelineComponent.prototype, "isInThePast", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_m = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _m : Object)
], ShiftItemTimelineComponent.prototype, "onClickEdit", void 0);
ShiftItemTimelineComponent = __decorate([
    Component({
        selector: 'p-shift-item-timeline[shift][showCourseInfo][processStatusIconTemplate][memberBadgesTemplate][quickAssignmentTemplate]',
        templateUrl: './shift-item-timeline.component.html',
        styleUrls: ['./shift-item-timeline.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof HighlightService !== "undefined" && HighlightService) === "function" ? _a : Object, TextToHtmlService,
        SchedulingService])
], ShiftItemTimelineComponent);
export { ShiftItemTimelineComponent };
//# sourceMappingURL=shift-item-timeline.component.js.map