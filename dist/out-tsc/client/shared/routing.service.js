var _a;
import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
let ClientRoutingService = class ClientRoutingService {
    constructor(router) {
        this.router = router;
        this.routerUrl = this.router.url;
        this.router.events.subscribe(() => {
            this.routerUrl = this.router.url;
        });
    }
    /**
     * On what page is the user?
     */
    get currentPage() {
        if (this.routerUrl.startsWith('/client/scheduling'))
            return 0 /* CurrentPageEnum.SCHEDULING */;
        if (this.routerUrl.startsWith('/client/report'))
            return 1 /* CurrentPageEnum.REPORT */;
        if (this.routerUrl.startsWith('/client/booking'))
            return 2 /* CurrentPageEnum.BOOKING */;
        return null;
    }
};
ClientRoutingService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof Router !== "undefined" && Router) === "function" ? _a : Object])
], ClientRoutingService);
export { ClientRoutingService };
//# sourceMappingURL=routing.service.js.map