import { Component, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { Input } from '@angular/core';
import { UntypedFormArray } from '@angular/forms';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiShiftModel } from '@plano/shared/api';
import { SchedulingApiBooking } from '@plano/shared/api';
import { SchedulingApiShiftModelCourseTariff } from '@plano/shared/api';
import { SchedulingApiShiftModelCourseTariffFee } from '@plano/shared/api';
import { PApiPrimitiveTypes } from '@plano/shared/api/base/generated-types.ag';
import { Config } from '@plano/shared/core/config';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../shared/core/null-type-utils';
import { ValidatorsService } from '../../../../shared/core/validators.service';
import { EditableControlInterface } from '../../p-editable/editable/editable.directive';
import { SectionWhitespace } from '../../page/section/section.component';
import { PFormGroup } from '../p-form-control';
import { PShiftmodelTariffService } from '../p-shiftmodel-tariff.service';

@Component({
	selector: 'p-tariff-form[formGroup]',
	templateUrl: './p-tariff-form.component.html',
	styleUrls: ['./p-tariff-form.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PTariffFormComponent {
	@Input() public formGroup ! : PFormGroup;
	@Input() public shiftModel : SchedulingApiShiftModel | null = null;
	@Input() public booking : SchedulingApiBooking | null = null;
	@Input() public api : EditableControlInterface['api'] = null;

	@Output() public dismissFeeBox : EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(
		private rightsService : RightsService,
		public pShiftmodelTariffService : PShiftmodelTariffService,
		public pFormsService : PFormsService,
		private validators : ValidatorsService,
	) {
	}

	public Config = Config;
	public PlanoFaIconPool = PlanoFaIconPool;
	public PApiPrimitiveTypes = PApiPrimitiveTypes;
	public SectionWhitespace = SectionWhitespace;

	/**
	 * Check if user can edit this shift
	 */
	public get userCanWrite() : boolean | null {
		if (this.shiftModel === null) return null;
		return this.rightsService.userCanWrite(this.shiftModel);
	}

	/**
	 * Is this the 'Per Person Fee'?
	 */
	public isFancyFee(fee : SchedulingApiShiftModelCourseTariffFee) : boolean {
		// eslint-disable-next-line @typescript-eslint/ban-types
		const fancyFee = this.pShiftmodelTariffService.getFancyFeeFormGroup(this.formGroup.get('fees') as UntypedFormArray);
		if (!fancyFee) return false;
		const fancyFeeControl = fancyFee.get('reference');
		assumeNonNull(fancyFeeControl);
		if (fancyFeeControl.value !== fee) return false;
		return true;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public toggleDisabledStateOfAdditionalFieldLabel(checkboxValue : boolean) : void {
		if (checkboxValue) {
			this.formGroup.get('additionalFieldLabel')!.enable();
			this.formGroup.get('additionalFieldLabel')!.setValidators([
				this.validators.maxLength(30, PApiPrimitiveTypes.string).fn,
				this.validators.required(PApiPrimitiveTypes.string).fn,
			]);
		} else {
			this.formGroup.get('additionalFieldLabel')!.setValue('');
			this.formGroup.get('additionalFieldLabel')!.disable();
			this.formGroup.get('additionalFieldLabel')!.setValidators([
				this.validators.maxLength(30, PApiPrimitiveTypes.string).fn,
			]);
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public onClickAddTariffFee() : void {
		assumeDefinedToGetStrictNullChecksRunning(this.userCanWrite, 'this.userCanWrite', 'can not add tariff id userCanWrite is still unclear');
		this.pShiftmodelTariffService.addTariffFee({
			tariffFormGroup: this.formGroup,
			userCanWrite: this.userCanWrite,
			modeIsEditShiftModel: !this.booking && !!this.shiftModel && !this.shiftModel.isNewItem(),
			shiftModel: this.shiftModel,
			tariff: this.formGroup.get('reference')!.value as SchedulingApiShiftModelCourseTariff,
			booking: this.booking,
		});
	}
}
