import { SchedulingApiShiftModel } from './scheduling-api.service';
import { DateTime } from '../../../../shared/api/base/generated-types.ag';
import { Id } from '../../../../shared/api/base/id';

export interface IShiftId {
	seriesId : number,
}

export interface ISchedulingApiMember {
	firstName : string,
	lastName : string,
	id : Id,
	trashed : boolean,
}

export interface ISchedulingApiShiftModel {
	name : string,
	isCourse : boolean,
}

export interface ISchedulingApiShift {
	id : IShiftId,
	name ?: string,
	start : DateTime,
	end : DateTime,
	model : SchedulingApiShiftModel,
}
