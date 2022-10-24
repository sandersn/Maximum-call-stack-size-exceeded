var PShiftExchangeCommunicationModalComponent_1;
var _a, _b, _c, _d;
import { __decorate, __metadata } from "tslib";
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef, HostBinding } from '@angular/core';
import { UntypedFormArray } from '@angular/forms';
import { SLIDE_ON_NGIF_TRIGGER } from '@plano/animations';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { PShiftExchangeConceptService } from '@plano/client/shared/p-shift-exchange/p-shift-exchange-concept.service';
import { PShiftExchangeService } from '@plano/client/shared/p-shift-exchange/shift-exchange.service';
import { PShiftPickerService } from '@plano/client/shared/p-shift-picker/p-shift-picker.service';
import { PShiftPickerComponent } from '@plano/client/shared/p-shift-picker/p-shift-picker/p-shift-picker.component';
import { SchedulingApiShifts, SchedulingApiService, MeService, RightsService, SchedulingApiShiftExchangeCommunicationAction, SchedulingApiShiftExchangeCommunicationState, SchedulingApiShiftExchangeCommunicationSwapOffer, SchedulingApiShiftExchangeShiftRef, SchedulingApiShiftExchangeSwappedShiftRef, SchedulingApiWarnings, ShiftExchangeCommunicationExpectedData } from '@plano/shared/api';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PPossibleErrorNames, PValidatorObject } from '@plano/shared/core/validators.types';
import { PApiPrimitiveTypes } from '../../../../../shared/api/base/generated-types.ag';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../shared/core/null-type-utils';
let PShiftExchangeCommunicationModalComponent = PShiftExchangeCommunicationModalComponent_1 = class PShiftExchangeCommunicationModalComponent {
    constructor(api, pShiftExchangeConceptService, pShiftExchangeService, activeModal, pFormsService, validators, changeDetectorRef, meService, pShiftPickerService, console, rightsService, localize, pMoment) {
        this.api = api;
        this.pShiftExchangeConceptService = pShiftExchangeConceptService;
        this.pShiftExchangeService = pShiftExchangeService;
        this.activeModal = activeModal;
        this.pFormsService = pFormsService;
        this.validators = validators;
        this.changeDetectorRef = changeDetectorRef;
        this.meService = meService;
        this.pShiftPickerService = pShiftPickerService;
        this.console = console;
        this.rightsService = rightsService;
        this.localize = localize;
        this.pMoment = pMoment;
        this._alwaysTrue = true;
        this.BootstrapSize = BootstrapSize;
        this.PThemeEnum = PThemeEnum;
        this.PlanoFaIconPool = PlanoFaIconPool;
        this.CONFIG = Config;
        this.actions = SchedulingApiShiftExchangeCommunicationAction;
        this.actionData = null;
        this.formGroup = null;
        this.meMember = null;
        this.initialWarnings = [];
        this.previousOfferTurnedInvalid = false;
        this.hidePerformActionCommentInput = false;
        this.beforeModalClose = () => { };
    }
    /**
     * Check if this component is fully loaded.
     * Can be used to show skeletons/spinners then false.
     */
    get isLoaded() {
        return !!this.shiftExchange.rawData && !!this.communication.rawData;
    }
    /**
     * Set some default values for properties that are not defined yet
     */
    initValues() {
        this.meMember = this.api.data.members.get(this.meService.data.id);
        this.previousOfferTurnedInvalid = (!this.communication.swapOffers.length &&
            this.communication.communicationState === SchedulingApiShiftExchangeCommunicationState.CP_WANTS_SWAP);
    }
    ngAfterContentChecked() {
        this.initWarnings(this.actionData.action);
    }
    initWarnings(action) {
        this.initialWarnings = [];
        // 	this.initExceedsEarningLimitWarnings();
        this.initPerformActionBasedWarnings(action);
    }
    /**
     * Add infos and warnings based on specific actions
     */
    initPerformActionBasedWarnings(performAction) {
        const actionEnum = SchedulingApiShiftExchangeCommunicationAction;
        let theShiftPluralisation;
        if (this.shiftExchange.shiftRefs.length > 1) {
            theShiftPluralisation = this.localize.transform('den Schichten');
        }
        else {
            theShiftPluralisation = this.localize.transform('der Schicht');
        }
        switch (performAction) {
            case actionEnum.ILLNESS_NEEDS_CONFIRMATION_A_ACCEPT_WITH_SHIFT_EXCHANGE:
            case actionEnum.ILLNESS_DECLINED_A_ACCEPT_WITH_SHIFT_EXCHANGE:
                const ILLNESS_DECLINED_A_ACCEPT_WITH_SHIFT_EXCHANGE_TEXT = this.localize.transform('Hiermit entfernst du ${name} aus ${theShiftPluralisation}. ${name} wird benachrichtigt.', {
                    name: this.shiftExchange.indisposedMember.firstName,
                    theShiftPluralisation: theShiftPluralisation,
                });
                this.initialWarnings.push({
                    style: PThemeEnum.WARNING,
                    text: ILLNESS_DECLINED_A_ACCEPT_WITH_SHIFT_EXCHANGE_TEXT,
                });
            // NOTE: No break here. Next push needs to be added in addition to the previous one.
            // eslint-disable no-fallthrough
            case actionEnum.ILLNESS_CONFIRMED_WITHOUT_SHIFT_EXCHANGE_A_START_SHIFT_EXCHANGE:
                let shiftPluralisation;
                if (this.shiftExchange.shiftRefs.length > 1) {
                    shiftPluralisation = this.localize.transform('Schichten');
                }
                else {
                    shiftPluralisation = this.localize.transform('Schicht');
                }
                const ILLNESS_CONFIRMED_WITHOUT_SHIFT_EXCHANGE_A_START_SHIFT_EXCHANGE_TEXT = this.localize.transform('Eine Ersatzsuche wird gestartet. Alle berechtigten Mitarbeitenden werden automatisch gefragt, ob sie die ${shiftPluralisation} übernehmen können. Über eine positive Antwort wirst du benachrichtigt.', {
                    shiftPluralisation: shiftPluralisation,
                });
                this.initialWarnings.push({
                    style: PThemeEnum.INFO,
                    text: ILLNESS_CONFIRMED_WITHOUT_SHIFT_EXCHANGE_A_START_SHIFT_EXCHANGE_TEXT,
                });
                break;
            case actionEnum.ILLNESS_NEEDS_CONFIRMATION_A_ACCEPT_WITHOUT_SHIFT_EXCHANGE:
            case actionEnum.ILLNESS_DECLINED_A_ACCEPT_WITHOUT_SHIFT_EXCHANGE:
                const ILLNESS_DECLINED_A_ACCEPT_WITHOUT_SHIFT_EXCHANGE_TEXT = this.localize.transform('Hiermit entfernst du ${name} aus ${theShiftPluralisation}. ${name} wird benachrichtigt.', {
                    theShiftPluralisation: theShiftPluralisation,
                    name: this.shiftExchange.indisposedMember.firstName,
                });
                this.initialWarnings.push({
                    style: PThemeEnum.INFO,
                    text: ILLNESS_DECLINED_A_ACCEPT_WITHOUT_SHIFT_EXCHANGE_TEXT,
                });
                break;
            default:
        }
    }
    /**
     * Title that gets shown in the header of this modal.
     */
    // TODO: This should probably changed to PDictionarySourceString
    get modalTitle() {
        if (!this.actionData)
            return 'ERROR';
        return this.pShiftExchangeConceptService.getActionText(this.actionData.action, this.shiftExchange);
    }
    earliestSwapOfferShiftRefStart() {
        let result = null;
        for (const swapOffer of this.communication.swapOffers.iterable()) {
            const earliestStart = swapOffer.shiftRefs.earliestStart;
            if (result === null || (earliestStart !== null && earliestStart < result))
                result = earliestStart;
        }
        return result;
    }
    get initialShiftPickerDate() {
        if (this.communication.swapOffers.length)
            return +this.pMoment.m(this.earliestSwapOfferShiftRefStart()).startOf('day');
        if (this.shiftExchange.shiftRefs.length)
            return +this.pMoment.m(this.shiftExchange.shiftRefs.earliestStart).startOf('day');
        return this.now;
    }
    /**
     * Initialize all necessary values for this modal.
     */
    initModal(shiftExchange, communication, actionData, beforeModalClose) {
        this.now = +this.pMoment.m();
        this.shiftExchange = shiftExchange;
        this.communication = communication;
        if (!this.communication.rawData) {
            this.console.error('initModal(): no rawData [PLANO-FE-VV]');
        }
        this.actionData = actionData;
        this.beforeModalClose = beforeModalClose;
        const actionEnum = SchedulingApiShiftExchangeCommunicationAction;
        // eslint-disable-next-line sonarjs/no-small-switch
        switch (this.actionData.action) {
            case actionEnum.ILLNESS_CONFIRMED_WITHOUT_SHIFT_EXCHANGE_A_START_SHIFT_EXCHANGE:
                this.communication.performActionComment = this.communication.lastActionComment;
                this.hidePerformActionCommentInput = true;
                break;
            default:
        }
        if (this.expectsSwapOffers) {
            this.pShiftPickerService.date = this.initialShiftPickerDate;
            this.pShiftPickerService.updateQueryParams();
            this.shiftExchange.loadDetailed({
                searchParams: this.pShiftPickerService.queryParams,
                success: () => {
                    this.initFormGroup();
                    this.changeDetectorRef.markForCheck();
                },
            });
        }
        else {
            this.initFormGroup();
        }
        this.initValues();
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    shiftIsPickable(shift) {
        if (this.shiftExchangeExistsForShift(shift.id))
            return false;
        if (this.shiftExchange.shiftRefs.contains(shift.id))
            return false;
        if (!shift.assignedMemberIds.contains(this.idOfMe))
            return false;
        return true;
    }
    /**
     * Initialize the formGroup for this component
     */
    // eslint-disable-next-line sonarjs/cognitive-complexity
    initFormGroup() {
        if (this.formGroup) {
            this.formGroup = null;
        }
        const tempFormGroup = this.pFormsService.group({});
        this.pFormsService.addControl(tempFormGroup, 'performActionComment', {
            value: this.communication.performActionComment,
            disabled: false,
        }, [], (value) => {
            if (!this.communication.rawData)
                throw new Error('Communication is not loaded [PLANO-FE-30T]');
            this.communication.performActionComment = value;
        });
        this.pFormsService.addArray(tempFormGroup, 'swapOffers', [], [
            (control) => {
                // FIXME: PLANO-15096
                if (!this.expectsSwapOffers)
                    return null;
                return this.validators.required(PApiPrimitiveTypes.ApiList).fn(control);
            },
            (control) => {
                if (!(control instanceof UntypedFormArray))
                    throw new Error(`Unexpected control type ${typeof control}`);
                /**
                 * Check if there are equal offers
                 */
                /** Array has only one offer? No further check needed */
                if (control.length <= 1)
                    return null;
                const offersHaveEqualSetOfShiftRefs = (offer1, offer2) => {
                    if (offer1.shiftRefs.length !== offer2.shiftRefs.length)
                        return false;
                    for (const shiftRef of offer1.shiftRefs.iterable()) {
                        if (!offer2.shiftRefs.contains(shiftRef.id))
                            return false;
                    }
                    return true;
                };
                /** Each offer should be represented one time in the array */
                for (let i = 0; i < control.length; i++) {
                    const offer = control.controls[i].value;
                    for (let j = i + 1; j < control.length; j++) {
                        const otherOffer = control.controls[j].value;
                        const offersAreEqual = offersHaveEqualSetOfShiftRefs(offer, otherOffer);
                        if (offersAreEqual)
                            return { equaloffers: {
                                    name: 'equaloffers',
                                    primitiveType: PApiPrimitiveTypes.ApiList,
                                } };
                    }
                }
                return null;
            },
        ]);
        for (const swapOffer of this.communication.swapOffers.iterable()) {
            const swapOffersFormArray = tempFormGroup.get('swapOffers');
            this.pFormsService.addItemToFormArray(swapOffersFormArray, swapOffer);
        }
        this.pFormsService.addControl(tempFormGroup, 'creatorsSelectedSwapOfferId', {
            value: this.communication.indisposedMembersSelectedSOId,
            disabled: !this.pShiftExchangeService.iAmTheResponsiblePersonForThisIllness(this.shiftExchange),
        }, [
            new PValidatorObject({ name: PPossibleErrorNames.REQUIRED, fn: (control) => {
                    // FIXME: PLANO-15096
                    if (!this.expectsSelectedSwapOffer)
                        return null;
                    return this.validators.required(this.communication.attributeInfoIndisposedMembersSelectedSOId.primitiveType).fn(control);
                } }),
        ], (value) => {
            this.communication.indisposedMembersSelectedSOId = value;
        });
        this.pFormsService.addControl(tempFormGroup, 'generateShiftExchangesOptions', {
            value: this.shiftExchange.generateShiftExchangesOptions,
            disabled: false,
        });
        this.pFormsService.addControl(tempFormGroup, 'generateAbsencesOptions', {
            value: this.shiftExchange.generateAbsencesOptions,
            disabled: false,
        });
        this.formGroup = tempFormGroup;
    }
    get validationRelevantWarnings() {
        if (!this.shiftExchange.rawData) {
            this.console.error('shiftExchange.rawData must be defined before calling iAmTheResponsiblePersonForThisIllness() [PLANO-19820]');
            return new SchedulingApiWarnings(null, false);
        }
        if (!this.showOfferPickerInsteadOfShiftPicker) {
            assumeDefinedToGetStrictNullChecksRunning(this.api.data.warnings, 'api.data.warnings');
            return this.api.data.warnings;
        }
        const id = this.communication.indisposedMembersSelectedSOId;
        if (id === null)
            return new SchedulingApiWarnings(null, false);
        const offer = this.communication.swapOffers.get(id);
        if (!offer)
            throw new Error('Could not get offer');
        assumeDefinedToGetStrictNullChecksRunning(this.api.data.warnings, 'api.data.warnings');
        return this.api.data.warnings.getByOffer(offer);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get formIsInvalid() {
        if (!this.formGroup)
            return true;
        if (this.api.isUpdatingWarnings)
            return true;
        if (this.validationRelevantWarnings.withSeverityFatalCount)
            return true;
        return this.formGroup.invalid;
    }
    /**
     * We don’t expect a action-modal with a calendar to have any warnings that are NOT related to an offer.
     * Just to be sure, we gather the unexpected warnings here and show them in the ui.
     */
    get nonOfferRelatedWarnings() {
        if (!this.api.isLoaded())
            return new SchedulingApiWarnings(null, false);
        // if (Config.DEBUG && unexpectedWarnings.length && !this.api.isBackendOperationRunning) {
        // 	// This can happen in  when user adds item to swapOffers, and then removes it. In the moment before the api call goes out.
        // 	this.console.error('Inside this modal there should not be any warning without a related offer.');
        // }
        assumeDefinedToGetStrictNullChecksRunning(this.api.data.warnings, 'api.data.warnings');
        return this.api.data.warnings.filterBy(item => {
            // we expect no offers without these ids in the modal which shows a calendar
            if (!item.forSwapOfferId && !item.forSwapOfferNewItemId)
                return true;
            const relatedOffer = this.communication.swapOffers.findBy(offer => {
                assumeDefinedToGetStrictNullChecksRunning(item.forSwapOfferId, 'item.forSwapOfferId');
                if (item.forSwapOfferId.equals(offer.id))
                    return true;
                if (item.forSwapOfferNewItemId === offer.newItemId)
                    return true;
                return false;
            });
            // warnings with related offer has already been shown at the offer in the offer-list
            if (relatedOffer)
                return false;
            return true;
        });
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onAddSwapOffersToFormArray(array, value) {
        this.ensureShiftRefInNextApiCalls(value);
        this.pFormsService.addItemToFormArray(array, value);
    }
    addShiftToSwapOffers(formArray, shiftId) {
        const newValue = this.communication.swapOffers.createNewItem();
        newValue.shiftRefs.createNewItem(shiftId);
        this.onAddSwapOffersToFormArray(formArray, newValue);
        // this.addItem.emit(newValue);
    }
    /**
     * Put selected shifts into PFormControl
     */
    addShiftsToFormArray(formArray, selectedShifts) {
        for (const selectedShift of selectedShifts.iterable()) {
            this.addShiftToSwapOffers(formArray, selectedShift.id);
            selectedShift.selected = false;
        }
    }
    // private addSelectedShiftsAndAllPaketShifts() : void {
    // 	const selectedShifts = this.api.data.shifts.filterBy((item) => item.selected);
    // 	for (const selectedShift of selectedShifts.iterable()) {
    // 		if (selectedShift.packetShifts.length) {
    // 			this.addShiftToOffersRef(selectedShift.id);
    // 			selectedShift.selected = false;
    // 			for (const packetShift of selectedShift.packetShifts.iterable()) {
    // 				const isInThePast = packetShift.end < this.now;
    // 				if (isInThePast) continue;
    // 				// if (packetShift.assignedMemberIds.contains(this.ind…)) continue;
    // 				this.addShiftToOffersRef(packetShift.id);
    // 			}
    // 		} else {
    // 			this.addShiftToOffersRef(selectedShift.id);
    // 			selectedShift.selected = false;
    // 		}
    // 	}
    // }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    onAddShiftsToFormArray(formArray, shifts) {
        this.addShiftsToFormArray(formArray, shifts);
    }
    ensureShiftRefInNextApiCalls(value) {
        if (value instanceof SchedulingApiShiftExchangeShiftRef) {
            this.pShiftPickerService.ensureShifts.push(value.id);
        }
        else if (value instanceof SchedulingApiShiftExchangeCommunicationSwapOffer) {
            for (const shiftRef of value.shiftRefs.iterable()) {
                this.pShiftPickerService.ensureShifts.push(shiftRef.id);
            }
        }
        else if (value instanceof SchedulingApiShiftExchangeSwappedShiftRef) {
            this.pShiftPickerService.ensureShifts.push(value.id);
        }
        assumeDefinedToGetStrictNullChecksRunning(value, 'value');
    }
    get idOfMe() {
        if (this.pShiftExchangeService.iAmTheIndisposedMember(this.shiftExchange)) {
            return this.shiftExchange.indisposedMemberId;
        }
        return this.communication.communicationPartnerId;
    }
    get idOfTheOtherMember() {
        if (this.pShiftExchangeService.iAmTheIndisposedMember(this.shiftExchange)) {
            return this.communication.communicationPartnerId;
        }
        return this.shiftExchange.indisposedMemberId;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get theOtherMember() {
        const member = this.api.data.members.get(this.idOfTheOtherMember);
        if (member === null)
            throw new Error(`could not find OtherMember ${this.idOfTheOtherMember.toString()} in ${this.api.data.members.length} members`);
        return member;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get shiftsForShiftPicker() {
        if (this.api.isBackendOperationRunning)
            return new SchedulingApiShifts(null, false);
        return this.api.data.shifts.filterBy(item => {
            // Obviously.. the offer-related shifts must be included.
            if (this.isPartOfCreatorsOffer(item.id))
                return true;
            // Shift is already assigned to the other member person?
            if (item.assignedMemberIds.contains(this.idOfTheOtherMember))
                return true;
            // Shift is not assigned to me?
            // if (!item.assignedMemberIds.contains(this.idOfMe)) return false;
            // Shift is not assignable to the other person?
            if (!item.assignableMembers.contains(this.idOfTheOtherMember))
                return false;
            // // ShiftExchange already exists for this shift and member
            // if (!this.isSamePacketAsShiftRefs(item.id)) return false;
            // Is same package than the one(s) in shiftExchange.shiftRefs
            // if (this.shiftExchangeExistsForShift(item.id)) return false;
            // Is in the past
            if (item.end < this.now)
                return false;
            return true;
        });
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    isPartOfCreatorsOffer(id) {
        return this.shiftExchange.shiftRefs.contains(id);
    }
    /**
     * Determine if this shift should be disabled
     */
    shiftExchangeExistsForShift(shiftId) {
        if (this.api.data.shiftExchanges.getByShiftAndMember(shiftId, this.shiftExchange.indisposedMemberId))
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    static hasCalendar(actionData) {
        if (PShiftExchangeCommunicationModalComponent_1.expectsSwapOffers(actionData))
            return true;
        if (PShiftExchangeCommunicationModalComponent_1.expectsSelectedSwapOffer(actionData))
            return true;
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    static expectsSwapOffers(actionData) {
        return actionData.expectedCommunicationData === ShiftExchangeCommunicationExpectedData.SWAP_OFFERS;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    static expectsSelectedSwapOffer(actionData) {
        return actionData.expectedCommunicationData ===
            ShiftExchangeCommunicationExpectedData.INDISPOSED_MEMBERS_SELECTED_SO;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get hasCalendar() {
        if (this.actionData === null)
            return undefined;
        return PShiftExchangeCommunicationModalComponent_1.hasCalendar(this.actionData);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get expectsSwapOffers() {
        if (this.actionData === null)
            return undefined;
        return PShiftExchangeCommunicationModalComponent_1.expectsSwapOffers(this.actionData);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get expectsSelectedSwapOffer() {
        if (this.actionData === null)
            return undefined;
        return PShiftExchangeCommunicationModalComponent_1.expectsSelectedSwapOffer(this.actionData);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get expectsIndisposedMembersSelectedSO() {
        if (!this.actionData)
            return undefined;
        const expectedData = ShiftExchangeCommunicationExpectedData.INDISPOSED_MEMBERS_SELECTED_SO;
        return this.actionData.expectedCommunicationData === expectedData;
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get actionIsOfTypeA_ACCEPT() {
        if (this.actionIsOfTypeA_ACCEPT_WITH_SHIFT_EXCHANGE)
            return true;
        if (!this.actionData)
            return undefined;
        return this.pShiftExchangeService.actionIsOfTypeA_ACCEPT(this.actionData.action);
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    get actionIsOfTypeA_ACCEPT_WITH_SHIFT_EXCHANGE() {
        if (!this.actionData)
            return undefined;
        return this.pShiftExchangeService.actionIsOfTypeA_ACCEPT_WITH_SHIFT_EXCHANGE(this.actionData.action);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get generateShiftExchangesIsPossible() {
        // Only Managers can perform these actions
        if (!this.actionIsOfTypeA_ACCEPT_WITH_SHIFT_EXCHANGE)
            return false;
        // if (this.shiftExchange.shiftRefs.length <= 1) return false;
        return true;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get generateAbsencesIsPossible() {
        // Managers can accept a illness report, but only owners can create absences.
        if (!this.rightsService.isOwner)
            return false;
        // Only Managers can perform these actions
        if (!this.actionIsOfTypeA_ACCEPT)
            return false;
        // wurden schon welche erstellt?
        if (this.shiftExchange.relatedAbsences.length)
            return false;
        return true;
    }
    /**
     * Get the action text for a given available action
     * Use this as label for the action button
     */
    getActionText(action) {
        if (action === this.actions.CP_WANTS_SWAP_IM_ACCEPT) {
            const creatorsSelectedSwapOfferId = this.formGroup ? this.formGroup.get('creatorsSelectedSwapOfferId').value : undefined;
            const hasMoreThanOneShift = () => {
                const selectedOffer = this.communication.swapOffers.get(creatorsSelectedSwapOfferId);
                const shiftsCount = selectedOffer ? selectedOffer.shiftRefs.length : 0;
                return shiftsCount > 1;
            };
            if (creatorsSelectedSwapOfferId !== null &&
                hasMoreThanOneShift()) {
                if (!Config.IS_MOBILE)
                    return this.localize.transform('Mit ausgewählten Schichten tauschen');
                return this.localize.transform('Tauschen');
            }
            if (!Config.IS_MOBILE)
                return this.localize.transform('Mit ausgewählter Schicht tauschen');
            return this.localize.transform('Tauschen');
        }
        return this.pShiftExchangeConceptService.getActionText(action, this.shiftExchange);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showActionButtons() {
        if (this.pShiftExchangeService.iAmTheIndisposedMember(this.shiftExchange) &&
            this.actionData.action === this.actions.CP_WANTS_SWAP_IM_ACCEPT)
            return true;
        return false;
    }
    /**
     * This method can be used to close the modal from inside this component
     */
    onClose(performAction) {
        this.beforeModalClose(() => {
            if (!this.communication.rawData)
                throw new Error('PLANO-FE-2TY');
            this.communication.performAction = performAction !== null && performAction !== void 0 ? performAction : this.actionData.action;
            if (this.communication.performAction === SchedulingApiShiftExchangeCommunicationAction.CP_WANTS_SWAP_IM_DECLINE_SWAP) {
                this.communication.indisposedMembersSelectedSOId = undefined;
            }
            this.activeModal.close(performAction);
        });
    }
    /**
     * This method can be used to dismiss the modal from inside this component
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onDismiss(result) {
        this.activeModal.dismiss(result);
    }
    /**
     * Check if the bound ngModel/formControl.value already contains the provided id
     */
    shiftRefsContainsShiftId(shiftId) {
        assumeDefinedToGetStrictNullChecksRunning(shiftId, 'shiftId');
        assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
        // eslint-disable-next-line @typescript-eslint/ban-types
        for (const control of this.formGroup.get('swapOffers').controls) {
            const controlValue = control.value;
            if (controlValue instanceof SchedulingApiShiftExchangeCommunicationSwapOffer) {
                for (const shiftRef of controlValue.shiftRefs.iterable()) {
                    if (shiftRef.id.equals(shiftId))
                        return true;
                }
            }
            else if (controlValue.id.equals(shiftId)) {
                return true;
            }
        }
        return false;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showOfferPickerInsteadOfShiftPicker() {
        if (!this.shiftExchange.rawData)
            throw new Error('shiftExchange.rawData must be defined before calling iAmTheResponsiblePersonForThisIllness() [PLANO-19820]');
        return this.pShiftExchangeService.iAmTheResponsiblePersonForThisIllness(this.shiftExchange);
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get warnings() {
        if (!this.shiftExchange.rawData) {
            this.console.error('shiftExchange.rawData must be defined before load warnings [PLANO-19820]');
            return new SchedulingApiWarnings(null, false);
        }
        return this.validationRelevantWarnings;
    }
    /* eslint-disable-next-line jsdoc/require-jsdoc */
    get showSelectedSwapOffer() {
        const ENUM = SchedulingApiShiftExchangeCommunicationAction;
        if (!this.communication.rawData)
            throw new Error('showSelectedSwapOffer(): no rawData [PLANO-FE-VV]');
        if (this.communication.performAction === ENUM.IM_CHANGED_MIND_WANTS_SWAP_CP_ACCEPT)
            return true;
        return false;
    }
};
__decorate([
    HostBinding('class.h-100'),
    __metadata("design:type", Object)
], PShiftExchangeCommunicationModalComponent.prototype, "_alwaysTrue", void 0);
__decorate([
    ViewChild('shiftPickerRef'),
    __metadata("design:type", PShiftPickerComponent)
], PShiftExchangeCommunicationModalComponent.prototype, "shiftPickerRef", void 0);
PShiftExchangeCommunicationModalComponent = PShiftExchangeCommunicationModalComponent_1 = __decorate([
    Component({
        selector: 'p-shift-exchange-communication-modal',
        templateUrl: './p-shift-exchange-communication-modal.component.html',
        styleUrls: ['./p-shift-exchange-communication-modal.component.scss'],
        changeDetection: ChangeDetectionStrategy.Default,
        animations: [SLIDE_ON_NGIF_TRIGGER],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof SchedulingApiService !== "undefined" && SchedulingApiService) === "function" ? _a : Object, PShiftExchangeConceptService,
        PShiftExchangeService, typeof (_b = typeof NgbActiveModal !== "undefined" && NgbActiveModal) === "function" ? _b : Object, PFormsService,
        ValidatorsService, typeof (_c = typeof ChangeDetectorRef !== "undefined" && ChangeDetectorRef) === "function" ? _c : Object, MeService,
        PShiftPickerService,
        LogService, typeof (_d = typeof RightsService !== "undefined" && RightsService) === "function" ? _d : Object, LocalizePipe,
        PMomentService])
], PShiftExchangeCommunicationModalComponent);
export { PShiftExchangeCommunicationModalComponent };
//# sourceMappingURL=p-shift-exchange-communication-modal.component.js.map