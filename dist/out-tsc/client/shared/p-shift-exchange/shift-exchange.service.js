var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { RightsService } from '@plano/shared/api';
import { ShiftId } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { SchedulingApiShiftExchangeShiftRefs } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState, SchedulingApiShiftExchangeCommunicationAction, SchedulingApiShiftExchangeState, SchedulingApiShiftExchangeSwappedShiftRefs, SchedulingApiShiftExchangeCommunicationSwapOffer } from '@plano/shared/api';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { assumeNonNull } from '../../../shared/core/null-type-utils';
import { PRouterService } from '../../../shared/core/router.service';
import { ClientRoutingService } from '../routing.service';
/**
 * Some useful helper methods for shiftExchange related stuff
 */
let PShiftExchangeService = class PShiftExchangeService {
    constructor(api, modalService, datePipe, rightsService, clientRoutingService, schedulingService, pRouterService, activeModal, meService, console, localize) {
        this.api = api;
        this.modalService = modalService;
        this.datePipe = datePipe;
        this.rightsService = rightsService;
        this.clientRoutingService = clientRoutingService;
        this.schedulingService = schedulingService;
        this.pRouterService = pRouterService;
        this.activeModal = activeModal;
        this.meService = meService;
        this.console = console;
        this.localize = localize;
    }
    /**
     * Checks if a shiftExchange can be created for this shift
     * shiftExchanges can not be created for shifts that are part of specific assignmentProcesses
     */
    blockedByAssignmentProcessWarningModal(input) {
        if (!this.api.isLoaded())
            throw new Error('Dont use this while api is not loaded.');
        // User wants to create shiftExchange for shift which is in no process? Go for it!
        const assignmentProcess = this.api.data.assignmentProcesses.findBy(assignmentProcessItem => {
            // Processes with these states don’t matter here
            if (assignmentProcessItem.state === SchedulingApiAssignmentProcessState.EARLY_BIRD_SCHEDULING)
                return false;
            if (assignmentProcessItem.state === SchedulingApiAssignmentProcessState.EARLY_BIRD_FINISHED)
                return false;
            if (input instanceof SchedulingApiShiftExchangeShiftRefs) {
                for (const shiftRef of input.iterable()) {
                    // The assignmentProcessItem does not contain this shiftRef.id? Then continue with the next shiftRef
                    if (!assignmentProcessItem.shiftRefs.contains(shiftRef.id))
                        continue;
                    // The assignmentProcessItem does contain this shiftRef.id? Then this is the assignmentProcess we searched for
                    return true;
                }
                // The assignmentProcessItem does contain any of the provided shiftRefs? Then this is not the searched one
                return false;
            }
            else if (input instanceof ShiftId) {
                // The assignmentProcessItem does not contain the provided ShiftId? Then its not the searched one.
                if (!assignmentProcessItem.shiftRefs.contains(input))
                    return false;
            }
            else {
                throw new TypeError('input type unexpected');
            }
            return true;
        });
        if (!assignmentProcess)
            return false;
        // User wants to create shiftExchange for shift which is part of a assignmentProcess? STOP IT!
        this.modalService.warn({
            modalTitle: this.localize.transform('Vorgang nicht möglich'),
            description: this.localize.transform('Solange sich die Schicht im Verteilungsvorgang »${assignmentProcessName}« befindet, kann sie nicht in die Tauschbörse gestellt werden.', { assignmentProcessName: assignmentProcess.name }),
        });
        return true;
    }
    /**
     * Checks if the selected shifts can be added to the assignmentProcess
     * shifts can not be added to a assignmentProcess if a active shiftExchange exists for it
     */
    blockedByShiftExchangeWarningModal(assignmentProcess, runThisAfterProcessedMethod) {
        if (assignmentProcess.state === SchedulingApiAssignmentProcessState.EARLY_BIRD_SCHEDULING ||
            assignmentProcess.state === SchedulingApiAssignmentProcessState.EARLY_BIRD_FINISHED) {
            runThisAfterProcessedMethod === null || runThisAfterProcessedMethod === void 0 ? void 0 : runThisAfterProcessedMethod();
            return;
        }
        if (!this.api.isLoaded())
            throw new Error('Dont use this while api is not loaded.');
        const shiftsWithActiveShiftExchanges = this.api.data.shifts.filterBy(shiftsItem => {
            if (!shiftsItem.selected)
                return false;
            const shiftExchange = this.api.data.shiftExchanges.findBy(shiftExchangeItem => {
                if (shiftExchangeItem.isClosed)
                    return false;
                if (!shiftExchangeItem.shiftRefs.contains(shiftsItem.id))
                    return false;
                return true;
            });
            if (!shiftExchange)
                return false;
            return true;
        });
        if (!shiftsWithActiveShiftExchanges.length) {
            runThisAfterProcessedMethod === null || runThisAfterProcessedMethod === void 0 ? void 0 : runThisAfterProcessedMethod();
            return;
        }
        let shiftListAsText = '';
        for (const shiftWithActiveShiftExchange of shiftsWithActiveShiftExchanges.iterable()) {
            if (shiftListAsText.length !== 0)
                shiftListAsText += ', ';
            shiftListAsText += this.localize.transform('${name} am ${startDate} um ${startTime}', {
                name: shiftWithActiveShiftExchange.name,
                startDate: this.datePipe.transform(shiftWithActiveShiftExchange.start, 'shortDate'),
                startTime: this.datePipe.transform(shiftWithActiveShiftExchange.start, 'shortTime'),
            });
        }
        let description = '';
        if (shiftsWithActiveShiftExchanges.length > 1) {
            description += this.localize.transform('Folgende Schichten können keinem Verteilungsvorgang hinzugefügt werden, weil sie sich in der Tauschbörse befinden. Entferne bitte zuerst die Schichtbesetzungen, um die Schichten aus der Tauschbörse zu nehmen: ${shiftListAsText}', {
                shiftListAsText: shiftListAsText,
            });
        }
        else {
            description += this.localize.transform('Folgende Schicht kann keinem Verteilungsvorgang hinzugefügt werden, weil sie sich in der Tauschbörse befindet. Entferne bitte zuerst die Schichtbesetzung, um sie aus der Tauschbörse zu nehmen: ${shiftListAsText}', {
                shiftListAsText: shiftListAsText,
            });
        }
        // User wants to add shift to process for which a shiftExchange exists? STOP IT!
        this.modalService.warn({
            modalTitle: this.localize.transform('Vorgang nicht möglich'),
            description: description,
        }, () => {
            if (runThisAfterProcessedMethod)
                runThisAfterProcessedMethod(shiftsWithActiveShiftExchanges);
        });
    }
    indisposedMemberIsAssignedToAllShiftRefs(shiftExchange) {
        const aShiftRefIndisposedMemberIsNotAssignedTo = shiftExchange.shiftRefs.findBy(item => {
            const relatedShift = this.api.data.shifts.get(item.id);
            if (!relatedShift)
                throw new Error('Could not find relatedShift');
            if (relatedShift.assignedMemberIds.contains(shiftExchange.indisposedMemberId))
                return false;
            return true;
        });
        if (aShiftRefIndisposedMemberIsNotAssignedTo)
            return false;
        return true;
    }
    /**
     * Block it if the indisposedMember is not assigned to every of the shiftRefs.
     * This can happen if the shiftExchange has been withdrawn and then the user has been removed from some of the shifts.
     */
    blockedByMissingAssignmentWarningModal(shiftExchange) {
        if (!shiftExchange)
            return null;
        // Imagine a admin has accepted a illness of a member, and wants to re-open it. This should be possible.
        if (this.iAmTheNewResponsiblePersonForThisIllness(shiftExchange))
            return null;
        if (this.indisposedMemberIsAssignedToAllShiftRefs(shiftExchange))
            return null;
        let description = '';
        if (shiftExchange.shiftRefs.length === 1) {
            description = this.localize.transform('Aktuell ist ${firstName} der Schicht nicht zugewiesen.', { firstName: shiftExchange.indisposedMember.firstName });
        }
        else {
            description = this.localize.transform('Aktuell ist ${firstName} mindestens einer der Schichten nicht zugewiesen.', { firstName: shiftExchange.indisposedMember.firstName });
        }
        this.modalService.warn({
            modalTitle: this.localize.transform('Vorgang nicht möglich'),
            description: description,
        });
        return true;
    }
    /**
     * Is it allowed to edit the isIllness flag with the current settings, state and rights?
     */
    isAllowedToEditIsIllness(shiftExchange) {
        if (shiftExchange.isClosed)
            return false;
        if (shiftExchange.behavesAsNewItem)
            return true;
        if (shiftExchange.isIllness)
            return false;
        if (this.rightsService.hasManagerRightsForAllShiftRefs(shiftExchange.shiftRefs) ||
            this.iAmTheIndisposedMember(shiftExchange)) {
            return true;
        }
        return false;
    }
    /**
     * Check if the current user is the indisposedMember of the given shiftExchange
     */
    iAmTheIndisposedMember(shiftExchange) {
        return !!this.rightsService.isMe(shiftExchange.indisposedMemberId);
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    getResponsiblePerson(shiftExchange) {
        if (!shiftExchange.rawData) {
            this.console.error('[PLANO-17825] getResponsiblePerson()');
            return null;
        }
        if (!shiftExchange.isIllness)
            return shiftExchange.indisposedMember;
        const response = shiftExchange.communications.findBy(item => {
            if (item.lastAction === SchedulingApiShiftExchangeCommunicationAction.A_REPORTED_ILLNESS)
                return true;
            if (this.actionIsManagerResponse(item.lastAction))
                return true;
            return false;
        });
        if (response)
            return this.api.data.members.get(response.communicationPartnerId);
        return shiftExchange.indisposedMember;
    }
    iAmTheCreator(shiftExchange) {
        if (!this.meService.isLoaded())
            return false;
        return shiftExchange.indisposedMemberId.equals(this.meService.data.id);
    }
    /**
     * Is Member with provided id the responsiblePerson of this shiftExchange?
     */
    iAmTheResponsiblePersonForThisIllness(shiftExchange) {
        // FIXME: Here comes the refactored version of this method. Im afraid to refactor because its not tested
        // if (!shiftExchange.responsibleMemberId) return undefined;
        // if (!this.rightsService.isMe(shiftExchange.responsibleMemberId)) return false;
        // return true;
        if (shiftExchange.isNewItem())
            return true;
        if (shiftExchange.rawData === undefined || shiftExchange.rawData === null)
            throw new Error('rawData must always be defined here [PLANO-19820]');
        const I_AM_THE_NEW_RESPONSIBLE_PERSON = this.iAmTheNewResponsiblePersonForThisIllness(shiftExchange);
        if (I_AM_THE_NEW_RESPONSIBLE_PERSON)
            return I_AM_THE_NEW_RESPONSIBLE_PERSON;
        if (this.iAmTheIndisposedMember(shiftExchange))
            return true;
        if (this.iAmTheCreator(shiftExchange))
            return true;
        return false;
    }
    /**
     * Is Member with provided id the responsiblePerson of this illness?
     * It returns undefined in case there is no new responsible person (e.g. because its no illness).
     */
    iAmTheNewResponsiblePersonForThisIllness(shiftExchange) {
        if (!shiftExchange.isIllness)
            return null;
        const response = shiftExchange.communications.findBy(item => {
            if (item.lastAction === SchedulingApiShiftExchangeCommunicationAction.A_REPORTED_ILLNESS)
                return true;
            if (this.actionIsManagerResponse(item.lastAction))
                return true;
            return false;
        });
        if (response) {
            if (response.attributeInfoCommunicationPartnerId.value === null)
                return null;
            if (this.rightsService.isMe(response.attributeInfoCommunicationPartnerId.value))
                return true;
            return false;
        }
        return false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    actionIsManagerResponse(action) {
        if (this.actionIsOfTypeA_ACCEPT(action))
            return true;
        if (action === SchedulingApiShiftExchangeCommunicationAction.ILLNESS_NEEDS_CONFIRMATION_A_DECLINED) {
            return true;
        }
        return false;
    }
    /* eslint-disable-next-line @typescript-eslint/naming-convention, jsdoc/require-jsdoc */
    actionIsOfTypeA_ACCEPT(action) {
        if (this.actionIsOfTypeA_ACCEPT_WITH_SHIFT_EXCHANGE(action))
            return true;
        const possibleActions = [
            SchedulingApiShiftExchangeCommunicationAction.ILLNESS_DECLINED_A_ACCEPT_WITHOUT_SHIFT_EXCHANGE,
            SchedulingApiShiftExchangeCommunicationAction.ILLNESS_NEEDS_CONFIRMATION_A_ACCEPT_WITHOUT_SHIFT_EXCHANGE,
        ];
        if (possibleActions.includes(action))
            return true;
        return false;
    }
    /* eslint-disable-next-line @typescript-eslint/naming-convention, jsdoc/require-jsdoc */
    actionIsOfTypeA_ACCEPT_WITH_SHIFT_EXCHANGE(action) {
        const possibleActions = [
            SchedulingApiShiftExchangeCommunicationAction.ILLNESS_DECLINED_A_ACCEPT_WITH_SHIFT_EXCHANGE,
            SchedulingApiShiftExchangeCommunicationAction.ILLNESS_NEEDS_CONFIRMATION_A_ACCEPT_WITH_SHIFT_EXCHANGE,
            SchedulingApiShiftExchangeCommunicationAction.ILLNESS_CONFIRMED_WITHOUT_SHIFT_EXCHANGE_A_START_SHIFT_EXCHANGE,
        ];
        if (possibleActions.includes(action))
            return true;
        return false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    shiftRefsIsDisabled(shiftExchange) {
        if (shiftExchange.attributeInfoIndisposedMemberId.value === null)
            return true;
        // Is new item or behaves as one? don’t disable anything.
        if (shiftExchange.behavesAsNewItem)
            return false;
        // Closed items should never change.
        if (shiftExchange.isClosed)
            return true;
        // Check if user is the indisposedMember.
        if (this.iAmTheIndisposedMember(shiftExchange)) {
            // IM can edit its illness as long as it has not been confirmed.
            if (!shiftExchange.isIllness)
                return false;
            if (shiftExchange.state === SchedulingApiShiftExchangeState.ILLNESS_NEEDS_CONFIRMATION)
                return false;
            if (shiftExchange.state === SchedulingApiShiftExchangeState.ACTIVE)
                return false;
            return true;
        }
        // Managers can always edit
        if (!this.rightsService.hasManagerRightsForAllShiftRefs(shiftExchange.shiftRefs))
            return true;
        // This is not the indisposedMember. this user can edit illnesses if he/she confirmed it
        if (shiftExchange.isIllness && this.iAmTheNewResponsiblePersonForThisIllness(shiftExchange)) {
            return false;
        }
        return true;
    }
    /**
     * Highlight the related shifts in the scheduling view.
     * Nav to the correct time-range if necessary.
     */
    onCalendarBtnClick(shiftRef) {
        const id = shiftRef.id;
        const callback = () => {
            const shifts = this.api.data.shifts.filterBy(item => item.id.equals(id));
            shifts.setSelected(true);
            const firstSelectedShift = shifts.sortedBy('start', false).find(item => item.selected);
            if (firstSelectedShift && !firstSelectedShift.isNewItem())
                this.pRouterService.scrollToSelector(`#scroll-target-id-${firstSelectedShift.id.toPrettyString()}`, undefined, true, true, false);
        };
        if (this.clientRoutingService.currentPage === 0 /* CurrentPageEnum.SCHEDULING */) {
            const shifts = this.api.data.shifts.filterBy(item => item.id.equals(id));
            const shiftCouldBeFound = shifts.setSelected(!shifts.hasSelectedItem);
            if (shiftCouldBeFound) {
                callback();
                return;
            }
        }
        this.schedulingService.afterNavigationCallbacks.push(() => {
            callback();
        });
        this.activeModal.dismiss();
        this.schedulingService.updateQueryParams();
        this.pRouterService.navigate([
            `/client/scheduling/${this.schedulingService.urlParam.calendarMode}` +
                `/${id.start}`,
        ]);
    }
    /**
     * Is there a active search?
     * It does not matter if this search is based on illness or not.
     */
    shiftHasActiveShiftExchangeSearch(shift) {
        for (const shiftExchange of shift.shiftExchanges.iterable()) {
            if (shiftExchange.isClosed)
                continue;
            if (!(shiftExchange.isIllness && !shiftExchange.isBasedOnIllness))
                return true;
        }
        return false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    shiftHasActiveIllness(shift) {
        for (const shiftExchange of shift.shiftExchanges.iterable()) {
            if (shiftExchange.isClosed)
                continue;
            if (shiftExchange.isIllness && !shiftExchange.isBasedOnIllness)
                return true;
        }
        return false;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    offerSelected(offer, shifts) {
        if (!shifts.length)
            return false;
        const shiftRefs = this.getShiftRefs(offer);
        if (!shiftRefs)
            return false;
        if (shifts.length !== shiftRefs.length)
            return false;
        for (const shift of shifts.iterable()) {
            if (shiftRefs.contains(shift.id))
                continue;
            return false;
        }
        return true;
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    offerAffected(offer, shifts) {
        if (!shifts.length)
            return false;
        const shiftRefs = this.getShiftRefs(offer);
        assumeNonNull(shiftRefs);
        for (const shift of shifts.iterable()) {
            if (shiftRefs.contains(shift.id))
                return true;
        }
        return false;
    }
    getShiftRefs(offer = null) {
        if (offer === null)
            return null;
        if (offer instanceof SchedulingApiShiftExchangeCommunicationSwapOffer) {
            return offer.shiftRefs;
        }
        else if (offer instanceof SchedulingApiShiftExchangeShiftRefs ||
            offer instanceof SchedulingApiShiftExchangeSwappedShiftRefs) {
            return offer;
        }
        throw new Error('Unknown type of shiftRefs');
    }
    // eslint-disable-next-line jsdoc/require-jsdoc
    shiftExchangeExistsForShiftAndRequester(shiftId) {
        // TODO: Make Api filter this..
        // Is this shift already related to a shift-exchange?
        const shiftExchangeForThisShift = this.api.data.shiftExchanges.findBy(shiftExchange => {
            if (!shiftExchange.responsibleMemberId)
                return false;
            if (!shiftExchange.shiftRefs.contains(shiftId))
                return false;
            if (!this.rightsService.isMe(shiftExchange.responsibleMemberId))
                return false;
            return true;
        });
        if (!shiftExchangeForThisShift)
            return false;
        return true;
    }
};
PShiftExchangeService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, ModalService,
        PDatePipe, typeof (_b = typeof RightsService !== "undefined" && RightsService) === "function" ? _b : Object, ClientRoutingService, typeof (_c = typeof SchedulingService !== "undefined" && SchedulingService) === "function" ? _c : Object, PRouterService, typeof (_d = typeof NgbActiveModal !== "undefined" && NgbActiveModal) === "function" ? _d : Object, MeService,
        LogService,
        LocalizePipe])
], PShiftExchangeService);
export { PShiftExchangeService };
//# sourceMappingURL=shift-exchange.service.js.map