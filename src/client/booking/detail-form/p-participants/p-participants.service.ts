import { Injectable } from '@angular/core';
import { FormArray, FormGroup, UntypedFormArray } from '@angular/forms';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PFormGroup } from '@plano/client/shared/p-forms/p-form-control';
import { PShiftmodelTariffService } from '@plano/client/shared/p-forms/p-shiftmodel-tariff.service';
import { RightsService } from '@plano/shared/api';
import { SchedulingApiShiftModelCourseTariff } from '@plano/shared/api';
import { SchedulingApiBooking, SchedulingApiBookingParticipant } from '@plano/shared/api';
import { SchedulingApiShiftModelCourseTariffs } from '@plano/shared/api';
import { Years} from '@plano/shared/api/base/generated-types.ag';
import { PApiPrimitiveTypes, Date } from '@plano/shared/api/base/generated-types.ag';
import { Id } from '@plano/shared/api/base/id';
import { AsyncValidatorsService } from '@plano/shared/core/async-validators.service';
import { ValidatorsService } from '@plano/shared/core/validators.service';
import { assumeDefinedToGetStrictNullChecksRunning, assumeNonNull } from '../../../../shared/core/null-type-utils';
import { LocalizePipe } from '../../../../shared/core/pipe/localize.pipe';
import { PValidatorObject, PPossibleErrorNames } from '../../../../shared/core/validators.types';
import { PMomentService } from '../../../shared/p-moment.service';
import { PBookingFormService } from '../../booking-form.service';

@Injectable()
export class PParticipantsService {
	constructor(
		private pFormsService : PFormsService,
		private validators : ValidatorsService,
		private asyncValidators : AsyncValidatorsService,
		private pShiftmodelTariffService : PShiftmodelTariffService,
		private rightsService : RightsService,
		private pBookingFormService : PBookingFormService,
		private pMomentService : PMomentService,
		private localizePipe : LocalizePipe,
	) {
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public initParticipant(
		booking : SchedulingApiBooking,
		participant : SchedulingApiBookingParticipant | null,
		array : FormArray<FormGroup>,
	) : void {
		assumeNonNull(participant);
		const formGroup = this.getParticipantFormGroup(booking, participant);
		array.push(formGroup);
		array.updateValueAndValidity();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getParticipantFormGroup(
		booking : SchedulingApiBooking,
		participant : SchedulingApiBookingParticipant,
	) : FormGroup {
		const tempFormGroup = this.pFormsService.group({});
		this.pFormsService.addControl(tempFormGroup, 'reference',
			{
				value: participant,
				disabled: false,
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'id',
			{
				value: participant.id,
				disabled: false,
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'isBookingPerson',
			{
				value: participant.isBookingPerson,
				disabled: false,
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'firstName',
			{
				value: participant.firstName,
				disabled: false,
			},
			[
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					// FIXME: PLANO-15096
					// HACK: PLANO-13217
					if (!participant.rawData) return null;

					if (participant.isBookingPerson) return null;
					return this.validators.required(participant.attributeInfoFirstName.primitiveType).fn(control);
				}}),
			],
			(value : string) => {
				// HACK: PLANO-13217
				if (!participant.rawData) return null;

				participant.firstName = value;
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'lastName',
			{
				value: participant.lastName,
				disabled: false,
			},
			[
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					// FIXME: PLANO-15096
					// HACK: PLANO-13217
					if (!participant.rawData) return null;

					if (participant.isBookingPerson) return null;
					return this.validators.required(participant.attributeInfoLastName.primitiveType).fn(control);
				}}),
			],
			(value : string) => {
				// HACK: PLANO-13217
				if (!participant.rawData) return null;

				participant.lastName = value;
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'dateOfBirth',
			{
				value: participant.dateOfBirth,
				disabled: false,
			},
			[
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					// FIXME: PLANO-15096
					// HACK: PLANO-13217
					if (!participant.rawData) return null;

					if (participant.isBookingPerson) return null;
					return this.validators.required(PApiPrimitiveTypes.DateTime).fn(control);
				}}),
			],
			(value : number) => {
				// HACK: PLANO-13217
				if (!participant.rawData) return null;

				participant.dateOfBirth = value;
			},
		);
		this.pFormsService.addControl(tempFormGroup, 'email',
			{
				value: participant.email,
				disabled: false,
			},
			[
				this.validators.email(),
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					// FIXME: PLANO-15096
					// HACK: PLANO-13217
					if (!participant.rawData) return null;

					if (participant.isBookingPerson) return null;
					return this.validators.required(participant.attributeInfoEmail.primitiveType).fn(control);
				}}),
			],
			(value : string) => {
				// HACK: PLANO-13217
				if (!participant.rawData) return null;

				participant.email = value;
			},
			this.asyncValidators.emailValidAsync(),
		);
		this.pFormsService.addControl(tempFormGroup, 'tariffId',
			{
				value: participant.tariffId,
				disabled: false,
			},
			[
				new PValidatorObject({name: PPossibleErrorNames.REQUIRED, fn: (control) => {
					// FIXME: PLANO-15096
					// HACK: PLANO-13217
					if (!participant.rawData) return null;

					// TODO: We need the same rules in participant > tariffId as in bookingPerson > tariffId as in overallTariffId
					if (!this.hasInBookingPluginVisibleTariff(booking)) return null;


					// NOTE: 	If this is an existing booking, we can not be sure if this was a free course at time of creation
					// 				If a tariff gets selected it can not be deselected anymore since its a radio-button.
					if (!booking.isNewItem()) return null;


					return this.validators.required(participant.attributeInfoTariffId.primitiveType).fn(control);
				}}),
				new PValidatorObject({name: PPossibleErrorNames.ID_DEFINED, fn: (control) => {
					// FIXME: PLANO-15096
					// HACK: PLANO-13217
					if (!participant.rawData) return null;

					// TODO: We need the same rules in participant > tariffId as in bookingPerson > tariffId as in overallTariffId
					if (!this.hasInBookingPluginVisibleTariff(booking)) return null;

					// NOTE: 	If this is an existing booking, we can not be sure if this was a free course at time of creation
					// 				If a tariff gets selected it can not be deselected anymore since its a radio-button.
					if (!booking.isNewItem()) return null;

					return this.validators.idDefined().fn(control);
				}}),
			],
			(value : Id) => {
				// HACK: PLANO-13217
				if (!participant.rawData) return null;

				participant.tariffId = value;
			},
		);

		this.pFormsService.addControl(tempFormGroup, 'attended',
			{
				value: participant.attended,
				disabled: false,
			},
			[],
			(value : boolean) => {
				participant.attended = value;
			},
		);

		this.pFormsService.addControl(tempFormGroup, 'isFreeCourse',
			{
				value: this.isFreeCourse(booking),
				disabled: false,
			},
		);

		this.initCourseTariffs(tempFormGroup, booking, participant, participant.tariffId);

		this.pBookingFormService.initFormControlAdditionalFieldValue(
			tempFormGroup,
			participant,
			participant,
			booking.model.courseTariffs,
		);

		return tempFormGroup;
	}

	private hasInBookingPluginVisibleTariff(
		booking : SchedulingApiBooking | undefined,
	) : boolean | undefined {
		if (!booking) return undefined;
		return this.pShiftmodelTariffService.hasInBookingPluginVisibleTariff(booking.model.courseTariffs);
	}

	private isFreeCourse(booking : SchedulingApiBooking | null) : boolean | undefined {
		if (!booking) return undefined;
		return this.pShiftmodelTariffService.isFreeCourse(booking.model.courseTariffs, booking.model.coursePaymentMethods);
	}

	private isAvailableTariffForThisCourse(
		booking : SchedulingApiBooking,
		tariff : SchedulingApiShiftModelCourseTariff,
	) : boolean {
		const relevantDate = booking.firstShiftStart!;
		const from = tariff.forCourseDatesFrom;
		const until = tariff.forCourseDatesUntil;
		const negate = tariff.negateForCourseDatesInterval;

		const isInInterval = (
			(!from || relevantDate >= from) &&
			(!until || relevantDate < until)
		);

		return isInInterval === !negate;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public initCourseTariffs(
		tempFormGroup : PFormGroup,
		booking : SchedulingApiBooking,
		participant : SchedulingApiBookingParticipant | null,
		selectedTariffId : Id | null,
	) : void {
		// eslint-disable-next-line @typescript-eslint/ban-types
		const courseTariffsFormArray : UntypedFormArray = new UntypedFormArray([]);
		if (tempFormGroup.get('courseTariffs')?.value) {
			tempFormGroup.removeControl('courseTariffs', {emitEvent: false});
		}
		tempFormGroup.addControl('courseTariffs', courseTariffsFormArray);

		for (const tariff of booking.model.courseTariffs.iterableSortedBy([
			item => item.name,
			item => !this.isAvailableTariffForThisCourse(booking, item),
		])) {
			// eslint-disable-next-line sonarjs/no-collapsible-if
			if (!selectedTariffId?.equals(tariff.id)) {
				if (tariff.trashed) continue;
			}

			this.pShiftmodelTariffService.addTariff({
				formGroup: tempFormGroup,
				userCanWrite : this.rightsService.userCanWrite(booking.model)!,
				shiftModel : booking.model,
				modeIsEditShiftModel: false,
				item: tariff,
				booking: booking,
				participant: participant ?? null,
			});
		}
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public courseTariffsForList(booking : SchedulingApiBooking, tariffId : Id | null) : SchedulingApiShiftModelCourseTariffs {
		const courseTariffs = booking.model.courseTariffs;
		return courseTariffs.filterBy((courseTariff) => {
			if (!courseTariff.trashed) return true;
			if (tariffId !== null && tariffId.equals(courseTariff.id)) return true;
			return false;
		});
	}

	/** Should the age limit warning for participants be visible? */
	public showParticipantsMinAgeLimitWarning(booking : SchedulingApiBooking, age : Years) : boolean {
		const limit = booking.model.participantMinAge ?? null;
		if (limit === null) return false;
		if (limit > age) return true;
		return false;
	}

	/** Should the age limit warning for participants be visible? */
	public showParticipantsMaxAgeLimitWarning(booking : SchedulingApiBooking, age : Years) : boolean {
		const limit = booking.model.participantMaxAge ?? null;
		if (limit === null) return false;
		if (limit < age) return true;
		return false;
	}

	/** Should the min age limit warning for a specific participant be visible? */
	public showParticipantMinAgeLimitWarning(booking : SchedulingApiBooking, dateOfBirth : Date) : boolean {
		const minAge = booking.model.participantMinAge;
		if (booking.firstShiftStart === null) return false;
		return this.dateOfBirthReachedMinAgeLimit(dateOfBirth, booking.firstShiftStart, minAge);
	}

	/** Should the max age limit warning for a specific participant be visible? */
	public showParticipantMaxAgeLimitWarning(booking : SchedulingApiBooking, dateOfBirth : Date) : boolean {
		const maxAge = booking.model.participantMaxAge;
		if (booking.firstShiftStart === null) return false;
		return this.dateOfBirthReachedMaxAgeLimit(dateOfBirth, booking.firstShiftStart, maxAge);
	}

	/** Text for the age limit warning */
	public bookingPersonAgeLimitWarning(booking : SchedulingApiBooking) : string | null {
		if (booking.model.bookingPersonMinAge === null) return null;
		const params = {
			min: booking.model.bookingPersonMinAge.toString(),
		};

		const minAge = booking.model.attributeInfoBookingPersonMinAge.value;
		const referenceDate = booking.isNewItem() ? Date.now() : booking.dateOfBooking;
		if (!booking.dateOfBirth) return null;
		const showBookingPersonAgeLimitWarning = minAge ? this.dateOfBirthReachedMinAgeLimit(booking.dateOfBirth, referenceDate, minAge) : null;

		if (showBookingPersonAgeLimitWarning) return this.localizePipe.transform('Die Person sollte zum Buchungszeitpunkt mindestens ${min} Jahre alt sein.', params);
		return null;
	}

	/**
	 * Text for the age limit.
	 * Provide a participant if booking is not of kind `onlyWholeCourseBookable`
	 */
	public participantsAgeLimitWarning(booking : SchedulingApiBooking) : string | null {
		assumeDefinedToGetStrictNullChecksRunning(booking.ageMin, 'booking.ageMin');
		assumeDefinedToGetStrictNullChecksRunning(booking.ageMax, 'booking.ageMax');
		const hasMinLimitWarning = this.showParticipantsMinAgeLimitWarning(booking, booking.ageMin);
		const hasMaxLimitWarning = this.showParticipantsMaxAgeLimitWarning(booking, booking.ageMax);

		if (booking.model.participantMinAge === null) return null;
		if (booking.model.participantMaxAge === null) return null;
		const params = {
			min: booking.model.participantMinAge.toString(),
			max: booking.model.participantMaxAge.toString(),
		};

		if (!hasMinLimitWarning && !hasMaxLimitWarning) return null;

		if (hasMinLimitWarning) {
			if (hasMaxLimitWarning) return this.localizePipe.transform('Die Personen sollten mindestens ${min} und höchstens ${max} Jahre alt sein (zum Datum des gebuchten Angebots).', params);
			return this.localizePipe.transform('Die Personen sollten mindestens ${min} Jahre alt sein (zum Datum des gebuchten Angebots).', params);
		}
		return this.localizePipe.transform('Die Personen sollten höchstens ${max} Jahre alt sein (zum Datum des gebuchten Angebots).', params);
	}

	/**
	 * Calculate if the date of birth is above the limit
	 * @param dateOfBirth The timestamp that should be checked (e.g. birthday of a booking person)
	 * @param referenceDate the timestamp that should be checked against (date of booking)
	 * @param limit How old a person should be at the time of `referenceDate` (e.g. 18)
	 */
	public dateOfBirthReachedMinAgeLimit(
		dateOfBirth : Date,
		referenceDate : Date,
		limit : Years | null,
	) : boolean {
		if (limit === null) return false;
		if (!referenceDate) return false;
		const participantMoment = this.pMomentService.m(dateOfBirth);
		const age = this.pMomentService.m(referenceDate).diff(participantMoment, 'years');
		return age < limit;
	}

	/**
	 * Calculate if the date of birth is above the limit
	 * @param dateOfBirth The timestamp that should be checked (e.g. birthday of a booking person)
	 * @param referenceDate the timestamp that should be checked against (date of booking)
	 * @param limit How old a person should be at the time of `referenceDate` (e.g. 18)
	 */
	public dateOfBirthReachedMaxAgeLimit(
		dateOfBirth : Date,
		referenceDate : Date,
		limit : Years | null,
	) : boolean {
		if (limit === null) return false;
		if (!referenceDate) return false;
		const participantMoment = this.pMomentService.m(dateOfBirth);
		const age = this.pMomentService.m(referenceDate).diff(participantMoment, 'years');
		return age > limit;
	}

	/** Should the participants age limit warning be visible? */
	public participantAgeLimitWarning(booking : SchedulingApiBooking, dateOfBirth : Date) : string | null {
		const hasMinLimitWarning = this.showParticipantMinAgeLimitWarning(booking, dateOfBirth);
		const hasMaxLimitWarning = this.showParticipantMaxAgeLimitWarning(booking, dateOfBirth);

		if (!hasMinLimitWarning && !hasMaxLimitWarning) return null;

		assumeDefinedToGetStrictNullChecksRunning(booking.model.participantMinAge, 'booking.model.participantMinAge');
		assumeDefinedToGetStrictNullChecksRunning(booking.model.participantMaxAge, 'booking.model.participantMaxAge');
		const params = {
			min: booking.model.participantMinAge.toString(),
			max: booking.model.participantMaxAge.toString(),
		};

		if (hasMinLimitWarning) {
			if (hasMaxLimitWarning) return this.localizePipe.transform('Die Person sollte mindestens ${min} und höchstens ${max} Jahre alt sein (zum Datum des gebuchten Angebots).', params);
			return this.localizePipe.transform('Die Person sollte mindestens ${min} Jahre alt sein (zum Datum des gebuchten Angebots).', params);
		}
		return this.localizePipe.transform('Die Person sollte höchstens ${max} Jahre alt sein (zum Datum des gebuchten Angebots).', params);
	}
}
