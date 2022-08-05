import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { MeService } from '@plano/shared/api';
import { AccountApiService } from '@plano/shared/api';
import { LocalizePipe } from '@plano/shared/core/pipe/localize.pipe';
import { PCurrencyPipe } from '@plano/shared/core/pipe/p-currency.pipe';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { PApiPrimitiveTypes } from '../../../shared/api/base/generated-types.ag';
import { PFormControl } from '../p-forms/p-form-control';

@Injectable()
export class PAccountFormService {
	constructor(
		private meService : MeService,
		private validators : ValidatorsService,
		private api : AccountApiService,
		private pFormsService : PFormsService,
		private currencyPipe : PCurrencyPipe,
		private localize : LocalizePipe,
	) {
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getPAccountFormGroup(api : AccountApiService) : FormGroup {
		return this.pFormsService.group({
			location : this.getLocationFormGroup(),
			billing: this.getBillingFormGroup(api),
			account : this.getAccountFormGroup(),
			payment : this.getPaymentFormGroup(),
			discountCode : new PFormControl({
				formState: {
					value : this.api.data.discountCode,
					disabled: false,
				},
			}),
		});
	}

	private getLocationFormGroup() : FormGroup {
		return this.pFormsService.group({
		});
	}
	private getBillingFormGroup(api : AccountApiService) : FormGroup {
		const result = this.pFormsService.group({
		});

		// bill country has influence to the validation of vat. Therefore we need a 'cross-validation-update' here.
		// no need to google cross-validation-update. its not a real thing. i just invented it. lol.
		const billCountryFormControl = this.pFormsService.getByAI(result, api.data.billing.attributeInfoCountry);
		const vatFormControl = this.pFormsService.getByAI(result, api.data.billing.attributeInfoVatNumber);
		result.controls[api.data.billing.attributeInfoCountry.id]!.valueChanges.subscribe((_value : AccountApiService['data']['billing']['attributeInfoCountry']['value']) => {
			if (api.data.billing.attributeInfoVatNumber.canEdit) {
				vatFormControl.enable();
			} else {
				vatFormControl.disable();
			}
			vatFormControl.updateValueAndValidity();
		});

		// same as above. but now for billAddressIsLocationAddressFormControl > attributeInfoBillCountry.canEdit
		const billAddressIsLocationAddressFormControl = this.pFormsService.getByAI(result, api.data.billing.attributeInfoBillAddressIsLocationAddress);
		billAddressIsLocationAddressFormControl.valueChanges.subscribe((_value) => {
			if (api.data.billing.attributeInfoCountry.canEdit) {
				billCountryFormControl.enable();
			} else {
				billCountryFormControl.disable();
			}
			vatFormControl.updateValueAndValidity();
		});

		return result;
	}

	private getAccountFormGroup() : FormGroup {
		const result = this.pFormsService.group({
			customerId : new PFormControl({
				formState: {
					value : this.api.data.customerId,
					disabled : !this.api.data.attributeInfoCustomerId.canEdit,
				},
			}),
		});

		this.pFormsService.addControl(result, 'accountingPeriodStartDay',
			{
				value : this.api.data.accountingPeriodStartDay,
				disabled : !this.api.data.attributeInfoAccountingPeriodStartDay.canEdit,
			},
			[
				this.validators.required(PApiPrimitiveTypes.Days),
				this.validators.min(1, true, this.api.data.attributeInfoAccountingPeriodStartDay.primitiveType),
				this.validators.max(28, true, this.api.data.attributeInfoAccountingPeriodStartDay.primitiveType),
				this.validators.maxDecimalPlacesCount(0, PApiPrimitiveTypes.Days),
			],
			(value : string) => {
				const number = +value;
				if (!Number.isNaN(number)) {
					this.api.data.accountingPeriodStartDay = number;
				}
			},
		);

		return result;
	}

	private getPaymentFormGroup() : FormGroup {
		const formGroup = this.pFormsService.group({});
		formGroup.addControl('sepaAgreement', new PFormControl({
			formState: {
				value : !(this.meService.isLoaded() && this.meService.data.testAccountDeadline),
				disabled : false,
			},
		}));

		return formGroup;
	}


}
