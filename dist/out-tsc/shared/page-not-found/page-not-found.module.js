import { __decorate } from "tslib";
import { NgModule } from '@angular/core';
import { PageNotFoundComponent } from './page-not-found.component';
import { PFaIconModule } from '../core/component/fa-icon/fa-icon.module';
let PageNotFoundModule = class PageNotFoundModule {
};
PageNotFoundModule = __decorate([
    NgModule({
        declarations: [
            PageNotFoundComponent,
        ],
        exports: [
            PageNotFoundComponent,
        ],
        imports: [
            PFaIconModule,
        ],
        providers: [],
    })
], PageNotFoundModule);
export { PageNotFoundModule };
//# sourceMappingURL=page-not-found.module.js.map