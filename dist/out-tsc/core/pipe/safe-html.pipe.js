var _a;
import { __decorate, __metadata } from "tslib";
import { Pipe } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
let SafeHtmlPipe = class SafeHtmlPipe {
    constructor(sanitized) {
        this.sanitized = sanitized;
    }
    /**
     * Sanitize given html
     */
    transform(html) {
        return this.sanitized.bypassSecurityTrustHtml(html);
    }
};
SafeHtmlPipe = __decorate([
    Pipe({ name: 'pSafeHtml' }),
    __metadata("design:paramtypes", [typeof (_a = typeof DomSanitizer !== "undefined" && DomSanitizer) === "function" ? _a : Object])
], SafeHtmlPipe);
export { SafeHtmlPipe };
//# sourceMappingURL=safe-html.pipe.js.map