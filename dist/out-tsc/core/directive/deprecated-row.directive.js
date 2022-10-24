import { __decorate, __metadata } from "tslib";
import { Directive } from '@angular/core';
import { LogService } from '../log.service';
let DeprecatedRowDirective = class DeprecatedRowDirective {
    constructor(console) {
        this.console = console;
        this.console.deprecated(`Deprecated: Please replace e.g. <div class="row"> with <p-grid>`);
    }
};
DeprecatedRowDirective = __decorate([
    Directive({
        /* eslint-disable @angular-eslint/directive-selector */
        selector: '.row',
    }),
    __metadata("design:paramtypes", [LogService])
], DeprecatedRowDirective);
export { DeprecatedRowDirective };
//# sourceMappingURL=deprecated-row.directive.js.map