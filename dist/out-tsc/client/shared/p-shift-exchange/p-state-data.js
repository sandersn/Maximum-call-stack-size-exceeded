import { SchedulingApiShiftExchangeState, SchedulingApiShiftExchangeCommunicationInfo, SchedulingApiShiftExchangeRequesterRelationship } from '../../../shared/api';
import { Config } from '../../../shared/core/config';
import { PThemeEnum } from '../bootstrap-styles.enum';
class StateUiObject {
    constructor(stateText, stateStyle, badgeIcon) {
        this.badgeIcon = null;
        this.stateText = stateText;
        this.stateStyle = stateStyle;
        this.badgeIcon = badgeIcon !== null && badgeIcon !== void 0 ? badgeIcon : null;
    }
}
export class PStateData {
    constructor(localize) {
        this.localize = localize;
        this.arrayOfDataObjectForState = [
            /** FAILED_DEADLINE_PASSED */
            {
                uiObject: new StateUiObject('Gesetzte Frist verstrichen', PThemeEnum.DANGER, 'times'),
                state: SchedulingApiShiftExchangeState.FAILED_DEADLINE_PASSED,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.IM,
            },
            {
                uiObject: new StateUiObject('Gesetzte Frist verstrichen', PThemeEnum.DANGER, 'times'),
                state: SchedulingApiShiftExchangeState.FAILED_DEADLINE_PASSED,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.CP,
            },
            {
                uiObject: new StateUiObject('Gesetzte Frist verstrichen', PThemeEnum.DANGER, 'times'),
                state: SchedulingApiShiftExchangeState.FAILED_DEADLINE_PASSED,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A_IN_COMMUNICATION,
            },
            {
                uiObject: new StateUiObject('Gesetzte Frist verstrichen', PThemeEnum.DANGER, 'times'),
                state: SchedulingApiShiftExchangeState.FAILED_DEADLINE_PASSED,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A,
            },
            {
                uiObject: new StateUiObject('Gesetzte Frist verstrichen', PThemeEnum.DANGER, 'times'),
                state: SchedulingApiShiftExchangeState.FAILED_DEADLINE_PASSED,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.MEMBER_NOT_ASSIGNABLE,
            },
            /** FAILED_EVERYONE_DECLINED */
            {
                uiObject: new StateUiObject('Niemand verfügbar', PThemeEnum.DANGER, 'times'),
                state: SchedulingApiShiftExchangeState.FAILED_EVERYONE_DECLINED,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.IM,
            },
            {
                uiObject: new StateUiObject('Niemand verfügbar', PThemeEnum.DANGER, 'times'),
                state: SchedulingApiShiftExchangeState.FAILED_EVERYONE_DECLINED,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.CP,
            },
            {
                uiObject: new StateUiObject('Niemand verfügbar', PThemeEnum.DANGER, 'times'),
                state: SchedulingApiShiftExchangeState.FAILED_EVERYONE_DECLINED,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A_IN_COMMUNICATION,
            },
            {
                uiObject: new StateUiObject('Niemand verfügbar', PThemeEnum.DANGER, 'times'),
                state: SchedulingApiShiftExchangeState.FAILED_EVERYONE_DECLINED,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A,
            },
            {
                uiObject: new StateUiObject('Niemand verfügbar', PThemeEnum.DANGER, 'times'),
                state: SchedulingApiShiftExchangeState.FAILED_EVERYONE_DECLINED,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.MEMBER_NOT_ASSIGNABLE,
            },
            /** FAILED_SHIFTS_STARTED */
            {
                uiObject: new StateUiObject('Kein Abnehmer bis Schichtbeginn', PThemeEnum.DANGER, 'times'),
                state: SchedulingApiShiftExchangeState.FAILED_SHIFTS_STARTED,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.IM,
            },
            {
                uiObject: new StateUiObject('Kein Abnehmer bis Schichtbeginn', PThemeEnum.DANGER, 'times'),
                state: SchedulingApiShiftExchangeState.FAILED_SHIFTS_STARTED,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.CP,
            },
            {
                uiObject: new StateUiObject('Kein Abnehmer bis Schichtbeginn', PThemeEnum.DANGER, 'times'),
                state: SchedulingApiShiftExchangeState.FAILED_SHIFTS_STARTED,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A_IN_COMMUNICATION,
            },
            {
                uiObject: new StateUiObject('Kein Abnehmer bis Schichtbeginn', PThemeEnum.DANGER, 'times'),
                state: SchedulingApiShiftExchangeState.FAILED_SHIFTS_STARTED,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A,
            },
            {
                uiObject: new StateUiObject('Kein Abnehmer bis Schichtbeginn', PThemeEnum.DANGER, 'times'),
                state: SchedulingApiShiftExchangeState.FAILED_SHIFTS_STARTED,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.MEMBER_NOT_ASSIGNABLE,
            },
            /** ILLNESS_ACCEPT_WITHOUT_SHIFT_EXCHANGE */
            {
                uiObject: new StateUiObject('Akzeptiert ohne Ersatzsuche', PThemeEnum.SUCCESS, 'check'),
                state: SchedulingApiShiftExchangeState.ILLNESS_ACCEPT_WITHOUT_SHIFT_EXCHANGE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.IM,
            },
            {
                uiObject: new StateUiObject('Akzeptiert ohne Ersatzsuche', PThemeEnum.SUCCESS, 'check'),
                state: SchedulingApiShiftExchangeState.ILLNESS_ACCEPT_WITHOUT_SHIFT_EXCHANGE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A_IN_COMMUNICATION,
            },
            {
                uiObject: new StateUiObject('Akzeptiert ohne Ersatzsuche', PThemeEnum.SUCCESS, 'check'),
                state: SchedulingApiShiftExchangeState.ILLNESS_ACCEPT_WITHOUT_SHIFT_EXCHANGE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A,
            },
            {
                uiObject: new StateUiObject('Akzeptiert ohne Ersatzsuche', PThemeEnum.SUCCESS, 'check'),
                state: SchedulingApiShiftExchangeState.ILLNESS_ACCEPT_WITHOUT_SHIFT_EXCHANGE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.MEMBER_NOT_ASSIGNABLE,
            },
            /** ILLNESS_DECLINED */
            {
                uiObject: new StateUiObject('nicht akzeptiert', PThemeEnum.DANGER, 'times'),
                state: SchedulingApiShiftExchangeState.ILLNESS_DECLINED,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.IM,
            },
            {
                uiObject: new StateUiObject('Hast nicht akzeptiert', PThemeEnum.DANGER, 'times'),
                state: SchedulingApiShiftExchangeState.ILLNESS_DECLINED,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A_IN_COMMUNICATION,
            },
            {
                uiObject: new StateUiObject('nicht akzeptiert', PThemeEnum.DANGER, 'times'),
                state: SchedulingApiShiftExchangeState.ILLNESS_DECLINED,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A,
            },
            /** ACTIVE */
            // NO_OFFER_YET
            {
                uiObject: new StateUiObject('noch nichts Passendes', PThemeEnum.WARNING),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NO_OFFER_YET,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.IM,
            },
            {
                uiObject: new StateUiObject('Bitte antworten', PThemeEnum.WARNING),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NO_OFFER_YET,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.CP,
            },
            {
                uiObject: new StateUiObject('Bitte antworten', PThemeEnum.WARNING),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NO_OFFER_YET,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A_IN_COMMUNICATION,
            },
            {
                uiObject: new StateUiObject('noch nichts Passendes', PThemeEnum.WARNING),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NO_OFFER_YET,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A,
            },
            {
                uiObject: new StateUiObject('noch nichts Passendes', PThemeEnum.WARNING),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NO_OFFER_YET,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.MEMBER_NOT_ASSIGNABLE,
            },
            // NO_OFFER_YET_CP_CANNOT
            {
                uiObject: new StateUiObject('noch nichts Passendes', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NO_OFFER_YET_CP_CANNOT,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.IM,
            },
            {
                uiObject: new StateUiObject('Bist nicht verfügbar', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NO_OFFER_YET_CP_CANNOT,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.CP,
            },
            {
                uiObject: new StateUiObject('Bist nicht verfügbar', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NO_OFFER_YET_CP_CANNOT,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A_IN_COMMUNICATION,
            },
            {
                uiObject: new StateUiObject('noch nichts Passendes', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NO_OFFER_YET_CP_CANNOT,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A,
            },
            {
                uiObject: new StateUiObject('noch nichts Passendes', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NO_OFFER_YET_CP_CANNOT,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.MEMBER_NOT_ASSIGNABLE,
            },
            // NO_OFFER_YET_CP_RESPONDED_NO
            {
                uiObject: new StateUiObject('noch nichts Passendes', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NO_OFFER_YET_CP_RESPONDED_NO,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.IM,
            },
            {
                uiObject: new StateUiObject('Hast abgelehnt', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NO_OFFER_YET_CP_RESPONDED_NO,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.CP,
            },
            {
                uiObject: new StateUiObject('noch nichts Passendes', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NO_OFFER_YET_CP_RESPONDED_NO,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A_IN_COMMUNICATION,
            },
            {
                uiObject: new StateUiObject('noch nichts Passendes', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NO_OFFER_YET_CP_RESPONDED_NO,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A,
            },
            {
                uiObject: new StateUiObject('noch nichts Passendes', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NO_OFFER_YET_CP_RESPONDED_NO,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.MEMBER_NOT_ASSIGNABLE,
            },
            // NO_OFFER_YET_IM_RESPONDED_NO
            {
                uiObject: new StateUiObject('noch nichts Passendes', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NO_OFFER_YET_IM_RESPONDED_NO,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.IM,
            },
            {
                uiObject: new StateUiObject('${INDISPOSED_MEMBER_FIRST_NAME} hat abgelehnt', PThemeEnum.DANGER),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NO_OFFER_YET_IM_RESPONDED_NO,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.CP,
            },
            {
                uiObject: new StateUiObject('noch nichts Passendes', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NO_OFFER_YET_IM_RESPONDED_NO,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A_IN_COMMUNICATION,
            },
            {
                uiObject: new StateUiObject('noch nichts Passendes', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NO_OFFER_YET_IM_RESPONDED_NO,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A,
            },
            {
                uiObject: new StateUiObject('noch nichts Passendes', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NO_OFFER_YET_IM_RESPONDED_NO,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.MEMBER_NOT_ASSIGNABLE,
            },
            // IM_MUST_ACCEPT
            {
                uiObject: new StateUiObject('Bitte antworten', PThemeEnum.WARNING),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.IM_MUST_ACCEPT,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.IM,
            },
            {
                uiObject: new StateUiObject('${INDISPOSED_MEMBER_FIRST_NAME} muss antworten', PThemeEnum.WARNING, 'question'),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.IM_MUST_ACCEPT,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.CP,
            },
            {
                uiObject: new StateUiObject('${INDISPOSED_MEMBER_FIRST_NAME} muss antworten', PThemeEnum.WARNING, 'question'),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.IM_MUST_ACCEPT,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A_IN_COMMUNICATION,
            },
            {
                uiObject: new StateUiObject('${INDISPOSED_MEMBER_FIRST_NAME} muss antworten', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.IM_MUST_ACCEPT,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A,
            },
            {
                uiObject: new StateUiObject('${INDISPOSED_MEMBER_FIRST_NAME} muss antworten', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.IM_MUST_ACCEPT,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.MEMBER_NOT_ASSIGNABLE,
            },
            // CP_MUST_ACCEPT
            {
                uiObject: new StateUiObject('Wartest auf Antwort', PThemeEnum.WARNING, 'question'),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.CP_MUST_ACCEPT,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.IM,
            },
            {
                uiObject: new StateUiObject('Bitte antworten', PThemeEnum.WARNING),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.CP_MUST_ACCEPT,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.CP,
            },
            {
                uiObject: new StateUiObject('Bitte antworten', PThemeEnum.WARNING),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.CP_MUST_ACCEPT,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A_IN_COMMUNICATION,
            },
            {
                uiObject: new StateUiObject('${RESPONSIBLE_PERSON_FIRST_NAME} ${RESPONSIBLE_PERSON_WAITS} auf Antwort', PThemeEnum.SECONDARY, 'question'),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.CP_MUST_ACCEPT,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A,
            },
            {
                uiObject: new StateUiObject('${RESPONSIBLE_PERSON_FIRST_NAME} ${RESPONSIBLE_PERSON_WAITS} auf Antwort', PThemeEnum.SECONDARY, 'question'),
                state: SchedulingApiShiftExchangeState.ACTIVE,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.CP_MUST_ACCEPT,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.MEMBER_NOT_ASSIGNABLE,
            },
            /** ILLNESS_NEEDS_CONFIRMATION */
            {
                uiObject: new StateUiObject('Wartest auf Antwort', PThemeEnum.WARNING, 'question'),
                state: SchedulingApiShiftExchangeState.ILLNESS_NEEDS_CONFIRMATION,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.IM,
            },
            {
                uiObject: new StateUiObject('Bitte antworten', PThemeEnum.WARNING),
                state: SchedulingApiShiftExchangeState.ILLNESS_NEEDS_CONFIRMATION,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A_IN_COMMUNICATION,
            },
            {
                uiObject: new StateUiObject('Bitte antworten', PThemeEnum.WARNING),
                state: SchedulingApiShiftExchangeState.ILLNESS_NEEDS_CONFIRMATION,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A,
            },
            {
                uiObject: new StateUiObject('Wartet auf Antwort', PThemeEnum.WARNING, 'question'),
                state: SchedulingApiShiftExchangeState.ILLNESS_NEEDS_CONFIRMATION,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.MEMBER_NOT_ASSIGNABLE,
            },
            /** REMOVED_FROM_SHIFT */
            {
                uiObject: new StateUiObject('Wurdest aus der Schicht entfernt', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.REMOVED_FROM_SHIFT,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.IM,
            },
            {
                uiObject: new StateUiObject('aus der Schicht entfernt', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.REMOVED_FROM_SHIFT,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.CP,
            },
            {
                uiObject: new StateUiObject('aus der Schicht entfernt', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.REMOVED_FROM_SHIFT,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A_IN_COMMUNICATION,
            },
            {
                uiObject: new StateUiObject('aus der Schicht entfernt', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.REMOVED_FROM_SHIFT,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A,
            },
            {
                uiObject: new StateUiObject('aus der Schicht entfernt', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.REMOVED_FROM_SHIFT,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.MEMBER_NOT_ASSIGNABLE,
            },
            /** SHIFTS_REMOVED */
            {
                uiObject: new StateUiObject('Schicht gelöscht', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.SHIFTS_REMOVED,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.IM,
            },
            {
                uiObject: new StateUiObject('Schicht gelöscht', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.SHIFTS_REMOVED,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.CP,
            },
            {
                uiObject: new StateUiObject('Schicht gelöscht', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.SHIFTS_REMOVED,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A_IN_COMMUNICATION,
            },
            {
                uiObject: new StateUiObject('Schicht gelöscht', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.SHIFTS_REMOVED,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A,
            },
            {
                uiObject: new StateUiObject('Schicht gelöscht', PThemeEnum.SECONDARY),
                state: SchedulingApiShiftExchangeState.SHIFTS_REMOVED,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.MEMBER_NOT_ASSIGNABLE,
            },
            /** SWAP_SUCCESSFUL */
            {
                uiObject: new StateUiObject('Getauscht', PThemeEnum.SUCCESS, 'check'),
                state: SchedulingApiShiftExchangeState.SWAP_SUCCESSFUL,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.IM,
            },
            {
                uiObject: new StateUiObject('Getauscht', PThemeEnum.SUCCESS, 'check'),
                state: SchedulingApiShiftExchangeState.SWAP_SUCCESSFUL,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.CP,
            },
            {
                uiObject: new StateUiObject('Getauscht', PThemeEnum.SUCCESS, 'check'),
                state: SchedulingApiShiftExchangeState.SWAP_SUCCESSFUL,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A_IN_COMMUNICATION,
            },
            {
                uiObject: new StateUiObject('Getauscht', PThemeEnum.SUCCESS, 'check'),
                state: SchedulingApiShiftExchangeState.SWAP_SUCCESSFUL,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A,
            },
            {
                uiObject: new StateUiObject('Getauscht', PThemeEnum.SUCCESS, 'check'),
                state: SchedulingApiShiftExchangeState.SWAP_SUCCESSFUL,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.MEMBER_NOT_ASSIGNABLE,
            },
            /** TAKE_SUCCESSFUL */
            {
                uiObject: new StateUiObject('${IM_OFFERED_SHIFTS} abgegeben ', PThemeEnum.SUCCESS, 'check'),
                state: SchedulingApiShiftExchangeState.TAKE_SUCCESSFUL,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.IM,
            },
            {
                uiObject: new StateUiObject('${IM_OFFERED_SHIFTS} übernommen', PThemeEnum.SUCCESS, 'check'),
                state: SchedulingApiShiftExchangeState.TAKE_SUCCESSFUL,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.CP,
            },
            {
                uiObject: new StateUiObject('${IM_OFFERED_SHIFTS} übernommen', PThemeEnum.SUCCESS, 'check'),
                state: SchedulingApiShiftExchangeState.TAKE_SUCCESSFUL,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A_IN_COMMUNICATION,
            },
            {
                uiObject: new StateUiObject('${IM_OFFERED_SHIFTS} übernommen', PThemeEnum.SUCCESS, 'check'),
                state: SchedulingApiShiftExchangeState.TAKE_SUCCESSFUL,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A,
            },
            {
                uiObject: new StateUiObject('${IM_OFFERED_SHIFTS} übernommen', PThemeEnum.SUCCESS, 'check'),
                state: SchedulingApiShiftExchangeState.TAKE_SUCCESSFUL,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.MEMBER_NOT_ASSIGNABLE,
            },
            /** WITHDRAWN */
            {
                uiObject: new StateUiObject('Hast zurückgezogen', PThemeEnum.DANGER),
                state: SchedulingApiShiftExchangeState.CLOSED_MANUALLY,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.IM,
            },
            {
                uiObject: new StateUiObject('zurückgezogen', PThemeEnum.DANGER),
                state: SchedulingApiShiftExchangeState.CLOSED_MANUALLY,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.CP,
            },
            {
                uiObject: new StateUiObject('zurückgezogen', PThemeEnum.DANGER),
                state: SchedulingApiShiftExchangeState.CLOSED_MANUALLY,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A_IN_COMMUNICATION,
            },
            {
                uiObject: new StateUiObject('zurückgezogen', PThemeEnum.DANGER),
                state: SchedulingApiShiftExchangeState.CLOSED_MANUALLY,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.A,
            },
            {
                uiObject: new StateUiObject('zurückgezogen', PThemeEnum.DANGER),
                state: SchedulingApiShiftExchangeState.CLOSED_MANUALLY,
                communicationInfo: SchedulingApiShiftExchangeCommunicationInfo.NOT_ACTIVE,
                requesterRelationship: SchedulingApiShiftExchangeRequesterRelationship.MEMBER_NOT_ASSIGNABLE,
            },
        ];
        this.initData();
    }
    /**
     * Defines the bootstrap based color/design of that ui item.
     */
    getStateStyle(input) {
        const uiDataObject = this.getObject(input);
        if (!uiDataObject)
            return undefined;
        return uiDataObject.stateStyle;
    }
    /**
     * Human readable State-Text.
     */
    getStateText(shiftExchange) {
        const uiDataObject = this.getObject(shiftExchange);
        if (!uiDataObject)
            return undefined;
        return this.localize.transform(uiDataObject.stateText, false);
    }
    /**
     * Icon for the button-badge. Gives the user some more info where he/she needs to do get things done.
     */
    getBadgeIcon(input) {
        var _a;
        const uiDataObject = this.getObject(input);
        if (!uiDataObject)
            return null;
        return (_a = uiDataObject.badgeIcon) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * The object for this shiftExchange thats includes all the necessary data that the ui needs.
     */
    getObject(shiftExchange) {
        let result;
        if (shiftExchange.isNewItem())
            return null;
        if (shiftExchange.attributeInfoState.value === null) {
            throw new TypeError('shiftExchange.state is not defined [PLANO-FE-4KH]');
        }
        // eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
        if (this.data === null || this.data === undefined) {
            throw new TypeError(`PStateData['data'] is not defined [PLANO-FE-4KH]`);
        }
        const objectsForShiftExchangeState = this.data[shiftExchange.state];
        result = objectsForShiftExchangeState[shiftExchange.communicationInfo];
        if (!(result instanceof StateUiObject))
            result = result[shiftExchange.requesterRelationship];
        if (result instanceof StateUiObject)
            return result;
        // eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
        if (Config.DEBUG && !result) {
            let text = 'StateData could not be found for ';
            text += `[${SchedulingApiShiftExchangeState[shiftExchange.state]}]`;
            text += `[${SchedulingApiShiftExchangeCommunicationInfo[shiftExchange.communicationInfo]}]`;
            text += `[${SchedulingApiShiftExchangeRequesterRelationship[shiftExchange.requesterRelationship]}]`;
            // eslint-disable-next-line no-console
            console.warn(text);
        }
        return result;
    }
    initData() {
        this.initEmptyDataForAllRequiredEnums();
        this.initStateDataValues();
        if (Config.DEBUG)
            this.checkMissingData();
    }
    addUiObject(input) {
        if (input.requesterRelationship !== undefined) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.data[input.state][input.communicationInfo][input.requesterRelationship] = input.uiObject;
        }
        else {
            this.data[input.state][input.communicationInfo] = input.uiObject;
        }
    }
    initStateDataValues() {
        // this.localize.languageTestSetter(PSupportedLanguageCodes.en);
        for (const stateTextObject of this.arrayOfDataObjectForState) {
            this.addUiObject(stateTextObject);
        }
    }
    forEachEnumValue(input, success) {
        for (const stateKey of Object.keys(input)) {
            if (Number.isNaN(+stateKey))
                continue;
            success(+stateKey);
        }
    }
    checkMissingData() {
        const enumState = SchedulingApiShiftExchangeState;
        const enumComInfo = SchedulingApiShiftExchangeCommunicationInfo;
        this.forEachEnumValue(enumState, (enumStateValue) => {
            this.forEachEnumValue(enumComInfo, (enumComInfoValue) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (this.data[enumStateValue][enumComInfoValue])
                    return;
                // eslint-disable-next-line no-console
                console.warn(`TODO: StateUiObject missing for ` +
                    `[${enumState[enumStateValue]}][${enumComInfo[enumComInfoValue]}]`);
            });
        });
    }
    initEmptyDataForAllRequiredEnums() {
        const result = {};
        const enumState = SchedulingApiShiftExchangeState;
        const enumComInfo = SchedulingApiShiftExchangeCommunicationInfo;
        for (const stateKey of Object.keys(enumState)) {
            if (!Number.isNaN(+stateKey))
                continue;
            const state = enumState[stateKey];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const resultForState = {};
            for (const enumComInfoKey of Object.keys(enumComInfo)) {
                if (!Number.isNaN(+enumComInfoKey))
                    continue;
                resultForState[enumComInfo[enumComInfoKey]] = {};
            }
            result[state] = resultForState;
        }
        this.data = result;
    }
}
//# sourceMappingURL=p-state-data.js.map