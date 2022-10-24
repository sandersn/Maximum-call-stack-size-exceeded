import { NgZone, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ApiBase, NullableInDraftMode } from '@plano/shared/api/base/api-base';
import { Id } from '@plano/shared/api/base/id';
import { Meta } from '@plano/shared/api/base/meta';
import { ApiAttributeInfo } from '@plano/shared/api/base/api-attribute-info';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { ApiListWrapper, ApiObjectWrapper } from '@plano/shared/api';
import { DateTime, Date } from '@plano/shared/api/base/generated-types.ag';
import { ApiErrorService } from '@plano/shared/api/api-error.service';
import { SchedulingApiRoot } from '@plano/shared/api';
import { SchedulingApiShifts } from '@plano/shared/api'; //maybe imp
import { SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiShiftAssignableMembers } from '@plano/shared/api';
import { SchedulingApiAbsences } from '@plano/shared/api';
import { SchedulingApiAbsence } from '@plano/shared/api';
import { SchedulingApiAssignmentProcesses } from '@plano/shared/api';
import { SchedulingApiAssignmentProcess } from '@plano/shared/api';
import { SchedulingApiMembers } from '@plano/shared/api';
import { SchedulingApiMember } from '@plano/shared/api';
import { SchedulingApiAssignableShiftModels } from '@plano/shared/api';
import { SchedulingApiAssignableShiftModel } from '@plano/shared/api';
import { SchedulingApiShiftModels } from '@plano/shared/api';
import { SchedulingApiShiftModel } from '@plano/shared/api';
import { SchedulingApiShiftModelAssignableMembers } from '@plano/shared/api';
import { SchedulingApiShiftModelAssignableMember } from '@plano/shared/api';
import { SchedulingApiRightGroups } from '@plano/shared/api';
import { SchedulingApiRightGroup } from '@plano/shared/api';
import { SchedulingApiAccountingPeriods } from '@plano/shared/api';
import { SchedulingApiAccountingPeriod } from '@plano/shared/api';
import { SchedulingApiAccountingPeriodExpectedMemberData } from '@plano/shared/api';
import { SchedulingApiMemos } from '@plano/shared/api';
import { SchedulingApiTodaysShiftDescriptions } from '@plano/shared/api';
import { SchedulingApiTodaysShiftDescription } from '@plano/shared/api';
import { SchedulingApiHolidays } from '@plano/shared/api';
import { SchedulingApiHoliday } from '@plano/shared/api';
import {  ISchedulingApiShift } from '../../../client/scheduling/shared/api/scheduling-api.interfaces';
export class SchedulingApiServiceBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiBase
{
	data: SchedulingApiRoot<ValidationMode>
}
	 
export class SchedulingApiRootBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	private shiftsWrapper: SchedulingApiShifts<ValidationMode> = new SchedulingApiShifts<ValidationMode>(this.api, false);

	private absencesWrapper: SchedulingApiAbsences<ValidationMode> = new SchedulingApiAbsences<ValidationMode>(this.api, false);

	private assignmentProcessesWrapper: SchedulingApiAssignmentProcesses<ValidationMode> = new SchedulingApiAssignmentProcesses<ValidationMode>(this.api, false);

	private membersWrapper: SchedulingApiMembers<ValidationMode> = new SchedulingApiMembers<ValidationMode>(this.api, false);

	private shiftModelsWrapper: SchedulingApiShiftModels<ValidationMode> = new SchedulingApiShiftModels<ValidationMode>(this.api, false);

	private notificationsConfWrapper: SchedulingApiNotificationsConf<ValidationMode> = new SchedulingApiNotificationsConf<ValidationMode>(this.api);

	private rightGroupsWrapper: SchedulingApiRightGroups<ValidationMode> = new SchedulingApiRightGroups<ValidationMode>(this.api, false);

	private accountingPeriodsWrapper: SchedulingApiAccountingPeriods<ValidationMode> = new SchedulingApiAccountingPeriods<ValidationMode>(this.api, false);

	private memosWrapper: SchedulingApiMemos<ValidationMode> = new SchedulingApiMemos<ValidationMode>(this.api, false);

	private todaysShiftDescriptionsWrapper: SchedulingApiTodaysShiftDescriptions<ValidationMode> = new SchedulingApiTodaysShiftDescriptions<ValidationMode>(this.api, false);
}

export class SchedulingApiShiftsBase<ValidationMode extends 'draft' | 'validated' = 'validated'>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
	}

	 wrapItem(item : any, _generateMissingData : boolean) : SchedulingApiShift<ValidationMode> {
	}

}
				 
export class SchedulingApiShiftBase<ValidationMode extends 'draft' | 'validated' = 'validated'> implements ISchedulingApiShift 
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiShiftBase as any);
	}

	private assignableMembersWrapper : SchedulingApiShiftAssignableMembers<ValidationMode> = new SchedulingApiShiftAssignableMembers<ValidationMode>(this.api, false);

	private assignedMemberIdsWrapper : SchedulingApiShiftAssignedMemberIds<ValidationMode> = new SchedulingApiShiftAssignedMemberIds<ValidationMode>(this.api, false);

	private shiftModelIdWrapper : NullableInDraftMode<Id, ValidationMode> = null!;

	private memberPrefsWrapper : SchedulingApiShiftMemberPrefs<ValidationMode> = new SchedulingApiShiftMemberPrefs<ValidationMode>(this.api, false);

	private packetShiftsWrapper : SchedulingApiShiftPacketShifts<ValidationMode> = new SchedulingApiShiftPacketShifts<ValidationMode>(this.api, false);

	private neededMembersCountConfWrapper : SchedulingApiShiftNeededMembersCountConf<ValidationMode> = new SchedulingApiShiftNeededMembersCountConf<ValidationMode>(this.api);

	private repetitionWrapper : SchedulingApiShiftRepetition<ValidationMode> = new SchedulingApiShiftRepetition<ValidationMode>(this.api);

}

export class SchedulingApiShiftAssignableMembersBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems, 'assignableMembers');
	}

	 wrapItem(item : any, _generateMissingData : boolean) : SchedulingApiShiftAssignableMember<ValidationMode> {
		const newWrapper = new SchedulingApiShiftAssignableMember<ValidationMode>(this.api);
		return newWrapper;
	}

}
			 
export class SchedulingApiShiftAssignableMember<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiShiftAssignableMember as any);
	}}

export class SchedulingApiShiftAssignedMemberIds<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems, 'assignedMemberIds');
	}

	 wrapItem(item : any, _generateMissingData : boolean) : Id {
		return Id.create(item);
	}

}

export class SchedulingApiShiftMemberPrefs<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems, 'memberPrefs');
	}
}

 export class SchedulingApiShiftPacketShifts<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems, 'packetShifts');
	}

	 wrapItem(item : any, _generateMissingData : boolean) : SchedulingApiShiftPacketShift<ValidationMode> {
		const newWrapper = new SchedulingApiShiftPacketShift<ValidationMode>(this.api);
		return newWrapper;
	}
}
				 
export class SchedulingApiShiftPacketShift<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiShiftPacketShift as any);
	}
	private assignedMemberIdsWrapper : SchedulingApiShiftPacketShiftAssignedMemberIds<ValidationMode> = new SchedulingApiShiftPacketShiftAssignedMemberIds<ValidationMode>(this.api, false);

}

export class SchedulingApiShiftPacketShiftAssignedMemberIds<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems, 'assignedMemberIds');
	}
}
				 
export class SchedulingApiShiftNeededMembersCountConf<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null) {
		super(api, SchedulingApiShiftNeededMembersCountConf as any);
	}
}
		 
export class SchedulingApiShiftRepetition<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null) {
		super(api, SchedulingApiShiftRepetition as any);
	}
	private packetRepetitionWrapper : SchedulingApiShiftRepetitionPacket<ValidationMode> = new SchedulingApiShiftRepetitionPacket<ValidationMode>(this.api);

}
	 
export class SchedulingApiShiftRepetitionPacket<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null) {
		super(api, SchedulingApiShiftRepetitionPacket as any);
		// set parent attribute
	}
}

export class SchedulingApiWorkingTimesBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems, 'workingTimes');
	}

}
	 
export class SchedulingApiWorkingTimeTime<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiWorkingTimeTime as any);
	}
}

export class SchedulingApiShiftExchangesBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
{
	constructor(readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems, 'shiftExchanges');
	}
}

export class SchedulingApiAbsencesBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems, 'absences');
	}

	 wrapItem(item : any, _generateMissingData : boolean) : SchedulingApiAbsence<ValidationMode> {
		const newWrapper = new SchedulingApiAbsence<ValidationMode>(this.api);
		return newWrapper;
	}
}

				 
export class SchedulingApiAbsenceBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor(readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiAbsence as any);
	}
}

//imp		 
export class SchedulingApiAbsenceTime<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiAbsenceTime as any);

		this._updateRawData(Meta.createNewObject(true, idRaw), true);
	}

	private _id : Id | null = null;
	get id() : Id {
		return this._id !== null ? this._id : Id.create(Meta.getNewItemId(this.rawData) as any);
	}

	 attributeInfoThis : ApiAttributeInfo<SchedulingApiAbsenceTime<ValidationMode>, SchedulingApiAbsenceTime<ValidationMode>> = new ApiAttributeInfo<SchedulingApiAbsenceTime<ValidationMode>, SchedulingApiAbsenceTime<ValidationMode>>({
			apiObjWrapper: this as any as SchedulingApiAbsenceTime<ValidationMode>,
			name: 'time',
			id: 'ABSENCE_TIME',
		});
	attributeInfoStart =  new ApiAttributeInfo<SchedulingApiAbsenceTime<ValidationMode>, DateTime>({
			apiObjWrapper: this as any as SchedulingApiAbsenceTime<ValidationMode>,
			name: 'start',
			id: 'ABSENCE_TIME_START',
			primitiveType: PApiPrimitiveTypes.DateTime,
			validations: function(this : SchedulingApiAbsenceTime<ValidationMode>) {
				return [
					() => {
		return this.api!.validators.max(() => this.end, false, PApiPrimitiveTypes.DateTime, 'ABSENCE_TIME_END', undefined);
							return null;
					},
				];
			},
		});
	attributeInfoEnd =  new ApiAttributeInfo<SchedulingApiAbsenceTime<ValidationMode>, DateTime>({
			apiObjWrapper: this as any as SchedulingApiAbsenceTime<ValidationMode>,
			name: 'end',
			id: 'ABSENCE_TIME_END',
			primitiveType: PApiPrimitiveTypes.DateTime,
			validations: function(this : SchedulingApiAbsenceTime<ValidationMode>) {
				return [
					() => {
		return this.api!.validators.min(() => this.start, false, PApiPrimitiveTypes.DateTime, 'ABSENCE_TIME_START', undefined);
							return null;
					},
				];
			},
		});
}

export class SchedulingApiAssignmentProcessesBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems, 'assignmentProcesses');
	}

	wrapItem(item : any, _generateMissingData : boolean) : SchedulingApiAssignmentProcess<ValidationMode> {
		const newWrapper = new SchedulingApiAssignmentProcess<ValidationMode>(this.api);
		return newWrapper;
	}	
}

				 
export class SchedulingApiAssignmentProcessBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiAssignmentProcess as any);
	}
}

export class SchedulingApiMembersBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems, 'members');
	}

	 wrapItem(item : any, _generateMissingData : boolean) : SchedulingApiMember<ValidationMode> {
		const newWrapper = new SchedulingApiMember<ValidationMode>(this.api);
		return newWrapper;
	}

}
			 
export class SchedulingApiMemberBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiMember as any);
	}

	private assignableShiftModelsWrapper : SchedulingApiAssignableShiftModels<ValidationMode> = new SchedulingApiAssignableShiftModels<ValidationMode>(this.api, false);

	private changeSelectorWrapper : SchedulingApiMemberChangeSelector<ValidationMode> = new SchedulingApiMemberChangeSelector<ValidationMode>(this.api);

}

export class SchedulingApiMemberAssignableShiftModelsBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems, 'assignableShiftModels');
	}

	 wrapItem(item : any, _generateMissingData : boolean) : SchedulingApiAssignableShiftModel<ValidationMode> {
		const newWrapper = new SchedulingApiAssignableShiftModel<ValidationMode>(this.api);
		return newWrapper;
	}
}
				 
export class SchedulingApiMemberAssignableShiftModelBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiAssignableShiftModel as any);
	}
}
		 
export class SchedulingApiMemberChangeSelector<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
		constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiMemberChangeSelector as any);
	}
}

export class SchedulingApiShiftModelsBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems, 'shiftModels');
	}

	 wrapItem(item : any, _generateMissingData : boolean) : SchedulingApiShiftModel<ValidationMode> {
		const newWrapper = new SchedulingApiShiftModel<ValidationMode>(this.api);
		return newWrapper;
	}
}
				 
export class SchedulingApiShiftModelBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiShiftModel as any);
	}

	private assignableMembersWrapper : SchedulingApiShiftModelAssignableMembers<ValidationMode> = new SchedulingApiShiftModelAssignableMembers<ValidationMode>(this.api, false);

	private repetitionWrapper : SchedulingApiShiftModelRepetition<ValidationMode> = new SchedulingApiShiftModelRepetition<ValidationMode>(this.api);

	private timeWrapper : SchedulingApiShiftModelTime<ValidationMode> = new SchedulingApiShiftModelTime<ValidationMode>(this.api);

	private posAccountsWrapper : SchedulingApiShiftModelPosAccounts<ValidationMode> = new SchedulingApiShiftModelPosAccounts<ValidationMode>(this.api, false);

	private changeSelectorWrapper : SchedulingApiShiftModelChangeSelector<ValidationMode> = new SchedulingApiShiftModelChangeSelector<ValidationMode>(this.api);

	private automaticBookableMailIdsWrapper : SchedulingApiShiftModelAutomaticBookableMailIds<ValidationMode> = new SchedulingApiShiftModelAutomaticBookableMailIds<ValidationMode>(this.api, false);

	private currentCancellationPolicyIdWrapper : NullableInDraftMode<Id, ValidationMode> = null!;

	private cancellationPoliciesWrapper : SchedulingApiShiftModelCancellationPolicies<ValidationMode> = new SchedulingApiShiftModelCancellationPolicies<ValidationMode>(this.api, false);

	private neededMembersCountConfWrapper : SchedulingApiShiftModelNeededMembersCountConf<ValidationMode> = new SchedulingApiShiftModelNeededMembersCountConf<ValidationMode>(this.api);

	private courseHighlightsWrapper : SchedulingApiShiftModelCourseHighlights<ValidationMode> = new SchedulingApiShiftModelCourseHighlights<ValidationMode>(this.api, false);
}

export class SchedulingApiShiftModelAssignableMembersBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems, 'assignableMembers');
	}

	 wrapItem(item : any, _generateMissingData : boolean) : SchedulingApiShiftModelAssignableMember<ValidationMode> {
		const newWrapper = new SchedulingApiShiftModelAssignableMember<ValidationMode>(this.api);
		return newWrapper;
	}

}
			 
export class SchedulingApiShiftModelAssignableMemberBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiShiftModelAssignableMember as any);
	}

	private memberIdWrapper : NullableInDraftMode<Id, ValidationMode> = null!;
}
		 
export class SchedulingApiShiftModelRepetition<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiShiftModelRepetition as any);
	}
	private packetRepetitionWrapper : SchedulingApiShiftModelRepetitionPacket<ValidationMode> = new SchedulingApiShiftModelRepetitionPacket<ValidationMode>(this.api);
}
		 
export class SchedulingApiShiftModelRepetitionPacket<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiShiftModelRepetitionPacket as any);
	}
}
		 
export class SchedulingApiShiftModelTime<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiShiftModelTime as any);
	}
}

export class SchedulingApiShiftModelPosAccounts<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems, 'posAccounts');
	}

	 wrapItem(item : any, _generateMissingData : boolean) : SchedulingApiShiftModelPosAccount<ValidationMode> {
		const newWrapper = new SchedulingApiShiftModelPosAccount<ValidationMode>(this.api);
		return newWrapper;
	}
}
				 
export class SchedulingApiShiftModelPosAccount<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiShiftModelPosAccount as any);
	}
}
		 
export class SchedulingApiShiftModelChangeSelector<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiShiftModelChangeSelector as any);
	}
}

export class SchedulingApiShiftModelAutomaticBookableMailIds<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems, 'automaticBookableMailIds');
	}
}

export class SchedulingApiShiftModelCancellationPolicies<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems, 'cancellationPolicies');
	}

	 wrapItem(item : any, _generateMissingData : boolean) : SchedulingApiShiftModelCancellationPolicy<ValidationMode> {
		const newWrapper = new SchedulingApiShiftModelCancellationPolicy<ValidationMode>(this.api);
		return newWrapper;
	}
}
			 
export class SchedulingApiShiftModelCancellationPolicy<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiShiftModelCancellationPolicy as any);
	}
}
		 
export class SchedulingApiShiftModelNeededMembersCountConf<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiShiftModelNeededMembersCountConf as any);

	}
}

export class SchedulingApiShiftModelCourseHighlights<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems, 'courseHighlights');
	}

	 wrapItem(item : any, _generateMissingData : boolean) : SchedulingApiShiftModelCourseHighlight<ValidationMode> {
		const newWrapper = new SchedulingApiShiftModelCourseHighlight<ValidationMode>(this.api);
		return newWrapper;
	}
}
				 
export class SchedulingApiShiftModelCourseHighlight<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiShiftModelCourseHighlight as any);
	}
}
		 
export class SchedulingApiNotificationsConf<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiNotificationsConf as any);
	}
}

 export class SchedulingApiRightGroupsBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems, 'rightGroups');
	}

	 wrapItem(item : any, _generateMissingData : boolean) : SchedulingApiRightGroup<ValidationMode> {
		const newWrapper = new SchedulingApiRightGroup<ValidationMode>(this.api);
		return newWrapper;
	}
}
				 
export class SchedulingApiRightGroupBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiRightGroup as any);
	}
}

export class SchedulingApiAccountingPeriodsBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems, 'accountingPeriods');
	}

	 wrapItem(item : any, _generateMissingData : boolean) : SchedulingApiAccountingPeriod<ValidationMode> {
		const newWrapper = new SchedulingApiAccountingPeriod<ValidationMode>(this.api);
		return newWrapper;
	}

}
				 
export class SchedulingApiAccountingPeriodBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiAccountingPeriod as any);
	}
	private expectedMemberDataWrapper : SchedulingApiAccountingPeriodExpectedMemberData<ValidationMode> = new SchedulingApiAccountingPeriodExpectedMemberData<ValidationMode>(this.api, false);
}

export class SchedulingApiAccountingPeriodExpectedMemberDataBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems, 'expectedMemberData');
	}

	 wrapItem(item : any, _generateMissingData : boolean) : SchedulingApiAccountingPeriodExpectedMemberDataItem<ValidationMode> {
		const newWrapper = new SchedulingApiAccountingPeriodExpectedMemberDataItem<ValidationMode>(this.api);
		return newWrapper;
	}
}
				 
export class SchedulingApiAccountingPeriodExpectedMemberDataItem<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiAccountingPeriodExpectedMemberDataItem as any);
	}
}

export class SchedulingApiMemosBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems, 'memos');
	}

	 wrapItem(item : any, _generateMissingData : boolean) : SchedulingApiMemo<ValidationMode> {
		const newWrapper = new SchedulingApiMemo<ValidationMode>(this.api);
		newWrapper._updateRawData(item, _generateMissingData);
		return newWrapper;
	}

	 createNewItem(id : Id | null = null) : SchedulingApiMemo<ValidationMode> {
		const newItemRaw = Meta.createNewObject(false, !!id ? id.rawData : null);

		const newItem = this.wrapItem(newItemRaw, true);
		this.push(newItem);

		if(this.api)
			this.api.changed('memos');

		return newItem;
	}

}
				 
export class SchedulingApiMemo<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiMemo as any);
	}

	 attributeInfoThis : ApiAttributeInfo<SchedulingApiMemo<ValidationMode>, SchedulingApiMemo<ValidationMode>> = new ApiAttributeInfo<SchedulingApiMemo<ValidationMode>, SchedulingApiMemo<ValidationMode>>({
			apiObjWrapper: this as any as SchedulingApiMemo<ValidationMode>,
			name: 'memo',
			id: 'MEMO',
		});
	attributeInfoMessage =  new ApiAttributeInfo<SchedulingApiMemo<ValidationMode>, string>({
			apiObjWrapper: this as any as SchedulingApiMemo<ValidationMode>,
			name: 'message',
			id: 'MEMO_MESSAGE',
			primitiveType: PApiPrimitiveTypes.string,
		});
	attributeInfoStart =  new ApiAttributeInfo<SchedulingApiMemo<ValidationMode>, Date>({
			apiObjWrapper: this as any as SchedulingApiMemo<ValidationMode>,
			name: 'start',
			id: 'MEMO_START',
			primitiveType: PApiPrimitiveTypes.Date,
			validations: function(this : SchedulingApiMemo<ValidationMode>) {
				return [
					() => {
		return this.api!.validators.max(() => this.end, true, PApiPrimitiveTypes.Date, 'MEMO_END', undefined);
							return null;
					},
				];
			},
		});
}

export class SchedulingApiTodaysShiftDescriptionsBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
		super(api, removeDestroyedItems, 'todaysShiftDescriptions');
	}

	 wrapItem(item : any, _generateMissingData : boolean) : SchedulingApiTodaysShiftDescription<ValidationMode> {
		const newWrapper = new SchedulingApiTodaysShiftDescription<ValidationMode>(this.api);
		return newWrapper;
	}

}

				 
export class SchedulingApiTodaysShiftDescriptionBase<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiObjectWrapper<any, any>
{
	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, idRaw : any = null) {
		super(api, SchedulingApiTodaysShiftDescription as any);
	}
	// external link to next class, which is part of the problem
	private assignedMemberIdsWrapper : SchedulingApiTodaysShiftDescriptionAssignedMemberIds<ValidationMode>

}

class SchedulingApiTodaysShiftDescriptionAssignedMemberIds<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
{
	madeUpName: SchedulingApiServiceBase<ValidationMode>;

}
/**
 * SchedulingApiTodaysShiftDescriptionBase
 * ->
 * SchedulingApiTodaysShiftDescriptionAssignedMemberIds
 * ->
 * SchedulingApiServiceBase 
 * ->
 * SchedulingApiRoot
 * ->
 * SchedulingApiRootBase, 
 * ->
 *   SchedulingApiShifts<ValidationMode>
 */