var _a, _b, _c, _d, _e;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy, HostBinding, ChangeDetectorRef } from '@angular/core';
import { Input } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiService } from '@plano/shared/api';
import { PRouterService } from '../../../../../../shared/core/router.service';
import { CalenderTimelineLayoutService } from '../../calender-timeline-layout.service';
import { PTimelineNowLineComponent } from '../timeline-now-line/timeline-now-line.component';
import { PTimelineSeparatorsComponent } from '../timeline-separators/timeline-separators.component';
let PTimelineDayComponent = class PTimelineDayComponent {
    constructor(api, layout, pMoment, pRouterService, changeDetectorRef) {
        this.api = api;
        this.layout = layout;
        this.pMoment = pMoment;
        this.pRouterService = pRouterService;
        this.changeDetectorRef = changeDetectorRef;
        this.shifts = null;
        this.timestamp = null;
        this.insideWeekView = false;
        this.selectable = false;
        this.subscriptions = [];
    }
    set _timestamp(input) {
        this.timestamp = input;
        this.api.isLoaded(() => {
            this.timelineSeparatorsRef.scrollToStartOfWorkday();
        });
    }
    ngOnInit() {
        if (!this.insideWeekView) {
            this.layout.setTimelineContainer(this.shiftsWrap.nativeElement);
        }
        window.setTimeout(() => this.scrollToNowLine(false), 100);
        this.subscriptions.push(this.pRouterService.events.subscribe((event) => {
            if (!(event instanceof NavigationEnd))
                return;
            this.scrollToNowLine(true);
        }));
    }
    scrollToNowLine(waitForApiLoaded) {
        const callback = () => {
            requestAnimationFrame(() => {
                var _a;
                if (!((_a = this.nowLineRef) === null || _a === void 0 ? void 0 : _a.layout.show))
                    return;
                this.pRouterService.scrollToSelector('.scroll-target-id-now-line', undefined, false, false, false);
            });
        };
        if (!waitForApiLoaded) {
            callback();
            return;
        }
        const subscriber = this.api.onDataLoaded.subscribe(() => {
            callback();
            subscriber.unsubscribe();
        });
    }
    ngOnDestroy() {
        if (!this.insideWeekView) {
            this.layout.setTimelineContainer(null);
        }
    }
    ngOnChanges() {
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get shiftsForDay() {
        return this.shifts.between(+this.pMoment.m(this.timestamp).startOf('day'), +this.pMoment.m(this.timestamp).startOf('day').add(1, 'day'));
    }
    /**
     * Get shiftsModels for the gutter in background
     */
    get shiftModelsForList() {
        return this.api.data.shiftModels.filterBy((item) => {
            return !item.trashed;
        });
    }
    ngAfterContentChecked() {
        this.startOfToday = +this.pMoment.m().startOf('day');
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTimelineDayComponent.prototype, "shifts", void 0);
__decorate([
    Input('timestamp'),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [Number])
], PTimelineDayComponent.prototype, "_timestamp", null);
__decorate([
    HostBinding('class.inside-week'),
    Input(),
    __metadata("design:type", Boolean)
], PTimelineDayComponent.prototype, "insideWeekView", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PTimelineDayComponent.prototype, "selectable", void 0);
__decorate([
    ViewChild('nowLineRef', { static: false }),
    __metadata("design:type", PTimelineNowLineComponent)
], PTimelineDayComponent.prototype, "nowLineRef", void 0);
__decorate([
    ViewChild('shiftsWrap', { static: true }),
    __metadata("design:type", Object)
], PTimelineDayComponent.prototype, "shiftsWrap", void 0);
__decorate([
    ViewChild('timelineSeparatorsRef', { static: true }),
    __metadata("design:type", PTimelineSeparatorsComponent)
], PTimelineDayComponent.prototype, "timelineSeparatorsRef", void 0);
PTimelineDayComponent = __decorate([
    Component({
        selector: 'p-timeline-day',
        templateUrl: './timeline-day.component.html',
        styleUrls: ['./timeline-day.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, CalenderTimelineLayoutService, typeof (_b = typeof PMomentService !== "undefined" && PMomentService) === "function" ? _b : Object, typeof (_c = typeof PRouterService !== "undefined" && PRouterService) === "function" ? _c : Object, typeof (_d = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _d : Object])
], PTimelineDayComponent);
export { PTimelineDayComponent };
//# sourceMappingURL=timeline-day.component.js.map