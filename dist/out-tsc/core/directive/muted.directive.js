import { __decorate, __metadata } from "tslib";
import { Directive, Input, HostBinding } from '@angular/core';
let MutedDirective = class MutedDirective {
    constructor() { }
    get isMuted() {
        return this.muted === true;
    }
    get isUnmuted() {
        return this.muted === false;
    }
};
__decorate([
    HostBinding('class.muted-item'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], MutedDirective.prototype, "isMuted", null);
__decorate([
    HostBinding('class.unmuted-item'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], MutedDirective.prototype, "isUnmuted", null);
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], MutedDirective.prototype, "muted", void 0);
MutedDirective = __decorate([
    Directive({
        /* eslint-disable @angular-eslint/directive-selector */
        selector: '[muted]',
    }),
    __metadata("design:paramtypes", [])
], MutedDirective);
export { MutedDirective };
//# sourceMappingURL=muted.directive.js.map