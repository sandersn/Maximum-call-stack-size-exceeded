import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AfterContentChecked } from '@angular/core';
import { Component, ChangeDetectionStrategy, ViewChild, ChangeDetectorRef, HostBinding } from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { UntypedFormArray } from '@angular/forms';
import { SLIDE_ON_NGIF_TRIGGER } from '@plano/animations';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PAlertTheme} from '@plano/client/shared/bootstrap-styles.enum';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PFormControl, PFormGroup } from '@plano/client/shared/p-forms/p-form-control';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { PShiftExchangeConceptService } from '@plano/client/shared/p-shift-exchange/p-shift-exchange-concept.service';
import { PShiftExchangeService } from '@plano/client/shared/p-shift-exchange/shift-exchange.service';
import { PShiftPickerService } from '@plano/client/shared/p-shift-picker/p-shift-picker.service';
import { PossibleShiftPickerValueItemType } from '@plano/client/shared/p-shift-picker/p-shift-picker/p-shift-picker.component';
import { PShiftPickerComponent } from '@plano/client/shared/p-shift-picker/p-shift-picker/p-shift-picker.component';
import { SchedulingApiShiftExchangeCommunication, SchedulingApiShiftExchange, SchedulingApiShift, SchedulingApiMember, ShiftId, ActionData} from '@plano/shared/api';
import { SchedulingApiShifts, SchedulingApiService, MeService, RightsService, SchedulingApiShiftExchangeCommunicationAction, SchedulingApiShiftExchangeCommunicationState, SchedulingApiShiftExchangeCommunicationSwapOffer, SchedulingApiShiftExchangeShiftRef, SchedulingApiShiftExchangeSwappedShiftRef, SchedulingApiWarnings, ShiftExchangeCommunicationExpectedData } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PValidationErrors} from '@plano/shared/core/validators.types';
import { PPossibleErrorNames, PValidatorObject } from '@plano/shared/core/validators.types';
import { PApiPrimitiveTypes } from '../../../../../shared/api/base/generated-types.ag';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../shared/core/null-type-utils';

@Component({
	selector: 'p-shift-exchange-communication-modal',
	templateUrl: './p-shift-exchange-communication-modal.component.html',
	styleUrls: ['./p-shift-exchange-communication-modal.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	animations: [SLIDE_ON_NGIF_TRIGGER],
})
export class PShiftExchangeCommunicationModalComponent implements AfterContentChecked {
	@HostBinding('class.h-100') protected _alwaysTrue = true;

	@ViewChild('shiftPickerRef') private shiftPickerRef ! : PShiftPickerComponent;

	constructor(
		public api : SchedulingApiService,
		public pShiftExchangeConceptService : PShiftExchangeConceptService,
		private pShiftExchangeService : PShiftExchangeService,
		private activeModal : NgbActiveModal,
		private pFormsService : PFormsService,
		private validators : ValidatorsService,
		private changeDetectorRef : ChangeDetectorRef,
		private meService : MeService,
		private pShiftPickerService : PShiftPickerService,
		private console : LogService,
		private rightsService : RightsService,
		private localize : LocalizePipe,
		private pMoment : PMomentService,
	) {
	}

	public BootstrapSize = BootstrapSize;
	public PThemeEnum = PThemeEnum;
	public PlanoFaIconPool = PlanoFaIconPool;

	public readonly CONFIG : typeof Config = Config;
	public actions : typeof SchedulingApiShiftExchangeCommunicationAction = SchedulingApiShiftExchangeCommunicationAction;

	public shiftExchange ! : SchedulingApiShiftExchange;
	public communication ! : SchedulingApiShiftExchangeCommunication;
	private actionData : ActionData | null = null;
	public formGroup : PFormGroup | null = null;
	private now ! : number;

	public meMember : SchedulingApiMember | null = null;
	public initialWarnings : {
		style : PAlertTheme,
		text : string,
	}[] = [];

	/**
	 * Check if this component is fully loaded.
	 * Can be used to show skeletons/spinners then false.
	 */
	public get isLoaded() : boolean {
		return !!this.shiftExchange.rawData && !!this.communication.rawData;
	}

	public previousOfferTurnedInvalid : boolean = false;

	/**
	 * Set some default values for properties that are not defined yet
	 */
	public initValues() : void {
		this.meMember = this.api.data.members.get(this.meService.data.id);
		this.previousOfferTurnedInvalid = (
			!this.communication.swapOffers.length &&
			this.communication.communicationState === SchedulingApiShiftExchangeCommunicationState.CP_WANTS_SWAP
		);
	}

	public ngAfterContentChecked() : void {
		this.initWarnings(this.actionData!.action);
	}

	private initWarnings(action : SchedulingApiShiftExchangeCommunicationAction) : void {
		this.initialWarnings = [];

		// 	this.initExceedsEarningLimitWarnings();
		this.initPerformActionBasedWarnings(action);
	}

	/**
	 * Add infos and warnings based on specific actions
	 */
	private initPerformActionBasedWarnings(performAction : SchedulingApiShiftExchangeCommunicationAction) : void {
		const actionEnum = SchedulingApiShiftExchangeCommunicationAction;

		let theShiftPluralisation : string;
		if (this.shiftExchange.shiftRefs.length > 1) {
			theShiftPluralisation = this.localize.transform('den Schichten');
		} else {
			theShiftPluralisation = this.localize.transform('der Schicht');
		}

		switch (performAction) {
			case actionEnum.ILLNESS_NEEDS_CONFIRMATION_A_ACCEPT_WITH_SHIFT_EXCHANGE :
			case actionEnum.ILLNESS_DECLINED_A_ACCEPT_WITH_SHIFT_EXCHANGE :
				const ILLNESS_DECLINED_A_ACCEPT_WITH_SHIFT_EXCHANGE_TEXT = this.localize.transform(
					'Hiermit entfernst du ${name} aus ${theShiftPluralisation}. ${name} wird benachrichtigt.',
					{
						name: this.shiftExchange.indisposedMember!.firstName,
						theShiftPluralisation: theShiftPluralisation,
					},
				);
				this.initialWarnings.push({
					style : PThemeEnum.WARNING,
					text : ILLNESS_DECLINED_A_ACCEPT_WITH_SHIFT_EXCHANGE_TEXT,
				});
				// NOTE: No break here. Next push needs to be added in addition to the previous one.
				// eslint-disable no-fallthrough
			case actionEnum.ILLNESS_CONFIRMED_WITHOUT_SHIFT_EXCHANGE_A_START_SHIFT_EXCHANGE :
				let shiftPluralisation : string;
				if (this.shiftExchange.shiftRefs.length > 1) {
					shiftPluralisation = this.localize.transform('Schichten');
				} else {
					shiftPluralisation = this.localize.transform('Schicht');
				}
				const ILLNESS_CONFIRMED_WITHOUT_SHIFT_EXCHANGE_A_START_SHIFT_EXCHANGE_TEXT = this.localize.transform(
					'Eine Ersatzsuche wird gestartet. Alle berechtigten Mitarbeitenden werden automatisch gefragt, ob sie die ${shiftPluralisation} übernehmen können. Über eine positive Antwort wirst du benachrichtigt.',
					{
						shiftPluralisation: shiftPluralisation,
					},
				);
				this.initialWarnings.push({
					style : PThemeEnum.INFO,
					text : ILLNESS_CONFIRMED_WITHOUT_SHIFT_EXCHANGE_A_START_SHIFT_EXCHANGE_TEXT,
				});
				break;

			case actionEnum.ILLNESS_NEEDS_CONFIRMATION_A_ACCEPT_WITHOUT_SHIFT_EXCHANGE :
			case actionEnum.ILLNESS_DECLINED_A_ACCEPT_WITHOUT_SHIFT_EXCHANGE :
				const ILLNESS_DECLINED_A_ACCEPT_WITHOUT_SHIFT_EXCHANGE_TEXT = this.localize.transform(
					'Hiermit entfernst du ${name} aus ${theShiftPluralisation}. ${name} wird benachrichtigt.',
					{
						theShiftPluralisation: theShiftPluralisation,
						name: this.shiftExchange.indisposedMember!.firstName,
					},
				);
				this.initialWarnings.push({
					style : PThemeEnum.INFO,
					text : ILLNESS_DECLINED_A_ACCEPT_WITHOUT_SHIFT_EXCHANGE_TEXT,
				});
				break;
			default :
		}
	}

	/**
	 * Title that gets shown in the header of this modal.
	 */
	// TODO: This should probably changed to PDictionarySourceString
	public get modalTitle() : string | null {
		if (!this.actionData) return 'ERROR';
		return this.pShiftExchangeConceptService.getActionText(
			this.actionData.action,
			this.shiftExchange,
		);
	}

	private earliestSwapOfferShiftRefStart() : number | null {
		let result : number | null = null;
		for (const swapOffer of this.communication.swapOffers.iterable()) {
			const earliestStart = swapOffer.shiftRefs.earliestStart;

			if (result === null || (earliestStart !== null && earliestStart < result))
				result = earliestStart;
		}
		return result;
	}

	private get initialShiftPickerDate() : number {
		if (this.communication.swapOffers.length) return +this.pMoment.m(this.earliestSwapOfferShiftRefStart()).startOf('day');
		if (this.shiftExchange.shiftRefs.length) return +this.pMoment.m(this.shiftExchange.shiftRefs.earliestStart).startOf('day');
		return this.now;
	}

	public hidePerformActionCommentInput : boolean = false;
	public beforeModalClose : ((success : () => void) => void) = () => {};

	/**
	 * Initialize all necessary values for this modal.
	 */
	public initModal(
		shiftExchange : SchedulingApiShiftExchange,
		communication : SchedulingApiShiftExchangeCommunication,
		actionData : ActionData,
		beforeModalClose : (success : () => void) => void,
	) : void {
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
			case actionEnum.ILLNESS_CONFIRMED_WITHOUT_SHIFT_EXCHANGE_A_START_SHIFT_EXCHANGE :
				this.communication.performActionComment = this.communication.lastActionComment;
				this.hidePerformActionCommentInput = true;
				break;
			default :
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
		} else {
			this.initFormGroup();
		}

		this.initValues();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public shiftIsPickable(shift : SchedulingApiShift) : boolean {
		if (this.shiftExchangeExistsForShift(shift.id)) return false;
		if (this.shiftExchange.shiftRefs.contains(shift.id)) return false;
		if (!shift.assignedMemberIds.contains(this.idOfMe)) return false;
		return true;
	}

	/**
	 * Initialize the formGroup for this component
	 */
	// eslint-disable-next-line sonarjs/cognitive-complexity
	public initFormGroup() : void {
		if (this.formGroup) { this.formGroup = null; }
		const tempFormGroup = this.pFormsService.group({});

		this.pFormsService.addControl(tempFormGroup, 'performActionComment',
			{
				value: this.communication.performActionComment,
				disabled: false,
			}, [],
			(value : string) => {
				if (!this.communication.rawData) throw new Error('Communication is not loaded [PLANO-FE-30T]');
				this.communication.performActionComment = value;
			},
		);

		this.pFormsService.addArray(tempFormGroup, 'swapOffers', [],
			[
				(control : AbstractControl) : PValidationErrors | null => {
					// FIXME: PLANO-15096
					if (!this.expectsSwapOffers) return null;
					return this.validators.required(PApiPrimitiveTypes.ApiList).fn(control);
				},
				(control : AbstractControl) : PValidationErrors | null => {
					if (!(control instanceof UntypedFormArray)) throw new Error(`Unexpected control type ${typeof control}`);

					/**
					 * Check if there are equal offers
					 */
					/** Array has only one offer? No further check needed */
					if (control.length <= 1) return null;

					const offersHaveEqualSetOfShiftRefs = (
						offer1 : SchedulingApiShiftExchangeCommunicationSwapOffer,
						offer2 : SchedulingApiShiftExchangeCommunicationSwapOffer,
					) : boolean => {
						if (offer1.shiftRefs.length !== offer2.shiftRefs.length) return false;
						for (const shiftRef of offer1.shiftRefs.iterable()) {
							if (!offer2.shiftRefs.contains(shiftRef.id)) return false;
						}
						return true;
					};

					/** Each offer should be represented one time in the array */
					for (let i = 0; i < control.length; i++) {
						const offer = control.controls[i].value;

						for (let j = i + 1; j < control.length; j++) {
							const otherOffer = control.controls[j].value;
							const offersAreEqual = offersHaveEqualSetOfShiftRefs(
								offer,
								otherOffer,
							);
							if (offersAreEqual) return { equaloffers: {
								name: 'equaloffers' as PPossibleErrorNames, // very special error name. dont want to make PPossibleErrorNames entry for it
								primitiveType: PApiPrimitiveTypes.ApiList,
							} };
						}
					}

					return null;
				},
			],
		);
		for (const swapOffer of this.communication.swapOffers.iterable()) {
			const swapOffersFormArray = tempFormGroup.get('swapOffers') as unknown as FormArray<PFormControl>;
			this.pFormsService.addItemToFormArray(swapOffersFormArray, swapOffer);
		}

		this.pFormsService.addControl(tempFormGroup, 'creatorsSelectedSwapOfferId', {
			value: this.communication.indisposedMembersSelectedSOId,
			disabled: !this.pShiftExchangeService.iAmTheResponsiblePersonForThisIllness(this.shiftExchange),
		}, [
			new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
				// FIXME: PLANO-15096
				if (!this.expectsSelectedSwapOffer) return null;
				return this.validators.required(this.communication.attributeInfoIndisposedMembersSelectedSOId.primitiveType).fn(control);
			}}),
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

	private get validationRelevantWarnings() : SchedulingApiWarnings {
		if (!this.shiftExchange.rawData) {
			this.console.error('shiftExchange.rawData must be defined before calling iAmTheResponsiblePersonForThisIllness() [PLANO-19820]');
			return new SchedulingApiWarnings(null, false);
		}
		if (!this.showOfferPickerInsteadOfShiftPicker) {
			assumeDefinedToGetStrictNullChecksRunning(this.api.data.warnings, 'api.data.warnings');
			return this.api.data.warnings;
		}

		const id = this.communication.indisposedMembersSelectedSOId;
		if (id === null) return new SchedulingApiWarnings(null, false);

		const offer = this.communication.swapOffers.get(id);
		if (!offer) throw new Error('Could not get offer');
		assumeDefinedToGetStrictNullChecksRunning(this.api.data.warnings, 'api.data.warnings');
		return this.api.data.warnings.getByOffer(offer);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get formIsInvalid() : boolean {
		if (!this.formGroup) return true;
		if (this.api.isUpdatingWarnings) return true;
		if (this.validationRelevantWarnings.withSeverityFatalCount) return true;
		return this.formGroup.invalid;
	}

	/**
	 * We don’t expect a action-modal with a calendar to have any warnings that are NOT related to an offer.
	 * Just to be sure, we gather the unexpected warnings here and show them in the ui.
	 */
	public get nonOfferRelatedWarnings() : SchedulingApiWarnings {
		if (!this.api.isLoaded()) return new SchedulingApiWarnings(null, false);
		// if (Config.DEBUG && unexpectedWarnings.length && !this.api.isBackendOperationRunning) {
		// 	// This can happen in  when user adds item to swapOffers, and then removes it. In the moment before the api call goes out.
		// 	this.console.error('Inside this modal there should not be any warning without a related offer.');
		// }
		assumeDefinedToGetStrictNullChecksRunning(this.api.data.warnings, 'api.data.warnings');
		return this.api.data.warnings.filterBy(item => {

			// we expect no offers without these ids in the modal which shows a calendar
			if (!item.forSwapOfferId && !item.forSwapOfferNewItemId) return true;

			const relatedOffer = this.communication.swapOffers.findBy(offer => {
				assumeDefinedToGetStrictNullChecksRunning(item.forSwapOfferId, 'item.forSwapOfferId');
				if (item.forSwapOfferId.equals(offer.id)) return true;
				if (item.forSwapOfferNewItemId === offer.newItemId) return true;
				return false;
			});

			// warnings with related offer has already been shown at the offer in the offer-list
			if (relatedOffer) return false;

			return true;
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onAddSwapOffersToFormArray(
		array : FormArray<PFormControl>,
		value : PossibleShiftPickerValueItemType,
	) : void {
		this.ensureShiftRefInNextApiCalls(value);
		this.pFormsService.addItemToFormArray(array, value);
	}

	private addShiftToSwapOffers(formArray : FormArray<PFormControl>, shiftId : ShiftId) : void {
		const newValue = this.communication.swapOffers.createNewItem();
		newValue.shiftRefs.createNewItem(shiftId);
		this.onAddSwapOffersToFormArray(formArray, newValue);
		// this.addItem.emit(newValue);
	}

	/**
	 * Put selected shifts into PFormControl
	 */
	private addShiftsToFormArray(formArray : FormArray<PFormControl>, selectedShifts : SchedulingApiShifts) : void {
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
	public onAddShiftsToFormArray(
		formArray : FormArray<PFormControl>,
		shifts : SchedulingApiShifts,
	) : void {
		this.addShiftsToFormArray(formArray, shifts);
	}

	private ensureShiftRefInNextApiCalls(value : PossibleShiftPickerValueItemType) : void {
		if (value instanceof SchedulingApiShiftExchangeShiftRef) {
			this.pShiftPickerService.ensureShifts.push(value.id);
		} else if (value instanceof SchedulingApiShiftExchangeCommunicationSwapOffer) {
			for (const shiftRef of value.shiftRefs.iterable()) {
				this.pShiftPickerService.ensureShifts.push(shiftRef.id);
			}
		} else if (value instanceof SchedulingApiShiftExchangeSwappedShiftRef) {
			this.pShiftPickerService.ensureShifts.push(value.id);
		}
		assumeDefinedToGetStrictNullChecksRunning(value, 'value');
	}

	private get idOfMe() : Id {
		if (this.pShiftExchangeService.iAmTheIndisposedMember(this.shiftExchange)) {
			return this.shiftExchange.indisposedMemberId;
		}
		return this.communication.communicationPartnerId;
	}

	private get idOfTheOtherMember() : Id {
		if (this.pShiftExchangeService.iAmTheIndisposedMember(this.shiftExchange)) {
			return this.communication.communicationPartnerId;
		}
		return this.shiftExchange.indisposedMemberId;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get theOtherMember() : SchedulingApiMember {
		const member = this.api.data.members.get(this.idOfTheOtherMember);
		if (member === null) throw new Error(`could not find OtherMember ${this.idOfTheOtherMember.toString()} in ${this.api.data.members.length} members`);
		return member;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftsForShiftPicker() : SchedulingApiShifts {
		if (this.api.isBackendOperationRunning) return new SchedulingApiShifts(null, false);
		return this.api.data.shifts.filterBy(item => {
			// Obviously.. the offer-related shifts must be included.
			if (this.isPartOfCreatorsOffer(item.id)) return true;

			// Shift is already assigned to the other member person?
			if (item.assignedMemberIds.contains(this.idOfTheOtherMember)) return true;

			// Shift is not assigned to me?
			// if (!item.assignedMemberIds.contains(this.idOfMe)) return false;

			// Shift is not assignable to the other person?
			if (!item.assignableMembers.contains(this.idOfTheOtherMember)) return false;

			// // ShiftExchange already exists for this shift and member
			// if (!this.isSamePacketAsShiftRefs(item.id)) return false;

			// Is same package than the one(s) in shiftExchange.shiftRefs
			// if (this.shiftExchangeExistsForShift(item.id)) return false;

			// Is in the past
			if (item.end < this.now) return false;

			return true;
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public isPartOfCreatorsOffer(id : ShiftId) : boolean {
		return this.shiftExchange.shiftRefs.contains(id);
	}

	/**
	 * Determine if this shift should be disabled
	 */
	public shiftExchangeExistsForShift(shiftId : ShiftId) : boolean {
		if (this.api.data.shiftExchanges.getByShiftAndMember(shiftId, this.shiftExchange.indisposedMemberId)) return true;
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public static hasCalendar(actionData : ActionData) : boolean {
		if (PShiftExchangeCommunicationModalComponent.expectsSwapOffers(actionData)) return true;
		if (PShiftExchangeCommunicationModalComponent.expectsSelectedSwapOffer(actionData)) return true;
		return false;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public static expectsSwapOffers(actionData : ActionData) : boolean {
		return actionData.expectedCommunicationData === ShiftExchangeCommunicationExpectedData.SWAP_OFFERS;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public static expectsSelectedSwapOffer(actionData : ActionData) : boolean {
		return actionData.expectedCommunicationData ===
			ShiftExchangeCommunicationExpectedData.INDISPOSED_MEMBERS_SELECTED_SO;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get hasCalendar() : boolean | undefined {
		if (this.actionData === null) return undefined;
		return PShiftExchangeCommunicationModalComponent.hasCalendar(this.actionData);
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get expectsSwapOffers() : boolean | undefined {
		if (this.actionData === null) return undefined;
		return PShiftExchangeCommunicationModalComponent.expectsSwapOffers(this.actionData);
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get expectsSelectedSwapOffer() : boolean | undefined {
		if (this.actionData === null) return undefined;
		return PShiftExchangeCommunicationModalComponent.expectsSelectedSwapOffer(this.actionData);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get expectsIndisposedMembersSelectedSO() : boolean | undefined {
		if (!this.actionData) return undefined;
		const expectedData = ShiftExchangeCommunicationExpectedData.INDISPOSED_MEMBERS_SELECTED_SO;
		return this.actionData.expectedCommunicationData === expectedData;
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	private get actionIsOfTypeA_ACCEPT() : boolean | undefined {
		if (this.actionIsOfTypeA_ACCEPT_WITH_SHIFT_EXCHANGE) return true;
		if (!this.actionData) return undefined;
		return this.pShiftExchangeService.actionIsOfTypeA_ACCEPT(this.actionData.action);
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	private get actionIsOfTypeA_ACCEPT_WITH_SHIFT_EXCHANGE() : boolean | undefined {
		if (!this.actionData) return undefined;
		return this.pShiftExchangeService.actionIsOfTypeA_ACCEPT_WITH_SHIFT_EXCHANGE(this.actionData.action);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get generateShiftExchangesIsPossible() : boolean {
		// Only Managers can perform these actions
		if (!this.actionIsOfTypeA_ACCEPT_WITH_SHIFT_EXCHANGE) return false;

		// if (this.shiftExchange.shiftRefs.length <= 1) return false;
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get generateAbsencesIsPossible() : boolean {
		// Managers can accept a illness report, but only owners can create absences.
		if (!this.rightsService.isOwner) return false;
		// Only Managers can perform these actions
		if (!this.actionIsOfTypeA_ACCEPT) return false;

		// wurden schon welche erstellt?
		if (this.shiftExchange.relatedAbsences.length) return false;

		return true;
	}

	/**
	 * Get the action text for a given available action
	 * Use this as label for the action button
	 */
	public getActionText(
		action : SchedulingApiShiftExchangeCommunicationAction,
	) : string | null {
		if (action === this.actions.CP_WANTS_SWAP_IM_ACCEPT) {
			const creatorsSelectedSwapOfferId = this.formGroup ? this.formGroup.get('creatorsSelectedSwapOfferId')!.value : undefined;
			const hasMoreThanOneShift = () : boolean => {
				const selectedOffer = this.communication.swapOffers.get(creatorsSelectedSwapOfferId);
				const shiftsCount : number = selectedOffer ? selectedOffer.shiftRefs.length : 0;
				return shiftsCount > 1;
			};

			if (
				creatorsSelectedSwapOfferId !== null &&
				hasMoreThanOneShift()
			) {
				if (!Config.IS_MOBILE) return this.localize.transform('Mit ausgewählten Schichten tauschen');
				return this.localize.transform('Tauschen');
			}
			if (!Config.IS_MOBILE) return this.localize.transform('Mit ausgewählter Schicht tauschen');
			return this.localize.transform('Tauschen');
		}

		return this.pShiftExchangeConceptService.getActionText(action, this.shiftExchange);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showActionButtons() : boolean {
		if (
			this.pShiftExchangeService.iAmTheIndisposedMember(this.shiftExchange) &&
			this.actionData!.action === this.actions.CP_WANTS_SWAP_IM_ACCEPT
		) return true;
		return false;
	}

	/**
	 * This method can be used to close the modal from inside this component
	 */
	public onClose(performAction ?: SchedulingApiShiftExchangeCommunicationAction) : void {
		this.beforeModalClose(() => {
			if (!this.communication.rawData) throw new Error('PLANO-FE-2TY');
			this.communication.performAction = performAction ?? this.actionData!.action;
			if (
				this.communication.performAction === SchedulingApiShiftExchangeCommunicationAction.CP_WANTS_SWAP_IM_DECLINE_SWAP
			) {
				(this.communication.indisposedMembersSelectedSOId as Id | undefined) = undefined;
			}
			this.activeModal.close(performAction);
		});
	}

	/**
	 * This method can be used to dismiss the modal from inside this component
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public onDismiss(result ?: any) : void {
		this.activeModal.dismiss(result);
	}

	/**
	 * Check if the bound ngModel/formControl.value already contains the provided id
	 */
	public shiftRefsContainsShiftId(shiftId : ShiftId) : boolean {
		assumeDefinedToGetStrictNullChecksRunning(shiftId, 'shiftId');
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');

		// eslint-disable-next-line @typescript-eslint/ban-types
		for (const control of (this.formGroup.get('swapOffers') as UntypedFormArray).controls) {
			const controlValue = control.value as PossibleShiftPickerValueItemType;
			if (controlValue instanceof SchedulingApiShiftExchangeCommunicationSwapOffer) {
				for (const shiftRef of controlValue.shiftRefs.iterable()) {
					if (shiftRef.id.equals(shiftId)) return true;
				}
			} else if (controlValue.id!.equals(shiftId)) {
				return true;
			}
		}
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showOfferPickerInsteadOfShiftPicker() : boolean {
		if (!this.shiftExchange.rawData) throw new Error('shiftExchange.rawData must be defined before calling iAmTheResponsiblePersonForThisIllness() [PLANO-19820]');
		return this.pShiftExchangeService.iAmTheResponsiblePersonForThisIllness(this.shiftExchange);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get warnings() : SchedulingApiWarnings {
		if (!this.shiftExchange.rawData) {
			this.console.error('shiftExchange.rawData must be defined before load warnings [PLANO-19820]');
			return new SchedulingApiWarnings(null, false);
		}
		return this.validationRelevantWarnings;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showSelectedSwapOffer() : boolean {
		const ENUM = SchedulingApiShiftExchangeCommunicationAction;
		if (!this.communication.rawData) throw new Error('showSelectedSwapOffer(): no rawData [PLANO-FE-VV]');
		if (this.communication.performAction === ENUM.IM_CHANGED_MIND_WANTS_SWAP_CP_ACCEPT) return true;
		return false;
	}
}
