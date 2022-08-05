import { OnInit } from '@angular/core';
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { AbstractControl, UntypedFormArray } from '@angular/forms';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PFormGroup } from '@plano/client/shared/p-forms/p-form-control';
import { SchedulingApiService, SchedulingApiShiftModels } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { Id } from '@plano/shared/api/base/id';
import { LogService } from '@plano/shared/core/log.service';
import { ValidatorsService } from '@plano/shared/core/validators.service';

@Component({
	selector: 'p-input-freeclimber-article-id',
	templateUrl: './p-input-freeclimber-article-id.component.html',
	styleUrls: ['./p-input-freeclimber-article-id.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PInputFreeclimberArticleIdComponent implements OnInit {
	public formGroup : PFormGroup | null = null;
	@Input() private shiftModels : SchedulingApiShiftModels | null = null;
	@Input() public api : SchedulingApiService | null = null;

	constructor(
		private pFormsService : PFormsService,
		private validators : ValidatorsService,
		private console : LogService,
	) {
	}

	public PThemeEnum = PThemeEnum;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;

	public ngOnInit() : void {
		this.initFormGroup();
	}

	/**
	 * Initialize the formGroup for this component
	 */
	public initFormGroup() : void {
		if (this.formGroup) { this.formGroup = null; }

		const newFormGroup = this.pFormsService.group({});

		this.pFormsService.addArray(newFormGroup, 'shiftModels', []);
		// eslint-disable-next-line @typescript-eslint/ban-types
		const formArray = newFormGroup.get('shiftModels') as UntypedFormArray;

		for (const shiftModel of this.shiftModelsForList.iterable()) {
			const formGroupForShiftModel = this.pFormsService.group({});

			this.pFormsService.addControl(formGroupForShiftModel, 'id',
				{
					value: shiftModel.id,
					disabled: false,
				},
			);
			this.pFormsService.addControl(formGroupForShiftModel, 'name',
				{
					value: shiftModel.name,
					disabled: false,
				},
			);
			this.pFormsService.addControl(formGroupForShiftModel, 'color',
				{
					value: shiftModel.color,
					disabled: false,
				},
			);
			this.pFormsService.addControl(formGroupForShiftModel, 'freeclimberArticleId',
				{
					value: shiftModel.freeclimberArticleId ?? undefined,
					disabled: false,
				}, [
					this.validators.freeclimberArticleId(PApiPrimitiveTypes.string),
				], (value : string) => {
					if (!value || value === '0') {
						shiftModel.freeclimberArticleId = null;
						return;
					}
					shiftModel.freeclimberArticleId = +value;
				},
			);

			formArray.push(formGroupForShiftModel);
		}
		this.console.log('newFormGroup', newFormGroup.value);
		this.formGroup = newFormGroup;
	}

	// eslint-disable-next-line @typescript-eslint/ban-types
	private get shiftModelsFormArray() : UntypedFormArray | null {
		if (!this.formGroup) return null;
		// eslint-disable-next-line @typescript-eslint/ban-types
		return this.formGroup.get('shiftModels') as UntypedFormArray;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getFormGroup(shiftModelId : Id) : PFormGroup | null {
		if (!this.shiftModelsFormArray) return null;
		return this.shiftModelsFormArray.controls.find((control : AbstractControl) => {
			const id = control.get('id');
			if (!id) throw new Error(`Can not get value of 'id'.`);
			return (id.value as Id).equals(shiftModelId);
		}) as PFormGroup;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get hasShiftModels() : boolean {
		return !!this.shiftModelsForList.length;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get shiftModelsForList() : SchedulingApiShiftModels {
		return this.shiftModels!.filterBy(shiftModel => shiftModel.isCourse);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get amountOfShiftModelsWithArticleId() : number {
		return this.shiftModelsForList.filterBy(shiftModel => !!shiftModel.freeclimberArticleId).length;
	}
}
