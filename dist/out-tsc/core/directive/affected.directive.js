import { __decorate, __metadata } from "tslib";
import { Directive, Input, HostBinding } from '@angular/core';
let AffectedDirective = class AffectedDirective {
    constructor() { }
};
__decorate([
    HostBinding('class.affected'),
    Input(),
    __metadata("design:type", Boolean)
], AffectedDirective.prototype, "affected", void 0);
AffectedDirective = __decorate([
    Directive({
        /* eslint-disable @angular-eslint/directive-selector */
        selector: '[affected]',
    }),
    __metadata("design:paramtypes", [])
], AffectedDirective);
export { AffectedDirective };
//# sourceMappingURL=affected.directive.js.map