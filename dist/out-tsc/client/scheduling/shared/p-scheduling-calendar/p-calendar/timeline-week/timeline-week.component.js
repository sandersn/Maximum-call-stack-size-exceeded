var _a, _b, _c, _d, _e;
import { __decorate, __metadata } from "tslib";
import { ElementRef } from '@angular/core';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiService } from '@plano/shared/api';
import { PRouterService } from '../../../../../../shared/core/router.service';
import { CalenderTimelineLayoutService } from '../../calender-timeline-layout.service';
import { PTimelineNowLineComponent } from '../timeline-now-line/timeline-now-line.component';
let PTimelineWeekComponent = class PTimelineWeekComponent {
    constructor(layout, api, pMoment, pRouterService) {
        this.layout = layout;
        this.api = api;
        this.pMoment = pMoment;
        this.pRouterService = pRouterService;
        // This must be equal to the css styles of .pb-tawk
        this.pbTawk = 200;
        this.shifts = null;
        this.selectable = false;
        this.subscriptions = [];
        this.today = +this.pMoment.m().startOf('day');
    }
    ngOnInit() {
        this.layout.setTimelineContainer(this.timelineContainer.nativeElement);
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
                if (!this.nowLineRef.layout.show)
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
        this.layout.setTimelineContainer(null);
        for (const subscription of this.subscriptions)
            subscription.unsubscribe();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get shiftsForWeek() {
        return this.shifts;
    }
    get weekStart() {
        return this.pMoment.m(this.timestamp).startOf('isoWeek');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get weekdays() {
        const result = [];
        for (let i = 0; i < 7; i++) {
            const dayTimestamp = this.weekStart.add(i, 'day').valueOf();
            result.push(dayTimestamp);
        }
        return result;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    isInThePast(startOfDay) {
        return this.pMoment.m(startOfDay).isBefore(this.today);
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], PTimelineWeekComponent.prototype, "shifts", void 0);
__decorate([
    Input(),
    __metadata("design:type", Number)
], PTimelineWeekComponent.prototype, "timestamp", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PTimelineWeekComponent.prototype, "selectable", void 0);
__decorate([
    ViewChild('timelineContainer', { static: true }),
    __metadata("design:type", typeof (_e = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _e : Object)
], PTimelineWeekComponent.prototype, "timelineContainer", void 0);
__decorate([
    ViewChild('nowLineRef', { static: true }),
    __metadata("design:type", PTimelineNowLineComponent)
], PTimelineWeekComponent.prototype, "nowLineRef", void 0);
PTimelineWeekComponent = __decorate([
    Component({
        selector: 'p-timeline-week[timestamp]',
        templateUrl: './timeline-week.component.html',
        styleUrls: ['./timeline-week.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [CalenderTimelineLayoutService, typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, typeof (_b = typeof PMomentService !== "undefined" && PMomentService) === "function" ? _b : Object, typeof (_c = typeof PRouterService !== "undefined" && PRouterService) === "function" ? _c : Object])
], PTimelineWeekComponent);
export { PTimelineWeekComponent };
//# sourceMappingURL=timeline-week.component.js.map