import { Component, Input, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { BookingsService } from '@plano/client/scheduling/shared/p-bookings/bookings.service';
import { PFormsService } from '@plano/client/service/p-forms.service';
import { PThemeEnum } from '@plano/client/shared/bootstrap-styles.enum';
import { PInputDateTypes } from '@plano/client/shared/p-forms/p-input-date/p-input-date.component';
import { PShiftmodelTariffService } from '@plano/client/shared/p-forms/p-shiftmodel-tariff.service';
import { SchedulingApiBookingParticipant } from '@plano/shared/api';
import { SchedulingApiService } from '@plano/shared/api';
import { SchedulingApiBooking } from '@plano/shared/api';
import { Id } from '@plano/shared/api/base/id';
import { Config } from '@plano/shared/core/config';
import { assumeNonNull } from '@plano/shared/core/null-type-utils';
import { PlanoFaIconPool } from '@plano/shared/core/plano-fa-icon-pool.enum';
import { PParticipantsService } from './p-participants.service';
import { PBookingFormService } from '../../booking-form.service';

// type ParticipantForm = FormGroupFromSchedulingApiItem<
// 	SchedulingApiBookingParticipant,
// 	'id' | 'isBookingPerson' | 'firstName' | 'lastName' | 'email'
// >;
type ParticipantForm = FormGroup<{
	isBookingPerson : AbstractControl<SchedulingApiBookingParticipant['isBookingPerson'] | null>,
	firstName : AbstractControl<SchedulingApiBookingParticipant['firstName'] | null>,
	id : AbstractControl<SchedulingApiBookingParticipant['id'] | null>,
	lastName : AbstractControl<SchedulingApiBookingParticipant['lastName'] | null>,
	email : AbstractControl<SchedulingApiBookingParticipant['email'] | null>
}>;

@Component({
	selector: 'p-participants[booking][array]',
	templateUrl: './p-participants.component.html',
	styleUrls: ['./p-participants.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})
export class PParticipantsComponent {
	@Input() public booking ! : SchedulingApiBooking;
	@Input() public array ! : FormArray<FormGroup>;
	@Output() public onModalClosed : EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() public onModalDismissed : EventEmitter<boolean> = new EventEmitter<boolean>();
	public CONFIG : typeof Config = Config;

	constructor(
		public api : SchedulingApiService,
		public pParticipantsService : PParticipantsService,
		private changeDetectorRef : ChangeDetectorRef,
		private pBookingFormService : PBookingFormService,
		public bookingsService : BookingsService,
		private pShiftmodelTariffService : PShiftmodelTariffService,
		public pFormsService : PFormsService,
	) {
	}

	public PInputDateTypes = PInputDateTypes;
	public PThemeEnum = PThemeEnum;
	public PlanoFaIconPool = PlanoFaIconPool;

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public addParticipant() : void {
		const participant = this.booking.participants.createNewItem();
		this.pParticipantsService.initParticipant(this.booking, participant, this.array);
		this.changeDetectorRef.detectChanges();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public dismissParticipant(formGroup : PParticipantsComponent['latestFormGroup']) : void {
		const INDEX = this.array.value.findIndex((item : SchedulingApiBookingParticipant) => item.id.equals(formGroup.value.id));
		this.booking.participants.removeItem(formGroup.value.id);
		if (INDEX < 0) return;
		this.array.removeAt(INDEX);
		this.onModalDismissed.emit();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get latestFormGroup() : FormGroup {
		return this.array.controls[this.array.controls.length - 1];
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public removeParticipant(i : number | null, participantId ?: Id) : void {
		assumeNonNull(i, 'i');
		this.array.removeAt(i);
		this.array.updateValueAndValidity();

		const participant = this.booking.participants.get(participantId!);
		if (participant && !participant.isNewItem()) {
			this.booking.participants.removeItem(participant);
		} else {
			this.booking.participants.remove(i);
		}

		if (this.isActiveEditable) {
			this.booking.saveDetailed();
		}
		this.changeDetectorRef.detectChanges();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public get isActiveEditable() : boolean {
		return !this.booking.isNewItem();
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public deleteParticipantDisabled(formGroup : ParticipantForm) : boolean {
		if ((formGroup.get('reference')!.value as SchedulingApiBookingParticipant).isNewItem()) return false;
		if (!this.array.valid && formGroup.get('id')!.value !== null) return true;
		if (!this.booking.model.onlyWholeCourseBookable) {
			for (const participant of this.booking.participants.iterable()) {
				if (participant.isBookingPerson) return false;
			}
			if (this.array.length < 2) return true;
		}

		return false;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public firstName(formGroup : ParticipantForm) : string | null {
		if (formGroup.get('isBookingPerson')?.value) return this.booking.firstName;
		return formGroup.get('firstName')?.value ?? null;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public lastName(formGroup : ParticipantForm) : string | null {
		if (formGroup.get('isBookingPerson')?.value) return this.booking.lastName;
		return formGroup.get('lastName')?.value ?? null;
	}
	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public email(formGroup : ParticipantForm) : string | null {
		if (formGroup.get('isBookingPerson')?.value) return this.booking.email;
		return formGroup.get('email')?.value ?? null;
	}

	/**
	 * Name of the tariff.
	 */
	public tariffName(tariffId : Id | null) : string | null {
		if (tariffId === null) return null;
		return this.booking.model.courseTariffs.get(tariffId)!.name;
	}

	/**
	 * Fee of the tariff.
	 */
	public tariffFee(tariffId : Id) : number {
		return +this.booking.model.courseTariffs.get(tariffId)!.fees.get(0)!.fee;
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public getAdditionalFieldLabel(id : Id) : string | null {
		return this.pBookingFormService.getAdditionalFieldLabel(id, this.booking);
	}

	/* eslint-disable-next-line jsdoc/require-jsdoc */
	public tariffNotAvailableThatTime(
		participant : SchedulingApiBookingParticipant,
	) : boolean | undefined {
		if (!participant.tariffId) return undefined;

		const tariff = this.booking.model.courseTariffs.get(participant.tariffId);

		let start = this.booking.firstShiftStart;
		if (!start && this.booking.courseSelector) start = this.booking.courseSelector.start;
		if (!start) return undefined;

		return this.pShiftmodelTariffService.tariffIsAvailableAtDate(tariff, start) === false;
	}

	/** Text for the age limit warning */
	public get bookingPersonAgeLimitWarning() : ReturnType<PParticipantsService['bookingPersonAgeLimitWarning']> {
		return this.pParticipantsService.bookingPersonAgeLimitWarning(this.booking);
	}

	/** Text for the age limit warning */
	public showParticipantMinAgeLimitWarning(dateOfBirth : SchedulingApiBookingParticipant['dateOfBirth']) : boolean {
		return this.pParticipantsService.showParticipantMinAgeLimitWarning(this.booking, dateOfBirth);
	}

	/** Text for the age limit warning */
	public showParticipantMaxAgeLimitWarning(dateOfBirth : SchedulingApiBookingParticipant['dateOfBirth']) : boolean {
		return this.pParticipantsService.showParticipantMaxAgeLimitWarning(this.booking, dateOfBirth);
	}

	/** Text for the age limit warning */
	public ageLimitWarning(dateOfBirth : SchedulingApiBookingParticipant['dateOfBirth']) : string | null {
		return this.pParticipantsService.participantAgeLimitWarning(this.booking, dateOfBirth);
	}
}
