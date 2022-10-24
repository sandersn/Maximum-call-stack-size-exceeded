var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { WarningsService } from '@plano/client/shared/warnings.service';
import { TimeStampApiShiftBase } from '@plano/shared/api';
import { TimeStampApiShiftsBase } from '@plano/shared/api';
import { TimeStampApiShiftModelBase } from '@plano/shared/api';
import { TimeStampApiShiftModelsBase } from '@plano/shared/api';
import { TimeStampApiStampedMemberBase } from '@plano/shared/api';
import { TimeStampApiRootBase } from '@plano/shared/api';
import { TimeStampApiServiceBase } from '@plano/shared/api';
import { TimeStampApiAllowedTimeStampDeviceBase } from '@plano/shared/api';
import { TimeStampApiAllowedTimeStampDevicesBase } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { Data } from '@plano/shared/core/data/data';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '@plano/shared/core/null-type-utils';
import { PCookieService } from '@plano/shared/core/p-cookie.service';
import { ApiErrorService } from '../../shared/api/api-error.service';
import { PlanoFaIconPool } from '../../shared/core/plano-fa-icon-pool.enum';
let TimeStampApiService = class TimeStampApiService extends TimeStampApiServiceBase {
    constructor(http, router, apiError, warnings, pCookieService, zone, injector) {
        super(http, router, apiError, zone, injector);
        this.http = http;
        this.router = router;
        this.apiError = apiError;
        this.warnings = warnings;
        this.pCookieService = pCookieService;
        this.zone = zone;
    }
    /**
     * Returns true if member started shift, and is not pausing.
     * if you just want to check if shift is started, use !!api.data.start
     */
    get isWorking() {
        return !this.isPausing &&
            !!this.data.start &&
            !this.isDone;
    }
    /**
     * Returns true if member started a pause and has not finished it yet
     */
    get isPausing() {
        return !!this.data.uncompletedRegularPauseStart;
    }
    /**
     * Shift has an end-time
     */
    get isDone() {
        return !!this.data.end;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    startPause() {
        const now = +(new PMomentService(Config.LOCALE_ID).m());
        this.data.uncompletedRegularPauseStart = now;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    completePause(duration) {
        const pauseDuration = duration !== undefined ? duration : this.data.regularPauseDuration;
        this.data.completedRegularPausesDuration = pauseDuration;
        this.data.uncompletedRegularPauseStart = null;
    }
    /**
     * Is time-stamp for this member running?
     */
    timeStampIsRunning() {
        return !!this.data.start &&
            !this.isDone;
    }
    /**
     * @see WarningsService['getWarningMessages']
     */
    get warningMessages() {
        return this.warnings.getWarningMessages(this.data);
    }
    /**
     * Is there any warning message?
     */
    get hasWarningMessages() {
        return this.data.warnUnplannedWork ||
            this.data.warnStampedNotCurrentTime ||
            this.data.warnStampedNotShiftTime;
    }
    /**
     * Start time-stamp for given shift or shiftmodel and set given timestamp as start.
     */
    startTimeStamp(timestamp, item) {
        if (item instanceof TimeStampApiShift) {
            this.data.selectedShiftId = item.id;
        }
        else {
            this.data.selectedShiftModelId = item.id;
        }
        // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
        this.data.start = timestamp ? timestamp : 0;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    stopTimeStamp(timestamp) {
        // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
        this.data.end = timestamp ? timestamp : 0;
    }
};
TimeStampApiService = __decorate([
    Injectable({
        providedIn: 'root',
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof HttpClient !== "undefined" && HttpClient) === "function" ? _a : Object, typeof (_b = typeof Router !== "undefined" && Router) === "function" ? _b : Object, ApiErrorService,
        WarningsService,
        PCookieService, typeof (_c = typeof NgZone !== "undefined" && NgZone) === "function" ? _c : Object, typeof (_d = typeof Injector !== "undefined" && Injector) === "function" ? _d : Object])
], TimeStampApiService);
export { TimeStampApiService };
class SDuration {
    // Time in Milliseconds
    constructor(a, b = 0) {
        // a == startTime and b == endTime in milliseconds?
        let startTime = a;
        let endTime = b;
        if (endTime < startTime) {
            const temp = startTime;
            startTime = endTime;
            endTime = temp;
        }
        const END = +(new PMomentService(Config.LOCALE_ID).m(endTime));
        const START = +(new PMomentService(Config.LOCALE_ID).m(startTime));
        this.duration = END - START;
    }
}
export class TimeStampApiRoot extends TimeStampApiRootBase {
    constructor(api) {
        super(api);
    }
    /**
     * There is a problem with the binding to a textarea. This must be empty string or
     * filled string but not Null.
     */
    get comment() {
        const result = super.comment;
        // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
        return result ? result : '';
    }
    set comment(newValue) {
        super.comment = newValue;
    }
    /**
     * Get selected Item no matter if its shift or shiftmodel.
     * This is a shortcut. The BaseApi only holds Id's of shift or shiftModel, and
     * not the shift or shiftmodel itself.
     */
    get selectedItem() {
        const shift = this.selectedShift;
        const shiftModel = this.selectedShiftModel;
        return shift !== null && shift !== void 0 ? shift : shiftModel;
    }
    cutMillisecondsFromDuration(duration) {
        // TODO: [PLANO-111111] Duplicate
        const pMoment = new PMomentService(undefined);
        const momentDuration = pMoment.duration(duration);
        const milliseconds = momentDuration.milliseconds();
        return momentDuration.subtract(milliseconds).asMilliseconds();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get regularPauseDuration() {
        // return sum of completed pauses and running pause
        let uncompletedPauseDuration;
        if (this.uncompletedRegularPauseStart === null) {
            uncompletedPauseDuration = new SDuration(0).duration;
        }
        else {
            assumeDefinedToGetStrictNullChecksRunning(this.uncompletedRegularPauseStart, 'uncompletedRegularPauseStart');
            const start = this.cutMillisecondsFromDuration(this.uncompletedRegularPauseStart);
            const end = this.cutMillisecondsFromDuration(+(new PMomentService(Config.LOCALE_ID).m()));
            uncompletedPauseDuration = new SDuration(start, end).duration;
        }
        return this.completedRegularPausesDuration + uncompletedPauseDuration;
    }
    /**
     * This represents the duration of the stamped time excluding pauses.
     */
    get workingTimeDuration() {
        // time stamp has not started yet?
        if (this.start === null)
            return new SDuration(0).duration;
        // working time is duration from time-stamp start to now minus pause duration
        // eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
        let currentWorkingTimeEnd = this.end ? this.end : (+(new PMomentService(Config.LOCALE_ID).m()));
        currentWorkingTimeEnd = this.cutMillisecondsFromDuration(currentWorkingTimeEnd);
        assumeDefinedToGetStrictNullChecksRunning(this.start, 'start');
        const start = this.cutMillisecondsFromDuration(this.start);
        const workingTimeDuration = new SDuration(start, currentWorkingTimeEnd).duration;
        return workingTimeDuration - this.regularPauseDuration;
    }
    /**
     * Get selected shift.
     * This is a shortcut. The BaseApi only holds Id the shift, and
     * not the shift itself.
     */
    get selectedShift() {
        const id = this.selectedShiftId;
        if (id === null)
            return null;
        return this.shifts.get(id);
    }
    /**
     * Get selected shiftModel.
     * This is a shortcut. The BaseApi only holds Id the shiftModel, and
     * not the shiftmodel itself.
     */
    get selectedShiftModel() {
        if (this.selectedShiftModelId !== null) {
            if (!this.api)
                throw new Error('Api must be defined here');
            const shiftModel = this.api.data.shiftModels.get(this.selectedShiftModelId);
            if (shiftModel) {
                return shiftModel;
            }
        }
        return null;
    }
}
export class TimeStampApiStampedMember extends TimeStampApiStampedMemberBase {
    constructor(api) {
        super(api);
    }
    cutMillisecondsFromDuration(duration) {
        // TODO: [PLANO-111111] Duplicate
        const pMoment = new PMomentService(undefined);
        const momentDuration = pMoment.duration(duration);
        const milliseconds = momentDuration.milliseconds();
        return momentDuration.subtract(milliseconds).asMilliseconds();
    }
    /**
     * Difference between now and start of stamped time.
     * This represents the duration of the stamped time including pauses.
     */
    get activityDuration() {
        const start = this.cutMillisecondsFromDuration(this.activityStart);
        const now = this.cutMillisecondsFromDuration(+(new PMomentService(Config.LOCALE_ID).m()));
        return now - start;
    }
}
export class TimeStampApiShift extends TimeStampApiShiftBase {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(api, idRaw = 0) {
        super(api, idRaw);
        this.selected = false;
    }
    /**
     * shorthand that returns the related model
     */
    get model() {
        // NOTE: This methods exists on multiple classes:
        // TimeStampApiShift
        // SchedulingApiShift
        // SchedulingApiBooking
        // SchedulingApiTodaysShiftDescription
        const SHIFT_MODEL = this.api.data.shiftModels.get(this.modelId);
        assumeNonNull(SHIFT_MODEL, 'SHIFT_MODEL');
        return SHIFT_MODEL;
    }
    /**
     * Get the name based on the linked shiftModel
     */
    get name() {
        // NOTE: This methods exists on multiple classes:
        // SchedulingApiRoot
        // TimeStampApiRoot
        return this.model.name;
    }
}
export class TimeStampApiShifts extends TimeStampApiShiftsBase {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get selected() {
        const result = new TimeStampApiShifts(this.api, false);
        for (const shift of this.iterable()) {
            if (shift.selected) {
                result.push(shift);
            }
        }
        return result;
    }
}
export class TimeStampApiShiftModel extends TimeStampApiShiftModelBase {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(api, idRaw = 0) {
        super(api, idRaw);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    fitsSearch(term) {
        if (term === null)
            return true;
        if (term === '')
            return true;
        for (const termItem of term.split(' ')) {
            const termLow = termItem.toLowerCase();
            const nameLow = this.name.toLowerCase();
            const parentNameLow = this.parentName.toLowerCase();
            if (nameLow.includes(termLow))
                continue;
            if (parentNameLow.includes(termLow))
                continue;
            return false;
        }
        return true;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    equals(shiftModel) {
        // NOTE: duplicate! This methods exists on multiple classes:
        // SchedulingApiRoot
        // TimeStampApiRoot
        return this.id.equals(shiftModel.id);
    }
}
export class TimeStampApiShiftModels extends TimeStampApiShiftModelsBase {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems);
        this._groupByParentName = new Data(this.api);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    search(input) {
        if (input === '')
            return this;
        return this.filterBy(item => item.fitsSearch(input));
    }
    /**
     * @returns Returns a list of lists where each inner list contains the shift-models with the same parent name.
     * Note: Iterating maps in ng templates seems not be supported. So, instead this list of list structure was used.
     */
    get groupByParentName() {
        /**
         * NOTE: groupByParentName() exists two times!
         * 1: in TimeStampApiShiftModels
         * 1: in SchedulingApiShiftModels
         */
        return this._groupByParentName.get(() => {
            // calculate value of groupedByParentName
            const groupedList = [];
            const getListForParentName = (parentName) => {
                let result = undefined;
                for (const list of groupedList) {
                    // Does a list already exist for this parent name?
                    const firstItem = list.get(0);
                    if (!firstItem)
                        throw new Error('Could not get first item');
                    if (parentName === firstItem.parentName) {
                        result = list;
                        break;
                    }
                }
                // Create new list if not already exist for this parent name.
                if (!result) {
                    result = new TimeStampApiShiftModels(this.api, false);
                    groupedList.push(result);
                }
                return result;
            };
            for (const shiftModel of this.iterable()) {
                const parentName = shiftModel.parentName;
                // Does a list already exist for this parent name?
                const listForThisParentName = getListForParentName(parentName);
                // Add shift model to list
                listForThisParentName.push(shiftModel);
            }
            // sort outer list
            groupedList.sort((a, b) => {
                const firstItemA = a.get(0);
                if (firstItemA === null)
                    throw new Error('Could not get first item of a');
                const firstItemB = b.get(0);
                if (firstItemB === null)
                    throw new Error('Could not get first item of b');
                return firstItemA.parentName.localeCompare(firstItemB.parentName);
            });
            return groupedList;
        });
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get trashedItemsAmount() {
        let result = 0;
        for (const shiftModel of this.iterable()) {
            if (shiftModel.trashed) {
                result += 1;
            }
        }
        return result;
    }
    /**
     * Check if there is at least one untrashed item
     */
    get hasUntrashedItem() {
        return !!this.findBy(item => !item.trashed);
    }
    /**
     * Filters a list of ShiftModels by a function that returns a boolean.
     * Returns a new list of ShiftModels.
     */
    filterBy(fn) {
        const result = new TimeStampApiShiftModels(this.api, false);
        for (const item of this.iterable()) {
            if (!fn(item))
                continue;
            result.push(item);
        }
        return result;
    }
}
export class TimeStampApiAllowedTimeStampDevice extends TimeStampApiAllowedTimeStampDeviceBase {
    constructor(api) {
        super(api);
    }
    /**
     * Get an icon name for <fa-icon>
     */
    get iconName() {
        // Return browserName if the string equals a fontawesome icon name
        switch (this.browserName) {
            case 'ie':
                return PlanoFaIconPool.BRAND_INTERNET_EXPLORER;
            case 'chrome':
            case 'safari':
            case 'firefox':
            case 'opera':
            case 'internet-explorer':
            case 'edge':
                return ['fab', this.browserName];
            case 'appAndroid':
                return PlanoFaIconPool.BRAND_ANDROID;
            case 'appIOS':
                return PlanoFaIconPool.BRAND_APPLE;
            default:
                return PlanoFaIconPool.INTERNET;
        }
    }
}
export class TimeStampApiAllowedTimeStampDevices extends TimeStampApiAllowedTimeStampDevicesBase {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems);
    }
    /**
     * @returns Returns if this device matches the given api "allowedDevice". `undefined` is returned when
     * visitor-id is not determined yet so this cannot be answered.
     */
    matchesDeviceItem(allowedDevice) {
        assumeNonNull(this.api);
        const visitorId = this.api.fingerprintService.visitorId;
        if (visitorId === undefined)
            return null;
        return visitorId === allowedDevice.visitorId;
    }
    /**
     * @returns Returns the matching allowedTimeStampDevice item from the api list. If none exists `null` is returned.
     * `undefined` is returned if visitor-id is not determined yet so this cannot be answered.
     */
    getMatchingDeviceItem() {
        assumeNonNull(this.api);
        if (this.api.fingerprintService.visitorId === undefined)
            return undefined;
        for (const allowedDevice of this.iterable()) {
            if (this.matchesDeviceItem(allowedDevice))
                return allowedDevice;
        }
        return null;
    }
    /**
     * @returns Is this device allowed to time-stamp? `undefined` is returned if this cannot be determined yet.
     */
    isDeviceAllowedToTimeStamp() {
        // all devices allowed?
        if (this.length === 0)
            return true;
        // Otherwise check if this device matches any of the allowed devices.
        const matchingDeviceItem = this.getMatchingDeviceItem();
        if (matchingDeviceItem === undefined)
            return undefined;
        return !!matchingDeviceItem;
    }
    get allowedDeviceBrowserName() {
        return Config.platform === 'browser' ? Config.browser.name :
            Config.platform;
    }
    /**
     * Allow this device to time-stamp. Note that this method itself calls `api.save()`.
     */
    allowDeviceToTimeStamp(name) {
        assumeNonNull(this.api);
        this.api.fingerprintService.getVisitorIdPromise().then(() => {
            var _a;
            assumeNonNull(this.api);
            // Remove old item if one exists
            const oldItem = this.getMatchingDeviceItem();
            if (oldItem)
                this.removeItem(oldItem);
            // create new item
            const newItem = this.createNewItem();
            newItem.name = name;
            newItem.visitorId = this.api.fingerprintService.visitorId;
            newItem.browserName = (_a = this.allowedDeviceBrowserName) !== null && _a !== void 0 ? _a : '-';
            this.api.save();
        });
    }
}
//# sourceMappingURL=time-stamp-api.service.js.map