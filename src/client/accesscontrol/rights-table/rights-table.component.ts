import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SchedulingApiRightGroupRole } from '@plano/shared/api';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PFaIcon } from '../../../shared/core/component/fa-icon/fa-icon-types';
import { PDictionarySourceString } from '../../../shared/core/pipe/localize.dictionary';
import { PPermissionService } from '../permission.service';
import { RightEnums } from '../permission.service';
import { RIGHTS_ARRAY } from '../rights-array';
import { RightRow, RightsArrayType, RightValueArray } from '../rights-array';
import { DayCommentsRights, AssignmentProcessesRights, MembersRights, ShiftsAndShiftModelsRights, BookingSystemRights } from '../rights-enums';
import { AdminRightValueObject, MemberRightValueObject, RightState} from '../rights-enums';

export type RightsTableColspan = 0 | 1 | 2;

interface RightsTableTdObject {
	value : RightState;
	colspan : RightsTableColspan;
	tooltipText ?: string | null;
}

type RowEntriesType = [
	{
		role : SchedulingApiRightGroupRole.CLIENT_OWNER;
		rightKeys : (keyof AdminRightValueObject)[];
	},
	{
		role : SchedulingApiRightGroupRole.CLIENT_DEFAULT;
		rightKeys : (keyof MemberRightValueObject)[];
	},
];

@Component({
	selector: 'p-rights-table',
	templateUrl: './rights-table.component.html',
	styleUrls: ['./rights-table.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightsTableComponent {
	public rightsArray : RightsArrayType = RIGHTS_ARRAY;
	public memberRole : SchedulingApiRightGroupRole.CLIENT_DEFAULT = SchedulingApiRightGroupRole.CLIENT_DEFAULT;
	public adminRole : SchedulingApiRightGroupRole.CLIENT_OWNER = SchedulingApiRightGroupRole.CLIENT_OWNER;

	constructor(
		public pPermissionService : PPermissionService,
	) {
	}

	public PlanoFaIconPool = PlanoFaIconPool;

	private getRightsTableTdObject(
		area : RightsArrayType[number]['area'],
		right : RightRow<RightEnums>,
		role : Parameters<PPermissionService['getValue']>[2],
		key : Parameters<PPermissionService['getValue']>[3],
	) : RightsTableTdObject {
		const value = this.pPermissionService.getValue(
			area,
			right.title,
			role,
			key,
		);
		return {
			value: value,
			colspan: this.getColspan(right.title, role, key),
			tooltipText: this.getTooltipText(right.title, role, key) ?? null,
		};
	}

	public rowEntries : RowEntriesType = [
		{ role : SchedulingApiRightGroupRole.CLIENT_OWNER, rightKeys: [
			'allowedIf_canRead', 'allowedIf_canWrite', 'allowedIf_canGetManagerNotifications', 'allowedIf_canOnlineRefund', 'allowedIf_isAssignable',
		] },
		{ role : SchedulingApiRightGroupRole.CLIENT_DEFAULT, rightKeys: [
			'allowedIf_canRead', 'allowedIf_canWriteBookings', 'allowedIf_canWrite', 'allowedIf_canGetManagerNotifications', 'allowedIf_canOnlineRefund', 'allowedIf_isAssignable',
		] },
	];

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getRowOfValues(rightsArrayItem : RightsArrayType[number], right : RightRow<RightEnums>) : RightsTableTdObject[] {
		const result : RightsTableTdObject[] = [];
		for (const rowEntry of this.rowEntries) {
			for (const rightKey of rowEntry.rightKeys) {
				result.push(this.getRightsTableTdObject(rightsArrayItem.area, right, rowEntry.role, rightKey));
			}
		}
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getAdminData(rightValueArray : RightValueArray) : AdminRightValueObject[] {
		return Object.values(rightValueArray[SchedulingApiRightGroupRole.CLIENT_OWNER]);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getMemberData(rightValueArray : RightValueArray) : MemberRightValueObject[] {
		return Object.values(rightValueArray[SchedulingApiRightGroupRole.CLIENT_DEFAULT]);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getColspan(
		rightEnum : RightEnums,
		role : SchedulingApiRightGroupRole,
		key : string,
	) : RightsTableColspan {
		switch (rightEnum) {
			case MembersRights.exportUsers :
			case DayCommentsRights.editDayComments :
			case DayCommentsRights.createDayComments :
			case AssignmentProcessesRights.publishSchedules :
			case AssignmentProcessesRights.orderWishes :
			case AssignmentProcessesRights.createAssignmentProcesses :
			case ShiftsAndShiftModelsRights.exportShiftExchangeStatistics :
			case BookingSystemRights.exportBookings :
				if (role === SchedulingApiRightGroupRole.CLIENT_DEFAULT) {
					if (key === 'allowedIf_canWrite') return 2;
					if (key === 'allowedIf_canGetManagerNotifications') return 0;
				}
				break;
			default :
		}
		return 1;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getTooltipText(
		rightEnum : RightEnums,
		role : SchedulingApiRightGroupRole,
		key : string,
	) : string | undefined {
		const tooltipText : string = 'Gilt nur, wenn die Person Schreibrecht hat und zugleich die Nachrichten für Bereichsleitende bekommt.';
		switch (rightEnum) {
			case MembersRights.exportUsers :
			case DayCommentsRights.editDayComments :
			case DayCommentsRights.createDayComments :
			case AssignmentProcessesRights.publishSchedules :
			case AssignmentProcessesRights.orderWishes :
			case AssignmentProcessesRights.createAssignmentProcesses :
			case ShiftsAndShiftModelsRights.exportShiftExchangeStatistics :
			case BookingSystemRights.exportBookings :
				if (role === SchedulingApiRightGroupRole.CLIENT_DEFAULT) {
					if (key === 'allowedIf_canWrite') return tooltipText;
					if (key === 'allowedIf_canGetManagerNotifications') return tooltipText;
				}
				return undefined;
			default :
				return undefined;
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getIconForRightKey(input : keyof AdminRightValueObject | keyof MemberRightValueObject) : PFaIcon {
		switch (input) {
			case 'allowedIf_canRead':
				return ['far', 'eye'];
			case 'allowedIf_canWrite':
				return PlanoFaIconPool.EDIT;
			case 'allowedIf_canGetManagerNotifications':
				return PlanoFaIconPool.EMAIL_NOTIFICATION;
			case 'allowedIf_canOnlineRefund':
				return PlanoFaIconPool.BOOKING_PAYMENT_STATUS;
			case 'allowedIf_isAssignable':
				return PlanoFaIconPool.CHECKBOX_SELECTED;
			case 'allowedIf_canWriteBookings':
				return PlanoFaIconPool.ITEMS_SALES;
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getLabelForRightKey(input : keyof AdminRightValueObject | keyof MemberRightValueObject) : PDictionarySourceString | null {
		switch (input) {
			case 'allowedIf_isAssignable':
				return 'Darf';
			case 'allowedIf_canRead':
			case 'allowedIf_canWrite':
			case 'allowedIf_canGetManagerNotifications':
			case 'allowedIf_canOnlineRefund':
			case 'allowedIf_canWriteBookings':
				return null;
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getDescriptionForRightKey(input : keyof AdminRightValueObject | keyof MemberRightValueObject) : PDictionarySourceString {
		switch (input) {
			case 'allowedIf_canRead':
				return 'Die Gruppe hat Leserecht für Tätigkeiten.';
			case 'allowedIf_canWrite':
				return 'Die Gruppe hat Schreibrecht für Tätigkeiten.';
			case 'allowedIf_canGetManagerNotifications':
				// eslint-disable-next-line literal-blacklist/literal-blacklist
				return 'Die Gruppe bekommt von Dr. Plano die Nachrichten für Bereichsleitende.';
			case 'allowedIf_canWriteBookings':
				return 'Die Gruppe darf Buchungen eines Angebots verwalten.';
			case 'allowedIf_canOnlineRefund':
				return 'Die Gruppe darf Online-Rückerstattungen an Kunden veranlassen.';
			case 'allowedIf_isAssignable':
				return 'Die Gruppe darf Tätigkeiten ausführen. Das wird in den Tätigkeiten festgelegt.';
		}
	}

	public readonly COLSPAN_OF_FIRST_COL = 4;

	/**
	 * Turn a human readable title into a valid html id
	 */
	public titleToId(rightsArrayItem : RightsArrayType[number]) : string {
		const withDashes = rightsArrayItem.area.toLowerCase()
			.replace(/ /g, '-')
			.replace(/ä/g, 'ae')
			.replace(/ü/g, 'ue')
			.replace(/ö/g, 'oe')
			.replace(/&/g, '-');
		return encodeURIComponent(`${withDashes}`);
	}
}
