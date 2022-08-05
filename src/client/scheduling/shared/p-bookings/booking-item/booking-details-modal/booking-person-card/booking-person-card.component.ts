import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';
import { SchedulingApiBookingParticipant } from '@plano/shared/api';
import { SchedulingApiBooking } from '@plano/shared/api';
import { assumeDefinedToGetStrictNullChecksRunning } from '../../../../../../../shared/core/null-type-utils';
import { PParticipantsService } from '../../../../../../booking/detail-form/p-participants/p-participants.service';
import { PThemeEnum } from '../../../../../../shared/bootstrap-styles.enum';

@Component({
	selector: 'p-booking-person-card[booking]',
	templateUrl: './booking-person-card.component.html',
	styleUrls: ['./booking-person-card.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
})

export class PBookingPersonCardComponent {
	@Input() public booking ! : SchedulingApiBooking;
	@Input() public participant : SchedulingApiBookingParticipant | null = null;
	@Input() public card : boolean = true;
	@Output() public onClickRemove : EventEmitter<SchedulingApiBookingParticipant> = new EventEmitter();
	@Output() public onClickEdit : EventEmitter<SchedulingApiBookingParticipant> = new EventEmitter();

	constructor(
		private pParticipantsService : PParticipantsService,
	) {}

	public PThemeEnum = PThemeEnum;

	/**
	 * Check if main data like fistName and lastName are set
	 */
	public get hasHeadlineData() : boolean {
		return !!this.firstName || !!this.lastName;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get firstName() : string {
		if (!this.participant) return this.booking.firstName;
		if (this.participant.isBookingPerson && !this.participant.firstName) {
			return this.booking.firstName;
		}
		return this.participant.firstName;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get lastName() : string {
		if (!this.participant) return this.booking.lastName;
		if (this.participant.isBookingPerson && !this.participant.lastName) {
			return this.booking.lastName;
		}
		return this.participant.lastName;
	}

	// eslint-disable-next-line jsdoc/require-jsdoc
	public get email() : string {
		if (!this.participant) return this.booking.email;
		if (this.participant.isBookingPerson && !this.participant.email) return this.booking.email;
		return this.participant.email;
	}

	/**
	 * Check if main data like birth date, email etc. is set
	 */
	public hasAdvancedData(person : SchedulingApiBooking | SchedulingApiBookingParticipant) : boolean {
		if (this.email) return true;
		if (person instanceof SchedulingApiBooking) {
			if (person.company) return true;
			if (person.phoneMobile) return true;
			if (person.phoneLandline) return true;
			if (person.email) return true;
		}
		return false;
	}

	/**
	 * Name of the tariff.
	 */
	public get tariffName() : string | null {
		if (this.participant && this.participant.tariffId !== null) {
			assumeDefinedToGetStrictNullChecksRunning(this.participant.tariffId, 'participant.tariffId');
			return this.booking.model.courseTariffs.get(this.participant.tariffId)!.name;
		}
		for (const item of this.booking.participants.iterable()) {
			assumeDefinedToGetStrictNullChecksRunning(item.tariffId, 'item.tariffId');
			if (item.isBookingPerson && this.booking.model.courseTariffs.get(item.tariffId)) {
				return this.booking.model.courseTariffs.get(item.tariffId)!.name;
			}
		}
		return null;
	}

	/**
	 * Fee of the tariff.
	 */
	public get tariffFee() : number | null {
		if (this.participant?.tariffId) {
			assumeDefinedToGetStrictNullChecksRunning(this.participant.tariffId, 'participant!.tariffId');
			return this.booking.model.courseTariffs.get(this.participant.tariffId)!.fees.get(0)!.fee;
		}
		for (const item of this.booking.participants.iterable()) {
			if (item.isBookingPerson) {
				assumeDefinedToGetStrictNullChecksRunning(item.tariffId, 'item.tariffId');
				return this.booking.model.courseTariffs.get(item.tariffId)!.fees.get(0)!.fee;
			}
		}
		return null;
	}

	/** Should the booking person min warning be visible? */
	public get bookingPersonAgeLimitWarning() : ReturnType<PParticipantsService['bookingPersonAgeLimitWarning']> {
		return this.pParticipantsService.bookingPersonAgeLimitWarning(this.booking);
	}
}
