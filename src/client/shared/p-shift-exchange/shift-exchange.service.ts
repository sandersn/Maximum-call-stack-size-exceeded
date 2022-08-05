import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Injectable } from '@angular/core';
import { SchedulingService } from '@plano/client/scheduling/scheduling.service';
import { SchedulingApiShiftExchangeShiftRef, SchedulingApiShiftExchangeSwappedShiftRef } from '@plano/shared/api';
import { SchedulingApiAssignmentProcess, SchedulingApiShifts, SchedulingApiShift, SchedulingApiMember } from '@plano/shared/api';
import { SchedulingApiShiftExchange, SchedulingApiShiftExchangeCommunications, SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefs } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { ShiftId } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { SchedulingApiShiftExchangeShiftRefs } from '@plano/shared/api';
import { SchedulingApiAssignmentProcessState, SchedulingApiShiftExchangeCommunicationAction, SchedulingApiShiftExchangeState, SchedulingApiShiftExchangeSwappedShiftRefs, SchedulingApiShiftExchangeCommunicationSwapOffer } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { assumeNonNull } from '../../../shared/core/null-type-utils';
import { PRouterService } from '../../../shared/core/router.service';
import { ScrollTarget } from '../../../shared/core/router.service';
import { PossibleShiftPickerValueType } from '../p-shift-picker/shift-picker-picked-offers/shift-picker-picked-offers.component';
import { ClientRoutingService, CurrentPageEnum } from '../routing.service';

/**
 * Some useful helper methods for shiftExchange related stuff
 */

@Injectable()
export class PShiftExchangeService {
	constructor(
		private api : SchedulingApiService,
		private modalService : ModalService,
		private datePipe : PDatePipe,
		private rightsService : RightsService,
		public clientRoutingService : ClientRoutingService,
		private schedulingService : SchedulingService,
		private pRouterService : PRouterService,
		private activeModal : NgbActiveModal,
		private meService : MeService,
		private console : LogService,
		private localize : LocalizePipe,
	) {
	}

	/**
	 * Checks if a shiftExchange can be created for this shift
	 * shiftExchanges can not be created for shifts that are part of specific assignmentProcesses
	 */
	public blockedByAssignmentProcessWarningModal(
		input : ShiftId | SchedulingApiShiftExchangeShiftRefs,
	) : boolean {
		if (!this.api.isLoaded()) throw new Error('Dont use this while api is not loaded.');
		// User wants to create shiftExchange for shift which is in no process? Go for it!
		const assignmentProcess = this.api.data.assignmentProcesses.findBy(assignmentProcessItem => {
			// Processes with these states don’t matter here
			if (assignmentProcessItem.state === SchedulingApiAssignmentProcessState.EARLY_BIRD_SCHEDULING) return false;
			if (assignmentProcessItem.state === SchedulingApiAssignmentProcessState.EARLY_BIRD_FINISHED) return false;

			if (input instanceof SchedulingApiShiftExchangeShiftRefs) {
				for (const shiftRef of input.iterable()) {
					// The assignmentProcessItem does not contain this shiftRef.id? Then continue with the next shiftRef
					if (!assignmentProcessItem.shiftRefs.contains(shiftRef.id)) continue;
					// The assignmentProcessItem does contain this shiftRef.id? Then this is the assignmentProcess we searched for
					return true;
				}
				// The assignmentProcessItem does contain any of the provided shiftRefs? Then this is not the searched one
				return false;
			} else if (input instanceof ShiftId) {
				// The assignmentProcessItem does not contain the provided ShiftId? Then its not the searched one.
				if (!assignmentProcessItem.shiftRefs.contains(input)) return false;
			} else {
				throw new TypeError('input type unexpected');
			}
			return true;
		});
		if (!assignmentProcess) return false;
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
	public blockedByShiftExchangeWarningModal(
		assignmentProcess : SchedulingApiAssignmentProcess,
		runThisAfterProcessedMethod ?: ( shiftsThatShouldBeSkipped ?: SchedulingApiShifts ) => void,
	) : void {
		if (
			assignmentProcess.state === SchedulingApiAssignmentProcessState.EARLY_BIRD_SCHEDULING ||
			assignmentProcess.state === SchedulingApiAssignmentProcessState.EARLY_BIRD_FINISHED
		) {
			runThisAfterProcessedMethod?.();
			return;
		}

		if (!this.api.isLoaded()) throw new Error('Dont use this while api is not loaded.');
		const shiftsWithActiveShiftExchanges = this.api.data.shifts.filterBy(shiftsItem => {
			if (!shiftsItem.selected) return false;

			const shiftExchange = this.api.data.shiftExchanges.findBy(shiftExchangeItem => {
				if (shiftExchangeItem.isClosed) return false;
				if (!shiftExchangeItem.shiftRefs.contains(shiftsItem.id)) return false;
				return true;
			});
			if (!shiftExchange) return false;
			return true;
		});
		if (!shiftsWithActiveShiftExchanges.length) {
			runThisAfterProcessedMethod?.();
			return;
		}

		let shiftListAsText : string = '';
		for (const shiftWithActiveShiftExchange of shiftsWithActiveShiftExchanges.iterable()) {
			if (shiftListAsText.length !== 0) shiftListAsText += ', ';
			shiftListAsText += this.localize.transform('${name} am ${startDate} um ${startTime}', {
				name: shiftWithActiveShiftExchange.name,
				startDate: this.datePipe.transform(shiftWithActiveShiftExchange.start, 'shortDate'),
				startTime: this.datePipe.transform(shiftWithActiveShiftExchange.start, 'shortTime'),
			});
		}

		let description : string = '';
		if (shiftsWithActiveShiftExchanges.length > 1) {
			description += this.localize.transform('Folgende Schichten können keinem Verteilungsvorgang hinzugefügt werden, weil sie sich in der Tauschbörse befinden. Entferne bitte zuerst die Schichtbesetzungen, um die Schichten aus der Tauschbörse zu nehmen: ${shiftListAsText}', {
				shiftListAsText: shiftListAsText,
			});
		} else {
			description += this.localize.transform('Folgende Schicht kann keinem Verteilungsvorgang hinzugefügt werden, weil sie sich in der Tauschbörse befindet. Entferne bitte zuerst die Schichtbesetzung, um sie aus der Tauschbörse zu nehmen: ${shiftListAsText}', {
				shiftListAsText: shiftListAsText,
			});
		}
		// User wants to add shift to process for which a shiftExchange exists? STOP IT!
		this.modalService.warn(
			{
				modalTitle: this.localize.transform('Vorgang nicht möglich'),
				description: description,
			},
			() => {
				if (runThisAfterProcessedMethod) runThisAfterProcessedMethod(shiftsWithActiveShiftExchanges);
			},
		);
	}

	private indisposedMemberIsAssignedToAllShiftRefs(
		shiftExchange : SchedulingApiShiftExchange,
	) : boolean {
		const aShiftRefIndisposedMemberIsNotAssignedTo = shiftExchange.shiftRefs.findBy(item => {
			const relatedShift = this.api.data.shifts.get(item.id);
			if (!relatedShift) throw new Error('Could not find relatedShift');
			if (relatedShift.assignedMemberIds.contains(shiftExchange.indisposedMemberId)) return false;
			return true;
		});
		if (aShiftRefIndisposedMemberIsNotAssignedTo) return false;
		return true;
	}


	/**
	 * Block it if the indisposedMember is not assigned to every of the shiftRefs.
	 * This can happen if the shiftExchange has been withdrawn and then the user has been removed from some of the shifts.
	 */
	public blockedByMissingAssignmentWarningModal(
		shiftExchange : SchedulingApiShiftExchange | null,
	) : boolean | null {
		if (!shiftExchange) return null;

		// Imagine a admin has accepted a illness of a member, and wants to re-open it. This should be possible.
		if (this.iAmTheNewResponsiblePersonForThisIllness(shiftExchange)) return null;

		if (this.indisposedMemberIsAssignedToAllShiftRefs(shiftExchange)) return null;

		let description : string = '';
		if (shiftExchange.shiftRefs.length === 1) {
			description = this.localize.transform('Aktuell ist ${firstName} der Schicht nicht zugewiesen.', { firstName: shiftExchange.indisposedMember!.firstName });
		} else {
			description = this.localize.transform('Aktuell ist ${firstName} mindestens einer der Schichten nicht zugewiesen.', { firstName: shiftExchange.indisposedMember!.firstName });
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
	public isAllowedToEditIsIllness(shiftExchange : SchedulingApiShiftExchange) : boolean {
		if (shiftExchange.isClosed) return false;
		if (shiftExchange.behavesAsNewItem) return true;
		if (shiftExchange.isIllness) return false;

		if (
			this.rightsService.hasManagerRightsForAllShiftRefs(shiftExchange.shiftRefs) ||
			this.iAmTheIndisposedMember(shiftExchange)
		) {
			return true;
		}

		return false;
	}

	/**
	 * Check if the current user is the indisposedMember of the given shiftExchange
	 */
	public iAmTheIndisposedMember(shiftExchange : { indisposedMemberId : Id }) : boolean {
		return !!this.rightsService.isMe(shiftExchange.indisposedMemberId);
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public getResponsiblePerson(shiftExchange : Pick<SchedulingApiShiftExchange, 'isIllness' | 'indisposedMember' | 'indisposedMemberId' |  'communications' | 'rawData'>) : SchedulingApiMember | null {
		if (!shiftExchange.rawData) { this.console.error('[PLANO-17825] getResponsiblePerson()'); return null; }
		if (!shiftExchange.isIllness) return shiftExchange.indisposedMember;
		const response = shiftExchange.communications.findBy(item => {
			if (item.lastAction === SchedulingApiShiftExchangeCommunicationAction.A_REPORTED_ILLNESS) return true;
			if (this.actionIsManagerResponse(item.lastAction)) return true;
			return false;
		});
		if (response) return this.api.data.members.get(response.communicationPartnerId);
		return shiftExchange.indisposedMember;
	}

	private iAmTheCreator(shiftExchange : {
		indisposedMemberId : Id,
		communications : SchedulingApiShiftExchangeCommunications,
	}) : boolean {
		if (!this.meService.isLoaded()) return false;
		return shiftExchange.indisposedMemberId.equals(this.meService.data.id);
	}

	/**
	 * Is Member with provided id the responsiblePerson of this shiftExchange?
	 */
	public iAmTheResponsiblePersonForThisIllness(shiftExchange : SchedulingApiShiftExchange) : boolean {

		// FIXME: Here comes the refactored version of this method. Im afraid to refactor because its not tested
		// if (!shiftExchange.responsibleMemberId) return undefined;
		// if (!this.rightsService.isMe(shiftExchange.responsibleMemberId)) return false;
		// return true;

		if (shiftExchange.isNewItem()) return true;
		if (shiftExchange.rawData === undefined || shiftExchange.rawData === null) throw new Error('rawData must always be defined here [PLANO-19820]');
		const I_AM_THE_NEW_RESPONSIBLE_PERSON = this.iAmTheNewResponsiblePersonForThisIllness(shiftExchange);
		if (I_AM_THE_NEW_RESPONSIBLE_PERSON) return I_AM_THE_NEW_RESPONSIBLE_PERSON;
		if (this.iAmTheIndisposedMember(shiftExchange)) return true;
		if (this.iAmTheCreator(shiftExchange)) return true;
		return false;
	}

	/**
	 * Is Member with provided id the responsiblePerson of this illness?
	 * It returns undefined in case there is no new responsible person (e.g. because its no illness).
	 */
	public iAmTheNewResponsiblePersonForThisIllness(shiftExchange : SchedulingApiShiftExchange) : boolean | null {
		if (!shiftExchange.isIllness) return null;
		const response = shiftExchange.communications.findBy(item => {
			if (item.lastAction === SchedulingApiShiftExchangeCommunicationAction.A_REPORTED_ILLNESS) return true;
			if (this.actionIsManagerResponse(item.lastAction)) return true;
			return false;
		});
		if (response) {
			if (response.attributeInfoCommunicationPartnerId.value === null) return null;
			if (this.rightsService.isMe(response.attributeInfoCommunicationPartnerId.value)) return true;
			return false;
		}
		return false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public actionIsManagerResponse(action : SchedulingApiShiftExchangeCommunicationAction) : boolean {
		if (this.actionIsOfTypeA_ACCEPT(action)) return true;
		if (action === SchedulingApiShiftExchangeCommunicationAction.ILLNESS_NEEDS_CONFIRMATION_A_DECLINED) {
			return true;
		}
		return false;
	}

	/* eslint-disable-next-line @typescript-eslint/naming-convention, jsdoc/require-jsdoc */
	public actionIsOfTypeA_ACCEPT(action : SchedulingApiShiftExchangeCommunicationAction) : boolean | undefined {
		if (this.actionIsOfTypeA_ACCEPT_WITH_SHIFT_EXCHANGE(action)) return true;
		const possibleActions = [
			SchedulingApiShiftExchangeCommunicationAction.ILLNESS_DECLINED_A_ACCEPT_WITHOUT_SHIFT_EXCHANGE,
			SchedulingApiShiftExchangeCommunicationAction.ILLNESS_NEEDS_CONFIRMATION_A_ACCEPT_WITHOUT_SHIFT_EXCHANGE,
		];

		if (possibleActions.includes(action)) return true;
		return false;
	}

	/* eslint-disable-next-line @typescript-eslint/naming-convention, jsdoc/require-jsdoc */
	public actionIsOfTypeA_ACCEPT_WITH_SHIFT_EXCHANGE(action : SchedulingApiShiftExchangeCommunicationAction) : boolean | undefined {
		const possibleActions = [
			SchedulingApiShiftExchangeCommunicationAction.ILLNESS_DECLINED_A_ACCEPT_WITH_SHIFT_EXCHANGE,
			SchedulingApiShiftExchangeCommunicationAction.ILLNESS_NEEDS_CONFIRMATION_A_ACCEPT_WITH_SHIFT_EXCHANGE,
			SchedulingApiShiftExchangeCommunicationAction.ILLNESS_CONFIRMED_WITHOUT_SHIFT_EXCHANGE_A_START_SHIFT_EXCHANGE,
		];

		if (possibleActions.includes(action)) return true;
		return false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public shiftRefsIsDisabled(shiftExchange : SchedulingApiShiftExchange) : boolean {
		if (shiftExchange.attributeInfoIndisposedMemberId.value === null) return true;

		// Is new item or behaves as one? don’t disable anything.
		if (shiftExchange.behavesAsNewItem) return false;

		// Closed items should never change.
		if (shiftExchange.isClosed) return true;

		// Check if user is the indisposedMember.
		if (this.iAmTheIndisposedMember(shiftExchange)) {
			// IM can edit its illness as long as it has not been confirmed.
			if (!shiftExchange.isIllness) return false;
			if (shiftExchange.state === SchedulingApiShiftExchangeState.ILLNESS_NEEDS_CONFIRMATION) return false;
			if (shiftExchange.state === SchedulingApiShiftExchangeState.ACTIVE) return false;
			return true;
		}

		// Managers can always edit
		if (!this.rightsService.hasManagerRightsForAllShiftRefs(shiftExchange.shiftRefs)) return true;

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
	public onCalendarBtnClick(shiftRef : Pick<SchedulingApiShiftExchangeShiftRef, 'id'> | Pick<SchedulingApiShiftExchangeSwappedShiftRef, 'id'>) : void {
		const id = shiftRef.id;
		const callback = () : void => {
			const shifts = this.api.data.shifts.filterBy(item => item.id.equals(id));
			shifts.setSelected(true);

			const firstSelectedShift = shifts.sortedBy('start', false).find(item => item.selected);
			if (firstSelectedShift && !firstSelectedShift.isNewItem()) this.pRouterService.scrollToSelector(
				`#scroll-target-id-${firstSelectedShift.id.toPrettyString()}` as ScrollTarget,
				undefined,
				true,
				true,
				false,
			);
		};

		if (this.clientRoutingService.currentPage === CurrentPageEnum.SCHEDULING) {
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
			`/client/scheduling/${this.schedulingService.urlParam!.calendarMode}` +
			`/${id.start}`,
		]);
	}

	/**
	 * Is there a active search?
	 * It does not matter if this search is based on illness or not.
	 */
	public shiftHasActiveShiftExchangeSearch(shift : SchedulingApiShift) : boolean {
		for (const shiftExchange of shift.shiftExchanges.iterable()) {
			if (shiftExchange.isClosed) continue;
			if (!(shiftExchange.isIllness && !shiftExchange.isBasedOnIllness)) return true;
		}
		return false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public shiftHasActiveIllness(shift : SchedulingApiShift) : boolean {
		for (const shiftExchange of shift.shiftExchanges.iterable()) {
			if (shiftExchange.isClosed) continue;
			if (shiftExchange.isIllness && !shiftExchange.isBasedOnIllness) return true;
		}
		return false;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public offerSelected(
		offer : PossibleShiftPickerValueType,
		shifts : SchedulingApiShifts,
	) : boolean {
		if (!shifts.length) return false;
		const shiftRefs = this.getShiftRefs(offer);
		if (!shiftRefs) return false;

		if (shifts.length !== shiftRefs.length) return false;

		for (const shift of shifts.iterable()) {
			if (shiftRefs.contains(shift.id)) continue;
			return false;
		}
		return true;
	}
	// eslint-disable-next-line jsdoc/require-jsdoc
	public offerAffected(
		offer : PossibleShiftPickerValueType,
		shifts : SchedulingApiShifts,
	) : boolean {
		if (!shifts.length) return false;
		const shiftRefs = this.getShiftRefs(offer);
		assumeNonNull(shiftRefs);

		for (const shift of shifts.iterable()) {
			if (shiftRefs.contains(shift.id)) return true;
		}
		return false;
	}

	private getShiftRefs(
		offer : PossibleShiftPickerValueType | SchedulingApiShiftExchangeCommunicationSwapOffer | null = null,
	) : (
		SchedulingApiShiftExchangeShiftRefs |
		SchedulingApiShiftExchangeSwappedShiftRefs |
		SchedulingApiShiftExchangeCommunicationSwapOfferShiftRefs
	) | null {
		if (offer === null) return null;
		if (offer instanceof SchedulingApiShiftExchangeCommunicationSwapOffer) {
			return offer.shiftRefs;
		} else if (
			offer instanceof SchedulingApiShiftExchangeShiftRefs ||
			offer instanceof SchedulingApiShiftExchangeSwappedShiftRefs
		) {
			return offer;
		}
		throw new Error('Unknown type of shiftRefs');
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public shiftExchangeExistsForShiftAndRequester(shiftId : ShiftId) : boolean {
		// TODO: Make Api filter this..
		// Is this shift already related to a shift-exchange?
		const shiftExchangeForThisShift = this.api.data.shiftExchanges.findBy(shiftExchange => {
			if (!shiftExchange.responsibleMemberId) return false;
			if (!shiftExchange.shiftRefs.contains(shiftId)) return false;
			if (!this.rightsService.isMe(shiftExchange.responsibleMemberId)) return false;
			return true;
		});
		if (!shiftExchangeForThisShift) return false;
		return true;
	}
}
