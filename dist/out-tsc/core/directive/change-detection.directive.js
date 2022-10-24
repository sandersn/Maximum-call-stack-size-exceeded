var _a;
import { __decorate, __metadata } from "tslib";
import { Directive, Input, ChangeDetectorRef } from '@angular/core';
let ChangeDetectionDirective = class ChangeDetectionDirective {
    constructor(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
    }
    /**
     * Should changes be detected?
     */
    set changeDetection(enable) {
        if (enable) {
            this.changeDetectorRef.reattach();
        }
        else {
            this.changeDetectorRef.detach();
        }
    }
};
__decorate([
    Input(),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [Boolean])
], ChangeDetectionDirective.prototype, "changeDetection", null);
ChangeDetectionDirective = __decorate([
    Directive({
        /* eslint-disable @angular-eslint/directive-selector */
        selector: '[changeDetection]',
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _a : Object])
], ChangeDetectionDirective);
export { ChangeDetectionDirective };
//# sourceMappingURL=change-detection.directive.js.map