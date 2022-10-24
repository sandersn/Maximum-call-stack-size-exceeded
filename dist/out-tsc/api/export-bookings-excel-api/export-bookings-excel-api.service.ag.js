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
import { ApiListWrapper, ApiObjectWrapper } from '@plano/shared/api';
import { ApiErrorService } from '@plano/shared/api/api-error.service';
/**
 * This service enables access to the api "export_bookings_excel".
 * This file is auto generated by de.sage.scheduler.api_generator.ApiGenerator.
 */
// constants
class Consts {
    constructor() {
        this.BOOKING_IDS = 1;
        this.SHIFT_MODEL_IDS = 2;
    }
}
let ExportBookingsExcelApiService = class ExportBookingsExcelApiService extends ApiBase {
    constructor(h, router, apiE, zone, injector) {
        super(h, router, apiE, zone, injector, 'export_bookings_excel');
        this.consts = new Consts();
        this.dataWrapper = new ExportBookingsExcelApiRoot(this);
    }
    version() {
        return 'f33a5c3c66e66b01b4488f391f2a3efc,ea44a6700b1f2b9a163740ed4d6dc56a';
    }
    get data() {
        return this.dataWrapper;
    }
    getRootWrapper() {
        return this.dataWrapper;
    }
    recreateRootWrapper() {
        this.dataWrapper = new ExportBookingsExcelApiRoot(this);
    }
};
ExportBookingsExcelApiService = __decorate([
    Injectable({
        providedIn: 'root',
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof HttpClient !== "undefined" && HttpClient) === "function" ? _a : Object, typeof (_b = typeof Router !== "undefined" && Router) === "function" ? _b : Object, ApiErrorService, typeof (_c = typeof NgZone !== "undefined" && NgZone) === "function" ? _c : Object, typeof (_d = typeof Injector !== "undefined" && Injector) === "function" ? _d : Object])
], ExportBookingsExcelApiService);
export { ExportBookingsExcelApiService };
export class ExportBookingsExcelApiRoot extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, ExportBookingsExcelApiRoot);
        this.api = api;
        this._id = null;
        this.attributeInfoThis = new ApiAttributeInfo({
            apiObjWrapper: this,
            name: '',
            id: 'ROOT',
            show: function () {
                if (!((this.api.rightsService.hasManagerRights))) {
                    return false;
                }
                return true;
            },
            canEdit: function () {
                if (!((this.api.rightsService.hasManagerRights))) {
                    return false;
                }
                return true;
            },
            readMode: function () {
                return false;
            },
        });
        this.bookingIdsWrapper = new ExportBookingsExcelApiBookingIds(this.api, false);
        this.shiftModelIdsWrapper = new ExportBookingsExcelApiShiftModelIds(this.api, false);
        this._updateRawData(Meta.createNewObject(false, idRaw), true);
        // set parent attribute
        this.bookingIdsWrapper.parent = this;
        this.shiftModelIdsWrapper.parent = this;
    }
    get id() {
        return this._id !== null ? this._id : Id.create(Meta.getNewItemId(this.rawData));
    }
    /**
     *  Id list of the bookings to be exported.
     */
    get bookingIds() {
        return this.bookingIdsWrapper;
    }
    set bookingIdsTestSetter(v) {
        this.setterImpl(1, v.rawData, 'bookingIds', () => { this.bookingIdsWrapper = v; });
    }
    /**
     *  Id list of the shift model to be exported.
     */
    get shiftModelIds() {
        return this.shiftModelIdsWrapper;
    }
    set shiftModelIdsTestSetter(v) {
        this.setterImpl(2, v.rawData, 'shiftModelIds', () => { this.shiftModelIdsWrapper = v; });
    }
    _fixIds(_idReplacements) {
        this.bookingIdsWrapper._fixIds(_idReplacements);
        this.shiftModelIdsWrapper._fixIds(_idReplacements);
    }
    _updateRawData(data, generateMissingData) {
        super._updateRawData(data, generateMissingData);
        this.data = data;
        // update id wrapper
        const idRawData = Meta.getId(data);
        this._id = idRawData === null ? null : Id.create(idRawData);
        // create missing/default data
        if (generateMissingData && data) {
            this.fillWithDefaultValues(data, 3);
            if (data[1] === null)
                data[1] = Meta.createNewList();
            if (data[2] === null)
                data[2] = Meta.createNewList();
        }
        // propagate new raw data to children
        this.bookingIdsWrapper._updateRawData(data ? data[1] : null, generateMissingData);
        this.shiftModelIdsWrapper._updateRawData(data ? data[2] : null, generateMissingData);
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
export class ExportBookingsExcelApiBookingIds extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'bookingIds');
        this.api = api;
        this.parent = null;
        this.attributeInfoThis = new ApiAttributeInfo({
            apiObjWrapper: this,
            name: 'bookingIds',
            id: 'BOOKING_IDS',
            primitiveType: PApiPrimitiveTypes.ApiList,
        });
        this.attributeInfoBookingId = new ApiAttributeInfo({
            apiObjWrapper: this,
            name: 'bookingId',
            id: 'BOOKING_ID',
        });
    }
    wrapItem(item, _generateMissingData) {
        const newWrapper = new ExportBookingsExcelApiBookingId(this.api);
        newWrapper._updateRawData(item, _generateMissingData);
        return newWrapper;
    }
    containsPrimitives() {
        return false;
    }
    containsIds() {
        return false;
    }
    createInstance(removeDestroyedItems) {
        return new ExportBookingsExcelApiBookingIds(this.api, removeDestroyedItems);
    }
    get dni() {
        return '2';
    }
    createNewItem(id = null) {
        const newItemRaw = Meta.createNewObject(false, !!id ? id.rawData : null);
        const newItem = this.wrapItem(newItemRaw, true);
        this.push(newItem);
        if (this.api)
            this.api.changed('bookingIds');
        return newItem;
    }
}
export class ExportBookingsExcelApiBookingId extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, ExportBookingsExcelApiBookingId);
        this.api = api;
        this.parent = null;
        this._id = null;
        this.attributeInfoThis = new ApiAttributeInfo({
            apiObjWrapper: this,
            name: 'bookingId',
            id: 'BOOKING_ID',
        });
        this._updateRawData(Meta.createNewObject(false, idRaw), true);
        // set parent attribute
    }
    get id() {
        return this._id !== null ? this._id : Id.create(Meta.getNewItemId(this.rawData));
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
            this.fillWithDefaultValues(data, 1);
        }
        // propagate new raw data to children
    }
    get dni() {
        return '4';
    }
    static loadDetailed(api, id, { success = null, error = null, searchParams = null } = {}) {
        return ApiObjectWrapper.loadDetailedImpl(api, id, '4', { success: success, error: error, searchParams: searchParams });
    }
    assumeValidated() {
        // TODO: PLANO-151346
    }
}
export class ExportBookingsExcelApiShiftModelIds extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'shiftModelIds');
        this.api = api;
        this.parent = null;
        this.attributeInfoThis = new ApiAttributeInfo({
            apiObjWrapper: this,
            name: 'shiftModelIds',
            id: 'SHIFT_MODEL_IDS',
            primitiveType: PApiPrimitiveTypes.ApiList,
        });
        this.attributeInfoShiftModelId = new ApiAttributeInfo({
            apiObjWrapper: this,
            name: 'shiftModelId',
            id: 'SHIFT_MODEL_ID',
            primitiveType: PApiPrimitiveTypes.Id,
        });
    }
    wrapItem(item, _generateMissingData) {
        return Id.create(item);
    }
    containsPrimitives() {
        return false;
    }
    containsIds() {
        return true;
    }
    createInstance(removeDestroyedItems) {
        return new ExportBookingsExcelApiShiftModelIds(this.api, removeDestroyedItems);
    }
    get dni() {
        return '3';
    }
    createNewItem() {
        const newItemRaw = null;
        const newItem = this.wrapItem(newItemRaw, true);
        this.push(newItem);
        if (this.api)
            this.api.changed('shiftModelIds');
        return newItem;
    }
}
//# sourceMappingURL=export-bookings-excel-api.service.ag.js.map