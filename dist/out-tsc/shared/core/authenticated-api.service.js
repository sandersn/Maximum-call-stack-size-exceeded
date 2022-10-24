import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { AuthenticatedApiRootBase, AuthenticatedApiRole } from '@plano/shared/api';
let AuthenticatedApiRoot = class AuthenticatedApiRoot extends AuthenticatedApiRootBase {
    constructor(api) {
        super(api);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get isOwner() {
        if (!this.rawData)
            throw new Error(`Please load AuthenticatedApi first [PLANO-FE-9X]`);
        return this.role === AuthenticatedApiRole.CLIENT_OWNER;
    }
};
AuthenticatedApiRoot = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [Object])
], AuthenticatedApiRoot);
export { AuthenticatedApiRoot };
//# sourceMappingURL=authenticated-api.service.js.map