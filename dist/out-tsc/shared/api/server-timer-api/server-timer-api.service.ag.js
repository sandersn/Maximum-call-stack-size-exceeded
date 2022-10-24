var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { Injectable, NgZone, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiBase } from '@plano/shared/api/base/api-base';
import { Id } from '@plano/shared/api/base/id';
import { Meta } from '@plano/shared/api/base/meta';
import { ApiAttributeInfo } from '@plano/shared/api/base/api-attribute-info';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { ApiObjectWrapper, AuthenticatedApiRole } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { ApiErrorService } from '@plano/shared/api/api-error.service';
/**
 * This service enables access to the api "admin/server_timer".
 * This file is auto generated by de.sage.scheduler.api_generator.ApiGenerator.
 */
// constants
class Consts {
    constructor() {
        this.PAUSED = 1;
        this.SPEED = 2;
        this.CURRENT_TIME = 3;
    }
}
let ServerTimerApiService = class ServerTimerApiService extends ApiBase {
    constructor(h, router, apiE, zone, injector) {
        super(h, router, apiE, zone, injector, 'admin/server_timer');
        this.consts = new Consts();
        this.dataWrapper = new ServerTimerApiRoot(this);
    }
    version() {
        return 'f5c37c6a0ffb9e955640c9c72562a3fe,1fd0334975ef58264316dc28377fb354';
    }
    get data() {
        return this.dataWrapper;
    }
    getRootWrapper() {
        return this.dataWrapper;
    }
    recreateRootWrapper() {
        this.dataWrapper = new ServerTimerApiRoot(this);
    }
};
ServerTimerApiService = __decorate([
    Injectable({
        providedIn: 'root',
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof HttpClient !== "undefined" && HttpClient) === "function" ? _a : Object, typeof (_b = typeof Router !== "undefined" && Router) === "function" ? _b : Object, ApiErrorService, typeof (_c = typeof NgZone !== "undefined" && NgZone) === "function" ? _c : Object, typeof (_d = typeof Injector !== "undefined" && Injector) === "function" ? _d : Object])
], ServerTimerApiService);
export { ServerTimerApiService };
export class ServerTimerApiRoot extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, ServerTimerApiRoot);
        this.api = api;
        this._id = null;
        this.attributeInfoThis = new ApiAttributeInfo({
            apiObjWrapper: this,
            name: '',
            id: 'ROOT',
            show: function () {
                if (!(((this.api.rightsService.requesterIs(AuthenticatedApiRole.SUPER_ADMIN))))) {
                    return false;
                }
                return true;
            },
            canEdit: function () {
                if (!((Config.DEBUG) && ((this.api.rightsService.requesterIs(AuthenticatedApiRole.SUPER_ADMIN))))) {
                    return false;
                }
                return true;
            },
            readMode: function () {
                if (!(((this.api.rightsService.requesterIs(AuthenticatedApiRole.SUPER_ADMIN))))) {
                    return true;
                }
                return false;
            },
        });
        this.attributeInfoPaused = new ApiAttributeInfo({
            apiObjWrapper: this,
            name: 'paused',
            id: 'PAUSED',
            primitiveType: PApiPrimitiveTypes.boolean,
            vars: {
                cannotEditHint: 'Im Produktivmodus kann die Serverzeit nicht verändert werden.',
            }
        });
        this.attributeInfoSpeed = new ApiAttributeInfo({
            apiObjWrapper: this,
            name: 'speed',
            id: 'SPEED',
            primitiveType: PApiPrimitiveTypes.number,
            validations: function () {
                return [
                    () => {
                        return this.api.validators.maxDecimalPlacesCount(10, PApiPrimitiveTypes.number, undefined);
                    },
                ];
            },
            vars: {
                cannotEditHint: 'Im Produktivmodus kann die Serverzeit nicht verändert werden.',
            }
        });
        this.attributeInfoCurrentTime = new ApiAttributeInfo({
            apiObjWrapper: this,
            name: 'currentTime',
            id: 'CURRENT_TIME',
            primitiveType: PApiPrimitiveTypes.DateTime,
            vars: {
                cannotEditHint: 'Im Produktivmodus kann die Serverzeit nicht verändert werden.',
            }
        });
        this._updateRawData(Meta.createNewObject(false, idRaw), true);
        // set parent attribute
    }
    get id() {
        return this._id !== null ? this._id : Id.create(Meta.getNewItemId(this.rawData));
    }
    /**
     *  Is the server paused?
     *
     * @type {boolean}
     */
    get paused() {
        return this.data[1];
    }
    set paused(v) {
        this.setterImpl(1, v, 'paused');
    }
    /**
     *  Server timer speed. Default is "1".
     *
     * @type {number}
     */
    get speed() {
        return this.data[2];
    }
    set speed(v) {
        this.setterImpl(2, v, 'speed');
    }
    /**
     *  Current server time.
     *
     * @type {DateTime}
     */
    get currentTime() {
        return this.data[3];
    }
    set currentTime(v) {
        this.setterImpl(3, v, 'currentTime');
    }
    _fixIds(_idReplacements) {
    }
    _updateRawData(data, generateMissingData) {
        super._updateRawData(data, generateMissingData);
        this.data = data;
        // update id wrapper
        const idRawData = Meta.getId(data);
        this._id = idRawData === null ? null : Id.create(idRawData);
        // create missing/default data
        if (generateMissingData && data) {
            this.fillWithDefaultValues(data, 4);
            data[1] = false;
        }
        // propagate new raw data to children
    }
    get dni() {
        return '1';
    }
    static loadDetailed(api, id, { success = null, error = null, searchParams = null } = {}) {
        return ApiObjectWrapper.loadDetailedImpl(api, id, '1', { success: success, error: error, searchParams: searchParams });
    }
    assumeValidated() {
        // TODO: PLANO-151346
    }
}
//# sourceMappingURL=server-timer-api.service.ag.js.map