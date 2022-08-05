import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { SchedulingApiShiftExchange } from '@plano/shared/api';
import { SchedulingApiShiftExchangeCommunicationAction } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { PDictionarySourceString } from '@plano/shared/core/pipe/localize.dictionary';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';

export type PossibleActionIcons = (
	typeof PlanoFaIconPool.EDIT |
	typeof PlanoFaIconPool.DISMISS |
	typeof PlanoFaIconPool.SUCCESS |
	typeof PlanoFaIconPool.EXCHANGE_SHIFT |
	typeof PlanoFaIconPool.EXCHANGE_SHIFT_OFFER
);

class ActionUiObject {
	public text : string | null = null;
	public icon : PossibleActionIcons | undefined;
	public style : PThemeEnum.DANGER | PThemeEnum.SUCCESS | undefined;

	constructor(
		text : string | null,
		icon ?: PossibleActionIcons,
	) {
		this.text = text;
		this.icon = icon;
		this.style = this.getIconStyle(icon);
	}

	private getIconStyle(icon : PossibleActionIcons | undefined) : ActionUiObject['style'] | undefined {
		switch (icon) {
			case PlanoFaIconPool.DISMISS :
				return PThemeEnum.DANGER;
			case PlanoFaIconPool.SUCCESS :
				return PThemeEnum.SUCCESS;
			case PlanoFaIconPool.EXCHANGE_SHIFT :
				return PThemeEnum.SUCCESS;
			case PlanoFaIconPool.EXCHANGE_SHIFT_OFFER :
				return PThemeEnum.SUCCESS;
			case PlanoFaIconPool.EDIT:
			case undefined:
				return undefined;
		}
	}
}

type ArrayOfStateTextsType = {
	enum : SchedulingApiShiftExchangeCommunicationAction;
	text : PDictionarySourceString | null;
	icon ?: PossibleActionIcons;
}[];

export class PActionData {
	private data : {
		[index in SchedulingApiShiftExchangeCommunicationAction] ?: ActionUiObject
	} = {};

	constructor(
		private localize : LocalizePipe,
	) {
		this.initData();
	}

	private initData() : void {
		this.initStateDataValues();
		if (Config.DEBUG) this.checkMissingData();
	}

	private addUiObject(
		action : SchedulingApiShiftExchangeCommunicationAction,
		text : string | null,
		icon ?: PossibleActionIcons,
	) : void {
		const UI_OBJECT = new ActionUiObject(text, icon);
		this.data[action] = UI_OBJECT;
	}

	public arrayOfStateTexts : ArrayOfStateTextsType = [
		{ enum: SchedulingApiShiftExchangeCommunicationAction.A_REPORTED_ILLNESS, text: null },
		{ enum: SchedulingApiShiftExchangeCommunicationAction.IM_REPORTED_ILLNESS, text: null },
		{ enum: SchedulingApiShiftExchangeCommunicationAction.CP_ASSIGNED_SAME_TIME, text: null },
		{ enum: SchedulingApiShiftExchangeCommunicationAction.CP_ASSIGNED_SAME_SHIFT, text: null },
		{ enum: SchedulingApiShiftExchangeCommunicationAction.CP_IS_ABSENT, text: null },
		{ enum: SchedulingApiShiftExchangeCommunicationAction.CP_IS_ILL, text: null },
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_NEEDS_RESPONSE,
			text: '${INDISPOSED_MEMBER_FIRST_NAME} ${C_WAITS} auf Antwort',
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_SWAP_IM_CHANGE_SWAPPED_SHIFT,
			text: 'Mein Tauschangebot ändern',
			icon: PlanoFaIconPool.EDIT,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_SWAP_IM_DECLINE_SWAP,
			text: 'Doch nicht tauschen',
			icon: PlanoFaIconPool.DISMISS,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_SWAP_CP_ACCEPT,
			text: 'Tauschangebot annehmen',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_SWAP_CP_CANNOT,
			text: 'Kann doch nicht',
			icon: PlanoFaIconPool.DISMISS,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_SWAP_CP_TAKE_SHIFT_PREF_MATCH,
			text: 'Mein Tauschangebot ändern',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_SWAP_CP_TAKE_SHIFT_PREF_MISMATCH,
			text: 'Mein Tauschangebot ändern',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT_OFFER,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_TAKE_IM_DECLINE_TAKE,
			text: 'Mein Tauschangebot ändern',
			icon: PlanoFaIconPool.DISMISS,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_TAKE_CP_ACCEPT,
			text: '${IM_OFFERED_SHIFTS} abnehmen',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT_OFFER,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_TAKE_CP_CANNOT,
			text: 'Kann doch nicht',
			icon: PlanoFaIconPool.DISMISS,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_CHANGED_MIND_WANTS_TAKE_CP_SWAP_SHIFT,
			text: 'Schichten doch tauschen',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_DECLINED_SWAP_IM_SWAP_SHIFT,
			text: 'Schichten doch tauschen',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_DECLINED_SWAP_CP_CHANGE_OFFERED_SHIFTS,
			text: 'Angebot an ${INDISPOSED_MEMBER_FIRST_NAME} ändern',
			icon: PlanoFaIconPool.EDIT,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_DECLINED_SWAP_CP_TAKE_SHIFT_PREF_MATCH,
			text: '${IM_OFFERED_SHIFTS} doch abnehmen',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT_OFFER,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_DECLINED_SWAP_CP_TAKE_SHIFT_PREF_MISMATCH,
			text: '${IM_OFFERED_SHIFTS} doch abnehmen',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT_OFFER,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_DECLINED_TAKE_IM_TAKE_SHIFT,
			text: '${IM_OFFERED_SHIFTS} doch abgeben',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT_OFFER,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.IM_DECLINED_TAKE_CP_SWAP_SHIFT,
			text: 'Schichten doch tauschen',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_NOT_RESPONDED_CP_CANNOT,
			text: 'Kann nicht',
			icon: PlanoFaIconPool.DISMISS,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_NOT_RESPONDED_CP_SWAP_SHIFT,
			text: 'Schichten tauschen',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_NOT_RESPONDED_CP_TAKE_SHIFT_PREF_MATCH,
			text: '${IM_OFFERED_SHIFTS} abnehmen',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT_OFFER,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_NOT_RESPONDED_CP_TAKE_SHIFT_PREF_MISMATCH,
			text: '${IM_OFFERED_SHIFTS} abnehmen',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT_OFFER,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_RESPONDED_NO_CP_SWAP_SHIFT,
			text: 'Schichten doch tauschen',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_RESPONDED_NO_CP_TAKE_SHIFT_PREF_MATCH,
			text: '${IM_OFFERED_SHIFTS} doch abnehmen',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT_OFFER,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_RESPONDED_NO_CP_TAKE_SHIFT_PREF_MISMATCH,
			text: '${IM_OFFERED_SHIFTS} doch abnehmen',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT_OFFER,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_WANTS_SWAP_IM_ACCEPT,
			text: 'Tauschangebot ansehen',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_WANTS_SWAP_IM_DECLINE_SWAP,
			text: 'Will nicht tauschen',
			icon: PlanoFaIconPool.DISMISS,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_WANTS_SWAP_CP_CANNOT,
			text: 'Kann doch nicht',
			icon: PlanoFaIconPool.DISMISS,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_WANTS_SWAP_CP_CHANGE_OFFERED_SHIFTS,
			text: 'Angebot an ${INDISPOSED_MEMBER_FIRST_NAME} ändern',
			icon: PlanoFaIconPool.EDIT,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_WANTS_SWAP_CP_TAKE_SHIFT_PREF_MATCH,
			text: '${IM_OFFERED_SHIFTS} doch abnehmen',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT_OFFER,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.ILLNESS_NEEDS_CONFIRMATION_A_DECLINED,
			text: 'Ablehnen',
			icon: PlanoFaIconPool.DISMISS,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.ILLNESS_NEEDS_CONFIRMATION_A_ACCEPT_WITH_SHIFT_EXCHANGE,
			text: 'Akzeptieren & Ersatz suchen',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT_OFFER,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.ILLNESS_CONFIRMED_WITHOUT_SHIFT_EXCHANGE_A_START_SHIFT_EXCHANGE,
			text: 'Doch Ersatz suchen',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT_OFFER,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.ILLNESS_NEEDS_CONFIRMATION_A_ACCEPT_WITHOUT_SHIFT_EXCHANGE,
			text: 'Akzeptieren',
			icon: PlanoFaIconPool.SUCCESS,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.ILLNESS_DECLINED_A_ACCEPT_WITH_SHIFT_EXCHANGE,
			text: 'Doch akzeptieren & Ersatz suchen',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT_OFFER,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.ILLNESS_DECLINED_A_ACCEPT_WITHOUT_SHIFT_EXCHANGE,
			text: 'Doch akzeptieren',
			icon: PlanoFaIconPool.SUCCESS,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_WANTS_SWAP_CP_TAKE_SHIFT_PREF_MISMATCH,
			text: '${IM_OFFERED_SHIFTS} doch abnehmen',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT_OFFER,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_WANTS_TAKE_CP_SWAP_SHIFT,
			text: 'Schichten doch tauschen',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_WANTS_TAKE_CP_CANNOT,
			text: 'kann doch nicht',
			icon: PlanoFaIconPool.DISMISS,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_WANTS_TAKE_IM_DECLINE,
			text: '${IM_OFFERED_SHIFTS} nicht abgeben',
			icon: PlanoFaIconPool.DISMISS,
		},
		{
			enum: SchedulingApiShiftExchangeCommunicationAction.CP_WANTS_TAKE_IM_ACCEPT,
			text: '${IM_OFFERED_SHIFTS} abgeben',
			icon: PlanoFaIconPool.EXCHANGE_SHIFT_OFFER,
		},
	];

	private initStateDataValues() : void {
		for (const stateTextObject of this.arrayOfStateTexts) {
			this.addUiObject(
				stateTextObject.enum,
				stateTextObject.text === null ? null : this.localize.transform(stateTextObject.text, false),
				stateTextObject.icon,
			);
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

		this.forEachEnumValue(exchangeAction, (exchangeActionValue) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			if ((this.data as any)[exchangeActionValue] !== undefined) return;
			// eslint-disable-next-line no-console
			console.warn(`TODO: PActionText missing for [${exchangeAction[exchangeActionValue]}]`,
			);
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getText(
		action : SchedulingApiShiftExchangeCommunicationAction,
		_shiftExchange : SchedulingApiShiftExchange,
	) : string | null {
		const actionData = this.data[action] ?? null;

		if (actionData) return actionData.text;

		if (Config.DEBUG) {
			// eslint-disable-next-line no-console
			console.error(`PActionText could not be found for [${SchedulingApiShiftExchangeCommunicationAction[action]}]`);
		}
		return 'ERROR';
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getIcon(action : SchedulingApiShiftExchangeCommunicationAction) : PossibleActionIcons | undefined {
		const result = this.data[action];
		if (result) return result.icon;
		return undefined;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getIconStyle(action : SchedulingApiShiftExchangeCommunicationAction) : ActionUiObject['style'] | undefined {
		const result = this.data[action];
		if (result) return result.style;
		return undefined;
	}

	private replace(
		text : string,
		regex : RegExp,
		replacer : () => string,
	) : string {
		const replaceableString = new RegExp(regex);
		if (!text.match(replaceableString)) return text;
		return text.replace(replaceableString, replacer());
	}
}
