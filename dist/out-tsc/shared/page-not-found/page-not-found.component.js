var _a;
import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Meta } from '@angular/platform-browser';
/**
 * Page not found
 */
let PageNotFoundComponent = class PageNotFoundComponent {
    constructor(meta) {
        this.meta = meta;
        // Set status code for prerender.io to 404 so the page will not be cached by prerender.io.
        // This is important because some bots will randomly check out many urls. Without
        // these all the urls would be cached by prerender.io.
        // So also https://prerender.io/documentation/best-practices
        this.meta.updateTag({ name: 'prerender-status-code', content: '404' });
    }
    ngOnDestroy() {
        this.meta.removeTag("name='prerender-status-code'");
    }
};
PageNotFoundComponent = __decorate([
    Component({
        selector: 'p-page-not-found',
        templateUrl: './page-not-found.component.html',
        styleUrls: ['./page-not-found.component.scss'],
        changeDetection: ChangeDetectionStrategy.OnPush,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof Meta !== "undefined" && Meta) === "function" ? _a : Object])
], PageNotFoundComponent);
export { PageNotFoundComponent };
//# sourceMappingURL=page-not-found.component.js.map