/* NOTE: Dont make this file even bigger. Invest some time to cleanup/split into several files */
/* eslint max-lines: ["error", 1600] */


/* eslint-disable @angular-eslint/component-selector */
import { SubscriptionLike as ISubscription } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, EventEmitter, Output, ViewChild, TemplateRef } from '@angular/core';
import { Input } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup} from '@angular/forms';
import { UntypedFormArray } from '@angular/forms';
import { FormArrayWithFormGroups } from '@plano/client/scheduling/shared/p-bookings/booking-item/booking-details-modal/p-tariff-input/p-tariff-input.component';
import { BookingsService } from '@plano/client/scheduling/shared/p-bookings/bookings.service';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { BootstrapSize } from '@plano/client/shared/bootstrap-styles.enum';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { DetailFormComponentInterface } from '@plano/client/shared/detail-form-component.interface';
import { PFormGroup } from '@plano/client/shared/p-forms/p-form-control';
import { PInputDateTypes } from '@plano/client/shared/p-forms/p-input-date/p-input-date.component';
import { PShiftmodelTariffService } from '@plano/client/shared/p-forms/p-shiftmodel-tariff.service';
import { PTabsTheme } from '@plano/client/shared/p-tabs/p-tabs/p-tabs.component';
import { SectionWhitespace } from '@plano/client/shared/page/section/section.component';
import { SchedulingApiShifts, SchedulingApiShift, SchedulingApiShiftModelCourseTariff, SchedulingApiTransactions, SchedulingApiTransaction } from '@plano/shared/api';
import { SchedulingApiShiftModelCoursePaymentMethod} from '@plano/shared/api';
import { SchedulingApiShiftModelCourseTariffs } from '@plano/shared/api';
import { SchedulingApiBooking, SchedulingApiBookingParticipant } from '@plano/shared/api';
import { ShiftId } from '@plano/shared/api';
import { SchedulingApiService, SchedulingApiTransactionPaymentMethodType, ExportTransactionsExcelApiService } from '@plano/shared/api';
import { SchedulingApiBookingState, SchedulingApiCourseType, SchedulingApiPaymentMethodType, SchedulingApiBookingDesiredDateSetting } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { Id } from '@plano/shared/api/base/id';
import { AsyncValidatorsService } from '@plano/shared/core/async-validators.service';
import { FaIcon } from '@plano/shared/core/component/fa-icon/fa-icon-types';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PCurrencyPipe } from '@plano/shared/core/pipe/p-currency.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PValidationErrors} from '@plano/shared/core/validators.types';
import { PPossibleErrorNames, PValidatorObject } from '@plano/shared/core/validators.types';
import { PParticipantsService } from './p-participants/p-participants.service';
import { assume, assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../shared/core/null-type-utils';
import { ModalContentOptions } from '../../../shared/core/p-modal/modal-default-template/modal-default-template.component';
import { BookingTransactionFormComponent } from '../../sales/shared/booking-transaction-form/booking-transaction-form.component';
import { TransactionsSortedByEmum } from '../../sales/transactions/transactions.component';
import { SchedulingApiBookable } from '../../scheduling/shared/api/scheduling-api-bookable.service';
import { PExportService } from '../../shared/p-export.service';
import { DropdownTypeEnum } from '../../shared/p-forms/p-dropdown/p-dropdown.component';
import { PRadiosRadioComponent } from '../../shared/p-forms/p-radios/p-radios-radio/p-radios-radio.component';
import { PTabSizeEnum } from '../../shared/p-tabs/p-tabs/p-tab/p-tab.component';
import { PBookingFormService } from '../booking-form.service';

@Component({
	selector: 'detail-form',
	templateUrl: './detail-form.component.html',
	styleUrls: ['./detail-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class DetailFormComponent implements OnDestroy, AfterContentInit, DetailFormComponentInterface<SchedulingApiBooking<'validated' | 'draft'>> {
	@Input() public item : SchedulingApiBooking<'draft' | 'validated'> | null = null;
	@Output() public onAddItem : EventEmitter<SchedulingApiBooking> = new EventEmitter<SchedulingApiBooking>();

	constructor(
		public api : SchedulingApiService,
		private validators : ValidatorsService,
		private asyncValidators : AsyncValidatorsService,
		private pRouterService : PRouterService,
		private pFormsService : PFormsService,
		private pParticipantsService : PParticipantsService,
		private pShiftmodelTariffService : PShiftmodelTariffService,
		private pBookingFormService : PBookingFormService,
		private console : LogService,
		public bookingsService : BookingsService,
		private localize : LocalizePipe,
		private modalService : ModalService,
		private pCurrencyPipe : PCurrencyPipe,
		private localizePipe : LocalizePipe,
		public exportTransactionsApi : ExportTransactionsExcelApiService,
		private pExport : PExportService,
	) {
	}

	public Config = Config;
	public formGroup : DetailFormComponentInterface['formGroup'] = null;
	public exportIsRunning : boolean = false;

	@ViewChild('bookingTransactionFormModal', { static: true }) public bookingTransactionFormModal ! : TemplateRef<unknown>;

	public PlanoFaIconPool = PlanoFaIconPool;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;
	public PInputDateTypes = PInputDateTypes;
	public PTabsTheme = PTabsTheme;
	public SectionWhitespace = SectionWhitespace;
	public TransactionsSortedByEmum = TransactionsSortedByEmum;
	public PTabSizeEnum = PTabSizeEnum;
	public SchedulingApiBookingState = SchedulingApiBookingState;
	public PThemeEnum = PThemeEnum;
	public BootstrapSize = BootstrapSize;
	public PPossibleErrorNames = PPossibleErrorNames;
	public SchedulingApiPaymentMethodType = SchedulingApiPaymentMethodType;
	public DropdownTypeEnum = DropdownTypeEnum;

	public ngAfterContentInit() : void {
		this.initComponent();
	}

	/**
	 * Load and set everything that is necessary for this component
	 */
	public initComponent(success ?: () => void) : void {
		if (!this.item) return;

		if (!this.item.isNewItem()) {
			this.initValues();
			this.initFormGroup();
			if (success) { success(); }
		} else {
			this.initValues();
			if (this.item.attributeInfoShiftModelId.value !== null) {
				this.initFormGroup();
				if (success) { success(); }
			}
		}
	}

	/**
	 * Should paymentMethods be visible or not?
	 */
	public get showPaymentMethods() : boolean | null {
		assumeNonNull(this.item);
		if (!this.item.rawData) return null;
		if (this.item.model.coursePaymentMethods.hasUntrashedItem && this.courseTariffsForList.length) return true;
		if ((this.item.paymentMethodId ) !== null) return true;
		return false;
	}

	/**
	 * Check if course is ONLINE_INQUIRY
	 */
	public get courseIsOnlineInquiry() : boolean | null {
		assumeNonNull(this.item);
		return this.item.model.courseType === SchedulingApiCourseType.ONLINE_INQUIRY;
	}

	/**
	 * Init all necessary values for this class
	 */
	public initValues() : void {
		assumeNonNull(this.item, 'booking', 'booking-form needs booking');

		this.initialState = this.item.state;
		if (this.item.attributeInfoWantsNewsletter.value === null) {
			this.item.wantsNewsletter = false;
		}
		if (this.item.isNewItem() && !this.item.courseSelector) {
			this.item.courseSelector = null;
		}
	}

	private initialState : SchedulingApiBookingState | null = null;
	private initParticipants() : FormArray<FormGroup> {
		const array = new FormArray<FormGroup>([], [
			(control : AbstractControl) : PValidationErrors | null => {
				assumeNonNull(this.item);
				if (this.item.model.onlyWholeCourseBookable) return null;
				return this.validators.required(PApiPrimitiveTypes.ApiList).fn(control);
			},
			(control : AbstractControl) : PValidationErrors | null => {
				assumeNonNull(this.item);
				if (this.item.model.onlyWholeCourseBookable) return null;
				const min = 1;
				assume(control instanceof UntypedFormArray, 'control instanceof FormArray', `Unexpected control type ${typeof control}`);
				if (control.controls.length >= min) return null;
				return { [PPossibleErrorNames.MIN] : {
					name: PPossibleErrorNames.MIN,
					primitiveType: PApiPrimitiveTypes.ApiList,
					min : min,
					actual : this.item.participants.length,
				} };
			},
		]);

		assumeNonNull(this.item);
		for (const participant of this.item.participants.iterable()) {
			this.pParticipantsService.initParticipant(this.item, participant, array);
		}

		return array;
	}

	private refreshIsParticipantDisabledState(formGroup : FormGroup | null) : void {
		assumeNonNull(this.item);
		if (this.item.isNewItem()) return;
		if (!formGroup) return;
		if (!formGroup.get('bookingPerson')) return;
		const isParticipant = formGroup.get('bookingPerson')!.get('isParticipant');
		if (!isParticipant) return;

		if (this.item.participants.length === 1 && this.bookingPersonParticipant) {
			if (isParticipant.enabled) isParticipant.disable({ emitEvent: false });
		} else {
			if (isParticipant.disabled) isParticipant.enable({ emitEvent: false });
		}
	}

	private get bookingPersonParticipant() : SchedulingApiBookingParticipant | null {
		// FIXME: not sure if this is necessary…
		if (!this.api.isLoaded()) return null;

		assumeNonNull(this.item);
		return this.item.participants.iterable().find(item => item.isBookingPerson) ?? null;
	}

	private subscriptions : ISubscription[] = [];

	/** ngOnDestroy */
	public ngOnDestroy() : void {
		for (const subscription of this.subscriptions) subscription.unsubscribe();
	}

	/**
	 * Initialize the formGroup for this component
	 */
	// eslint-disable-next-line sonarjs/cognitive-complexity, max-lines-per-function
	public initFormGroup() : void {
		assumeNonNull(this.item);
		assumeNonNull(this.item.rawData, 'booking.rawData', 'Booking is lost');

		if (this.formGroup) { this.formGroup = null; }
		const tempFormGroup = this.pFormsService.group({});
		tempFormGroup.addControl('participants', this.initParticipants());

		this.subscriptions.push(tempFormGroup.get('participants')!.valueChanges.subscribe(() => {
			this.refreshIsParticipantDisabledState(tempFormGroup);
		}));

		this.pFormsService.addControl(tempFormGroup, 'state',
			{
				value : this.item.state,
				disabled: false,
			},
			[this.validators.required(this.item.attributeInfoState.primitiveType)],
			(value : SchedulingApiBookingState) => {
				assumeNonNull(this.item);
				if (this.item.state === value) return;

				this.item.state = value;
				tempFormGroup.get('desiredDate')!.updateValueAndValidity();
				if (!this.item.isNewItem()) {
					if (value === SchedulingApiBookingState.INQUIRY_DECLINED) {
						tempFormGroup.get('courseSelector')!.disable();
					} else {
						tempFormGroup.get('courseSelector')!.enable();
					}
				}
				tempFormGroup.get('courseSelector')!.updateValueAndValidity();
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'currentlyPaid',
			{
				value : this.item.currentlyPaid,
				disabled: !this.item.attributeInfoCurrentlyPaid.canEdit,
			},
			[
				this.validators.required(this.item.attributeInfoCurrentlyPaid.primitiveType),
			],
		);
		this.pFormsService.addControl(tempFormGroup, this.item.attributeInfoPaymentMethodId.id,
			{
				value : this.item.paymentMethodId,
				disabled: this.item.isFreeBooking && !this.item.isNewItem() && !this.item.attributeInfoPaymentMethodId.canEdit,
			},
			[
				...this.item.attributeInfoPaymentMethodId.validations.map(item => item()).
					filter((item) : item is PValidatorObject => item instanceof PValidatorObject),
			],
			(value : Id | null) => {
				assumeNonNull(this.item);

				// FIXME: PLANO-35541 Next line is probably obsolete when PLANO-35541 is done
				if (this.item.paymentMethodId === null && !value) return;

				if (this.item.paymentMethodId?.equals(value)) return;
				this.item.paymentMethodId = value;


				// HACK: hacky hacky hacky müde
				tempFormGroup.updateValueAndValidity();
				if (!this.item.isNewItem()) {
					this.item.saveDetailed();
				}

			},
		);

		this.pFormsService.addControl(tempFormGroup, 'courseSelector',
			{
				value : this.item.courseSelector,
				disabled: !this.item.isNewItem() && this.item.state === SchedulingApiBookingState.INQUIRY_DECLINED,
			},
			[
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					assumeNonNull(this.item);
					// FIXME: PLANO-15096
					if (!this.courseSelectorIsRequired(this.item.model.bookingDesiredDateSetting, this.item.desiredDate)) return null;
					return this.validators.required(this.item.attributeInfoCourseSelector.primitiveType).fn(control);
				}}),
				new PValidatorObject({name: PPossibleErrorNames.ID_DEFINED, fn: (control) => {
					assumeNonNull(this.item);
					// FIXME: PLANO-15096
					if (!this.courseSelectorIsRequired(this.item.model.bookingDesiredDateSetting, this.item.desiredDate)) return null;
					return this.validators.idDefined().fn(control);
				}}),
			],
			(value : ShiftId | null) => {
				const success = () : void => {
					assumeNonNull(this.item);
					this.item.courseSelector = value;
					if (tempFormGroup.get('desiredDate')) {
						tempFormGroup.get('desiredDate')!.updateValueAndValidity();
					}
				};

				/**
				 * set form value and temporary related shift if new booking
				 * this is necessary because new bookings don’t have the firstShiftStart and firstShiftEnd info
				 * we need the shift-info to show it in the booking details
				 */
				assumeNonNull(this.item);
				if (!(value as unknown) || !value) {
					this.item.courseSelector = null;
					if (this.item.isNewItem() && this.item.state !== SchedulingApiBookingState.INQUIRY && !this.item.desiredDate) tempFormGroup.get('state')!.setValue(undefined);
				} else if (!this.item.courseSelector!.equals(value)) {
					assumeDefinedToGetStrictNullChecksRunning(value.start, 'value.start');
					if (this.allSelectedTariffsAreAvailable(value.start)) {
						success();
					} else {
						this.modalService.confirm({
							modalTitle: this.localize.transform('Sicher?'),
							description: this.localize.transform('Ein oder mehrere ausgewählte Tarife sind zu diesem Zeitpunkt nicht verfügbar.'),
							closeBtnLabel: this.localize.transform('Ja'),
							dismissBtnLabel: this.localize.transform('Abbrechen'),
						}, {
							success: success,
							dismiss: () => {
								this.api.deselectAllSelections();
							},
							theme: PThemeEnum.WARNING,
							size: BootstrapSize.SM,
						});
					}
				}
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'desiredDate',
			{
				value : this.item.desiredDate,
				disabled: false,
			},
			[
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					assumeNonNull(this.item);
					// FIXME: PLANO-15096
					const SETTING = this.item.model.bookingDesiredDateSetting;
					if (
						// user can not define desiredDate
						SETTING === SchedulingApiBookingDesiredDateSetting.DESIRED_DATE_NOT_ALLOWED
					) return null;
					if (this.item.courseSelector !== null) return null;
					return this.validators.required(this.item.attributeInfoDesiredDate.primitiveType).fn(control);
				}}),
			],
			(value : string) => {
				assumeNonNull(this.item);
				if (!(this.item.desiredDate !== value && tempFormGroup.get('courseSelector'))) return;
				this.item.desiredDate = value;
				tempFormGroup.get('courseSelector')!.updateValueAndValidity();
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'participantCount',
			{
				value : this.item.participantCount,
				disabled: false,
			},
			[
				this.validators.maxDecimalPlacesCount(0, this.item.attributeInfoParticipantCount.primitiveType),
				new PValidatorObject({name: PPossibleErrorNames.MIN, fn: (control) => {
					assumeNonNull(this.item);

					// FIXME: PLANO-15096
					if (
						this.item.model.onlyWholeCourseBookable &&
						control.value <= 0
					) {
						return { min : { name: PPossibleErrorNames.MIN, primitiveType: PApiPrimitiveTypes.number } };
					}
					return null;
				}}),
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					assumeNonNull(this.item);

					// FIXME: PLANO-15096
					if (
						this.item.model.onlyWholeCourseBookable
					) {
						return this.validators.required(this.item.attributeInfoParticipantCount.primitiveType).fn(control);
					}
					return null;
				}}),
			],
			(value : number) => {
				assumeNonNull(this.item);
				if (this.item.participantCount === +value) return;
				this.item.participantCount = +value;
				assumeNonNull(this.formGroup);
				if (this.formGroup.controls[this.item.attributeInfoPaymentMethodId.id]) {
					this.formGroup.controls[this.item.attributeInfoPaymentMethodId.id]!.updateValueAndValidity();
				}
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'ageMin',
			{
				value : this.item.ageMin,
				disabled: false,
			},
			[
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					assumeNonNull(this.item);

					// FIXME: PLANO-15096
					if (this.item.model.onlyWholeCourseBookable) {
						return this.validators.required(this.item.attributeInfoAgeMin.primitiveType).fn(control);
					}
					return null;
				}}),
				new PValidatorObject({name: PPossibleErrorNames.MAX, fn: (control) => {
					assumeNonNull(this.item);

					if (this.item.ageMax === null) return null;

					// FIXME: PLANO-15096
					if (this.item.ageMax < control.value) {
						return this.validators.max(this.item.ageMax, true, this.item.attributeInfoAgeMin.primitiveType).fn(control);
					}
					return null;
				}}),
				this.validators.maxDecimalPlacesCount(0, this.item.attributeInfoAgeMin.primitiveType),
			],
			(value : number) => {
				assumeNonNull(this.item);

				if (this.item.ageMin !== value) {
					this.item.ageMin = +value;
				}
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'ageMax',
			{
				value : this.item.ageMax,
				disabled: false,
			},
			[
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					assumeNonNull(this.item);

					// FIXME: PLANO-15096
					if (this.item.model.onlyWholeCourseBookable) {
						return this.validators.required(this.item.attributeInfoAgeMax.primitiveType).fn(control);
					}
					return null;
				}}),
				new PValidatorObject({name: PPossibleErrorNames.MIN, fn: (control) => {
					assumeNonNull(this.item);

					if (this.item.ageMin === null) return null;

					// FIXME: PLANO-15096
					if (control.value < this.item.ageMin) {
						return this.validators.min(this.item.ageMin, true, this.item.attributeInfoAgeMax.primitiveType).fn(control);
					}
					return null;
				}}),
				this.validators.maxDecimalPlacesCount(0, this.item.attributeInfoAgeMax.primitiveType),
			],
			(value : number) => {
				assumeNonNull(this.item);

				if (this.item.ageMax !== value) {
					this.item.ageMax = +value;
				}
			},
		);

		this.pFormsService.addControl(tempFormGroup, 'attended',
			{
				value : this.item.attended,
				disabled: false,
			},
			[],
			(value : boolean) => {
				assumeNonNull(this.item);

				this.item.attended = value;
			},
		);

		this.pFormsService.addControl(tempFormGroup, 'overallTariffId',
			{
				value : this.item.overallTariffId,
				disabled: false,
			},
			[
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					// FIXME: PLANO-15096
					if (!this.courseTariffsForList.length) return null;

					// TODO: We need the same rules in participant > tariffId as in bookingPerson > tariffId as in overallTariffId
					if (!this.hasInBookingPluginVisibleTariff) return null;

					assumeNonNull(this.item);
					if (!(this.item.model.onlyWholeCourseBookable)) return null;
					return this.validators.required(this.item.attributeInfoOverallTariffId.primitiveType).fn(control);
				}}),
				new PValidatorObject({name: PPossibleErrorNames.ID_DEFINED, fn: (control) => {
					assumeNonNull(this.item);

					// FIXME: PLANO-15096
					if (!this.courseTariffsForList.length) return null;
					if (!(this.item.model.onlyWholeCourseBookable)) return null;

					return this.validators.idDefined().fn(control);
				}}),
			],
			(value : Id) => {
				assumeNonNull(this.item);

				assumeDefinedToGetStrictNullChecksRunning(this.item.overallTariffId, 'booking.overallTariffId');

				if (this.item.overallTariffId.equals(value)) return;
				this.item.overallTariffId = value;

				assumeNonNull(this.formGroup);
				const additionalFieldValue = this.formGroup.get('additionalFieldValue');
				if (additionalFieldValue) {
					if (!!this.formGroup.get('additionalFieldValue')!.value) {
						this.formGroup.get('additionalFieldValue')!.setValue('');
					}
					additionalFieldValue.updateValueAndValidity();
				}
				const control = this.formGroup.get(this.item.attributeInfoPaymentMethodId.id);
				control?.updateValueAndValidity();
			},
		);

		this.pFormsService.addControl(tempFormGroup, 'isFreeCourse',
			{
				value: this.isFreeCourse,
				disabled: false,
			},
		);

		this.pParticipantsService.initCourseTariffs(
			tempFormGroup,
			this.item,

			// NOTE:
			// If this is a "onlyWholeCourseBookable" type if booking, the applyToParticipant param needs to be set to
			// null because the courseTariffs formArray is bound to the overallTariffId input.
			// Otherwise it must be set to the id of the booking participant because then the courseTariffs formArray gets
			// used for the booking persons tariffId input.
			this.item.model.onlyWholeCourseBookable ? null : this.bookingPersonParticipant,

			this.selectedTariffId,
		);

		for (const formGroup of (tempFormGroup.get('courseTariffs') as unknown as FormArray<FormGroup>).controls) {
			this.subscriptions.push(formGroup.valueChanges.subscribe(() => {
				assumeNonNull(this.item);
				if (tempFormGroup.controls[this.item.attributeInfoPaymentMethodId.id]) {
					tempFormGroup.controls[this.item.attributeInfoPaymentMethodId.id]!.updateValueAndValidity();
				}
			}));
		}

		this.pFormsService.addControl(tempFormGroup, 'ownerComment',
			{
				value : this.item.ownerComment,
				disabled: false,
			},
			[],
			(value : string) => {
				assumeNonNull(this.item);
				this.item.ownerComment = value;
			},
		);

		this.pBookingFormService.initFormControlAdditionalFieldValue(
			tempFormGroup,
			this.item,
			this.item,
			this.item.model.courseTariffs,
		);

		tempFormGroup.addControl('bookingPerson', this.initBookingPersonFormGroup());

		this.formGroup = tempFormGroup;
	}

	private isFreeCourse() : boolean | undefined {
		if (!this.item) return undefined;
		return this.pShiftmodelTariffService.isFreeCourse(
			this.item.model.courseTariffs,
			this.item.model.coursePaymentMethods,
		);
	}

	private initBookingPersonFormGroup() : FormGroup {
		let participant = this.bookingPersonParticipant;
		if (!participant) {
			participant = new SchedulingApiBookingParticipant(null);
		}
		assumeNonNull(this.item);
		return this.getParticipantFormGroup(this.item, participant);
	}

	/**
	 * Initialize the formGroup for one participant
	 */
	// eslint-disable-next-line sonarjs/cognitive-complexity, max-lines-per-function
	public getParticipantFormGroup(
		booking : SchedulingApiBooking,
		participant : SchedulingApiBookingParticipant,
	) : FormGroup {
		const tempFormGroup : FormGroup = this.pFormsService.group({});
		this.pFormsService.addControl(tempFormGroup, 'reference',
			{
				value: participant,
				disabled: false,
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'id',
			{
				value: participant.id,
				disabled: false,
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'isBookingPerson',
			{
				value: participant.isBookingPerson,
				disabled: false,
			},
		);

		this.pFormsService.addControl(tempFormGroup, 'firstName',
			{
				value: booking.firstName,
				disabled: false,
			},
			[this.validators.required(booking.attributeInfoFirstName.primitiveType)],
			(value : string) => {
				booking.firstName = value;
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'lastName',
			{
				value : booking.lastName,
				disabled: false,
			},
			[
				this.validators.required(booking.attributeInfoLastName.primitiveType),
			],
			(value : string) => {
				booking.lastName = value;
			},
		);
		this.pFormsService.addControlByAttInfo(tempFormGroup, booking.attributeInfoDateOfBirth);
		this.pFormsService.addControl(tempFormGroup, 'email',
			{
				value : booking.email,
				disabled: false,
			},
			[
				this.validators.required(booking.attributeInfoEmail.primitiveType),
				this.validators.email(),
			],
			(value : string) => {
				booking.email = value;
			},
			this.asyncValidators.emailValidAsync(),
		);
		this.pFormsService.addControl(tempFormGroup, 'postalCode',
			{
				value : booking.postalCode,
				disabled: false,
			},
			[
				this.validators.required(booking.attributeInfoPostalCode.primitiveType),
				this.validators.plz(),
			],
			(value : string) => {
				booking.postalCode = value;
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'city',
			{
				value : booking.city,
				disabled: false,
			},
			[
				this.validators.required(booking.attributeInfoCity.primitiveType),
			],
			(value : string) => {
				booking.city = value;
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'streetAndHouseNumber',
			{
				value : booking.streetAndHouseNumber,
				disabled: false,
			},
			[
				this.validators.required(booking.attributeInfoStreetAndHouseNumber.primitiveType),
			],
			(value : string) => {
				booking.streetAndHouseNumber = value;
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'phoneMobile',
			{
				value : booking.phoneMobile,
				disabled: false,
			},
			[this.validators.required(booking.attributeInfoPhoneMobile.primitiveType)],
			(value : string) => {
				booking.phoneMobile = value;
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'phoneLandline',
			{
				value : booking.phoneLandline,
				disabled: false,
			},
			[],
			(value : string) => {
				booking.phoneLandline = value;
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'company',
			{
				value : booking.company,
				disabled: false,
			},
			[],
			(value : string) => {
				booking.company = value;
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'wantsNewsletter',
			{
				value : booking.wantsNewsletter,
				disabled: false,
			},
			[this.validators.required(booking.attributeInfoWantsNewsletter.primitiveType)],
			(value : boolean) => {
				booking.wantsNewsletter = value;
			},
		);

		this.pFormsService.addControl(tempFormGroup, 'isParticipant',
			{
				value : !!this.bookingPersonParticipant,
				disabled: (
					!booking.isNewItem() && booking.participants.length === 1 && !!this.bookingPersonParticipant
				),
			},
			[
				this.validators.required(PApiPrimitiveTypes.string),
			],
			(value : boolean) => {
				assumeNonNull(this.formGroup);
				// eslint-disable-next-line @typescript-eslint/ban-types
				const array = this.formGroup.get('participants') as UntypedFormArray | null;
				if (value) {
					const newParticipant = booking.participants.createNewItem();
					newParticipant.isBookingPerson = true;
					if (array) {
						const FORM_GROUP = this.pParticipantsService.getParticipantFormGroup(booking, newParticipant);
						array.push(FORM_GROUP);
					}

					assumeNonNull(this.item);
					// Refresh the course tariffs because they need the new participant’s id for setChangeSelectors()
					this.pParticipantsService.initCourseTariffs(
						this.formGroup,
						this.item,
						newParticipant,
						this.selectedTariffId,
					);

					if (tempFormGroup.get('tariffId')) tempFormGroup.get('tariffId')!.updateValueAndValidity();
				} else {
					tempFormGroup.get('tariffId')!.setValue(null);
					assumeNonNull(this.bookingPersonParticipant);
					booking.participants.removeItem(this.bookingPersonParticipant);
					if (array) {
						const control = array.controls.find(item => (item as PFormGroup).get('isBookingPerson')!.value) ?? null;
						assumeNonNull(control);
						const index = array.controls.indexOf(control);
						array.removeAt(index);
					}
				}
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'tariffId',
			{
				value: this.bookingPersonParticipant ? this.bookingPersonParticipant.tariffId : null,
				disabled: false,
			},
			[
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					// FIXME: PLANO-15096

					// TODO: 	We need the same rules in participant > tariffId as in bookingPerson > tariffId as in overallTariffId
					if (!this.hasInBookingPluginVisibleTariff) return null;

					// TODO: Add note why next line is necessary
					if (!tempFormGroup.get('isParticipant')!.value) return null;

					if (this.validators.required(PApiPrimitiveTypes.Id).fn(control)) return this.validators.required(PApiPrimitiveTypes.Id).fn(control);
					if (this.validators.idDefined().fn(control)) return this.validators.idDefined().fn(control);
					return null;
				}}),
			],
			(value : Id) => {
				if (this.bookingPersonParticipant) this.bookingPersonParticipant.tariffId = value;
				if (tempFormGroup.get('additionalFieldValue')) {
					if (tempFormGroup.get('additionalFieldValue')!.value) {
						tempFormGroup.get('additionalFieldValue')!.setValue('');
					}
					tempFormGroup.get('additionalFieldValue')!.updateValueAndValidity();
				}
			},
		);

		const objWthTariffId = participant;
		this.pFormsService.addControl(tempFormGroup, 'additionalFieldValue',
			{
				value: this.bookingPersonParticipant ? this.bookingPersonParticipant.additionalFieldValue : undefined,
				disabled: false,
			},
			[
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					assumeDefinedToGetStrictNullChecksRunning(objWthTariffId, 'objWthTariffId');
					if ((objWthTariffId.tariffId ) && participant instanceof SchedulingApiBooking) return null;

					const TARIFF_ID = (objWthTariffId.tariffId );
					if (TARIFF_ID === null) return null;
					const tariff = booking.model.courseTariffs.get(TARIFF_ID);
					assumeNonNull(tariff);
					const LABEL = tariff.additionalFieldLabel;
					if (!LABEL) return null;

					if (this.validators.required(PApiPrimitiveTypes.Id).fn(control)) return this.validators.required(PApiPrimitiveTypes.string).fn(control);

					return null;
				}}),
			],
			(value : string) => {
				if (!this.bookingPersonParticipant) {
					this.console.warn('could not getBookingPersonParticipant');
					return;
				}
				// eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
				this.bookingPersonParticipant.additionalFieldValue = value ? value : '';
			},
		);

		return tempFormGroup;
	}


	private get hasInBookingPluginVisibleTariff() : boolean | undefined {
		if (!this.item) return undefined;
		return this.pShiftmodelTariffService.hasInBookingPluginVisibleTariff(this.item.model.courseTariffs);
	}

	private get selectedTariffId() : Id | null {
		let selectedTariffId : Id | null = null;
		assumeNonNull(this.item);
		if (this.item.model.onlyWholeCourseBookable) {
			selectedTariffId = this.item.overallTariffId;
		} else {
			selectedTariffId = this.bookingPersonParticipant?.tariffId ?? null;
		}
		return selectedTariffId;
	}

	/**
	 * Check if courseSelector must be defined
	 */
	private courseSelectorIsRequired(
		bookingDesiredDateSetting : SchedulingApiBookingDesiredDateSetting,
		desiredDate : SchedulingApiBooking['desiredDate'],
	) : boolean {
		assumeNonNull(this.item);
		// user can not define desiredDate
		if (this.item.state === SchedulingApiBookingState.BOOKED || this.item.state === SchedulingApiBookingState.CANCELED) return true;
		if (this.item.state === SchedulingApiBookingState.INQUIRY) {
			if (bookingDesiredDateSetting === SchedulingApiBookingDesiredDateSetting.DESIRED_DATE_NOT_ALLOWED) return false;
			return !desiredDate?.length;
		} else {
			if (bookingDesiredDateSetting === SchedulingApiBookingDesiredDateSetting.DESIRED_DATE_NOT_ALLOWED) return true;
			if (!desiredDate?.length) return true;
		}
		return false;
	}

	/**
	 * Should the "desired date" input be visible?
	 */
	public get showDesiredDate() : boolean {
		assumeNonNull(this.item);
		const SETTING = this.item.model.bookingDesiredDateSetting;
		return SETTING !== SchedulingApiBookingDesiredDateSetting.DESIRED_DATE_NOT_ALLOWED;
	}

	/**
	 * @see PCurrencyPipe['getPaymentMethodIcon']
	 */
	public paymentMethodIcon(paymentMethod : SchedulingApiShiftModelCoursePaymentMethod) : FaIcon | null {
		if (paymentMethod.type === SchedulingApiPaymentMethodType.PAYPAL) return PlanoFaIconPool.BRAND_PAYPAL;
		return this.pCurrencyPipe.getPaymentMethodIcon(paymentMethod.type, paymentMethod.name);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public paymentMethodIsDisabled(paymentMethod : SchedulingApiShiftModelCoursePaymentMethod) : boolean {
		if (!this.api.isLoaded()) return false;

		if (paymentMethod.type === SchedulingApiPaymentMethodType.PAYPAL) {
			return !this.api.data.isPaypalAvailable;
		} else if (paymentMethod.type === SchedulingApiPaymentMethodType.ONLINE_PAYMENT) {
			return !this.api.data.isOnlinePaymentAvailable;
		}

		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get overallTariff() : SchedulingApiShiftModelCourseTariff | undefined {
		assumeNonNull(this.item);
		if (this.item.overallTariffId === null) return undefined;
		const tariff = this.item.model.courseTariffs.get(this.item.overallTariffId);
		if (!tariff) return undefined;

		return tariff;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get canEditSomeTransactions() : boolean {
		if (this.item!.isNewItem()) return false;
		return this.api.data.transactions.some(item => item.attributeInfoThis.canEdit);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get courseTariffsForList() : SchedulingApiShiftModelCourseTariffs {
		const emptyList : SchedulingApiShiftModelCourseTariffs =
			new SchedulingApiShiftModelCourseTariffs(null, false);
		if (!this.formGroup) return emptyList;
		if (!this.formGroup.get('overallTariffId')) return emptyList;
		assumeNonNull(this.item);
		if (
			!this.item.isNewItem() &&
			this.item.model.onlyWholeCourseBookable &&
			this.item.overallTariffId === null
		) {
			return emptyList;
		}

		return this.pParticipantsService.courseTariffsForList(
			this.item,
			this.formGroup.get('overallTariffId')!.value,
		);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get stateDisabled() : boolean {
		assumeNonNull(this.item);
		if (this.item.isNewItem()) return false;
		assumeNonNull(this.formGroup);
		if (this.formGroup.invalid || this.formGroup.get('state')!.disabled) return true;
		return false;
	}

	private get courseSelectorDefined() : boolean {
		assumeNonNull(this.formGroup);
		return this.formGroup.get('courseSelector')!.value !== null;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get stateInquiryDeclinedDisabled() : boolean {
		if (this.stateDisabled) return true;
		return !this.courseSelectorDefined && !this.formGroup!.get('desiredDate')!.value;
	}

	/**
	 * Should the control for state BOOKED be disabled?
	 */
	public get stateBookedDisabled() : boolean {
		if (this.stateDisabled) return true;
		if (this.stateBookedDisabledHint !== null) return true;
		return false;
	}

	/**
	 * Text that describes why control for state CANCELED is disabled
	 */
	public get stateBookedDisabledHint() : PRadiosRadioComponent['cannotEditHint'] {
		if (!this.courseSelectorDefined || this.item!.allShiftsRemoved) return 'Bitte verknüpfe zuerst diese Buchung mit einem Angebot, bevor du diesen Status setzt.';
		return null;
	}

	/**
	 * Should the control for state CANCELED be disabled?
	 */
	public get stateCanceledDisabled() : boolean {
		if (this.stateDisabled) return true;
		if (this.stateCanceledDisabledHint !== null) return true;
		return false;
	}

	/**
	 * Text that describes why control for state CANCELED is disabled
	 */
	public get stateCanceledDisabledHint() : PRadiosRadioComponent['cannotEditHint'] {
		assumeNonNull(this.item);
		if (this.item.state === SchedulingApiBookingState.INQUIRY_DECLINED) return 'Nur Buchungen mit dem Status »gebucht« können storniert werden.';
		if (this.item.state === SchedulingApiBookingState.INQUIRY) return 'Anfragen können nur auf »abgelehnt« oder »gebucht«, aber nicht auf »storniert« gesetzt werden. Nur verbindliche Buchungen dürfen »storniert« werden.';
		if (!this.courseSelectorDefined) return 'Bitte verknüpfe zuerst diese Buchung mit einem Angebot, bevor du diesen Status setzt.';
		return null;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get storniertDisabled() : boolean {
		if (this.stateDisabled) return true;
		assumeNonNull(this.formGroup);
		const isSomeKindOfInquiry = !(
			this.formGroup.get('state')!.value !== SchedulingApiBookingState.INQUIRY_DECLINED &&
			this.formGroup.get('state')!.value !== SchedulingApiBookingState.INQUIRY
		);
		if (isSomeKindOfInquiry) return true;
		return false;
	}

	/**
	 * Get shifts
	 */
	public get shiftsForShiftPicker() : SchedulingApiShifts | undefined {
		if (!this.api.isLoaded()) return undefined;
		return this.api.data.shifts.filterBy((shift : SchedulingApiShift) => {
			if (!shift.shiftModelId.equals(this.item!.shiftModelId)) return false;

			if (shift.isCourseCanceled) return false;

			// Is no packet? Show it!
			if (shift.packetShifts.length === 0) return true;

			// Find Id of the first shift in this packet
			let firstPacketShiftId : ShiftId | null = null;
			for (const packetShift of shift.packetShifts.iterable()) {
				if (!firstPacketShiftId || packetShift.id.shiftIndex < firstPacketShiftId.shiftIndex) {
					firstPacketShiftId = packetShift.id;
				}
			}
			// Is this shift the first item in this packet? Show it!
			return shift.id.equals(firstPacketShiftId);
		});
	}

	/**
	 * Save this item
	 */
	public saveItem() : void {
		assumeNonNull(this.item);
		if (!this.item.isNewItem()) return;
		this.onAddItem.emit(this.item);
		this.pRouterService.navBack();
	}

	/**
	 * Check if this component is fully loaded.
	 * Can be used to show skeletons/spinners then false.
	 */
	public get isLoaded() : boolean {
		assumeNonNull(this.item);
		if (!this.item.attributeInfoShiftModelId.value) return false;
		if (!this.formGroup) return false;
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getAdditionalFieldLabel(id : Id | null) : string | null {
		assumeNonNull(this.item);
		return this.pBookingFormService.getAdditionalFieldLabel(id, this.item);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showAdditionalFieldAtBookingPersonForm() : boolean {
		assumeNonNull(this.item);
		if (this.item.model.onlyWholeCourseBookable) return false;

		assumeNonNull(this.formGroup);
		const BOOKING_PERSON = this.formGroup.get('bookingPerson') as PFormGroup;
		const TARIFF_ID = BOOKING_PERSON.get('tariffId')!.value;
		if (!this.getAdditionalFieldLabel(TARIFF_ID)) return false;
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showAdditionalFieldAtBookingForm() : boolean {
		assumeNonNull(this.item);
		if (!this.item.model.onlyWholeCourseBookable) return false;

		assumeNonNull(this.formGroup);
		const TARIFF_ID = this.formGroup.get('overallTariffId')!.value;
		if (!this.getAdditionalFieldLabel(TARIFF_ID)) return false;
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get participantIsValid() : boolean {
		assumeNonNull(this.formGroup);
		return (
			!this.formGroup.get('overallTariffId')!.invalid &&
			!this.formGroup.get('courseTariffs')!.invalid &&
			!this.formGroup.get('participantCount')!.invalid &&
			!this.formGroup.get('ageMin')!.invalid &&
			!this.formGroup.get('ageMax')!.invalid &&
			!this.formGroup.get('additionalFieldValue')!.invalid
		);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public paymentMethodDescription(paymentMethod : SchedulingApiShiftModelCoursePaymentMethod) : string | null {
		if (!paymentMethod.isInternal) return null;
		return this.localize.transform('Interne Zahlungsart');
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public tariffNotAvailableThatTime(
		tariff : Parameters<PShiftmodelTariffService['tariffIsAvailableAtDate']>[0],
		timestamp ?: number,
	) : boolean {
		let start : number | null;
		if (timestamp !== undefined) {
			start = timestamp;
		} else {
			assumeNonNull(this.item);
			if (!this.item.firstShiftStart && this.item.courseSelector) {
				assumeDefinedToGetStrictNullChecksRunning(this.item.courseSelector.start, 'booking.courseSelector.start');
				start = this.item.courseSelector.start;
			} else {
				start = this.item.firstShiftStart;
			}
		}
		return this.pShiftmodelTariffService.tariffIsAvailableAtDate(tariff, start) === false;
	}

	/**
	 * If this is whole-course-booking it checks if overallTariff is available at
	 * time of course.
	 * If this is not whole-course-booking it checks if any of the participants has
	 * a unavailable tariff.
	 */
	private allSelectedTariffsAreAvailable(
		timestamp ?: number,
	) : boolean {
		assumeNonNull(this.item);
		if (this.item.model.onlyWholeCourseBookable) {
			return !this.tariffNotAvailableThatTime(this.overallTariff, timestamp);
		}

		const unavailableTariff = this.item.participants.findBy(participant => {
			assumeNonNull(this.item);
			assumeDefinedToGetStrictNullChecksRunning(participant.tariffId, 'participant.tariffId');
			const tariff = this.item.model.courseTariffs.get(participant.tariffId);
			return this.tariffNotAvailableThatTime(tariff, timestamp);
		});
		return !unavailableTariff;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onStornoBtnClick() : void {
		assumeNonNull(this.item);
		const cancellationFeeBeforeModalOpened = this.item.cancellationFee;
		this.onStorno(
			() => {
				assumeNonNull(this.item);
				if (!this.item.isNewItem()) this.api.save();
			},
			() => {
				this.cleanUpTransactions();
				assumeNonNull(this.item);
				this.item.cancellationFee = cancellationFeeBeforeModalOpened;
			},
			'CHANGE_CANCELLATION_FEE',
		);
		assumeNonNull(this.formGroup);
		this.formGroup.updateValueAndValidity();
	}

	/**
	 * We can not
	 * remove the transaction inside the form inside the modal, since the form does not know why it gets destroyed (dismiss or close).
	 * We can not
	 * create the transaction outside the form, since some transaction have to be created, when the modal is already open
	 * So we have to reload the api to clean up any relicts
	 */
	private cleanUpTransactions() : void {
		assumeNonNull(this.item);

		// No transactions created? ➡ Nothing to clean up ツ
		if (this.item.transactions.length === 0) return;

		assumeNonNull(this.item.api);
		const latestTransaction = this.item.api.data.transactions.get(this.item.transactions.length - 1);
		if (latestTransaction === null) return;
		if (!latestTransaction.isNewItem()) return;
		this.item.api.data.transactions.removeItem(latestTransaction);
	}

	/**
	 * In the case, the modal gets opened by the state radios, pEditable takes care of api method calls.
	 * In case of »Storno«-Button click, we must do it manually.
	 */
	private onStorno(
		success : () => void,
		dismiss : () => void,
		modalVersion : BookingTransactionFormComponent['modalVersion'],
	) : void {
		assumeNonNull(this.formGroup);
		this.openCancellationFeeFormModal(
			success,
			dismiss,
			() => this.cancellationFeeFormCloseBtnLabel,
			modalVersion,
		);
		this.formGroup.updateValueAndValidity();
	}

	/**
	 * Open modal for a new transaction.
	 */
	public onTransactionBtnClick() : void {
		assumeNonNull(this.formGroup);
		this.openCancellationFeeFormModal(
			() => {
				assumeNonNull(this.item);
				if (!this.item.isNewItem()) this.api.save();
			},
			() => {
				this.cleanUpTransactions();
			},
			() => this.newTransactionFormCloseBtnLabel,
			'ADD_TRANSACTION',
		);
		this.formGroup.updateValueAndValidity();
	}

	private openCancellationFeeFormModal(
		success : () => void,
		dismiss : (transaction : SchedulingApiTransaction) => void,
		closeBtnLabel : ModalContentOptions['closeBtnLabel'] = null,
		modalVersion : BookingTransactionFormComponent['modalVersion'],
	) : void {
		this.modalService.openDefaultModal({
			contentTemplateRef: this.bookingTransactionFormModal,
			contentTemplateContext: { modalVersion: modalVersion },
			dismissBtnLabel: this.localizePipe.transform('Verwerfen'),
			closeBtnLabel: closeBtnLabel,
			closeBtnDisabled: () => {
				if (!this.formGroup) return false;

				assumeNonNull(this.item);
				const feeControl = this.formGroup.controls[this.item.attributeInfoCancellationFee.id];
				if (feeControl && !feeControl.valid) return true;

				const transactionHandleRefund = (this.formGroup.get('transaction') as PFormGroup | null)?.controls['handleRefund'];
				if (transactionHandleRefund && !transactionHandleRefund.valid) return true;

				const transactionControl = this.formGroup.get('transaction');
				if (transactionControl && !transactionControl.valid) return true;

				return false;
			},
			closeBtnTheme: PThemeEnum.DANGER,
			modalTitle: this.localizePipe.transform('Storno'),
			hideDismissBtn: false,
		}, {
			size: BootstrapSize.LG,
			success: success,
			dismiss: dismiss,
		});
	}

	/**
	 * Create a hook that will be applied to the "booking.state" radios
	 */
	public get changeStateHook() : (success : () => void, dismiss : () => void) => void {
		return (success : () => void, dismiss : () => void) => {
			assumeNonNull(this.item);

			// If it is a new booking, we dont need any modal
			if (this.item.isNewItem()) {
				success();
				return;
			}

			if (this.item.state === SchedulingApiBookingState.CANCELED) {
				this.onStorno(
					success,
					dismiss,
					'CHANGE_STATE_TO_CANCELED',
				);
				this.console.debug('Canceled');
				return;
			}

			this.modalService.confirm({
				modalTitle: this.localize.transform('Sicher?'),
				description: this.localize.transform('Buchende & teilnehmende Personen werden informiert, <strong>falls</strong> du automatische Emails aktiviert hast.'),
			}, {
				success: success,
				dismiss: dismiss,
				theme: PThemeEnum.WARNING,
			});
		};
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showInquiryDeclinedMsg() : boolean {
		assumeNonNull(this.item);

		if (this.item.courseSelector !== null) return false;
		if (this.item.state !== SchedulingApiBookingState.INQUIRY_DECLINED) return false;

		// HACK: This is necessary to prevent a bug in EditableDirective [PLANO-8445] [PLANO-FE-AS]
		// NOTE: Remove next line to reproduce the error
		if (this.api.hasDataCopy()) return false;

		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onTariffDetailChanges() : void {
		assumeNonNull(this.formGroup);
		assumeNonNull(this.item);
		if (this.formGroup.controls[this.item.attributeInfoPaymentMethodId.id]) {
			this.formGroup.controls[this.item.attributeInfoPaymentMethodId.id]!.updateValueAndValidity();
		}
	}

	/**
	 * A getter, just to get the type straight
	 */
	public get courseTariffsFormArray() : FormArrayWithFormGroups {
		assumeNonNull(this.formGroup);
		return this.formGroup.get('courseTariffs') as unknown as FormArrayWithFormGroups;
	}

	/**
	 * is the api currently loading?
	 */
	public get isApiLoading() : boolean {
		return this.api.isLoadOperationRunning;
	}

	/**
	 * Export all visible transactions
	 */
	public exportTransactions(format : string) : void {
		// set bookings to be exported
		this.exportTransactionsApi.setEmptyData();

		for (const transaction of this.transactionsForList.iterable()) {
			this.exportTransactionsApi.data.transactionIds.createNewItem(transaction.id);
		}

		assumeNonNull(this.item);

		// get query params
		const startMillis = this.item.dateOfBooking;
		const endMillis = Date.now();
		const queryParams = new HttpParams()
			.set('start', (startMillis).toString())
			.set('end', (endMillis).toString())
			.set('bookingNumber', this.item.bookingNumber).set('format', format);
			// cSpell:ignore zahlungsexport, buchung
		const fileName = this.pExport.getFileName(`${this.localize.transform('zahlungsexport_buchung')}${this.item.bookingNumber}`, startMillis, endMillis - 1);

		// download file
		if (format === 'csv') {
			this.modalService.info(
				{
					modalTitle: 'CSV-Export',
					description: `<h4>${this.localize.transform('Microsoft Excel')}</h4>${this.localize.transform('Falls du die CSV-Datei mit <strong>Microsoft Excel</strong> öffnen möchtest, klicke bitte in Excel bei der Registerkarte <mark>Daten</mark> auf den Knopf <mark>Aus Text/CSV</mark> und folge anschließend den Hinweisen, um die Daten zu laden. <br>Wir raten dir davon ab, die CSV-Datei direkt <strong>per Doppelklick</strong> in Excel zu öffnen, da manche Excel-Versionen die Formatierung der CSV-Datei verändern und die Datei unbrauchbar machen könnten.')}`, // description,
				},
				() => {
					// okay pressed
					this.exportIsRunning = true;
					this.exportTransactionsApi.downloadFile(fileName, format, queryParams, 'PUT', () => {
						this.exportIsRunning = false;
					});
				},
			);
		} else {
			this.exportIsRunning = true;
			this.exportTransactionsApi.downloadFile(fileName, format, queryParams, 'PUT', () => {
				this.exportIsRunning = false;
			});
		}
	}

	/**
	 * Navigate to detail-page of given transaction
	 */
	public navToTransaction(id : Id) : void {
		this.pRouterService.navigate([`client/transaction/${id.toString()}`]);
	}

	/**
	 * Navigate to a specific anchor
	 */
	public navToAnchorBeforeTransactionListIntroductionHint() : void {
		assumeNonNull(this.item);
		assumeDefinedToGetStrictNullChecksRunning(this.item.id, 'booking.id');
		this.pRouterService.navigate(['/client/booking', this.item.id.toString(), 'transactions'], {fragment: 'beforeTransactionListIntroductionHint'});
	}

	/**
	 * Get a fitting label, based on params from the form.
	 */
	public get newTransactionFormLabel() : string {
		assumeNonNull(this.item);
		return this.localize.transform(SchedulingApiBookable.newTransactionFormLabel(this.item));
	}

	/** @see SchedulingApiBookable['newTransactionFormCloseBtnLabel'] */
	public get newTransactionFormCloseBtnLabel() : string {
		if (!this.item) {
			this.console.error('Can not determine the right text for button');
			return this.localize.transform('Speichern');
		}
		const source = SchedulingApiBookable.newTransactionFormCloseBtnLabel(this.item);
		return this.localize.transform(source);
	}

	/**
	 * get label for close button for cancellation fee modal
	 */
	public get cancellationFeeFormCloseBtnLabel() : string {
		assumeNonNull(this.item);
		const transaction = this.item.transactions.findBy(item => item.isNewItem());

		let result = '';

		if (this.initialState !== this.item.state && this.item.state === SchedulingApiBookingState.CANCELED) {
			result = this.localize.transform('Buchung stornieren');
		} else {
			result = this.localize.transform('Stornogebühr speichern');
		}
		const openAmount = this.item.getOpenAmount();
		if (openAmount && openAmount >= 0) return result;
		if (!transaction) return `${result} & ${this.localize.transform('keine Rückerstattung')}`;

		if (transaction.paymentMethodType === SchedulingApiTransactionPaymentMethodType.ONLINE_PAYMENT) {
			result += ` & ${this.localize.transform('Rückerstattung veranlassen')}`;
		} else {
			result += ` & ${this.localize.transform('Rückerstattung erfassen')}`;
		}
		return result;
	}

	/**
	 * Get all transactions that should be visible in the list.
	 */
	public get transactionsForList() : SchedulingApiTransactions {
		assumeNonNull(this.item);
		return this.item.transactions;
	}

	/**
	 * Is there any data for booking person? Can be false if user has not yet entered any values.
	 */
	public get hasBookingPersonData() : boolean {
		assumeNonNull(this.item);
		return (
			!!this.item.firstName ||
			!!this.item.lastName
		);
	}

	/** Text for the age limit warning */
	public get showBookingPersonAgeLimitWarning() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.item, 'booking');
		return !!this.pParticipantsService.bookingPersonAgeLimitWarning(this.item);
	}

	/** Text for the age limit warning */
	public get participantsAgeLimitWarning() : ReturnType<PParticipantsService['participantsAgeLimitWarning']> {
		assumeDefinedToGetStrictNullChecksRunning(this.item, 'booking');
		return this.pParticipantsService.participantsAgeLimitWarning(this.item);
	}

	/** Should the age limit warning for participants be visible? */
	public get showParticipantsMinAgeLimitWarning() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.item, 'booking');
		assumeDefinedToGetStrictNullChecksRunning(this.item.ageMin, 'booking.ageMin');
		return this.pParticipantsService.showParticipantsMinAgeLimitWarning(this.item, this.item.ageMin);
	}

	/** Should the age limit warning for participants be visible? */
	public get showParticipantsMaxAgeLimitWarning() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.item, 'booking');
		assumeDefinedToGetStrictNullChecksRunning(this.item.ageMax, 'booking.ageMax');
		return this.pParticipantsService.showParticipantsMaxAgeLimitWarning(this.item, this.item.ageMax);
	}

	/** Text for the age limit warning */
	public showParticipantMinAgeLimitWarning(dateOfBirth : SchedulingApiBookingParticipant['dateOfBirth']) : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.item, 'booking');
		return this.pParticipantsService.showParticipantMinAgeLimitWarning(this.item, dateOfBirth);
	}

	/** Text for the age limit warning */
	public showParticipantMaxAgeLimitWarning(dateOfBirth : SchedulingApiBookingParticipant['dateOfBirth']) : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.item, 'booking');
		return this.pParticipantsService.showParticipantMaxAgeLimitWarning(this.item, dateOfBirth);
	}
}
