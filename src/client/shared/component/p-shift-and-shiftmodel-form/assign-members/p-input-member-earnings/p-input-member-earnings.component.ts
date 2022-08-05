import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { AfterContentInit } from '@angular/core';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PFormGroup } from '@plano/client/shared/p-forms/p-form-control';
import { SchedulingApiMember } from '@plano/shared/api';
import { SchedulingApiShift } from '@plano/shared/api';
import { SchedulingApiShiftModel } from '@plano/shared/api';
import { SchedulingApiShiftModelAssignableMember } from '@plano/shared/api';
import { SchedulingApiShiftAssignableMember } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';

@Component({
	selector: 'p-input-member-earnings[formItem][member]',
	templateUrl: './p-input-member-earnings.component.html',
	styleUrls: ['./p-input-member-earnings.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PInputMemberEarningsComponent implements AfterContentInit {
	@Input() private formItem ! : SchedulingApiShiftModel | SchedulingApiShift;
	public formGroup : PFormGroup | null = null;
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

	private get assignableMember() : SchedulingApiShiftAssignableMember | SchedulingApiShiftModelAssignableMember | null {
		return this.formItem.assignableMembers.getByMember(this.member);
	}

	/**
	 * Initialize the formGroup for this component
	 */
	public initFormGroup() : void {
		if (this.formGroup) { this.formGroup = null; }

		const newFormGroup = this.pFormsService.group({});

		this.pFormsService.addPControl(newFormGroup, 'hourlyEarnings',
			{
				formState: {
					value: this.assignableMember ? this.assignableMember.hourlyEarnings : undefined,
					disabled: false,
				},
				subscribe: (value) => {
					if (typeof value !== 'number') {
						if (value === undefined || value === null) {
							this.formItem.assignableMembers.removeMember(this.member);
							this.formItem.assignedMemberIds.removeItem(this.member.id);
						}
						return;
					}

					if (!this.assignableMember) {
						this.formItem.assignableMembers.addNewMember(this.member, value);
						return;
					}
					this.assignableMember.hourlyEarnings = value;
				},
			},

		);

		this.formGroup = newFormGroup;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get earnings() : number {
		if (this.assignableMember !== null) {
			const earnings = this.assignableMember.attributeInfoHourlyEarnings.value;
			if (earnings !== null) this._earnings = earnings;
		}
		return this._earnings!;
	}

	public set earnings(input : number) {
		if (
			this.assignableMember !== null &&
			typeof this._earnings === 'number'
		) {
			this.assignableMember.hourlyEarnings = input;
		}
		this._earnings = input;
	}

}
