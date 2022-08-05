/* NOTE: Dont make this file even bigger. Invest some time to cleanup/split into several files */
/* eslint max-lines: ["error", 900] */

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionLike as ISubscription } from 'rxjs';
import { OnDestroy } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import { Component, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { Input } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormGroup, UntypedFormArray } from '@angular/forms';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { ToastsService } from '@plano/client/service/toasts.service';
import { BootstrapSize, PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { DetailFormComponentInterface } from '@plano/client/shared/detail-form-component.interface';
import { PFormControl } from '@plano/client/shared/p-forms/p-form-control';
import { FormControlSwitchType } from '@plano/client/shared/p-forms/p-form-control-switch/p-form-control-switch.component';
import { SchedulingApiMembers } from '@plano/shared/api';
import { SchedulingApiRightGroup } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiGender, SchedulingApiMember } from '@plano/shared/api';
import { SchedulingApiRightGroupRole } from '@plano/shared/api';
import { AccountApiService } from '@plano/shared/api';
import { MeService } from '@plano/shared/api';
import { RightsService } from '@plano/shared/api';
import { AuthenticatedApiRole } from '@plano/shared/api';
import { PApiPrimitiveTypes, PSupportedCurrencyCodes } from '@plano/shared/api/base/generated-types.ag';
import { Id } from '@plano/shared/api/base/id';
import { AsyncValidatorsService } from '@plano/shared/core/async-validators.service';
import { Config } from '@plano/shared/core/config';
import { LogService } from '@plano/shared/core/log.service';
import { ModalService } from '@plano/shared/core/p-modal/modal.service';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PDatePipe } from '@plano/shared/core/pipe/p-date.pipe';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PRouterService } from '@plano/shared/core/router.service';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PPossibleErrorNames } from '@plano/shared/core/validators.types';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../shared/core/null-type-utils';
import { BirthdayService } from '../../scheduling/shared/api/birthday.service';
import { PInputDateTypes } from '../../shared/p-forms/p-input-date/p-input-date.component';

@Component({
	selector: 'p-detail-form[item]',
	templateUrl: './detail-form.component.html',
	styleUrls: ['./detail-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class DetailFormComponent implements OnDestroy, AfterContentInit, DetailFormComponentInterface<SchedulingApiMember<'draft' | 'validated'>> {
	@Input() public item : SchedulingApiMember<'draft' | 'validated'> | null = null;

	public readonly Config = Config;

	public isMe : boolean = false;
	private prevTrashed : boolean = false;
	public isOwner : boolean = false;
	public isChrome : boolean = /Chrome/.test(window.navigator.userAgent) && /Google Inc/.test(window.navigator.vendor);
	// this prevents css animation on component init

	public hasInitialAccountOwner : boolean = false;
	public hasInitialAccountIBAN : boolean = false;
	public hasInitialAddressCity : boolean = false;
	public hasInitialAddressStreet : boolean = false;
	public hasInitialAddressPostalCode : boolean = false;

	public initialTrashedValue : boolean | null = null;
	public initialEmailValue ! : string;
	public showRecoveredHint : boolean = false;

	public formGroup : DetailFormComponentInterface['formGroup'] | null = null;

	private rightGroupRoles : typeof SchedulingApiRightGroupRole = SchedulingApiRightGroupRole;

	constructor(
		public api : SchedulingApiService,
		public account : AccountApiService,
		public meService : MeService,
		private activeModal : NgbActiveModal,
		private changeDetectorRef : ChangeDetectorRef,
		private validators : ValidatorsService,
		private asyncValidators : AsyncValidatorsService,
		private pRouterService : PRouterService,
		public modalService : ModalService,
		public pFormsService : PFormsService,
		private console : LogService,
		private rightsService : RightsService,
		private datePipe : PDatePipe,
		private localize : LocalizePipe,
		private toasts : ToastsService,
		private birthdayService : BirthdayService,
	) {
		this.isOwner = meService.data.isOwner;
	}

	public PApiPrimitiveTypes = PApiPrimitiveTypes;
	public SchedulingApiGender = SchedulingApiGender;
	public PlanoFaIconPool = PlanoFaIconPool;
	public BootstrapSize = BootstrapSize;
	public PThemeEnum = PThemeEnum;
	public FormControlSwitchType = FormControlSwitchType;
	public PSupportedCurrencyCodes = PSupportedCurrencyCodes;
	public PInputDateTypes = PInputDateTypes;

	/**
	 * Check if this component is fully loaded.
	 * Can be used to show skeletons/spinners then false.
	 */
	public get isLoaded() : boolean {
		if (!this.api.isLoaded()) return false;
		// NOTE: The item will be null if it could not be found
		if (this.item === null) return true;
		if (!this.formGroup) return false;
		if (!this.meService.isLoaded()) return false;
		if (!(!this.meService.data.isOwner || this.account.isLoaded())) return false;
		return true;
	}

	/**
	 * Prepare needed data for bindings. Create new item if necessary.
	 */
	public ngAfterContentInit() : void {
		this.initComponent();
	}

	/**
	 * Initialize all values needed for this component to work.
	 * @param success Use this in unit-tests
	 */
	public initComponent(success ?: () => void) : void {
		if (!this.meService.isLoaded()) throw new Error('MeService needs to be loaded here.');

		const initForm = () : void => {
			this.initValues();
			if (success) { success(); }
		};

		assumeNonNull(this.item);
		if (this.item.isNewItem()) { initForm(); return; }

		this.item.loadDetailed({
			success: initForm,
		});
	}

	/**
	 * Set some default values for properties that are not defined yet
	 */
	public initValues() : void {
		assumeNonNull(this.item);
		if (this.initialTrashedValue === null) this.initialTrashedValue = this.item.trashed;
		this.initialEmailValue = this.item.email;
		this.isMe = this.item.id.equals(this.meService.data.id);
		this.prevTrashed = this.item.trashed;
		this.initFormData();
	}

	/**
	 * Initialize required data for this view
	 */
	private initFormData() : void {
		assumeNonNull(this.item);
		if (!this.item.rawData) throw new Error('member.rawData is not defined [PLANO-19821]');
		this.hasInitialAccountOwner = !!this.item.accountOwner;
		this.hasInitialAccountIBAN = !!this.item.accountIBAN;
		this.hasInitialAddressCity = !!this.item.addressCity;
		this.hasInitialAddressStreet = !!this.item.addressStreet;
		this.hasInitialAddressPostalCode = !!this.item.addressPostalCode;
		if (this.meService.data.isOwner) {
			this.account.load({ success: () => { this.initFormGroup(); } });
		} else {
			this.initFormGroup();
		}
	}

	/**
	 * Initialize the formGroup for this component
	 */
	public initFormGroup() : void {
		if (this.formGroup) this.formGroup = null;

		assumeNonNull(this.item);
		this.item.attributeInfoGender;
		const tempFormGroup = this.pFormsService.group({
			[this.item.attributeInfoGender.id]: new PFormControl(
				{
					formState: {
						value: this.item.gender,
						disabled: this.item.trashed || !this.rightsService.requesterIs(this.item.id, AuthenticatedApiRole.CLIENT_OWNER),
					},
					validatorOrOpts: [this.validators.required(this.item.attributeInfoGender.primitiveType)],
					subscribe: (value) => {
						assumeNonNull(this.item);
						this.item.gender = value;
					},
				},
			),
			[this.item.attributeInfoFirstName.id]: new PFormControl(
				{
					formState: {
						value: this.item.firstName,
						disabled: this.item.trashed || !this.rightsService.requesterIs(this.item.id, AuthenticatedApiRole.CLIENT_OWNER),
					},
					validatorOrOpts: [this.validators.required(this.item.attributeInfoFirstName.primitiveType)],
					subscribe: (value) => {
						assumeNonNull(this.item);
						this.item.firstName = value;
					},
				},
			),
			[this.item.attributeInfoLastName.id]: new PFormControl(
				{
					formState: {
						value: this.item.lastName,
						disabled: this.item.trashed || !this.rightsService.requesterIs(this.item.id, AuthenticatedApiRole.CLIENT_OWNER),
					},
					validatorOrOpts: [this.validators.required(this.item.attributeInfoLastName.primitiveType)],
					subscribe: (value) => {
						assumeNonNull(this.item);
						this.item.lastName = value;
					},
				},
			),
		});

		this.pFormsService.addControlByAttInfo(tempFormGroup, this.item.attributeInfoBirthday);
		tempFormGroup.get(this.item.attributeInfoBirthday.id)?.valueChanges.subscribe((value) => {
			if (!value) return;
			this.birthdayService.unload();
		});

		this.pFormsService.addControl(tempFormGroup, 'email',
			{
				value : this.item.email,
				disabled: this.item.trashed || !this.rightsService.requesterIs(this.item.id, AuthenticatedApiRole.CLIENT_OWNER),
			},
			[this.validators.required(this.item.attributeInfoEmail.primitiveType), this.validators.email()],
			() => {},
			[this.asyncValidators.emailValidAsync(true, this.item.id)],
		);
		this.pFormsService.addControl(tempFormGroup, 'phone',
			{
				value : this.item.phone,
				disabled: this.item.trashed || !this.rightsService.requesterIs(this.item.id, AuthenticatedApiRole.CLIENT_OWNER),
			},
			[],
		);

		this.pFormsService.addControl(tempFormGroup, 'accountIBAN',
			{
				value : this.item.accountIBAN,
				disabled: this.item.trashed || !this.rightsService.requesterIs(this.item.id, AuthenticatedApiRole.CLIENT_OWNER),
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'accountOwner',
			{
				value : this.item.accountOwner,
				disabled: this.item.trashed || !this.rightsService.requesterIs(this.item.id, AuthenticatedApiRole.CLIENT_OWNER),
			},
		);

		this.addControlsForAddress(tempFormGroup);

		this.pFormsService.addControl(tempFormGroup, 'nationality',
			{
				value : this.item.nationality,
				disabled: this.item.trashed || !this.rightsService.requesterIs(AuthenticatedApiRole.CLIENT_OWNER),
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'healthInsurance',
			{
				value : this.item.healthInsurance,
				disabled: this.item.trashed || !this.rightsService.requesterIs(AuthenticatedApiRole.CLIENT_OWNER),
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'personnelNumbers',
			{
				value : this.item.personnelNumbers,
				disabled: this.item.trashed || !this.rightsService.requesterIs(AuthenticatedApiRole.CLIENT_OWNER),
			},
		);

		this.pFormsService.addControl(tempFormGroup, 'placeOfBirth',
			{
				value : this.item.placeOfBirth,
				disabled: this.item.trashed || !this.rightsService.requesterIs(AuthenticatedApiRole.CLIENT_OWNER),
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'socialSecurityNumber',
			{
				value : this.item.socialSecurityNumber,
				disabled: this.item.trashed || !this.rightsService.requesterIs(AuthenticatedApiRole.CLIENT_OWNER),
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'mainJob',
			{
				value : this.item.mainJob,
				disabled: this.item.trashed || !this.rightsService.requesterIs(AuthenticatedApiRole.CLIENT_OWNER),
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'taxId',
			{
				value : this.item.taxId,
				disabled: this.item.trashed || !this.rightsService.requesterIs(AuthenticatedApiRole.CLIENT_OWNER),
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'comments',
			{
				value : this.item.comments,
				disabled: this.item.trashed || !this.rightsService.requesterIs(AuthenticatedApiRole.CLIENT_OWNER),
			},
		);

		this.addRightGroupIds(tempFormGroup);

		this.addControlsForMeAndAdmin(tempFormGroup);
		this.addControlsForAdminsOnly(tempFormGroup);

		this.formGroup = tempFormGroup;

		this.addValidationChangesDetection();
	}

	private addControlsForAddress(
		tempFormGroup : FormGroup,
	) : void {
		assumeNonNull(this.item);
		this.pFormsService.addControl(tempFormGroup, 'addressCity',
			{
				value : this.item.addressCity,
				disabled: this.item.trashed || !this.rightsService.requesterIs(this.item.id, AuthenticatedApiRole.CLIENT_OWNER),
			},
		);
		this.pFormsService.addControl(tempFormGroup, this.item.attributeInfoAddressPostalCode.id,
			{
				value : this.item.addressPostalCode,
				disabled: this.item.trashed || !this.rightsService.requesterIs(this.item.id, AuthenticatedApiRole.CLIENT_OWNER),
			},
			[
				this.validators.plz(),
			],
		);
		this.pFormsService.addControl(tempFormGroup, 'addressStreet',
			{
				value : this.item.addressStreet,
				disabled: this.item.trashed || !this.rightsService.requesterIs(this.item.id, AuthenticatedApiRole.CLIENT_OWNER),
			},
		);
	}

	private addControlsForMeAndAdmin(
		tempFormGroup : FormGroup,
	) : void {
		if (!this.isMe && !this.meService.data.isOwner) return;

		assumeNonNull(this.item);
		this.pFormsService.addControl(tempFormGroup, 'desiredMonthlyEarnings',
			{
				value : this.item.desiredMonthlyEarnings,
				disabled: this.item.trashed || !this.isMe,
			}, [
				this.validators.max(this.item.maxMonthlyEarnings, true, this.item.attributeInfoDesiredMonthlyEarnings.primitiveType),
				this.validators.min(this.item.minMonthlyEarnings, true, this.item.attributeInfoDesiredMonthlyEarnings.primitiveType),
				this.validators.required(this.item.attributeInfoDesiredMonthlyEarnings.primitiveType),
			],
			value => {
				assumeNonNull(this.item);
				this.item.desiredMonthlyEarnings = value;
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'maxMonthlyEarnings',
			{
				value : this.item.maxMonthlyEarnings,
				disabled: this.item.trashed || !this.rightsService.requesterIs(AuthenticatedApiRole.CLIENT_OWNER),
			}, [
				this.validators.required(this.item.attributeInfoMaxMonthlyEarnings.primitiveType),
			], value => {
				assumeNonNull(this.item);
				this.item.maxMonthlyEarnings = value;
				tempFormGroup.get('desiredMonthlyEarnings')!.updateValueAndValidity();
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'minMonthlyEarnings',
			{
				value : this.item.minMonthlyEarnings,
				disabled: this.item.trashed || !this.rightsService.requesterIs(AuthenticatedApiRole.CLIENT_OWNER),
			}, [
				this.validators.required(this.item.attributeInfoMinMonthlyEarnings.primitiveType),
			], value => {
				assumeNonNull(this.item);
				this.item.minMonthlyEarnings = value;
				tempFormGroup.get('desiredMonthlyEarnings')!.updateValueAndValidity();
			},
		);
		this.pFormsService.addPControl(tempFormGroup, 'password', {
			formState: {
				value : this.item.password,
				disabled : this.item.trashed || !this.rightsService.requesterIs(this.item.id),
			},
			validatorOrOpts: [
				this.item.isNewItem() ? this.validators.nullValidator() : this.validators.required(this.item.attributeInfoPassword.primitiveType),
				this.validators.password(),
			],
			subscribe: () => {
				if (tempFormGroup.get('password') && tempFormGroup.get('password')!.valid) {
					tempFormGroup.get('confirmPassword')!.enable();
				} else {
					tempFormGroup.get('confirmPassword')!.disable();
				}
			},
		});

		this.pFormsService.addPControl(tempFormGroup, 'confirmPassword',
			{
				formState: {
					value : this.item.password,
					disabled : this.item.trashed ||
					!this.rightsService.requesterIs(this.item.id, AuthenticatedApiRole.CLIENT_OWNER) ||
					(tempFormGroup.get('password')?.invalid),
				},
				validatorOrOpts: [this.validators.confirmPassword(() => tempFormGroup.get('password')!.value)],
				subscribe: (value) => {
					if (
						tempFormGroup.get('confirmPassword') && tempFormGroup.get('confirmPassword')!.valid &&
						tempFormGroup.get('password') && tempFormGroup.get('password')!.valid
					) {
						assumeNonNull(this.item);
						this.item.password = value;
					}
				},
			},

		);

		this.subscriptions['passwordChanges'] = tempFormGroup.get('password')!.valueChanges.subscribe(() => {
			tempFormGroup.get('confirmPassword')!.updateValueAndValidity();
		});

	}

	private addControlsForAdminsOnly(
		tempFormGroup : FormGroup,
	) : void {
		if (!this.meService.data.isOwner) return;

		assumeNonNull(this.item);
		this.pFormsService.addControl(tempFormGroup, 'employmentBegin',
			{
				value : this.item.employmentBegin,
				disabled : this.item.trashed || (
					!this.item.isNewItem() &&
					!!this.item.employmentBegin
				),
			}, [this.validators.required(PApiPrimitiveTypes.DateTime)],
		);
		this.pFormsService.addControl(tempFormGroup, 'employmentEnd',
			{
				value : this.item.employmentEnd,
				disabled : this.item.trashed,
			},
		);
	}

	private addRightGroupIds(tempFormGroup : FormGroup) : void {
		tempFormGroup.addControl('rightGroupIds', new UntypedFormArray([]));
		// eslint-disable-next-line @typescript-eslint/ban-types
		const formArray = tempFormGroup.get('rightGroupIds') as UntypedFormArray;
		formArray.setValidators([(control) => {
			if (!(control instanceof UntypedFormArray)) throw new Error(`Unexpected control type ${typeof control}`);
			if (control.controls.length) return null;
			return { min : { name: PPossibleErrorNames.MIN, primitiveType: PApiPrimitiveTypes.ApiList } };
		}]);
		assumeNonNull(this.item);
		for (const rightGroupId of this.item.rightGroupIds.iterable()) {
			this.addRightGroupId(
				formArray,
				rightGroupId,
			);
		}
	}

	/**
	 * Add a rightGroupId as PFormControl to the PFormGroup
	 */
	public addRightGroupId(
		// eslint-disable-next-line @typescript-eslint/ban-types
		formArray : UntypedFormArray,
		item : Id | null = null,
	) : void {
		assumeNonNull(this.item);
		if (item && !this.item.rightGroupIds.contains(item)) {
			this.item.rightGroupIds.push(item);
		}
		formArray.push(new PFormControl({
			formState: {
				value : item,
				disabled: !this.rightsService.requesterIs(this.item.id, AuthenticatedApiRole.CLIENT_OWNER),
			},
			validatorOrOpts: [
				this.validators.required(PApiPrimitiveTypes.Id),
				this.validators.idDefined(),
			],
		}));
	}

	/**
	 * Remove a rightGroupId as PFormControl to the PFormGroup
	 */
	private removeRightGroupId(
		// eslint-disable-next-line @typescript-eslint/ban-types
		formArray : UntypedFormArray,
		i : number,
		item : Id | null = null,
	) : void {
		assumeNonNull(item);
		assumeNonNull(this.item);
		this.item.rightGroupIds.removeItem(item);
		formArray.removeAt(i);
		formArray.updateValueAndValidity();
	}

	/**
	 * The API has some Business Logic. I need this function to make sure the form gets updated with new data.
	 */
	public refreshEarningsWithValuesFromApi() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		assumeNonNull(this.item);
		if (this.item.minMonthlyEarnings !== this.formGroup.get('minMonthlyEarnings')!.value) {
			this.formGroup.get('minMonthlyEarnings')!.setValue(this.item.minMonthlyEarnings);
		}
		if (this.item.maxMonthlyEarnings !== this.formGroup.get('maxMonthlyEarnings')!.value) {
			this.formGroup.get('maxMonthlyEarnings')!.setValue(this.item.maxMonthlyEarnings);
		}
		if (this.item.desiredMonthlyEarnings !== this.formGroup.get('desiredMonthlyEarnings')!.value) {
			this.formGroup.get('desiredMonthlyEarnings')!.setValue(this.item.desiredMonthlyEarnings);
		}
	}

	private subscriptions : {
		[key : string] : ISubscription | undefined
	} = {};

	/**
	 * Fix detection change issues in combination of PFormGroup.invalid and edit-wrap
	 */
	private addValidationChangesDetection() : void {
		let prevStatus : unknown;
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		this.subscriptions['formGroupStatusChanges'] = this.formGroup.statusChanges.subscribe(
			(value) => {
				if (value === prevStatus) return;
				prevStatus = value;
				this.changeDetectorRef.detectChanges();
			},
			(error : unknown) => {
				this.console.error(error);
			},
		);
	}

	/** ngOnDestroy */
	public ngOnDestroy() : void {
		this.subscriptions['formGroupStatusChanges']?.unsubscribe();
		this.subscriptions['passwordChanges']?.unsubscribe();
	}

	/**
	 * Timestamp to 'DD.MM.YYYY'
	 */
	public formatTimestamp(timestamp : number) : string | null {
		return this.datePipe.transform(timestamp, 'shortDate');
	}

	/**
	 * Avoid partial changes on the users password
	 */
	public clearPasswords() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		this.formGroup.get('password')!.setValue('');
		this.formGroup.get('confirmPassword')!.setValue('');
		this.formGroup.get('password')!.updateValueAndValidity();
		this.formGroup.get('confirmPassword')!.updateValueAndValidity();
	}

	/**
	 * Avoid partial changes on the users password
	 */
	public resetPasswordValues() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		assumeNonNull(this.item);
		this.formGroup.get('password')!.setValue(this.item.password);
		this.formGroup.get('confirmPassword')!.setValue(this.item.password);
	}

	/**
	 * Avoid partial changes on the users password
	 */
	public clearPasswordValues() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		this.formGroup.get('password')!.setValue(undefined);
		this.formGroup.get('confirmPassword')!.setValue(undefined);
	}

	/**
	 * Dismiss modal
	 */
	// TODO: Obsolete?
	public dismiss() : void {
		this.activeModal.dismiss('dismissed!');
	}

	/**
	 * Remove Item of this Detail page
	 */
	public recoverItem() : void {
		this.formGroup = null;
		assumeNonNull(this.item);
		this.item.trashed = false;

		// this.pRouterService.navBack();
		this.api.save({
			success: () => {
				assumeNonNull(this.item);
				this.toasts.addToast({
					content: this.localize.transform('${name} wurde wiederhergestellt und per Email benachrichtigt.', {
						name: this.item.firstName,
					}),
					theme: PThemeEnum.SUCCESS,
					icon: PlanoFaIconPool.EMAIL_NOTIFICATION,
					visibilityDuration: 'medium',
				});

				this.initialTrashedValue = false;
				this.initialEmailValue = this.item.email;
				this.showRecoveredHint = true;

				this.initComponent();
			},
		});
	}

	/**
	 * Makes sure the user stays logged in when login credentials gets changed
	 */
	public updateCredentials() : void {
		this.console.log('updateCredentials');
		if (!this.isMe) return;

		const TEXT = this.localize.transform('Aus Sicherheitsgründen wirst du nun abgemeldet und kannst dich mit deinen neuen Daten wieder einloggen.');
		alert(TEXT);
		this.pRouterService.navigate(['client/logout/']);
	}

	/**
	 * Determine if account is about to reach next price level
	 */
	public get showPriceWarning() : boolean {
		if (!this.account.isLoaded()) return false;

		assumeNonNull(this.item);
		// only show this warning when creating a new member or untrashing one
		if (!(this.item.isNewItem() || (this.prevTrashed && !this.item.trashed))) return false;

		// We reached next pricing?
		const currentUntrashedMembersCount = this.api.data.members.filterBy(item => !item.trashed).length;
		return currentUntrashedMembersCount === this.account.data.billing.activeMembersCountForNextPricing;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public roleIsOwner(rightGroup : SchedulingApiRightGroup) : boolean {
		return rightGroup.role === SchedulingApiRightGroupRole.CLIENT_OWNER;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public refreshBrowserTab() : void {
		window.location.reload();
	}

	private get onlyOneAdminGroupLeft() : boolean {
		let result : number = 0;
		assumeNonNull(this.item);
		for (const rightGroupId of this.item.rightGroupIds.iterable()) {
			if (this.api.data.rightGroups.get(rightGroupId)!.role === SchedulingApiRightGroupRole.CLIENT_OWNER) {
				result = result + 1;
			}
		}
		return result === 1;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public toggleRightGroup(
		checkboxValue : boolean,
		rightGroup : SchedulingApiRightGroup,
		i : number,
	) : void {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		// eslint-disable-next-line @typescript-eslint/ban-types
		const formArray = this.formGroup.get('rightGroupIds') as UntypedFormArray;

		const success = () : void => {
			if (checkboxValue) {
				this.addRightGroupId(formArray, rightGroup.id);
			} else {
				this.removeRightGroupId(formArray, i, rightGroup.id);
			}
		};

		success();
	}

	/**
	 * Set of rules to determine if admin-group-unselect warning is necessary
	 */
	public unselectAdminGroupWarningNecessary(rightGroup : SchedulingApiRightGroup) : boolean {
		if (!this.rightsService.requesterIs(AuthenticatedApiRole.CLIENT_OWNER)) return false;
		if (!this.isMe) return false;
		assumeNonNull(this.item);
		if (!this.item.rightGroupIds.contains(rightGroup.id)) return false;
		if (rightGroup.role !== this.rightGroupRoles.CLIENT_OWNER) return false;
		if (!this.onlyOneAdminGroupLeft) return false;

		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get allAdmins() : SchedulingApiMembers {
		return this.api.data.members.filterBy(item => {
			if (item.role !== SchedulingApiRightGroupRole.CLIENT_OWNER) return false;
			if (item.trashed) return false;
			return true;
		});
	}

	/**
	 * It causes a lot of trouble if the last admin deletes his own account.
	 * So ... prevent that.
	 */
	public get isLastAdmin() : boolean {
		assumeNonNull(this.item);
		if (this.item.role !== SchedulingApiRightGroupRole.CLIENT_OWNER) return false;
		if (this.allAdmins.length !== 1) return false;

		return true;
	}

	/**
	 * It causes a lot of trouble if the last admin removes the last admin-rightGroup from his own account.
	 * So … prevent that.
	 */
	private get isLastAdminRightGroup() : boolean {
		let i : number = 0;
		for (const item of this.api.data.rightGroups.iterable()) {
			if (item.role === SchedulingApiRightGroupRole.CLIENT_OWNER) ++i;
		}
		return i === 1;
	}

	/**
	 * Check if this Right group Checkbox is disabled.
	 */
	public rightGroupIsDisabled(rightGroup : SchedulingApiRightGroup) : boolean {
		// Trashed members should not be modified
		assumeNonNull(this.item);
		if (this.item.trashed) return true;

		// Last Admin group should not be removed
		if (
			rightGroup.role === SchedulingApiRightGroupRole.CLIENT_OWNER &&
			this.isLastAdmin &&
			this.isLastAdminRightGroup
		) {
			return true;
		}

		// Last group should not be removed
		if (this.item.rightGroupIds.length === 1 && this.item.rightGroupIds.contains(rightGroup.id)) return true;

		return false;
	}

	@Output() public onAddItem : EventEmitter<SchedulingApiMember> = new EventEmitter<SchedulingApiMember>();

	/**
	 * Save this item
	 */
	public saveItem() : void {
		assumeNonNull(this.item);
		if (!this.item.isNewItem()) return;
		this.onAddItem.emit(this.item);
		this.pRouterService.navBack();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get translatedPlaceHolderForDesiredEarnings() : string {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		const maxMonthlyEarnings = this.formGroup.get('maxMonthlyEarnings')!.value;
		return this.localize.transform('z.B. »${example1}«', {
			example1: maxMonthlyEarnings ?? 500,
		});
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showRecoverSection() : boolean {
		if (!this.isLoaded) return false;
		if (!this.isOwner) return false;
		assumeNonNull(this.item);
		if (this.item.isNewItem()) return false;
		if (Config.IS_MOBILE) return false;
		return this.initialTrashedValue ?? false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onOpenRecoverModal() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		const emailControl = this.formGroup.get('email')!;
		emailControl.enable();
		emailControl.markAsPending();
		emailControl.markAsDirty();
		emailControl.updateValueAndValidity();
		assumeNonNull(this.item);
		this.item.trashed = false;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onDismissRecovering() : void {
		assumeNonNull(this.item);
		this.item.trashed = true;
		this.item.email = this.initialEmailValue;
		this.initComponent();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get rightGroupIdsHasDanger() : boolean {
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		// eslint-disable-next-line @typescript-eslint/ban-types
		return !(this.formGroup.get('rightGroupIds')!.value && (this.formGroup.get('rightGroupIds') as UntypedFormArray).length);
	}

	/**
	 * Returns the gendered translation of account holder
	 */
	public get genderOfAccountHolder() : string {
		assumeNonNull(this.item);
		if (this.item.attributeInfoGender.value === SchedulingApiGender.MALE) return	this.localize.transform('Kontoinhaber');
		if (this.item.attributeInfoGender.value === SchedulingApiGender.FEMALE) return	this.localize.transform('Kontoinhaberin');
		else return this.localize.transform('Der/Die Kontoinhabende');
	}
}
