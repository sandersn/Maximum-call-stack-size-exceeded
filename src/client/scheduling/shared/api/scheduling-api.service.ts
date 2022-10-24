/* NOTE: Dont make this file even bigger. Invest some time to cleanup/split into several files */
/* eslint max-lines: ["error", 2800] */

import { PMomentService } from '@plano/client/shared/p-moment.service';
import { SchedulingApiHolidayBase, SchedulingApiRightGroupsBase} from '@plano/shared/api';
import { SchedulingApiHolidaysBase } from '@plano/shared/api';
import { SchedulingApiTodaysShiftDescriptionsBase } from '@plano/shared/api';
import { SchedulingApiTodaysShiftDescriptionBase } from '@plano/shared/api';
import { SchedulingApiAccountingPeriodsBase } from '@plano/shared/api';
import { SchedulingApiShiftBase } from '@plano/shared/api';
import { SchedulingApiShiftsBase } from '@plano/shared/api';
import { SchedulingApiServiceBase } from '@plano/shared/api';
import { SchedulingApiAbsenceBase } from '@plano/shared/api';
import { SchedulingApiAbsencesBase } from '@plano/shared/api';
import { SchedulingApiMemberBase } from '@plano/shared/api';
import { SchedulingApiMembersBase } from '@plano/shared/api';
import { SchedulingApiMemosBase } from '@plano/shared/api';
import { SchedulingApiShiftModelBase } from '@plano/shared/api';
import { SchedulingApiShiftModelsBase } from '@plano/shared/api';
import { SchedulingApiRootBase } from '@plano/shared/api';
import { SchedulingApiMemberAssignableShiftModelBase } from '@plano/shared/api';
import { SchedulingApiMemberAssignableShiftModelsBase } from '@plano/shared/api';
import { SchedulingApiShiftModelAssignableMemberBase } from '@plano/shared/api';
import { SchedulingApiShiftModelAssignableMembersBase } from '@plano/shared/api';
import { SchedulingApiShiftAssignableMembersBase } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessBase } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessesBase } from '@plano/shared/api';
import { SchedulingApiAccountingPeriodBase } from '@plano/shared/api';
import { SchedulingApiAccountingPeriodExpectedMemberDataBase } from '@plano/shared/api';
import { SchedulingApiRightGroupShiftModelRightsBase } from '@plano/shared/api';
import { SchedulingApiRightGroupBase } from '@plano/shared/api';
import { ISchedulingApiMember, ISchedulingApiShift, ISchedulingApiShiftModel } from './scheduling-api.interfaces';


export class SchedulingApiRoot<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiRootBase<ValidationMode> {
}

export class SchedulingApiHoliday<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiHolidayBase<ValidationMode> {
}

export class SchedulingApiHolidays<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiHolidaysBase<ValidationMode> {	
}

export class SchedulingApiAbsence<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiAbsenceBase<ValidationMode> {
}

export class SchedulingApiAbsences<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiAbsencesBase<ValidationMode> {
	
}

export class SchedulingApiMembers<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiMembersBase<ValidationMode> {
}

export class SchedulingApiShift<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiShiftBase<ValidationMode> {
}

export class SchedulingApiShifts<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiShiftsBase<ValidationMode> {
	constructor(
		api : SchedulingApiServiceBase | null,
		removeDestroyedItems : boolean,
	) {
		super(api, removeDestroyedItems);
	}
}

export class SchedulingApiShiftModel<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiShiftModelBase<ValidationMode> implements ISchedulingApiShiftModel {
}

export class SchedulingApiAssignmentProcess<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiAssignmentProcessBase<ValidationMode> {
}


export class SchedulingApiAssignmentProcesses<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiAssignmentProcessesBase<ValidationMode> {
}

export class SchedulingApiRightGroups<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiRightGroupsBase<ValidationMode> {
}

export class SchedulingApiMember<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiMemberBase<ValidationMode> implements ISchedulingApiMember {
}

export class SchedulingApiAccountingPeriodExpectedMemberData<ValidationMode extends 'draft' | 'validated' = 'validated'>
	extends SchedulingApiAccountingPeriodExpectedMemberDataBase<ValidationMode> {
}

export class SchedulingApiAccountingPeriod<ValidationMode extends 'draft' | 'validated' = 'validated'>
	extends SchedulingApiAccountingPeriodBase<ValidationMode> {
}

export class SchedulingApiAccountingPeriods<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiAccountingPeriodsBase<ValidationMode> {
}

export class SchedulingApiRightGroup<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiRightGroupBase<ValidationMode> {
}

export class SchedulingApiRightGroupShiftModelRights<ValidationMode extends 'draft' | 'validated' = 'validated'>
	extends SchedulingApiRightGroupShiftModelRightsBase<ValidationMode> {

}

export class SchedulingApiAssignableShiftModel<ValidationMode extends 'draft' | 'validated' = 'validated'>
		extends SchedulingApiMemberAssignableShiftModelBase<ValidationMode> {
}

export class SchedulingApiShiftModelAssignableMember<ValidationMode extends 'draft' | 'validated' = 'validated'>
		extends SchedulingApiShiftModelAssignableMemberBase<ValidationMode> {
}

export class SchedulingApiShiftModelAssignableMembers<ValidationMode extends 'draft' | 'validated' = 'validated'>
		extends SchedulingApiShiftModelAssignableMembersBase<ValidationMode> {
}

export class SchedulingApiShiftAssignableMembers<ValidationMode extends 'draft' | 'validated' = 'validated'>
		extends SchedulingApiShiftAssignableMembersBase<ValidationMode> {
}

export class SchedulingApiShiftModels<ValidationMode extends 'draft' | 'validated' = 'validated'>
		extends SchedulingApiShiftModelsBase<ValidationMode> {
}

export class SchedulingApiAssignableShiftModels<ValidationMode extends 'draft' | 'validated' = 'validated'>
		extends SchedulingApiMemberAssignableShiftModelsBase<ValidationMode> {
}

export class SchedulingApiMemos<ValidationMode extends 'draft' | 'validated' = 'validated'> extends SchedulingApiMemosBase<ValidationMode> {
}

export class SchedulingApiTodaysShiftDescriptions<ValidationMode extends 'draft' | 'validated' = 'validated'>
		extends SchedulingApiTodaysShiftDescriptionsBase<ValidationMode> {
}

export class SchedulingApiTodaysShiftDescription<ValidationMode extends 'draft' | 'validated' = 'validated'>
		extends SchedulingApiTodaysShiftDescriptionBase<ValidationMode> {
}
