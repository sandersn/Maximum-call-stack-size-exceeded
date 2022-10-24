var _a;
import { __decorate, __metadata } from "tslib";
import { Directive, ElementRef } from '@angular/core';
let AutofocusDirective = class AutofocusDirective {
    constructor(elementRef) {
        this.elementRef = elementRef;
    }
    ngAfterViewInit() {
        this.elementRef.nativeElement.focus();
    }
};
AutofocusDirective = __decorate([
    Directive({
        /* eslint-disable @angular-eslint/directive-selector */
        selector: '[autofocus]',
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof ElementRef !== "undefined" && ElementRef) === "function" ? _a : Object])
], AutofocusDirective);
export { AutofocusDirective };
//# sourceMappingURL=autofocus.directive.js.map