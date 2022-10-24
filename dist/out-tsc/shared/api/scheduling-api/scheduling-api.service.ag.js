import { ApiBase } from '@plano/shared/api/base/api-base';
import { Id } from '@plano/shared/api/base/id';
import { Meta } from '@plano/shared/api/base/meta';
import { ApiAttributeInfo } from '@plano/shared/api/base/api-attribute-info';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { ApiListWrapper, ApiObjectWrapper } from '@plano/shared/api';
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
export class SchedulingApiServiceBase extends ApiBase {
    constructor(h, router, apiE, zone, injector) {
        super(h, router, apiE, zone, injector, 'scheduling');
        this.dataWrapper = new SchedulingApiRoot(this);
    }
    version() {
        return 'a8081ceb2838c688a9f28c5564fee2b2,4c90e29b32587ae0860f1b2603fa2af6';
    }
    get data() {
        return this.dataWrapper;
    }
    getRootWrapper() {
        return this.dataWrapper;
    }
    recreateRootWrapper() {
        this.dataWrapper = new SchedulingApiRoot(this);
    }
}
export class SchedulingApiRootBase extends ApiObjectWrapper {
    constructor() {
        super(...arguments);
        this.shiftsWrapper = new SchedulingApiShifts(this.api, false);
        this.absencesWrapper = new SchedulingApiAbsences(this.api, false);
        this.assignmentProcessesWrapper = new SchedulingApiAssignmentProcesses(this.api, false);
        this.membersWrapper = new SchedulingApiMembers(this.api, false);
        this.shiftModelsWrapper = new SchedulingApiShiftModels(this.api, false);
        this.notificationsConfWrapper = new SchedulingApiNotificationsConf(this.api);
        this.rightGroupsWrapper = new SchedulingApiRightGroups(this.api, false);
        this.accountingPeriodsWrapper = new SchedulingApiAccountingPeriods(this.api, false);
        this.memosWrapper = new SchedulingApiMemos(this.api, false);
        this.todaysShiftDescriptionsWrapper = new SchedulingApiTodaysShiftDescriptions(this.api, false);
        this.holidaysWrapper = new SchedulingApiHolidays(this.api, false);
        //private possibleTaxesWrapper: SchedulingApiPossibleTaxes<ValidationMode> = new SchedulingApiPossibleTaxes<ValidationMode>(this.api, false);
        this.schedulePreferencesWrapper = new SchedulingApiSchedulePreferences(this.api);
    }
}
export class SchedulingApiShiftsBase extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'shifts');
        this.api = api;
    }
    wrapItem(item, _generateMissingData) {
        const newWrapper = new SchedulingApiShift(this.api);
        return newWrapper;
    }
}
export class SchedulingApiShiftBase extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiShift);
        this.api = api;
        this.assignableMembersWrapper = new SchedulingApiShiftAssignableMembers(this.api, false);
        this.assignedMemberIdsWrapper = new SchedulingApiShiftAssignedMemberIds(this.api, false);
        this.shiftModelIdWrapper = null;
        this.memberPrefsWrapper = new SchedulingApiShiftMemberPrefs(this.api, false);
        this.packetShiftsWrapper = new SchedulingApiShiftPacketShifts(this.api, false);
        this.neededMembersCountConfWrapper = new SchedulingApiShiftNeededMembersCountConf(this.api);
        this.repetitionWrapper = new SchedulingApiShiftRepetition(this.api);
    }
}
export class SchedulingApiShiftAssignableMembersBase extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'assignableMembers');
        this.api = api;
    }
    wrapItem(item, _generateMissingData) {
        const newWrapper = new SchedulingApiShiftAssignableMember(this.api);
        return newWrapper;
    }
}
export class SchedulingApiShiftAssignableMember extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiShiftAssignableMember);
        this.api = api;
    }
}
export class SchedulingApiShiftAssignedMemberIds extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'assignedMemberIds');
        this.api = api;
    }
    wrapItem(item, _generateMissingData) {
        return Id.create(item);
    }
}
export class SchedulingApiShiftMemberPrefs extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'memberPrefs');
        this.api = api;
    }
}
export class SchedulingApiShiftPacketShifts extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'packetShifts');
        this.api = api;
    }
    wrapItem(item, _generateMissingData) {
        const newWrapper = new SchedulingApiShiftPacketShift(this.api);
        return newWrapper;
    }
}
export class SchedulingApiShiftPacketShift extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiShiftPacketShift);
        this.api = api;
        this.assignedMemberIdsWrapper = new SchedulingApiShiftPacketShiftAssignedMemberIds(this.api, false);
    }
}
export class SchedulingApiShiftPacketShiftAssignedMemberIds extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'assignedMemberIds');
        this.api = api;
    }
}
export class SchedulingApiShiftNeededMembersCountConf extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiShiftNeededMembersCountConf);
        this.api = api;
    }
}
export class SchedulingApiShiftRepetition extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiShiftRepetition);
        this.api = api;
        this.packetRepetitionWrapper = new SchedulingApiShiftRepetitionPacket(this.api);
    }
}
export class SchedulingApiShiftRepetitionPacket extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiShiftRepetitionPacket);
        this.api = api;
        // set parent attribute
    }
}
export class SchedulingApiWorkingTimesBase extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'workingTimes');
        this.api = api;
    }
}
export class SchedulingApiWorkingTimeTime extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiWorkingTimeTime);
        this.api = api;
    }
}
export class SchedulingApiShiftExchangesBase extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'shiftExchanges');
        this.api = api;
    }
}
export class SchedulingApiAbsencesBase extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'absences');
        this.api = api;
    }
    wrapItem(item, _generateMissingData) {
        const newWrapper = new SchedulingApiAbsence(this.api);
        return newWrapper;
    }
}
export class SchedulingApiAbsenceBase extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiAbsence);
        this.api = api;
    }
}
//imp		 
export class SchedulingApiAbsenceTime extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiAbsenceTime);
        this.api = api;
        this._id = null;
        this.attributeInfoThis = new ApiAttributeInfo({
            apiObjWrapper: this,
            name: 'time',
            id: 'ABSENCE_TIME',
        });
        this.attributeInfoStart = new ApiAttributeInfo({
            apiObjWrapper: this,
            name: 'start',
            id: 'ABSENCE_TIME_START',
            primitiveType: PApiPrimitiveTypes.DateTime,
            validations: function () {
                return [
                    () => {
                        return this.api.validators.max(() => this.end, false, PApiPrimitiveTypes.DateTime, 'ABSENCE_TIME_END', undefined);
                        return null;
                    },
                ];
            },
        });
        this.attributeInfoEnd = new ApiAttributeInfo({
            apiObjWrapper: this,
            name: 'end',
            id: 'ABSENCE_TIME_END',
            primitiveType: PApiPrimitiveTypes.DateTime,
            validations: function () {
                return [
                    () => {
                        return this.api.validators.min(() => this.start, false, PApiPrimitiveTypes.DateTime, 'ABSENCE_TIME_START', undefined);
                        return null;
                    },
                ];
            },
        });
        this._updateRawData(Meta.createNewObject(true, idRaw), true);
    }
    get id() {
        return this._id !== null ? this._id : Id.create(Meta.getNewItemId(this.rawData));
    }
}
export class SchedulingApiAssignmentProcessesBase extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'assignmentProcesses');
        this.api = api;
    }
    wrapItem(item, _generateMissingData) {
        const newWrapper = new SchedulingApiAssignmentProcess(this.api);
        return newWrapper;
    }
}
export class SchedulingApiAssignmentProcessBase extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiAssignmentProcess);
        this.api = api;
    }
}
export class SchedulingApiMembersBase extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'members');
        this.api = api;
    }
    wrapItem(item, _generateMissingData) {
        const newWrapper = new SchedulingApiMember(this.api);
        return newWrapper;
    }
}
export class SchedulingApiMemberBase extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiMember);
        this.api = api;
        this.assignableShiftModelsWrapper = new SchedulingApiAssignableShiftModels(this.api, false);
        this.changeSelectorWrapper = new SchedulingApiMemberChangeSelector(this.api);
    }
}
export class SchedulingApiMemberAssignableShiftModelsBase extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'assignableShiftModels');
        this.api = api;
    }
    wrapItem(item, _generateMissingData) {
        const newWrapper = new SchedulingApiAssignableShiftModel(this.api);
        return newWrapper;
    }
}
export class SchedulingApiMemberAssignableShiftModelBase extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiAssignableShiftModel);
        this.api = api;
    }
}
export class SchedulingApiMemberChangeSelector extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiMemberChangeSelector);
        this.api = api;
    }
}
export class SchedulingApiShiftModelsBase extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'shiftModels');
        this.api = api;
    }
    wrapItem(item, _generateMissingData) {
        const newWrapper = new SchedulingApiShiftModel(this.api);
        return newWrapper;
    }
}
export class SchedulingApiShiftModelBase extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiShiftModel);
        this.api = api;
        this.assignableMembersWrapper = new SchedulingApiShiftModelAssignableMembers(this.api, false);
        this.repetitionWrapper = new SchedulingApiShiftModelRepetition(this.api);
        this.timeWrapper = new SchedulingApiShiftModelTime(this.api);
        this.posAccountsWrapper = new SchedulingApiShiftModelPosAccounts(this.api, false);
        this.changeSelectorWrapper = new SchedulingApiShiftModelChangeSelector(this.api);
        this.automaticBookableMailIdsWrapper = new SchedulingApiShiftModelAutomaticBookableMailIds(this.api, false);
        this.currentCancellationPolicyIdWrapper = null;
        this.cancellationPoliciesWrapper = new SchedulingApiShiftModelCancellationPolicies(this.api, false);
        this.neededMembersCountConfWrapper = new SchedulingApiShiftModelNeededMembersCountConf(this.api);
        this.courseHighlightsWrapper = new SchedulingApiShiftModelCourseHighlights(this.api, false);
    }
}
export class SchedulingApiShiftModelAssignableMembersBase extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'assignableMembers');
        this.api = api;
    }
    wrapItem(item, _generateMissingData) {
        const newWrapper = new SchedulingApiShiftModelAssignableMember(this.api);
        return newWrapper;
    }
}
export class SchedulingApiShiftModelAssignableMemberBase extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiShiftModelAssignableMember);
        this.api = api;
        this.memberIdWrapper = null;
    }
}
export class SchedulingApiShiftModelRepetition extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiShiftModelRepetition);
        this.api = api;
        this.packetRepetitionWrapper = new SchedulingApiShiftModelRepetitionPacket(this.api);
    }
}
export class SchedulingApiShiftModelRepetitionPacket extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiShiftModelRepetitionPacket);
        this.api = api;
    }
}
export class SchedulingApiShiftModelTime extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiShiftModelTime);
        this.api = api;
    }
}
export class SchedulingApiShiftModelPosAccounts extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'posAccounts');
        this.api = api;
    }
    wrapItem(item, _generateMissingData) {
        const newWrapper = new SchedulingApiShiftModelPosAccount(this.api);
        return newWrapper;
    }
}
export class SchedulingApiShiftModelPosAccount extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiShiftModelPosAccount);
        this.api = api;
    }
}
export class SchedulingApiShiftModelChangeSelector extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiShiftModelChangeSelector);
        this.api = api;
    }
}
export class SchedulingApiShiftModelAutomaticBookableMailIds extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'automaticBookableMailIds');
        this.api = api;
    }
}
export class SchedulingApiShiftModelCancellationPolicies extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'cancellationPolicies');
        this.api = api;
    }
    wrapItem(item, _generateMissingData) {
        const newWrapper = new SchedulingApiShiftModelCancellationPolicy(this.api);
        return newWrapper;
    }
}
export class SchedulingApiShiftModelCancellationPolicy extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiShiftModelCancellationPolicy);
        this.api = api;
    }
}
export class SchedulingApiShiftModelNeededMembersCountConf extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiShiftModelNeededMembersCountConf);
        this.api = api;
    }
}
export class SchedulingApiShiftModelCourseHighlights extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'courseHighlights');
        this.api = api;
    }
    wrapItem(item, _generateMissingData) {
        const newWrapper = new SchedulingApiShiftModelCourseHighlight(this.api);
        return newWrapper;
    }
}
export class SchedulingApiShiftModelCourseHighlight extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiShiftModelCourseHighlight);
        this.api = api;
    }
}
export class SchedulingApiNotificationsConf extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiNotificationsConf);
        this.api = api;
    }
}
export class SchedulingApiRightGroupsBase extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'rightGroups');
        this.api = api;
    }
    wrapItem(item, _generateMissingData) {
        const newWrapper = new SchedulingApiRightGroup(this.api);
        return newWrapper;
    }
}
export class SchedulingApiRightGroupBase extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiRightGroup);
        this.api = api;
    }
}
export class SchedulingApiAccountingPeriodsBase extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'accountingPeriods');
        this.api = api;
    }
    wrapItem(item, _generateMissingData) {
        const newWrapper = new SchedulingApiAccountingPeriod(this.api);
        return newWrapper;
    }
}
export class SchedulingApiAccountingPeriodBase extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiAccountingPeriod);
        this.api = api;
        this.expectedMemberDataWrapper = new SchedulingApiAccountingPeriodExpectedMemberData(this.api, false);
    }
}
export class SchedulingApiAccountingPeriodExpectedMemberDataBase extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'expectedMemberData');
        this.api = api;
    }
    wrapItem(item, _generateMissingData) {
        const newWrapper = new SchedulingApiAccountingPeriodExpectedMemberDataItem(this.api);
        return newWrapper;
    }
}
export class SchedulingApiAccountingPeriodExpectedMemberDataItem extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiAccountingPeriodExpectedMemberDataItem);
        this.api = api;
    }
}
export class SchedulingApiMemosBase extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'memos');
        this.api = api;
    }
    wrapItem(item, _generateMissingData) {
        const newWrapper = new SchedulingApiMemo(this.api);
        newWrapper._updateRawData(item, _generateMissingData);
        return newWrapper;
    }
    createNewItem(id = null) {
        const newItemRaw = Meta.createNewObject(false, !!id ? id.rawData : null);
        const newItem = this.wrapItem(newItemRaw, true);
        this.push(newItem);
        if (this.api)
            this.api.changed('memos');
        return newItem;
    }
}
export class SchedulingApiMemo extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiMemo);
        this.api = api;
        this.attributeInfoThis = new ApiAttributeInfo({
            apiObjWrapper: this,
            name: 'memo',
            id: 'MEMO',
        });
        this.attributeInfoMessage = new ApiAttributeInfo({
            apiObjWrapper: this,
            name: 'message',
            id: 'MEMO_MESSAGE',
            primitiveType: PApiPrimitiveTypes.string,
        });
        this.attributeInfoStart = new ApiAttributeInfo({
            apiObjWrapper: this,
            name: 'start',
            id: 'MEMO_START',
            primitiveType: PApiPrimitiveTypes.Date,
            validations: function () {
                return [
                    () => {
                        return this.api.validators.max(() => this.end, true, PApiPrimitiveTypes.Date, 'MEMO_END', undefined);
                        return null;
                    },
                ];
            },
        });
    }
}
export class SchedulingApiTodaysShiftDescriptionsBase extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'todaysShiftDescriptions');
        this.api = api;
    }
    wrapItem(item, _generateMissingData) {
        const newWrapper = new SchedulingApiTodaysShiftDescription(this.api);
        return newWrapper;
    }
}
export class SchedulingApiTodaysShiftDescriptionBase extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiTodaysShiftDescription);
        this.api = api;
        this.assignedMemberIdsWrapper = new SchedulingApiTodaysShiftDescriptionAssignedMemberIds(this.api, false);
    }
}
export class SchedulingApiTodaysShiftDescriptionAssignedMemberIds extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'assignedMemberIds');
        this.api = api;
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
        return new SchedulingApiTodaysShiftDescriptionAssignedMemberIds(this.api, removeDestroyedItems);
    }
    get dni() {
        return '390';
    }
    createNewItem() {
        const newItemRaw = null;
        const newItem = this.wrapItem(newItemRaw, true);
        return newItem;
    }
}
export class SchedulingApiHolidaysBase extends ApiListWrapper {
    constructor(api, removeDestroyedItems) {
        super(api, removeDestroyedItems, 'holidays');
        this.api = api;
    }
    wrapItem(item, _generateMissingData) {
        const newWrapper = new SchedulingApiHoliday(this.api);
        return newWrapper;
    }
}
export class SchedulingApiHolidayBase extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiHoliday);
        this.api = api;
        this.timeWrapper = new SchedulingApiHolidayTime(this.api);
    }
}
export class SchedulingApiHolidayTime extends ApiObjectWrapper {
    constructor(api, idRaw = null) {
        super(api, SchedulingApiHolidayTime);
        this.api = api;
    }
}
// export class SchedulingApiPossibleTaxes<ValidationMode extends 'draft' | 'validated' = 'validated'> extends ApiListWrapper<any>
// {
// 	constructor( readonly api : SchedulingApiServiceBase<ValidationMode> | null, removeDestroyedItems : boolean) {
// 		super(api, removeDestroyedItems, 'possibleTaxes');
// 	}
// }
export class SchedulingApiSchedulePreferences extends ApiObjectWrapper {
    constructor(api) {
        super(api, SchedulingApiSchedulePreferences);
        this.api = api;
        this.prioritiesWrapper = new SchedulingApiSchedulePreferencesPriorities(this.api);
    }
}
export class SchedulingApiSchedulePreferencesPriorities extends ApiObjectWrapper {
    constructor(api) {
        super(api, SchedulingApiSchedulePreferencesPriorities);
        this.api = api;
    }
}
//# sourceMappingURL=scheduling-api.service.ag.js.map