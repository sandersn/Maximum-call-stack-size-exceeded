import { Subject } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { Config } from '@plano/shared/core/config';
import { DataInput } from '@plano/shared/core/data/data-input';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../shared/core/null-type-utils';
class UrlParam extends DataInput {
    constructor(zone, pCookieService, console, locale) {
        super(zone);
        this.zone = zone;
        this.pCookieService = pCookieService;
        this.console = console;
        this.locale = locale;
        this._calendarMode = null;
        this._date = null;
        this.detailObject = null;
        this.detailObjectId = null;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get calendarMode() {
        return this._calendarMode;
    }
    set calendarMode(value) {
        this.pCookieService.put({ name: 'calendarMode', prefix: 'schedulingApiBasedPages' }, value);
        this._calendarMode = value;
        this.changed(undefined);
    }
    set date(date) {
        const pMoment = new PMomentService(this.locale, this.console);
        const newValue = +pMoment.m(date !== null && date !== void 0 ? date : undefined).startOf('day');
        // ensure this.urlParam!.date is start of day
        this.pCookieService.put({ name: 'date', prefix: 'schedulingApiBasedPages' }, newValue, 1);
        this._date = newValue;
        this.changed(undefined);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get date() {
        return this._date;
    }
    /**
     * Read values from cookies if available
     */
    readCookies() {
        // get current calendar mode
        if (this.pCookieService.has({ name: 'calendarMode', prefix: 'schedulingApiBasedPages' })) {
            this.calendarMode = this.pCookieService.get({ name: 'calendarMode', prefix: 'schedulingApiBasedPages' });
        }
        if (this.pCookieService.has({ name: 'date', prefix: 'schedulingApiBasedPages' })) {
            const schedulingApiBasedPagesDateValue = this.pCookieService.get({ name: 'date', prefix: 'schedulingApiBasedPages' });
            assumeDefinedToGetStrictNullChecksRunning(schedulingApiBasedPagesDateValue, 'schedulingApiBasedPagesDateValue');
            this.date = +schedulingApiBasedPagesDateValue;
        }
    }
    /**
     * Set some default values for properties that are not defined yet
     */
    initValues() {
        const pMoment = new PMomentService(this.locale, this.console);
        const currentMoment = pMoment.m();
        if (this._date === null)
            this._date = +currentMoment.startOf('day');
    }
    /**
     * Takes params from this.route.snapshot.params and writes them to the related property of service.urlParam
     */
    writeUrlParamsToService(params) {
        if (!params || JSON.stringify(params) === JSON.stringify({}) && Config.APPLICATION_MODE !== 'TEST')
            throw new Error('no params available');
        if (!params['date'])
            this.console.error('no date available');
        // Ignore params when being redirected to default route
        if (params['date'] !== '0') {
            if (params['calendarMode']) {
                this.calendarMode = params['calendarMode'];
            }
            if (params['date'] && params['date'] !== this.date) {
                this.date = +params['date'];
            }
        }
        if (params['detailObject'] !== this.detailObject) {
            if (params['detailObject']) {
                this.detailObject = params['detailObject'];
            }
            else {
                this.detailObject = null;
            }
            this.changed(undefined);
        }
        this.updateDetailObjectId(params);
    }
    updateDetailObjectId(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    params) {
        if (params['detailObjectId'] === this.detailObjectId)
            return;
        if (params['detailObjectId']) {
            this.detailObjectId = Number.parseInt(params['detailObjectId'], 10);
        }
        else {
            this.detailObjectId = null;
        }
    }
    /** @see PServiceInterface['unload'] */
    unload() {
        this._calendarMode = null;
        this._date = null;
        this.detailObject = null;
        this.detailObjectId = null;
    }
}
export class AbstractSchedulingApiBasedPagesService extends DataInput {
    constructor(dataParamInput, zone, bookingsService, pCookieService, console, locale) {
        super(zone);
        this.dataParamInput = dataParamInput;
        this.zone = zone;
        this.bookingsService = bookingsService;
        this.pCookieService = pCookieService;
        this.console = console;
        this.locale = locale;
        this.queryParams = null;
        this.dataParam = null;
        /**
         * afterNavigationCallbacks can store callbacks that can be executed later when the api is loaded
         */
        this.afterNavigationCallbacks = [];
        this.urlParam = null;
        this.schedulingApiHasBeenLoadedOnSchedulingComponent = new Subject();
        this.urlParam = new UrlParam(zone, pCookieService, console, locale);
        this.dataParam = dataParamInput;
        this.urlParam.onChange.subscribe(() => {
            this.changed(undefined);
        });
    }
    /**
     * Read values from cookies if available
     */
    readCookies() {
        this.urlParam.readCookies();
    }
    /**
     * Init all necessary values for this class
     */
    initValues() {
        this.urlParam.initValues();
    }
    /**
     * Start timestamp of current calendarMode
     * Examples:
     * If calenderMode is 'week' then shiftsStart is timestamp of 'start of week'
     * If calenderMode is 'month' then shiftsStart is timestamp of 'start of first week of month'
     */
    get shiftsStart() {
        var _a, _b;
        const pMoment = new PMomentService(this.locale, this.console);
        const dateAsMoment = pMoment.m((_a = this.urlParam.date) !== null && _a !== void 0 ? _a : undefined);
        if (Config.DEBUG && Config.APPLICATION_MODE !== 'TEST' && !this.urlParam.calendarMode) {
            // eslint-disable-next-line no-console
            console.debug('calendarMode should be set here. »day« will be set as default.');
        }
        const firstDay = dateAsMoment.startOf((_b = this.urlParam.calendarMode) !== null && _b !== void 0 ? _b : 'day');
        return +firstDay;
    }
    /**
     * End timestamp of current calendarMode
     * e.g. if .calenderMode is 'month' and .date is 21.07. then shiftsEnd is timestamp of last millisecond of 31.07.
     */
    get shiftsEnd() {
        var _a, _b;
        const pMoment = new PMomentService(this.locale, this.console);
        const dateAsMoment = pMoment.m((_a = this.urlParam.date) !== null && _a !== void 0 ? _a : undefined);
        if (Config.DEBUG && Config.APPLICATION_MODE !== 'TEST' && !this.urlParam.calendarMode) {
            // eslint-disable-next-line no-console
            console.debug('calendarMode should be set here. »day« will be set as default.');
        }
        const firstDay = dateAsMoment.endOf((_b = this.urlParam.calendarMode) !== null && _b !== void 0 ? _b : 'day');
        return +firstDay;
    }
    /**
     * update queryParam values based on urlParam, bookingsService etc.
     */
    updateQueryParams(_skipBookings) {
        // eslint-disable-next-line no-console
        if (Config.DEBUG && this.urlParam.date === 0)
            console.error(`set ${this.urlParam.date} first`);
        assumeDefinedToGetStrictNullChecksRunning(this.dataParam, 'this.dataParam');
        this.queryParams = new HttpParams()
            .set('data', this.dataParam)
            .set('start', (this.shiftsStart).toString())
            .set('end', (this.shiftsEnd).toString());
        // if (!skipBookings) this.updateBookingRelatedQueryParams();
    }
    /**
     * Takes params from this.route.snapshot.params and writes them to the related property of service.urlParam
     */
    writeUrlParamsToService(params) {
        this.urlParam.writeUrlParamsToService(params);
    }
    /** @see PServiceInterface['unload'] */
    unload() {
        this.urlParam.unload();
    }
}
//# sourceMappingURL=scheduling-api-based-pages.service.js.map