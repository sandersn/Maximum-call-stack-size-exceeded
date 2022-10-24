import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { ShiftExchangeConceptServiceBase } from '@plano/shared/api';
import { SchedulingApiShiftExchangeCommunicationAction, SchedulingApiShiftExchangeCommunicationState, SchedulingApiShiftExchangeRequesterRelationship } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PActionData } from './p-action-data';
import { PCommunicationData } from './p-communication-data';
import { PStateData } from './p-state-data';
import { PShiftExchangeService } from './shift-exchange.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../shared/core/null-type-utils';
import { PThemeEnum } from '../bootstrap-styles.enum';
let PShiftExchangeConceptService = class PShiftExchangeConceptService extends ShiftExchangeConceptServiceBase {
    constructor(meService, console, pShiftExchangeService, localize) {
        super();
        this.meService = meService;
        this.console = console;
        this.pShiftExchangeService = pShiftExchangeService;
        this.localize = localize;
        this.stateData = new PStateData(localize);
        this.communicationData = new PCommunicationData(localize);
        this.actionTexts = new PActionData(localize);
    }
    /**
     * Defines the bootstrap based color/design of that ui item.
     */
    getStateStyle(input) {
        var _a;
        return (_a = this.stateData.getStateStyle(input)) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Human readable State-Text.
     */
    getStateText(shiftExchange) {
        const text = this.stateData.getStateText(shiftExchange);
        return this.replaceTemplateMarkers(text, shiftExchange);
    }
    /**
     * Defines what text is shown on the action button
     */
    getActionText(action, shiftExchange) {
        const text = this.actionTexts.getText(action, shiftExchange);
        return this.replaceTemplateMarkers(text, shiftExchange);
    }
    /**
     * Defines what icon is shown on the action button
     */
    getActionIcon(action) {
        return this.actionTexts.getIcon(action);
    }
    /**
     * Defines what icon is shown on the action button
     */
    getActionIconStyle(action) {
        if (!action)
            return undefined;
        return this.actionTexts.getIconStyle(action);
    }
    /**
     * Icon for the button-badge. Gives the user some more info where he/she needs to do get things done.
     */
    getBadgeIcon(input) {
        try {
            return this.stateData.getBadgeIcon(input);
        }
        catch (error) {
            this.console.error(error);
            return null;
        }
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    isSomeKindOfIllnessState(state) {
        switch (state) {
            case SchedulingApiShiftExchangeCommunicationState.ILLNESS_CONFIRMED:
            case SchedulingApiShiftExchangeCommunicationState.ILLNESS_DECLINED:
            case SchedulingApiShiftExchangeCommunicationState.ILLNESS_NEEDS_CONFIRMATION:
            case SchedulingApiShiftExchangeCommunicationState.ILLNESS_CONFIRMED_WITHOUT_SHIFT_EXCHANGE:
                return true;
            default:
                return false;
        }
    }
    /**
     * Check if this kind of communication needs a confirmation by
     * the communication partner to whom "the ball has been passed"
     */
    needsReviewByCP(requesterRelationship, communicationState) {
        switch (communicationState) {
            case SchedulingApiShiftExchangeCommunicationState.IM_CHANGED_MIND_WANTS_SWAP:
                return requesterRelationship !== SchedulingApiShiftExchangeRequesterRelationship.CP;
            case SchedulingApiShiftExchangeCommunicationState.IM_CHANGED_MIND_WANTS_TAKE:
                return requesterRelationship !== SchedulingApiShiftExchangeRequesterRelationship.CP;
            default:
                return false;
        }
    }
    /**
     * Check if this kind of communication needs a confirmation by
     * the IM to whom "the ball has been passed" back
     */
    needsReviewByIM(requesterRelationship, communicationState) {
        switch (communicationState) {
            case SchedulingApiShiftExchangeCommunicationState.CP_WANTS_SWAP:
                return requesterRelationship !== SchedulingApiShiftExchangeRequesterRelationship.IM;
            case SchedulingApiShiftExchangeCommunicationState.CP_WANTS_TAKE:
                return requesterRelationship !== SchedulingApiShiftExchangeRequesterRelationship.IM;
            default:
                return false;
        }
    }
    /**
     * Defines the bootstrap based color/design of that ui item.
     */
    getCommunicationStateStyle(communicationState, lastAction) {
        return this.styleForCommunicationState(communicationState, lastAction);
    }
    styleForCommunicationState(state, lastAction) {
        switch (state) {
            case SchedulingApiShiftExchangeCommunicationState.CP_NOT_RESPONDED:
                this.getActionIconStyle();
                // eslint-disable-next-line sonarjs/no-nested-switch
                switch (lastAction) {
                    case SchedulingApiShiftExchangeCommunicationAction.CP_IS_ILL:
                    case SchedulingApiShiftExchangeCommunicationAction.CP_IS_ABSENT:
                    case SchedulingApiShiftExchangeCommunicationAction.CP_ASSIGNED_SAME_SHIFT:
                    case SchedulingApiShiftExchangeCommunicationAction.CP_ASSIGNED_SAME_TIME:
                        return PThemeEnum.SECONDARY;
                    default:
                        return PThemeEnum.WARNING;
                }
            case SchedulingApiShiftExchangeCommunicationState.IM_DECLINED_SWAP:
            case SchedulingApiShiftExchangeCommunicationState.IM_DECLINED_TAKE:
            case SchedulingApiShiftExchangeCommunicationState.CP_RESPONDED_NO:
            case SchedulingApiShiftExchangeCommunicationState.CP_CANNOT_SHIFT_EXCHANGE:
                return PThemeEnum.SECONDARY;
            case SchedulingApiShiftExchangeCommunicationState.CP_WANTS_SWAP:
            case SchedulingApiShiftExchangeCommunicationState.CP_WANTS_TAKE:
            case SchedulingApiShiftExchangeCommunicationState.IM_CHANGED_MIND_WANTS_SWAP:
            case SchedulingApiShiftExchangeCommunicationState.IM_CHANGED_MIND_WANTS_TAKE:
            case SchedulingApiShiftExchangeCommunicationState.ILLNESS_NEEDS_CONFIRMATION:
                return PThemeEnum.WARNING;
            case SchedulingApiShiftExchangeCommunicationState.ILLNESS_CONFIRMED:
            case SchedulingApiShiftExchangeCommunicationState.ILLNESS_CONFIRMED_WITHOUT_SHIFT_EXCHANGE:
            case SchedulingApiShiftExchangeCommunicationState.SWAP_SUCCESSFUL:
            case SchedulingApiShiftExchangeCommunicationState.TAKE_SUCCESSFUL:
                return PThemeEnum.SUCCESS;
            case SchedulingApiShiftExchangeCommunicationState.ILLNESS_DECLINED:
                return PThemeEnum.DANGER;
            default:
                throw new Error('unsupported enum value');
        }
    }
    /**
     * Human readable State-Text.
     */
    getActionStateText(shiftExchange, communication, action) {
        const text = this.communicationData.getStateText(action);
        return this.replaceTemplateMarkers(text, shiftExchange, communication);
    }
    getResponsiblePerson(shiftExchangeObject) {
        return this.pShiftExchangeService.getResponsiblePerson(shiftExchangeObject);
    }
    userIsResponsiblePerson(shiftExchangeObject) {
        const responsiblePerson = this.getResponsiblePerson(shiftExchangeObject);
        return responsiblePerson ? responsiblePerson.id.equals(this.meService.data.id) : null;
    }
    /**
     * Replace text markers like ${IM_OFFERED_SHIFTS} with the correct calculated text.
     */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    replaceTemplateMarkers(text = null, shiftExchangeObject, communication) {
        if (text === null)
            return null;
        let result = text;
        const userIsIndisposedMember = this.meService.data.id.equals(shiftExchangeObject.indisposedMemberId);
        result = this.replace(result, /\${INDISPOSED_MEMBER_FIRST_NAME}/, () => {
            if (userIsIndisposedMember)
                return this.localize.transform('Du');
            return shiftExchangeObject.indisposedMember.firstName;
        });
        result = this.replace(result, /\${RESPONSIBLE_PERSON_FIRST_NAME}/, () => {
            assumeDefinedToGetStrictNullChecksRunning(shiftExchangeObject, 'shiftExchangeObject');
            const responsiblePerson = this.getResponsiblePerson(shiftExchangeObject);
            const userIsResponsiblePerson = this.userIsResponsiblePerson(shiftExchangeObject);
            if (responsiblePerson === null)
                return 'ERROR';
            if (userIsResponsiblePerson)
                return this.localize.transform('Du');
            return responsiblePerson.firstName;
        });
        result = this.replace(result, /\${RESPONSIBLE_PERSON_WAITS}/, () => {
            const userIsResponsiblePerson = this.userIsResponsiblePerson(shiftExchangeObject);
            if (userIsResponsiblePerson)
                return this.localize.transform('wartest');
            return this.localize.transform('wartet');
        });
        result = this.replace(result, /\${C_HAS}/, () => {
            if (userIsIndisposedMember)
                return this.localize.transform('hast');
            return this.localize.transform('hat');
        });
        result = this.replace(result, /\${C_WAITS}/, () => {
            if (userIsIndisposedMember)
                return this.localize.transform('wartest');
            return this.localize.transform('wartet');
        });
        result = this.replace(result, /\${C_WANTS}/, () => {
            if (userIsIndisposedMember)
                return this.localize.transform('willst');
            return this.localize.transform('will');
        });
        result = this.replace(result, /\${IM_OFFERED_SHIFTS}/, () => {
            if (shiftExchangeObject.shiftRefs.length === 1) {
                return this.localize.transform('Schicht');
            }
            return this.localize.transform('Schichten');
        });
        if (communication) {
            const userIsCommunicationPartner = this.meService.data.id.equals(communication.communicationPartnerId);
            result = this.replace(result, /\${CP_FIRST_NAME}/, () => {
                if (userIsCommunicationPartner)
                    return this.localize.transform('Du');
                return communication.communicationPartner.firstName;
            });
            if (userIsCommunicationPartner &&
                communication.communicationState === SchedulingApiShiftExchangeCommunicationState.CP_NOT_RESPONDED) {
                const userIsResponsiblePerson = this.userIsResponsiblePerson(shiftExchangeObject);
                if (userIsResponsiblePerson)
                    result = this.localize.transform('Bitte antworten');
            }
            result = this.replace(result, /\${CP_HAS}/, () => {
                if (userIsCommunicationPartner)
                    return this.localize.transform('hast');
                return this.localize.transform('hat');
            });
            result = this.replace(result, /\${CP_SEEKS}/, () => {
                if (userIsCommunicationPartner)
                    return this.localize.transform('suchst');
                return this.localize.transform('sucht');
            });
            result = this.replace(result, /\${CP_IS}/, () => {
                if (userIsCommunicationPartner)
                    return this.localize.transform('bist');
                return this.localize.transform('ist');
            });
            result = this.replace(result, /\${CP_WANTS}/, () => {
                if (userIsCommunicationPartner)
                    return this.localize.transform('willst');
                return this.localize.transform('will');
            });
            result = this.replace(result, /\${CP_IS_WORKING}/, () => {
                if (userIsCommunicationPartner)
                    return this.localize.transform('arbeitest');
                return this.localize.transform('arbeitet');
            });
        }
        if (this.containsMarkers(result)) {
            this.console.error(`replaceTemplateMarkers() could not replace all markers: ${result}`);
        }
        if (this.containsErrors(result)) {
            this.console.error(`replaceTemplateMarkers() result contains errors: ${result}`);
        }
        result = result.charAt(0).toUpperCase() + result.slice(1);
        return result;
    }
    containsMarkers(input) {
        const markers = input.match(/#[\dA-Z]*#/g);
        return !!markers && markers.length > 0;
    }
    containsErrors(input) {
        const markers = input.match(/ERROR/g);
        return !!markers && markers.length > 0;
    }
    replace(text, regex, replacer) {
        const replaceableString = new RegExp(regex);
        if (!text.match(replaceableString))
            return text;
        return text.replace(replaceableString, replacer());
    }
};
PShiftExchangeConceptService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [MeService,
        LogService,
        PShiftExchangeService,
        LocalizePipe])
], PShiftExchangeConceptService);
export { PShiftExchangeConceptService };
//# sourceMappingURL=p-shift-exchange-concept.service.js.map