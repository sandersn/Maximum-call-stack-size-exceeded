import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
let CurrentModalsService = class CurrentModalsService {
    constructor() {
        this.modals = [];
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    get isModalOpened() {
        return !!this.modals.length;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    addModal() {
        this.modals.push('foo');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    removeModal() {
        this.modals.pop();
    }
};
CurrentModalsService = __decorate([
    Injectable({ providedIn: 'root' }),
    __metadata("design:paramtypes", [])
], CurrentModalsService);
export { CurrentModalsService };
//# sourceMappingURL=current-modals.service.js.map