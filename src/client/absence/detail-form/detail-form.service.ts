import { Injectable } from '@angular/core';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PFormGroup } from '@plano/client/shared/p-forms/p-form-control';
import { SchedulingApiAbsence } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { Id } from '@plano/shared/api/base/id';
import { LogService } from '@plano/shared/core/log.service';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PPossibleErrorNames, PValidatorObject } from '@plano/shared/core/validators.types';

@Injectable()
export class PAbsenceDetailFormService {
	constructor(
		private pFormsService : PFormsService,
		private validators : ValidatorsService,
		private console : LogService,
	) {
	}

	/**
	 * Initialize the formGroup for this component
	 */
	// eslint-disable-next-line max-lines-per-function
	public generateFormGroup(absence : SchedulingApiAbsence) : PFormGroup {
		const tempFormGroup = this.pFormsService.group({});

		this.pFormsService.addControl(tempFormGroup, 'memberId',
			{
				value : absence.memberId,
				disabled: false,
			},
			[
				this.validators.required(absence.attributeInfoMemberId.primitiveType),
				this.validators.idDefined(),
			],
			(value : Id) => {
				absence.attributeInfoMemberId.value = value;
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'ownerComment',
			{
				value : absence.ownerComment,
				disabled: false,
			},
			[],
			(value : string) => {
				absence.attributeInfoOwnerComment.value = value;
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'visibleToTeamMembers',
			{
				value : absence.visibleToTeamMembers,
				disabled: false,
			},
			[this.validators.required(absence.attributeInfoVisibleToTeamMembers.primitiveType)],
			(value : boolean) => {
				absence.attributeInfoVisibleToTeamMembers.value = value;
			},
		);

		const INITIAL_HOURLY_EARNINGS_VALUE = absence.hourlyEarnings;
		this.pFormsService.addControl(tempFormGroup, 'paid',
			{
				value : !!INITIAL_HOURLY_EARNINGS_VALUE,
				disabled: false,
			},
			[this.validators.required(absence.attributeInfoHourlyEarnings.primitiveType)],
			value => {
				if (value) {
					tempFormGroup.get('hourlyEarnings')!.enable();
					tempFormGroup.get('hourlyEarnings')!.setValue(INITIAL_HOURLY_EARNINGS_VALUE);
				} else {
					tempFormGroup.get('hourlyEarnings')!.disable();
					tempFormGroup.get('hourlyEarnings')!.setValue(undefined);
				}
				tempFormGroup.get('hourlyEarnings')!.updateValueAndValidity();
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'hourlyEarnings',
			{
				value : INITIAL_HOURLY_EARNINGS_VALUE,
				disabled : tempFormGroup.get('paid')!.value === false,
			},
			[
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					// FIXME: PLANO-15096
					if (!tempFormGroup.get('paid')!.value) return null;
					return this.validators.required(absence.attributeInfoHourlyEarnings.primitiveType).fn(control);
				}}),
			],
			(value : number | null = null) => {
				if (value === null && INITIAL_HOURLY_EARNINGS_VALUE) {
					absence.attributeInfoHourlyEarnings.value = 0;
				} else {
					absence.attributeInfoHourlyEarnings.value = value;
				}
			},
		);

		let preventLoop : boolean = false;

		this.pFormsService.addPControl(tempFormGroup, 'start',
			{
				formState: {
					value : absence.time.start,
					disabled: false,
				},
				validatorOrOpts: [
					this.validators.required(absence.time.attributeInfoStart.primitiveType),
					new PValidatorObject({name: PPossibleErrorNames.MAX, fn: (control) => {
					// FIXME: PLANO--15096
						if (!absence.time.end) return null;

						const equalIsAllowed = absence.workingTimePerDay !== null;
						const ERRORS = this.validators.max(
							absence.time.attributeInfoEnd.value,
							equalIsAllowed,
							absence.time.attributeInfoStart.primitiveType,
						).fn(control);
						if (ERRORS) ERRORS[PPossibleErrorNames.MAX].errorText = 'Das angegebene Ende muss nach dem angegebenen Start liegen.';
						return ERRORS;
					}}),
				],
				subscribe: (value : number) => {
					absence.time.attributeInfoStart.value = value || 0;
					if (!value) return;

					if (preventLoop) {
						preventLoop = false;
						return;
					}

					preventLoop = true;
					tempFormGroup.get('end')!.updateValueAndValidity();
				},
			},
		);

		this.pFormsService.addPControl(tempFormGroup, 'end',
			{
				formState: {
					value : absence.time.end,
					disabled: false,
				},
				validatorOrOpts: [
					this.validators.required(absence.time.attributeInfoEnd.primitiveType),
					new PValidatorObject({name: PPossibleErrorNames.MIN, fn: (control) => {
						// FIXME: PLANO--15096
						if (!absence.time.attributeInfoStart.value) return null;

						let limit : number;
						if (
							!(
								absence.workingTimePerDay === null ||
								absence.workingTimePerDay <= -1
							)
						) {
							limit = absence.time.start - 1;
						} else {
							limit = absence.time.start + 1;
						}
						const ERRORS = this.validators.min(limit, true, absence.time.attributeInfoEnd.primitiveType).fn(control);
						if (ERRORS) ERRORS[PPossibleErrorNames.MIN].errorText = 'Das angegebene Ende muss nach dem angegebenen Start liegen.';
						return ERRORS;
					}}),
				],
				subscribe: (value : number) => {
					absence.time.attributeInfoEnd.value = value || 0;
					if (!value) return;

					if (preventLoop) {
						preventLoop = false;
						return;
					}

					preventLoop = true;
					this.console.log('triggers start value update');
					tempFormGroup.get('start')!.updateValueAndValidity();
				},

			},
		);

		const INITIAL_FULLDAY_VALUE = !(absence.workingTimePerDay === null || absence.workingTimePerDay <= -1);
		const INITIAL_WORKING_TIME_PER_DAY_VALUE = absence.workingTimePerDay ?? null;
		this.pFormsService.addControl(tempFormGroup, 'fullday',
			{
				value : INITIAL_FULLDAY_VALUE,
				disabled: false,
			},
			[],
			value => {
				if (!value) {
					tempFormGroup.get('workingTimePerDay')!.disable();
					tempFormGroup.get('workingTimePerDay')!.setValue(null);
				} else {
					tempFormGroup.get('workingTimePerDay')!.setValue(INITIAL_WORKING_TIME_PER_DAY_VALUE);
					tempFormGroup.get('workingTimePerDay')!.enable();
				}

				tempFormGroup.get('workingTimePerDay')!.markAsTouched();
				tempFormGroup.get('workingTimePerDay')!.updateValueAndValidity();

				tempFormGroup.get('start')!.setValue(undefined);
				tempFormGroup.get('start')!.updateValueAndValidity();
				tempFormGroup.get('start')!.markAsTouched();

				tempFormGroup.get('end')!.setValue(undefined);
				tempFormGroup.get('end')!.markAsTouched();
				tempFormGroup.get('end')!.updateValueAndValidity();
			},
		);

		this.pFormsService.addControl(tempFormGroup, 'workingTimePerDay',
			{
				value : INITIAL_WORKING_TIME_PER_DAY_VALUE,
				disabled: !tempFormGroup.get('fullday')!.value,
			},
			[
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					// FIXME: PLANO--15096
					if (!tempFormGroup.get('fullday')!.value) return null;
					return this.validators.required(PApiPrimitiveTypes.Days).fn(control);
				}}),
				new PValidatorObject({name: PPossibleErrorNames.GREATER_THAN, fn: (control) => {
					if (control.value === null) return null;
					return this.validators.greaterThan(0, PApiPrimitiveTypes.Days).fn(control);
				}}),
				new PValidatorObject({name: PPossibleErrorNames.MAX, fn: (control) => {
					const ERRORS = this.validators.max(24 * 1000 * 60 * 60, true, absence.attributeInfoWorkingTimePerDay.primitiveType).fn(control);
					if (!ERRORS) return null;
					// eslint-disable-next-line no-autofix/@typescript-eslint/no-unnecessary-condition
					if (ERRORS[PPossibleErrorNames.MAX]) ERRORS[PPossibleErrorNames.MAX].errorText = `Auf der Erde hat ein Tag 24 Stunden. Das Team von Dr.&nbsp;Plano ist aufgeschlossen gegenüber neuen Planeten. Melde dich! Wir kommen dich gerne besuchen! 🖖`;
					return ERRORS;
				}}),
			],
			(value : number) => {
				absence.attributeInfoWorkingTimePerDay.value = value;
			},
		);

		return tempFormGroup;
	}
}
