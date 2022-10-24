import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { TimeStampApiService } from '@plano/shared/api';
let StopwatchImageComponent = class StopwatchImageComponent {
    constructor(api) {
        this.api = api;
        this.stampedMember = null;
        this.invertedColors = false;
        if (!api.isLoaded()) {
            api.load();
        }
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get image() {
        let result;
        if (!this.api.isLoaded()) {
            if (this.invertedColors) {
                result = 'stopwatch_24px_weiss.png';
            }
            else {
                result = 'stopwatch.png';
            }
        }
        else if (this.stampedMember) {
            if (this.stampedMember.pausing) {
                result = 'pause_32px.png';
            }
            else {
                result = 'stopwatch-animated_32px.gif';
            }
        }
        else if (this.api.isWorking) {
            if (this.invertedColors) {
                result = 'stopwatch-animated_24px_weiss.gif';
            }
            else {
                result = 'stopwatch-animated.gif';
            }
        }
        else if (this.api.isPausing) {
            if (this.invertedColors) {
                result = 'pause-animated_24px_weiss.gif';
            }
            else {
                result = 'pause-animated.gif';
            }
        }
        else if (this.invertedColors) {
            result = 'stopwatch_24px_weiss.png';
        }
        else {
            result = 'stopwatch.png';
        }
        return result;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get maxHeight() {
        var _a;
        if (this.invertedColors)
            return '22';
        if ((_a = this.stampedMember) === null || _a === void 0 ? void 0 : _a.attributeInfoPausing.value)
            return '32';
        return 'auto';
    }
};
__decorate([
    Input(),
    __metadata("design:type", Object)
], StopwatchImageComponent.prototype, "stampedMember", void 0);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], StopwatchImageComponent.prototype, "invertedColors", void 0);
StopwatchImageComponent = __decorate([
    Component({
        selector: 'p-stopwatch-image',
        templateUrl: './stopwatch-image.component.html',
        styleUrls: ['./stopwatch-image.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [TimeStampApiService])
], StopwatchImageComponent);
export { StopwatchImageComponent };
//# sourceMappingURL=stopwatch-image.component.js.map