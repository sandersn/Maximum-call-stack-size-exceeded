import { HttpResponse } from '@angular/common/http';
import { AffectedShiftsApiShifts, AffectedShiftsApiShift } from '@plano/client/shared/api/affected-shifts-api.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { Id } from '@plano/shared/api/base/id';
import { RandomValueUtils } from '@plano/shared/core/random-value-utils';
const randomValueUtils = new RandomValueUtils();
class FakeAffectedShiftsApiShift extends AffectedShiftsApiShift {
    loadDetailed({ success = null, error = null, searchParams = null } = {}) {
        error;
        searchParams;
        if (success)
            success(new HttpResponse());
        return new Promise(() => new HttpResponse());
    }
}
class FakeAffectedShiftsApiShifts extends AffectedShiftsApiShifts {
    createNewItem(id) {
        return super.createNewItem(id);
    }
}
class FakeAffectedShiftsApiRoot {
    constructor(api) {
        this.api = api;
        this.initValues();
    }
    /**
     * Set values that are necessary for this function.
     * These initValues methods are used in many components.
     * They mostly get used for class attributes that would cause performance issues as a getter.
     */
    initValues() {
        this.initShifts();
    }
    initShifts() {
        this.shifts = new FakeAffectedShiftsApiShifts(this.api, false);
        const randomNr = randomValueUtils.getRandomNumber(10, 60);
        for (let i = 0; i < randomNr; i++) {
            this.initShift();
        }
    }
    initShift() {
        const randomHours = randomValueUtils.getRandomNumber(0, 23);
        const randomDays = randomValueUtils.getRandomNumber(0, 40);
        const oneDayAsMilliseconds = 1000 * 60 * 60 * 24;
        const start = new PMomentService(PSupportedLocaleIds.de_DE).m().set('seconds', 0).set('minutes', 0).set('hours', randomHours).add(randomDays, 'day');
        const shift = this.shifts.createNewItem(Id.create(randomValueUtils.getRandomNumber(1, 10000)));
        shift.neededMembersCountTestSetter = 5;
        shift.assignedMemberIds.push(Id.create(123));
        shift.assignedMemberIds.push(Id.create(124));
        shift.assignedMemberIds.push(Id.create(125));
        shift.startTestSetter = +start;
        shift.endTestSetter = shift.start + (oneDayAsMilliseconds / 24 * 4);
    }
}
export class FakeAffectedShiftsApiService {
    constructor( /* http : HttpClient, router : Router, apiError : ApiErrorService, zone : NgZone */) {
        this.consts = {
        // SHIFT_ASSIGNABLE_MEMBERS: [],
        };
        this._hasDataCopy = false;
        // super(http, router, apiError, zone);
        this.data = new FakeAffectedShiftsApiRoot(this);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    changed(_change) {
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onchange() {
        return new Promise(() => { });
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    isLoaded() {
        return true;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    hasDataCopy() {
        return this._hasDataCopy;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    createDataCopy() {
        this._hasDataCopy = true;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    dismissDataCopy() {
        this._hasDataCopy = false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    mergeDataCopy() {
        this._hasDataCopy = false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    save({ success = null, } = {}) {
        if (success)
            success(new HttpResponse({ status: 200, statusText: 'FooBar' }), false);
        this._hasDataCopy = false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    hasDataCopyChanged() {
        return true;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    load({ success = null } = {}) {
        if (success)
            success(new HttpResponse());
    }
}
//# sourceMappingURL=affected-shifts-api.service.mock.js.map