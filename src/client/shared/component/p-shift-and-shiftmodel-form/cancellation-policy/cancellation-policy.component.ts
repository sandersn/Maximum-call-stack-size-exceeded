import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { OnDestroy, AfterContentChecked } from '@angular/core';
import { Component, ChangeDetectionStrategy, Input, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { UntypedFormArray, ValidationErrors } from '@angular/forms';
import { SchedulingApiService, SchedulingApiShiftModel } from '@plano/client/scheduling/shared/api/scheduling-api.service';
import { AccountApiService, SchedulingApiCustomBookableMailEventType, SchedulingApiShiftModelCancellationPolicyFeePeriod } from '../../../../../shared/api';
import { PApiPrimitiveTypes } from '../../../../../shared/api/base/generated-types.ag';
import { LogService } from '../../../../../shared/core/log.service';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../../shared/core/null-type-utils';
import { PDictionarySourceString } from '../../../../../shared/core/pipe/localize.dictionary';
import { PlanoFaIconPool } from '../../../../../shared/core/plano-fa-icon-pool.enum';
import { PPossibleErrorNames } from '../../../../../shared/core/validators.types';
import { PFormsService } from '../../../../service/p-forms.service';
import { BootstrapSize, PBtnThemeEnum, PThemeEnum } from '../../../bootstrap-styles.enum';
import { EditableControlInterface } from '../../../p-editable/editable/editable.directive';
import { PFormControl, PFormGroup } from '../../../p-forms/p-form-control';
import { PFormControlSwitchDurationComponent } from '../../../p-forms/p-form-control-switch-duration/p-form-control-switch-duration.component';
import { FormControlSwitchType } from '../../../p-forms/p-form-control-switch/p-form-control-switch.component';
import { PTabSizeEnum } from '../../../p-tabs/p-tabs/p-tab/p-tab.component';
import { PTabsTheme } from '../../../p-tabs/p-tabs/p-tabs.component';
import { SectionWhitespace } from '../../../page/section/section.component';

@Component({
	selector: 'p-cancellation-policy',
	templateUrl: './cancellation-policy.component.html',
	styleUrls: ['./cancellation-policy.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class CancellationPolicyComponent implements AfterContentChecked, OnDestroy {
	@Input() public shiftModel : SchedulingApiShiftModel | null = null;
	@Input() public formGroup : PFormGroup | null = null;
	@Input() public userCanWrite : boolean = false;

	@Output() public initFormGroup = new EventEmitter<undefined>();
	@Input() public saveChangesHook ?: EditableControlInterface['saveChangesHook'];

	@Output() public onSaveStart : EditableControlInterface['onSaveStart'] = new EventEmitter();
	@Output() public onSaveSuccess : EditableControlInterface['onSaveSuccess'] = new EventEmitter();

	constructor(
		public api : SchedulingApiService,
		public pFormsService : PFormsService,
		public activeModal : NgbActiveModal,
		public accountApiService : AccountApiService,
		private changeDetectorRef : ChangeDetectorRef,
		private console : LogService,
	) {
	}

	public PThemeEnum = PThemeEnum;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;
	public FormControlSwitchType = FormControlSwitchType;
	public PBtnThemeEnum = PBtnThemeEnum;
	public PlanoFaIconPool = PlanoFaIconPool;
	public PTabsTheme = PTabsTheme;
	public PTabSizeEnum = PTabSizeEnum;
	public PPossibleErrorNames = PPossibleErrorNames;
	public SectionWhitespace = SectionWhitespace;
	public BootstrapSize = BootstrapSize;

	/**
	 * Add a feePeriod to the api object as well as the formArray.
	 */
	public onAddFeePeriodClick(
		index : number,
	) : void {
		if (this.shiftModel!.currentCancellationPolicy === null) throw new Error('AddFeePeriod should not have been clickable');

		// Create a new feePeriod in the api
		// TODO: I guess 'createNewItem' always puts the new feePeriod at the end of the array. I need a way to set a desired index.
		const feePeriod = new SchedulingApiShiftModelCancellationPolicyFeePeriod(this.api);
		if (index === 0) feePeriod.start = null;
		this.shiftModel!.currentCancellationPolicy.feePeriods.insert(index, feePeriod);

		// Put the new item into the FormArray at the right place.
		this.addFeePeriod(feePeriod, index);
	}

	/**
	 * Remove a feePeriod from the api object as well as the formArray.
	 */
	public onRemoveFeePeriodClick(formGroupToRemove : PFormGroup) : void {
		assumeDefinedToGetStrictNullChecksRunning(this.shiftModel!.currentCancellationPolicy, 'shiftModel.currentCancellationPolicy');

		const feePeriod = formGroupToRemove.get('feePeriodRef')!.value;
		assumeNonNull(this.feePeriodsFormArray);
		const index = this.feePeriodsFormArray.controls.indexOf(formGroupToRemove);
		this.feePeriodsFormArray.removeAt(index);
		this.shiftModel!.currentCancellationPolicy.feePeriods.removeItem(feePeriod);
		this.feePeriodsFormArray.updateValueAndValidity();
	}

	private addFeePeriod(feePeriod : SchedulingApiShiftModelCancellationPolicyFeePeriod, index : number) : void {
		this.feePeriodsFormArray!.insert(index, new PFormGroup({
			feePeriodRef: new PFormControl({
				formState: {
					value: feePeriod,
					disabled: false,
				},
			}),
		}));
	}

	/**
	 * Check if there is a 'cancel booking' email
	 */
	public get cancelEmailIsDisabled() : boolean | null {
		const mail = this.api.data.customBookableMails.findBy(item => item.eventType === SchedulingApiCustomBookableMailEventType.BOOKING_CANCELED);
		if (mail === null) return null;
		return !this.shiftModel!.automaticBookableMailIds.contains(mail.id);
	}

	/**
	 * Check if there is a 'edit feePeriod' email
	 */
	public get editFeePeriodEmailIsDisabled() : boolean | null {
		const mail = this.api.data.customBookableMails.findBy(item => item.eventType === SchedulingApiCustomBookableMailEventType.AMOUNT_TO_PAY_CHANGED);
		if (mail === null) return null;
		return !this.shiftModel!.automaticBookableMailIds.contains(mail.id);
	}

	// eslint-disable-next-line @typescript-eslint/ban-types
	private get feePeriodsFormArray() : UntypedFormArray | null {
		// eslint-disable-next-line @typescript-eslint/ban-types
		return this.formGroup!.get('feePeriods') as UntypedFormArray;
	}

	/**
	 * Check if there is a linked document containing the companies conditions for cancellation.
	 */
	public get noCancellationConditionsLinked() : boolean | null {
		if (!this.feePeriodsFormArray!.length) return false;
		if (!this.accountApiService.isLoaded()) return null;
		return !!this.accountApiService.data.cancellationPolicyUrl;
	}

	/**
	 * Shorthand to get a very special error object.
	 */
	public get firstFeePeriodStartIsNullError() : null | ValidationErrors {
		if (this.feePeriodsFormArray!.errors === null) return null;
		return this.feePeriodsFormArray!.errors[PPossibleErrorNames.FIRST_FEE_PERIOD_START_IS_NULL];
	}

	/**
	 * Which options should be available?
	 */
	public startInputDurationOptions : PFormControlSwitchDurationComponent['options'] = [
		{
			text: 'Tage vor dem Angebotstag',
			value: PApiPrimitiveTypes.Days,
		},
		{
			text: 'Unbegrenzt',
			value: null,
		},
	];

	/**
	 * Which options should be available?
	 */
	public deadlinesInputDurationOptions : PFormControlSwitchDurationComponent['options'] = [
		{
			text: 'Tage vor dem Angebotstag',
			value: PApiPrimitiveTypes.Days,
		},
		{
			text: 'Unbegrenzt bis zum Angebotsbeginn',
			value: null,
		},
	];

	/**
	 * HACK:
	 * Problem was:
	 * - no feePeriods
	 * - set shiftModel.attributeInfoOnlineCancellationForChargeableBookingsEnabled to true
	 * - set shiftModel.attributeInfoOnlineCancellationForChargeableBookingsEnabled to false
	 * > this.formGroup is invalid although all children are valid
	 */
	public get someChildrenAreInvalid() : boolean | null {
		if (!this.formGroup) return null;
		return Object.values(this.formGroup.controls).some(item => item.invalid);
	}

	/**
	 * Just a shorthand to determine if the hint should be visible or not.
	 */
	public get showCancelEmailIsDisabledHint() : boolean {
		if (!this.cancelEmailIsDisabled) return false;
		return this.shiftModel!.onlineCancellationForFreeBookingsEnabled || this.shiftModel!.onlineCancellationForChargeableBookingsEnabled;
	}

	/**
	 * Shorthand to get the cannotEditHint
	 */
	public get onlineCancellationForChargeableBookingsEnabledCannotEditHint() : PDictionarySourceString | null {
		const cannotEditHint = this.shiftModel!.attributeInfoOnlineCancellationForChargeableBookingsEnabled.vars.cannotEditHint;
		if (cannotEditHint === undefined) return null;
		return typeof cannotEditHint === 'string' ? cannotEditHint : cannotEditHint();
	}

	/**
	 * Just a shorthand to get the cannotEditHint.
	 */
	public get onlineCancellationAutomaticOnlineRefundEnabledCannotEditHint() : PDictionarySourceString | null {
		// TODO: I think this is obsolete. Remove it.
		const cannotEditHint = this.shiftModel!.attributeInfoOnlineCancellationAutomaticOnlineRefundEnabled.vars.cannotEditHint;
		if (cannotEditHint === undefined) return null;
		return typeof cannotEditHint === 'string' ? cannotEditHint : cannotEditHint();
	}

	/**
	 * Create a formArray containing all the data of currentCancellationPolicy.
	 * Remember, that currentCancellationPolicy reference can change after a save.
	 * So this must be destroyed and re-created in that case.
	 */
	public createCurrentCancellationPolicyFormGroup() : void {
		if (this.formGroup === null) throw new Error(`createCurrentCancellationPolicyForm() has been called with nullish formGroup`);
		if (this.shiftModel === null) throw new Error(`createCurrentCancellationPolicyForm() has been called with nullish shiftModel`);

		if (!this.shiftModel.currentCancellationPolicy) throw new Error('currentCancellationPolicy should never be undefined');

		this.pFormsService.addPControl(this.formGroup, 'idAsString', {
			formState: { disabled: true, value: this.shiftModel.currentCancellationPolicyId.toString() },
		});

		this.pFormsService.addArray(this.formGroup, 'feePeriods', []);

		assumeNonNull(this.feePeriodsFormArray);
		this.feePeriodsFormArray.setValidators([
			// Pack all validators together in one validator.
			// This way we make sure every execution checks if a
			// validator is active (validator object is returned) or not (null is returned)
			(control) => {
				assumeNonNull(this.shiftModel!.currentCancellationPolicy);
				for (const validationObjectFn of this.shiftModel!.currentCancellationPolicy.feePeriods.attributeInfoThis.validations) {
					const validatorObj = validationObjectFn();
					const validatorFn = validatorObj?.fn;
					if (!validatorFn) continue;
					const ERROR = validatorFn(control);

					// This returns only the first validation error in the list of validators.
					if (ERROR !== null) return ERROR;
				}
				return null;
			},
		]);

		let prevHasError = false;
		this.subscriberForFormArray = this.feePeriodsFormArray.valueChanges.subscribe(() => {
			// NOTE: [PLANO-59911] see linked video in ticket
			this.feePeriodsFormArray!.updateValueAndValidity({emitEvent: false});
			if (prevHasError !== !!this.feePeriodsFormArray!.errors) {
				prevHasError = !!this.feePeriodsFormArray!.errors;
				this.changeDetectorRef.detectChanges();
			}
		});

		for (const feePeriod of this.shiftModel.currentCancellationPolicy.feePeriods.iterable()) {
			this.feePeriodsFormArray.push(new PFormGroup({
				feePeriodRef: new PFormControl({
					formState: {
						value: feePeriod,
						disabled: false,
					},
				}),
			}));
		}

		this.subscriberForFormGroup = this.formGroup.valueChanges.subscribe(() => {
			this.formGroup!.updateValueAndValidity({onlySelf: true, emitEvent: false});
			this.feePeriodsFormArray!.updateValueAndValidity({onlySelf: true, emitEvent: true});
		});
	}

	private subscriberForFormArray : Subscription | null = null;
	private subscriberForFormGroup : Subscription | null = null;

	public ngOnDestroy() : void {
		this.subscriberForFormArray?.unsubscribe();
		this.subscriberForFormGroup?.unsubscribe();
	}

	public ngAfterContentChecked() : void {
		// NOTE: PLANO-98740
		if (!this.feePeriodsFormArray) this.createCurrentCancellationPolicyFormGroup();
	}
}


