var _a;
import { __decorate, __metadata } from "tslib";
import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { LogService } from './log.service';
import { SchedulingApiService, TimeStampApiService } from '../api';
let PProgressbarService = class PProgressbarService {
    constructor(schedulingApiService, timeStampApiService, console) {
        this.schedulingApiService = schedulingApiService;
        this.timeStampApiService = timeStampApiService;
        this.console = console;
        this.onChange = new Subject();
        this.startDelayMs = 20;
        this.startDelayTimeout = null;
        this.state = 'idle';
        /**
         * Make sure the bar will not disappear abrupt. Also… let time pass by to make it possible that another start() call
         * can extend the duration of visibility of current bar instead of starting another one.
         */
        this.completeDelayMs = 50;
        this.completeDelayTimeout = null;
        this.initService();
    }
    initService() {
        this.schedulingApiService.onDataLoadStart.subscribe(() => this.start());
        this.timeStampApiService.onDataLoadStart.subscribe(() => this.start());
        this.schedulingApiService.onDataLoaded.subscribe(() => this.complete());
        this.timeStampApiService.onDataLoaded.subscribe(() => this.complete());
    }
    stopStartDelayTimeout() {
        var _a;
        window.clearTimeout((_a = this.startDelayTimeout) !== null && _a !== void 0 ? _a : undefined);
        this.startDelayTimeout = null;
    }
    /**
     * Show the progressbar and start the animation
     */
    start() {
        if (this.completeDelayTimeout !== null) {
            this.stopCompleteDelayTimeout();
            this.console.debug('Progressbar ➡ 🧭 completion delayed');
            return;
        }
        // debounceTime setting Seems to have no effect. Therefore i added startDelayTimeout myself.
        if (this.startDelayTimeout !== null)
            return;
        if (this.state === 'running')
            return;
        this.console.debug('Progressbar ➡ ⏱ requested');
        this.startDelayTimeout = window.setTimeout(() => {
            this.stopStartDelayTimeout();
            if (this.state === 'running')
                return;
            this.onChange.next('start');
            this.state = 'running';
            this.console.debug('Progressbar ➡ 🛫 started');
        }, this.startDelayMs);
    }
    /**
     * Set the progressbar to a specific percentage
     */
    set(percentage) {
        this.onChange.next(percentage);
    }
    stopCompleteDelayTimeout() {
        var _a;
        window.clearTimeout((_a = this.completeDelayTimeout) !== null && _a !== void 0 ? _a : undefined);
        this.completeDelayTimeout = null;
    }
    /**
     * Complete the progressbar animation and hide it
     */
    complete() {
        // If a progressbar is waiting to start (startDelayTimeout) then stop this waiting and do nothing.
        if (this.startDelayTimeout !== null) {
            this.stopStartDelayTimeout();
            this.console.debug('Progressbar ➡ 🚫 requested canceled');
            return;
        }
        if (this.completeDelayTimeout !== null)
            return;
        if (this.state === 'idle')
            return;
        this.onChange.next(90);
        this.completeDelayTimeout = window.setTimeout(() => {
            this.stopCompleteDelayTimeout();
            if (this.state === 'idle')
                return;
            this.onChange.next('complete');
            this.state = 'idle';
            this.console.debug('Progressbar ➡ 🛬 completed');
        }, this.completeDelayMs);
    }
    /**
     * Connect a progress bar ref to this service.
     */
    setSubscriber(ngProgressRef) {
        this.onChange.subscribe((event) => {
            switch (event) {
                case 'start':
                    ngProgressRef.start();
                    break;
                case 'complete':
                    ngProgressRef.complete();
                    break;
                default:
                    ngProgressRef.set(event);
            }
        });
    }
};
PProgressbarService = __decorate([
    Injectable({ providedIn: 'root' }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, TimeStampApiService,
        LogService])
], PProgressbarService);
export { PProgressbarService };
//# sourceMappingURL=progressbar.service.js.map