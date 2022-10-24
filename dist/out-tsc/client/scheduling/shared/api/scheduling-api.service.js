/* NOTE: Dont make this file even bigger. Invest some time to cleanup/split into several files */
/* eslint max-lines: ["error", 2800] */
import { SchedulingApiHolidayBase, SchedulingApiRightGroupsBase } from '@plano/shared/api';
import { SchedulingApiHolidaysBase } from '@plano/shared/api';
import { SchedulingApiTodaysShiftDescriptionsBase } from '@plano/shared/api';
import { SchedulingApiTodaysShiftDescriptionBase } from '@plano/shared/api';
import { SchedulingApiAccountingPeriodsBase } from '@plano/shared/api';
import { SchedulingApiShiftBase } from '@plano/shared/api';
import { SchedulingApiShiftsBase } from '@plano/shared/api';
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
export class SchedulingApiRoot extends SchedulingApiRootBase {
}
export class SchedulingApiHoliday extends SchedulingApiHolidayBase {
}
export class SchedulingApiHolidays extends SchedulingApiHolidaysBase {
}
export class SchedulingApiAbsence extends SchedulingApiAbsenceBase {
}
export class SchedulingApiAbsences extends SchedulingApiAbsencesBase {
}
export class SchedulingApiMembers extends SchedulingApiMembersBase {
}
export class SchedulingApiShift extends SchedulingApiShiftBase {
}
export class SchedulingApiShifts extends SchedulingApiShiftsBase {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems);
    }
}
export class SchedulingApiShiftModel extends SchedulingApiShiftModelBase {
}
export class SchedulingApiAssignmentProcess extends SchedulingApiAssignmentProcessBase {
}
export class SchedulingApiAssignmentProcesses extends SchedulingApiAssignmentProcessesBase {
}
export class SchedulingApiRightGroups extends SchedulingApiRightGroupsBase {
}
export class SchedulingApiMember extends SchedulingApiMemberBase {
}
export class SchedulingApiAccountingPeriodExpectedMemberData extends SchedulingApiAccountingPeriodExpectedMemberDataBase {
}
export class SchedulingApiAccountingPeriod extends SchedulingApiAccountingPeriodBase {
}
export class SchedulingApiAccountingPeriods extends SchedulingApiAccountingPeriodsBase {
}
export class SchedulingApiRightGroup extends SchedulingApiRightGroupBase {
}
export class SchedulingApiRightGroupShiftModelRights extends SchedulingApiRightGroupShiftModelRightsBase {
}
export class SchedulingApiAssignableShiftModel extends SchedulingApiMemberAssignableShiftModelBase {
}
export class SchedulingApiShiftModelAssignableMember extends SchedulingApiShiftModelAssignableMemberBase {
}
export class SchedulingApiShiftModelAssignableMembers extends SchedulingApiShiftModelAssignableMembersBase {
}
export class SchedulingApiShiftAssignableMembers extends SchedulingApiShiftAssignableMembersBase {
}
export class SchedulingApiShiftModels extends SchedulingApiShiftModelsBase {
}
export class SchedulingApiAssignableShiftModels extends SchedulingApiMemberAssignableShiftModelsBase {
}
export class SchedulingApiMemos extends SchedulingApiMemosBase {
}
export class SchedulingApiTodaysShiftDescriptions extends SchedulingApiTodaysShiftDescriptionsBase {
}
export class SchedulingApiTodaysShiftDescription extends SchedulingApiTodaysShiftDescriptionBase {
}
//# sourceMappingURL=scheduling-api.service.js.map