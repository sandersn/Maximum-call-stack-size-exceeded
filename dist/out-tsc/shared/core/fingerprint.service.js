import { __decorate, __metadata } from "tslib";
/* eslint-disable import/no-named-as-default-member */
import FingerprintJS from '@fingerprintjs/fingerprintjs-pro';
import { Injectable } from '@angular/core';
import { makeQueryablePromise } from './queryable-promise';
/**
 * Service to determine unique device fingerprint (so called "visitorId").
 */
let PFingerprintService = class PFingerprintService {
    constructor() {
        this.fingerprintAgent = null;
        this._visitorId = undefined;
        this._visitorIdPromise = null;
    }
    /**
     * Returns the unique visitor-id of this device. `undefined` is returned when the
     * id has not been determined yet.
     *
     * Call this method only if you need it because it causes costs at www.fingerprintjs.com.
     */
    get visitorId() {
        this.getVisitorIdPromise();
        return this._visitorId;
    }
    /**
     * Ensures that the Fingerprint agent is loaded. The agent is needed to identify an device by a visitor id.
     * See www.fingerprintjs.com.
     */
    ensureAgent() {
        if (this.fingerprintAgent === null) {
            this.fingerprintAgent = makeQueryablePromise(new Promise(resolve => {
                // we experienced app freezes because of fingerprint. Loading the agent deferred seem to reduce the problem.
                // So, we use a timeout.
                window.setTimeout(() => {
                    FingerprintJS.load({
                        token: '1vrkqOkin1vheD7P2yWa',
                        region: 'eu',
                        endpoint: 'https://fp.dr-plano.com',
                    }).then(agent => resolve(agent));
                }, 2000);
            }));
        }
        return this.fingerprintAgent;
    }
    /**
     * Is any finger-print operation running now?
     */
    get isLoading() {
        var _a, _b, _c, _d;
        const agentPending = (_b = (_a = this.fingerprintAgent) === null || _a === void 0 ? void 0 : _a.isPending()) !== null && _b !== void 0 ? _b : false;
        const visitorIdPending = (_d = (_c = this._visitorIdPromise) === null || _c === void 0 ? void 0 : _c.isPending()) !== null && _d !== void 0 ? _d : false;
        return agentPending || visitorIdPending;
    }
    /**
     * Returns `visitorId` as a promise.
     *
     * Call this method only if you need it because it causes costs at www.fingerprintjs.com.
     */
    getVisitorIdPromise() {
        if (!this._visitorIdPromise) {
            this._visitorIdPromise = makeQueryablePromise(this.ensureAgent()
                .then(fp => fp.get())
                .then(result => this._visitorId = result.visitorId));
        }
        return this._visitorIdPromise;
    }
};
PFingerprintService = __decorate([
    Injectable({ providedIn: 'root' }),
    __metadata("design:paramtypes", [])
], PFingerprintService);
export { PFingerprintService };
//# sourceMappingURL=fingerprint.service.js.map