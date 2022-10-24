import { __decorate, __metadata } from "tslib";
// cSpell:ignore launchdarkly
import * as LDClient from 'launchdarkly-js-client-sdk';
import { Injectable } from '@angular/core';
import { Config } from '../core/config';
import { LogService } from '../core/log.service';
import { assumeNonNull } from '../core/null-type-utils';
/**
 * Everything we do with LaunchDarkly should go here.
 */
let PLaunchDarklyService = class PLaunchDarklyService {
    constructor(console) {
        this.console = console;
        this.lDClient = null;
    }
    /**
     * Init LaunchDarkly
     */
    init(clientId) {
        const user = {
            key: clientId,
        };
        this.lDClient = LDClient.initialize(Config.LAUNCH_DARKLY_CLIENT_ID, user);
        this.lDClient.waitForInitialization().then(() => {
            // initialization succeeded, flag values are now available
        }).catch(error => {
            if (Config.DEBUG) {
                this.console.warn(error);
                return;
            }
            throw new Error(error);
        });
    }
    /**
     * Get the value from LaunchDarkly.
     * @returns The flags value. undefined if LaunchDarkly is not available and no default value is defined
     */
    get(id, defaultValue) {
        assumeNonNull(this.lDClient);
        return this.lDClient.variation(id, defaultValue);
    }
};
PLaunchDarklyService = __decorate([
    Injectable({ providedIn: 'root' }),
    __metadata("design:paramtypes", [LogService])
], PLaunchDarklyService);
export { PLaunchDarklyService };
//# sourceMappingURL=launch-darkly.js.map