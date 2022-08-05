import { Subscription } from 'rxjs';
import { AfterContentInit, AfterContentChecked, OnDestroy} from '@angular/core';
import { Component, Input, ChangeDetectionStrategy, forwardRef, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor} from '@angular/forms';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { SLIDE_ON_NGIF_TRIGGER } from '@plano/animations';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PFormGroup } from '@plano/client/shared/p-forms/p-form-control';
import { PFormControl } from '@plano/client/shared/p-forms/p-form-control';
import { GenerateAbsencesEarningSetting, GenerateAbsencesTimeSetting, GenerateAbsencesMode, SchedulingApiShiftExchangeShiftRefs } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { GenerateAbsencesOptions} from '@plano/shared/api';
import { SchedulingApiShift } from '@plano/shared/api';
import { ApiListWrapper } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { Id } from '@plano/shared/api/base/id';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PPossibleErrorNames, PValidatorObject } from '@plano/shared/core/validators.types';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../shared/core/null-type-utils';
import { SectionWhitespace } from '../../shared/page/section/section.component';

type ValueType = GenerateAbsencesOptions;

@Component({
	selector: 'p-generate-absences-options',
	templateUrl: './generate-absences-options.component.html',
	styleUrls: ['./generate-absences-options.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	animations: [SLIDE_ON_NGIF_TRIGGER],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => PGenerateAbsencesOptionsComponent),
			multi: true,
		},
	],
})
export class PGenerateAbsencesOptionsComponent implements AfterContentInit, AfterContentChecked, ControlValueAccessor, OnDestroy {
	@Input() public shiftRefs : SchedulingApiShiftExchangeShiftRefs | null = null;
	@Input() private indisposedMemberId : Id | null = null;

	/**
	 * This is the minimum code that is required for a custom control in Angular.
	 * Its necessary to make [(ngModel)] and [formControl] work.
	 */
	@Input() public disabled : boolean = false;
	@Input() private formControl : PFormControl | null = null;

	@Input('required') private _required : boolean = false;

	public generateAbsencesModesEnum : typeof GenerateAbsencesMode = GenerateAbsencesMode;
	public timeSettingsEnum : typeof GenerateAbsencesTimeSetting = GenerateAbsencesTimeSetting;
	public earningSettingsEnum : typeof GenerateAbsencesEarningSetting = GenerateAbsencesEarningSetting;

	public formGroup : PFormGroup | null = null;

	constructor(
		private api : SchedulingApiService,
		private pFormsService : PFormsService,
		private validators : ValidatorsService,
		private changeDetectorRef : ChangeDetectorRef,
		private localize : LocalizePipe,
	) {
	}

	public PApiPrimitiveTypes = PApiPrimitiveTypes;
	public SectionWhitespace = SectionWhitespace;

	public ngAfterContentInit() : void {
	}

	public ngAfterContentChecked() : void {
		this.initAfterValueHack();
	}

	private initAfterValueHack() : void {
		// HACK: this.value is not defined in the first run here. Therefore i ask for (this._value && !this.formGroup)
		// It is not clear why this.value is not defined. I added a post to Stackoverflow for this:
		// https://stackoverflow.com/questions/57918712/why-is-this-value-undefined-null-on-every-lifecycle-hook-when-using-ngmodel-t

		if (!this.value) return;
		if (this.formGroup) return;

		assumeDefinedToGetStrictNullChecksRunning(this.shiftRefs, 'shiftRefs');
		assumeDefinedToGetStrictNullChecksRunning(this.indisposedMemberId, 'indisposedMemberId');
		this.initFormGroup();
		this.setChangesListenerForControlError();
		this.setChangesListenerForReset();
	}

	private setChangesListenerForControlError() : void {
		if (!this.formControl) return;

		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		this.subscriptions.push(this.formGroup.valueChanges.subscribe(() => {
			assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
			if (this.formGroup.valid) {
				this.formControl!.setErrors(null);
			} else {
				this.formControl!.setErrors({ invalid : true });
			}
		}));
		// window.setInterval(() => {
		// 	this.console.log('!!formGroup.errors', !!this.formGroup.errors);
		// 	this.console.log('formGroup', this.formGroup);
		// },1000)
	}

	private subscriptions : Subscription[] = [];

	private setChangesListenerForReset() : void {
		if (!this.formControl) return;

		this.subscriptions.push(this.formControl.valueChanges.subscribe(() => {
			this.initFormGroup();
		}));
		// window.setInterval(() => {
		// 	this.console.log('!!formGroup.errors', !!this.formGroup.errors);
		// 	this.console.log('formGroup', this.formGroup);
		// },1000)
	}

	/**
	 * Initialize the formGroup for this component
	 */
	/* eslint max-lines-per-function: ['warn', 250] */ // eslint-disable-next-line sonarjs/cognitive-complexity, jsdoc/require-jsdoc
	public initFormGroup() : void {
		if (this.formGroup) { this.formGroup = null; }

		const newFormGroup = this.pFormsService.group({});
		this.pFormsService.addControl(newFormGroup, 'generateItems',
			{
				value: this.value!.generateItems,
				disabled: false,
			},
			[],
			(value : boolean) => {

				/**
				 * Set or change the generateItems flag and refresh other generator values if necessary
				 */
				this.value!.generateItems = value;
				if (!this.value!.generateItems) {
					newFormGroup.get('timeSetting')!.setValue(undefined);
					newFormGroup.get('timeSetting')!.updateValueAndValidity();
					newFormGroup.get('earningSetting')!.setValue(undefined);
					newFormGroup.get('earningSetting')!.updateValueAndValidity();
					newFormGroup.get('visibleToTeamMembers')!.setValue(undefined);
					newFormGroup.get('visibleToTeamMembers')!.updateValueAndValidity();
					newFormGroup.updateValueAndValidity();
				} else {
					this.refreshStartAndEnd();
					this.refreshEarningsPerHour();
					newFormGroup.get('timeSetting')!.updateValueAndValidity();
				}
			},
		);
		this.pFormsService.addControl(newFormGroup, 'mode',
			{
				value: this.value!.mode,
				disabled: false,
			},
			[],
			value => {

				/**
				 * Set or change the generateAbsencesMode and refresh other generator values if necessary
				 */
				this.value!.mode = value;
				const timeSettingControl = newFormGroup.get('timeSetting');
				assumeDefinedToGetStrictNullChecksRunning(timeSettingControl, 'timeSettingControl');
				if (this.value!.mode === GenerateAbsencesMode.ONE_ABSENCE_FOR_ALL) {
					timeSettingControl.setValue(GenerateAbsencesTimeSetting.OVERWRITE_DURATION);
				} else {
					timeSettingControl.setValue(undefined);
					timeSettingControl.updateValueAndValidity();
				}
				this.refreshStartAndEnd();
				this.refreshEarningsPerHour();
			},
		);
		this.pFormsService.addControl(newFormGroup, 'timeSetting',
			{
				value: this.value!.timeSetting,
				disabled: false,
			},
			[
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					// FIXME: PLANO-15096
					if (!this.value!.generateItems) return null;
					return this.validators.required(PApiPrimitiveTypes.string).fn(control);
				}}),
			],
			value => {
				if (value === this.value!.timeSetting) return;
				this.value!.timeSetting = value;

				const control = newFormGroup.get('averageWorkingTimePerDay');
				assumeDefinedToGetStrictNullChecksRunning(control, 'control');
				if (value !== GenerateAbsencesTimeSetting.OVERWRITE_DURATION) {
					control.setValue(undefined);
				}
				control.updateValueAndValidity();
			},
		);
		this.pFormsService.addControl(newFormGroup, 'wholeDayEntry',
			{
				value: this.value!.wholeDayEntry,
				disabled: false,
			},
		);
		this.pFormsService.addControl(newFormGroup, 'absenceStartDate',
			{
				value: this.value!.absenceStartDate,
				disabled: false,
			},
			[
				this.validators.maxDecimalPlacesCount(0, PApiPrimitiveTypes.Integer),
			],
			value => {
				this.value!.absenceStartDate = value;
			},
		);
		this.pFormsService.addControl(newFormGroup, 'absenceEndDate',
			{
				value: this.value!.absenceEndDate,
				disabled: false,
			},
			[
				this.validators.maxDecimalPlacesCount(0, PApiPrimitiveTypes.Integer),
			],
			value => {
				this.value!.absenceEndDate = value;
			},
		);
		this.pFormsService.addControl(newFormGroup, 'averageWorkingTimePerDay',
			{
				value: this.value!.averageWorkingTimePerDay,
				disabled: false,
			},
			[
				this.validators.maxDecimalPlacesCount(0, PApiPrimitiveTypes.Integer),
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					// FIXME: PLANO-15096
					if (this.value!.timeSetting === undefined) return null;
					if (this.value!.timeSetting !== GenerateAbsencesTimeSetting.OVERWRITE_DURATION) return null;
					return this.validators.required(PApiPrimitiveTypes.Duration).fn(control);
				}}),
			],
			value => {
				this.value!.averageWorkingTimePerDay = value;
			},
		);

		this.pFormsService.addControl(newFormGroup, 'paid',
			{
				value: this.value!.paid,
				disabled: false,
			},
			[],
			value => {
				this.value!.paid = value;
				const control = newFormGroup.get('earningSetting');
				assumeDefinedToGetStrictNullChecksRunning(control, 'control');
				if (value !== true) {
					control.setValue(undefined);
				} else if (this.value!.mode === GenerateAbsencesMode.ONE_ABSENCE_FOR_ALL) {
					control.setValue(GenerateAbsencesEarningSetting.OVERWRITE_EARNING);
				}
				control.updateValueAndValidity();
			},
		);
		this.pFormsService.addControl(newFormGroup, 'earningSetting',
			{
				value: this.value!.earningSetting,
				disabled: false,
			},
			[
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					// FIXME: PLANO-15096
					if (!this.value!.paid) return null;
					if (!this.value!.generateItems) return null;
					return this.validators.required(PApiPrimitiveTypes.string).fn(control);
				}}),
			],
			value => {
				this.value!.earningSetting = value;
				if (value !== GenerateAbsencesEarningSetting.OVERWRITE_EARNING) {
					newFormGroup.get('earningsPerHour')!.setValue(undefined);
				}
				newFormGroup.get('earningsPerHour')!.updateValueAndValidity();
			},
		);
		this.pFormsService.addControl(newFormGroup, 'earningsPerHour',
			{
				value: this.value!.earningsPerHour,
				disabled: false,
			},
			[
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					// FIXME: PLANO-15096
					if (this.value!.earningSetting === undefined) return null;
					if (!this.value!.paid) return null;
					if (this.value!.earningSetting !== GenerateAbsencesEarningSetting.OVERWRITE_EARNING) return null;
					return this.validators.required(PApiPrimitiveTypes.string).fn(control);
				}}),
			],
			value => {
				this.value!.earningsPerHour = value;
			},
		);

		this.pFormsService.addPControl(newFormGroup, 'visibleToTeamMembers',
			{
				formState: {
					value: this.value!.visibleToTeamMembers,
					disabled: false,
				},
				validatorOrOpts: [
					new PValidatorObject({
						name: PPossibleErrorNames.REQUIRED,
						fn: (control) => {
							if (!newFormGroup.get('generateItems')!.value) return null;
							return this.validators.required(PApiPrimitiveTypes.boolean).fn(control);
						},
					}),
				],
				subscribe: (value : boolean) => {
					this.value!.visibleToTeamMembers = value;
				},

			},
		);


		this.formGroup = newFormGroup;
	}

	/**
	 * Is this a required field?
	 * This can be set as Input() but if there is a formControl binding,
	 * then it takes the info from the formControl’s validators.
	 * TODO: 	Replace this by:
	 * 				return this.formControlInitialRequired();
	 */
	public get required() : boolean {
		if (this._required) return this._required;
		if (this.formControl) {
			const validator = this.formControl.validator?.(this.formControl);
			if (!validator) return false;
			return !!validator[PPossibleErrorNames.REQUIRED] || !!validator[PPossibleErrorNames.ID_DEFINED] || !!validator[PPossibleErrorNames.NOT_UNDEFINED];
		}
		return false;
	}

	private _value : ValueType | null = null;
	public onChange : (value : ValueType | null) => void = () => {};
	public onTouched = () : void => {};

	/** the value of this control */
	public get value() : ValueType | null { return this._value; }
	public set value(value : ValueType | null) {
		if (value === this._value) return;

		this._value = value;
		this.onChange(value);
	}

	/** Write a new value to the element. */
	public writeValue(value : ValueType) : void {
		if (this._value === value) return;
		this._value = value;
		this.changeDetectorRef.detectChanges();
	}

	/**
	 * @see ControlValueAccessor['registerOnChange']
	 *
	 * Note that registerOnChange() only gets called if a formControl is bound.
	 * @param fn Accepts a callback function which you can call when changes happen so that you can notify the outside world that
	 * the data model has changed.
	 * Note that you call it with the changed data model value.
	 */
	public registerOnChange(fn : (value : ValueType | null) => void) : ReturnType<ControlValueAccessor['registerOnChange']> { this.onChange = fn; }

	/** Set the function to be called when the control receives a touch event. */
	public registerOnTouched(fn : () => void) : void { this.onTouched = fn; }

	/** setDisabledState */
	public setDisabledState(isDisabled : boolean) : void {
		if (this.disabled === isDisabled) return;
		// Set internal attribute which gets used in the template.
		this.disabled = isDisabled;
		// Refresh the formControl. #two-way-binding
		if (this.formControl && this.formControl.disabled !== this.disabled) {
			this.disabled ? this.formControl.disable() : this.formControl.enable();
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showAverageWorkingTimePerDayInput() : boolean {
		if (this.value!.timeSetting === GenerateAbsencesTimeSetting.OVERWRITE_DURATION) {
			return true;
		}
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get averageWorkingTimePerDayInputLabel() : string {
		if (!this.shiftRefs!.length) return this.localize.transform('Abwesende Stunden');
		const unit = this.value!.mode === GenerateAbsencesMode.ONE_ABSENCE_FOR_EACH ? 'Eintrag' : 'Tag';
		return this.localize.transform('Abwesende Stunden pro ${unit}', {
			unit: this.localize.transform(unit),
		});
	}

	private get shiftRefsAsShiftsSorted() : ApiListWrapper<SchedulingApiShift> {
		return this.api.data.shifts.filterBy(item => this.shiftRefs!.contains(item.id)).sortedBy(item => item.start, false);
	}

	private get earliestShift() : SchedulingApiShift {
		return this.shiftRefsAsShiftsSorted.get(0)!;
	}

	private get latestShift() : SchedulingApiShift {
		const shiftRefsAsShiftsSorted = this.shiftRefsAsShiftsSorted;
		return shiftRefsAsShiftsSorted.get(shiftRefsAsShiftsSorted.length - 1)!;
	}

	private refreshEarningsPerHour() : void {
		const options = this.value!;
		if (options.mode === GenerateAbsencesMode.ONE_ABSENCE_FOR_ALL && this.shiftRefs!.length === 1) {
			options.earningsPerHour = this.earliestShift.assignableMembers.get(this.indisposedMemberId)!.hourlyEarnings;
		}
	}

	private refreshStartAndEnd() : void {
		const options = this.value!;
		if (options.mode !== GenerateAbsencesMode.ONE_ABSENCE_FOR_ALL) return;
		// If only one Absence gets created, the start and end must be calculated from the shiftRefs
		options.averageWorkingTimePerDay = null;
		assumeDefinedToGetStrictNullChecksRunning(this.formGroup, 'formGroup');
		this.formGroup.get('absenceStartDate')!.setValue(this.earliestShift.start);
		this.formGroup.get('absenceEndDate')!.setValue(this.latestShift.end);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showTimeSettingInput() : boolean {
		if (this.value!.mode === GenerateAbsencesMode.ONE_ABSENCE_FOR_EACH) return true;
		if (this.shiftRefs!.length === 1) return true;
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showAbsenceStartAndEndDateInput() : boolean {
		if (
			this.value!.mode === GenerateAbsencesMode.ONE_ABSENCE_FOR_ALL &&
			this.value!.timeSetting === GenerateAbsencesTimeSetting.OVERWRITE_DURATION
		) return true;
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showTimeBox() : boolean {
		if (this.showTimeSettingInput) return true;
		if (this.showAverageWorkingTimePerDayInput) return true;
		if (this.showAbsenceStartAndEndDateInput) return true;
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showEarningSettingInput() : boolean {
		if (!this.value!.paid) return false;
		if (this.value!.mode === GenerateAbsencesMode.ONE_ABSENCE_FOR_EACH) return true;
		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showEarningsPerHourInput() : boolean {
		if (!this.value!.paid) return false;
		if (this.value!.earningSetting === GenerateAbsencesEarningSetting.OVERWRITE_EARNING) return true;
		return false;
	}

	// TODO: Obsolete?
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get showEarningsBox() : boolean {
		// if (this.showEarningSettingInput) return true;
		// if (this.showEarningsPerHourInput) return true;
		// return false;
		return true;
	}

	public ngOnDestroy() : void {
		for (const subscription of this.subscriptions) subscription.unsubscribe();
	}

}
