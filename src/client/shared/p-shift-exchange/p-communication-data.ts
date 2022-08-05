import { SchedulingApiShiftExchangeRequesterRelationship } from '@plano/shared/api';
import { SchedulingApiShiftExchangeCommunicationAction } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { PDictionarySourceString } from '@plano/shared/core/pipe/localize.dictionary';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';

/**
 * Communication UI object
 * A place to store all information the UI needs for a communication item.
 */
class CommUiObject {
	public stateText : string | null = null;

	constructor(
		stateText : string,
	) {
		this.stateText = stateText;
	}
}

export class PCommunicationData {
	private data ! : {
		[index in SchedulingApiShiftExchangeCommunicationAction] ?: CommUiObject
	};

	constructor(
		private localize : LocalizePipe,
	) {
		this.initData();
	}

	/**
	 * Defines what text is shown in the state-badge
	 */
	public getStateText(
		action : SchedulingApiShiftExchangeCommunicationAction,
	) : string | null {
		const uiDataObject = this.getObject(
			action,
		);
		if (!uiDataObject) return null;
		return uiDataObject.stateText;
	}

	private getObject(
		action : SchedulingApiShiftExchangeCommunicationAction,
	) : CommUiObject | null {
		// When there has not been any communication yet, then there is no action that can be requested
		const result = this.data[action] ?? null;

		if (Config.DEBUG && !result || !(result instanceof CommUiObject)) {
			let text = 'CommUiObject could not be found for ';
			text += `[${SchedulingApiShiftExchangeCommunicationAction[action]}]`;
			// eslint-disable-next-line no-console
			console.error(text);
		}

		return result;
	}

	private initData() : void {
		this.initEmptyDataForAllEnums();

		this.initDataValues();
		if (Config.DEBUG) this.checkMissingData();
	}

	private addUiObject(
		text : string,
		action : SchedulingApiShiftExchangeCommunicationAction,
		relationship ?: SchedulingApiShiftExchangeRequesterRelationship,
	) : void {
		const tmpUiDataObject : {
			[index in SchedulingApiShiftExchangeCommunicationAction] ?: {
				[index2 in SchedulingApiShiftExchangeRequesterRelationship] : CommUiObject
			} | CommUiObject
		} = this.data;
		const UI_OBJECT = new CommUiObject(text);
		if (relationship !== undefined) {
			// eslint-disable-next-line no-console, @typescript-eslint/no-explicit-any
			if (Config.DEBUG && (tmpUiDataObject[action] as any)[relationship] instanceof CommUiObject) console.error('Already added');
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(tmpUiDataObject[action] as any)[relationship] = UI_OBJECT;
		} else {
			tmpUiDataObject[action] = UI_OBJECT;
		}
	}

	public arrayOfActionTexts : {enum : SchedulingApiShiftExchangeCommunicationAction, text : PDictionarySourceString}[] = [

		/** CP_WANTS_SWAP */
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_WANTS_SWAP_IM_ACCEPT,
			text: 'Schichten getauscht',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_WANTS_SWAP_CP_CANNOT,
			text: '${CP_FIRST_NAME} ${CP_HAS} doch abgelehnt',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_WANTS_SWAP_CP_CHANGE_OFFERED_SHIFTS,
			text: '${CP_FIRST_NAME} ${CP_HAS} ein neues Tauschangebot gemacht',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_WANTS_SWAP_IM_DECLINE_SWAP,
			text: '${INDISPOSED_MEMBER_FIRST_NAME} ${C_WANTS} nicht tauschen',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_WANTS_SWAP_CP_TAKE_SHIFT_PREF_MISMATCH,
			text: '${CP_FIRST_NAME} ${CP_WANTS} die ${IM_OFFERED_SHIFTS} doch übernehmen',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_WANTS_SWAP_CP_TAKE_SHIFT_PREF_MATCH,
			text: '${CP_FIRST_NAME} ${CP_HAS} die ${IM_OFFERED_SHIFTS} übernommen',
		},

		/** A_REPORTED_ILLNESS */
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.A_REPORTED_ILLNESS,
			text: '${CP_FIRST_NAME} ${CP_HAS} diese Krankmeldung erstellt und ${CP_SEEKS} Ersatz',
		},

		/** ILLNESS_NEEDS_CONFIRMATION */
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.ILLNESS_NEEDS_CONFIRMATION_A_ACCEPT_WITH_SHIFT_EXCHANGE,
			text: '${CP_FIRST_NAME} ${CP_HAS} die Krankmeldung akzeptiert und ${CP_SEEKS} Ersatz',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.ILLNESS_NEEDS_CONFIRMATION_A_ACCEPT_WITHOUT_SHIFT_EXCHANGE,
			text: '${CP_FIRST_NAME} ${CP_HAS} die Krankmeldung akzeptiert ohne Ersatzsuche',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.ILLNESS_CONFIRMED_WITHOUT_SHIFT_EXCHANGE_A_START_SHIFT_EXCHANGE,
			text: '${CP_FIRST_NAME} ${CP_HAS} die Krankmeldung akzeptiert',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.ILLNESS_NEEDS_CONFIRMATION_A_DECLINED,
			text: '${CP_FIRST_NAME} ${CP_HAS} die Krankmeldung nicht akzeptiert',
		},

		/** ILLNESS_DECLINED */
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.ILLNESS_DECLINED_A_ACCEPT_WITHOUT_SHIFT_EXCHANGE,
			text: '${CP_FIRST_NAME} ${CP_HAS} die Krankmeldung doch akzeptiert',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.ILLNESS_DECLINED_A_ACCEPT_WITH_SHIFT_EXCHANGE,
			text: '${CP_FIRST_NAME} ${CP_HAS} die Krankmeldung doch akzeptiert',
		},

		/** CP_NOT_RESPONDED */
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_NOT_RESPONDED_CP_SWAP_SHIFT,
			text: '${CP_FIRST_NAME} ${CP_WANTS} tauschen',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_NOT_RESPONDED_CP_TAKE_SHIFT_PREF_MATCH,
			text: '${CP_FIRST_NAME} ${CP_HAS} die ${IM_OFFERED_SHIFTS} übernommen',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_NOT_RESPONDED_CP_TAKE_SHIFT_PREF_MISMATCH,
			text: '${CP_FIRST_NAME} ${CP_WANTS} die ${IM_OFFERED_SHIFTS} übernehmen',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_NOT_RESPONDED_CP_CANNOT,
			text: '${CP_HAS} abgelehnt',
		},

		/** CP_RESPONDED_NO */
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_RESPONDED_NO_CP_SWAP_SHIFT,
			text: '${CP_FIRST_NAME} ${CP_WANTS} doch tauschen',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_RESPONDED_NO_CP_TAKE_SHIFT_PREF_MISMATCH,
			text: '${CP_FIRST_NAME} ${CP_WANTS} die ${IM_OFFERED_SHIFTS} doch übernehmen',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_RESPONDED_NO_CP_TAKE_SHIFT_PREF_MATCH,
			text: '${CP_FIRST_NAME} ${C_HAS} die ${IM_OFFERED_SHIFTS} übernommen',
		},

		/** C_DECLINED_SWAP */
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_DECLINED_SWAP_CP_CHANGE_OFFERED_SHIFTS,
			text: '${CP_FIRST_NAME} ${CP_HAS} ein neues Tauschangebot gemacht',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_DECLINED_SWAP_IM_SWAP_SHIFT,
			text: '${INDISPOSED_MEMBER_FIRST_NAME} ${C_WANTS} doch tauschen',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_DECLINED_SWAP_CP_TAKE_SHIFT_PREF_MISMATCH,
			text: '${CP_FIRST_NAME} ${CP_WANTS} die ${IM_OFFERED_SHIFTS} doch übernehmen',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_DECLINED_SWAP_CP_TAKE_SHIFT_PREF_MATCH,
			text: '${CP_FIRST_NAME} ${CP_HAS} die ${IM_OFFERED_SHIFTS} doch übernommen',
		},

		/** CP_WANTS_TAKE */
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_WANTS_TAKE_CP_SWAP_SHIFT,
			text: '${CP_FIRST_NAME} ${CP_WANTS} doch tauschen',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_WANTS_TAKE_CP_CANNOT,
			text: '${CP_FIRST_NAME} ${CP_HAS} doch abgelehnt',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_WANTS_TAKE_IM_DECLINE,
			text: '${INDISPOSED_MEMBER_FIRST_NAME} ${C_WANTS} nicht abgeben, sondern tauschen',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_WANTS_TAKE_IM_ACCEPT,
			text: '${CP_FIRST_NAME} ${CP_HAS} die ${IM_OFFERED_SHIFTS} übernommen',
		},

		/** C_DECLINED_TAKE */
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_DECLINED_TAKE_CP_SWAP_SHIFT,
			text: '${CP_FIRST_NAME} ${CP_WANTS} doch tauschen',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_DECLINED_TAKE_IM_TAKE_SHIFT,
			text: '${INDISPOSED_MEMBER_FIRST_NAME} ${C_WANTS} die ${IM_OFFERED_SHIFTS} doch abgeben',
		},

		/** C_CHANGED_MIND_WANTS_SWAP */
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_SWAP_IM_CHANGE_SWAPPED_SHIFT,
			text: '${INDISPOSED_MEMBER_FIRST_NAME} ${C_HAS} ein anderes Angebot ausgewählt',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_SWAP_IM_DECLINE_SWAP,
			text: '${INDISPOSED_MEMBER_FIRST_NAME} ${C_WANTS} doch nicht tauschen',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_SWAP_CP_CANNOT,
			text: '${CP_FIRST_NAME} ${CP_HAS} doch abgelehnt',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_SWAP_CP_ACCEPT,
			text: 'Schichten getauscht',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_SWAP_CP_TAKE_SHIFT_PREF_MISMATCH,
			text: '${CP_FIRST_NAME} ${CP_WANTS} die ${IM_OFFERED_SHIFTS} doch übernehmen',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_SWAP_CP_TAKE_SHIFT_PREF_MATCH,
			text: '${CP_FIRST_NAME} ${CP_HAS} die ${IM_OFFERED_SHIFTS} doch übernommen',
		},

		/** IM_CHANGED_MIND_WANTS_TAKE */
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_TAKE_CP_SWAP_SHIFT,
			text: '${CP_FIRST_NAME} ${CP_WANTS} doch tauschen',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_TAKE_CP_CANNOT,
			text: '${CP_FIRST_NAME} ${CP_HAS} doch abgelehnt',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_TAKE_CP_ACCEPT,
			text: 'Schichten getauscht',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_TAKE_IM_DECLINE_TAKE,
			text: '${INDISPOSED_MEMBER_FIRST_NAME} ${C_WANTS} doch nicht abgeben',
		},

		/** other */
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_NEEDS_RESPONSE,
			text: '${RESPONSIBLE_PERSON_FIRST_NAME} ${RESPONSIBLE_PERSON_WAITS} auf Antwort',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_ASSIGNED_SAME_TIME,
			text: '${CP_IS_WORKING} zur selben Zeit',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_ASSIGNED_SAME_SHIFT,
			text: '${CP_IS_WORKING} in derselben Schicht',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_IS_ABSENT,
			text: '${CP_FIRST_NAME} ${CP_IS} zu der Zeit abwesend',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_IS_ILL,
			text: '${CP_FIRST_NAME} ${CP_IS} zu der Zeit krank',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_REPORTED_ILLNESS,
			text: '${INDISPOSED_MEMBER_FIRST_NAME} ${C_WAITS} auf Antwort',
		},
	];

	private initDataValues() : void {
		// this.localize.languageTestSetter(PSupportedLanguageCodes.en);
		for (const actionTextObject of this.arrayOfActionTexts) {
			this.addUiObject(this.localize.transform(actionTextObject.text, false), actionTextObject.enum);
		}
	}

	private forEachEnumValue(input : typeof SchedulingApiShiftExchangeCommunicationAction, success : (enumValue : number) => void) : void {
		for (const stateKey of Object.keys(input)) {
			if (Number.isNaN(+stateKey)) continue;
			success(+stateKey);
		}
	}

	private checkMissingData() : void {

		/** shorthands */
		const exchangeAction = SchedulingApiShiftExchangeCommunicationAction;
		// const eAction = SchedulingApiShiftExchangeCommunicationAction;

		this.forEachEnumValue(exchangeAction, (exchangeActionValue) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if ((this.data as any)[exchangeActionValue] instanceof CommUiObject) return;

			// eslint-disable-next-line no-console
			console.warn(`TODO: CommUiObject missing for [${exchangeAction[exchangeActionValue]}]`);
		});
	}

	/**
	 * This creates the base structure of this.data.
	 * NOTE: the action enum is missing here, because data[...][...] is not always an object of action's.
	 */
	private initEmptyDataForAllEnums() : void {
		const result = {};

		/** shorthands */
		const exchangeAction = SchedulingApiShiftExchangeCommunicationAction;

		for (const exchangeActionKey of Object.keys(exchangeAction)) {
			if (!Number.isNaN(+exchangeActionKey)) continue;
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(result as any)[exchangeAction[exchangeActionKey as any]] = undefined;
		}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.data = (result as any);
	}
}
