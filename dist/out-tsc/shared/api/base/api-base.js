/* eslint-disable max-lines */
import { firstValueFrom, Subject } from 'rxjs';
import { PercentPipe } from '@angular/common';
import { HttpHeaders, HttpParams, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { MeService, SchedulingApiService, AffectedShiftsApiService } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { ApiDataStack } from '@plano/shared/api/base/api-data-stack';
import { Config } from '@plano/shared/core/config';
import { DataInput } from '@plano/shared/core/data/data-input';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { NOT_CHANGED } from './object-diff';
import { ToastsService } from '../../../client/service/toasts.service';
import { PMomentService } from '../../../client/shared/p-moment.service';
import { PFingerprintService } from '../../core/fingerprint.service';
import { LogService } from '../../core/log.service';
import { LocalizePipe } from '../../core/pipe/localize.pipe';
import { errorUtils } from '../../core/typescript-utils';
export { NOT_CHANGED as INITIALIZED_IN_BACKEND } from './object-diff';
export class ApiBase extends DataInput {
    constructor(http, router, apiError, zone, injector, apiPath, _data = null) {
        super(zone);
        this.http = http;
        this.router = router;
        this.apiError = apiError;
        this.injector = injector;
        this.apiPath = apiPath;
        /**
         * Search params of the last load operation which was executed.
         */
        this.lastExecutedLoadSearchParams = null;
        /**
         * Called when a load operation starts.
         */
        this.onDataLoadStart = new Subject();
        /**
         * Called when a load operation was successful.
         */
        this.onDataLoaded = new Subject();
        this.isLoadedSubject = new Subject();
        /**
         * The id of the last load operation.
         */
        this.lastLoadOperationId = 0;
        this._rightsService = null;
        this._validators = null;
        this._localizePipe = null;
        this._pMoment = null;
        this._me = null;
        this._toasts = null;
        this._schedulingApi = null;
        this._affectedShiftsApi = null;
        this._datePipe = null;
        this._percentPipe = null;
        this._fingerprintService = null;
        this._console = null;
        /**
         * The id of the last save operation.
         */
        this.lastSaveOperationId = 0;
        this.runningSaveOperationCount = 0;
        this.runningLoadOperationCount = 0;
        this.runningPostOperationCount = 0;
        this.mockMode = false;
        this.currentlyDetailedLoaded = null;
        this.apiUrl = `${Config.BACKEND_URL}/${this.apiPath}`;
        if (Config.DEBUG && this.apiUrl.includes('999.999.999.999'))
            throw new Error('Backend ip is 999.999.999.999 which is the dummy ip for the public profile. Looks like the script to start the public profile has not replaced this by your real ip.');
        // init data stack
        this.dataStack = new ApiDataStack((change) => {
            // Is the root wrapper not pointing to top data?
            const top = this.dataStack.getTop();
            if (this.getRootWrapper().rawData !== top) {
                // Then update wrappers data
                // Currently we don't want to generate missing data for incoming api data because:
                // 1. The api currently always send full structure for the requested detail
                // 2. Current data generation implementation always also generates detailed nodes which is not desired.
                this.getRootWrapper()._updateRawData(top, false);
                // notify observers after change happened
                this.changed(change);
            }
        });
    }
    /**
     * The global `NgZone`.
     */
    getZone() {
        return this.zone;
    }
    /**
     * The global `RightsService`.
     */
    get rightsService() {
        // To avoid circular dependencies we use lazy initialization
        if (!this._rightsService)
            this._rightsService = this.injector.get(RightsService);
        return this._rightsService;
    }
    /**
     * The global `ValidatorsService`.
     */
    get validators() {
        // To avoid circular dependencies we use lazy initialization
        if (!this._validators)
            this._validators = this.injector.get(ValidatorsService);
        return this._validators;
    }
    /**
     * The global `LocalizePipe`.
     */
    get localizePipe() {
        // To avoid circular dependencies we use lazy initialization
        if (!this._localizePipe)
            this._localizePipe = this.injector.get(LocalizePipe);
        return this._localizePipe;
    }
    /**
     * The global `LogService`.
     */
    get console() {
        // To avoid circular dependencies we use lazy initialization
        if (!this._console)
            this._console = this.injector.get(LogService);
        return this._console;
    }
    /**
     * The global `PMomentService`.
     */
    get pMoment() {
        // To avoid circular dependencies we use lazy initialization
        if (!this._pMoment)
            this._pMoment = this.injector.get(PMomentService);
        return this._pMoment;
    }
    /**
     * The global `MeService`.
     */
    get me() {
        // To avoid circular dependencies we use lazy initialization
        if (!this._me)
            this._me = this.injector.get(MeService);
        return this._me;
    }
    /**
     * The global `ToastsService`.
     */
    get toasts() {
        // To avoid circular dependencies we use lazy initialization
        if (!this._toasts)
            this._toasts = this.injector.get(ToastsService);
        return this._toasts;
    }
    /**
     * The global `SchedulingApiService`.
     */
    get schedulingApi() {
        // To avoid circular dependencies we use lazy initialization
        if (!this._schedulingApi)
            this._schedulingApi = this.injector.get(SchedulingApiService);
        return this._schedulingApi;
    }
    /**
     * The global `AffectedShiftsApiService`.
     */
    get affectedShiftsApi() {
        // To avoid circular dependencies we use lazy initialization
        if (!this._affectedShiftsApi)
            this._affectedShiftsApi = this.injector.get(AffectedShiftsApiService);
        return this._affectedShiftsApi;
    }
    /**
     * The global `PDatePipe`.
     */
    get datePipe() {
        // To avoid circular dependencies we use lazy initialization
        if (!this._datePipe)
            this._datePipe = this.injector.get(PDatePipe);
        return this._datePipe;
    }
    /**
     * The global `PercentPipe`.
     */
    get percentPipe() {
        // To avoid circular dependencies we use lazy initialization
        if (!this._percentPipe)
            this._percentPipe = this.injector.get(PercentPipe);
        return this._percentPipe;
    }
    /**
     * The global `PFingerprintService`.
     */
    get fingerprintService() {
        // To avoid circular dependencies we use lazy initialization
        if (!this._fingerprintService)
            this._fingerprintService = this.injector.get(PFingerprintService);
        return this._fingerprintService;
    }
    /**
     * Enables/Disables mock-mode.
     * @param mockMode Set "true" to enable mock-mode. In mock-mode all backend calls will silently be ignored.
     * Furthermore, when activated it ensures that some empty data are set
     * (and optionally default values when "tsDefaultValue" is used in api-generator).
     */
    enableMockMode(mockMode) {
        this.mockMode = mockMode;
        if (this.mockMode && !this.isLoaded())
            this.setEmptyData();
    }
    /**
     * Returns the search params of the last load() call.
     */
    getLastLoadSearchParams() {
        return this.lastExecutedLoadSearchParams;
    }
    /**
     * Removes item with key `paramToRemove` from `lastExecutedLoadSearchParams`.
     */
    removeParamFromLastExecutedLoadSearchParams(paramToRemove) {
        if (this.lastExecutedLoadSearchParams)
            this.lastExecutedLoadSearchParams = this.lastExecutedLoadSearchParams.delete(paramToRemove);
    }
    /**
     * Is a backend api operation (load, save, post) running now?
     */
    get isBackendOperationRunning() {
        return this.runningLoadOperationCount > 0 ||
            this.runningSaveOperationCount > 0 ||
            this.runningPostOperationCount > 0;
    }
    /**
     * Is a backend load operation running now?
     */
    get isLoadOperationRunning() {
        return this.runningLoadOperationCount > 0;
    }
    getUrl(searchParams) {
        let result = this.apiUrl;
        // add search params
        result += '?';
        if (searchParams) {
            for (const key of Array.from(searchParams.keys())) {
                const paramValue = searchParams.get(key);
                result += `${key}=${paramValue}&`;
            }
        }
        // to easier be able to link network calls to tests we add test name as query parameter
        if (window.currentSpecName)
            result += `testName=${ApiBase.getTestNameQueryParam()}&`;
        // add api version
        result += `v=${this.version()}`;
        return result;
    }
    static getTestNameQueryParam() {
        // somehow the url is cut off when there is a '#'. So, we remove them.
        return encodeURI(window.currentSpecName.replace('#', ''));
    }
    /**
     * @returns Returns merged result of "params1" and "params2". Both these parameters can
     * be "null".
     */
    mergeHttpParams(params1, params2) {
        // start with values of params1
        let result = params1 !== null && params1 !== void 0 ? params1 : new HttpParams();
        // add values of params2
        if (params2) {
            for (const key of params2.keys()) {
                const paramValue = params2.get(key);
                result = result.set(key, paramValue);
            }
        }
        return result;
    }
    /**
     * Downloads a file assuming to be delivered by the GET method of this api.
     * @param fileName File-name which will be used to save the delivered file.
     * @param searchParams Additional search-params passed to the called GET method.
     */
    downloadFile(fileName, fileEnding, searchParams, httpMethod = 'GET', success) {
        // make fileName safe to use as file-name
        fileName = fileName.toLowerCase();
        fileName = fileName.replace('ä', 'ae');
        fileName = fileName.replace('ö', 'oe');
        fileName = fileName.replace('ü', 'ue');
        fileName = fileName.replace('ß', 'ss');
        fileName = fileName.replace(/[^\da-z]/gi, '_');
        // We cannot trigger browsers download process by calling ajax function. So, instead we get the file content
        // and download it manually by creating a "blob" object.
        // Code is copied from https://stackoverflow.com/a/23797348/3545274 with some modifications.
        const xhr = new XMLHttpRequest();
        xhr.open(httpMethod, this.getUrl(searchParams), true);
        xhr.responseType = 'arraybuffer';
        if (Config.HTTP_AUTH_CODE)
            xhr.setRequestHeader('Authorization', Config.HTTP_AUTH_CODE);
        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                // make company name safe to use as file-name
                const type = xhr.getResponseHeader('Content-Type');
                // download file (copied from https://github.com/mholt/PapaParse/issues/175)
                const blob = new Blob([xhr.response], { type: type });
                const microsoftWindowNavigator = window.navigator;
                if (microsoftWindowNavigator.msSaveOrOpenBlob && microsoftWindowNavigator.msSaveBlob) { // IE hack; see http://msdn.microsoft.com/en-us/library/ie/hh779016.aspx
                    microsoftWindowNavigator.msSaveBlob(blob, fileName);
                }
                else {
                    const a = window.document.createElement('a');
                    a.href = window.URL.createObjectURL(blob);
                    a.download = `${fileName}.${fileEnding}`;
                    document.body.appendChild(a);
                    // IE: "Access is denied"; see:
                    // https://connect.microsoft.com/IE/feedback/details/797361/ie-10-treats-blob-url-as-cross-origin-and-denies-access
                    a.click();
                    document.body.removeChild(a);
                }
                if (success) {
                    success();
                }
            }
            else {
                const httpErrorResponse = new HttpErrorResponse({
                    status: xhr.status,
                    statusText: xhr.statusText,
                    url: xhr.responseURL,
                });
                this.onError(null, httpErrorResponse);
            }
        });
        xhr.setRequestHeader('Content-type', (httpMethod !== 'GET' ? 'application/json;charset=utf-8' :
            'application/x-www-form-urlencoded'));
        xhr.send(httpMethod !== 'GET' ? JSON.stringify(this.dataStack.getCurrent()) : undefined);
    }
    /**
     * Set empty api data. This is for example useful when the api does not support "load()" operation
     * and so we need other means to fill the api with data.
     */
    setEmptyData() {
        this.dataStack.clear();
        // recreate data
        this.recreateRootWrapper();
        this.dataStack.onLoadResponse(this.getRootWrapper().rawData);
    }
    /**
     * @returns Does this api currently has a data copy()?
     */
    hasDataCopy() {
        return this.dataStack.hasCopy();
    }
    /**
     * Creates a working copy of the data. All data wrappers will now point on this new copy.
     * Note that this working copy will be ignored for backend operations. To save changes
     * done to this working copy to backend you must first merge these changes (by calling mergeDataCopy())
     * and then call save().
     */
    createDataCopy() {
        this.dataStack.createCopy();
    }
    /**
     * Dismisses any changes done to the working copy.
     */
    dismissDataCopy() {
        this.dataStack.dismissCopy();
    }
    /**
     * Merges any changes done to the working copy with the current data.
     */
    mergeDataCopy() {
        this.dataStack.mergeCopy();
    }
    /**
     * @returns Has the data copy changed compared to original data?
     */
    hasDataCopyChanged() {
        return this.dataStack.hasCopyChanged();
    }
    /**
     * @returns Does the api have unsaved changes?
     */
    hasChanges() {
        return this.dataStack.hasTopChanged();
    }
    /**
     * Loads the api with the previous search params.
     */
    reload({ success = null, error = null } = {}) {
        return this.load({ success: success, error: error, searchParams: this.getLastLoadSearchParams() });
    }
    /**
     * Loads api data from backend. This method loads a piece of data depending on the search params.
     * These piece of data can be modified then by calling the save() method.
     * Note that this load() method will discard all unsaved api data changes.
     * This include changes done before and during the load operation. This is needed
     * because a load operation can get data which has no relationship with the old data (because of new search params).
     * Thus, before the load operation is executed all old data will be unloaded to prevent user
     * from accessing/modifying the data during the operation.
     * @param success Success handler.
     * @param error Error handler.
     * @param paramData Parameters to be passed to the api.
     */
    load({ success = null, error = null, searchParams = new HttpParams() } = {}) {
        if (this.mockMode) {
            const result = new HttpResponse();
            if (success)
                success(result);
            return Promise.resolve(result);
        }
        if (this.isLoadOperationRunning && Config.APPLICATION_MODE !== 'TEST')
            this.console.warn(`There are overlapping load() calls for api »${this.apiPath}«. Is this intended?`);
        ++this.lastLoadOperationId;
        ++this.runningLoadOperationCount;
        this.lastExecutedLoadSearchParams = searchParams;
        // reset currentlyDetailedLoaded. When new data arrives it will be updated.
        this.currentlyDetailedLoaded = null;
        // execute
        const loadOperationId = this.lastLoadOperationId;
        this.dataStack.onLoadOperation();
        this.zone.runOutsideAngular(() => {
            this.onDataLoadStart.next();
        });
        return firstValueFrom(this.http.get(this.apiUrl, this.getRequestOptions(this.lastExecutedLoadSearchParams)))
            .then((response) => {
            const isLastLoadOperation = (loadOperationId === this.lastLoadOperationId);
            // When there are overlapping load operations only consider the results of the last load operation.
            // All previous loads will silently be ignored.
            if (isLastLoadOperation) {
                const isLoadedBefore = this.isLoaded();
                const newData = response.body;
                this.dataStack.onLoadResponse(newData);
                this.zone.runOutsideAngular(() => {
                    this.onDataLoaded.next();
                });
                if (success)
                    success(response);
                // isLoaded promise fulfilled now?
                if (!isLoadedBefore) {
                    this.isLoadedSubject.next();
                    // all registered handlers should only be called once. So, reset the subject.
                    // This will also prevent memory leaks
                    this.isLoadedSubject = new Subject();
                }
            }
            --this.runningLoadOperationCount;
            return response;
        })
            // eslint-disable-next-line unicorn/catch-error-name
            .catch((errorResponse) => {
            --this.runningLoadOperationCount;
            this.onError(error, errorResponse);
            return errorResponse;
        });
    }
    /**
     * Saves the api data to backend. Any changes done during this save operation are not lost
     * but will be merged to the backend response. To enable this we must ensure that
     * the returned data is the same "piece" of data as we were saving. Thus, no search params
     * are allowed for this operation but the search params of last load() operation will be adopted.
     *
     * @returns Returns "false" when no save was done because no changes were found. Otherwise "true" is returned.
     */
    save({ success = null, error = null, additionalSearchParams = null, saveEmptyData = false, sendRootMetaOnEmptyData = false, onlySavePath = null, } = {}) {
        if (this.mockMode) {
            const result = new HttpResponse();
            if (success)
                success(result, true);
            return Promise.resolve(result);
        }
        // we need data to do any saving
        if (!this.isLoaded())
            throw new Error('You cannot call save() when api is not loaded.');
        // get data to save
        let dataToSave = this.dataStack.getDataToSave(onlySavePath);
        // cancel saving?
        if (dataToSave === NOT_CHANGED && !saveEmptyData) {
            // When there is nothing to save is still success
            if (success)
                success.call(this, null, true);
            return Promise.resolve(new HttpResponse());
        }
        // forced send of root meta?
        if (dataToSave === NOT_CHANGED && sendRootMetaOnEmptyData) {
            dataToSave = [this.dataStack.getCurrent()[0]];
        }
        //
        // 	Async save
        //
        ++this.lastSaveOperationId;
        ++this.runningSaveOperationCount;
        const executedForLoadOperationId = this.lastLoadOperationId;
        const saveOperationId = this.lastSaveOperationId;
        this.dataStack.onSaveOperation(dataToSave);
        const searchParams = this.mergeHttpParams(this.lastExecutedLoadSearchParams, additionalSearchParams);
        return firstValueFrom(this.http.put(this.apiUrl, dataToSave, this.getRequestOptions(searchParams)))
            .then((response) => {
            --this.runningSaveOperationCount;
            const newData = response.body;
            const isForLastLoadOperation = (executedForLoadOperationId === this.lastLoadOperationId);
            const isForLastSaveResponse = (saveOperationId === this.lastSaveOperationId);
            const isForLastApiCall = isForLastLoadOperation && isForLastSaveResponse;
            this.dataStack.onSaveResponse(newData, isForLastApiCall);
            // callback...
            if (success)
                success(response, false);
            return response;
        })
            // eslint-disable-next-line unicorn/catch-error-name
            .catch((errorResponse) => {
            --this.runningSaveOperationCount;
            this.onError(error, errorResponse);
            return errorResponse;
        });
    }
    /**
     * Executes a post operation. This operation is completely independent of the load/save operations.
     * It does not expect a response from backend. So, it will also not override the data depending on
     * any backend response.
     */
    post({ success = null, error = null, searchParams = null, } = {}) {
        if (this.mockMode) {
            const result = new HttpResponse();
            if (success)
                success(result);
            return Promise.resolve(result);
        }
        // we need data to do any saving
        if (!this.isLoaded())
            throw new Error('You cannot call post() when api is not loaded.');
        // get data to save
        const dataToSave = this.dataStack.getCurrent();
        //
        // 	Async post
        //
        ++this.runningPostOperationCount;
        return firstValueFrom(this.http.post(this.getUrl(searchParams), dataToSave, this.getRequestOptions(this.lastExecutedLoadSearchParams)))
            .then((response) => {
            --this.runningPostOperationCount;
            // callback...
            if (success)
                success(response);
            return response;
        })
            // eslint-disable-next-line unicorn/catch-error-name
            .catch((errorResponse) => {
            --this.runningPostOperationCount;
            this.onError(error, errorResponse);
            return errorResponse;
        });
    }
    /**
     * Handler being called on api error response.
     */
    onError(handler, response) {
        // we are not interested in errors which are not concerned api
        if (!errorUtils.isTypeHttpErrorResponse(response))
            throw response;
        this.dataStack.onBackendError();
        this.apiError.error.next(response);
        if (handler)
            handler(response);
        if (response.status === 401) {
            // handled by me.service
        }
        else if (response.status === 434 || // outdated api
            response.status === 0 || // backend not reachable
            !handler) { // unknown error and no custom handler defined
            // forward to global error handler
            throw response;
        }
    }
    /**
     * @param success Handler being called when api is successfully loaded.
     * @returns {Boolean} any api data is loaded
     */
    isLoaded(success) {
        const isLoaded = this.dataStack.isDataLoaded();
        if (success) {
            if (isLoaded)
                success();
            else
                // TODO: We recreate isLoadedSubject to ensure that subscribers are only called once and to avoid memory leaks.
                // Think there should be a better solution for that ;)
                // eslint-disable-next-line rxjs/no-ignored-subscription
                this.isLoadedSubject.subscribe(success);
        }
        return isLoaded;
    }
    /**
     * @param searchParams The desired query-parameters.
     * @returns The api request-options to be used for an api call. This adds generic information live api-version and
     * authentication data.
     */
    getRequestOptions(searchParams) {
        return ApiBase.getRequestOptions(searchParams, this.version());
    }
    /**
     * @returns Returns the request-options to be passed to Angular´s `HttpClient`.
     */
    static getRequestOptions(searchParams, apiVersion) {
        // headers
        let headers = new HttpHeaders({
            // eslint-disable-next-line @typescript-eslint/naming-convention
            'Content-Type': 'application/json; charset=utf-8',
        });
        if (Config.HTTP_AUTH_CODE)
            headers = headers.set('Authorization', Config.HTTP_AUTH_CODE);
        // search params
        if (!searchParams)
            searchParams = new HttpParams();
        if (apiVersion)
            searchParams = searchParams.set('v', apiVersion);
        // to easier be able to link network calls to tests we add test name as query parameter
        if (window.currentSpecName)
            searchParams = searchParams.set('testName', ApiBase.getTestNameQueryParam());
        // return result
        return {
            headers: headers,
            params: searchParams,
            observe: 'response',
        };
    }
    /**
     * Unload all currently loaded api data.
     */
    unload() {
        this.dataStack.clear();
        this.lastExecutedLoadSearchParams = null;
        this.currentlyDetailedLoaded = null;
    }
}
//# sourceMappingURL=api-base.js.map