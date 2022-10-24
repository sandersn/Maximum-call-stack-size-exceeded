import { __decorate } from "tslib";
import { Injectable } from '@angular/core';
import { AuthenticatedApiRole } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
let FakeMeService = class FakeMeService {
    constructor() {
        this.data = {
            id: Id.create(133713371337),
            isOwner: true,
            firstName: 'Maria Magdalena',
            // eslint-disable-next-line literal-blacklist/literal-blacklist
            lastName: 'Ipsum',
            companyName: 'Boulder Bar GmbH',
            role: AuthenticatedApiRole.CLIENT_OWNER,
        };
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    isLoaded() {
        return true;
    }
    /**
     * 	@param _basicAuthValue credential basic-auth value
     *  @param _changeCookies Should cookie values be touched?
     *  @param success Success event when credentials were set successfully.
     *  @param _error Error event when credentials could not be set.
     */
    login(_basicAuthValue, _changeCookies, _loggedInFromLoginForm, success, _error) {
        if (success)
            success();
    }
};
FakeMeService = __decorate([
    Injectable()
], FakeMeService);
export { FakeMeService };
//# sourceMappingURL=me.service.mock.js.map