import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PFormGroup } from '@plano/client/shared/p-forms/p-form-control';
import { SchedulingApiAssignableShiftModels} from '@plano/shared/api';
import { SchedulingApiMember } from '@plano/shared/api';
import { SchedulingApiShiftModel } from '@plano/shared/api';
import { Currency} from '@plano/shared/api/base/generated-types.ag';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNotUndefined } from '../../../../../shared/core/null-type-utils';
import { PInputComponent } from '../../../../shared/p-forms/p-input/p-input.component';

@Component({
	selector: 'p-input-shiftmodel-earnings[shiftModel][member]',
	templateUrl: './p-input-shiftmodel-earnings.component.html',
	styleUrls: ['./p-input-shiftmodel-earnings.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PInputShiftmodelEarningsComponent implements AfterContentInit {
	public formGroup : PFormGroup | null = null;

	@Input() private shiftModel ! : SchedulingApiShiftModel;
	@Input() private member ! : SchedulingApiMember;
	private _earnings : number | null = null;

	constructor(
		private pFormsService : PFormsService,
	) {
	}

	public PApiPrimitiveTypes = PApiPrimitiveTypes;

	public ngAfterContentInit() : void {
		this.initFormGroup();
	}

	private get assignableShiftModel() : ReturnType<SchedulingApiAssignableShiftModels['getByShiftModel']> {
		return this.member.assignableShiftModels.getByShiftModel(this.shiftModel);
	}

	/**
	 * Initialize the formGroup for this component
	 */
	public initFormGroup() : void {
		if (this.formGroup) { this.formGroup = null; }

		const newFormGroup = this.pFormsService.group({});

		this.pFormsService.addControl(newFormGroup, 'hourlyEarnings',
			{
				value: this.assignableShiftModel ? this.assignableShiftModel.hourlyEarnings : undefined,
				disabled: false,
			}, [
			],
			(value : PInputComponent['value']) => {
				if (typeof value !== 'number') {
					if (value === undefined || value === null) {
						// HACK: For https://sentry.io/organizations/dr-plano/issues/2850457611
						// Will be obsolete when PLANO-24273 is done.
						// TODO: PLANO-24273
						const assignableShiftModelToRemove = this.member.assignableShiftModels.getByShiftModel(this.shiftModel);
						if (assignableShiftModelToRemove) this.member.assignableShiftModels.removeShiftModel(this.shiftModel);
					}
					return;
				}

				if (!this.assignableShiftModel) {
					this.member.assignableShiftModels.addNewShiftModel(this.shiftModel, value);
					assumeNotUndefined(this.assignableShiftModel);
				}
				this.assignableShiftModel.hourlyEarnings = value;
			},
		);

		this.formGroup = newFormGroup;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get earnings() : number | null {
		if (this.assignableShiftModel !== undefined) {
			const earnings = this.assignableShiftModel.hourlyEarnings as Currency | undefined;
			if (earnings !== undefined) this._earnings = earnings;
		}
		return this._earnings;
	}

	public set earnings(input : number | null) {
		if (
			this.assignableShiftModel !== undefined &&
			typeof this._earnings === 'number'
		) {
			assumeDefinedToGetStrictNullChecksRunning(input, 'input');
			this.assignableShiftModel.hourlyEarnings = input;
		}
		this._earnings = input;
	}

}
