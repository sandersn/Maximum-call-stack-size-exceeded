/* NOTE: Dont make this file even bigger. Invest some time to cleanup/split into several files */
/* eslint max-lines: ["error", 1603] */

// eslint-disable-next-line no-warning-comments
/* eslint-disable @typescript-eslint/naming-convention */

import { SchedulingApiRightGroupRole } from '@plano/shared/api';
import { PDictionarySourceString } from '@plano/shared/core/pipe/localize.dictionary';
import { AdminRightValueObject, MemberRightValueObject, ShiftsAndShiftModelsRights, MembersRights, BookingSystemRights, AssignmentProcessesRights, CalendarSyncRights, DayCommentsRights, TimeStampRights, ReportAndEarningsRights, AbsencesRights, AccessControlRights, AccountSettingsRights, RightState } from './rights-enums';

const admin = SchedulingApiRightGroupRole.CLIENT_OWNER;
const member = SchedulingApiRightGroupRole.CLIENT_DEFAULT;

export interface RightValueArray {
	[admin] : AdminRightValueObject,
	[member] : MemberRightValueObject,
}

const enum RightsAreasEnum {
	shiftsAndShiftModels = 'Tätigkeiten & Schichten',
	user = 'User',
	bookingSystem = 'Buchungssystem',
	assignmentProcesses = 'Schichtverteilungsvorgänge',
	calendarSync = 'Kalender-Synchronisation',
	dayComments = 'Tageskommentar',
	timeStamp = 'Stempeluhr',
	reportAndEarnings = 'Auswertung & Verdienst',
	absences = 'Abwesenheiten',
	accessControl = 'Rechteverwaltung',
	accountSettings = 'Firmen- & Account-Einstellungen',
}

export interface RightRow<T = PDictionarySourceString> {
	title : T;
	value : RightValueArray;
}

export type RightsArrayType = [
	{
		area : RightsAreasEnum.shiftsAndShiftModels,
		items : RightRow<ShiftsAndShiftModelsRights>[],
	},
	{
		area : RightsAreasEnum.user,
		items : RightRow<MembersRights>[],
	},
	{
		area : RightsAreasEnum.bookingSystem,
		items : RightRow<BookingSystemRights>[],
	},
	{
		area : RightsAreasEnum.assignmentProcesses,
		items : RightRow<AssignmentProcessesRights>[],
	},
	{
		area : RightsAreasEnum.calendarSync,
		items : RightRow<CalendarSyncRights>[],
	},
	{
		area : RightsAreasEnum.dayComments,
		items : RightRow<DayCommentsRights>[],
	},
	{
		area : RightsAreasEnum.timeStamp,
		items : RightRow<TimeStampRights>[],
	},
	{
		area : RightsAreasEnum.reportAndEarnings,
		items : RightRow<ReportAndEarningsRights>[],
	},
	{
		area : RightsAreasEnum.absences,
		items : RightRow<AbsencesRights>[],
	},
	{
		area : RightsAreasEnum.accessControl,
		items : RightRow<AccessControlRights>[],
	},
	{
		area : RightsAreasEnum.accountSettings,
		items : RightRow<AccountSettingsRights>[],
	},
];

const R = RightState;
export const RIGHTS_ARRAY : RightsArrayType = [
	{
		area: RightsAreasEnum.shiftsAndShiftModels,
		items: [
			{
				title: ShiftsAndShiftModelsRights.createShiftModel,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: ShiftsAndShiftModelsRights.editShiftModel,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: ShiftsAndShiftModelsRights.readMembersAndEarningsInShiftModel,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: ShiftsAndShiftModelsRights.writeMembersAndEarningsInShiftModel,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: ShiftsAndShiftModelsRights.readBookingSettings,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
				},
			},
			{
				title: ShiftsAndShiftModelsRights.editBookingSettings,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: ShiftsAndShiftModelsRights.createShifts,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: ShiftsAndShiftModelsRights.editShifts,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: ShiftsAndShiftModelsRights.editShiftAssignedMembers,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: ShiftsAndShiftModelsRights.giveUpShiftExchange,
				value: {
					[admin] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.ALLOWED,
					},
				},
			},
			{
				title: ShiftsAndShiftModelsRights.takeShiftExchange,
				value: {
					[admin] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.ALLOWED,
					},
				},
			},
			{
				title: ShiftsAndShiftModelsRights.notificationsForShiftExchange,
				value: {
					[admin] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.ALLOWED,
					},
				},
			},
			{
				title: ShiftsAndShiftModelsRights.notificationsForShiftExchangeOfOthers,
				value: {
					[admin] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: ShiftsAndShiftModelsRights.exportShiftExchangeStatistics,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
		],
	},
	{
		area: RightsAreasEnum.user,
		items: [
			{
				title: MembersRights.editOwnData,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canWriteBookings: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
				},
			},
			{
				title: MembersRights.readOthersData,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: MembersRights.readOthersContactData,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canWriteBookings: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
				},
			},
			{
				title: MembersRights.editOthersData,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: MembersRights.createMembers,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: MembersRights.exportUsers,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
		],
	},
	{
		area: RightsAreasEnum.bookingSystem,
		items: [
			{
				title: BookingSystemRights.bookingSystemSettings,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: BookingSystemRights.activateOnlinePayment,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: BookingSystemRights.changeOnlinePaymentData,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: BookingSystemRights.readPayments,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: BookingSystemRights.readCourseInfo,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canWriteBookings: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
				},
			},
			{
				title: BookingSystemRights.readBookings,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canWriteBookings: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
				},
			},
			{
				title: BookingSystemRights.createBookings,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: BookingSystemRights.editBookings,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: BookingSystemRights.issueOnlineRefund,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: BookingSystemRights.editCancellationFee,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: BookingSystemRights.createCustomTariffs,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: BookingSystemRights.removeBookings,
				value: {
					[admin] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: BookingSystemRights.exportBookings,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: BookingSystemRights.getNotifications,
				value: {
					[admin] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: BookingSystemRights.readVouchers,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
		],
	},
	{
		area: RightsAreasEnum.assignmentProcesses,
		items: [
			{
				title: AssignmentProcessesRights.createAssignmentProcesses,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: AssignmentProcessesRights.orderWishes,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: AssignmentProcessesRights.giveWishes,
				value: {
					[admin] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.ALLOWED,
					},
				},
			},
			{
				title: AssignmentProcessesRights.readOwnWishes,
				value: {
					[admin] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.ALLOWED,
					},
				},
			},
			{
				title: AssignmentProcessesRights.editOwnWishes,
				value: {
					[admin] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.ALLOWED,
					},
				},
			},
			{
				title: AssignmentProcessesRights.readOthersWishes,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: AssignmentProcessesRights.editOthersWishes,
				value: {
					[admin] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: AssignmentProcessesRights.wishesReminder,
				value: {
					[admin] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.ALLOWED,
					},
				},
			},
			{
				title: AssignmentProcessesRights.editEarningLimits,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: AssignmentProcessesRights.editOwnDesiredMonthlyEarnings,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canWriteBookings: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
				},
			},
			{
				title: AssignmentProcessesRights.editOthersDesiredMonthlyEarnings,
				value: {
					[admin] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: AssignmentProcessesRights.getAssignmentReport,
				value: {
					[admin] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: AssignmentProcessesRights.publishSchedules,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
		],
	},
	{
		area: RightsAreasEnum.calendarSync,
		items: [
			{
				title: CalendarSyncRights.syncOwnShifts,
				value: {
					[admin] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.ALLOWED,
					},
				},
			},
			{
				title: CalendarSyncRights.syncOthersShifts,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canWriteBookings: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
				},
			},
		],
	},
	{
		area: RightsAreasEnum.dayComments,
		items: [
			{
				title: DayCommentsRights.readDayComments,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canWriteBookings: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
				},
			},
			{
				title: DayCommentsRights.createDayComments,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: DayCommentsRights.editDayComments,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
		],
	},
	{
		area: RightsAreasEnum.timeStamp,
		items: [
			{
				title: TimeStampRights.stampOwnShift,
				value: {
					[admin] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.ALLOWED,
					},
				},
			},
			{
				title: TimeStampRights.stampUnplannedShift,
				value: {
					[admin] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.ALLOWED,
					},
				},
			},
			{
				title: TimeStampRights.reminderForOwnShifts,
				value: {
					[admin] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.ALLOWED,
					},
				},
			},
			{
				title: TimeStampRights.reminderForOthersShifts,
				value: {
					[admin] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
		],
	},
	{
		area: RightsAreasEnum.reportAndEarnings,
		items: [
			{
				title: ReportAndEarningsRights.readOwnData,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canWriteBookings: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
				},
			},
			{
				title: ReportAndEarningsRights.readOthersData,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: ReportAndEarningsRights.edit,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: ReportAndEarningsRights.create,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: ReportAndEarningsRights.exportOwnData,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canWriteBookings: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
				},
			},
			{
				title: ReportAndEarningsRights.exportOthersData,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
		],
	},
	{
		area: RightsAreasEnum.absences,
		items: [
			{
				title: AbsencesRights.readOwnData,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canWriteBookings: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
				},
			},
			{
				title: AbsencesRights.readOthersData,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canWriteBookings: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
				},
			},
			{
				title: AbsencesRights.edit,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: AbsencesRights.create,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
		],
	},
	{
		area: RightsAreasEnum.accessControl,
		items: [
			{
				title: AccessControlRights.readOwnRightGroup,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: AccessControlRights.readOthersRightGroup,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: AccessControlRights.createRightGroups,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: AccessControlRights.editRightGroups,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
		],
	},
	{
		area: RightsAreasEnum.accountSettings,
		items: [
			{
				title: AccountSettingsRights.read,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
			{
				title: AccountSettingsRights.edit,
				value: {
					[admin] : {
						allowedIf_canRead: R.ALLOWED,
						allowedIf_canWrite: R.ALLOWED,
						allowedIf_canGetManagerNotifications: R.ALLOWED,
						allowedIf_canOnlineRefund: R.ALLOWED,
						allowedIf_isAssignable: R.ALLOWED,
					},
					[member] : {
						allowedIf_canRead: R.FORBIDDEN,
						allowedIf_canWrite: R.FORBIDDEN,
						allowedIf_canGetManagerNotifications: R.FORBIDDEN,
						allowedIf_canWriteBookings: R.FORBIDDEN,
						allowedIf_canOnlineRefund: R.FORBIDDEN,
						allowedIf_isAssignable: R.FORBIDDEN,
					},
				},
			},
		],
	},
];
