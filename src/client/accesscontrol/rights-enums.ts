// eslint-disable-next-line no-warning-comments
/* eslint-disable @typescript-eslint/naming-convention */
import { Config } from '../../shared/core/config';
import { hasDictionaryEntry } from '../../shared/core/pipe/localize.dictionary';

/**
 * A Method to check if all values of a Enum are represented in our 'dictionary'.
 * Reason is that in typescript there is no possibility to set a type (like PDictionarySourceString) for all enum values.
 * This is a workaround, to ensure we don’t forget an translation entry.
 */
const checkIfDictionaryItemIsAvailable = <T>(enumThatShouldBeChecked : T) : void => {
	if (!Config.DEBUG) return;
	for (const enumKey of Object.keys(enumThatShouldBeChecked as unknown as { [s : number] : string })) {
		const KEY = enumKey as keyof T;
		if (!Number.isNaN(Number(KEY))) return;
		if (hasDictionaryEntry(enumThatShouldBeChecked[KEY] as unknown as string)) continue;
		throw new Error(`No entry for »${enumThatShouldBeChecked[KEY]}« in localize.dictionary.ts`);
	}
};

export enum RightState {
	FORBIDDEN = 0,
	ALLOWED = 1,
}

/**
 * @see PPermissionService.getPermission()
 */
export interface AdminRightValueObject {
	allowedIf_canRead : RightState,
	allowedIf_canWrite : RightState,
	allowedIf_canGetManagerNotifications : RightState,
	allowedIf_canOnlineRefund : RightState,
	allowedIf_isAssignable : RightState,
}

export interface MemberRightValueObject {
	allowedIf_canRead : RightState,
	allowedIf_canWrite : RightState,
	allowedIf_canGetManagerNotifications : RightState,
	allowedIf_canWriteBookings : RightState,
	allowedIf_canOnlineRefund : RightState,
	allowedIf_isAssignable : RightState,
}

export enum ShiftsAndShiftModelsRights {
	createShiftModel = 'Tätigkeit erstellen',
	editShiftModel = 'Tätigkeit editieren',
	readMembersAndEarningsInShiftModel = 'Mitarbeitende und Lohndaten einer Tätigkeit sehen',
	writeMembersAndEarningsInShiftModel = 'Mitarbeitende und Lohndaten einer Tätigkeit editieren',
	readBookingSettings = 'Buchungseinstellungen sehen',
	editBookingSettings = 'Buchungseinstellungen editieren',
	createShifts = 'Schichten erstellen',
	editShifts = 'Schichten editieren',
	editShiftAssignedMembers = 'Schichtbesetzung ändern',
	giveUpShiftExchange = 'Eigene Schicht abgeben',
	takeShiftExchange = 'Schichten anderer übernehmen',
	notificationsForShiftExchange = 'Benachrichtigung bei eigenem Schichttausch',
	notificationsForShiftExchangeOfOthers = 'Benachrichtigung bei Schichttausch anderer',
	exportShiftExchangeStatistics = 'Statistik für Schichttausch exportieren',
}
checkIfDictionaryItemIsAvailable(ShiftsAndShiftModelsRights);

export enum MembersRights {
	editOwnData = 'Eigene Daten editieren',
	readOthersData = 'Vollständige Daten anderer sehen',
	readOthersContactData = 'Kontaktdaten anderer sehen (Name, Email, Telefon)',
	editOthersData = 'Daten anderer editieren',
	createMembers = 'Neue User-Accounts erstellen',
	exportUsers = 'User exportieren',
}
checkIfDictionaryItemIsAvailable(MembersRights);

export enum BookingSystemRights {
	bookingSystemSettings = 'Buchungssystem-Einstellungen',
	activateOnlinePayment = 'Online-Zahlung für den Account aktivieren',
	changeOnlinePaymentData = 'Grunddaten für Online-Zahlung ändern',
	readPayments = 'Übersicht aller Zahlungen sehen', // api.data.transactions.attributeInfoThis.show
	readCourseInfo = 'Buchungsstatus eines Angebots sehen',
	readBookings = 'Buchungen eines Angebots sehen',
	createBookings = 'Buchungen manuell erstellen',
	editBookings = 'Buchungen editieren',
	issueOnlineRefund = 'Online-Rückerstattung veranlassen',
	editCancellationFee = 'Stornogebühr einer Buchung ändern',
	createCustomTariffs = 'Tarife in einer Tätigkeit ändern',
	removeBookings = 'Buchungen löschen',
	exportBookings = 'Buchungen exportieren',
	getNotifications = 'Benachrichtigung über Buchungen',
	readVouchers = 'Gutscheine sehen oder editieren', // api.data.vouchers.attributeInfoThis.show
}
checkIfDictionaryItemIsAvailable(BookingSystemRights);

export enum AssignmentProcessesRights {
	createAssignmentProcesses = 'Verteilungsvorgang erstellen',
	orderWishes = 'Schichtwünsche anfordern',
	giveWishes = 'Schichtwünsche abgeben',
	readOwnWishes = 'Eigene Schichtwünsche sehen',
	editOwnWishes = 'Eigene Schichtwünsche editieren',
	readOthersWishes = 'Schichtwünsche anderer sehen',
	editOthersWishes = 'Schichtwünsche anderer editieren',
	wishesReminder = 'Erinnerung an Schichtwunschabgabe',
	editEarningLimits = 'Mindest- & Maximallöhne anderer editieren',
	editOwnDesiredMonthlyEarnings = 'Eigenen Wunschlohn editieren',
	editOthersDesiredMonthlyEarnings = 'Wunschlohn anderer editieren',
	getAssignmentReport = 'Verteilungsbericht empfangen',
	publishSchedules = 'Schichtplan veröffentlichen',
}
checkIfDictionaryItemIsAvailable(AssignmentProcessesRights);

export enum CalendarSyncRights {
	syncOwnShifts = 'Eigene Schichten synchronisieren',
	syncOthersShifts = 'Andere Schichten synchronisieren',
}
checkIfDictionaryItemIsAvailable(CalendarSyncRights);

export enum DayCommentsRights {
	readDayComments = 'Tageskommentare sehen',
	createDayComments = 'Tageskommentare erstellen',
	editDayComments = 'Tageskommentare editieren',
}
checkIfDictionaryItemIsAvailable(DayCommentsRights);

export enum TimeStampRights {
	stampOwnShift = 'Eigene Schicht stempeln',
	stampUnplannedShift = 'Ungeplanten Einsatz stempeln',
	reminderForOwnShifts = 'Stempelerinnerung für eigene Schichten',
	reminderForOthersShifts = 'Benachrichtigung über versäumtes Stempeln der Angestellten',
}
checkIfDictionaryItemIsAvailable(TimeStampRights);

export enum ReportAndEarningsRights {
	readOwnData = 'Eigene Einträge sehen',
	readOthersData = 'Einträge anderer sehen',
	edit = 'Einträge editieren',
	create = 'Neue Einträge erstellen',
	exportOwnData = 'Eigene Auswertungsdaten exportieren',
	exportOthersData = 'Auswertungsdaten anderer exportieren',
}
checkIfDictionaryItemIsAvailable(ReportAndEarningsRights);

export enum AbsencesRights {
	readOwnData = 'Eigene Abwesenheiten sehen',
	readOthersData = 'Abwesenheiten anderer sehen',
	edit = 'Abwesenheiten editieren',
	create = 'Neue Abwesenheiten erstellen',
}
checkIfDictionaryItemIsAvailable(AbsencesRights);

export enum AccessControlRights {
	readOwnRightGroup = 'Eigene Rechtegruppe sehen',
	readOthersRightGroup = 'Rechtegruppen anderer sehen',
	createRightGroups = 'Rechtegruppen erstellen',
	editRightGroups = 'Rechtegruppen editieren',
}
checkIfDictionaryItemIsAvailable(AccessControlRights);

export enum AccountSettingsRights {
	read = 'Firma/Account-Daten sehen',
	edit = 'Firma/Account-Daten editieren',
}
checkIfDictionaryItemIsAvailable(AccountSettingsRights);
