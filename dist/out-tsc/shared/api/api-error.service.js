import { __decorate } from "tslib";
import { ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
let ApiErrorService = class ApiErrorService {
    constructor() {
        /**
         * Register to this subject to be notified about all api errors.
         */
        // eslint-disable-next-line rxjs/no-ignored-replay-buffer
        this.error = new ReplaySubject();
    }
};
ApiErrorService = __decorate([
    Injectable({
        providedIn: 'root',
    })
], ApiErrorService);
export { ApiErrorService };
//# sourceMappingURL=api-error.service.js.map