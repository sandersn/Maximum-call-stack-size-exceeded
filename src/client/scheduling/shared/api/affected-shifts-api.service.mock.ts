

import { HttpResponse } from '@angular/common/http';
import { AffectedShiftsApiShifts, AffectedShiftsApiShift } from '@plano/client/shared/api/affected-shifts-api.service';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { AffectedShiftsApiService } from '@plano/shared/api';
import { PSupportedLocaleIds } from '@plano/shared/api/base/generated-types.ag';
import { Id } from '@plano/shared/api/base/id';
import { ApiLoadArgs, ApiSaveArgs } from '@plano/shared/api/base/types';
import { RandomValueUtils } from '@plano/shared/core/random-value-utils';

const randomValueUtils = new RandomValueUtils();

class FakeAffectedShiftsApiShift extends AffectedShiftsApiShift {
	public override loadDetailed({success = null, error = null, searchParams = null} : ApiLoadArgs = {}) : Promise<HttpResponse<unknown>> {
		error;searchParams;
		if (success) success(new HttpResponse<unknown>());
		return new Promise(() => new HttpResponse());
	}
}

class FakeAffectedShiftsApiShifts extends AffectedShiftsApiShifts {
	public override createNewItem(id ?: Id) : FakeAffectedShiftsApiShift {
		return super.createNewItem(id);
	}
}
class FakeAffectedShiftsApiRoot {
	public shifts ! : FakeAffectedShiftsApiShifts;
	public api ! : AffectedShiftsApiService;

	constructor(api : AffectedShiftsApiService) {
		this.api = api;
		this.initValues();
	}

	/**
	 * Set values that are necessary for this function.
	 * These initValues methods are used in many components.
	 * They mostly get used for class attributes that would cause performance issues as a getter.
	 */
	private initValues() : void {
		this.initShifts();
	}

	private initShifts() : void {
		this.shifts = new FakeAffectedShiftsApiShifts(this.api, false);

		const randomNr = randomValueUtils.getRandomNumber(10, 60);
		for (let i = 0; i < randomNr; i++) {
			this.initShift();
		}
	}

	private initShift() : void {
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

export class FakeAffectedShiftsApiService { // extends AffectedShiftsApiService
	public consts = {
		// SHIFT_ASSIGNABLE_MEMBERS: [],
	};

	constructor( /* http : HttpClient, router : Router, apiError : ApiErrorService, zone : NgZone */ ) {
		// super(http, router, apiError, zone);
		this.data = new FakeAffectedShiftsApiRoot(this as unknown as AffectedShiftsApiService);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public changed(_change : string) : void {

	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */ // eslint-disable-next-line @typescript-eslint/no-explicit-any
	public onchange() : Promise<any> {
		return new Promise(() => {});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public isLoaded() : boolean {
		return true;
	}

	private _hasDataCopy ?: boolean = false;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public hasDataCopy() : boolean | undefined {
		return this._hasDataCopy;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public createDataCopy() : void {
		this._hasDataCopy = true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public dismissDataCopy() : void {
		this._hasDataCopy = false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public mergeDataCopy() : void {
		this._hasDataCopy = false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public save({
		success = null,
	} : ApiSaveArgs = {}) : void {
		if (success) success(new HttpResponse({ status: 200, statusText: 'FooBar' }), false);
		this._hasDataCopy = false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public hasDataCopyChanged() : boolean {
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public load({ success = null } : ApiLoadArgs = {}) : void {
		if (success) success(new HttpResponse());
	}

	public data ! : FakeAffectedShiftsApiRoot;
}
