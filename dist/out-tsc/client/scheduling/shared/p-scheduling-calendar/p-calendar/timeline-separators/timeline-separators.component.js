var _a, _b;
import { __decorate, __metadata } from "tslib";
import { Component, ElementRef, ViewChild, ChangeDetectionStrategy, Input, NgZone } from '@angular/core';
let PTimelineSeparatorsComponent = class PTimelineSeparatorsComponent {
    constructor(zone) {
        this.zone = zone;
        this.showNumbers = false;
    }
    ngAfterViewInit() {
        this.scrollToStartOfWorkday();
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    scrollToStartOfWorkday() {
        this.zone.runOutsideAngular(() => {
            requestAnimationFrame(() => {
                const el = this.startOfWorkday.nativeElement;
                el.scrollIntoView();
            });
        });
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], PTimelineSeparatorsComponent.prototype, "showNumbers", void 0);
__decorate([
    ViewChild('startOfWorkday', { static: true }),
    __metadata("design:type", typeof (_b = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _b : Object)
], PTimelineSeparatorsComponent.prototype, "startOfWorkday", void 0);
PTimelineSeparatorsComponent = __decorate([
    Component({
        selector: 'p-timeline-separators',
        templateUrl: './timeline-separators.component.html',
        styleUrls: ['./timeline-separators.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof NgZone !== "undefined" && NgZone) === "function" ? _a : Object])
], PTimelineSeparatorsComponent);
export { PTimelineSeparatorsComponent };
//# sourceMappingURL=timeline-separators.component.js.map