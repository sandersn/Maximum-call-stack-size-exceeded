import { __decorate, __metadata } from "tslib";
import { interval } from 'rxjs';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormattedDateTimePipe } from '@plano/client/shared/formatted-date-time.pipe';
import { TimeStampApiService } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
let TimeStampResultsComponent = class TimeStampResultsComponent {
    constructor(api, formattedDateTimePipe) {
        this.api = api;
        this.formattedDateTimePipe = formattedDateTimePipe;
        this.interval = null;
        this.workingTimeDuration = null;
        this.regularPauseDuration = null;
        this.automaticPauseDuration = null;
        // don’t start update interval on tests because we do not know the state of api there
        if (Config.APPLICATION_MODE !== 'TEST') {
            this.setUpdateInterval(500);
        }
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get start() {
        if (!this.api.isLoaded())
            return null;
        return this.api.data.start;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get end() {
        if (!this.api.isLoaded())
            return null;
        return this.api.data.end;
    }
    ngOnDestroy() {
        var _a;
        (_a = this.interval) === null || _a === void 0 ? void 0 : _a.unsubscribe();
    }
    setUpdateInterval(intervalDuration) {
        this.interval = interval(intervalDuration)
            .subscribe(() => {
            this.workingTimeDuration = this.api.data.workingTimeDuration;
            this.regularPauseDuration = this.api.data.regularPauseDuration;
            this.automaticPauseDuration = this.api.data.automaticPauseDuration;
        });
        // this.interval = window.setInterval(
        // 	() => {
        // 		this.workingTimeDuration = this.api.data.workingTimeDuration;
        // 		this.regularPauseDuration = this.api.data.regularPauseDuration;
        // 	}, intervalDuration
        // );
    }
};
TimeStampResultsComponent = __decorate([
    Component({
        selector: 'p-time-stamp-results',
        templateUrl: './time-stamp-results.component.html',
        styleUrls: ['./time-stamp-results.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [TimeStampApiService,
        FormattedDateTimePipe])
], TimeStampResultsComponent);
export { TimeStampResultsComponent };
//# sourceMappingURL=time-stamp-results.component.js.map