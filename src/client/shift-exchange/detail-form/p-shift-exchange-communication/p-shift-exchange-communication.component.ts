import { AfterContentInit} from '@angular/core';
import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter, HostBinding } from '@angular/core';
import { BootstrapSize, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { MemberService } from '@plano/client/shared/p-member/p-member.service';
import { PShiftExchangeConceptService } from '@plano/client/shared/p-shift-exchange/p-shift-exchange-concept.service';
import { PShiftExchangeService } from '@plano/client/shared/p-shift-exchange/shift-exchange.service';
import { ActionData } from '@plano/shared/api';
import { SchedulingApiShiftExchangeCommunicationAction } from '@plano/shared/api';
import { ApiListWrapper } from '@plano/shared/api';
import { SchedulingApiMember } from '@plano/shared/api';
import { SchedulingApiShiftExchangeCommunicationState, SchedulingApiShiftExchangeCommunicationRequesterRole } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiShiftExchange, SchedulingApiShiftExchangeCommunication, SchedulingApiShiftExchangeCommunications } from '@plano/shared/api';
import { FaIconComponent } from '@plano/shared/core/component/fa-icon/fa-icon.component';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { ModalContentOptions } from '@plano/shared/core/p-modal/modal-default-template/modal-default-template.component';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { ModalServiceOptions } from '@plano/shared/core/p-modal/modal.service.options';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PShiftExchangeCommunicationModalComponent } from './p-shift-exchange-communication-modal/p-shift-exchange-communication-modal.component';

@Component({
	selector: 'p-shift-exchange-communication[shiftExchange]',
	templateUrl: './p-shift-exchange-communication.component.html',
	styleUrls: ['./p-shift-exchange-communication.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PShiftExchangeCommunicationComponent implements AfterContentInit {
	@Input() public shiftExchange ! : SchedulingApiShiftExchange;
	@Input() private input : SchedulingApiShiftExchangeCommunication | SchedulingApiShiftExchangeCommunications | null = null;

	@Output() private onPerformActionModalSuccess : EventEmitter<ActionData> = new EventEmitter<ActionData>();
	@Output() private onPerformActionModalDismiss : EventEmitter<ActionData> = new EventEmitter<ActionData>();

	@HostBinding('class.muted-item') private get _isMuted() : boolean {
		if (!this.shiftExchange.isClosed) return false;
		if (this.availableActionDataArray.length) return false;

		return true;
	}

	public readonly CONFIG : typeof Config = Config;

	public showNames : boolean = false;
	public showTextarea : boolean = false;
	public maxMemberBadgeItems : number | null = null;

	constructor(
		public api : SchedulingApiService,
		private pShiftExchangeConceptService : PShiftExchangeConceptService,
		private modalService : ModalService,
		private memberService : MemberService,
		private console : LogService,
		private rightsService : RightsService,
		private pShiftExchangeService : PShiftExchangeService,
		private localize : LocalizePipe,
	) {
		// this.communication.lastAction
		// this.availableActions[0].action
		// SchedulingApiShiftExchangeCommunicationAction
		// this.pShiftExchangeConceptService.getActionText()
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get communications() : ApiListWrapper<SchedulingApiShiftExchangeCommunication> | undefined {
		if (this.input && this.input instanceof SchedulingApiShiftExchangeCommunications) {
			return this.input.sortedBy([
				item => item.communicationPartner!.lastName,
				item => item.communicationPartner!.firstName,
			], false);
		}
		return undefined;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get communication() : SchedulingApiShiftExchangeCommunication {
		if (this.input && this.input instanceof SchedulingApiShiftExchangeCommunication) return this.input;
		return this.communications!.get(0)!;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showLastActionTime() : boolean {
		switch (this.communication.communicationState) {
			case SchedulingApiShiftExchangeCommunicationState.CP_NOT_RESPONDED :
			case SchedulingApiShiftExchangeCommunicationState.ILLNESS_NEEDS_CONFIRMATION :
				return false;
			default :
				return !!this.communication.lastActionTime;
		}
	}

	private get isMyCommunication() : boolean {
		return !!this.rightsService.isMe(this.communication.communicationPartnerId);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get mePerformedLastAction() : boolean {
		const lastActionData = this.pShiftExchangeConceptService.getActionData(this.communication.lastAction);
		return lastActionData!.requesterRole === this.communication.requesterRole;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get indisposedMemberPerformedLastAction() : boolean {
		const actionData = this.pShiftExchangeConceptService.getActionData(this.communication.lastAction);
		return actionData!.requesterRole === SchedulingApiShiftExchangeCommunicationRequesterRole.IM;
	}

	private get iAmTheCreator() : boolean {
		return !!this.rightsService.isMe(this.shiftExchange.indisposedMemberId);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get availableActionDataArray() : ActionData[] {
		if (!this.iAmTheCreator && !this.isMyCommunication) return [];
		const availableActions = this.pShiftExchangeConceptService.getAvailableActions(
			this.shiftExchange,
			this.communication,
		);

		const sortingPriorities : FaIconComponent['icon'][] = [
			'pen',
			'exchange-alt',
			'long-arrow-alt-right',
			'check',
			'times',
		];
		return availableActions.sort((a, b) => {
			const iconA = this.availableActionIcon(a.action);
			const iconB = this.availableActionIcon(b.action);
			if (Config.DEBUG) {
				if (!iconA) this.console.debug('iconA could not be found', iconA);
				if (!iconB) this.console.debug('iconB could not be found', iconB);
			}
			const prioA = sortingPriorities.indexOf(iconA!);
			const prioB = sortingPriorities.indexOf(iconB!);
			if (Config.DEBUG) {
				if (!iconA) this.console.debug('iconA could not be found', iconA);
				if (!iconB) this.console.debug('iconB could not be found', iconB);
				if (!prioA) this.console.debug('iconA could not be found', prioA);
				if (!prioB) this.console.debug('iconB could not be found', prioB);
			}
			return prioA - prioB;
		});
	}

	/**
	 * Get the action text for a given available action
	 * Use this as label for the action button
	 */
	public availableActionText(
		availableAction : SchedulingApiShiftExchangeCommunicationAction,
		shiftExchange : SchedulingApiShiftExchange,
	) : ReturnType<PShiftExchangeConceptService['getActionText']> {
		return this.pShiftExchangeConceptService.getActionText(availableAction, shiftExchange);
	}

	/**
	 * Get the icon for a given available action
	 * Use this as icon for the action button
	 */
	public availableActionIcon(availableAction : SchedulingApiShiftExchangeCommunicationAction) : ReturnType<PShiftExchangeConceptService['getActionIcon']> {
		return this.pShiftExchangeConceptService.getActionIcon(availableAction);
	}

	/**
	 * Get the color for a given available action
	 * Use this as color for the action button icon
	 */
	public availableActionIconStyle(availableAction : SchedulingApiShiftExchangeCommunicationAction) : ReturnType<PShiftExchangeConceptService['getActionIconStyle']> {
		return this.pShiftExchangeConceptService.getActionIconStyle(availableAction);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get needsReview() : boolean {
		if (this.needsReviewLabel) return true;
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get needsReviewLabel() : string | undefined {
		let memberThatNeedsToReply : SchedulingApiMember | null = null;
		if (this.pShiftExchangeConceptService.needsReviewByIM(
			this.shiftExchange.requesterRelationship,
			this.communication.communicationState,
		)) memberThatNeedsToReply = this.shiftExchange.indisposedMember;
		if (this.pShiftExchangeConceptService.needsReviewByCP(
			this.shiftExchange.requesterRelationship,
			this.communication.communicationState,
		)) memberThatNeedsToReply = this.communication.communicationPartner;
		if (!memberThatNeedsToReply) return undefined;
		let text : string = '';
		if (this.rightsService.isMe(memberThatNeedsToReply)) {
			text += 'Deine';
		} else {
			text += this.memberService.makeNameGenitive(memberThatNeedsToReply.firstName);
		}
		text += ' Bestätigung nötig';
		return text;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get lastActionStateText() : ReturnType<PShiftExchangeConceptService['getActionStateText']> {
		return this.pShiftExchangeConceptService.getActionStateText(
			this.shiftExchange,
			this.communication,
			this.communication.lastAction,
		);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get stateTheme() : ReturnType<PShiftExchangeConceptService['getCommunicationStateStyle']> {
		return this.pShiftExchangeConceptService.getCommunicationStateStyle(
			this.communication.communicationState,
			this.communication.lastAction,
		);
	}

	/**
	 * In some exceptions we don’t need a warning-modal.
	 */
	private noPrefMismatchWarningNeeded(clickedActionData : ActionData) : boolean {
		switch (clickedActionData.prevCommunicationState) {
			case SchedulingApiShiftExchangeCommunicationState.IM_CHANGED_MIND_WANTS_SWAP : // IM declined CP's offer but changed mind later?
			case clickedActionData.nextCommunicationState : // CP edits existing offer?
				return true;
			default :
				return false;
		}
	}

	private get iMWantsSwap() : boolean {
		if (this.communication.iMChangedMindWantsSwap) return true;
		if (this.communication.iMChangedMindWantsTake) return false;
		return this.shiftExchange.indisposedMemberPrefersSwapping;
	}
	private iMWantsSwapCPWantsTake(clickedActionData : ActionData) : boolean {
		if (!this.iMWantsSwap) return false;

		const STATE_ENUM = SchedulingApiShiftExchangeCommunicationState;
		if (clickedActionData.nextCommunicationState === STATE_ENUM.CP_WANTS_TAKE) return true;
		if (clickedActionData.nextCommunicationState === STATE_ENUM.TAKE_SUCCESSFUL) return true;
		return false;
	}
	private get iMWantsTake() : boolean {
		if (this.communication.iMChangedMindWantsTake) return true;
		if (this.communication.iMChangedMindWantsSwap) return false;
		return !this.shiftExchange.indisposedMemberPrefersSwapping;
	}
	private iMWantsTakeCPWantsSwap(clickedActionData : ActionData) : boolean {
		if (!this.iMWantsTake) return false;

		const STATE_ENUM = SchedulingApiShiftExchangeCommunicationState;
		if (clickedActionData.nextCommunicationState === STATE_ENUM.CP_WANTS_SWAP) return true;
		if (clickedActionData.nextCommunicationState === STATE_ENUM.SWAP_SUCCESSFUL) return true;
		return false;
	}

	private getPrefMismatchModalContentOptions(clickedActionData : ActionData) : ModalContentOptions | undefined {
		if (!this.rightsService.isMe(this.communication.communicationPartnerId)) return undefined;
		const closeBtnLabel = this.localize.transform('Ok, weitermachen');
		const dismissBtnLabel = this.localize.transform('Abbrechen');

		if (this.noPrefMismatchWarningNeeded(clickedActionData)) return;

		if (this.iMWantsTakeCPWantsSwap(clickedActionData)) {
			const shift = this.shiftExchange.shiftRefs.length > 1 ? this.localize.transform('Schichten') : this.localize.transform('Schicht');
			const description = this.localize.transform('${firstName} möchte die ${shift} nur abgeben, ohne im Gegenzug was zu übernehmen. Willst du ${firstName} trotzdem einen Tausch anbieten?', {
				firstName: this.shiftExchange.indisposedMember!.firstName,
				shift: shift,
			});
			return {
				modalTitle: this.localize.transform('Unterschiedliche Präferenzen'),
				description: description,
				dismissBtnLabel: dismissBtnLabel,
				closeBtnLabel: closeBtnLabel,
			};
		}


		if (this.iMWantsSwapCPWantsTake(clickedActionData)) {
			const shift = this.shiftExchange.shiftRefs.length > 1 ? this.localize.transform('Schichten') : this.localize.transform('Schicht');
			const description = this.localize.transform('${firstName} möchte die ${shift} tauschen, anstatt sie nur abzugeben. Wenn du nicht tauschen möchtest, wird ${firstName} deinem Vorschlag erst zustimmen müssen, damit euer Deal zustande kommt.', {
				firstName: this.shiftExchange.indisposedMember!.firstName,
				shift: shift,
			});
			return {
				modalTitle: this.localize.transform('Unterschiedliche Präferenzen'),
				description: description,
				dismissBtnLabel: dismissBtnLabel,
				closeBtnLabel: closeBtnLabel,
			};
		}
	}

	private get giveUserAHintAboutUnusedSelectedShifts() : boolean {
		if (!this.api.data.shifts.findBy(item => item.selected)) return false;
		if (this.pShiftExchangeService.iAmTheResponsiblePersonForThisIllness(this.shiftExchange)) {
			return false;
		}
		return true;
	}

	public beforeModalClose : (success : () => void) => void = (success : () => void) => {
		if (!this.giveUserAHintAboutUnusedSelectedShifts) {
			success();
			return;
		}
		this.modalService.confirm({
			modalTitle: this.localize.transform('Sicher?'),
			description: this.localize.transform('Du hast Schichten im Kalender selektiert, aber sie nicht der Tauschbörse hinzugefügt.'),
			closeBtnLabel: this.localize.transform('Trotzdem schließen'),
			dismissBtnLabel: this.localize.transform('Zurück'),
		}, {
			success: () => {
				this.api.data.shifts.selectedItems.setSelected(false);
				success();
			},
			theme: PThemeEnum.WARNING,
			size: BootstrapSize.MD,
		});
	};

	private openPerformActionModal(clickedActionData : ActionData) : void {
		this.api.createDataCopy();

		this.communication.performAction = clickedActionData.action;

		const HAS_CALENDAR : boolean = PShiftExchangeCommunicationModalComponent.hasCalendar(clickedActionData);
		const MODAL_SIZE : ModalServiceOptions['size'] = HAS_CALENDAR ? 'fullscreen' : 'lg';

		const successCallback : ModalServiceOptions['success'] = (
			action : SchedulingApiShiftExchangeCommunicationAction | null = null,
		) => {
			let response : ActionData;
			if (action) {
				response = this.pShiftExchangeConceptService.getActionData(action)!;
			} else {
				response = clickedActionData;
			}
			this.onPerformActionModalSuccess.emit(response);
		};

		const dismissCallback : ModalServiceOptions['dismiss'] = () => {
			this.onPerformActionModalDismiss.emit(clickedActionData);
		};

		const pShiftExchangeCommunicationModalComponent =
			this.modalService.openModal(PShiftExchangeCommunicationModalComponent, {
				size: MODAL_SIZE,
				success: successCallback,
				dismiss: dismissCallback,
			}).componentInstance as PShiftExchangeCommunicationModalComponent;

		pShiftExchangeCommunicationModalComponent.initModal(
			this.shiftExchange,
			this.communication,
			clickedActionData,
			this.beforeModalClose,
		);
	}

	/**
	 * User wants to perform action. Open modal with the detail settings for this action if necessary.
	 */
	public onPerformAction(clickedActionData : ActionData) : void {
		const prefMismatchModalContentOptions = this.getPrefMismatchModalContentOptions(clickedActionData);
		if (prefMismatchModalContentOptions) {
			// prefersSwapping of IM and other person don’t match. Give user a hint what the effects will be.
			this.modalService.confirm(
				prefMismatchModalContentOptions,
				{
					success: () => { this.openPerformActionModal(clickedActionData); },
					theme: PThemeEnum.INFO,
					size: BootstrapSize.LG,
				},
			);
			return;
		}

		// What user selected is not a mismatch with the prefersSwapping settings that IM made.
		// So lets go straight to the action-modal
		this.openPerformActionModal(clickedActionData);
	}

	public ngAfterContentInit() : void {
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get lastActionCommentIsDisabled() : boolean {
		return !this.mePerformedLastAction;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get badgeIcon() : FaIconComponent['icon'] | null {
		const icon = this.pShiftExchangeConceptService.getBadgeIcon(this.shiftExchange);
		if (icon) return icon;
		return null;
	}

	public badgeAlign : 'left' | 'right' = 'right';

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showComment() : boolean {
		if (!this.mePerformedLastAction) return !!this.communication.lastActionComment;

		if (!this.showTextarea) return true;
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onStartEditComment() : void {
		if (this.showTextarea) return;
		if (this.lastActionCommentIsDisabled) return;
		this.showTextarea = !this.showTextarea;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public isMe(member : SchedulingApiMember | null) : boolean | null {
		if (!member) return null;
		return this.rightsService.isMe(member.id) ?? null;
	}

}
