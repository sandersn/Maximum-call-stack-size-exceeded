var _a, _b, _c, _d, _e, _f, _g;
import { __decorate, __metadata } from "tslib";
import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter, HostBinding } from '@angular/core';
import { BootstrapSize, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { MemberService } from '@plano/client/shared/p-member/p-member.service';
import { PShiftExchangeConceptService } from '@plano/client/shared/p-shift-exchange/p-shift-exchange-concept.service';
import { PShiftExchangeService } from '@plano/client/shared/p-shift-exchange/shift-exchange.service';
import { SchedulingApiShiftExchangeCommunicationState, SchedulingApiShiftExchangeCommunicationRequesterRole } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiShiftExchange, SchedulingApiShiftExchangeCommunication, SchedulingApiShiftExchangeCommunications } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PShiftExchangeCommunicationModalComponent } from './p-shift-exchange-communication-modal/p-shift-exchange-communication-modal.component';
let PShiftExchangeCommunicationComponent = class PShiftExchangeCommunicationComponent {
    constructor(api, pShiftExchangeConceptService, modalService, memberService, console, rightsService, pShiftExchangeService, localize) {
        this.api = api;
        this.pShiftExchangeConceptService = pShiftExchangeConceptService;
        this.modalService = modalService;
        this.memberService = memberService;
        this.console = console;
        this.rightsService = rightsService;
        this.pShiftExchangeService = pShiftExchangeService;
        this.localize = localize;
        this.input = null;
        this.onPerformActionModalSuccess = new EventEmitter();
        this.onPerformActionModalDismiss = new EventEmitter();
        this.CONFIG = Config;
        this.showNames = false;
        this.showTextarea = false;
        this.maxMemberBadgeItems = null;
        this.beforeModalClose = (success) => {
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
        this.badgeAlign = 'right';
        // this.communication.lastAction
        // this.availableActions[0].action
        // SchedulingApiShiftExchangeCommunicationAction
        // this.pShiftExchangeConceptService.getActionText()
    }
    get _isMuted() {
        if (!this.shiftExchange.isClosed)
            return false;
        if (this.availableActionDataArray.length)
            return false;
        return true;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get communications() {
        if (this.input && this.input instanceof SchedulingApiShiftExchangeCommunications) {
            return this.input.sortedBy([
                item => item.communicationPartner.lastName,
                item => item.communicationPartner.firstName,
            ], false);
        }
        return undefined;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get communication() {
        if (this.input && this.input instanceof SchedulingApiShiftExchangeCommunication)
            return this.input;
        return this.communications.get(0);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showLastActionTime() {
        switch (this.communication.communicationState) {
            case SchedulingApiShiftExchangeCommunicationState.CP_NOT_RESPONDED:
            case SchedulingApiShiftExchangeCommunicationState.ILLNESS_NEEDS_CONFIRMATION:
                return false;
            default:
                return !!this.communication.lastActionTime;
        }
    }
    get isMyCommunication() {
        return !!this.rightsService.isMe(this.communication.communicationPartnerId);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get mePerformedLastAction() {
        const lastActionData = this.pShiftExchangeConceptService.getActionData(this.communication.lastAction);
        return lastActionData.requesterRole === this.communication.requesterRole;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get indisposedMemberPerformedLastAction() {
        const actionData = this.pShiftExchangeConceptService.getActionData(this.communication.lastAction);
        return actionData.requesterRole === SchedulingApiShiftExchangeCommunicationRequesterRole.IM;
    }
    get iAmTheCreator() {
        return !!this.rightsService.isMe(this.shiftExchange.indisposedMemberId);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get availableActionDataArray() {
        if (!this.iAmTheCreator && !this.isMyCommunication)
            return [];
        const availableActions = this.pShiftExchangeConceptService.getAvailableActions(this.shiftExchange, this.communication);
        const sortingPriorities = [
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
                if (!iconA)
                    this.console.debug('iconA could not be found', iconA);
                if (!iconB)
                    this.console.debug('iconB could not be found', iconB);
            }
            const prioA = sortingPriorities.indexOf(iconA);
            const prioB = sortingPriorities.indexOf(iconB);
            if (Config.DEBUG) {
                if (!iconA)
                    this.console.debug('iconA could not be found', iconA);
                if (!iconB)
                    this.console.debug('iconB could not be found', iconB);
                if (!prioA)
                    this.console.debug('iconA could not be found', prioA);
                if (!prioB)
                    this.console.debug('iconB could not be found', prioB);
            }
            return prioA - prioB;
        });
    }
    /**
     * Get the action text for a given available action
     * Use this as label for the action button
     */
    availableActionText(availableAction, shiftExchange) {
        return this.pShiftExchangeConceptService.getActionText(availableAction, shiftExchange);
    }
    /**
     * Get the icon for a given available action
     * Use this as icon for the action button
     */
    availableActionIcon(availableAction) {
        return this.pShiftExchangeConceptService.getActionIcon(availableAction);
    }
    /**
     * Get the color for a given available action
     * Use this as color for the action button icon
     */
    availableActionIconStyle(availableAction) {
        return this.pShiftExchangeConceptService.getActionIconStyle(availableAction);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get needsReview() {
        if (this.needsReviewLabel)
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get needsReviewLabel() {
        let memberThatNeedsToReply = null;
        if (this.pShiftExchangeConceptService.needsReviewByIM(this.shiftExchange.requesterRelationship, this.communication.communicationState))
            memberThatNeedsToReply = this.shiftExchange.indisposedMember;
        if (this.pShiftExchangeConceptService.needsReviewByCP(this.shiftExchange.requesterRelationship, this.communication.communicationState))
            memberThatNeedsToReply = this.communication.communicationPartner;
        if (!memberThatNeedsToReply)
            return undefined;
        let text = '';
        if (this.rightsService.isMe(memberThatNeedsToReply)) {
            text += 'Deine';
        }
        else {
            text += this.memberService.makeNameGenitive(memberThatNeedsToReply.firstName);
        }
        text += ' Bestätigung nötig';
        return text;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get lastActionStateText() {
        return this.pShiftExchangeConceptService.getActionStateText(this.shiftExchange, this.communication, this.communication.lastAction);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get stateTheme() {
        return this.pShiftExchangeConceptService.getCommunicationStateStyle(this.communication.communicationState, this.communication.lastAction);
    }
    /**
     * In some exceptions we don’t need a warning-modal.
     */
    noPrefMismatchWarningNeeded(clickedActionData) {
        switch (clickedActionData.prevCommunicationState) {
            case SchedulingApiShiftExchangeCommunicationState.IM_CHANGED_MIND_WANTS_SWAP: // IM declined CP's offer but changed mind later?
            case clickedActionData.nextCommunicationState: // CP edits existing offer?
                return true;
            default:
                return false;
        }
    }
    get iMWantsSwap() {
        if (this.communication.iMChangedMindWantsSwap)
            return true;
        if (this.communication.iMChangedMindWantsTake)
            return false;
        return this.shiftExchange.indisposedMemberPrefersSwapping;
    }
    iMWantsSwapCPWantsTake(clickedActionData) {
        if (!this.iMWantsSwap)
            return false;
        const STATE_ENUM = SchedulingApiShiftExchangeCommunicationState;
        if (clickedActionData.nextCommunicationState === STATE_ENUM.CP_WANTS_TAKE)
            return true;
        if (clickedActionData.nextCommunicationState === STATE_ENUM.TAKE_SUCCESSFUL)
            return true;
        return false;
    }
    get iMWantsTake() {
        if (this.communication.iMChangedMindWantsTake)
            return true;
        if (this.communication.iMChangedMindWantsSwap)
            return false;
        return !this.shiftExchange.indisposedMemberPrefersSwapping;
    }
    iMWantsTakeCPWantsSwap(clickedActionData) {
        if (!this.iMWantsTake)
            return false;
        const STATE_ENUM = SchedulingApiShiftExchangeCommunicationState;
        if (clickedActionData.nextCommunicationState === STATE_ENUM.CP_WANTS_SWAP)
            return true;
        if (clickedActionData.nextCommunicationState === STATE_ENUM.SWAP_SUCCESSFUL)
            return true;
        return false;
    }
    getPrefMismatchModalContentOptions(clickedActionData) {
        if (!this.rightsService.isMe(this.communication.communicationPartnerId))
            return undefined;
        const closeBtnLabel = this.localize.transform('Ok, weitermachen');
        const dismissBtnLabel = this.localize.transform('Abbrechen');
        if (this.noPrefMismatchWarningNeeded(clickedActionData))
            return;
        if (this.iMWantsTakeCPWantsSwap(clickedActionData)) {
            const shift = this.shiftExchange.shiftRefs.length > 1 ? this.localize.transform('Schichten') : this.localize.transform('Schicht');
            const description = this.localize.transform('${firstName} möchte die ${shift} nur abgeben, ohne im Gegenzug was zu übernehmen. Willst du ${firstName} trotzdem einen Tausch anbieten?', {
                firstName: this.shiftExchange.indisposedMember.firstName,
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
                firstName: this.shiftExchange.indisposedMember.firstName,
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
    get giveUserAHintAboutUnusedSelectedShifts() {
        if (!this.api.data.shifts.findBy(item => item.selected))
            return false;
        if (this.pShiftExchangeService.iAmTheResponsiblePersonForThisIllness(this.shiftExchange)) {
            return false;
        }
        return true;
    }
    openPerformActionModal(clickedActionData) {
        this.api.createDataCopy();
        this.communication.performAction = clickedActionData.action;
        const HAS_CALENDAR = PShiftExchangeCommunicationModalComponent.hasCalendar(clickedActionData);
        const MODAL_SIZE = HAS_CALENDAR ? 'fullscreen' : 'lg';
        const successCallback = (action = null) => {
            let response;
            if (action) {
                response = this.pShiftExchangeConceptService.getActionData(action);
            }
            else {
                response = clickedActionData;
            }
            this.onPerformActionModalSuccess.emit(response);
        };
        const dismissCallback = () => {
            this.onPerformActionModalDismiss.emit(clickedActionData);
        };
        const pShiftExchangeCommunicationModalComponent = this.modalService.openModal(PShiftExchangeCommunicationModalComponent, {
            size: MODAL_SIZE,
            success: successCallback,
            dismiss: dismissCallback,
        }).componentInstance;
        pShiftExchangeCommunicationModalComponent.initModal(this.shiftExchange, this.communication, clickedActionData, this.beforeModalClose);
    }
    /**
     * User wants to perform action. Open modal with the detail settings for this action if necessary.
     */
    onPerformAction(clickedActionData) {
        const prefMismatchModalContentOptions = this.getPrefMismatchModalContentOptions(clickedActionData);
        if (prefMismatchModalContentOptions) {
            // prefersSwapping of IM and other person don’t match. Give user a hint what the effects will be.
            this.modalService.confirm(prefMismatchModalContentOptions, {
                success: () => { this.openPerformActionModal(clickedActionData); },
                theme: PThemeEnum.INFO,
                size: BootstrapSize.LG,
            });
            return;
        }
        // What user selected is not a mismatch with the prefersSwapping settings that IM made.
        // So lets go straight to the action-modal
        this.openPerformActionModal(clickedActionData);
    }
    ngAfterContentInit() {
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get lastActionCommentIsDisabled() {
        return !this.mePerformedLastAction;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get badgeIcon() {
        const icon = this.pShiftExchangeConceptService.getBadgeIcon(this.shiftExchange);
        if (icon)
            return icon;
        return null;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showComment() {
        if (!this.mePerformedLastAction)
            return !!this.communication.lastActionComment;
        if (!this.showTextarea)
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onStartEditComment() {
        if (this.showTextarea)
            return;
        if (this.lastActionCommentIsDisabled)
            return;
        this.showTextarea = !this.showTextarea;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    isMe(member) {
        var _a;
        if (!member)
            return null;
        return (_a = this.rightsService.isMe(member.id)) !== null && _a !== void 0 ? _a : null;
    }
};
__decorate([
    Input(),
    __metadata("design:type", typeof (_c = typeof SchedulingApiShiftExchange !== "undefined" && SchedulingApiShiftExchange) === "function" ? _c : Object)
], PShiftExchangeCommunicationComponent.prototype, "shiftExchange", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], PShiftExchangeCommunicationComponent.prototype, "input", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_f = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _f : Object)
], PShiftExchangeCommunicationComponent.prototype, "onPerformActionModalSuccess", void 0);
__decorate([
    Output(),
    __metadata("design:type", typeof (_g = typeof EventEmitter !== "undefined" && EventEmitter) === "function" ? _g : Object)
], PShiftExchangeCommunicationComponent.prototype, "onPerformActionModalDismiss", void 0);
__decorate([
    HostBinding('class.muted-item'),
    __metadata("design:type", Boolean),
    __metadata("design:paramtypes", [])
], PShiftExchangeCommunicationComponent.prototype, "_isMuted", null);
PShiftExchangeCommunicationComponent = __decorate([
    Component({
        selector: 'p-shift-exchange-communication[shiftExchange]',
        templateUrl: './p-shift-exchange-communication.component.html',
        styleUrls: ['./p-shift-exchange-communication.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, PShiftExchangeConceptService,
        ModalService,
        MemberService,
        LogService, typeof (_b = typeof RightsService !== "undefined" && RightsService) === "function" ? _b : Object, PShiftExchangeService,
        LocalizePipe])
], PShiftExchangeCommunicationComponent);
export { PShiftExchangeCommunicationComponent };
//# sourceMappingURL=p-shift-exchange-communication.component.js.map