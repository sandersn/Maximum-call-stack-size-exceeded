
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Id } from '@plano/shared/api/base/id';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../shared/core/null-type-utils';
import { PValidatorObject, PPossibleErrorNames } from '../../shared/core/validators.types';
import { SchedulingApiBooking, SchedulingApiBookingParticipant } from '../scheduling/shared/api/scheduling-api-booking.service';
import { SchedulingApiShiftModelCourseTariffs } from '../scheduling/shared/api/scheduling-api-shiftmodel-course.service';
import { PFormsService } from '../service/p-forms.service';

@Injectable()
export class PBookingFormService {
	constructor(
		private pFormsService : PFormsService,
		private validators : ValidatorsService,
	) {
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public initFormControlAdditionalFieldValue(
		tempFormGroup : FormGroup,
		person : SchedulingApiBooking | SchedulingApiBookingParticipant,
		objWthTariffId : {tariffId ?: Id | null, overallTariffId ?: Id | null} | null,
		tariffs : SchedulingApiShiftModelCourseTariffs,
	) : void {
		// Dear future-me …i am sorry for this mess :/
		this.pFormsService.addControl(tempFormGroup, 'additionalFieldValue',
			{
				value: person.additionalFieldValue,
				disabled: false,
			},
			[
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					if (!objWthTariffId) return null;
					if (objWthTariffId.tariffId && person instanceof SchedulingApiBooking) return null;
					if (objWthTariffId.overallTariffId && person instanceof SchedulingApiBookingParticipant) return null;

					const TARIFF_ID = objWthTariffId.tariffId ?? objWthTariffId.overallTariffId;
					if (!TARIFF_ID) return null;

					const tariff = tariffs.get(TARIFF_ID);
					if (!tariff) throw new Error('Could not get tariff');
					const LABEL = tariff.additionalFieldLabel;
					if (!LABEL) return null;

					const REQUIRED_ERRORS = this.validators.required(person.attributeInfoAdditionalFieldValue.primitiveType).fn(control);
					if (!!REQUIRED_ERRORS) return REQUIRED_ERRORS;

					return null;
				}}),
			],
			(value : string) => {
				// eslint-disable-next-line unicorn/prefer-logical-operator-over-ternary
				person.additionalFieldValue = value ? value : '';
			},
		);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getAdditionalFieldLabel(tariffId : Id | null, booking : SchedulingApiBooking) : string | null {
		if (tariffId === null) {
			// This can happen for courses which where free at the time of booking.
			// In the past this caused a throw. See PLANO-47391 for more info.
			return null;
		}
		assumeDefinedToGetStrictNullChecksRunning(booking.model, 'booking.model');
		const tariff = booking.model.courseTariffs.get(tariffId);
		if (!tariff) throw new Error(`Could not load tariff ${tariffId.toString()} in ${booking.model.courseTariffs.length} tariffs [PLANO-FE-VJ]`);
		return tariff.additionalFieldLabel;
	}

}
