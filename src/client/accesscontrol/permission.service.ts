import { Injectable } from '@angular/core';
import { SchedulingApiRightGroupRole } from '@plano/shared/api';
import { LogService } from '@plano/shared/core/log.service';
import { RIGHTS_ARRAY } from './rights-array';
import { RightsArrayType } from './rights-array';
import { ShiftsAndShiftModelsRights, MembersRights, BookingSystemRights, AssignmentProcessesRights, CalendarSyncRights, DayCommentsRights, TimeStampRights, ReportAndEarningsRights, AccessControlRights, AccountSettingsRights, AdminRightValueObject, MemberRightValueObject, RightState } from './rights-enums';
import { assumeNonNull } from '../../shared/core/null-type-utils';

export type RightEnums = (
	ShiftsAndShiftModelsRights |
	MembersRights |
	BookingSystemRights |
	AssignmentProcessesRights |
	CalendarSyncRights |
	DayCommentsRights |
	TimeStampRights |
	ReportAndEarningsRights |
	AccessControlRights |
	AccountSettingsRights
);

@Injectable()
export class PPermissionService {
	constructor(
		private console ?: LogService,
	) {
	}

	public getValue(
		area : RightsArrayType[number]['area'],
		rightEnum : RightEnums,
		role : SchedulingApiRightGroupRole.CLIENT_DEFAULT,
		key : keyof MemberRightValueObject,
	) : RightState;
	public getValue(
		area : RightsArrayType[number]['area'],
		rightEnum : RightEnums,
		role : SchedulingApiRightGroupRole.CLIENT_OWNER,
		key : keyof AdminRightValueObject,
	) : RightState;
	public getValue(
		area : RightsArrayType[number]['area'],
		rightEnum : RightEnums,
		role : SchedulingApiRightGroupRole,
		key : keyof MemberRightValueObject | keyof AdminRightValueObject,
	) : RightState;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getValue(
		area : RightsArrayType[number]['area'],
		rightEnum : RightEnums,
		role : SchedulingApiRightGroupRole,
		key : keyof MemberRightValueObject | keyof AdminRightValueObject,
	) : RightState {
		const items = RIGHTS_ARRAY.find(item => item.area === area)!.items;
		if (role === SchedulingApiRightGroupRole.CLIENT_DEFAULT) {
			const memberRightValueObject = this.getMemberRightValueObject(rightEnum, items);
			assumeNonNull(memberRightValueObject);
			return memberRightValueObject[key as keyof MemberRightValueObject];
		} else {
			const adminRightValueObject = this.getAdminRightValueObject(rightEnum, items);
			assumeNonNull(adminRightValueObject);
			return adminRightValueObject[key as keyof AdminRightValueObject];
		}
	}

	private getValueObject(
		name : RightEnums,
		role : SchedulingApiRightGroupRole.CLIENT_DEFAULT,
		items : RightsArrayType[number]['items'],
	) : MemberRightValueObject | null;
	private getValueObject(
		name : RightEnums,
		role : SchedulingApiRightGroupRole.CLIENT_OWNER,
		items : RightsArrayType[number]['items'],
	) : AdminRightValueObject | null;

	private getValueObject(
		name : RightEnums,
		role : SchedulingApiRightGroupRole,
		items : RightsArrayType[number]['items'],
	) : AdminRightValueObject | MemberRightValueObject | null {
		const rightRow = (items as RightsArrayType[0]['items']).find(item => item.title === name);
		if (!rightRow) return null;
		if (rightRow.title === name) {
			return rightRow.value[role];
		}
		return null;
	}

	private getAdminRightValueObject(
		name : RightEnums,
		items : RightsArrayType[number]['items'],
	) : AdminRightValueObject | null {
		return this.getValueObject(name, SchedulingApiRightGroupRole.CLIENT_OWNER, items);
	}

	private getMemberRightValueObject(
		name : RightEnums,
		items : RightsArrayType[number]['items'],
	) : MemberRightValueObject | null {
		return this.getValueObject(name, SchedulingApiRightGroupRole.CLIENT_DEFAULT, items);
	}

	/**
	 * Check if user has permission to do provided task.
	 * @param name name of the task that needs to be checked
	 * @param role role of the user who wants to perform task
	 * @param shiftModelRights rights for the task-related shiftmodel
	 * @param assignableToShiftModel info if the user is assignable to the shiftmodel.
	 * @returns boolean - Is this user allowed to perform task?
	 */
	public getPermission(
		name : RightEnums,
		role : SchedulingApiRightGroupRole,
		shiftModelRights : {
			canRead : boolean,
			canWrite : boolean,
			canWriteBookings : boolean,
			canGetManagerNotifications : boolean,
		},
		assignableToShiftModel : boolean,
	) : boolean {
		// return this.getPermissionFromAttributeInfos(…);
		return this.getPermissionFromRightsArray(name, role, shiftModelRights, assignableToShiftModel);
	}

	/**
	 * Check if user has permission to do provided task.
	 * This method gets it’s values from attributeInfo’s which come from the backend.
	 */
	private getPermissionFromAttributeInfos() : boolean | null {
		// Not implemented yet
		return null;
	}

	/**
	 * Check if user has permission to do provided task.
	 * This method gets it’s values from the rights-array.ts
	 * @deprecated use this.getPermissionFromAttributeInfos() instead
	 */
	private getPermissionFromRightsArray(
		name : RightEnums,
		role : SchedulingApiRightGroupRole,
		shiftModelRights : {
			canRead : boolean,
			canWrite : boolean,
			canWriteBookings : boolean,
			canGetManagerNotifications : boolean,
		},
		assignableToShiftModel : boolean,
	) : boolean {

		/**
		 * BUG:
		 * 				The value gets determined based on the RightEnums values. If we get the permission via
		 * 				RIGHTS_ARRAY.flatMap(…) and searching only based on RightEnums values, it can cause wrong results
		 * 				if there are two equal RightEnums values like e.g. something like »Edit item«
		 *
		 * 				Right now everything is fine. I will not fix this but because this get permission logic based on
		 * 				RIGHTS_ARRAY is deprecated. We get the permissions based on attributeInfos from backend now.
		 */
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const items = RIGHTS_ARRAY.flatMap((item) : any[] => item.items);

		switch (role) {
			case SchedulingApiRightGroupRole.CLIENT_OWNER :
				const aRightValues = this.getAdminRightValueObject(name, items);
				assumeNonNull(aRightValues);
				if (aRightValues.allowedIf_canRead) return true;
				if (aRightValues.allowedIf_canWrite) return true;
				if (this.isAssignable(aRightValues, assignableToShiftModel)) return true;
				if (this.isManager(aRightValues, shiftModelRights)) return true;
				break;
			case SchedulingApiRightGroupRole.CLIENT_DEFAULT :
				const mRightValues = this.getMemberRightValueObject(name, items);
				assumeNonNull(mRightValues);
				if (mRightValues.allowedIf_canRead && shiftModelRights.canRead) return true;
				if (mRightValues.allowedIf_canWrite && shiftModelRights.canWrite) return true;
				if (mRightValues.allowedIf_canWriteBookings && shiftModelRights.canWriteBookings) return true;
				if (this.isAssignable(mRightValues, assignableToShiftModel)) return true;
				if (this.isManager(mRightValues, shiftModelRights)) return true;
				break;
			default :
				throw new Error('Unknown role');
		}
		return false;
	}

	private isAssignable(mRightValues : AdminRightValueObject | MemberRightValueObject, assignableToShiftModel : boolean) : boolean {
		if (mRightValues.allowedIf_isAssignable && assignableToShiftModel) return true;
		return false;
	}
	private isManager(aRightValues : AdminRightValueObject | MemberRightValueObject, shiftModelRights : {
		canRead : boolean,
		canWrite : boolean,
		canWriteBookings : boolean,
		canGetManagerNotifications : boolean,
	}) : boolean {
		if (aRightValues.allowedIf_canGetManagerNotifications && shiftModelRights.canGetManagerNotifications) return true;
		return false;
	}

}
