/* NOTE: Dont make this file even bigger. Invest some time to cleanup/split into several files */
/* eslint max-lines: ["error", 1700] */
import { Subscription } from 'rxjs';
import { AfterContentInit, AfterContentChecked, ElementRef, OnDestroy } from '@angular/core';
import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormArray, UntypedFormArray } from '@angular/forms';
import { SLIDE_ON_NGIF_TRIGGER } from '@plano/animations';
import { ShiftItemViewStyles } from '@plano/client/scheduling/shared/p-scheduling-calendar/p-shift-item-module/shift-item/shift-item-styles';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { ToastsService } from '@plano/client/service/toasts.service';
import { BootstrapSize, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { DetailFormComponentInterface } from '@plano/client/shared/detail-form-component.interface';
import { PFormGroup } from '@plano/client/shared/p-forms/p-form-control';
import { PFormControl } from '@plano/client/shared/p-forms/p-form-control';
import { PInputDateTypes } from '@plano/client/shared/p-forms/p-input-date/p-input-date.component';
import { PMomentService } from '@plano/client/shared/p-moment.service';
import { PShiftExchangeConceptService } from '@plano/client/shared/p-shift-exchange/p-shift-exchange-concept.service';
import { PShiftExchangeService } from '@plano/client/shared/p-shift-exchange/shift-exchange.service';
import { PShiftPickerService } from '@plano/client/shared/p-shift-picker/p-shift-picker.service';
import { PossibleShiftPickerValueItemType } from '@plano/client/shared/p-shift-picker/p-shift-picker/p-shift-picker.component';
import { SectionWhitespace } from '@plano/client/shared/page/section/section.component';
import { SchedulingApiShiftExchange, GenerateShiftExchangesMode, GenerateAbsencesMode, GenerateAbsencesTimeSetting, GenerateAbsencesEarningSetting, SchedulingApiShiftExchangeShiftRefs } from '@plano/shared/api';
import { SchedulingApiService, SchedulingApiShifts, SchedulingApiMembers } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { SchedulingApiShiftExchangeCommunicationState, SchedulingApiShiftExchangeCommunicationAction, SchedulingApiShiftExchangeShiftRef, SchedulingApiShiftExchangeCommunicationSwapOffer, SchedulingApiShiftExchangeSwappedShiftRef, SchedulingApiShiftExchangeState, SchedulingApiAbsenceType } from '@plano/shared/api';
import { ShiftId } from '@plano/shared/api';
import { SchedulingApiWarnings } from '@plano/shared/api';
import { SchedulingApiMember, SchedulingApiShift, SchedulingApiAbsence } from '@plano/shared/api';
import { SchedulingApiShiftExchangeCommunications, SchedulingApiShiftExchangeCommunication, GenerateShiftExchangesOptions} from '@plano/shared/api';
import { ActionData } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '@plano/shared/core/null-type-utils';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { PPushNotificationsService, PRequestWebPushNotificationPermissionContext } from '@plano/shared/core/p-push-notifications.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PPossibleErrorNames, PValidatorObject } from '@plano/shared/core/validators.types';
import { MemberBadgeComponent } from '../../shared/p-member/member-badges/member-badge/member-badge.component';

type CommunicationCallbackFn = (item : SchedulingApiShiftExchangeCommunication) => boolean;

@Component({
	selector: 'p-detail-form',
	templateUrl: './shift-exchange-detail-form.component.html',
	styleUrls: ['./shift-exchange-detail-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	animations: [SLIDE_ON_NGIF_TRIGGER],
})
export class ShiftExchangeDetailFormComponent
implements AfterContentInit, AfterContentChecked, OnDestroy, DetailFormComponentInterface<SchedulingApiShiftExchange<'draft' | 'validated'>> {
	@Input() public item : SchedulingApiShiftExchange<'draft' | 'validated'> | null = null;

	@Output() public onClickReopenFormBtn : EventEmitter<SchedulingApiShiftExchange> = new EventEmitter<SchedulingApiShiftExchange>();

	@Output() public onAddItem : EventEmitter<SchedulingApiShiftExchange> = new EventEmitter<SchedulingApiShiftExchange>();

	constructor(
		public api : SchedulingApiService,
		private pFormsService : PFormsService,
		private pRouterService : PRouterService,
		public rightsService : RightsService,
		private validators : ValidatorsService,
		private meService : MeService,
		public pShiftExchangeConceptService : PShiftExchangeConceptService,
		private modalService : ModalService,
		private changeDetectorRef : ChangeDetectorRef,
		private console : LogService,
		private pShiftPickerService : PShiftPickerService,
		private toastsService : ToastsService,
		public pShiftExchangeService : PShiftExchangeService,
		private pPushNotificationsService : PPushNotificationsService,
		private pMoment : PMomentService,
		private localize : LocalizePipe,
	) {
	}

	public ShiftItemViewStyles = ShiftItemViewStyles;
	public BootstrapSize = BootstrapSize;
	public readonly Config = Config;
	public PlanoFaIconPool = PlanoFaIconPool;
	public PThemeEnum = PThemeEnum;
	public PInputDateTypes = PInputDateTypes;
	public SectionWhitespace = SectionWhitespace;
	public SchedulingApiAbsenceType = SchedulingApiAbsenceType;

	public formGroup : DetailFormComponentInterface['formGroup'] | null = null;
	public now ! : number;

	public daysBefore : number | null = null;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showSubstituteSearchAlertInsideForm() : boolean {
		return this.managerCreatesIllnessForSomeone && !!this.item && this.item.shiftRefs.length === 1;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public shiftIsPickable(shiftId : ShiftId) : boolean {
		if (this.shiftExchangeExistsForShift(shiftId)) return false;
		if (this.item!.shiftRefs.contains(shiftId)) return false;
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showCommunicationIllnessResponse() : boolean {
		if (!this.communicationIllnessResponses.length) return false;

		/** This communication is not interesting for other members then indisposedMember and managers */
		if (!this.iAmTheIndisposedMember && !this.isManagerForTheseShiftRefs) return false;
		return true;
	}

	private isSomeKindOfIllnessState(state : SchedulingApiShiftExchangeCommunicationState) : boolean {
		return this.pShiftExchangeConceptService.isSomeKindOfIllnessState(state);
	}

	public communicationIllnessResponses : (
		SchedulingApiShiftExchangeCommunication | SchedulingApiShiftExchangeCommunications
	)[] = [];
	private getCommunicationIllnessResponses() : (
		SchedulingApiShiftExchangeCommunication | SchedulingApiShiftExchangeCommunications
	)[] {
		const result : (SchedulingApiShiftExchangeCommunication | SchedulingApiShiftExchangeCommunications)[] = [];
		let communications = this.item!.communications;

		/** Each communication where member responded */
		communications = this.addCommunicationsByLastAction(
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			result, communications,
			[
				item => {
					if (!this.rightsService.isMe(item.communicationPartnerId)) return false;
					return this.isSomeKindOfIllnessState(item.communicationState);
				},
				item => this.isSomeKindOfIllnessState(item.communicationState),
			],
			false,
		);
		return result;
	}

	public communicationNonConfirmations : (
		SchedulingApiShiftExchangeCommunication | SchedulingApiShiftExchangeCommunications
	)[] = [];
	private getCommunicationNonConfirmations() : (
		SchedulingApiShiftExchangeCommunication | SchedulingApiShiftExchangeCommunications
	)[] {
		const result = [];
		const communicationConfirmations = this.getCommunicationIllnessResponses();
		let communications = this.item!.communications.filterBy(item => !communicationConfirmations.includes(item));

		/** Current users communication */
		const communicationItem = communications.findBy(item => !!this.isMe(item.communicationPartnerId));
		if (communicationItem) {
			result.push(communicationItem);
			communications = communications.filterBy(item => !communicationItem.id.equals(item.id));
		}

		communications = this.addCommunicationsByLastAction(
			result, communications,
			[

				/** Each successful communication */
				item => item.communicationState === SchedulingApiShiftExchangeCommunicationState.SWAP_SUCCESSFUL,
				item => item.communicationState === SchedulingApiShiftExchangeCommunicationState.TAKE_SUCCESSFUL,

				/** Each communication where member responded */
				item => {
					if (item.lastActionIsAGeneratedIndisposedAction) return false;
					if (item.lastAction === SchedulingApiShiftExchangeCommunicationAction.IM_NEEDS_RESPONSE) return false;
					if (item.communicationState === SchedulingApiShiftExchangeCommunicationState.CP_RESPONDED_NO) return false;
					return true;
				},
			],
			false,
		);

		communications = this.addCommunicationsByLastAction(
			result, communications,
			[

				/** Set of communications where members not responded yet */
				item => {
					if (item.lastActionIsAGeneratedIndisposedAction) return false;
					if (item.lastAction !== SchedulingApiShiftExchangeCommunicationAction.IM_NEEDS_RESPONSE) return false;
					return true;
				},

				/** Set of communications where members responded no */
				item => item.communicationState === SchedulingApiShiftExchangeCommunicationState.CP_RESPONDED_NO,

				/** Sets of communications where users can not */
				item => item.lastAction === SchedulingApiShiftExchangeCommunicationAction.CP_ASSIGNED_SAME_SHIFT,
				item => item.lastAction === SchedulingApiShiftExchangeCommunicationAction.CP_ASSIGNED_SAME_TIME,
				item => item.lastAction === SchedulingApiShiftExchangeCommunicationAction.CP_IS_ABSENT,
				item => item.lastAction === SchedulingApiShiftExchangeCommunicationAction.CP_IS_ILL,
			],
		);

		if (Config.DEBUG && communications.length > 0) this.console.error('communications should be empty');


		return result;
	}

	private addCommunicationsByLastAction(
		array : (SchedulingApiShiftExchangeCommunication | SchedulingApiShiftExchangeCommunications)[],
		communications : SchedulingApiShiftExchangeCommunications,
		fnInput : CommunicationCallbackFn | CommunicationCallbackFn[],
		addAsList : boolean = true,
	) : SchedulingApiShiftExchangeCommunications {
		const process = (
			_communications : SchedulingApiShiftExchangeCommunications,
			_fn : (communication : SchedulingApiShiftExchangeCommunication) => boolean,
		) : SchedulingApiShiftExchangeCommunications => {
			const communicationList = _communications.filterBy(_fn);
			if (!communicationList.length) return _communications;

			if (addAsList) {
				array.push(communicationList);
			} else {
				for (const communicationItem of communicationList.iterable()) {
					array.push(communicationItem);
				}
			}
			return _communications.filterBy(item => !communicationList.includes(item));
		};

		let result = communications;
		if (Array.isArray(fnInput)) {
			for (const fnItem of fnInput) {
				result = process(result, fnItem);
			}
		} else {
			result = process(result, fnInput as (communication : SchedulingApiShiftExchangeCommunication) => boolean);
		}
		return result;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftRefsIsDisabled() : boolean {
		return this.pShiftExchangeService.shiftRefsIsDisabled(this.item!);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get memberCreatesIllnessForSelf() : boolean {
		if (!this.item!.behavesAsNewItem) return false;
		if (!this.item!.isIllness) return false;
		if (!this.iAmTheIndisposedMember) return false;
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showIndisposedMemberCommentInMainForm() : boolean {
		// Someone creates an entry to exchange a shift - ok
		if (this.item!.isNewItem() && !this.item!.isIllness) return true;

		// Member without manager rights crates entry for him/herself - ok
		if (this.iAmTheIndisposedMember && !this.isManagerForTheseShiftRefs) return true;

		if (this.item!.indisposedMemberComment) return true;

		return false;
	}

	private get indisposedMemberCommentResponder() : string {
		assumeNonNull(this.item);
		if (this.item.isIllness) {
			return this.localize.transform('die Leitung');
		} else if (this.item.memberIdAddressedTo !== null) {
			const MEMBER_ID_ADDRESSED_TO = this.api.data.members.get(this.item.memberIdAddressedTo);
			if (MEMBER_ID_ADDRESSED_TO) return MEMBER_ID_ADDRESSED_TO.firstName;
			return this.localize.transform('Alle');
		} else {
			return this.localize.transform('die Mitarbeitenden');
		}
	}

	private get indisposedMemberCommentSender() : string | null {
		if (this.iAmTheIndisposedMember) {
			return this.localize.transform('dir');
		} else if (this.indisposedMember) {
			return this.indisposedMember.firstName;
		}
		return null;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get indisposedMemberCommentLabel() : string {

		if (!this.item) return '';

		if (!this.indisposedMemberCommentSender) {
			this.console.error('Something seems wrong here. indisposedMemberCommentSender should not be undefined');
			assumeNonNull(this.indisposedMemberCommentSender);
		}

		return this.localize.transform('Kommentar von ${sender} an ${responder}', {
			sender: this.indisposedMemberCommentSender,
			responder: this.indisposedMemberCommentResponder,
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get indisposedMember() : SchedulingApiMember | undefined {
		if (!this.api.isLoaded()) return undefined;

		if (!this.item) return undefined;
		if (this.item.indisposedMember) return this.item.indisposedMember;
		if (!this.item.isNewItem()) {
			this.console.error('Could not get indisposedMember');
		}
		return undefined;
	}

	private communicationSubscription : Subscription | null = null;
	private shiftRefsControlSubscriber : Subscription | null = null;

	public ngOnDestroy() : void {
		this.communicationSubscription?.unsubscribe();
		this.shiftRefsControlSubscriber?.unsubscribe();
	}

	public ngAfterContentInit() : void {
		this.meService.isLoaded(() => {
			this.initComponent();

			this.communicationNonConfirmations = this.getCommunicationNonConfirmations();
			this.communicationIllnessResponses = this.getCommunicationIllnessResponses();
			this.communicationSubscription = this.api.onChange.subscribe(() => {
				this.communicationNonConfirmations = this.getCommunicationNonConfirmations();
				this.communicationIllnessResponses = this.getCommunicationIllnessResponses();
			});
		});
	}

	private initNow() : void {
		this.now = +this.pMoment.m();
	}

	public ngAfterContentChecked() : void {
		this.initNow();
	}

	private get initialShiftPickerDate() : number {
		if (this.item!.shiftRefs.length) return +this.pMoment.m(this.item!.shiftRefs.earliestStart).startOf('day');
		return +this.pMoment.m().startOf('day');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public initValues() : void {
		this.initNow();

		this.pShiftPickerService.date = this.initialShiftPickerDate;
		assumeNonNull(this.item);
	}

	/**
	 * Initialize this components properties, PFormGroup etc.
	 */
	public initComponent(success ?: () => void) : void {
		this.initValues();
		this.initFormGroup();
		if (success) { success(); }

		// NOTE: currently there are no detail fields. but i probably need the following later
		// if (!this.item!.behavesAsNewItem) {
		// 	this.item!.loadDetailed({
		// 		success: () => {
		// 			this.initValues();
		// 			this.initFormGroup();
		// 			if (success) { success(); }
		// 		},
		// 	});
		// } else {
		// 	this.initValues();
		// 	this.initFormGroup();
		// 	if (success) { success(); }
		// }
	}

	private get managerCreatesIllnessForSomeone() : boolean {
		if (!this.item!.behavesAsNewItem) return false;
		if (this.iAmTheIndisposedMember) return false;
		if (!this.item!.isIllness) return false;
		return true;
	}

	/**
	 * Show modal when user switches from non-illness to illness
	 */
	public getIsIllnessHook(modalContent : ElementRef) : (() => void) | undefined {
		if (this.item!.behavesAsNewItem) return undefined;
		return this.modalService.getEditableHook(modalContent);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onEditModeChangeOnIsIllnessInput(input : boolean) : void {
		if (!this.formGroup) throw new Error('FormGroup is not defined here');
		if (input && !this.formGroup.get('indisposedMemberComment')!.disabled) {
			this.formGroup.get('indisposedMemberComment')!.setValue(undefined);
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showIndisposedMemberCommentInTurnToIllnessModal() : boolean {
		if (this.iAmTheIndisposedMember) return true;
		return !this.managerCreatesIllnessForSomeone;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get formIsDisabled() : boolean {
		return this.formIsDisabledForMember(this.meService.data.id);
	}

	/** FIXME: I left this public to make tests possible. */
	public formIsDisabledForMember(idOfAMember : Id) : boolean {
		if (this.item!.isClosed) return true;

		// NOTE: If iAmTheNewResponsiblePersonForThisIllness is defined, then the illness has been confirmed or declined.
		if (this.iAmTheNewResponsiblePersonForThisIllness !== null) {
			return !this.iAmTheNewResponsiblePersonForThisIllness;
		}
		if (this.item!.indisposedMemberId.equals(idOfAMember)) return false;

		// eslint-disable-next-line sonarjs/no-collapsible-if
		if (this.isManagerForTheseShiftRefs) {
			if (this.turnToIllnessIsPossible) return false;
			// // Manager has already turned it into a illness
			// if (this.iAmTheNewResponsiblePersonForThisIllness) return false;
			// // Managers probably want to turn it into a illness
			// if (!this.item!.isIllness) return false;
		}

		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showWillBeSentToManagersHint() : boolean {
		if (!this.item!.isIllness) return false;
		if (!this.iAmTheIndisposedMember) return false;
		if (this.isManagerForTheseShiftRefs) return false;
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isIllnessLabel() : string {
		if (this.iAmTheIndisposedMember) return this.localize.transform('Ich bin erkrankt und kann nicht arbeiten');
		return this.localize.transform('${name} ist erkrankt und kann nicht arbeiten', {
			name: this.item!.indisposedMember?.firstName ?? 'Die Person',
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public refreshTurnToIllnessIsPossible() : void {
		this.turnToIllnessIsPossible = this.getTurnToIllnessIsPossible();
	}

	private get controlIsIllnessIsDisabled() : boolean {

		// Backend dows not allow that a illness gets set to false when re-open it [PLANO-16352]
		if (this.item!.openShiftExchange && this.item!.isIllness) return true;

		if (this.formIsDisabled) return true;
		if (this.turnToIllnessIsPossible) return false;
		if (!this.pShiftExchangeService.isAllowedToEditIsIllness(this.item!)) return true;
		if (!this.iAmTheIndisposedMember) return true;
		return false;
	}

	private initShiftRefsControl(tempFormGroup : PFormGroup) : void {
		assumeNonNull(this.item);
		for (const shiftRef of this.item.shiftRefs.iterable()) {
			// eslint-disable-next-line @typescript-eslint/ban-types
			this.addItemToFormArray(tempFormGroup.get('shiftRefs') as UntypedFormArray, shiftRef);

			/** If its a existing shiftExchange, the api calls always send the necessary shifts */
			/** If its a new shiftExchange, the api calls must be filled with the ensureShifts param */
			if (this.item.isNewItem()) this.ensureShiftRefInNextApiCalls(shiftRef);
		}

		this.shiftRefsControlSubscriber = tempFormGroup.get('shiftRefs')!.valueChanges.subscribe(() => {
			tempFormGroup.get('memberIdAddressedTo')!.updateValueAndValidity();
			tempFormGroup.get('deadline')!.updateValueAndValidity();
			tempFormGroup.updateValueAndValidity();
			this.changeDetectorRef.detectChanges();
		});
	}

	/**
	 * Initialize the formGroup for this component
	 */
	public initFormGroup() : void {
		if (this.formGroup) { this.formGroup = null; }

		this.refreshTurnToIllnessIsPossible();

		const tempFormGroup = this.pFormsService.group({});

		assumeNonNull(this.item);

		this.pFormsService.addControl(tempFormGroup, 'indisposedMemberId',
			{
				value : this.item.indisposedMemberId,
				disabled : !this.api.isLoaded(),
			},
			[
				this.validators.required(this.item.attributeInfoIndisposedMemberId.primitiveType),
			],
			(value : Id) => {
				assumeNonNull(this.item);
				this.item.indisposedMemberId = value;
				this.initFormGroup();
			},
		);

		this.pFormsService.addControl(tempFormGroup, 'isIllness',
			{
				value : this.item.isIllness,
				disabled : this.controlIsIllnessIsDisabled,
			},
			[
				this.validators.required(this.item.attributeInfoIsIllness.primitiveType),
			],
			(value : boolean) => {
				assumeNonNull(this.item);
				if (this.item.isIllness === value) return;
				this.item.isIllness = value;
				if (value) {
					tempFormGroup.get('memberIdAddressedTo')!.setValue(null);
					tempFormGroup.get('indisposedMemberComment')!.setValue(undefined);
				}
				this.refreshDeadlineControlDisabledState();
				this.resetNonIllnessData();
				this.changeDetectorRef.detectChanges();
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'todoCount',
			{
				value : this.item.todoCount,
				disabled: !this.api.isLoaded(),
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'indisposedMemberId',
			{
				value : this.item.indisposedMemberId,
				disabled: true,
			},
			[
				this.validators.required(this.item.attributeInfoIndisposedMemberId.primitiveType),
				this.validators.idDefined(),
			],
			(value : Id) => {
				assumeNonNull(this.item);
				this.item.indisposedMemberId = value;
			},
		);
		this.pFormsService.addArray(tempFormGroup, 'shiftRefs', [],
			[
				this.validators.required(PApiPrimitiveTypes.any).fn,
				this.validators.minLength(1).fn,
			],
		);

		this.initShiftRefsControl(tempFormGroup);

		this.pFormsService.addControl(tempFormGroup, 'indisposedMemberPrefersSwapping',
			{
				value : this.item.indisposedMemberPrefersSwapping,
				disabled: this.formIsDisabled || !this.item.isNewItem(),
			},
			[
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					assumeNonNull(this.item);
					// FIXME: PLANO-15096
					if (this.item.isIllness) return null;
					return this.validators.required(this.item.attributeInfoIndisposedMemberPrefersSwapping.primitiveType).fn(control);
				}}),
			],
			(value : boolean) => {
				assumeNonNull(this.item);
				this.item.indisposedMemberPrefersSwapping = value;
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'deadline',
			{
				value : this.item.deadline,
				disabled: this.deadlineIsDisabled,
			},
			[
				this.validators.maxDecimalPlacesCount(0, PApiPrimitiveTypes.Integer),
				new PValidatorObject({name: PPossibleErrorNames.MIN, fn: (control) => {
					assumeNonNull(this.item);
					if (!this.item.shiftRefs.length) return null;
					assumeDefinedToGetStrictNullChecksRunning(this.now, 'now');
					const fn = this.validators.min(this.now, false, PApiPrimitiveTypes.DateExclusiveEnd).fn;
					return fn(control);
				}}),
				new PValidatorObject({name: PPossibleErrorNames.MAX, fn: (control) => {
					assumeNonNull(this.item);
					if (!this.item.shiftRefs.length) return null;
					const end = this.endOfLatestShift(this.item.shiftRefs) + 1;
					const fn = this.validators.max(end, false, PApiPrimitiveTypes.DateExclusiveEnd).fn;
					return fn(control);
				}}),
			],
			value => {
				this.item!.deadline = value ? +value : 0;
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'memberIdAddressedTo',
			{
				value : this.item.memberIdAddressedTo,
				disabled: this.formIsDisabled || !this.item.behavesAsNewItem && !this.iAmTheIndisposedMember,
			},
			[
				this.validators.required(this.item.attributeInfoMemberIdAddressedTo.primitiveType),
				new PValidatorObject({name: PPossibleErrorNames.ID_DEFINED, fn: (control) => {
					// FIXME: PLANO-15096
					if (this.assignableMembersForShiftRefs.length) return null;
					return this.validators.idDefined().fn(control);
				}}),
			],
			(value : Id) => {
				assumeNonNull(this.item);
				this.item.memberIdAddressedTo = value;
			},
		);

		const reportCommunication = this.item.communications.findBy(item => {
			return item.lastAction === SchedulingApiShiftExchangeCommunicationAction.A_REPORTED_ILLNESS;
		});

		this.pFormsService.addControl(tempFormGroup, 'illnessResponderCommentToMembers',
			{
				value : this.item.illnessResponderCommentToMembers,
				disabled: !!reportCommunication && !this.iAmTheNewResponsiblePersonForThisIllness,
			},
			[],
			(value : string) => {
				assumeNonNull(this.item);
				this.item.illnessResponderCommentToMembers = value;
			},
		);

		this.pFormsService.addControl(tempFormGroup, 'indisposedMemberComment',
			{
				value : this.item.indisposedMemberComment,
				disabled: this.formIsDisabled || !this.iAmTheIndisposedMember,
			},
			[],
			(value : string) => {
				assumeNonNull(this.item);
				this.item.indisposedMemberComment = value;
			},
		);

		this.pFormsService.addControl(tempFormGroup, 'generateAbsencesOptions',
			{
				value : this.item.generateAbsencesOptions,
				disabled: this.formIsDisabled,
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'generateShiftExchangesOptions',
			{
				value : this.item.generateShiftExchangesOptions,
				disabled: this.formIsDisabled,
			},
		);

		tempFormGroup.setValidators([
			(formGroup : AbstractControl) => {
				if (!formGroup.get('deadline')!.value) return null;
				if ((formGroup.get('shiftRefs') as FormArray<PFormControl>).length > 0) return null;
				return { noshiftrefs : true };
			},
		]);

		this.formGroup = tempFormGroup;
	}

	private refreshDeadlineControlDisabledState() : void {
		if (!this.formGroup) return;
		const deadlineControl = this.formGroup.get('deadline');
		if (!deadlineControl) return;
		this.deadlineIsDisabled ? deadlineControl.disable() : deadlineControl.enable();
	}

	private get deadlineIsDisabled() : boolean {
		if (this.formIsDisabled) return true;

		if (!this.item!.isIllness) {
			if (this.item!.behavesAsNewItem) return false;
			if (this.iAmTheIndisposedMember) return false;
			if (this.iAmTheNewResponsiblePersonForThisIllness) return false;
		}

		/** This is an illness */
		if (

			/** Members can not set deadlines for illness reports */
			this.iAmTheNewResponsiblePersonForThisIllness &&

			/** If it does behave as new item, the manager can set the deadline at the p-generate-shift-exchanges section */
			!this.item!.behavesAsNewItem
		) return false;
		return true;
	}

	private addShiftRefToFormArray(
		// eslint-disable-next-line @typescript-eslint/ban-types
		array : UntypedFormArray,
		value : SchedulingApiShiftExchangeShiftRef,
	) : void {
		this.ensureShiftRefInNextApiCalls(value);
		this.addItemToFormArray(array, value);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onAddShiftRefToFormArray(
		// eslint-disable-next-line @typescript-eslint/ban-types
		array : UntypedFormArray,
		value : PossibleShiftPickerValueItemType,
	) : void {
		if (!(value instanceof SchedulingApiShiftExchangeShiftRef)) throw new Error('Not implemented yet.');
		if (!this.item!.generateAbsencesOptions.generateItems) {
			this.addShiftRefToFormArray(array, value);
			return;
		}

		this.openGenerateOptionsResetWarning(() => {
			this.addShiftRefToFormArray(array, value);
		});
	}

	// eslint-disable-next-line @typescript-eslint/ban-types
	private addShiftToShiftRefs(formArray : UntypedFormArray, shiftId : ShiftId) : void {
		const newValue = this.item!.shiftRefs.createNewItem(shiftId);
		this.addShiftRefToFormArray(formArray, newValue);
	}

	/**
	 * Put selected shifts into PFormControl
	 */
	// eslint-disable-next-line @typescript-eslint/ban-types
	private addShiftsToFormArray(formArray : UntypedFormArray, selectedShifts : SchedulingApiShifts) : void {
		for (const selectedShift of selectedShifts.iterable()) {
			this.addShiftToShiftRefs(formArray, selectedShift.id);
			selectedShift.selected = false;
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onAddShiftsToFormArray(
		// eslint-disable-next-line @typescript-eslint/ban-types
		formArray : UntypedFormArray,
		shifts : SchedulingApiShifts,
	) : void {
		if (!this.item!.generateAbsencesOptions.generateItems) {
			this.addShiftsToFormArray(formArray, shifts);
			return;
		}

		this.openGenerateOptionsResetWarning(() => {
			this.addShiftsToFormArray(formArray, shifts);
		});
	}

	private openGenerateOptionsResetWarning(success ?: () => void) : void {
		this.modalService.confirm({
			modalTitle: this.localize.transform('Sicher?'),
			description: this.localize.transform('Wenn du weitere Schichten hinzufügst, werden deine vorgenommenen Einstellungen für Abwesenheitseinträge zurückgesetzt.'),
		}, {
			success: () => {
				this.item!.generateAbsencesOptions.reset();
				this.formGroup!.get('generateAbsencesOptions')!.setValue(this.item!.generateAbsencesOptions);
				if (success) success();
			},
		});
	}

	/**
	 * Make sure the next api calls serve the necessary shifts for all calculations etc.
	 */
	private addItemToFormArray(
		// eslint-disable-next-line @typescript-eslint/ban-types
		array : UntypedFormArray,
		value : PossibleShiftPickerValueItemType,
	) : void {
		const formControl = new PFormControl({
			formState: {
				value : value,
				disabled: this.shiftRefsIsDisabled,
			},
		});
		array.push(formControl);
	}

	/**
	 * Make sure the next api calls serve the necessary shifts for all calculations etc.
	 */
	private ensureShiftRefInNextApiCalls(
		value : PossibleShiftPickerValueItemType,
	) : void {
		if (value instanceof SchedulingApiShiftExchangeShiftRef) {
			this.pShiftPickerService.ensureShifts.push(value.id);
		} else if (value instanceof SchedulingApiShiftExchangeCommunicationSwapOffer) {
			for (const shiftRef of value.shiftRefs.iterable()) {
				this.pShiftPickerService.ensureShifts.push(shiftRef.id);
			}
		} else if (value instanceof SchedulingApiShiftExchangeSwappedShiftRef) {
			this.pShiftPickerService.ensureShifts.push(value.id);
		} else {
			throw new TypeError('Unsupported type in addItemToFormArray');
		}
	}

	private get sender() : string {
		// WARNING: This methods exists two times
		if (!this.iAmTheNewResponsiblePersonForThisIllness) {
			if (!this.item!.communications.managerResponseCommunication) {
				return this.localize.transform('der Leitung');
			}
			return this.item!.communications.managerResponseCommunication.communicationPartner!.firstName;
		}
		return this.localize.transform('dir');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get illnessResponderCommentToMembersLabel() : string {
		// WARNING: This methods exists two times
		return this.localize.transform('Kommentar von ${sender} an ${responder}', {
			sender: this.sender,
			responder: this.responder,
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public showIllnessResponderCommentToMembers(readMode : boolean) : boolean {
		if (readMode) return this.formGroup!.get('illnessResponderCommentToMembers')!.value;

		assumeNonNull(this.item);
		if (this.iAmTheNewResponsiblePersonForThisIllness && !this.item.behavesAsNewItem) return true;
		if (this.iAmTheIndisposedMember) return true;
		return false;
	}

	private get responder() : string {
		if (this.item!.memberIdAddressedTo !== null) {
			const MEMBER_ID_ADDRESSED_TO = this.api.data.members.get(this.item!.memberIdAddressedTo);
			if (MEMBER_ID_ADDRESSED_TO) return `${MEMBER_ID_ADDRESSED_TO.firstName}`;
		} else {
			return this.localize.transform('die Mitarbeitenden');
		}
		return '…';
	}

	// private setShiftExchangeShiftRefs(shiftRefs : SchedulingApiShiftExchangeShiftRefs) : void {
	// 	this.item!.shiftRefs.clear();
	// 	for (const shiftRef of shiftRefs.iterable()) {
	// 		this.item!.shiftRefs.createNewItem(shiftRef.id);
	// 	}
	// }

	private resetNonIllnessData() : void {
		if (!this.formGroup) throw new Error('FormGroup is not defined here');
		this.formGroup.get('indisposedMemberPrefersSwapping')!.setValue(undefined);
		this.formGroup.get('deadline')!.setValue(undefined);
	}

	/**
	 * Is the indisposed member equal to the logged in user?
	 */
	public isMe(id : Id | null) : boolean | undefined {
		if (id === null) return undefined;
		return this.rightsService.isMe(id);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get iAmTheIndisposedMember() : boolean {
		assumeNonNull(this.item);
		return this.pShiftExchangeService.iAmTheIndisposedMember(this.item);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get iAmTheNewResponsiblePersonForThisIllness() : boolean | null {
		return this.pShiftExchangeService.iAmTheNewResponsiblePersonForThisIllness(this.item!);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get iAmTheResponsiblePersonForThisIllness() : boolean {
		assumeNonNull(this.item);
		return this.pShiftExchangeService.iAmTheResponsiblePersonForThisIllness(this.item);
	}

	/**
	 * Close Item of this Detail page
	 */
	public closeItem() : void {
		this.formGroup = null;
		this.item!.closeShiftExchange = true;
		this.api.save({
			success: () => {
				this.initFormGroup();
			},
		});
	}

	// this.item!.openShiftExchange = true;

	/**
	 * Re-Open closed Item of this Detail page
	 */
	public reOpenForm() : void {
		assumeNonNull(this.item);
		if (this.pShiftExchangeService.blockedByMissingAssignmentWarningModal(this.item)) return;

		if (this.pShiftExchangeService.blockedByAssignmentProcessWarningModal(
			this.item.shiftRefs,
		)) return;

		this.formGroup = null;
		this.onClickReopenFormBtn.emit(this.item);
		this.initFormGroup();
	}

	private reOpenExistingItem() : void {
		this.api.mergeDataCopy();
		assumeNonNull(this.item);
		this.item.behavesAsNewItem = false;
		this.item.saveDetailed({
			success : () : void => {
				this.toastsService.addToast({
					content: this.localize.transform('Erfolgreich wiederhergestellt'),
					theme: PThemeEnum.SUCCESS,
				});
			},
			error: () : void => {
				this.toastsService.addToast({
					content: this.localize.transform('Fehler beim Wiederherstellen'),
					theme: PThemeEnum.DANGER,
				});
			},
		});

		this.pRouterService.navBack();
	}

	/**
	 * Save this item
	 */
	public saveItem() : void {
		assumeNonNull(this.item);
		if (!this.item.behavesAsNewItem) return;
		this.formGroup = null;

		if (!this.item.isNewItem()) {
			this.reOpenExistingItem();
			return;
		}

		this.generateItemsIfNecessary();

		this.onAddItem.emit(this.item);

		this.pRouterService.navBack();
	}

	private generateItemsIfNecessary() : void {
		assumeNonNull(this.item);

		if (this.generateAbsencesIsPossible && this.item.generateAbsencesOptions.generateItems) {

			/**
			 * NOTE: It is very important to run this.generateNewAbsences() before this.generateNewShiftExchanges()
			 * because generateNewShiftExchanges() manipulates item.shiftRefs
			 */
			this.generateNewAbsences();
		}

		if (this.generateShiftExchangesIsPossible && this.item.generateShiftExchangesOptions.mode !== null) {
			this.generateNewShiftExchanges(this.item);
		} else if (this.item.generateShiftExchangesOptions.deadline) {
			this.item.deadline = this.item.generateShiftExchangesOptions.deadline;
		}
	}

	/**
	 * Navigate to absence with given id
	 */
	public navToAbsence(absenceId : Id) : void {

		/** NOTE: This const is needed because otherwise the chrome dev tools get confused with syntax highlighting */
		const id = absenceId.toString();
		this.pRouterService.navigate([`/client/absence/${id}`]);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftsForShiftPicker() : SchedulingApiShifts {
		if (this.api.isBackendOperationRunning) return new SchedulingApiShifts(null, false);
		return this.api.data.shifts.filterBy(item => {
			// User can only provide shifts for exchange where IM is assigned.
			// In the case that another user has made a swapOffer, the indisposedMember gets more shifts than the ones
			// that he/she can put in shiftRefs.
			if (
				this.item!.indisposedMember &&
				!item.assignedMemberIds.contains(this.item!.indisposedMemberId)
			) {
				return false;
			}

			// Is in the past
			if (item.end < this.now) return false;

			return true;
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get allShiftRefsAreInThePast() : boolean {
		assumeNonNull(this.item);
		const itemInTheFuture = this.item.shiftRefs.findBy(item => {
			// Is in the future
			if (item.end > this.now) return true;
			return false;
		});
		return !itemInTheFuture;
	}

	/**
	 * Determine if this shift should be disabled
	 */
	public shiftExchangeExistsForShift(shiftId : ShiftId) : boolean {

		if (!this.item) return false;
		if (this.api.data.shiftExchanges.getByShiftAndMember(shiftId, this.item.indisposedMemberId)) return true;
		return false;
	}

	/**
	 * A list of all assignable members for this ShiftRef
	 * Assignable are members that are assignable to each and every of the provided shiftRefs
	 */
	public get assignableMembersForShiftRefs() : SchedulingApiMembers {
		const members = new SchedulingApiMembers(null, false);
		for (const assignableMember of this.item!.shiftRefs.assignableMembers.iterable()) {
			// Is this the indisposed member?
			if (this.item!.indisposedMemberId.equals(assignableMember.memberId)) continue;
			const member = this.api.data.members.get(assignableMember.memberId);
			if (member === null) throw new Error('Could not find assignable member');
			members.push(member);
		}

		return members;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get everyoneRespondedNo() : boolean {
		for (const communication of this.item!.communications.iterable()) {
			if (!this.pShiftExchangeConceptService.getActionData(communication.lastAction)!.equivalentToRespondedNo) {
				return false;
			}
		}

		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isManagerForTheseShiftRefs() : boolean | undefined {
		if (!this.meService.isLoaded()) {
			this.console.error('meService is not loaded yet > leads to [PLANO-17845] [PLANO-FE-59]');
			return undefined;
		}
		return this.rightsService.hasManagerRightsForAllShiftRefs(this.item!.shiftRefs);
	}

	private getShiftRefsForThisShiftRef(
		shiftRef : SchedulingApiShiftExchangeShiftRef,
	) : SchedulingApiShiftExchangeShiftRefs {
		const shiftRefs = new SchedulingApiShiftExchangeShiftRefs(null, false);
		shiftRefs.push(shiftRef);
		return shiftRefs;
	}

	/**
	 * Get a number of days, turn it into milliseconds and remove it from the given timestamp
	 */
	public removeDaysFromTimestamp(timestamp : number | null, daysBefore : number | null) : number {
		assumeDefinedToGetStrictNullChecksRunning(daysBefore, 'daysBefore');
		assumeDefinedToGetStrictNullChecksRunning(timestamp, 'timestamp');
		// WARNING: This method is duplicated somewhere
		const daysAsDuration = this.pMoment.duration(+daysBefore, 'days');
		const daysAsTimestamp = +daysAsDuration;
		return +this.pMoment.m(timestamp - daysAsTimestamp).add(1, 'day').startOf('day');
	}

	/**
	 * Some users want to generate multiple shiftExchanges from one illness report.
	 * This Method takes the related shiftRefs and generates an array,
	 * which has as much items as the user wants shiftExchanges.
	 */
	private shiftRefsArrayToCreateNewShiftExchanges(
		options : GenerateShiftExchangesOptions,
	) : SchedulingApiShiftExchangeShiftRefs[] {

		assumeNonNull(options.mode, 'options.mode', 'mode should have been set here');
		assumeNonNull(this.item);
		switch (options.mode) {
			case null :
				return [this.item.shiftRefs];
			case GenerateShiftExchangesMode.ONE_SHIFT_EXCHANGE_FOR_EACH :
				const result = [];
				for (const shiftRef of this.item.shiftRefs.iterable()) {
					result.push(this.getShiftRefsForThisShiftRef(shiftRef));
				}
				return result;
			case GenerateShiftExchangesMode.ONE_SHIFT_EXCHANGE_FOR_EACH_PACKAGE :
				const resultListOfShiftRefs : SchedulingApiShiftExchangeShiftRefs[] = [];
				for (const shiftRef of this.item.shiftRefs.iterable()) {
					// Is this shift no Packet? Make one shiftExchange from it.
					const shift = this.api.data.shifts.get(shiftRef.id);
					if (shift === null) throw new Error('Could not find shift');
					const shiftRefIsAPacket : boolean = !!shift.packetShifts.length;

					// This shift is not a Packet? Simply push it.
					if (!shiftRefIsAPacket) {
						resultListOfShiftRefs.push(this.getShiftRefsForThisShiftRef(shiftRef));
						continue;
					}

					const tryToAddItToExistingShiftRefs = () : boolean => {
						// This shift is a Packet? Try to find a existing list inside resultListOfLists and push it there.
						for (const existingShiftRefs of resultListOfShiftRefs) {
							const hasShiftRefOfSamePacket : boolean = !!existingShiftRefs.findBy(item => shiftRef.id.isSamePacket(item.id));
							if (!hasShiftRefOfSamePacket) continue;
							existingShiftRefs.push(shiftRef);
							return true;
						}
						return false;
					};

					const wasPossible = tryToAddItToExistingShiftRefs();
					if (wasPossible) continue;

					// Could not find a existing list for it. So create a new one.
					resultListOfShiftRefs.push(this.getShiftRefsForThisShiftRef(shiftRef));
				}
				return resultListOfShiftRefs;
		}
	}

	private duplicateShiftExchangeFromOriginalShiftExchange(
		sourceItem : SchedulingApiShiftExchange,
	) : SchedulingApiShiftExchange {
		const result = this.api.data.shiftExchanges.createNewItem();

		result.illnessResponderCommentToMembers = sourceItem.illnessResponderCommentToMembers;
		result.indisposedMemberComment = sourceItem.indisposedMemberComment;
		result.indisposedMemberId = sourceItem.indisposedMemberId;
		result.isIllness = sourceItem.isIllness;
		result.indisposedMemberPrefersSwapping = false;

		return result;
	}

	private get needsReview() : boolean {
		assumeNonNull(this.item);
		return this.item.state === SchedulingApiShiftExchangeState.ILLNESS_NEEDS_CONFIRMATION;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get generateShiftExchangesIsPossible() : boolean {
		assumeNonNull(this.item);
		// Only Managers can do this
		if (!this.isManagerForTheseShiftRefs) return false;
		// Only illnesses can produce absences
		if (!this.item.isIllness) return false;
		// // If manager wants to create new several items he can do that manually.
		// if (this.item!.behavesAsNewItem) return false;
		if (this.item.shiftRefs.length < 1) return false;

		// Admin crates new Item or reopens existing item? Ok!
		if (this.item.behavesAsNewItem) return true;
		// Manager is about to confirm?
		if (this.needsReview) return true;
		// Manager wants to turn existing non-illness shiftExchange into illness shiftExchange?
		if (
			this.item.state === SchedulingApiShiftExchangeState.ACTIVE &&
			!this.item.communications.managerResponseCommunication
		) return true;

		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get generateAbsencesIsPossible() : boolean {
		assumeNonNull(this.item);
		// Only illnesses can produce absences
		if (!this.item.isIllness) return false;

		// Managers con not create absences - only owners can.
		if (!this.rightsService.isOwner) return false; // if (!this.isManagerForTheseShiftRefs) return false;

		// wurden schon welche erstellt?
		if (this.item.relatedAbsences.length) return false;

		// Admin crates new Item or reopens existing item? Ok!
		if (this.item.behavesAsNewItem) return true;
		// Admin turns members non-illness into illness? Ok!
		if (!this.item.communications.managerResponseCommunication) return true;

		return false;
	}

	/**
	 * NOTE: It is very important to run this.generateNewAbsences() before this.generateNewShiftExchanges()
	 * because generateNewShiftExchanges() manipulates item.shiftRefs
	 */
	private generateNewShiftExchanges(sourceItem : SchedulingApiShiftExchange) : void {

		// get an array with as much items as we need shiftExchanges.
		const shiftRefsArray = this.shiftRefsArrayToCreateNewShiftExchanges(sourceItem.generateShiftExchangesOptions);

		if (shiftRefsArray.length === 1) {
			this.setDeadline(sourceItem, sourceItem);
			return;
		}

		let originalShiftExchangeHasBeenRecycled = false;
		for (const shiftRefs of shiftRefsArray) {
			// We want to keep the original shiftExchange as one of the new shiftExchanges.
			// For this loop we take the one with equal earliestStart as the original item.
			if (!originalShiftExchangeHasBeenRecycled && shiftRefs.earliestStart === sourceItem.shiftRefs.earliestStart) {
				this.setDeadline(sourceItem, sourceItem);
				originalShiftExchangeHasBeenRecycled = true;
				continue;
			}
			const newItem = this.duplicateShiftExchangeFromOriginalShiftExchange(sourceItem);
			for (const shiftRef of shiftRefs.iterable()) {
				newItem.shiftRefs.push(shiftRef);
				sourceItem.shiftRefs.removeItem(shiftRef);
			}
			this.setDeadline(newItem, sourceItem);
		}

		const orderedShiftExchangeAmount = shiftRefsArray.length;
		// Imagine this is a illness report from a member, which an admin approves.
		// The 'original' shiftExchange from the member will be re-used/transformed into one of the new/admin-generated shiftExchanges
		const recyclableShiftExchangeAmount = this.item!.isNewItem() ? 0 : 1;
		// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
		const deliveredShiftExchangeAmount = this.api.data.shiftExchanges.filterBy(item => item.isNewItem()).length + recyclableShiftExchangeAmount;
		if (orderedShiftExchangeAmount !== deliveredShiftExchangeAmount) {
			this.console.error(`It looks like the user ordered »${orderedShiftExchangeAmount}« different shiftExchanges, but got »${deliveredShiftExchangeAmount}«`);
		}
	}

	/**
	 * Take the options from sourceItem and define the deadline for the newItem
	 */
	private setDeadline(newItem : SchedulingApiShiftExchange, sourceItem : SchedulingApiShiftExchange) : void {
		let newDeadline : number;
		if (sourceItem.generateShiftExchangesOptions.deadline) {
			newDeadline = +sourceItem.generateShiftExchangesOptions.deadline;
		} else if (sourceItem.generateShiftExchangesOptions.daysBefore) {
			newDeadline = this.removeDaysFromTimestamp(
				newItem.shiftRefs.earliestStart,
				sourceItem.generateShiftExchangesOptions.daysBefore,
			);
		}
		newItem.deadline = newDeadline! > 0 ? newDeadline! : 0;
	}

	private generateNewAbsence(shiftRef : SchedulingApiShiftExchangeShiftRef | null = null) : void {
		const options = this.item!.generateAbsencesOptions;
		const newAbsence : SchedulingApiAbsence = this.api.data.absences.createNewItem();
		newAbsence.shiftExchangeId = this.item!.id;
		newAbsence.memberId = this.item!.indisposedMemberId;
		newAbsence.type = SchedulingApiAbsenceType.ILLNESS;

		let shift : SchedulingApiShift | null = null;
		if (shiftRef) shift = this.api.data.shifts.get(shiftRef.id);

		if (!options.paid) {
			newAbsence.hourlyEarnings = 0;
		} else if (options.earningSetting === GenerateAbsencesEarningSetting.OVERWRITE_EARNING) {
			newAbsence.hourlyEarnings = options.earningsPerHour;
		} else if (options.earningSetting === GenerateAbsencesEarningSetting.TAKE_EARNING_FROM_EACH_SHIFT) {
			assumeDefinedToGetStrictNullChecksRunning(shift, 'shift');
			newAbsence.hourlyEarnings = shift.assignableMembers.get(this.item!.indisposedMemberId)!.hourlyEarnings;
		}

		if (options.timeSetting === GenerateAbsencesTimeSetting.OVERWRITE_DURATION) {
			if (options.mode === GenerateAbsencesMode.ONE_ABSENCE_FOR_ALL) {
				newAbsence.workingTimePerDay = options.averageWorkingTimePerDay;
				if (options.averageWorkingTimePerDay) {
					newAbsence.time.start = +this.pMoment.m(options.absenceStartDate).startOf('day');
					newAbsence.time.end = +this.pMoment.m(options.absenceEndDate).startOf('day').add(1, 'day');
				}
			} else {
				newAbsence.workingTimePerDay = options.averageWorkingTimePerDay;
				newAbsence.time.start = +this.pMoment.m(shiftRef!.id.start).startOf('day');

				/**
				 * NOTE: shiftRef.id.end currently sends us the end of a day and does not include the exact time of the shift.
				 * I do some calculations here just to make sure our code wont break if in the future .end will send the exact
				 * time.
				 * NOTE: This also correctly handles the case that shiftRef.id.end includes time but shift ends at midnight.
				 */
				const startOfDayOfEnd = +this.pMoment.m(shiftRef!.id.end).startOf('day');
				const newEnd = shiftRef!.id.end === startOfDayOfEnd ? startOfDayOfEnd : +this.pMoment.m(startOfDayOfEnd).add(1, 'day');

				newAbsence.time.end = newEnd;
			}
		} else if (options.timeSetting === GenerateAbsencesTimeSetting.TAKE_DURATION_FROM_SHIFT) {
			if (options.mode === GenerateAbsencesMode.ONE_ABSENCE_FOR_ALL) {
				assumeDefinedToGetStrictNullChecksRunning(options.absenceStartDate, 'options.absenceStartDate');
				assumeDefinedToGetStrictNullChecksRunning(options.absenceEndDate, 'options.absenceEndDate');
				newAbsence.time.start = options.absenceStartDate;
				newAbsence.time.end = options.absenceEndDate;
			} else {
				newAbsence.time.start = shift!.start;
				newAbsence.time.end = shift!.end;
			}
		}

		assumeDefinedToGetStrictNullChecksRunning(options.visibleToTeamMembers, 'options.visibleToTeamMembers');
		newAbsence.visibleToTeamMembers = options.visibleToTeamMembers;
	}

	private generateNewAbsences() : void {
		assumeNonNull(this.item);
		if (this.item.shiftRefs.length === 1) {
			const firstShiftRef = this.item.shiftRefs.get(0);
			this.generateNewAbsence(firstShiftRef);
		} else if (this.item.generateAbsencesOptions.mode === GenerateAbsencesMode.ONE_ABSENCE_FOR_ALL) {
			this.generateNewAbsence();
		} else if (this.item.generateAbsencesOptions.mode === GenerateAbsencesMode.ONE_ABSENCE_FOR_EACH) {
			for (const shiftRef of this.item.shiftRefs.iterable()) {
				this.generateNewAbsence(shiftRef);
			}
		} else {
			throw new Error('unknown GenerateAbsencesMode');
		}
	}

	private askForNotificationPermissionIfNecessary(clickedActionData : ActionData) : void {
		if (!this.pShiftExchangeService.actionIsOfTypeA_ACCEPT_WITH_SHIFT_EXCHANGE(clickedActionData.action)) return;

		this.pPushNotificationsService.requestWebPushNotificationPermission(
			PRequestWebPushNotificationPermissionContext.ILLNESS_ACCEPTED_WITH_SHIFT_EXCHANGE,
		);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onPerformActionModalSuccess(clickedActionData : ActionData) : void {
		this.formGroup = null;

		this.askForNotificationPermissionIfNecessary(clickedActionData);

		const navigationHasBeenTriggered = this.handleCannotAction(clickedActionData);
		if (!navigationHasBeenTriggered) this.formGroup = null;
		this.generateItemsIfNecessary();

		this.api.mergeDataCopy();

		// This has been set inside communication-Modal component
		// communication.performAction = clickedActionData.action;

		this.api.save({
			success: () => {
				if (!navigationHasBeenTriggered) this.initFormGroup();
			},
		});
	}

	/**
	 * To make denying multiple items as quick as possible we navigate after this action
	 * Returns true if navigation has been done
	 */
	private handleCannotAction(clickedActionData : ActionData) : boolean {
		if (clickedActionData.action !== SchedulingApiShiftExchangeCommunicationAction.CP_NOT_RESPONDED_CP_CANNOT) {
			return false;
		}
		this.pRouterService.navBack();

		// It can be confusing when people not instantly see the new state. So with this toast we make sure they feel safe.
		const text : string = this.localize.transform('Du hast die Ersatzsuche von ${name} abgelehnt.', {
			name: this.item!.indisposedMember!.firstName,
		});
		this.toastsService.addToast({
			content: text,
			theme: PThemeEnum.INFO,
		});
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onPerformActionModalDismiss() : void {
		this.api.dismissDataCopy();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showDeadline() : boolean {
		if (!this.deadlineIsDisabled) return true;
		if (this.item!.deadline) return true;
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public showIsIllnessCheckbox(readMode : boolean) : boolean {
		if (readMode) return false;
		// NOTE: Member wants to edit one of its shiftExchanges
		if (!this.formGroup!.get('isIllness')!.disabled) return true;
		if (this.isManagerForTheseShiftRefs && !this.item!.isNewItem()) return true;
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isExpired() : boolean {

		if (!this.item) return false;
		if (this.item.isNewItem()) return false;
		return this.deadlineIsInThePast;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get deadlineIsInThePast() : boolean {

		if (!this.item) return false;
		if (!this.item.rawData) return false;
		if (!this.item.deadline) return false;

		if (this.item.deadline <= this.now) return true;
		return false;
	}

	public turnToIllnessIsPossible : boolean | null = null;
	private getTurnToIllnessIsPossible() : boolean | null {
		if (this.item!.isIllness) return false;
		if (this.item!.behavesAsNewItem) return false;
		if (this.iAmTheIndisposedMember) return null;
		if (this.iAmTheNewResponsiblePersonForThisIllness) return null;
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get infoBoxEditButtonText() : string | undefined {
		if (Config.IS_MOBILE) return undefined;
		if (!this.turnToIllnessIsPossible) return undefined;
		return this.localize.transform('In Krankmeldung umwandeln');
	}

	/**
	 * FIXME: This is a hack because the .setErrors(…) in p-generate-absences-options does not make this components
	 * PFormGroup invalid
	 */
	public get formIsInvalid() : boolean {
		if (!this.formGroup) return true;
		if (this.api.isUpdatingWarnings) return true;
		if (this.api.hasFatalApiWarning) return true;
		if (this.formGroup.get('generateAbsencesOptions')!.errors) return true;
		if (this.formGroup.get('generateShiftExchangesOptions')!.errors) return true;
		return this.formGroup.invalid;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get nonMemberRelatedWarnings() : SchedulingApiWarnings {
		return this.warnings.filterBy(item => {
			if (!item.attributeInfoConcernsMemberId.value) return true;
			return false;
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get warnings() : SchedulingApiWarnings {
		return this.api.data.warnings;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get sortedShiftRefs() : SchedulingApiShiftExchangeShiftRef[] {
		return this.item!.shiftRefs.iterableSortedBy((item : SchedulingApiShiftExchangeShiftRef) => {
			const shift = this.api.data.shifts.get(item.id);
			if (!shift) return new Error('[PLANO-FE-SJ]');
			return shift.start;
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public endOfLatestShift(shiftRefs : SchedulingApiShiftExchangeShiftRefs) : number {
		let result : number | null = null;
		// Ret the latest end
		for (const shiftRef of shiftRefs.iterable()) {
			const end = shiftRef.end;
			if (result && result > end) continue;
			result = end;
		}
		const pMoment = new PMomentService(Config.LOCALE_ID);
		return +pMoment.m(result).startOf('day');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get warningsForOfferRecipient() : SchedulingApiWarnings {
		assumeNonNull(this.item);
		if (this.item.newAssignedMemberId ) {
			assumeDefinedToGetStrictNullChecksRunning(this.item.newAssignedMemberId, 'item.newAssignedMemberId');
			return this.warnings.getByMember(this.item.newAssignedMemberId);
		}
		assumeDefinedToGetStrictNullChecksRunning(this.item.memberIdAddressedTo, 'item.memberIdAddressedTo');
		return this.warnings.getByMember(this.item.memberIdAddressedTo);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get daysBeforeLabel() : string {
		if (this.item!.shiftRefs.length <= 1) return this.localize.transform('${days} vor Schicht', {
			days : this.daysBefore === 1 ? 'Tag' : 'Tage',
		});
		return this.localize.transform('${days} vor letzter Schicht', {
			days : this.daysBefore === 1 ? 'Tag' : 'Tage',
		});
	}

	/**
	 * Get the absence type to show the right icon in member-badge
	 */
	public get absenceType() : MemberBadgeComponent['absenceType'] {
		assumeNonNull(this.item);
		if (this.item.responsibleMember!.trashed) return 'trashed';
		if (this.item.isBasedOnIllness) {
			if (this.item.indisposedMemberId.equals(this.item.responsibleMemberId)) return SchedulingApiAbsenceType.ILLNESS;
			return null;
		}
		return null;
	}

	/**
	 * The icon that describes the type of entry
	 */
	public get headlineIcon() : 'briefcase-medical' | 'hands-helping' {
		assumeNonNull(this.item);
		if (this.item.isIllness && !this.item.isBasedOnIllness) return 'briefcase-medical';
		return 'hands-helping';
	}

	/**
	 * A icon for the member badge at the indisposed members shift(s)
	 */
	public get absenceTypeForBadgeForShiftsOfIndisposedMember() : MemberBadgeComponent['absenceType'] {
		if (this.indisposedMember!.trashed) return 'trashed';
		if (this.item!.isIllness) {
			if (this.headlineIcon === 'briefcase-medical') return null;
			return SchedulingApiAbsenceType.ILLNESS;
		}
		return null;
	}
}
