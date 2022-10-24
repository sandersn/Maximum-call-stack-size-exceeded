import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CalenderTimelineLayoutService } from '../../calender-timeline-layout.service';
let PTimelineNowLineComponent = class PTimelineNowLineComponent {
    constructor(layoutService) {
        this.layoutService = layoutService;
    }
    /** Get layout data for the now line */
    get layout() {
        return this.layoutService.getLayout(this.layoutService.NOW_LINE);
    }
};
PTimelineNowLineComponent = __decorate([
    Component({
        selector: 'p-timeline-now-line',
        templateUrl: './timeline-now-line.component.html',
        styleUrls: ['./timeline-now-line.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [CalenderTimelineLayoutService])
], PTimelineNowLineComponent);
export { PTimelineNowLineComponent };
//# sourceMappingURL=timeline-now-line.component.js.map